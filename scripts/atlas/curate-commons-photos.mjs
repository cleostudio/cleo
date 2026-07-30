#!/usr/bin/env node
/**
 * Curate three distinct Wikimedia Commons photographs per country.
 *
 * Writes scripts/atlas/atlas-photo-sources.json for import-atlas-photos.mjs.
 * Polite Commons API usage — no API key required.
 *
 *   node scripts/atlas/curate-commons-photos.mjs                 # fill photo slots
 *   node scripts/atlas/curate-commons-photos.mjs --force         # re-pick all
 *   node scripts/atlas/curate-commons-photos.mjs --only=china,peru
 *   node scripts/atlas/curate-commons-photos.mjs --dry-run       # print, don't write
 *
 * Selection is relevance-first. A file only competes if the place name is in
 * its title or one of its categories, because Commons full-text search matches
 * descriptions too and will happily return a tractor for an archipelago.
 * Among relevant files, Commons' own assessments (featured, quality, valued)
 * decide, and pixel count is a tiebreak worth far less than being the right
 * photograph — weighting it heavily is what previously put a window with
 * papers taped to it on the page for Dubrovnik.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

// Load countries from the compiled-ish TS source via a tiny JSON extract:
// parse the exported array by evaluating through a generated snapshot.
const countriesTs = readFileSync(join(root, 'lib/countries.ts'), 'utf8')
const countriesJsonMatch = countriesTs.match(
  /export const countries: Country\[\] = (\[[\s\S]*?\n\])/m,
)
if (!countriesJsonMatch) throw new Error('Could not parse countries from lib/countries.ts')
const countries = Function(`"use strict"; return (${countriesJsonMatch[1]});`)()

const facts = JSON.parse(
  readFileSync(join(root, 'scripts/atlas/country-facts.json'), 'utf8'),
)

const UA =
  'cleo-atlas-curate/2.0 (https://github.com/cleostudio/cleo; knowledge portal photo curation)'

/** Not photographs, or not of a place. */
const SKIP_TITLE =
  /\b(map|flag|coat of arms|logo|diagram|chart|svg|locator|orthographic|blank|seal|emblem|passport|stamp|coin|banknote|aircraft|airplane|cockpit|fighter|boeing|airbus|heli(?:copter)?|satellite imagery of|radar|dem |elevation|topograph|bathymetr|census|population|collage|osm|openstreetmap|naval base|paratroop|military|soldier|airport runway|engraving|lithograph|painting|drawing|sketch|poster|infographic|screenshot|scan of|aktie|share certificate|stock certificate|bond certificate|tafel|hinweistafel|signboard|park sign|canopy bed|hotel suite|bedroom|urban piano)\b/i

const SKIP_CATEGORY =
  /\b(maps|diagrams|drawings|engravings|lithographs|paintings|illustrations|coats of arms|flags of|logos|satellite pictures|satellite images|floor plans|blueprints|icons|scanned|postcards|stamps of|banknotes|charts|documents|certificates|signs in|information boards)\b/i

/**
 * Real photographs at the place, but detail/prop shots that fail as a guide
 * hero — a door, a wall inscription, laundry, a park entrance plaque.
 */
const DEMOTE_TITLE =
  /\b(door|window|detail|scripts?|inscription|close[- ]?up|plaque|sign|balcony|suite|interior|laundry|flower|flowers|bougainvillea)\b/i

/**
 * Photographs taken at the place, but not of it. Commons will happily return a
 * bee-eater in Sundarbans, an ocellated turkey in Petén, and a tractor in the
 * Bijagós — all correctly named, none of them the landscape a reader came for.
 */
const SKIP_SUBJECT =
  /\b(birds?|animals?|mammals?|insects?|reptiles?|amphibians?|fishes|fauna|flora|wildlife|plants|flowers|fungi|butterflies|moths|beetles|arthropods|molluscs|snails|primates|monkeys?|apes|lemurs|antelopes|lizards|snakes|turtles|elephants|tractors?|automobiles|cars|motorcycles|buses|trucks|agricultural machinery|locomotives|foods?|fruits?|apricots?|vegetables|cuisine|dishes|beverages|portraits|clothes|clothing|textiles|costumes|laundry|footwear|jewellery|weapons|coins|books|sports|football|nude)\b/i

/** Categories that say the file is a view of the place itself. */
const PLACE_CATEGORY =
  /\b(views of|aerial (photographs|views)|architecture|buildings|cityscapes|skylines|panoramas of|landscapes|streets in|squares in|churches|cathedrals|basilicas|mosques|temples|monasteries|castles|fortifications|palaces|ruins|mountains|lakes|rivers|waterfalls|glaciers|national parks|beaches|deserts|islands|valleys|canyons|harbours|bridges)\b/i

/** A Latin binomial in the title is a species photograph, not a place. */
const SPECIES_TITLE = /\([A-Z][a-z]+ [a-z]{3,}\)/

/** Softly discouraged: real photographs, but poor gallery heroes. */
const DEMOTE_CATEGORY =
  /\b(black and white photographs|grayscale|historical images|19th-century photographs|panoramics|stitched|night views)\b/i

