#!/usr/bin/env node
/**
 * Search-handpick accurate Commons heroes for batch4 misses.
 * Persists after each success to survive Commons rate limits.
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
const UA = 'cleo-places-curate/1.0 (batch4-handpick-persist)'

const JOBS = [
  [
    'lagos',
    [
      'Lagos Nigeria skyline Victoria Island',
      'Lagos Nigeria aerial cityscape lagoon',
      'Third Mainland Bridge Lagos',
    ],
  ],
  [
    'warsaw',
    [
      'Warsaw Old Town panorama',
      'Warsaw skyline Vistula',
      'Warsaw Castle Square',
    ],
  ],
  [
    'delhi',
    [
      'India Gate New Delhi',
      'Red Fort Delhi panorama',
      'New Delhi Central Vista',
    ],
  ],
  [
    'osaka',
    [
      'Osaka Castle park view',
      'Osaka skyline Umeda',
      'Dotonbori Osaka night canal',
    ],
  ],
  [
    'vancouver',
    [
      'Vancouver skyline Stanley Park',
      'Downtown Vancouver Burrard Inlet',
      'Vancouver British Columbia city skyline mountains',
    ],
  ],
  [
    'dublin',
    [
      'Ha penny Bridge Dublin',
      'Dublin Liffey skyline',
      'Trinity College Dublin Front Square',
    ],
  ],
  [
    'reykjavik',
    [
      'Reykjavik Hallgrimskirkja',
      'Reykjavik harbour panorama',
      'Reykjavík skyline Iceland',
    ],
  ],
  [
    'phuket',
    [
      'Patong Beach Phuket',
      'Phuket beach Andaman aerial',
      'Kata Beach Phuket Thailand',
    ],
  ],
  [
    'bora-bora',
    [
      'Bora Bora lagoon Mount Otemanu',
      'Bora Bora aerial lagoon',
      'Bora-Bora French Polynesia',
    ],
  ],
  [
    'luzon',
    [
      'Banaue Rice Terraces',
      'Mayon Volcano landscape',
      'Rice Terraces of the Philippine Cordilleras',
    ],
  ],
  [
    'sumatra',
    [
      'Lake Toba Sumatra',
      'Mount Kerinci Sumatra',
      'Lake Toba Samosir aerial',
    ],
  ],
  [
    'neuschwanstein',
    [
      'Neuschwanstein Castle Bavaria',
      'Schloss Neuschwanstein',
      'Neuschwanstein Castle from Marienbrücke',
    ],
  ],
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stripHtml(value = '') {
  return value
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

async function searchPick(query) {
  await sleep(1600)
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrlimit: '18',
    gsrnamespace: '6',
    gsrsearch: `filetype:bitmap ${query}`,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata|canonicaltitle|user',
  })
  const data = await api(`https://commons.wikimedia.org/w/api.php?${params}`)
  let best = null
  for (const page of Object.values(data.query?.pages ?? {})) {
    const info = page.imageinfo?.[0]
    if (!info?.url) continue
    const title = page.title || ''
    if (
      /\b(map|flag|animal|bird|butterfly|mural|portrait|ship|imo|iss\d|satellite|tomato|market stall|hop |martial|silek|black and white|bw |vancouver island|mystic beach)\b/i.test(
        title,
      )
    ) {
      continue
    }
    const license = info.extmetadata?.LicenseShortName?.value || ''
    if (!/(public domain|pd|cc0|cc[- ]?by)/i.test(license)) continue
    const width = info.width || 0
    const height = info.height || 0
    if (width < 1600 || height < 1000) continue
    const assessments = info.extmetadata?.Assessments?.value || ''
    const score =
      (width * height) / 1e6 +
      (assessments.includes('featured') ? 80 : 0) +
      (assessments.includes('quality') ? 40 : 0) +
      (assessments.includes('valued') ? 20 : 0)
    if (!best || score > best.score) best = { title: page.title, score }
  }
  if (!best) throw new Error(`no pick for ${query}`)
  await sleep(1000)
  return fileInfo(best.title)
}

function save() {
  writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
}

for (const [slug, queries] of JOBS) {
  if (sources[slug]?.handpick) {
    console.log(`${slug} skip (already handpicked)`)
    continue
  }
  process.stdout.write(`${slug}… `)
  let picked = null
  let lastError = null
  for (const query of queries) {
    try {
      picked = await searchPick(query)
      break
    } catch (error) {
      lastError = error
      await sleep(4000)
    }
  }
  if (!picked) throw lastError ?? new Error(slug)
  const target = targets[slug]
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
  await sleep(2500)
}

console.log('All batch4 handpicks saved')
