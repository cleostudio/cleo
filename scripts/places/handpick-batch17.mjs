#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch17 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch17.mjs
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
const UA = 'cleo-places-curate/1.0 (batch17-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  iowa: 'File:Loess Hills I-80 Iowa 632.jpg',
  muntenia: 'File:Bucharest-Skyline-01.jpg',
  'st-martin':
    'File:Shipwreck in Marigot Bay, Saint Martin, French West Indies - panoramio.jpg',
  glacier: 'File:20240913 Canon R5 Saint Mary Lake-8480.jpg',
  'sainte-chapelle': 'File:Interior de la Sainte Chapelle.jpg',
  zwinger:
    'File:Dresden - Zwingerteich Park - Semperoper, Zwingerteich & Zwinger 02.jpg',
  bhopal: 'File:Taj Ul Masajid, Bhopal.JPG',
  nagoya: 'File:Nagoya Castle aerial panorama.jpg',
  telangana: 'File:Golconda Fort 008.jpg',
  'porto-alegre': 'File:Porto Alegre Skyline.JPG',
  regina:
    'File:Saskatchewan Legislative Assembly across Wascana Lake - Regina (30194746318).jpg',
  tucson: 'File:Tuscon Arizona Desert Sunset Over Mountains - panoramio.jpg',
  mechelen: 'File:Graote Markt en Sint-Rombouts.jpg',
  concepcion: 'File:Universidad de Concepción 2022.jpg',
  'eden-valley': 'File:Eden Valley Lookout.jpg',
  'northwest-territories':
    'File:Frozen Great Slave Lake - Yellowknife, Canada (5325723220).jpg',
  florianopolis: 'File:Praia do Forte-Florianopolis-Brasil.JPG',
  barra: 'File:Castlebay Barra - geograph.org.uk - 6886623.jpg',
  'heidelberg-castle':
    'File:Die Schloss Heidelberg vom Neckarufer nördlich der Stadthalle Heidelberg.jpg',
  spokane: 'File:SPOKANE RIVER AND FALLS IN DOWNTOWN SPOKANE - NARA - 548091.jpg',
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
    photographer = `${photographer.slice(0, 97)}…`
  }
  if (photographer.length < 3) {
    photographer = `${photographer} (Wikimedia Commons)`.trim()
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
console.log('All batch17 handpicks saved')
