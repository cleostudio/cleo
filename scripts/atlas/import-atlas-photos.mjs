#!/usr/bin/env node
/**
 * Curated place photographs → optimized local atlas renditions.
 *
 * Prefer scripts/atlas/atlas-photo-sources.json (Wikimedia Commons curation).
 * Falls back to legacy Pexels IDs in content/atlas.content.json when needed.
 *
 * Import-time only (no account/API key required at runtime):
 * 1. Download the curated JPEG/PNG once
 * 2. Strip metadata, write mozjpeg 640 / 1024 / 1600px files under
 *    public/images/atlas/{slug}/
 * 3. Merge credits + checksum + rendition metadata into content/atlas.json
 *
 * The app serves those static files directly — never via a CDN account or
 * /_next/image. Originals stay in .atlas-originals/ (gitignored).
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
const WIDTHS = [640, 1024, 1600]
const ORIGINALS = join(root, '.atlas-originals')
const PUBLIC_ATLAS = join(root, 'public/images/atlas')
const UA = 'cleo-atlas-import/1.0 (https://github.com/cleostudio/cleo; knowledge portal photo import)'

const content = JSON.parse(
  readFileSync(join(root, 'content/atlas.content.json'), 'utf8'),
)
const sourcesPath = join(root, 'scripts/atlas/atlas-photo-sources.json')
const photoSources = existsSync(sourcesPath)
  ? JSON.parse(readFileSync(sourcesPath, 'utf8'))
  : {}

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_ATLAS, { recursive: true })

async function fetchPhotographer(pexelsId) {
  try {
    const res = await fetch(`https://www.pexels.com/photo/${pexelsId}/`, {
      headers: { 'user-agent': UA, accept: 'text/html' },
      signal: AbortSignal.timeout(12_000),
    })
    if (!res.ok) return 'Pexels contributor'
    const html = await res.text()
    const og =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      ) ??
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      )
    const title = og?.[1] ?? ''
    const by = title.match(/photo by\s+([^·|]+)/i)?.[1]?.trim()
    if (by) return by
    const name = title.split(/[·|]/)[0]?.trim()
    return name && name.length < 80 ? name : 'Pexels contributor'
  } catch {
    return 'Pexels contributor'
  }
}

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
    // Back off on rate limits / transient errors.
    if (![429, 500, 502, 503, 504].includes(res.status)) break
    await sleep(1500 * attempt)
  }
  throw lastError ?? new Error(`Download failed for ${url}`)
}

async function downloadPexels(pexelsId, dest) {
  const url = `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2000`
  return downloadUrl(url, dest)
}

async function buildRenditions(slug, originalBuffer) {
  const dir = join(PUBLIC_ATLAS, slug)
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
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .withMetadata({ orientation: undefined })
      .toBuffer()
    writeFileSync(outPath, out)
    renditions.push({
      width: targetWidth,
      src: `/images/atlas/${slug}/w${targetWidth}.jpg`,
      bytes: out.byteLength,
    })
  }

  return { width, height, renditions }
}

const atlasPath = join(root, 'content/atlas.json')
const atlas = existsSync(atlasPath)
  ? JSON.parse(readFileSync(atlasPath, 'utf8'))
  : {}
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
const slugs = only ?? Object.keys(content)
let index = 0

for (const slug of slugs) {
  index++
  const entry = content[slug]
  if (!entry) {
    errors.push(`${slug}: missing from atlas.content.json`)
    continue
  }
  const source = photoSources[slug]
  const label = `[${index}/${slugs.length}] ${slug}`
  const cacheKey = source?.downloadUrl || `pexels:${entry.pexelsId}`
  if (
    !force &&
    atlas[slug]?.photo?.renditions?.length === 3 &&
    atlas[slug]?.photo?.provenance?.includes(cacheKey.slice(0, 48))
  ) {
    console.log(`${label} skip (cached)`)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    // Be polite to Wikimedia / upstream CDNs.
    await sleep(350)
    let original
    let photoMeta
    if (source?.downloadUrl) {
      const originalPath = join(
        ORIGINALS,
        `commons-${slug}-${createHash('sha1').update(source.downloadUrl).digest('hex').slice(0, 12)}.bin`,
      )
      if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
        rmSync(originalPath)
      }
      original = await downloadUrl(source.downloadUrl, originalPath)
      const checksum = createHash('sha256').update(original).digest('hex')
      const { width, height, renditions } = await buildRenditions(slug, original)
      const placeName = source.placeName || entry.featuredPlaceName
      photoMeta = {
        placeName,
        alt: `${placeName} in ${entry.name}`,
        caption: `${placeName}, ${entry.name}`,
        photographer: source.photographer || 'Wikimedia Commons contributor',
        sourceUrl: source.sourceUrl,
        license: source.license,
        provenance: `Curated from Wikimedia Commons (${source.commonsTitle || 'file'}); source ${cacheKey}; imported locally with metadata stripped; originals kept outside the public tree.`,
        checksum,
        width,
        height,
        renditions,
      }
    } else {
      const originalPath = join(ORIGINALS, `${entry.pexelsId}.jpg`)
      if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
        rmSync(originalPath)
      }
      original = await downloadPexels(entry.pexelsId, originalPath)
      const checksum = createHash('sha256').update(original).digest('hex')
      const { width, height, renditions } = await buildRenditions(slug, original)
      const photographer = await fetchPhotographer(entry.pexelsId)
      const placeName = entry.featuredPlaceName
      photoMeta = {
        placeName,
        alt: `${placeName} in ${entry.name}`,
        caption: `${placeName}, ${entry.name}`,
        photographer,
        sourceUrl: `https://www.pexels.com/photo/${entry.pexelsId}/`,
        license: 'Pexels License',
        provenance: `Curated from Pexels photo ${entry.pexelsId}; imported locally with metadata stripped; originals kept outside the public tree.`,
        checksum,
        width,
        height,
        renditions,
      }
    }

    atlas[slug] = {
      slug: entry.slug,
      code: entry.code,
      name: entry.name,
      region: entry.region,
      subregion: entry.subregion,
      about: entry.about,
      facts: entry.facts,
      places: entry.places,
      sources: entry.sources,
      photo: photoMeta,
    }
    console.log('ok')
  } catch (error) {
    console.log('FAIL')
    errors.push(`${slug}: ${error instanceof Error ? error.message : error}`)
  }
}

if (errors.length) {
  writeFileSync(atlasPath, `${JSON.stringify(atlas, null, 2)}\n`)
  console.error('\nImport failures:\n' + errors.join('\n'))
  process.exit(1)
}

writeFileSync(atlasPath, `${JSON.stringify(atlas, null, 2)}\n`)
console.log(`\nWrote content/atlas.json (${Object.keys(atlas).length} countries)`)
console.log(`Renditions under public/images/atlas/`)
console.log(`Originals under .atlas-originals/ (keep gitignored)`)
