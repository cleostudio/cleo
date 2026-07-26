#!/usr/bin/env node
/**
 * NASA / agency imagery → optimized local Space renditions.
 *
 * Import-time only (no account/API key required at runtime):
 * 1. Download each curated JPEG once
 * 2. Strip metadata, write mozjpeg 640 / 1280 / 2048px files under
 *    public/images/space/{slug}/
 * 3. Write credits + checksum + rendition metadata into content/space-photos.json
 *
 * The app serves those static files directly — never via a CDN account or
 * /_next/image. Originals stay in .space-originals/ (gitignored).
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
const ORIGINALS = join(root, '.space-originals')
const PUBLIC_SPACE = join(root, 'public/images/space')
const sourcesPath = join(root, 'scripts/space/space-photo-sources.json')
const outputPath = join(root, 'content/space-photos.json')

const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
const existing = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, 'utf8'))
  : {}

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_SPACE, { recursive: true })

async function downloadOriginal(slug, url, dest) {
  if (existsSync(dest) && readFileSync(dest).byteLength > 1000) {
    return readFileSync(dest)
  }
  const res = await fetch(url, {
    headers: { 'user-agent': 'cleo-space-import/1.0', accept: 'image/*' },
    signal: AbortSignal.timeout(60_000),
  })
  if (!res.ok) {
    throw new Error(`Download failed for ${slug}: HTTP ${res.status}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.byteLength < 1000) {
    throw new Error(`Download too small for ${slug}: ${buffer.byteLength} bytes`)
  }
  writeFileSync(dest, buffer)
  return buffer
}

async function buildRenditions(slug, originalBuffer) {
  const dir = join(PUBLIC_SPACE, slug)
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
      // The rendition that carries zoomed detail gets the higher quality.
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
      src: `/images/space/${slug}/w${targetWidth}.jpg`,
      bytes: out.byteLength,
    })
  }

  return { width, height, renditions }
}

const only = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]?.split(',').filter(Boolean)
  : null
const force = process.argv.includes('--force')
const slugs = only ?? Object.keys(sources)
const photos = { ...existing }
const errors = []
let index = 0

for (const slug of slugs) {
  index++
  const source = sources[slug]
  const label = `[${index}/${slugs.length}] ${slug}`
  if (!source) {
    errors.push(`${slug}: missing from space-photo-sources.json`)
    continue
  }
  if (
    !force &&
    photos[slug]?.renditions?.length === 3 &&
    photos[slug]?.nasaId === source.nasaId
  ) {
    console.log(`${label} skip (cached)`)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    const originalPath = join(ORIGINALS, `${source.nasaId}.jpg`)
    if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
      rmSync(originalPath)
    }
    const original = await downloadOriginal(slug, source.downloadUrl, originalPath)
    const checksum = createHash('sha256').update(original).digest('hex')
    const { width, height, renditions } = await buildRenditions(slug, original)

    photos[slug] = {
      featureName: source.featureName,
      alt: `${source.featureName} — ${slug.replace(/-/g, ' ')}`,
      caption: `${source.featureName}`,
      photographer: source.credit,
      sourceUrl: source.sourceUrl,
      license: source.license,
      nasaId: source.nasaId,
      provenance: `Curated from NASA image ${source.nasaId}; imported locally with metadata stripped; originals kept outside the public tree.`,
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

console.log(`\nWrote content/space-photos.json (${Object.keys(photos).length} subjects)`)
console.log(`Renditions under public/images/space/`)
console.log(`Originals under .space-originals/ (keep gitignored)`)
