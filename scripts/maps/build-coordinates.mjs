/**
 * Build content/maps-coordinates.json from the public mledoze/countries
 * dataset (country geographic centers), keyed by Explore slug.
 *
 *   pnpm exec tsx scripts/maps/build-coordinates.mjs
 */

import { writeFileSync } from 'node:fs'

import { countries } from '../../lib/countries.ts'

const SOURCE =
  'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'

const response = await fetch(SOURCE)
if (!response.ok) throw new Error(`coordinates source HTTP ${response.status}`)

/** @type {Array<{ cca2?: string, latlng?: [number, number] }>} */
const rows = await response.json()
if (!Array.isArray(rows)) throw new Error('coordinates source was not an array')

const byCode = new Map(
  rows
    .filter((row) => row.cca2 && Array.isArray(row.latlng) && row.latlng.length >= 2)
    .map((row) => [row.cca2.toUpperCase(), row.latlng]),
)

const missing = []
/** @type {Record<string, { latitude: number, longitude: number, label: string }>} */
const entries = {}

for (const country of countries) {
  const coords = byCode.get(country.code)
  if (!coords) {
    missing.push(`${country.slug} (${country.code})`)
    continue
  }
  entries[country.slug] = {
    latitude: Number(Number(coords[0]).toFixed(4)),
    longitude: Number(Number(coords[1]).toFixed(4)),
    label: country.name,
  }
}

writeFileSync(
  new URL('../../content/maps-coordinates.json', import.meta.url),
  `${JSON.stringify(entries, null, 2)}\n`,
)

console.log(`wrote ${Object.keys(entries).length}/${countries.length} from ${SOURCE}`)
if (missing.length) console.log('missing', missing.join(', '))
