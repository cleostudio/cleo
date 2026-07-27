#!/usr/bin/env node
/**
 * Prepare first-party Maps assets:
 * - Web-Mercator JPEG tiles from NASA Blue Marble (equirectangular)
 * - Simplified Natural Earth admin-0 GeoJSON keyed by ISO_A2
 *
 * Usage:
 *   node scripts/maps/prepare-map-assets.mjs \
 *     --blue-marble=/tmp/maps-assets/blue-marble.jpg \
 *     --countries=/tmp/maps-assets/ne_50m_admin_0_countries.geojson
 */

import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MAX_ZOOM = 4
const TILE_SIZE = 256
const JPEG_QUALITY = 82
const MERCATOR_MAX_LAT = 85.05112878

function argValue(flag) {
  const prefix = `${flag}=`
  const hit = process.argv.find((arg) => arg.startsWith(prefix))
  return hit ? hit.slice(prefix.length) : undefined
}

function simplifyRing(ring, tolerance) {
  if (ring.length <= 4 || tolerance <= 0) return ring
  const sqTol = tolerance * tolerance
  const keep = new Uint8Array(ring.length)
  keep[0] = 1
  keep[ring.length - 1] = 1

  const stack = [[0, ring.length - 1]]
  while (stack.length) {
    const [start, end] = stack.pop()
    const [x1, y1] = ring[start]
    const [x2, y2] = ring[end]
    let maxDist = 0
    let index = -1
    for (let i = start + 1; i < end; i++) {
      const [x, y] = ring[i]
      const dx = x2 - x1
      const dy = y2 - y1
      const lengthSq = dx * dx + dy * dy || 1
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq))
      const projX = x1 + t * dx
      const projY = y1 + t * dy
      const dist = (x - projX) ** 2 + (y - projY) ** 2
      if (dist > maxDist) {
        maxDist = dist
        index = i
      }
    }
    if (index !== -1 && maxDist > sqTol) {
      keep[index] = 1
      stack.push([start, index], [index, end])
    }
  }

  return ring.filter((_, i) => keep[i])
}

function simplifyCoords(coords, type, tolerance) {
  if (type === 'Polygon') {
    return coords
      .map((ring) => simplifyRing(ring, tolerance))
      .filter((ring) => ring.length >= 4)
  }
  if (type === 'MultiPolygon') {
    return coords
      .map((polygon) =>
        polygon
          .map((ring) => simplifyRing(ring, tolerance))
          .filter((ring) => ring.length >= 4),
      )
      .filter((polygon) => polygon.length > 0)
  }
  return coords
}

function isoCode(properties) {
  const eh = properties.ISO_A2_EH
  if (typeof eh === 'string' && eh.length === 2 && eh !== '-99') return eh
  const a2 = properties.ISO_A2
  if (typeof a2 === 'string' && a2.length === 2 && a2 !== '-99') return a2
  return null
}

/**
 * Natural Earth 50m omits a few Explore microstates. Inject small clickable
 * squares so search, borders, and deep links stay complete under CSP.
 * Coordinates are approximate geographic centers (degrees).
 */
const MISSING_EXPLORE_MARKERS = [
  { code: 'MC', name: 'Monaco', lng: 7.424, lat: 43.738 },
  { code: 'MV', name: 'Maldives', lng: 73.509, lat: 4.175 },
  { code: 'NR', name: 'Nauru', lng: 166.931, lat: -0.522 },
  { code: 'TV', name: 'Tuvalu', lng: 179.199, lat: -8.521 },
  { code: 'VA', name: 'Vatican City', lng: 12.453, lat: 41.902 },
]

function markerPolygon(lng, lat, halfSpan = 0.22) {
  const west = lng - halfSpan
  const east = lng + halfSpan
  const south = lat - halfSpan
  const north = lat + halfSpan
  return {
    type: 'Polygon',
    coordinates: [
      [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
      ],
    ],
  }
}

function ensureExploreMarkers(collection) {
  const present = new Set(collection.features.map((feature) => feature.properties.code))
  let added = 0
  for (const marker of MISSING_EXPLORE_MARKERS) {
    if (present.has(marker.code)) continue
    collection.features.push({
      type: 'Feature',
      properties: { code: marker.code, name: marker.name },
      geometry: markerPolygon(marker.lng, marker.lat),
    })
    present.add(marker.code)
    added++
  }
  if (added > 0) {
    collection.features.sort((a, b) =>
      a.properties.code.localeCompare(b.properties.code),
    )
  }
  return added
}

