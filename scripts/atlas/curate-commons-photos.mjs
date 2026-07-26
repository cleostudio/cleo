#!/usr/bin/env node
/**
 * Curate one accurate Wikimedia Commons photograph per country featured place.
 *
 * Writes scripts/atlas/atlas-photo-sources.json for import-atlas-photos.mjs.
 * Polite Commons API usage — no API key required.
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

const UA = 'cleo-atlas-curate/1.0 (https://github.com/cleostudio/cleo; knowledge portal photo curation)'
const SKIP_TITLE =
  /\b(map|flag|coat of arms|logo|diagram|chart|svg|locator|location map|orthographic|blank|seal|emblem|passport|stamp|coin|banknote|aircraft|airplane|cockpit|fighter|boeing|airbus|heli(?:copter)?|satellite imagery of|radar|dem |elevation|topograph|bathymetr|census|population|wiki\s*love\s*earth finalist collage|osm|openstreetmap|naval base|paratroop|military|soldier|airport runway|beer)\b/i

const ALLOWED_LICENSE =
  /^(public domain|pd|cc0|cc[- ]?by(?:-sa)?(?:\s*\d(?:\.\d)?)?(?:\s+unported)?|cc-zero)$/i

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

async function commonsSearch(query, limit = 12) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata|canonicaltitle|user',
    format: 'json',
    origin: '*',
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

function scoreCandidate(page, placeName, countryName, usedUrls) {
  const info = (page.imageinfo || [])[0]
  if (!info) return null
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) return null
  const width = info.width || 0
  const height = info.height || 0
  if (width < 1400 || height < 900) return null
  const title = page.title || ''
  if (SKIP_TITLE.test(title)) return null
  const license = licenseOf(info)
  if (!ALLOWED_LICENSE.test(license.replace(/\s+/g, ' ').trim())) return null
  if (!info.url || usedUrls.has(info.url)) return null

  const place = placeName.toLowerCase()
  const country = countryName.toLowerCase()
  const titleLower = title.toLowerCase()
  let score = Math.min(width * height, 40_000_000) / 1_000_000
  if (width >= height) score += 8
  if (width / Math.max(height, 1) >= 1.25) score += 6
  if (titleLower.includes(place.split('(')[0].trim())) score += 18
  if (titleLower.includes(country)) score += 6
  if (/public domain|cc0|pd/i.test(license)) score += 4
  // Prefer not-too-portrait heroes for the 3:2 frame.
  if (height > width * 1.35) score -= 10
  return {
    score,
    title,
    width,
    height,
    url: info.url,
    descriptionUrl:
      info.descriptionurl ||
      `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    license,
    photographer: artistOf(info),
    mime: info.mime,
  }
}

async function pickPhoto(placeName, countryName, usedUrls) {
  const queries = [
    `"${placeName}" ${countryName}`,
    `${placeName} ${countryName}`,
    placeName,
  ]
  let best = null
  for (const query of queries) {
    await sleep(220)
    const pages = await commonsSearch(query, 14)
    for (const page of pages) {
      const candidate = scoreCandidate(page, placeName, countryName, usedUrls)
      if (!candidate) continue
      if (!best || candidate.score > best.score) best = candidate
    }
    if (best && best.score >= 30) break
  }
  return best
}

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

const sources = { ...existing }
const usedUrls = new Set(
  Object.values(sources)
    .map((row) => row.downloadUrl)
    .filter(Boolean),
)
const errors = []
const list = countries.filter((country) => !only || only.includes(country.slug))
let index = 0

for (const country of list) {
  index++
  const fact = facts[country.code]
  if (!fact) {
    errors.push(`${country.slug}: missing country-facts`)
    continue
  }
  const placeName = fact.places[0]?.name
  if (!placeName) {
    errors.push(`${country.slug}: missing featured place`)
    continue
  }

  const label = `[${index}/${list.length}] ${country.slug}`
  if (!process.argv.includes('--force') && sources[country.slug]?.downloadUrl) {
    console.log(`${label} skip (cached source)`)
    usedUrls.add(sources[country.slug].downloadUrl)
    continue
  }

  try {
    process.stdout.write(`${label}… `)
    // Allow replacing a cached URL for this slug.
    if (sources[country.slug]?.downloadUrl) {
      usedUrls.delete(sources[country.slug].downloadUrl)
    }
    const picked = await pickPhoto(placeName, country.name, usedUrls)
    if (!picked) throw new Error(`no suitable Commons photo for ${placeName}`)
    usedUrls.add(picked.url)
    sources[country.slug] = {
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
      score: Number(picked.score.toFixed(2)),
    }
    console.log(`ok (${picked.license}; ${picked.width}×${picked.height})`)
  } catch (error) {
    console.log('FAIL')
    errors.push(`${country.slug}: ${error instanceof Error ? error.message : error}`)
  }
}

writeFileSync(outPath, `${JSON.stringify(sources, null, 2)}\n`)
console.log(`\nWrote ${outPath} (${Object.keys(sources).length} sources)`)
if (errors.length) {
  console.error('\nCuration failures:\n' + errors.join('\n'))
  process.exit(1)
}
