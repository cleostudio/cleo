/**
 * Explore-country places on the Maps globe — geographic centers keyed by slug.
 */

import coordinates from '~/content/maps-coordinates.json'
import { countries } from '~/lib/countries'
import { latLngToScene } from '~/lib/maps/geo'

export interface MapPlace {
  slug: string
  code: string
  name: string
  region: string
  subregion: string
  latitude: number
  longitude: number
  /** Unit direction in scene space (Y-up sphere). */
  direction: [number, number, number]
}

type CoordinateRecord = {
  latitude: number
  longitude: number
  label: string
}

const coordinateTable = coordinates as Record<string, CoordinateRecord>

function buildPlaces(): MapPlace[] {
  const places: MapPlace[] = []
  for (const country of countries) {
    const coords = coordinateTable[country.slug]
    if (!coords) continue
    places.push({
      slug: country.slug,
      code: country.code,
      name: country.name,
      region: country.region,
      subregion: country.subregion,
      latitude: coords.latitude,
      longitude: coords.longitude,
      direction: latLngToScene(coords.latitude, coords.longitude, 1),
    })
  }
  return places
}

export const mapPlaces: MapPlace[] = buildPlaces()

const placesBySlug = new Map(mapPlaces.map((place) => [place.slug, place]))

export function getMapPlace(slug: string): MapPlace | undefined {
  return placesBySlug.get(slug)
}

/** Cosine of the max angular distance (~9°) for click-to-select. */
export const PLACE_PICK_MIN_DOT = Math.cos((9 * Math.PI) / 180)

/**
 * Nearest place to a unit (or near-unit) direction on the globe.
 * Returns null when nothing is within `PLACE_PICK_MIN_DOT`.
 */
export function nearestMapPlace(
  direction: readonly [number, number, number],
  minDot = PLACE_PICK_MIN_DOT,
): MapPlace | null {
  const length = Math.hypot(direction[0], direction[1], direction[2]) || 1
  const x = direction[0] / length
  const y = direction[1] / length
  const z = direction[2] / length

  let best: MapPlace | null = null
  let bestDot = minDot
  for (const place of mapPlaces) {
    const [px, py, pz] = place.direction
    const dot = px * x + py * y + pz * z
    if (dot > bestDot) {
      bestDot = dot
      best = place
    }
  }
  return best
}

/** Case-insensitive name / code / region filter for the Maps search field. */
export function filterMapPlaces(query: string, limit = 8): MapPlace[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const scored: { place: MapPlace; score: number }[] = []
  for (const place of mapPlaces) {
    const name = place.name.toLowerCase()
    const code = place.code.toLowerCase()
    const region = place.region.toLowerCase()
    const subregion = place.subregion.toLowerCase()
    const slug = place.slug.toLowerCase()

    let score = 0
    if (code === needle) score = 100
    else if (name === needle || slug === needle) score = 90
    else if (name.startsWith(needle) || slug.startsWith(needle)) score = 70
    else if (name.includes(needle) || slug.includes(needle)) score = 50
    else if (region.includes(needle) || subregion.includes(needle)) score = 20
    else continue

    scored.push({ place, score })
  }

  scored.sort(
    (a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name),
  )
  return scored.slice(0, limit).map((entry) => entry.place)
}