async function writeCountries(sourcePath, outPaths) {
  const raw = JSON.parse(await readFile(sourcePath, 'utf8'))
  const byCode = new Map()

  for (const feature of raw.features) {
    const code = isoCode(feature.properties)
    if (!code) continue
    const geometry = {
      type: feature.geometry.type,
      coordinates: simplifyCoords(feature.geometry.coordinates, feature.geometry.type, 0.04),
    }
    if (
      (geometry.type === 'Polygon' && geometry.coordinates.length === 0) ||
      (geometry.type === 'MultiPolygon' && geometry.coordinates.length === 0)
    ) {
      continue
    }

    const name =
      feature.properties.NAME_LONG ||
      feature.properties.NAME ||
      feature.properties.ADMIN ||
      code

    if (!byCode.has(code)) {
      byCode.set(code, {
        type: 'Feature',
        properties: { code, name },
        geometry,
      })
      continue
    }

    const existing = byCode.get(code)
    const polys = []
    const pushGeom = (geom) => {
      if (geom.type === 'Polygon') polys.push(geom.coordinates)
      else if (geom.type === 'MultiPolygon') polys.push(...geom.coordinates)
    }
    pushGeom(existing.geometry)
    pushGeom(geometry)
    existing.geometry = { type: 'MultiPolygon', coordinates: polys }
  }

  const collection = {
    type: 'FeatureCollection',
    features: [...byCode.values()].sort((a, b) =>
      a.properties.code.localeCompare(b.properties.code),
    ),
  }
  ensureExploreMarkers(collection)

  const json = `${JSON.stringify(collection)}\n`
  for (const outPath of outPaths) {
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, json, 'utf8')
  }
  return collection
}

function wrapLng(lng) {
  let value = lng
  while (value > 180) value -= 360
  while (value < -180) value += 360
  return value
}

function ringArea(ring) {
  let sum = 0
  for (let i = 0; i < ring.length - 1; i++) {
    sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  }
  return sum / 2
}

function ringCentroid(ring) {
  let area = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < ring.length - 1; i++) {
    const cross = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
    area += cross
    cx += (ring[i][0] + ring[i + 1][0]) * cross
    cy += (ring[i][1] + ring[i + 1][1]) * cross
  }
  area *= 0.5
  if (Math.abs(area) < 1e-12) {
    let sx = 0
    let sy = 0
    for (const [x, y] of ring) {
      sx += x
      sy += y
    }
    return [sx / ring.length, sy / ring.length]
  }
  return [cx / (6 * area), cy / (6 * area)]
}

function polygonList(geometry) {
  if (geometry.type === 'Polygon') return [geometry.coordinates]
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  return []
}

function unwrapLng(lng, refLng) {
  let value = lng
  while (value - refLng > 180) value -= 360
  while (value - refLng < -180) value += 360
  return value
}

function cameraFromGeometry(geometry) {
  const polygons = polygonList(geometry)
  if (polygons.length === 0) return null

  let best = polygons[0]
  let bestArea = Math.abs(ringArea(best[0] ?? []))
  for (const polygon of polygons) {
    const area = Math.abs(ringArea(polygon[0] ?? []))
    if (area > bestArea) {
      bestArea = area
      best = polygon
    }
  }

  const [refLng, refLat] = ringCentroid(best[0] ?? [[0, 0]])
  const included = []
  for (const polygon of polygons) {
    const area = Math.abs(ringArea(polygon[0] ?? []))
    const [lng] = ringCentroid(polygon[0] ?? [[refLng, refLat]])
    const delta = Math.abs(unwrapLng(lng, refLng) - refLng)
    // Keep the main landmass and nearby sizable pieces; drop far-flung
    // overseas scraps that would otherwise explode the camera.
    if (delta <= 40 || area >= bestArea * 0.15) included.push(polygon)
  }
  if (included.length === 0) included.push(best)

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const polygon of included) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        const x = unwrapLng(lng, refLng)
        minX = Math.min(minX, x)
        minY = Math.min(minY, lat)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, lat)
      }
    }
  }

  if (!Number.isFinite(minX)) return null

  const spanX = Math.max(maxX - minX, 0.35)
  const spanY = Math.max(maxY - minY, 0.35)
  const span = Math.max(spanX, spanY)
  // Rough zoom so small islands open close and continents stay framed.
  const maxZoom = Math.max(1.4, Math.min(5.4, Math.log2(360 / span) + 0.65))

  return {
    center: [wrapLng((minX + maxX) / 2), (minY + maxY) / 2],
    bounds: [
      [minX, minY],
      [maxX, maxY],
    ],
    maxZoom: Number(maxZoom.toFixed(2)),
  }
}

async function loadCountryMetaByCode() {
  const src = await readFile(path.join(root, 'lib/countries.ts'), 'utf8')
  const codes = [...src.matchAll(/"code":\s*"([A-Z]{2})"/g)].map((match) => match[1])
  const slugs = [...src.matchAll(/"slug":\s*"([^"]+)"/g)].map((match) => match[1])
  const regions = [...src.matchAll(/"region":\s*"([^"]+)"/g)].map((match) => match[1])
  if (codes.length !== slugs.length || codes.length !== regions.length) {
    throw new Error(
      `countries.ts parse mismatch: codes=${codes.length} slugs=${slugs.length} regions=${regions.length}`,
    )
  }
  const map = new Map()
  for (let i = 0; i < codes.length; i++) {
    map.set(codes[i], { slug: slugs[i], region: regions[i] })
  }
  return map
}

