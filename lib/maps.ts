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
  center: [number, number]
  bounds: [[number, number], [number, number]]
  maxZoom: number
}

export type MapCountryIndex = {
  countries: MapCountryIndexEntry[]
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

export function parseMapCountryParam(
  value: string | null | undefined,
): { kind: 'slug' | 'code'; value: string } | null {
  if (!value) return null
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return null
  if (/^[a-z]{2}$/.test(trimmed)) return { kind: 'code', value: trimmed.toUpperCase() }
  return { kind: 'slug', value: trimmed }
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

export function formatMapCoords(lng: number, lat: number) {
  const latHemisphere = lat >= 0 ? 'N' : 'S'
  const lngHemisphere = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${latHemisphere} · ${Math.abs(lng).toFixed(2)}°${lngHemisphere}`
}

export function syncMapCountrySearchParam(slugOrCode: string | null) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (slugOrCode) {
    url.searchParams.set('country', slugOrCode.toLowerCase())
  } else {
    url.searchParams.delete('country')
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', next)
}
