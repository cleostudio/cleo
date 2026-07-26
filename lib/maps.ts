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

export const MAP_REGION_IDS = [
  'africa',
  'americas',
  'asia',
  'europe',
  'oceania',
] as const

export type MapRegionId = (typeof MAP_REGION_IDS)[number]

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
