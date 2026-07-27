#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch14 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch14.mjs
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
const UA = 'cleo-places-curate/1.0 (batch14-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  charlotte:
    'File:Uptown Charlotte 2018 taking by DJI Phantom 4 pro - Perspective Corrected Edit.jpg',
  memphis: 'File:Memphis, TN skyline along the Mississippi River.jpg',
  halifax:
    'File:2022-08-15 01 Wide angle view of Halifax skyline, Nova Scotia, Canada.jpg',
  fortaleza: 'File:Fortaleza, Ceará, Brasil - panoramio (1).jpg',
  sendai:
    'File:Sendai skyline and Hirose River from Hyojogawara Bridge.jpg',
  'west-bengal': 'File:Kanchenjunga and Darjeeling city.jpg',
  sifnos: 'File:View from Apollonia on Sifnos, 153367.jpg',
  serifos: 'File:Pano Seriphos 20030730.jpg',
  'el-hierro':
    'File:View from Tanganasoga volcano into the Golfo Valley (El Hierro).jpg',
  jura: 'File:Jura seen from Bunnahabhain - panoramio.jpg',
  'marie-galante': 'File:Plage de Folle Anse on Marie-Galante.jpg',
  'sint-eustatius':
    'File:Green fields in front of the Quill, in Sint Eustatius.jpg',
  molise: 'File:Paese di Pietrabbondante, Molise.jpg',
  banat: 'File:Victory Square in Timișoara Romania.jpg',
  'alcazar-seville':
    'File:Gardens of the Alcázar of Seville 20180719-2.jpg',
  hohenzollern: 'File:Burg Hohenzollern.jpg',
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
  let photographer =
    [artist, credit, info.user || '']
      .map((value) => value.trim())
      .find(
        (value) =>
          value && value.length < 120 && !/^\s*(note|own work)\b/i.test(value),
      ) || 'Wikimedia Commons contributor'
  if (photographer.length > 100) {
    photographer = photographer.slice(0, 97) + '…'
  }
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
console.log('All batch14 handpicks saved')
