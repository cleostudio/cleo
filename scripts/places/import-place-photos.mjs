#!/usr/bin/env node
/**
 * Curated place photographs → optimized local renditions.
 *
 *   node scripts/places/import-place-photos.mjs
 *   node scripts/places/import-place-photos.mjs --force
 *   node scripts/places/import-place-photos.mjs --only=paris,tokyo
 */

import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const WIDTHS = [640, 1280, 2048]
const ORIGINALS = join(root, '.place-originals')
const PUBLIC_PLACES = join(root, 'public/images/places')
const UA =
  'cleo-places-import/1.0 (https://github.com/cleostudio/cleo; knowledge portal photo import)'

const sourcesPath = join(root, 'scripts/places/place-photo-sources.json')
const outputPath = join(root, 'content/place-photos.json')
const targets = JSON.parse(
  readFileSync(join(root, 'scripts/places/place-targets.json'), 'utf8'),
)
const photoSources = existsSync(sourcesPath)
  ? JSON.parse(readFileSync(sourcesPath, 'utf8'))
  : {}
const existing = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, 'utf8'))
  : {}

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_PLACES, { recursive: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function downloadUrl(url, dest) {
  if (existsSync(dest) && readFileSync(dest).byteLength > 1000) {
    return readFileSync(dest)
  }
  let lastError = null
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: 'image/*' },
      signal: AbortSignal.timeout(60_000),
    })
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.byteLength < 1000) {
        throw new Error(`Download too small: ${buffer.byteLength} bytes`)
      }
      writeFileSync(dest, buffer)
      return buffer
    }
    lastError = new Error(`Download failed: HTTP ${res.status}`)
    if (![429, 500, 502, 503, 504].includes(res.status)) break
    await sleep(1500 * attempt)
  }
  throw lastError ?? new Error(`Download failed for ${url}`)
}

async function commonsThumbUrl(commonsTitle, sourceWidth, target) {
  if (!commonsTitle || !(sourceWidth > target)) return null

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    iiprop: 'url',
    iiurlwidth: String(target),
    prop: 'imageinfo',
    titles: commonsTitle,
  })

  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { 'user-agent': UA, accept: 'application/json' },
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const page = Object.values(data.query?.pages ?? {})[0]
    return page?.imageinfo?.[0]?.thumburl ?? null
  } catch {
    return null
  }
}

async function buildRenditions(slug, originalBuffer) {
  const dir = join(PUBLIC_PLACES, slug)
  mkdirSync(dir, { recursive: true })
  const meta = await sharp(originalBuffer).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  if (!(width > 0 && height > 0)) {
    throw new Error(`Invalid image dimensions for ${slug}`)
  }

  const renditions = []
  for (const targetWidth of WIDTHS) {
    const outPath = join(dir, `w${targetWidth}.jpg`)
    const out = await sharp(originalBuffer)
      .rotate()
      .resize({
        width: Math.min(targetWidth, width),
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({
        chromaSubsampling: '4:2:0',
        mozjpeg: true,
        quality: targetWidth >= 2048 ? 86 : 82,
      })
      .withMetadata({ orientation: undefined })
      .toBuffer()
    writeFileSync(outPath, out)
    renditions.push({
      width: targetWidth,
      src: `/images/places/${slug}/w${targetWidth}.jpg`,
      bytes: out.byteLength,
    })
  }

  return { width, height, renditions }
}

const onlyArg = process.argv.find((arg) => arg === '--only' || arg.startsWith('--only='))
const only = onlyArg
  ? (onlyArg.includes('=')
      ? onlyArg.slice('--only='.length)
      : process.argv[process.argv.indexOf('--only') + 1] || ''
    )
      .split(',')
      .filter(Boolean)
  : null
const force = process.argv.includes('--force')
const errors = []
const slugs = only ?? Object.keys(targets)
const photos = { ...existing }
let index = 0

for (const slug of slugs) {
  index++
  const target = targets[slug]
  const source = photoSources[slug]
  const label = `[${index}/${slugs.length}] ${slug}`
  if (!target) {
    errors.push(`${slug}: missing from place-targets.json`)
    continue
  }
  if (!source?.downloadUrl) {
    errors.push(`${slug}: missing curated source (run curate:place-photos)`)
    continue
  }

  const cacheKey = source.downloadUrl
  if (
    !force &&
    photos[slug]?.renditions?.length === 3 &&
    photos[slug]?.provenance?.includes(cacheKey.slice(0, 48))
  ) {
    console.log(`${label} skip (cached)`)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    await sleep(350)
    const originalPath = join(
      ORIGINALS,
      `commons-${slug}-${createHash('sha1').update(source.downloadUrl).digest('hex').slice(0, 12)}.bin`,
    )
    if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
      rmSync(originalPath)
    }
    const thumbUrl = await commonsThumbUrl(
      source.commonsTitle,
      source.width ?? 0,
      2560,
    )
    const original = await downloadUrl(thumbUrl ?? source.downloadUrl, originalPath)
    const checksum = createHash('sha256').update(original).digest('hex')
    const { width, height, renditions } = await buildRenditions(slug, original)
    const placeName = source.placeName || target.name
    const countryName = target.countryName

    photos[slug] = {
      featureName: placeName,
      alt: `${placeName} in ${countryName}`,
      caption: `${placeName}, ${countryName}`,
      photographer: source.photographer || 'Wikimedia Commons contributor',
      sourceUrl: source.sourceUrl,
      license: source.license,
      provenance: `Curated from Wikimedia Commons (${source.commonsTitle || 'file'}); source ${cacheKey}; imported locally with metadata stripped; originals kept outside the public tree.`,
      checksum,
      width,
      height,
      renditions,
    }
    console.log('ok')
  } catch (error) {
    console.log('FAIL')
    errors.push(`${slug}: ${error instanceof Error ? error.message : error}`)
  }
}

writeFileSync(outputPath, `${JSON.stringify(photos, null, 2)}\n`)

if (errors.length) {
  console.error('\nImport failures:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(`\nWrote content/place-photos.json (${Object.keys(photos).length} places)`)
console.log(`Renditions under public/images/places/`)
console.log(`Originals under .place-originals/ (keep gitignored)`)
