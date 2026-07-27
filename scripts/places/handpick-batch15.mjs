#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch15 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch15.mjs
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
const UA = 'cleo-places-curate/1.0 (batch15-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  'birmingham-us': 'File:Birmingham, Alabama skyline.jpg',
  boise: 'File:Boise Skyline, JUMP.jpg',
  'victoria-bc':
    'File:The Empress and Inner Harbour, Victoria, southwest view 20240827 2.jpg',
  manaus: 'File:Meeting of Waters (Manaus).jpg',
  varanasi:
    'File:Varanasi, India, Ganges River, ghats, temples and embankments.jpg',
  matsuyama: 'File:Matsuyama Castle Main.jpg',
  tinos: 'File:City of Tinos, Greece 2018040512430NP0001.jpg',
  chios: 'File:MESTA CHIOS GREECE 131Α.jpg',
  harris:
    'File:Seilebost and Luskentyre, Isle of Harris - geograph.org.uk - 8086853.jpg',
  desirade: 'File:La Désirade, depuis Petite-Terre.jpg',
  liguria: 'File:Vernazza Town Cinque Terre.jpg',
  'mclaren-vale': 'File:McLaren Vale wine region - panoramio.jpg',
  cantabria: 'File:San Vicente de la Barquera - panoramio (1).jpg',
  dobruja:
    'File:Looking eastwards to Mamaia (AP4P0976) (28968227134).jpg',
  'tower-of-london':
    'File:Tower of London viewed from the River Thames.jpg',
  'pantheon-paris': 'File:Paris, Panthéon -- 2014 -- 1676.jpg',
  badlands: 'File:Badlands National Park, South Dakota 2014 10.jpg',
  wartburg:
    'File:Thuringia Eisenach asv2020-07 img23 Wartburg Castle.jpg',
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
console.log('All batch15 handpicks saved')
