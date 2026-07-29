#!/usr/bin/env node
/**
 * Fill the deliberately conservative Commons curation gaps with reviewed,
 * API-verified editorial picks. These files are only used when the automated
 * relevance and country checks cannot prove a candidate is safe.
 *
 *   node scripts/atlas/apply-gallery-handpicks.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const sourcesPath = join(root, 'scripts/atlas/atlas-photo-sources.json')
const handpickDirectory = join(root, 'scripts/atlas/gallery-handpicks')
const rawSources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
const sources = Object.fromEntries(
  Object.entries(rawSources).map(([slug, value]) => [
    slug,
    Array.isArray(value) ? value : [value],
  ]),
)

const handpicks = {}
for (const filename of readdirSync(handpickDirectory).sort()) {
  if (!filename.endsWith('.json')) continue
  const picks = JSON.parse(readFileSync(join(handpickDirectory, filename), 'utf8'))
  for (const [slug, rows] of Object.entries(picks)) {
    if (handpicks[slug]) {
      throw new Error(`Duplicate handpick set for ${slug}`)
    }
    handpicks[slug] = rows
  }
}

for (const [slug, additions] of Object.entries(handpicks)) {
  const existing = sources[slug]
  if (!Array.isArray(existing) || existing.length !== 1) {
    throw new Error(`${slug}: expected one automatic hero before applying handpicks`)
  }
  if (!Array.isArray(additions) || additions.length !== 2) {
    throw new Error(`${slug}: needs exactly two reviewed handpicks`)
  }

  const rows = [...existing, ...additions]
  const urls = new Set()
  for (const row of rows) {
    if (
      !row?.placeName?.trim() ||
      !row?.photographer?.trim() ||
      !row?.license?.trim() ||
      !row?.sourceUrl?.startsWith('https://') ||
      !row?.downloadUrl?.startsWith('https://') ||
      !(row.width > 0 && row.height > 0)
    ) {
      throw new Error(`${slug}: incomplete handpick metadata`)
    }
    if (urls.has(row.downloadUrl)) {
      throw new Error(`${slug}: duplicate photograph URL`)
    }
    urls.add(row.downloadUrl)
  }
  sources[slug] = rows
}

const incomplete = Object.entries(sources)
  .filter(([, rows]) => rows.length !== 3)
  .map(([slug]) => slug)
if (incomplete.length > 0) {
  throw new Error(`Still missing photo slots: ${incomplete.join(', ')}`)
}

writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`)
console.log(
  `Applied ${Object.keys(handpicks).length} reviewed country handpick sets → ${sourcesPath}`,
)
