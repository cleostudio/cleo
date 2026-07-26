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
  await assertExists('public/maplibre/maplibre-gl-worker.mjs')
  await assertExists('public/maplibre/maplibre-gl-shared.mjs')
  await assertExists('public/images/maps/tiles/0/0/0.jpg')

  const attribution = JSON.parse(await readFile(attributionPath, 'utf8'))
  const countries = JSON.parse(await readFile(countriesPath, 'utf8'))
  const index = JSON.parse(await readFile(indexPath, 'utf8'))

  if (!Array.isArray(countries.features) || countries.features.length < 190) {
    throw new Error(`Expected ≥190 country features, got ${countries.features?.length}`)
  }
  if (!Array.isArray(index.countries) || index.countries.length < 190) {
    throw new Error(`Expected ≥190 index countries, got ${index.countries?.length}`)
  }
  if (!Array.isArray(index.regions) || index.regions.length < 5) {
    throw new Error(`Expected 5 region cameras, got ${index.regions?.length}`)
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
  }
  if (indexedExplore.length !== exploreCodes.size) {
    throw new Error(
      `Explore coverage mismatch: index has ${indexedExplore.length}, countries.ts has ${exploreCodes.size}`,
    )
  }

  const maxZoom = attribution.tiles?.maxZoom ?? 0
  for (let z = 0; z <= maxZoom; z++) {
    const n = 2 ** z
    await assertExists(`public/images/maps/tiles/${z}/0/0.jpg`)
    await assertExists(`public/images/maps/tiles/${z}/${n - 1}/${n - 1}.jpg`)
  }

  console.log(
    `validate:maps ok — ${countries.features.length} borders, ${indexedExplore.length} explore cameras, ${index.regions.length} regions, tiles z0–z${maxZoom}`,
  )
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
