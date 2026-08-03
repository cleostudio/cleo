#!/usr/bin/env node
/**
 * Writes the About prose for every country into
 * scripts/atlas/atlas-about.json, a curated input alongside
 * country-facts.json and atlas-photo-sources.json.
 *
 * This runs by hand, not at build time. The site never calls a model to
 * render a page; the prose is committed like any other content. Re-run it
 * only when the underlying facts change.
 *
 *   OPENAI_API_KEY=... pnpm write:atlas-about            # fill in what is missing
 *   OPENAI_API_KEY=... pnpm write:atlas-about --only=japan,peru
 *   OPENAI_API_KEY=... pnpm write:atlas-about --force    # rewrite everything
 *
 * Every result is checked before it is kept: length, no recycled template
 * phrasing, and none of the volatile claims an about entry should not carry.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import OpenAI from 'openai'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const { countries } = await import(join(root, 'lib/countries.ts'))
const factsByCode = JSON.parse(
  readFileSync(join(root, 'scripts/atlas/country-facts.json'), 'utf8'),
)

const OUT = join(root, 'scripts/atlas/atlas-about.json')
const MODEL = 'gpt-5.6-terra'
const MIN_WORDS = 255
const MAX_WORDS = 345
const CONCURRENCY = 8
const ATTEMPTS = 3

const args = process.argv.slice(2)
const force = args.includes('--force')
const onlyArg = args.find((arg) => arg.startsWith('--only='))
const only = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',')) : null

/** Phrasing from the old template. Its return would mean the sameness is back. */
const RECYCLED = [
  'occupies a distinctive corner',
  'anchors ordinary exchange',
  'coasts or interiors',
  'rapidly changing travel bulletin',
  'first landscape people picture',
  'second register of the same country',
  'small triangle of attention',
  'reliable silhouette',
  'compact fact plate',
  'field guide stays evergreen',
  'printed field note',
]

/**
 * Claims that either drift or are the easiest thing for a model to invent.
 * About prose stays factual; it does not quote figures.
 */
const VOLATILE = [
  { label: 'a year', pattern: /\b(1[5-9]\d{2}|20\d{2})\b/ },
  { label: 'a percentage', pattern: /\d\s?%|\bpercent\b/i },
  { label: 'a population or money figure', pattern: /\b\d[\d,.]*\s?(million|billion|thousand|inhabitants|people|residents|usd|eur|dollars)\b/i },
  { label: 'a price or cost', pattern: /\b(price|cost|cheap|expensive|budget)\b/i },
  { label: 'travel-advisory copy', pattern: /\b(visa|safety|advisory|vaccination|border crossing|entry requirement)\b/i },
  { label: 'a dated reference', pattern: /\b(recently|currently|nowadays|as of|these days|last year|today)\b/i },
  { label: 'brochure superlatives', pattern: /\b(must-see|world-class|breathtaking|stunning|hidden gem|paradise|bucket list)\b/i },
]