/**
 * Commons category trees do not always use the registry spelling — it files
 * "Korea, South" under South Korea. Keys are in folded form so they match
 * what `fold()` produces.
 */
const COUNTRY_ALIASES = {
  'cabo verde': ['cabo verde', 'cape verde'],
  'congo democratic republic of the': [
    'democratic republic of the congo', 'dr congo', 'drc', 'zaire', 'congo kinshasa',
  ],
  'cote d ivoire': ['cote d ivoire', 'ivory coast', 'ivorian'],
  'czechia': ['czechia', 'czech republic'],
  'eswatini': ['eswatini', 'swaziland'],
  'gambia the': ['gambia'],
  'holy see': ['holy see', 'vatican'],
  'korea north': ['north korea', 'democratic people s republic of korea'],
  'korea south': ['south korea', 'republic of korea'],
  'micronesia federated states of': ['micronesia'],
  'myanmar': ['myanmar', 'burma'],
  'netherlands': ['netherlands', 'holland', 'dutch'],
  'north macedonia': ['north macedonia', 'macedonia'],
  'russia': ['russia', 'russian'],
  'timor leste': ['timor leste', 'east timor'],
  'turkiye': ['turkiye', 'turkey', 'turkish'],
  'united kingdom': [
    'united kingdom', 'england', 'scotland', 'wales', 'northern ireland', 'british',
  ],
  'united states': ['united states', 'usa', 'american'],
  'vatican city': ['vatican', 'holy see'],
}

const ALLOWED_LICENSE =
  /^(public domain|pd|cc0|cc[- ]?by(?:-sa)?(?:\s*\d(?:\.\d)?)?(?:\s+unported)?|cc-zero)$/i

/** Commons' own peer review. Being the community's pick beats being large. */
const ASSESSMENT_POINTS = {
  featured: 55,
  poty: 24,
  potd: 14,
  quality: 32,
  valued: 18,
}

