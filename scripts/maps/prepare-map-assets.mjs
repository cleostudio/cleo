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

import { mkdir, readFile, writeFile } from 'node:fs/promises'
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

  const json = `${JSON.stringify(collection)}\n`
  for (const outPath of outPaths) {
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, json, 'utf8')
  }
  return collection.features.length
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

async function main() {
  const blueMarble =
    argValue('--blue-marble') || path.join(root, 'public/images/maps/blue-marble.jpg')
  const countriesSrc =
    argValue('--countries') ||
    path.join('/tmp/maps-assets/ne_50m_admin_0_countries.geojson')
  const tilesDir = path.join(root, 'public/images/maps/tiles')
  const countriesPublic = path.join(root, 'public/maps/countries.geojson')
  const attributionOut = path.join(root, 'content/maps/attribution.json')

  const publicBlueMarble = path.join(root, 'public/images/maps/blue-marble.jpg')
  if (path.resolve(blueMarble) !== path.resolve(publicBlueMarble)) {
    await mkdir(path.dirname(publicBlueMarble), { recursive: true })
    await writeFile(publicBlueMarble, await readFile(blueMarble))
  }

  const featureCount = await writeCountries(countriesSrc, [countriesPublic])
  const tileCount = await writeTiles(blueMarble, tilesDir)

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
      },
      null,
      2,
    )}\n`,
  )

  console.log(`countries: ${featureCount}`)
  console.log(`tiles: ${tileCount}`)
  console.log('done')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
