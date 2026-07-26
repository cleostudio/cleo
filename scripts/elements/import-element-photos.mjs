#!/usr/bin/env node
/**
 * NASA / agency imagery → optimized local Elements renditions.
 *
 * Import-time only (no account/API key required at runtime):
 * 1. Download each curated JPEG once
 * 2. Strip metadata, write mozjpeg 640 / 1280 / 2048px files under
 *    public/images/elements/{slug}/
 * 3. Write credits + checksum + rendition metadata into content/element-photos.json
 *
 * The app serves those static files directly — never via a CDN account or
 * /_next/image. Originals stay in .element-originals/ (gitignored).
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
const ORIGINALS = join(root, '.element-originals')
const PUBLIC_ELEMENTS = join(root, 'public/images/elements')
const sourcesPath = join(root, 'scripts/elements/element-photo-sources.json')
const outputPath = join(root, 'content/element-photos.json')

const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
const existing = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, 'utf8'))
  : {}

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_ELEMENTS, { recursive: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function downloadOriginal(slug, url, dest) {
  if (existsSync(dest) && readFileSync(dest).byteLength > 1000) {
    return readFileSync(dest)
  }

  let lastError = null
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(url, {
      headers: {
        'user-agent':
          'CleoElementsBot/1.0 (https://github.com/cleostudio/cleo; knowledge portal import)',
        accept: 'image/*',
      },
      signal: AbortSignal.timeout(90_000),
    })
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.byteLength < 1000) {
        throw new Error(`Download too small for ${slug}: ${buffer.byteLength} bytes`)
      }
      writeFileSync(dest, buffer)
      return buffer
    }
    lastError = new Error(`Download failed for ${slug}: HTTP ${res.status}`)
    if (res.status !== 429 && res.status < 500) break
    await sleep(1500 * attempt)
  }
  throw lastError ?? new Error(`Download failed for ${slug}`)
}

async function buildRenditions(slug, originalBuffer) {
  const dir = join(PUBLIC_ELEMENTS, slug)
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
      src: `/images/elements/${slug}/w${targetWidth}.jpg`,
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
    errors.push(`${slug}: missing from element-photo-sources.json`)
    continue
  }
  if (
    !force &&
    photos[slug]?.renditions?.length === 3 &&
    photos[slug]?.commonsFile === source.commonsFile
  ) {
    console.log(`${label} skip (cached)`)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    const safeName = String(source.commonsFile).replace(/[^a-zA-Z0-9._-]+/g, '_')
    const originalPath = join(ORIGINALS, safeName)
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
      commonsFile: source.commonsFile,
      provenance: `Curated from Wikimedia Commons file ${source.commonsFile}; imported locally with metadata stripped; originals kept outside the public tree.`,
      checksum,
      width,
      height,
      renditions,
    }
    console.log('ok')
    await sleep(800)
  } catch (error) {
    console.log('FAIL')
    errors.push(`${slug}: ${error instanceof Error ? error.message : error}`)
    await sleep(2000)
  }
}

writeFileSync(outputPath, `${JSON.stringify(photos, null, 2)}\n`)

if (errors.length) {
  console.error('\nImport failures:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(`\nWrote content/element-photos.json (${Object.keys(photos).length} subjects)`)
console.log(`Renditions under public/images/elements/`)
console.log(`Originals under .element-originals/ (keep gitignored)`)
