#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch22 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch22.mjs
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
const UA = 'cleo-places-curate/1.0 (batch22-handpick-persist)'

const HANDPICKS = {
  sheffield:
    'File:Sheffield Town Hall and Peace Gardens - geograph.org.uk - 4907417.jpg',
  bristol: 'File:Bristol MMB «C0 Clifton Suspension Bridge.jpg',
  newcastle:
    'File:Newcastle upon Tyne Swing Bridge and Tyne Bridge seen from High Level Bridge.jpg',
  nottingham:
    'File:Nottingham Council House, Old Market Square - geograph.org.uk - 7409020.jpg',
  nantes: 'File:NantesChateau 08.jpg',
  lille: 'File:Lille vue gd place.JPG',
  catania: 'File:Catania, piazza del Duomo.jpg',
  cali: 'File:Estatua de Cristo Rey - Cali, Colombia.jpg',
  uppsala: 'File:2023 Exterior of Uppsala Cathedral (6).jpg',
  trondheim: 'File:Nidarosdomen Trondheim 2022-08-18 01.jpg',
  utrecht:
    'File:Utrecht, de Domtoren (RM36075) vanaf de Oudegracht 230 ongeveer foto5 2015-11-01 08.56.jpg',
  utah: 'File:USA 10400 Arches National Park Luca Galuzzi 2007.jpg',
  delaware:
    'File:Rehoboth Beach looking north at Delaware Avenue June 2014.jpg',
  praslin: 'File:Anse Lazio Praslin Seychelles 1.jpg',
  bornholm: 'File:Hammershus Castle Ruins, Bornholm.jpg',
  lombok:
    'File:Lombok Island and Mount Rinjani from Gili Meno Island, Indonesia.jpg',
  auvergne: 'File:Panorama de la chaîne des Puys.jpg',
  lorraine: 'File:Nancy Place Stanislas BW 2015-07-18 13-48-46.jpg',
  'valley-of-the-kings':
    'File:Thebes, Luxor, Egypt, Valley of the Kings in Theban Hills.jpg',
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
console.log('All batch22 handpicks saved')
