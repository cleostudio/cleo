#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch10 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch10.mjs
 *   pnpm import:place-photos -- --force --only=<slugs>
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
const UA = 'cleo-places-curate/1.0 (batch10-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  calgary: 'File:Bow River Bridge and Calgary Skyline.jpg',
  recife: 'File:Zona Sul da Cidade do Recife, Pernambuco, Brasil.jpg',
  belgrade:
    'File:Confluence of the Danube and Sava rivers - Belgrade Fortress (13808328374).jpg',
  sofia: 'File:AlexanderNevskyCathedral-Sofia-6.jpg',
  sapporo: 'File:Sapporo TV Tower and Odori park.JPG',
  antwerp: 'File:Panorama-sunset-Antwerp.jpg',
  'north-carolina':
    'File:Blue Ridge Parkway North Carolina by maria newengland.jpg',
  lefkada: 'File:Porto Katsiki Beach, Lefkada, Ionian Islands, Greece.jpg',
  'isle-of-wight': 'File:The Needles, Isle of Wight 20180618-3.jpg',
  tobago: "File:Englishman's Bay - Tobago, West Indies.jpg",
  'mount-rushmore':
    'File:Dean Franklin - 06.04.03 Mount Rushmore Monument (by-sa).jpg',
  'hagia-sophia': 'File:Ayasofya, İstanbul, Türkiye.jpg',
  'salt-lake-city': 'File:Salt Lake City, August 2012 (7707261420).jpg',
  charleston: 'File:Charleston skyline from Charleston Harbor.JPG',
  hyderabad: 'File:Charminar-Hyderabad-Monument.jpg',
  manitoba: 'File:Lake winnipeg in july.jpg',
  'mesa-verde': 'File:Cliff Palace at Mesa Verde.jpg',
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

async function api(url) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const res = await fetch(url, { headers: { 'user-agent': UA } })
    const text = await res.text()
    if (text.startsWith('You are making')) {
      await sleep(7000 * attempt)
      continue
    }
    try {
      return JSON.parse(text)
    } catch {
      await sleep(4000 * attempt)
    }
  }
  throw new Error('rate limited')
}

async function fileInfo(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|canonicaltitle|user',
  })
  const data = await api(`https://commons.wikimedia.org/w/api.php?${params}`)
  const page = Object.values(data.query?.pages ?? {})[0]
  const info = page?.imageinfo?.[0]
  if (!info?.url) throw new Error(`missing ${title}`)
  const artist = stripHtml(info.extmetadata?.Artist?.value || '')
  const credit = stripHtml(info.extmetadata?.Credit?.value || '')
  const photographer =
    [artist, credit, info.user || '']
      .map((value) => value.trim())
      .find(
        (value) =>
          value && value.length < 120 && !/^\s*(note|own work)\b/i.test(value),
      ) || 'Wikimedia Commons contributor'
  return {
    title: page.title,
    url: info.url,
    sourceUrl: info.descriptionurl,
    width: info.width,
    height: info.height,
    license: (info.extmetadata?.LicenseShortName?.value || '').trim(),
    assessments: info.extmetadata?.Assessments?.value || '',
    photographer,
  }
}

function save() {
  writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
}

const failed = []
for (const [slug, commonsTitle] of Object.entries(HANDPICKS)) {
  const target = targets[slug]
  if (!target) throw new Error(`Unknown place slug ${slug}`)
  if (
    sources[slug]?.handpick &&
    sources[slug]?.commonsTitle === commonsTitle
  ) {
    console.log(`${slug} skip (already pinned)`)
    continue
  }
  process.stdout.write(`${slug}… `)
  await sleep(800)
  try {
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
    save()
    console.log(
      `ok ${picked.width}×${picked.height} — ${picked.title.replace(/^File:/, '').slice(0, 55)}`,
    )
  } catch (error) {
    console.log(`FAIL ${error instanceof Error ? error.message : error}`)
    failed.push(slug)
  }
  await sleep(1200)
}

if (failed.length) {
  console.error('Failed:', failed.join(', '))
  process.exit(1)
}
console.log('All batch10 handpicks saved')
