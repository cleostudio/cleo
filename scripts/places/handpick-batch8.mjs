#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch8 weak/wrong auto-curations.
 * Updates scripts/places/place-photo-sources.json in place.
 *
 *   node scripts/places/handpick-batch8.mjs
 *   pnpm import:place-photos -- --force --only=ontario,gozo,western-australia,...
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
const UA = 'cleo-places-curate/1.0 (batch8-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  minneapolis: 'File:Sunset over the Minneapolis skyline. (23906034652).jpg',
  phoenix: 'File:Downtown Phoenix Skyline at Night.jpg',
  'las-vegas':
    'File:Aerial view showing the Las Vegas Strip at dusk, Las Vegas, Nevada LCCN2011634444.tif',
  minnesota:
    'File:Split Rock Lighthouse - Lake County, Minnesota - 8 Jan. 2009.jpg',
  ontario:
    'File:Smoke Lake, Algonquin Provincial Park, North view 20170421 1.jpg',
  'western-australia':
    'File:Pinnacles Desert, Nambung National Park, Western Australia 24.jpg',
  paros: 'File:Venetian Castle from the side of the port.jpg',
  moorea: 'File:Moorea - Baies de Cook et de Opunohu.jpg',
  jersey: 'File:Jersey, Saint Aubins, Channel Islands-LCCN2002696494.jpg',
  gozo:
    'File:Bahía de Ramla desde la cueva de Calipso, isla de Gozo, Malta, 2021-08-22, DD 01.jpg',
  hvar: 'File:Stari Grad (Old Town), Hvar Island (41666347684).jpg',
  champagne: 'File:Champagne-Vigny 16 Vignes&collines D7 pano 2013.jpg',
  'eiffel-tower': 'File:Tour Eiffel Wikimedia Commons.jpg',
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
  await sleep(1200)
}

console.log('All batch8 handpicks saved')
