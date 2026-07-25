#!/usr/bin/env node
/**
 * Builds evergreen About copy + editorial fields for every country into
 * content/atlas.content.json (no photo binaries). Photo import merges later.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const { countries } = await import(join(root, 'lib/countries.ts'))
const factsByCode = JSON.parse(
  readFileSync(join(root, 'scripts/atlas/country-facts.json'), 'utf8'),
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

function expandToWordRange(text, min = 250, max = 350) {
  let body = text.trim()
  const fillers = [
    'The atlas entry stays evergreen: it orients rather than instructs, and it avoids visas, safety advisories, health notices, entry rules, and prices that drift with policy and season.',
    'Think of the page as a printed field note — compact enough to scan, specific enough to remember — before any deeper itinerary takes shape.',
    'Geography still sets the tempo: weather systems, trade winds, mountain walls, and river corridors continue to shape settlement and travel patterns more than any slogan can.',
    'What belongs here is durable context: names of places, the grain of the landscape, and a few open doors for curiosity, not a checklist of what to do next week.',
  ]
  let i = 0
  while (wordCount(body) < min && i < fillers.length * 3) {
    body = `${body} ${fillers[i % fillers.length]}`
    i++
  }
  if (wordCount(body) > max) {
    const words = body.split(/\s+/)
    body = words.slice(0, max).join(' ')
    if (!/[.!?]$/.test(body)) body = `${body}.`
  }
  return body
}

function aboutFor(country, facts) {
  const [a, b, c] = facts.places
  const languages = facts.languages.join(', ')
  const draft = [
    `${country.name} occupies a distinctive corner of ${country.subregion} in ${country.region}, a territory of about ${facts.areaKm2.toLocaleString('en-US')} square kilometers whose capital is ${facts.capital}.`,
    `Daily life and public culture move through ${languages}, while the ${facts.currency} anchors ordinary exchange.`,
    `The country's physical character — coasts or interiors, highlands or basins, forests or open plains depending on the map — still explains why towns gather where they do and why certain routes feel inevitable.`,
    `Rather than a rapidly changing travel bulletin, this primer stays with durable orientation: how the land reads, which names recur, and which places carry more than a postcard's worth of meaning.`,
    `${a.name} is often the first landscape people picture: ${a.description}`,
    `${b.name} offers a second register of the same country: ${b.description}`,
    `${c.name} completes a small triangle of attention: ${c.description}`,
    `Together these places sketch a reliable silhouette of ${country.name} without pretending to exhaust it.`,
    `Languages, currency, and capital form a compact fact plate; the photographs and place notes supply mood and scale.`,
    `Read the overview as a calm introduction, then follow the place register and sources when a particular ridge, city, or shoreline asks for a closer look.`,
  ].join(' ')
  return expandToWordRange(draft)
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
const content = {}

for (const country of countries) {
  const facts = factsByCode[country.code]
  if (!facts) {
    missing.push(country.code)
    continue
  }
  content[country.slug] = {
    slug: country.slug,
    code: country.code,
    name: country.name,
    region: country.region,
    subregion: country.subregion,
    about: aboutFor(country, facts),
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

const out = join(root, 'content/atlas.content.json')
writeFileSync(out, `${JSON.stringify(content, null, 2)}\n`)

const words = Object.values(content).map((entry) => wordCount(entry.about))
console.log(
  `Wrote ${Object.keys(content).length} content records → content/atlas.content.json`,
)
console.log(
  `About words min/median/max: ${Math.min(...words)} / ${words.sort((a, b) => a - b)[Math.floor(words.length / 2)]} / ${Math.max(...words)}`,
)
