#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch9 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch9.mjs
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
const UA = 'cleo-places-curate/1.0 (batch9-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  portland: 'File:Downtown Portland from the north 2013.jpg',
  austin: 'File:Downtown Austin Skyline - Lady Bird Lake (54987239041).jpg',
  nashville: 'File:Nashville, TN skyline.jpg',
  'new-orleans': 'File:New Orleans skyline from the Mississippi River.JPG',
  montevideo:
    'File:2016 centro de Montevideo desde la Rambla del presidente Wilson.jpg',
  'addis-ababa': 'File:Addis Ababa (16314616596).jpg',
  lahore: 'File:Badshahi Mosque Sunset.jpg',
  kolkata: 'File:Howrah Bridge 02.jpg',
  fukuoka:
    'File:Fukuoka Tower and pine trees from beach of Seaside Momochi Seaside Park.jpg',
  rotterdam: 'File:Erasmus bridge and Rotterdam skyline (21458216300).jpg',
  michigan: 'File:Panorama of Lake Michigan from Sleeping Bear Dunes.jpg',
  'georgia-us':
    'File:Public Lands Institute - Blood Mountain Wilderness - 001.tif',
  skiathos:
    'File:Top-down aerial of Koukounaries Beach, Skiathos, Greece (51695982638).jpg',
  kos: 'File:Panorama Kos 8.jpg',
  martinique: "File:View of Les Anses-d'Arlet, Martinique.jpg",
  'isle-of-skye': 'File:Quiraing, Isle of Skye, Scotland - Diliff.jpg',
  yorkshire:
    'File:Ingleborough Framed by Stone Walls and Rails – Yorkshire Dales National Park.jpg',
  'sydney-opera-house': 'File:Sydney (AU), Opera House -- 2019 -- 2280.jpg',
  teotihuacan: 'File:Avenue of the Dead at Teotihuacan panorama 5.jpg',
  kampala: 'File:Kampala-Gaddafi Mosque.jpg',
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
console.log('All batch9 handpicks saved')
