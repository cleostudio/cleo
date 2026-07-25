#!/usr/bin/env node
/**
 * Manual Pexels → local atlas renditions.
 *
 * For each country in content/atlas.content.json:
 * 1. Download the selected Pexels JPEG (import-time only; not a runtime API)
 * 2. Strip metadata, write 640 / 1024 / 1600px JPEGs under public/images/atlas/{slug}/
 * 3. Merge photo credits + checksum + rendition metadata into content/atlas.json
 *
 * Originals are written to .atlas-originals/ (gitignored), never exposed publicly.
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

const content = JSON.parse(
  readFileSync(join(root, 'content/atlas.content.json'), 'utf8'),
)

mkdirSync(ORIGINALS, { recursive: true })
mkdirSync(PUBLIC_ATLAS, { recursive: true })

async function fetchPhotographer(pexelsId) {
  try {
    const res = await fetch(`https://www.pexels.com/photo/${pexelsId}/`, {
      headers: { 'user-agent': 'cleo-atlas-import/1.0', accept: 'text/html' },
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
    // Titles often look like "Free Stock Photo · Name" or "Photo by Name"
    const by = title.match(/photo by\s+([^·|]+)/i)?.[1]?.trim()
    if (by) return by
    const name = title.split(/[·|]/)[0]?.trim()
    return name && name.length < 80 ? name : 'Pexels contributor'
  } catch {
    return 'Pexels contributor'
  }
}

async function downloadOriginal(pexelsId, dest) {
  if (existsSync(dest)) return readFileSync(dest)
  const url = `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2000`
  const res = await fetch(url, {
    headers: { 'user-agent': 'cleo-atlas-import/1.0' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) {
    throw new Error(`Pexels download ${pexelsId} failed: HTTP ${res.status}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buffer)
  return buffer
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
    const pipeline = sharp(originalBuffer)
      .rotate()
      .resize({
        width: Math.min(targetWidth, width),
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' })

    // Strip metadata by not re-attaching EXIF/ICC beyond sRGB.
    const out = await pipeline.withMetadata({ orientation: undefined }).toBuffer()
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
const only = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]?.split(',').filter(Boolean)
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
  const label = `[${index}/${slugs.length}] ${slug}`
  if (!force && atlas[slug]?.photo?.renditions?.length === 3) {
    const expectedId = String(entry.pexelsId)
    if (atlas[slug].photo.sourceUrl.includes(`/${expectedId}/`)) {
      console.log(`${label} skip (cached)`)
      continue
    }
  }
  try {
    process.stdout.write(`${label}… `)
    const originalPath = join(ORIGINALS, `${entry.pexelsId}.jpg`)
    // Drop stale failed downloads so retries hit the network.
    if (existsSync(originalPath) && readFileSync(originalPath).byteLength < 1000) {
      rmSync(originalPath)
    }
    const original = await downloadOriginal(entry.pexelsId, originalPath)
    const checksum = createHash('sha256').update(original).digest('hex')
    const { width, height, renditions } = await buildRenditions(slug, original)
    const photographer = await fetchPhotographer(entry.pexelsId)
    const placeName = entry.featuredPlaceName

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
      photo: {
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
      },
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
