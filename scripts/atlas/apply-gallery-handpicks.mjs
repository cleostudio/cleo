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
const replacementsPath = join(handpickDirectory, 'quality-replacements.json')
const slotReplacementsPath = join(handpickDirectory, 'quality-slot-replacements.json')
const rawSources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
const sources = Object.fromEntries(
  Object.entries(rawSources).map(([slug, value]) => [
    slug,
    Array.isArray(value) ? value : [value],
  ]),
)

const handpicks = {}
for (const filename of readdirSync(handpickDirectory).sort()) {
  if (
    !filename.endsWith('.json') ||
    filename === 'quality-replacements.json' ||
    filename === 'quality-slot-replacements.json'
  ) {
    continue
  }
  const picks = JSON.parse(readFileSync(join(handpickDirectory, filename), 'utf8'))
  for (const [slug, rows] of Object.entries(picks)) {
    if (handpicks[slug]) {
      throw new Error(`Duplicate handpick set for ${slug}`)
    }
    handpicks[slug] = rows
  }
}

function assertRows(slug, rows) {
  if (!Array.isArray(rows) || rows.length !== 3) {
    throw new Error(`${slug}: needs exactly three reviewed photograph records`)
  }
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
}

for (const [slug, additions] of Object.entries(handpicks)) {
  const existing = sources[slug]
  if (!Array.isArray(additions) || additions.length !== 2) {
    throw new Error(`${slug}: needs exactly two reviewed handpicks`)
  }

  let rows
  if (Array.isArray(existing) && existing.length === 1) {
    rows = [...existing, ...additions]
  } else if (
    Array.isArray(existing) &&
    existing.length === 3 &&
    additions.every((addition) =>
      existing.some((row) => row.downloadUrl === addition.downloadUrl),
    )
  ) {
    rows = existing
  } else {
    throw new Error(`${slug}: unexpected source rows before applying handpicks`)
  }

  assertRows(slug, rows)
  sources[slug] = rows
}

const replacements = JSON.parse(readFileSync(replacementsPath, 'utf8'))
for (const [slug, replacement] of Object.entries(replacements)) {
  const current = sources[slug]
  if (!Array.isArray(current) || current.length !== 3) {
    throw new Error(`${slug}: expected three sources before replacing a weak hero`)
  }
  const rows = [replacement, ...current.slice(1)]
  assertRows(slug, rows)
  sources[slug] = rows
}

const slotReplacements = JSON.parse(readFileSync(slotReplacementsPath, 'utf8'))
for (const [slug, replacements] of Object.entries(slotReplacements)) {
  const current = sources[slug]
  if (!Array.isArray(current) || current.length !== 3 || !Array.isArray(replacements)) {
    throw new Error(`${slug}: invalid quality slot replacement`)
  }
  const rows = [...current]
  for (const { index, photo } of replacements) {
    if (!Number.isInteger(index) || index < 0 || index >= rows.length || !photo) {
      throw new Error(`${slug}: invalid quality replacement index`)
    }
    rows[index] = photo
  }
  assertRows(slug, rows)
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
  `Applied ${Object.keys(handpicks).length} reviewed handpick sets, ${Object.keys(replacements).length} hero replacements, and ${Object.values(slotReplacements).flat().length} slot replacements → ${sourcesPath}`,
)
