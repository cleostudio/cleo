#!/usr/bin/env node
/**
 * Builds evergreen About copy + editorial fields for every country into
 * content/atlas.content.json (no photo binaries). Photo import merges later.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const { countries } = await import(join(root, 'src/lib/countries.ts'))
const factsByCode = JSON.parse(
  readFileSync(join(root, 'scripts/atlas/country-facts.json'), 'utf8'),
)
// Orientation prose is curated, not derived. `pnpm write:atlas-about` writes
// it once by hand; nothing here generates copy at build time.
const aboutBySlug = JSON.parse(
  readFileSync(join(root, 'scripts/atlas/atlas-about.json'), 'utf8'),
)

function factbookSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function sourcesFor(country, facts) {
  const slug = factbookSlug(country.name)
  const placeQuery = encodeURIComponent(facts.places[0].name)
  return [
    {
      label: 'CIA World Factbook',
      url: `https://www.cia.gov/the-world-factbook/countries/${slug}/`,
      kind: 'country',
    },
    {
      label: `${facts.places[0].name} — overview`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${placeQuery}`,
      kind: 'place',
    },
    {
      label: 'Encyclopaedia Britannica',
      url: `https://www.britannica.com/search?query=${encodeURIComponent(country.name)}`,
      kind: 'reference',
    },
  ]
}

const missing = []
const missingAbout = []
const content = {}

for (const country of countries) {
  const facts = factsByCode[country.code]
  if (!facts) {
    missing.push(country.code)
    continue
  }
  const about = aboutBySlug[country.slug]
  if (!about) {
    missingAbout.push(country.slug)
    continue
  }
  content[country.slug] = {
    slug: country.slug,
    code: country.code,
    name: country.name,
    region: country.region,
    subregion: country.subregion,
    about,
    facts: {
      capital: facts.capital,
      languages: facts.languages,
      currency: facts.currency,
      areaKm2: facts.areaKm2,
      region: country.region,
    },
    places: facts.places,
    sources: sourcesFor(country, facts),
    pexelsId: facts.pexelsId,
    featuredPlaceName: facts.places[0].name,
  }
}

if (missing.length) {
  console.error('Missing facts for', missing.join(', '))
  process.exit(1)
}

if (missingAbout.length) {
  console.error('Missing Orientation prose for', missingAbout.join(', '))
  console.error('Run: OPENAI_API_KEY=... pnpm write:atlas-about')
  process.exit(1)
}

const out = join(root, 'content/atlas.content.json')
writeFileSync(out, `${JSON.stringify(content, null, 2)}\n`)

// Keep the shipped manifest in step without re-importing photo binaries.
const atlasPath = join(root, 'content/atlas.json')
if (existsSync(atlasPath)) {
  const atlas = JSON.parse(readFileSync(atlasPath, 'utf8'))
  let synced = 0

  for (const [slug, entry] of Object.entries(content)) {
    if (atlas[slug] && atlas[slug].about !== entry.about) {
      atlas[slug].about = entry.about
      synced += 1
    }
  }

  if (synced > 0) {
    writeFileSync(atlasPath, `${JSON.stringify(atlas, null, 2)}\n`)
    console.log(`Synced ${synced} Orientation entries → content/atlas.json`)
  }
}

const words = Object.values(content).map((entry) => wordCount(entry.about))
console.log(
  `Wrote ${Object.keys(content).length} content records → content/atlas.content.json`,
)
console.log(
  `About words min/median/max: ${Math.min(...words)} / ${words.sort((a, b) => a - b)[Math.floor(words.length / 2)]} / ${Math.max(...words)}`,
)