const STOP_WORDS = new Set([
  'and', 'de', 'del', 'der', 'die', 'el', 'la', 'las', 'les', 'los', 'national',
  'of', 'park', 'the', 'von',
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

/** Folds accents and punctuation so "Djenné" matches "Djenne". */
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

/**
 * Some Commons files put a file note ("NOTE: This image is a panorama…") in
 * the Artist field, or leave it as "Own work". Neither credits anyone, so fall
 * through to the uploader rather than shipping a note as the photographer.
 */
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

/**
 * How strongly a file is about this place. Zero disqualifies: a description
 * mentioning the place is not evidence the photograph shows it.
 */
function relevanceOf(title, categories, placeName) {
  const foldedTitle = fold(title)
  const foldedCategories = categories.map(fold)
  const place = fold(placeName.split('(')[0])
  const tokens = place.split(' ').filter((word) => word.length > 2 && !STOP_WORDS.has(word))

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

/**
 * Guards against a same-named landmark elsewhere. "Basilica of Our Lady of
 * Peace" matched a cathedral in Honolulu before this existed.
 */
function inCountry(title, categories, countryName) {
  const folded = fold(countryName)
  const names = COUNTRY_ALIASES[folded] ?? [folded]
  const haystack = [fold(title), ...categories.map(fold)]

  return names.some((name) => haystack.some((entry) => entry.includes(name)))
}

/** True when the place is named in the opening words of the title. */
function leadsWithPlace(title, placeName) {
  const words = fold(title).split(' ')
  const place = fold(placeName.split('(')[0])
  const head = words.slice(0, 4).join(' ')
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

function scoreCandidate(
  page,
  placeName,
  countryName,
  usedUrls,
  relaxed = false,
  allowPlaceOnly = false,
) {
  const info = (page.imageinfo || [])[0]
  if (!info) return null
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) return null

  const width = info.width || 0
  const height = info.height || 0
  // Heroes render at 2048 on a retina column, so demand real pixels. Small
  // countries with thin Commons coverage get a lower bar rather than a wrong
  // photograph.
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
  if (!inCountry(title, categories, countryName) && (!allowPlaceOnly || relevance < 40)) {
    return null
  }

  const hasPlaceCategory = categories.some((category) =>
    PLACE_CATEGORY.test(category),
  )

  // "Spotted Deer at Sundarbans" names its subject first and the place second.
  // Enumerating species never ends, so read the shape of the title instead: a
  // photograph of a place leads with it, or is filed under a view of it.
  if (!relaxed && !leadsWithPlace(title, placeName) && !hasPlaceCategory) {
    return null
  }

  const megapixels = (width * height) / 1_000_000
  const ratio = width / Math.max(height, 1)

  let score = relevance + assessmentPoints(info)
  // Capped hard: pixels break ties between right answers, they do not choose.
  score += Math.min(megapixels, 24) * 0.5
  if (fold(title).includes(fold(countryName))) score += 4
  if (ratio >= 1.3 && ratio <= 2.1) score += 8
  else if (ratio >= 1.1) score += 3
  if (height > width) score -= 14
  if (categories.some((category) => PLACE_CATEGORY.test(category))) score += 16
  if (categories.some((category) => DEMOTE_CATEGORY.test(category))) score -= 12
  if (DEMOTE_TITLE.test(title)) score -= 28
  // "Around X" / "near X" files are often the café next door, not the place.
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

async function pickPhoto(
  placeName,
  countryName,
  usedUrls,
  relaxed = false,
  allowPlaceOnly = false,
) {
  // Assessment-scoped passes first: they usually settle it outright.
  const queries = [
    `"${placeName}" incategory:"Featured pictures on Wikimedia Commons"`,
    `"${placeName}" incategory:"Quality images"`,
    `"${placeName}" ${countryName}`,
    `"${placeName}"`,
    `${placeName} ${countryName}`,
  ]
  let best = null

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
        allowPlaceOnly,
      )
      if (!candidate) continue
      if (!best || candidate.score > best.score) best = candidate
    }

    // A featured or quality photograph of the right place is already the answer.
    if (best && best.score >= 95) break
  }

  return best
}

const dryRun = process.argv.includes('--dry-run')
const onlyArg = process.argv.find((arg) => arg === '--only' || arg.startsWith('--only='))
const only = onlyArg
  ? (onlyArg.includes('=')
      ? onlyArg.slice('--only='.length)
      : process.argv[process.argv.indexOf('--only') + 1] || ''
    )
      .split(',')
      .filter(Boolean)
  : null

const outPath = join(root, 'scripts/atlas/atlas-photo-sources.json')
const existing = (() => {
  try {
    return JSON.parse(readFileSync(outPath, 'utf8'))
  } catch {
    return {}
  }
})()

function sourceRows(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const sources = Object.fromEntries(
  Object.entries(existing).map(([slug, value]) => [slug, sourceRows(value)]),
)
const usedUrls = new Set(
  Object.values(sources)
    .flat()
    .map((row) => row.downloadUrl)
    .filter(Boolean),
)
const errors = []
const list = countries.filter((country) => !only || only.includes(country.slug))
let index = 0

function samePlace(a, b) {
  return fold(a) === fold(b)
}

function sourceRecord(country, placeName, picked) {
  return {
    placeName,
    countryName: country.name,
    code: country.code,
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
}

async function pickDistinctPhoto(placeNames, countryName, rows) {
  const represented = rows.map((row) => row.placeName)
  const preferred = placeNames.filter(
    (place) => !represented.some((existingPlace) => samePlace(existingPlace, place)),
  )
  const candidates = preferred.length > 0 ? preferred : placeNames

  for (const options of [
    { relaxed: false, allowPlaceOnly: false },
    { relaxed: true, allowPlaceOnly: false },
    { relaxed: true, allowPlaceOnly: true },
  ]) {
    const picks = []
    for (const placeName of candidates) {
      const picked = await pickPhoto(
        placeName,
        countryName,
        usedUrls,
        options.relaxed,
        options.allowPlaceOnly,
      )
      if (picked) picks.push({ placeName, picked })
    }
    if (picks.length > 0) {
      return picks.reduce((best, current) =>
        current.picked.score > best.picked.score ? current : best,
      )
    }
  }

  return null
}

for (const country of list) {
  index++
  const fact = facts[country.code]
  if (!fact) {
    errors.push(`${country.slug}: missing country-facts`)
    continue
  }
  const placeNames = fact.places.map((place) => place.name).filter(Boolean)
  if (placeNames.length === 0) {
    errors.push(`${country.slug}: missing featured place`)
    continue
  }

  const label = `[${index}/${list.length}] ${country.slug}`
  const cached = sourceRows(sources[country.slug])
  if (!process.argv.includes('--force') && cached.length >= 3) {
    console.log(`${label} skip (three cached sources)`)
    continue
  }

  try {
    const rows = process.argv.includes('--force') ? [] : [...cached]
    if (process.argv.includes('--force')) {
      for (const row of cached) usedUrls.delete(row.downloadUrl)
    }

    process.stdout.write(`${label} ${rows.length}/3… `)
    while (rows.length < 3) {
      const next = await pickDistinctPhoto(placeNames, country.name, rows)
      if (!next) {
        throw new Error(`no relevant Commons photo for ${placeNames.join(' / ')}`)
      }
      rows.push(sourceRecord(country, next.placeName, next.picked))
      usedUrls.add(next.picked.url)
    }

    sources[country.slug] = rows
    console.log(
      `ok ${rows
        .map((row) => `${row.placeName} ${row.score?.toFixed?.(0) ?? 'handpicked'}pt`)
        .join(' · ')}`,
    )
  } catch (error) {
    console.log('FAIL')
    errors.push(`${country.slug}: ${error instanceof Error ? error.message : error}`)
  }
}

if (!dryRun) {
  writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
  console.log(`\nWrote ${outPath} (${Object.keys(sources).length} sources)`)
} else {
  console.log('\nDry run — nothing written.')
}

const allRows = Object.values(sources).flat()
const assessed = allRows.filter((row) => row.assessments).length
console.log(`Commons-assessed picks: ${assessed}/${allRows.length}`)

if (errors.length) {
  console.error('\nCuration failures:\n' + errors.join('\n'))
  process.exit(1)
}
