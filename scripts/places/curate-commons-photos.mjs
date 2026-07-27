#!/usr/bin/env node
/**
 * Curate one accurate Wikimedia Commons photograph per place guide.
 *
 * Writes scripts/places/place-photo-sources.json for import-place-photos.mjs.
 *
 *   node scripts/places/curate-commons-photos.mjs
 *   node scripts/places/curate-commons-photos.mjs --force
 *   node scripts/places/curate-commons-photos.mjs --only=paris,tokyo
 *   node scripts/places/curate-commons-photos.mjs --dry-run
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const targets = JSON.parse(
  readFileSync(join(root, 'scripts/places/place-targets.json'), 'utf8'),
)

const UA =
  'cleo-places-curate/1.0 (https://github.com/cleostudio/cleo; knowledge portal photo curation)'

const SKIP_TITLE =
  /\b(map|flag|coat of arms|logo|diagram|chart|svg|locator|orthographic|blank|seal|emblem|passport|stamp|coin|banknote|aircraft|airplane|cockpit|fighter|boeing|airbus|heli(?:copter)?|satellite imagery of|radar|dem |elevation|topograph|bathymetr|census|population|collage|osm|openstreetmap|naval base|paratroop|military|soldier|airport runway|engraving|lithograph|painting|drawing|sketch|poster|infographic|screenshot|scan of|aktie|share certificate|stock certificate|bond certificate|tafel|hinweistafel|signboard|park sign|canopy bed|hotel suite|bedroom|urban piano)\b/i

const SKIP_CATEGORY =
  /\b(maps|diagrams|drawings|engravings|lithographs|paintings|illustrations|coats of arms|flags of|logos|satellite pictures|satellite images|floor plans|blueprints|icons|scanned|postcards|stamps of|banknotes|charts|documents|certificates|signs in|information boards)\b/i

const DEMOTE_TITLE =
  /\b(door|window|detail|scripts?|inscription|close[- ]?up|plaque|sign|balcony|suite|interior|laundry|flower|flowers|bougainvillea)\b/i

const SKIP_SUBJECT =
  /\b(birds?|animals?|mammals?|insects?|reptiles?|amphibians?|fishes|fauna|flora|wildlife|plants|flowers|fungi|butterflies|moths|beetles|arthropods|molluscs|snails|primates|monkeys?|apes|lemurs|antelopes|lizards|snakes|turtles|elephants|tractors?|automobiles|cars|motorcycles|buses|trucks|agricultural machinery|locomotives|foods?|fruits?|apricots?|vegetables|cuisine|dishes|beverages|portraits|clothes|clothing|textiles|costumes|laundry|footwear|jewellery|weapons|coins|books|sports|football|nude)\b/i

const PLACE_CATEGORY =
  /\b(views of|aerial (photographs|views)|architecture|buildings|cityscapes|skylines|panoramas of|landscapes|streets in|squares in|churches|cathedrals|basilicas|mosques|temples|monasteries|castles|fortifications|palaces|ruins|mountains|lakes|rivers|waterfalls|glaciers|national parks|beaches|deserts|islands|valleys|canyons|harbours|bridges)\b/i

const SPECIES_TITLE = /\([A-Z][a-z]+ [a-z]{3,}\)/

const DEMOTE_CATEGORY =
  /\b(black and white photographs|grayscale|historical images|19th-century photographs|panoramics|stitched|night views)\b/i

const COUNTRY_ALIASES = {
  'korea south': ['south korea', 'republic of korea', 'korea'],
  'turkiye': ['turkiye', 'turkey', 'turkish'],
  'united kingdom': [
    'united kingdom',
    'england',
    'scotland',
    'wales',
    'northern ireland',
    'british',
  ],
  'united states': ['united states', 'usa', 'american', 'hawaii', 'california'],
}

const ALLOWED_LICENSE =
  /^(public domain|pd|cc0|cc[- ]?by(?:-sa)?(?:\s*\d(?:\.\d)?)?(?:\s+unported)?|cc-zero)$/i

const ASSESSMENT_POINTS = {
  featured: 55,
  poty: 24,
  potd: 14,
  quality: 32,
  valued: 18,
}

const STOP_WORDS = new Set([
  'and',
  'de',
  'del',
  'der',
  'die',
  'el',
  'la',
  'las',
  'les',
  'los',
  'national',
  'of',
  'park',
  'the',
  'von',
  'city',
  'island',
  'islands',
])

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

function fold(text = '') {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function commonsSearch(query, limit = 20) {
  const params = new URLSearchParams({
    action: 'query',
    cllimit: 'max',
    clshow: '!hidden',
    format: 'json',
    generator: 'search',
    gsrlimit: String(limit),
    gsrnamespace: '6',
    gsrsearch: `filetype:bitmap ${query}`,
    iiprop: 'url|size|mime|extmetadata|canonicaltitle|user',
    prop: 'imageinfo|categories',
  })
  const url = `https://commons.wikimedia.org/w/api.php?${params}`
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`Commons search failed (${res.status}) for ${query}`)
  const data = await res.json()
  return Object.values(data.query?.pages ?? {})
}

function licenseOf(info) {
  const meta = info.extmetadata ?? {}
  return (
    meta.LicenseShortName?.value ||
    meta.License?.value ||
    meta.UsageTerms?.value ||
    ''
  ).trim()
}

function isCredit(value) {
  if (!value) return false
  if (value.length > 120) return false
  return !/^\s*(note|warning|this (image|file|photo)|own work)\b/i.test(value)
}

function artistOf(info) {
  const meta = info.extmetadata ?? {}
  const candidates = [
    stripHtml(meta.Artist?.value || ''),
    stripHtml(meta.Credit?.value || ''),
    info.user || '',
  ]
  return (
    candidates.map((value) => value.trim()).find(isCredit) ||
    'Wikimedia Commons contributor'
  )
}

function relevanceOf(title, categories, placeName) {
  const foldedTitle = fold(title)
  const foldedCategories = categories.map(fold)
  const place = fold(placeName.split('(')[0])
  const tokens = place
    .split(' ')
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))

  if (foldedTitle.includes(place)) return 46
  if (foldedCategories.some((category) => category.includes(place))) return 40
  if (tokens.length > 0) {
    if (tokens.every((token) => foldedTitle.includes(token))) return 30
    if (
      foldedCategories.some((category) =>
        tokens.every((token) => category.includes(token)),
      )
    ) {
      return 24
    }
  }
  return 0
}

function inCountry(title, categories, countryName) {
  const folded = fold(countryName)
  const names = COUNTRY_ALIASES[folded] ?? [folded]
  const haystack = [fold(title), ...categories.map(fold)]
  return names.some((name) => haystack.some((entry) => entry.includes(name)))
}

function leadsWithPlace(title, placeName) {
  const words = fold(title).split(' ')
  const place = fold(placeName.split('(')[0])
  const head = words.slice(0, 5).join(' ')
  const tokens = place
    .split(' ')
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  if (head.includes(place)) return true
  return tokens.length > 0 && tokens.some((token) => head.includes(token))
}

function assessmentPoints(info) {
  const raw = info.extmetadata?.Assessments?.value || ''
  return raw
    .split('|')
    .map((flag) => ASSESSMENT_POINTS[flag.trim().toLowerCase()] ?? 0)
    .reduce((total, points) => total + points, 0)
}

function scoreCandidate(page, placeName, countryName, usedUrls, relaxed = false) {
  const info = (page.imageinfo || [])[0]
  if (!info) return null
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) return null

  const width = info.width || 0
  const height = info.height || 0
  if (width < (relaxed ? 1200 : 1800) || height < (relaxed ? 800 : 1100)) return null

  const title = page.title || ''
  if (SKIP_TITLE.test(title)) return null
  if (SPECIES_TITLE.test(title)) return null

  const categories = (page.categories || []).map((category) =>
    category.title.replace(/^Category:/, ''),
  )
  if (categories.some((category) => SKIP_CATEGORY.test(category))) return null
  if (categories.some((category) => SKIP_SUBJECT.test(category))) return null
  if (SKIP_SUBJECT.test(title)) return null

  const license = licenseOf(info)
  if (!ALLOWED_LICENSE.test(license.replace(/\s+/g, ' ').trim())) return null
  if (!info.url || usedUrls.has(info.url)) return null

  const relevance = relevanceOf(title, categories, placeName)
  if (relevance === 0) return null
  if (!inCountry(title, categories, countryName)) return null

  const hasPlaceCategory = categories.some((category) =>
    PLACE_CATEGORY.test(category),
  )
  if (!relaxed && !leadsWithPlace(title, placeName) && !hasPlaceCategory) {
    return null
  }

  const megapixels = (width * height) / 1_000_000
  const ratio = width / Math.max(height, 1)

  let score = relevance + assessmentPoints(info)
  score += Math.min(megapixels, 24) * 0.5
  if (fold(title).includes(fold(countryName))) score += 4
  if (ratio >= 1.3 && ratio <= 2.1) score += 8
  else if (ratio >= 1.1) score += 3
  if (height > width) score -= 14
  if (categories.some((category) => PLACE_CATEGORY.test(category))) score += 16
  if (categories.some((category) => DEMOTE_CATEGORY.test(category))) score -= 12
  if (DEMOTE_TITLE.test(title)) score -= 28
  if (/\b(around|near|nearby)\b/i.test(title) && !leadsWithPlace(title, placeName)) {
    score -= 20
  }

  return {
    assessments: info.extmetadata?.Assessments?.value || '',
    descriptionUrl:
      info.descriptionurl ||
      `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    height,
    license,
    mime: info.mime,
    photographer: artistOf(info),
    score,
    title,
    url: info.url,
    width,
  }
}

async function pickPhoto(searchNames, countryName, usedUrls, relaxed = false) {
  let best = null
  for (const placeName of searchNames) {
    const queries = [
      `"${placeName}" incategory:"Featured pictures on Wikimedia Commons"`,
      `"${placeName}" incategory:"Quality images"`,
      `"${placeName}" ${countryName}`,
      `"${placeName}"`,
      `${placeName} ${countryName}`,
    ]
    for (const query of queries) {
      await sleep(220)
      let pages
      try {
        pages = await commonsSearch(query, 20)
      } catch {
        continue
      }
      for (const page of pages) {
        const candidate = scoreCandidate(
          page,
          placeName,
          countryName,
          usedUrls,
          relaxed,
        )
        if (!candidate) continue
        if (!best || candidate.score > best.score) {
          best = { ...candidate, placeName }
        }
      }
      if (best && best.score >= 95) return best
    }
  }
  return best
}

const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')
const onlyArg = process.argv.find((arg) => arg === '--only' || arg.startsWith('--only='))
const only = onlyArg
  ? (onlyArg.includes('=')
      ? onlyArg.slice('--only='.length)
      : process.argv[process.argv.indexOf('--only') + 1] || ''
    )
      .split(',')
      .filter(Boolean)
  : null

const outPath = join(root, 'scripts/places/place-photo-sources.json')
const existing = (() => {
  try {
    return JSON.parse(readFileSync(outPath, 'utf8'))
  } catch {
    return {}
  }
})()

const sources = { ...existing }
const usedUrls = new Set(
  Object.values(sources)
    .map((row) => row.downloadUrl)
    .filter(Boolean),
)
const errors = []
const slugs = Object.keys(targets).filter((slug) => !only || only.includes(slug))
let index = 0

for (const slug of slugs) {
  index++
  const target = targets[slug]
  const label = `[${index}/${slugs.length}] ${slug}`
  if (!force && sources[slug]?.downloadUrl) {
    console.log(`${label} skip (cached source)`)
    usedUrls.add(sources[slug].downloadUrl)
    continue
  }

  try {
    const searchNames = target.searchNames?.length
      ? target.searchNames
      : [target.name]
    process.stdout.write(`${label} ${searchNames[0]}… `)
    if (sources[slug]?.downloadUrl) usedUrls.delete(sources[slug].downloadUrl)

    let picked = await pickPhoto(searchNames, target.countryName, usedUrls)
    if (!picked) {
      picked = await pickPhoto(searchNames, target.countryName, usedUrls, true)
    }
    if (!picked) {
      throw new Error(`no relevant Commons photo for ${searchNames.join(' / ')}`)
    }

    usedUrls.add(picked.url)
    sources[slug] = {
      placeName: picked.placeName || target.name,
      countryName: target.countryName,
      countrySlug: target.countrySlug,
      kind: target.kind,
      downloadUrl: picked.url,
      sourceUrl: picked.descriptionUrl,
      photographer: picked.photographer,
      license: picked.license,
      commonsTitle: picked.title,
      width: picked.width,
      height: picked.height,
      assessments: picked.assessments,
      score: Number(picked.score.toFixed(2)),
    }
    console.log(
      `ok ${picked.score.toFixed(0)}pt ${picked.assessments || 'unassessed'} ${picked.width}×${picked.height} — ${picked.title.replace(/^File:/, '').slice(0, 52)}`,
    )
  } catch (error) {
    console.log('FAIL')
    errors.push(`${slug}: ${error instanceof Error ? error.message : error}`)
  }
}

if (!dryRun) {
  writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
  console.log(`\nWrote ${outPath} (${Object.keys(sources).length} sources)`)
} else {
  console.log('\nDry run — nothing written.')
}

const assessed = Object.values(sources).filter((row) => row.assessments).length
console.log(`Commons-assessed picks: ${assessed}/${Object.keys(sources).length}`)

if (errors.length) {
  console.error('\nCuration failures:\n' + errors.join('\n'))
  process.exit(1)
}
