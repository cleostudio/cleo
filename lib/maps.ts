import attribution from '~/content/maps/attribution.json'
import {
  getCountry,
  getCountryByCode,
  type Country,
} from '~/lib/countries'

export const MAP_MIN_ZOOM = attribution.tiles.minZoom
export const MAP_MAX_ZOOM = attribution.tiles.maxZoom
export const MAP_TILE_SIZE = attribution.tiles.tileSize

/** Local Web Mercator Blue Marble tiles (first-party, CSP-safe). */
export const MAP_TILE_URL = '/images/maps/tiles/{z}/{x}/{y}.jpg'

/** Natural Earth admin-0 boundaries, keyed by ISO 3166-1 alpha-2. */
export const MAP_COUNTRIES_URL = '/maps/countries.geojson'

/** Compact camera index for search, deep links, and antimeridian framing. */
export const MAP_COUNTRY_INDEX_URL = '/maps/country-index.json'

/** First-party MapLibre SDF glyphs (Open Sans Regular / Bold). */
export const MAP_GLYPHS_URL = '/maplibre/fonts/{fontstack}/{range}.pbf'

export const MAP_REGION_IDS = [
  'africa',
  'americas',
  'asia',
  'europe',
  'oceania',
] as const

export type MapRegionId = (typeof MAP_REGION_IDS)[number]

export const MAP_LAYER_IDS = ['borders', 'labels'] as const

export type MapLayerId = (typeof MAP_LAYER_IDS)[number]

export type MapLayerVisibility = Record<MapLayerId, boolean>

export const DEFAULT_MAP_LAYERS: MapLayerVisibility = {
  borders: true,
  labels: true,
}

export const MAP_LAYER_STORAGE_KEY = 'cleo.maps.layers'

export const mapAttribution = attribution

export type MapCountryFeatureProperties = {
  code: string
  name: string
}

export type MapCountryHit = {
  code: string
  name: string
  country?: Country
  href?: string
  mapHref?: string
}

export type MapCountryIndexEntry = {
  code: string
  name: string
  slug: string | null
  region: string | null
  center: [number, number]
  bounds: [[number, number], [number, number]]
  maxZoom: number
}

export type MapRegionCamera = {
  id: string
  label: string
  bounds: [[number, number], [number, number]]
  maxZoom: number
  tally: number
}

export type MapCountryIndex = {
  countries: MapCountryIndexEntry[]
  regions: MapRegionCamera[]
}

export type MapCountryPhoto = {
  code: string
  slug: string
  name: string
  placeName: string
  alt: string
  src: string
  href: string
}

export type MapFocus =
  | { kind: 'country'; value: string }
  | { kind: 'region'; value: string }
  | null

export function resolveMapCountry(
  code: string,
  fallbackName?: string,
): MapCountryHit {
  const normalized = code.toUpperCase()
  const country = getCountryByCode(normalized)
  return {
    code: normalized,
    name: country?.name ?? fallbackName ?? normalized,
    country,
    href: country ? `/explore/${country.slug}` : undefined,
    mapHref: country
      ? mapCountryHref(country.slug)
      : mapCountryHref(normalized.toLowerCase()),
  }
}

/** Deep link into Maps focused on a country slug or ISO code. */
export function mapCountryHref(slugOrCode: string) {
  const trimmed = slugOrCode.trim()
  if (!trimmed) return '/maps'
  return `/maps?country=${encodeURIComponent(trimmed.toLowerCase())}`
}

/** Deep link into Maps framed on a continent region camera. */
export function mapRegionHref(regionId: string) {
  const parsed = parseMapRegionParam(regionId)
  if (!parsed) return '/maps'
  return `/maps?region=${encodeURIComponent(parsed)}`
}

const EXPLORE_REGION_LABELS: Record<MapRegionId, string> = {
  africa: 'Africa',
  americas: 'Americas',
  asia: 'Asia',
  europe: 'Europe',
  oceania: 'Oceania',
}

/** Jump to the matching region heading on the Explore index. */
export function exploreRegionHref(regionIdOrLabel: string) {
  const parsed = parseMapRegionParam(regionIdOrLabel)
  if (!parsed) return '/explore'
  return `/explore#region-${EXPLORE_REGION_LABELS[parsed]}`
}

export function parseMapCountryParam(
  value: string | null | undefined,
): { kind: 'slug' | 'code'; value: string } | null {
  if (!value) return null
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return null
  if (/^[a-z]{2}$/.test(trimmed)) return { kind: 'code', value: trimmed.toUpperCase() }
  return { kind: 'slug', value: trimmed }
}

export function parseMapRegionParam(
  value: string | null | undefined,
): MapRegionId | null {
  if (!value) return null
  const trimmed = value.trim().toLowerCase()
  if (!(MAP_REGION_IDS as readonly string[]).includes(trimmed)) return null
  return trimmed as MapRegionId
}