/**
 * Union country cameras into a region frame. Pass `refLng` when members mix
 * antimeridian unwraps (Oceania); corners are re-unwrapped against that meridian
 * so west/east don't span a full globe.
 */
function regionCamera(entries, { refLng = null, clamp = null } = {}) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const entry of entries) {
    const [[west, south], [east, north]] = entry.bounds
    const left = refLng == null ? west : unwrapLng(west, refLng)
    const right = refLng == null ? east : unwrapLng(east, refLng)
    minX = Math.min(minX, left, right)
    minY = Math.min(minY, south)
    maxX = Math.max(maxX, left, right)
    maxY = Math.max(maxY, north)
  }
  if (!Number.isFinite(minX)) return null
  if (clamp) {
    if (clamp.west != null) minX = Math.max(minX, clamp.west)
    if (clamp.south != null) minY = Math.max(minY, clamp.south)
    if (clamp.east != null) maxX = Math.min(maxX, clamp.east)
    if (clamp.north != null) maxY = Math.min(maxY, clamp.north)
  }
  if (maxX <= minX || maxY <= minY) return null
  const span = Math.max(maxX - minX, maxY - minY, 1)
  const maxZoom = Math.max(1.2, Math.min(3.4, Math.log2(360 / span) + 0.35))
  return {
    bounds: [
      [minX, minY],
      [maxX, maxY],
    ],
    maxZoom: Number(maxZoom.toFixed(2)),
  }
}

async function writeCountryIndex(collection, outPath) {
  const metaByCode = await loadCountryMetaByCode()
  const entries = []

  for (const feature of collection.features) {
    const code = feature.properties.code
    const camera = cameraFromGeometry(feature.geometry)
    if (!camera) continue
    const meta = metaByCode.get(code)
    entries.push({
      code,
      name: feature.properties.name,
      slug: meta?.slug ?? null,
      region: meta?.region ?? null,
      center: camera.center,
      bounds: camera.bounds,
      maxZoom: camera.maxZoom,
    })
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))

  const regionOrder = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  const regions = []
  for (const label of regionOrder) {
    const members = entries.filter((entry) => entry.region === label && entry.slug)
    // Russia is catalogued under Europe but stretches to the Pacific; keep it
    // in the tally, frame the denser European landmass without it.
    const cameraMembers =
      label === 'Europe' ? members.filter((entry) => entry.code !== 'RU') : members
    const cameraOptions =
      label === 'Oceania'
        ? { refLng: 170 }
        : label === 'Europe'
          ? {
              // Keep Iceland (~-24.5°) and the Mediterranean; drop Azores /
              // Canaries overseas scraps that pull the plate into the Atlantic.
              clamp: { west: -25, south: 34 },
            }
          : {}
    const camera = regionCamera(cameraMembers, cameraOptions)
    if (!camera) continue
    regions.push({
      id: label.toLowerCase(),
      label,
      bounds: camera.bounds,
      maxZoom: camera.maxZoom,
      tally: members.length,
    })
  }

  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(
    outPath,
    `${JSON.stringify({ countries: entries, regions })}\n`,
    'utf8',
  )
  return { countryCount: entries.length, regionCount: regions.length }
}

function renderMercatorCanvas(source, srcWidth, srcHeight, size) {
  const pixels = Buffer.alloc(size * size * 3)
  const ocean = [8, 24, 48]

  for (let py = 0; py < size; py++) {
    const mercatorY = Math.PI * (1 - (2 * (py + 0.5)) / size)
    const lat = (Math.atan(Math.sinh(mercatorY)) * 180) / Math.PI
    if (lat > MERCATOR_MAX_LAT || lat < -MERCATOR_MAX_LAT) {
      for (let px = 0; px < size; px++) {
        const i = (py * size + px) * 3
        pixels[i] = ocean[0]
        pixels[i + 1] = ocean[1]
        pixels[i + 2] = ocean[2]
      }
      continue
    }

    const srcY = Math.min(
      srcHeight - 1,
      Math.max(0, Math.floor(((90 - lat) / 180) * srcHeight)),
    )

    for (let px = 0; px < size; px++) {
      const lon = ((px + 0.5) / size) * 360 - 180
      const srcX = Math.min(
        srcWidth - 1,
        Math.max(0, Math.floor(((lon + 180) / 360) * srcWidth)),
      )
      const si = (srcY * srcWidth + srcX) * 3
      const i = (py * size + px) * 3
      pixels[i] = source[si]
      pixels[i + 1] = source[si + 1]
      pixels[i + 2] = source[si + 2]
    }
  }

  return pixels
}

