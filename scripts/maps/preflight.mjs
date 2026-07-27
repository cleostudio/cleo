#!/usr/bin/env node
/**
 * Validate first-party Maps assets before deploy.
 */

import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

async function assertExists(relativePath) {
  const absolute = path.join(root, relativePath)
  try {
    await access(absolute)
  } catch {
    throw new Error(`Missing Maps asset: ${relativePath}`)
  }
  return absolute
}

async function main() {
  const attributionPath = await assertExists('content/maps/attribution.json')
  const countriesPath = await assertExists('public/maps/countries.geojson')
  const indexPath = await assertExists('public/maps/country-index.json')
  const capitalsPath = await assertExists('public/maps/capitals.geojson')
  await assertExists('public/maplibre/maplibre-gl-worker.mjs')
  await assertExists('public/maplibre/maplibre-gl-shared.mjs')
  await assertExists('public/maplibre/fonts/Open Sans Regular/0-255.pbf')
  await assertExists('public/maplibre/fonts/Open Sans Bold/0-255.pbf')
  await assertExists('public/images/maps/tiles/0/0/0.jpg')

  const attribution = JSON.parse(await readFile(attributionPath, 'utf8'))
  const countries = JSON.parse(await readFile(countriesPath, 'utf8'))
  const index = JSON.parse(await readFile(indexPath, 'utf8'))
  const capitals = JSON.parse(await readFile(capitalsPath, 'utf8'))

  if (!Array.isArray(countries.features) || countries.features.length < 190) {
    throw new Error(`Expected ≥190 country features, got ${countries.features?.length}`)
  }
  if (!Array.isArray(index.countries) || index.countries.length < 190) {
    throw new Error(`Expected ≥190 index countries, got ${index.countries?.length}`)
  }
  if (!Array.isArray(index.regions) || index.regions.length < 5) {
    throw new Error(`Expected 5 region cameras, got ${index.regions?.length}`)
  }
  for (const region of index.regions) {
    const [[west, south], [east, north]] = region.bounds
    const spanX = east - west
    if (!(spanX > 0) || spanX > 200) {
      throw new Error(
        `Region ${region.id} has implausible longitude span ${spanX.toFixed(1)}°`,
      )
    }
    if (!(north > south)) {
      throw new Error(`Region ${region.id} has inverted latitude bounds`)
    }
  }
  const oceania = index.regions.find((region) => region.id === 'oceania')
  if (!oceania || oceania.bounds[1][0] - oceania.bounds[0][0] > 140) {
    throw new Error('Oceania region camera still looks antimeridian-broken')
  }
  const europe = index.regions.find((region) => region.id === 'europe')
  if (!europe || europe.bounds[0][0] < -26 || europe.bounds[0][1] < 33) {
    throw new Error('Europe region camera still pulled by Atlantic overseas scraps')
  }

  const exploreCodes = new Set(
    [...(await readFile(path.join(root, 'lib/countries.ts'), 'utf8')).matchAll(/"code":\s*"([A-Z]{2})"/g)].map(
      (match) => match[1],
    ),
  )
  const indexedExplore = index.countries.filter((entry) => entry.slug)
  for (const entry of indexedExplore) {
    if (!exploreCodes.has(entry.code)) {
      throw new Error(`Index slug entry ${entry.code} is not an Explore country`)
    }
    if (!Array.isArray(entry.bounds) || entry.bounds.length !== 2) {
      throw new Error(`Bad bounds for ${entry.code}`)
    }
    if (
      !Array.isArray(entry.capital) ||
      entry.capital.length !== 2 ||
      !entry.capitalName
    ) {
      throw new Error(`Explore country ${entry.code} is missing a capital point`)
    }
  }
  if (indexedExplore.length !== exploreCodes.size) {
    throw new Error(
      `Explore coverage mismatch: index has ${indexedExplore.length}, countries.ts has ${exploreCodes.size}`,
    )
  }
  if (!Array.isArray(capitals.features) || capitals.features.length < 190) {
    throw new Error(`Expected ≥190 capital points, got ${capitals.features?.length}`)
  }
  const capitalCodes = new Set(
    capitals.features.map((feature) => feature.properties?.code),
  )
  for (const code of exploreCodes) {
    if (!capitalCodes.has(code)) {
      throw new Error(`Missing capital point for Explore country ${code}`)
    }
  }

  // Natural Earth 50m omits these Explore microstates; prepare:maps injects
  // clickable marker polygons so deep links and search stay complete.
  const microstates = ['MC', 'MV', 'NR', 'TV', 'VA']
  const featureCodes = new Set(
    countries.features.map((feature) => feature.properties?.code),
  )
  const indexCodes = new Set(index.countries.map((entry) => entry.code))
  for (const code of microstates) {
    if (!featureCodes.has(code)) {
      throw new Error(`Missing microstate border marker for ${code}`)
    }
    if (!indexCodes.has(code)) {
      throw new Error(`Missing microstate camera index for ${code}`)
    }
    const entry = index.countries.find((item) => item.code === code)
    if (!entry?.slug) {
      throw new Error(`Microstate ${code} should map to an Explore slug`)
    }
  }

  const maxZoom = attribution.tiles?.maxZoom ?? 0
  for (let z = 0; z <= maxZoom; z++) {
    const n = 2 ** z
    await assertExists(`public/images/maps/tiles/${z}/0/0.jpg`)
    await assertExists(`public/images/maps/tiles/${z}/${n - 1}/${n - 1}.jpg`)
  }

  console.log(
    `validate:maps ok — ${countries.features.length} borders, ${indexedExplore.length} explore cameras, ${capitals.features.length} capitals, ${index.regions.length} regions, tiles z0–z${maxZoom}`,
  )
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
