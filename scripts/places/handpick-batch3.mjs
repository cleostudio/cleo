#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const outPath = join(root, 'scripts/places/place-photo-sources.json')
const targets = JSON.parse(
  readFileSync(join(root, 'scripts/places/place-targets.json'), 'utf8'),
)
const sources = JSON.parse(readFileSync(outPath, 'utf8'))
const UA = 'cleo-places-curate/1.0 (batch3-handpick-persist)'

const JOBS = [
  [
    'santiago',
    ['Santiago Chile Andes skyline', 'Cerro San Cristobal Santiago panorama'],
  ],
  ['nairobi', ['Nairobi skyline Kenya city', 'Nairobi Kenyatta Avenue cityscape']],
  ['texas', ['Big Bend National Park Texas sunset', 'Chisos Mountains Big Bend']],
  [
    'florida',
    ['Everglades National Park Florida landscape', 'Miami skyline Biscayne Bay'],
  ],
  [
    'rhine-valley',
    ['Loreley Rhine Germany viewpoint', 'Rhine Gorge castle vineyards'],
  ],
  [
    'okinawa',
    ['Naha Okinawa panoramic view', 'Okinawa Main Island beach turquoise'],
  ],
  [
    'mexico-city',
    ['Zocalo Mexico City panorama', 'Mexico City skyline Reforma Chapultepec'],
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
    gsrlimit: '15',
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
      /\b(map|flag|aquarium|buffalo|animal|bird|mural|pub|interior|portrait|railway|locomotive|church --)\b/i.test(
        title,
      )
    ) {
      continue
    }
    const license = info.extmetadata?.LicenseShortName?.value || ''
    if (!/(public domain|pd|cc0|cc[- ]?by)/i.test(license)) continue
    const width = info.width || 0
    const height = info.height || 0
    if (width < 1800 || height < 1100 || height > width * 1.05) continue
    const assessments = info.extmetadata?.Assessments?.value || ''
    const score =
      (width * height) / 1e6 +
      (assessments.includes('featured') ? 80 : 0) +
      (assessments.includes('quality') ? 40 : 0)
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

console.log('All batch3 handpicks saved')