const INSTRUCTIONS = `You write About entries for country pages on a general-knowledge portal.

Voice: calm, plain, specific. A knowledgeable geographer describing a place to
someone who has never been. No marketing, no second person, no exhortation.

Every entry must:
- run 265 to 320 words as flowing prose, no headings, lists, or markdown
- open in a way particular to this country, never with a reusable formula
- describe the actual physical geography: the landforms, water, and climate
  that this country really has, and how they shape where people settle
- work in all three listed places by name, each earning its mention through
  what makes it distinct rather than a fixed slot in a sequence
- treat the capital, languages, and currency as context, not a recited list
- read as though written only for this country

Every entry must avoid:
- any statistic, year, date, percentage, population, or money figure
- prices, visas, safety, health, entry rules, or anything that changes with
  policy or season
- "recently", "currently", "today", "as of", or any other time-anchored phrase
- superlatives and travel-brochure language
- claims you are not confident are durably true; when unsure, stay general
  about that detail and be specific about something you do know

Return only the prose.`

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Folds accents and punctuation so "Hulhumalé" matches "Hulhumale". */
function fold(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function prompt(country, facts) {
  const places = facts.places
    .map((place) => `- ${place.name}: ${place.description}`)
    .join('\n')

  return `Country: ${country.name}
Region: ${country.subregion}, ${country.region}
Capital: ${facts.capital}
Languages: ${facts.languages.join(', ')}
Currency: ${facts.currency}
Area: about ${facts.areaKm2.toLocaleString('en-US')} square kilometres

The three places this page features:
${places}

Write the About entry for ${country.name}.`
}

/** Returns a list of problems, empty when the draft is usable. */
function problems(text, country, facts) {
  const found = []
  const words = wordCount(text)
  const lower = text.toLowerCase()
  const folded = fold(text)

  if (words < MIN_WORDS || words > MAX_WORDS) {
    found.push(`${words} words, needs ${MIN_WORDS}-${MAX_WORDS}`)
  }

  if (/[#*_`>|]|^\s*[-–]\s/m.test(text)) {
    found.push('contains markup or list formatting')
  }

  for (const phrase of RECYCLED) {
    if (lower.includes(phrase)) {
      found.push(`recycled template phrase "${phrase}"`)
    }
  }

  for (const { label, pattern } of VOLATILE) {
    const match = pattern.exec(text)

    if (match) {
      found.push(`${label} ("${match[0].trim()}")`)
    }
  }

  // Folded so "São Tomé" matches "Sao Tome", and the leading word alone so a
  // name like "Congo, Democratic Republic of the" is not required verbatim.
  if (!folded.includes(fold(country.name).split(' ')[0])) {
    found.push('never names the country')
  }

  for (const place of facts.places) {
    const name = fold(place.name)
    const words = name.split(' ')
    // A trailing generic word ("Casino", "Region") often reads better folded
    // into the sentence, so the head of the name is enough.
    const head = words.length > 1 ? words.slice(0, -1).join(' ') : name

    if (!folded.includes(name) && !folded.includes(head)) {
      found.push(`never mentions "${place.name}"`)
    }
  }

  return found
}

const existing = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, 'utf8'))
  : {}

const queue = countries.filter((country) => {
  if (only && !only.has(country.slug)) return false
  if (!factsByCode[country.code]) return false

  return force || !existing[country.slug]
})

if (queue.length === 0) {
  console.log('Nothing to write. Pass --force to rewrite, or --only=<slug>.')
  process.exit(0)
}

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required to write About prose.')
  process.exit(1)
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const failures = []
let done = 0

async function write(country) {
  const facts = factsByCode[country.code]
  let lastProblems = []

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    const retry =
      lastProblems.length > 0
        ? `\n\nThe previous draft was rejected for: ${lastProblems.join('; ')}. Fix that and keep everything else.`
        : ''

    const response = await client.responses.create({
      input: prompt(country, facts) + retry,
      instructions: INSTRUCTIONS,
      max_output_tokens: 4096,
      model: MODEL,
      reasoning: { effort: 'low' },
      store: false,
    })

    const text =
      response.output_text
        ?.trim()
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .join('\n') ?? ''

    lastProblems = problems(text, country, facts)

    if (lastProblems.length === 0) {
      existing[country.slug] = text
      done += 1
      console.log(
        `  ${String(done).padStart(3)} ${country.slug} — ${wordCount(text)} words`,
      )
      return
    }
  }

  failures.push(`${country.slug}: ${lastProblems.join('; ')}`)
  console.log(`  --- ${country.slug} FAILED — ${lastProblems.join('; ')}`)
}

console.log(`Writing About prose for ${queue.length} countries...\n`)

const pending = [...queue]

await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, pending.length) }, async () => {
    while (pending.length > 0) {
      const country = pending.shift()

      try {
        await write(country)
      } catch (error) {
        failures.push(
          `${country.slug}: ${error instanceof Error ? error.message : error}`,
        )
        console.log(`  --- ${country.slug} ERROR — ${error}`)
      }
    }
  }),
)

const ordered = Object.fromEntries(
  Object.keys(existing)
    .sort()
    .map((slug) => [slug, existing[slug]]),
)

writeFileSync(OUT, `${JSON.stringify(ordered, null, 2)}\n`)

console.log(
  `\nWrote ${Object.keys(ordered).length} entries → scripts/atlas/atlas-about.json`,
)

if (failures.length) {
  console.error(`\n${failures.length} failed:\n${failures.join('\n')}`)
  console.error('\nRe-run to retry only the missing entries.')
  process.exit(1)
}
