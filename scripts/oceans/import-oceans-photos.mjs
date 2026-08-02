#!/usr/bin/env node
/**
 * Wikimedia Commons image sets → optimized local Oceans renditions.
 *
 * Import-time only (no account/API key required at runtime):
 * 1. Download each curated JPEG once
 * 2. Strip metadata, write three mozjpeg renditions for each of three
 *    photographs under public/images/oceans/{slug}/
 * 3. Write credits + checksum + rendition metadata into
 *    content/oceans-photos.json
 *
 * The app serves those static files directly — never via a CDN account or
 * /_next/image. Originals stay in .oceans-originals/ (gitignored).
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
const ORIGINALS = join(root, '.oceans-originals')
const PUBLIC_DIR = join(root, 'public/images/oceans')
const sourcesPath = join(
  root,
  'scripts/oceans/oceans-photo-sources.json',
)
const outputPath = join(root, 'content/oceans-photos.json')

const rawSources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
const sources = Object.fromEntries(
  Object.entries(rawSources).map(([slug, value]) => [
    slug,
    Array.isArray(value) ? value : [value],
  ]),
)
const existing = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, 'utf8'))
  : {}

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_DIR, { recursive: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function downloadOriginal(slug, url, dest) {
  if (existsSync(dest) && readFileSync(dest).byteLength > 1000) {
    return readFileSync(dest)
  }
  let lastError = null
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent':
            'cleo-oceans-import/1.0 (https://github.com/cleostudio/cleo; knowledge-portal photo import)',
          accept: 'image/*',
        },
        signal: AbortSignal.timeout(180_000),
      })
      if (res.status === 429 || res.status === 503) {
        const retryAfter = Number(res.headers.get('retry-after')) || attempt * 8
        await sleep(retryAfter * 1000)
        continue
      }
      if (!res.ok) {
        throw new Error(`Download failed for ${slug}: HTTP ${res.status}`)
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.byteLength < 1000) {
        throw new Error(
          `Download too small for ${slug}: ${buffer.byteLength} bytes`,
        )
      }
      writeFileSync(dest, buffer)
      // Be polite to Commons between successful fetches.
      await sleep(1500)
      return buffer
    } catch (error) {
      lastError = error
      await sleep(attempt * 4000)
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`Download failed for ${slug}`)
}

function renditionFilename(width, photoIndex) {
  return `w${width}${photoIndex === 0 ? '' : `-${photoIndex + 1}`}.jpg`
}

async function buildRenditions(slug, photoIndex, originalBuffer) {
  const dir = join(PUBLIC_DIR, slug)
  mkdirSync(dir, { recursive: true })
  const meta = await sharp(originalBuffer).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  if (!(width > 0 && height > 0)) {
    throw new Error(`Invalid image dimensions for ${slug}`)
  }

  const renditions = []
  const emittedWidths = new Set()
  for (const targetWidth of WIDTHS) {
    const filename = renditionFilename(targetWidth, photoIndex)
    const outPath = join(dir, filename)
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

    const renditionMeta = await sharp(out).metadata()
    const renditionWidth = renditionMeta.width ?? 0
    if (!(renditionWidth > 0)) {
      throw new Error(`Invalid rendition dimensions for ${slug}`)
    }
    if (emittedWidths.has(renditionWidth)) {
      if (existsSync(outPath)) rmSync(outPath)
      continue
    }
    writeFileSync(outPath, out)
    emittedWidths.add(renditionWidth)
    renditions.push({
      width: renditionWidth,
      src: `/images/oceans/${slug}/${filename}`,
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
const photoSets = { ...existing }
const errors = []
let index = 0

for (const slug of slugs) {
  index++
  const sourceRows = sources[slug]
  const label = `[${index}/${slugs.length}] ${slug}`
  if (!Array.isArray(sourceRows) || sourceRows.length !== 3) {
    errors.push(`${slug}: needs exactly three curated Commons sources`)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    const existingRows = Array.isArray(photoSets[slug])
      ? photoSets[slug]
      : photoSets[slug]
        ? [photoSets[slug]]
        : []
    const records = []

    for (const [photoIndex, source] of sourceRows.entries()) {
      const cached = existingRows[photoIndex]
      if (
        !force &&
        cached?.renditions?.length >= 1 &&
        cached.commonsTitle === source.commonsTitle
      ) {
        records.push(cached)
        continue
      }

      const safeId = source.commonsTitle
        .replace(/^File:/, '')
        .replace(/[^\w.-]+/g, '_')
        .slice(0, 80)
      const originalPath = join(ORIGINALS, `${safeId}-${photoIndex + 1}.jpg`)
      if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
        rmSync(originalPath)
      }
      const original = await downloadOriginal(slug, source.downloadUrl, originalPath)
      const checksum = createHash('sha256').update(original).digest('hex')
      const { width, height, renditions } = await buildRenditions(
        slug,
        photoIndex,
        original,
      )

      records.push({
        featureName: source.featureName,
        alt: `${source.featureName} — ${slug.replace(/-/g, ' ')}`,
        caption: `${source.featureName}`,
        photographer: source.photographer,
        sourceUrl: source.sourceUrl,
        license: source.license,
        commonsTitle: source.commonsTitle,
        provenance: `Curated from Wikimedia Commons (${source.commonsTitle}); imported locally with metadata stripped; originals kept outside the public tree.`,
        checksum,
        width,
        height,
        renditions,
      })
    }

    photoSets[slug] = records
    console.log('ok')
  } catch (error) {
    console.log('FAIL')
    errors.push(`${slug}: ${error instanceof Error ? error.message : error}`)
  }
}

writeFileSync(outputPath, `${JSON.stringify(photoSets, null, 2)}\n`)

if (errors.length) {
  console.error('\nImport failures:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(
  `\nWrote content/oceans-photos.json (${Object.keys(photoSets).length} subjects × 3 photographs)`,
)
console.log(`Renditions under public/images/oceans/`)
console.log(`Originals under .oceans-originals/ (keep gitignored)`)
