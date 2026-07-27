#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch16 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch16.mjs
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
const UA = 'cleo-places-curate/1.0 (batch16-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  buffalo:
    'File:Downtown skyline and grain elevators as seen from Buffalo Harbor State Park, Buffalo, New York - 20190724.jpg',
  ushuaia: 'File:Ushuaia and the Beagle Channel (5525434752).jpg',
  podgorica: 'File:City of Podgorica,Montenegro in 2020.07.jpg',
  missouri: 'File:Missouri River Valley and bluff 02.jpg',
  odisha: 'File:Konark Sun Temple Puri district, Odisha, India 3.jpg',
  syros: 'File:View of Ermoupoli (Syros island) from a ferry boat 2.jpg',
  lesbos: 'File:Lesbos coastal plain.jpg',
  'les-saintes': 'File:Les Saintes, Marigot harbor, near Guadaloupe - panoramio.jpg',
  burgenland:
    'File:Lake Neusiedl, Rust, Burgenland, sunrise, 20220428 0555 5690.jpg',
  'clare-valley': 'File:Vines in Clare Valley.jpg',
  navarre: 'File:View of Pamplona (1).jpg',
  oltenia: 'File:Hurezi.JPG',
  louvre: 'File:Louvre and Pyramid, Paris January 2014 002.jpg',
  everglades:
    'File:Sawgrass, Pa-hay-okee Trail, Everglades National Park, Florida (51130668684).jpg',
  'cologne-cathedral': 'File:Rhine River & Cologne Cathedral (9812095795).jpg',
  lewis: 'File:Callanish Stones, Isle of Lewis 2.jpg',
  lombardy: 'File:Town of Bellagio (Lake Como) seen from the lake (36722979021).jpg',
  formentera: 'File:Platje-de-Ses-Illetes Formentera.jpg',
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
console.log('All batch16 handpicks saved')