export function findMapCountryIndexEntry(
  index: readonly MapCountryIndexEntry[],
  slugOrCode: string | null | undefined,
): MapCountryIndexEntry | undefined {
  const parsed = parseMapCountryParam(slugOrCode)
  if (!parsed) return undefined
  if (parsed.kind === 'code') {
    return index.find((entry) => entry.code === parsed.value)
  }
  return (
    index.find((entry) => entry.slug === parsed.value) ??
    index.find((entry) => {
      const country = getCountry(parsed.value)
      return country ? entry.code === country.code : false
    })
  )
}

export function findMapRegionCamera(
  regions: readonly MapRegionCamera[],
  regionId: string | null | undefined,
): MapRegionCamera | undefined {
  const parsed = parseMapRegionParam(regionId)
  if (!parsed) return undefined
  return regions.find((entry) => entry.id === parsed)
}

export function formatMapCoords(lng: number, lat: number) {
  const latHemisphere = lat >= 0 ? 'N' : 'S'
  const lngHemisphere = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${latHemisphere} · ${Math.abs(lng).toFixed(2)}°${lngHemisphere}`
}

/** Keep country and region query params mutually exclusive. */
export function syncMapFocusSearchParams(focus: MapFocus) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.delete('country')
  url.searchParams.delete('region')
  if (focus?.kind === 'country') {
    url.searchParams.set('country', focus.value.toLowerCase())
  } else if (focus?.kind === 'region') {
    url.searchParams.set('region', focus.value.toLowerCase())
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', next)
}

/** @deprecated Prefer syncMapFocusSearchParams — kept for call-site clarity. */
export function syncMapCountrySearchParam(slugOrCode: string | null) {
  syncMapFocusSearchParams(
    slugOrCode ? { kind: 'country', value: slugOrCode } : null,
  )
}

export function boundsArea(
  bounds: [[number, number], [number, number]],
): number {
  const [[west, south], [east, north]] = bounds
  return Math.abs(east - west) * Math.abs(north - south)
}

/** Geographic midpoint of a camera bounds pair (handles dateline wraps). */
export function boundsCenter(
  bounds: [[number, number], [number, number]],
): [number, number] {
  const [[west, south], [east, north]] = bounds
  let midLng = (west + east) / 2
  if (east < west) {
    midLng = ((west + east + 360) / 2) % 360
    if (midLng > 180) midLng -= 360
  }
  return [midLng, (south + north) / 2]
}

export type MapLabelFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    id?: string
    properties: {
      name: string
      code?: string
      rank: number
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

/** Point labels at country index centers, ranked so large places win collisions. */
export function buildCountryLabelCollection(
  countries: readonly MapCountryIndexEntry[],
): MapLabelFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: countries
      .filter((entry) => entry.code !== 'AQ')
      .map((entry) => ({
        type: 'Feature' as const,
        id: entry.code,
        properties: {
          name: entry.name,
          code: entry.code,
          // Lower sort-key → placed first in MapLibre.
          rank: -Math.round(boundsArea(entry.bounds) * 100),
        },
        geometry: {
          type: 'Point' as const,
          coordinates: entry.center,
        },
      })),
  }
}

/** Continent labels at region camera midpoints. */
export function buildRegionLabelCollection(
  regions: readonly MapRegionCamera[],
): MapLabelFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.map((region) => ({
      type: 'Feature' as const,
      id: region.id,
      properties: {
        name: region.label,
        rank: -region.tally,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: boundsCenter(region.bounds),
      },
    })),
  }
}

export function readStoredMapLayers(): MapLayerVisibility {
  if (typeof window === 'undefined') return { ...DEFAULT_MAP_LAYERS }
  try {
    const raw = window.sessionStorage.getItem(MAP_LAYER_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_MAP_LAYERS }
    const parsed = JSON.parse(raw) as Partial<MapLayerVisibility>
    return {
      borders: parsed.borders !== false,
      labels: parsed.labels !== false,
    }
  } catch {
    return { ...DEFAULT_MAP_LAYERS }
  }
}

export function writeStoredMapLayers(layers: MapLayerVisibility) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(MAP_LAYER_STORAGE_KEY, JSON.stringify(layers))
  } catch {
    // Private mode / quota — preference is best-effort.
  }
}

export type MapShareResult = 'shared' | 'copied' | 'failed' | 'aborted'

/** Prefer the Web Share API; fall back to clipboard. */
export async function shareOrCopyMapLink(
  href: string,
  {
    title = 'Cleo Maps',
    text,
  }: { title?: string; text?: string } = {},
): Promise<MapShareResult> {
  const absolute =
    typeof window === 'undefined'
      ? href
      : new URL(href, window.location.origin).href

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url: absolute })
      return 'shared'
    } catch (error) {
      if (
        (error instanceof DOMException || error instanceof Error) &&
        error.name === 'AbortError'
      ) {
        return 'aborted'
      }
      // Fall through to clipboard.
    }
  }

  try {
    await navigator.clipboard.writeText(absolute)
    return 'copied'
  } catch {
    return 'failed'
  }
}
