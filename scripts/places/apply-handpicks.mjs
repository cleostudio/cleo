#!/usr/bin/env node
/**
 * Force known-good Commons heroes when automated scoring still misses.
 * Updates scripts/places/place-photo-sources.json in place.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const outPath = join(root, 'scripts/places/place-photo-sources.json')
const targets = JSON.parse(
  readFileSync(join(root, 'scripts/places/place-targets.json'), 'utf8'),
)
const sources = JSON.parse(readFileSync(outPath, 'utf8'))

const UA = 'cleo-places-curate/1.0 (handpick)'

/** slug → Commons file title (with or without File:) */
const HANDPICKS = {
  paris: 'File:Notre-Dame de Paris and Île de la Cité at dusk 140516 1.jpg',
  'new-york': 'File:Lower Manhattan from Brooklyn May 2015 panorama.jpg',
  cairo: 'File:All Gizah Pyramids.jpg',
  quebec: 'File:Québec city at night, view from Lévis city.jpg',
  galapagos: 'File:Bartolomé Island Pinnacle Rock.jpg',
  jeju: 'File:Seongsan, Jeju Island.jpg',
  tuscany: 'File:Continua - cypresses (no watermark).jpg',
  provence: 'File:Lavender field at the foot of the Alps, Provence, France (51695209778).jpg',
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stripHtml(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fileInfo(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata|canonicaltitle|user',
  })
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'user-agent': UA, accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${title}`)
  const data = await res.json()
  const page = Object.values(data.query?.pages ?? {})[0]
  const info = page?.imageinfo?.[0]
  if (!info?.url) throw new Error(`No imageinfo for ${title}`)
  const artist = stripHtml(info.extmetadata?.Artist?.value || '')
  const credit = stripHtml(info.extmetadata?.Credit?.value || '')
  const photographer =
    [artist, credit, info.user || '']
      .map((value) => value.trim())
      .find((value) => value && value.length < 120 && !/^\s*(note|own work)\b/i.test(value)) ||
    'Wikimedia Commons contributor'
  return {
    title: page.title,
    url: info.url,
    sourceUrl: info.descriptionurl,
    width: info.width,
    height: info.height,
    license: (
      info.extmetadata?.LicenseShortName?.value ||
      info.extmetadata?.License?.value ||
      ''
    ).trim(),
    assessments: info.extmetadata?.Assessments?.value || '',
    photographer,
  }
}

for (const [slug, commonsTitle] of Object.entries(HANDPICKS)) {
  const target = targets[slug]
  if (!target) throw new Error(`Unknown place slug ${slug}`)
  await sleep(400)
  process.stdout.write(`${slug}… `)
  const picked = await fileInfo(commonsTitle)
  sources[slug] = {
    placeName: target.name,
    countryName: target.countryName,
    countrySlug: target.countrySlug,
    kind: target.kind,
    downloadUrl: picked.url,
    sourceUrl: picked.sourceUrl,
    photographer: picked.photographer,
    license: picked.license,
    commonsTitle: picked.title,
    width: picked.width,
    height: picked.height,
    assessments: picked.assessments,
    score: 200,
    handpick: true,
  }
  console.log(`ok ${picked.width}×${picked.height} — ${picked.title.replace(/^File:/, '').slice(0, 60)}`)
}

writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
console.log(`\nUpdated ${outPath} with ${Object.keys(HANDPICKS).length} handpicks`)
