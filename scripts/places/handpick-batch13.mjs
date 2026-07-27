#!/usr/bin/env node
/**
 * Pin known-good Commons heroes for batch13 weak/wrong auto-curations.
 *
 *   node scripts/places/handpick-batch13.mjs
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
const UA = 'cleo-places-curate/1.0 (batch13-handpick-persist)'

/** slug → Commons file title */
const HANDPICKS = {
  sacramento: 'File:Sacramento, California skyline.jpg',
  indianapolis: 'File:Indianapolis Skyline and Canal 2025-10-14.jpg',
  'oklahoma-city': 'File:Oklahoma City skyline from drone.jpg',
  winnipeg: 'File:Winnipeg skyline 2025.jpg',
  'cordoba-ar':
    'File:Panorama urbano centro de Córdoba (Argentina) 2011-12-29 02.jpg',
  asuncion: 'File:00 3819 Asunción - Paraguay (Südamerika).jpg',
  goiania: 'File:Goiânia Agosto de 2019.jpg',
  zagreb: 'File:Zagreb panorama 20100507 1262P.jpg',
  sarajevo: 'File:Sarajevo – Baščaršija View from Zlatište 1.jpg',
  kochi: 'File:Chinese fishing nets at Fort Kochi 20230910.jpg',
  leuven: 'File:Leuven Grote Markt.JPG',
  ohio: 'File:Ash Cave @ Hocking Hills State Park - panoramio.jpg',
  'new-brunswick': 'File:Sea stacks - Hopewell Rocks1.jpg',
  maharashtra: 'File:Ajanta caves view.jpg',
  amorgos: 'File:Hozoviotissa 2012 a.JPG',
  karpathos: 'File:Lefkos. Karpathos, Greece.jpg',
  'la-graciosa': 'File:La Graciosa from Mirador del Rio.jpg',
  arran: 'File:Goatfell from Brodick Harbour.jpg',
  'st-barthelemy': 'File:Gustavia (Saint-Barthélemy).JPG',
  anguilla: 'File:Cuisinart, Rendezvous Bay, Anguilla 2009.jpg',
  puglia: 'File:Trulli panorama.jpg',
  carinthia:
    'File:Aerial image of Wörthersee (view from the southeast).jpg',
  'barossa-valley':
    'File:View of Barossa Valley from Mengler Hill 20230207.jpg',
  extremadura: 'File:Ancient Roman theatre in Mérida 2023.jpg',
  maramures: 'File:Overview of Bârsana monastery, Bârsana, 2017.jpg',
  'big-ben': 'File:Palace of Westminster and Elizabeth Tower 20250522.jpg',
  'notre-dame': 'File:Notre-Dame Paris December 2018-7.jpg',
  'lincoln-memorial': 'File:Lincoln Memorial Reflecting Pool 20240601.jpg',
  'mount-rainier': 'File:Mount Rainier from Paradise (33472882542).jpg',
  'red-square':
    "File:Saint Basil's Cathedral, Red Square, Moscow, Russia.jpg",
  'cn-tower': 'File:Toronto-CN-tower-and-Canadian-flag-skyline.jpg',
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
    if (picked.photographer.length > 100) {
      picked.photographer = picked.photographer.slice(0, 97) + '…'
    }
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
console.log('All batch13 handpicks saved')