async function writeTiles(blueMarblePath, tilesDir) {
  const { data, info } = await sharp(blueMarblePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let rgb = data
  if (info.channels === 4) {
    rgb = Buffer.alloc(info.width * info.height * 3)
    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      rgb[j] = data[i]
      rgb[j + 1] = data[i + 1]
      rgb[j + 2] = data[i + 2]
    }
  } else if (info.channels !== 3) {
    throw new Error(`Expected RGB source, got ${info.channels} channels`)
  }

  let tileCount = 0
  for (let z = 0; z <= MAX_ZOOM; z++) {
    const n = 2 ** z
    const size = TILE_SIZE * n
    console.log(`rendering mercator canvas z${z} (${size}×${size})…`)
    const canvas = renderMercatorCanvas(rgb, info.width, info.height, size)
    const image = sharp(canvas, {
      raw: { width: size, height: size, channels: 3 },
    })

    for (let x = 0; x < n; x++) {
      const dir = path.join(tilesDir, String(z), String(x))
      await mkdir(dir, { recursive: true })
      for (let y = 0; y < n; y++) {
        const jpeg = await image
          .clone()
          .extract({
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
          })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toBuffer()
        await writeFile(path.join(dir, `${y}.jpg`), jpeg)
        tileCount++
      }
    }
    console.log(`tiles z${z}: ${n * n}`)
  }
  return tileCount
}

async function copyMapLibreWorkers() {
  const dist = path.join(root, 'node_modules/maplibre-gl/dist')
  const outDir = path.join(root, 'public/maplibre')
  await mkdir(outDir, { recursive: true })
  for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
    await copyFile(path.join(dist, file), path.join(outDir, file))
  }
}

async function main() {
  const skipTiles = process.argv.includes('--skip-tiles')
  const blueMarble =
    argValue('--blue-marble') || path.join(root, 'public/images/maps/blue-marble.jpg')
  const countriesSrc =
    argValue('--countries') ||
    path.join('/tmp/maps-assets/ne_50m_admin_0_countries.geojson')
  const tilesDir = path.join(root, 'public/images/maps/tiles')
  const countriesPublic = path.join(root, 'public/maps/countries.geojson')
  const indexPublic = path.join(root, 'public/maps/country-index.json')
  const attributionOut = path.join(root, 'content/maps/attribution.json')

  const publicBlueMarble = path.join(root, 'public/images/maps/blue-marble.jpg')
  if (path.resolve(blueMarble) !== path.resolve(publicBlueMarble)) {
    await mkdir(path.dirname(publicBlueMarble), { recursive: true })
    await writeFile(publicBlueMarble, await readFile(blueMarble))
  }

  await copyMapLibreWorkers()

  let collection
  try {
    collection = await writeCountries(countriesSrc, [countriesPublic])
  } catch {
    collection = JSON.parse(await readFile(countriesPublic, 'utf8'))
    ensureExploreMarkers(collection)
    await writeFile(countriesPublic, `${JSON.stringify(collection)}\n`, 'utf8')
  }
  const featureCount = collection.features.length
  const { countryCount: indexCount, regionCount } =
    await writeCountryIndex(collection, indexPublic)

  let tileCount = 0
  if (skipTiles) {
    try {
      tileCount = JSON.parse(await readFile(attributionOut, 'utf8')).tiles?.count ?? 0
    } catch {
      tileCount = 0
    }
  } else {
    tileCount = await writeTiles(blueMarble, tilesDir)
  }

  await writeFile(
    attributionOut,
    `${JSON.stringify(
      {
        basemap: {
          name: 'NASA Blue Marble',
          credit:
            'NASA Earth Observatory / NASA Goddard Space Flight Center (Blue Marble Next Generation)',
          sourceUrl: 'https://earthobservatory.nasa.gov/features/BlueMarble',
          license: 'Public domain (US government work)',
        },
        boundaries: {
          name: 'Natural Earth Admin 0 Countries',
          credit: 'Natural Earth',
          sourceUrl: 'https://www.naturalearthdata.com/',
          license: 'Public domain',
          scale: '1:50m',
        },
        tiles: {
          projection: 'Web Mercator (EPSG:3857)',
          minZoom: 0,
          maxZoom: MAX_ZOOM,
          tileSize: TILE_SIZE,
          count: tileCount,
        },
        featureCount,
        indexCount,
        regionCount,
      },
      null,
      2,
    )}\n`,
  )

  console.log(`countries: ${featureCount}`)
  console.log(`index: ${indexCount}`)
  console.log(`regions: ${regionCount}`)
  console.log(`tiles: ${tileCount}${skipTiles ? ' (skipped)' : ''}`)
  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
