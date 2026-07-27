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

/** Admin-0 capital points (Natural Earth + atlas capital names). */
export const MAP_CAPITALS_URL = '/maps/capitals.geojson'

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

export const MAP_LAYER_IDS = ['borders', 'labels', 'graticule'] as const

export type MapLayerId = (typeof MAP_LAYER_IDS)[number]

export type MapLayerVisibility = Record<MapLayerId, boolean>

export const DEFAULT_MAP_LAYERS: MapLayerVisibility = {
  borders: true,
  labels: true,
  graticule: false,
}

export const MAP_LAYER_STORAGE_KEY = 'cleo.maps.layers'

/** Default world camera used on first load and Reset. */
export const DEFAULT_MAP_CENTER: [number, number] = [10, 20]
export const DEFAULT_MAP_ZOOM = 1.2

export const mapAttribution = attribution

export type MapCamera = {
  /** Longitude, latitude. */
  center: [number, number]
  zoom: number
}

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
  /** Admin-0 capital [lng, lat] when known. */
  capital?: [number, number]
  capitalName?: string
}

export type MapRegionCamera = {
  id: string
  label: string
  bounds: [[number, number], [number, number]]
  maxZoom: number
  tally: number
}

/**
 * Static continent cameras used when the country index fails to hydrate.
 * Bounds mirror `public/maps/country-index.json` (incl. antimeridian Oceania).
 */
export const FALLBACK_MAP_REGIONS: MapRegionCamera[] = [
  {
    id: 'africa',
    label: 'Africa',
    bounds: [
      [-25.337109, -46.962891],
      [57.791992, 37.340381],
    ],
    maxZoom: 2.54,
    tally: 0,
  },
  {
    id: 'americas',
    label: 'Americas',
    bounds: [
      [-168.088379, -55.889648],
      [-34.805469, 83.116113],
    ],
    maxZoom: 1.82,
    tally: 0,
  },
  {
    id: 'asia',
    label: 'Asia',
    bounds: [
      [25.668945, -10.909277],
      [145.833008, 55.3896],
    ],
    maxZoom: 2.03,
    tally: 0,
  },
  {
    id: 'europe',
    label: 'Europe',
    bounds: [
      [-25, 34],
      [40.126172, 80.477832],
    ],
    maxZoom: 2.92,
    tally: 0,
  },
  {
    id: 'oceania',
    label: 'Oceania',
    bounds: [
      [96.825879, -54.749219],
      [208.217383, 11.168652],
    ],
    maxZoom: 2.14,
    tally: 0,
  },
]

export type MapCountryIndex = {
  countries: MapCountryIndexEntry[]
  regions: MapRegionCamera[]
}

export type MapCountryPhoto = {
  code: string
  slug: string
  name: string
  capital: string
  placeName: string
  alt: string
  src: string
  href: string
  /** Short atlas orientation blurb for the selection plate. */
  aboutExcerpt: string
  /** Notable place names from the Explore field guide. */
  places: string[]
}

export type MapFocus =
  | { kind: 'country'; value: string }
  | { kind: 'region'; value: string }
  | null

export type MapHistoryMode = 'replace' | 'push'

/** Stable key for focus equality (country slug/code or region id). */
export function mapFocusKey(focus: MapFocus): string {
  if (!focus) return ''
  return `${focus.kind}:${focus.value.trim().toLowerCase()}`
}

/** Read mutually exclusive country/region focus from query params. */
export function readMapFocusSearchParams(
  params: Pick<URLSearchParams, 'get'>,
): MapFocus {
  const country = params.get('country')?.trim().toLowerCase()
  if (country) return { kind: 'country', value: country }
  const region = parseMapRegionParam(params.get('region'))
  if (region) return { kind: 'region', value: region }
  return null
}

/** Tab title for the current Maps focus (`Name · Maps`; root template adds `| Cleo`). */
export function mapsFocusDocumentTitle(focus: {
  countryName?: string | null
  regionLabel?: string | null
}): string {
  const country = focus.countryName?.trim()
  if (country) return `${country} · Maps`
  const region = focus.regionLabel?.trim()
  if (region) return `${region} · Maps`
  return 'Maps'
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

function wrapMapLongitude(lng: number) {
  let wrapped = ((((lng + 180) % 360) + 360) % 360) - 180
  // Keep +180 as -180 for a stable hash token.
  if (wrapped === 180) wrapped = -180
  return wrapped
}

function roundMapCameraCoord(value: number, digits: number) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/** Normalize a camera for hashing / equality (MapLibre-style precision). */
export function normalizeMapCamera(camera: MapCamera): MapCamera {
  return {
    center: [
      roundMapCameraCoord(wrapMapLongitude(camera.center[0]), 4),
      roundMapCameraCoord(Math.max(-90, Math.min(90, camera.center[1])), 4),
    ],
    zoom: roundMapCameraCoord(camera.zoom, 2),
  }
}

export function isDefaultMapCamera(camera: MapCamera): boolean {
  const normalized = normalizeMapCamera(camera)
  const defaults = normalizeMapCamera({
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
  })
  return (
    normalized.zoom === defaults.zoom &&
    normalized.center[0] === defaults.center[0] &&
    normalized.center[1] === defaults.center[1]
  )
}

/**
 * MapLibre-compatible camera fragment: `#zoom/lat/lng` (bearing/pitch ignored).
 * Returns null for empty, unrelated, or out-of-range hashes.
 */
export function parseMapCameraHash(
  hash: string | null | undefined,
): MapCamera | null {
  if (!hash) return null
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw || raw.includes('=')) return null
  const parts = raw.split('/')
  if (parts.length < 3) return null
  const zoom = Number(parts[0])
  const lat = Number(parts[1])
  const lng = Number(parts[2])
  if (![zoom, lat, lng].every(Number.isFinite)) return null
  if (zoom < MAP_MIN_ZOOM - 0.5 || zoom > MAP_MAX_ZOOM + 1.5) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return normalizeMapCamera({ center: [lng, lat], zoom })
}

/** Format a camera as `#zoom/lat/lng`. Defaults return an empty string. */
export function formatMapCameraHash(camera: MapCamera): string {
  if (isDefaultMapCamera(camera)) return ''
  const normalized = normalizeMapCamera(camera)
  return `#${normalized.zoom}/${normalized.center[1]}/${normalized.center[0]}`
}

/** Persist the current camera in the URL hash; clear it for the default view. */
export function syncMapCameraHash(camera: MapCamera | null) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!camera || isDefaultMapCamera(camera)) {
    if (!parseMapCameraHash(url.hash)) return
    url.hash = ''
  } else {
    const nextHash = formatMapCameraHash(camera)
    if (!nextHash) {
      url.hash = ''
    } else if (url.hash === nextHash) {
      return
    } else {
      url.hash = nextHash
    }
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', next)
}

/** Current path + search + optional camera hash for sharing the exact view. */
export function mapViewHref(camera?: MapCamera | null): string {
  if (typeof window === 'undefined') {
    return camera ? `/maps${formatMapCameraHash(camera)}` : '/maps'
  }
  const url = new URL(window.location.href)
  if (camera) {
    const hash = formatMapCameraHash(camera)
    url.hash = hash ? hash.slice(1) : ''
  }
  return `${url.pathname}${url.search}${url.hash}`
}

/**
 * Keep country and region query params mutually exclusive.
 * Use `history: 'push'` for discrete selections so Back/Forward restore focus;
 * camera hash and layer flags stay on `replace`.
 */
export function syncMapFocusSearchParams(
  focus: MapFocus,
  { history = 'replace' }: { history?: MapHistoryMode } = {},
) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const previous = readMapFocusSearchParams(url.searchParams)
  url.searchParams.delete('country')
  url.searchParams.delete('region')
  if (focus?.kind === 'country') {
    url.searchParams.set('country', focus.value.toLowerCase())
  } else if (focus?.kind === 'region') {
    url.searchParams.set('region', focus.value.toLowerCase())
  }
  if (mapFocusKey(previous) === mapFocusKey(focus)) return
  const next = `${url.pathname}${url.search}${url.hash}`
  if (history === 'push') {
    window.history.pushState(window.history.state, '', next)
  } else {
    window.history.replaceState(window.history.state, '', next)
  }
}

/** @deprecated Prefer syncMapFocusSearchParams — kept for call-site clarity. */
export function syncMapCountrySearchParam(slugOrCode: string | null) {
  syncMapFocusSearchParams(
    slugOrCode ? { kind: 'country', value: slugOrCode } : null,
  )
}

/** Server metadata copy for `/maps` and `/maps?country=` / `?region=` deep links. */
export function mapsDeepLinkMetadata(
  searchParams: Pick<URLSearchParams, 'get'> | null | undefined,
  index: MapCountryIndex,
): { title: string; description: string } {
  const baseDescription =
    'A realistic interactive map of Earth — NASA Blue Marble imagery, accurate country borders, capitals and territories, and deep links into Explore field guides.'
  const focus = searchParams ? readMapFocusSearchParams(searchParams) : null
  if (focus?.kind === 'country') {
    const entry = findMapCountryIndexEntry(index.countries, focus.value)
    if (entry) {
      return {
        title: `${entry.name} · Maps`,
        description: entry.slug
          ? `View ${entry.name} on Cleo Maps — Blue Marble Earth with borders, and open the Explore field guide.`
          : `View ${entry.name} on Cleo Maps — Blue Marble Earth with Natural Earth borders.`,
      }
    }
  }
  if (focus?.kind === 'region') {
    const region = findMapRegionCamera(index.regions, focus.value)
    if (region) {
      return {
        title: `${region.label} · Maps`,
        description: `Frame ${region.label} on Cleo Maps — ${region.tally} Explore field guides in this region.`,
      }
    }
  }
  return { title: 'Maps', description: baseDescription }
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

function expandBounds(
  bounds: [[number, number], [number, number]],
  padDegrees: number,
): [[number, number], [number, number]] {
  const [[west, south], [east, north]] = bounds
  return [
    [west - padDegrees, Math.max(-90, south - padDegrees)],
    [east + padDegrees, Math.min(90, north + padDegrees)],
  ]
}

/** Axis-aligned lon/lat overlap. Wrapped (dateline) boxes fall back to false. */
export function boundsOverlap(
  a: [[number, number], [number, number]],
  b: [[number, number], [number, number]],
): boolean {
  const [[aw, as], [ae, an]] = a
  const [[bw, bs], [be, bn]] = b
  if (ae < aw || be < bw) return false
  return aw <= be && ae >= bw && as <= bn && an >= bs
}

/** Approximate great-circle-ish distance in degrees (equirectangular). */
export function mapCenterDistanceDeg(
  a: [number, number],
  b: [number, number],
): number {
  let dLng = Math.abs(a[0] - b[0])
  if (dLng > 180) dLng = 360 - dLng
  const dLat = Math.abs(a[1] - b[1])
  const meanLat = ((a[1] + b[1]) / 2) * (Math.PI / 180)
  return Math.hypot(dLng * Math.cos(meanLat), dLat)
}

/**
 * Nearby places for the selection dossier — bounds adjacency with a center
 * distance fallback. Prefers the same region and Explore-linked guides.
 * Does not widen region cameras; callers jump country-by-country.
 */
export function findMapNeighbors(
  entry: MapCountryIndexEntry,
  countries: readonly MapCountryIndexEntry[],
  { limit = 5, padDegrees = 3 } = {},
): MapCountryIndexEntry[] {
  if (limit <= 0) return []
  const expanded = expandBounds(entry.bounds, padDegrees)
  const entryArea = boundsArea(entry.bounds)
  const maxCenterDist = Math.max(10, Math.sqrt(Math.max(entryArea, 0.01)) * 0.55)

  const scored: Array<{
    candidate: MapCountryIndexEntry
    score: number
  }> = []

  for (const candidate of countries) {
    if (candidate.code === entry.code || candidate.code === 'AQ') continue
    const overlap = boundsOverlap(expanded, candidate.bounds)
    const dist = mapCenterDistanceDeg(entry.center, candidate.center)
    if (!overlap && dist > maxCenterDist) continue

    const sameRegion = Boolean(
      entry.region && candidate.region && entry.region === candidate.region,
    )
    let score = dist
    if (sameRegion) score -= 4
    if (candidate.slug) score -= 2
    // Softly prefer compact neighbors over continental giants at similar range.
    score += Math.min(boundsArea(candidate.bounds), 200) * 0.002
    scored.push({ candidate, score })
  }

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map((item) => item.candidate)
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
      labelMinZoom?: number
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

/** Zoom floor so microstates wait until the camera is close enough. */
export function countryLabelMinZoom(
  bounds: [[number, number], [number, number]],
): number {
  const area = boundsArea(bounds)
  if (area >= 80) return 2.1
  if (area >= 20) return 3.0
  if (area >= 5) return 4.0
  if (area >= 1) return 4.8
  return 5.4
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
          labelMinZoom: countryLabelMinZoom(entry.bounds),
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

function coerceLayerFlag(
  value: string | boolean | null | undefined,
  fallback: boolean,
): boolean {
  if (typeof value === 'boolean') return value
  if (value == null) return fallback
  const normalized = String(value).trim().toLowerCase()
  if (normalized === '0' || normalized === 'false' || normalized === 'off') {
    return false
  }
  if (normalized === '1' || normalized === 'true' || normalized === 'on') {
    return true
  }
  return fallback
}

/** Parse optional `borders` / `labels` / `graticule` query flags. */
export function parseMapLayersSearchParams(
  params: Pick<URLSearchParams, 'get'>,
): Partial<MapLayerVisibility> {
  const next: Partial<MapLayerVisibility> = {}
  for (const id of MAP_LAYER_IDS) {
    const raw = params.get(id)
    if (raw == null || raw === '') continue
    next[id] = coerceLayerFlag(raw, DEFAULT_MAP_LAYERS[id])
  }
  return next
}

/** URL partials win over session storage; missing keys keep the stored value. */
export function resolveMapLayers(
  urlPartial: Partial<MapLayerVisibility>,
  stored: MapLayerVisibility = DEFAULT_MAP_LAYERS,
): MapLayerVisibility {
  return {
    borders: urlPartial.borders ?? stored.borders,
    labels: urlPartial.labels ?? stored.labels,
    graticule: urlPartial.graticule ?? stored.graticule,
  }
}

export function readStoredMapLayers(): MapLayerVisibility {
  if (typeof window === 'undefined') return { ...DEFAULT_MAP_LAYERS }
  try {
    const raw = window.sessionStorage.getItem(MAP_LAYER_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_MAP_LAYERS }
    const parsed = JSON.parse(raw) as Partial<MapLayerVisibility>
    return {
      borders: coerceLayerFlag(parsed.borders, DEFAULT_MAP_LAYERS.borders),
      labels: coerceLayerFlag(parsed.labels, DEFAULT_MAP_LAYERS.labels),
      graticule: coerceLayerFlag(parsed.graticule, DEFAULT_MAP_LAYERS.graticule),
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

/** Persist non-default layer flags in the URL; omit defaults to keep shares clean. */
export function syncMapLayersSearchParams(layers: MapLayerVisibility) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  for (const id of MAP_LAYER_IDS) {
    if (layers[id] === DEFAULT_MAP_LAYERS[id]) {
      url.searchParams.delete(id)
    } else {
      url.searchParams.set(id, layers[id] ? '1' : '0')
    }
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', next)
}

/** Append non-default layer flags onto a Maps href. */
export function mapHrefWithLayers(
  href: string,
  layers: MapLayerVisibility,
): string {
  const url = new URL(href, 'https://cleo.local')
  for (const id of MAP_LAYER_IDS) {
    if (layers[id] === DEFAULT_MAP_LAYERS[id]) {
      url.searchParams.delete(id)
    } else {
      url.searchParams.set(id, layers[id] ? '1' : '0')
    }
  }
  return `${url.pathname}${url.search}${url.hash}`
}

export type MapLineFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      kind: 'meridian' | 'parallel'
      value: number
    }
    geometry: {
      type: 'LineString'
      coordinates: [number, number][]
    }
  }>
}

/** Lightweight lat/lng grid for the optional Graticule layer (no tile work). */
export function buildGraticuleCollection(step = 30): MapLineFeatureCollection {
  const features: MapLineFeatureCollection['features'] = []
  const latMax = 80

  for (let lng = -180; lng < 180; lng += step) {
    const coordinates: [number, number][] = []
    for (let lat = -latMax; lat <= latMax; lat += 5) {
      coordinates.push([lng, lat])
    }
    features.push({
      type: 'Feature',
      properties: { kind: 'meridian', value: lng },
      geometry: { type: 'LineString', coordinates },
    })
  }

  for (let lat = -60; lat <= 60; lat += step) {
    const coordinates: [number, number][] = []
    for (let lng = -180; lng <= 180; lng += 5) {
      coordinates.push([lng, lat])
    }
    features.push({
      type: 'Feature',
      properties: { kind: 'parallel', value: lat },
      geometry: { type: 'LineString', coordinates },
    })
  }

  return { type: 'FeatureCollection', features }
}

export type MapSuggestionMatchKind = 'name' | 'code' | 'slug' | 'capital'

/** Why a country index row matched the combobox query. */
export function mapCountrySuggestionMatchKind(
  entry: MapCountryIndexEntry,
  query: string,
  capitals: Readonly<Record<string, string>> = {},
): MapSuggestionMatchKind | null {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return null
  if (entry.code.toLowerCase() === trimmed) return 'code'
  if (entry.slug?.toLowerCase() === trimmed) return 'slug'
  if (entry.name.toLowerCase().includes(trimmed)) return 'name'
  const capital =
    (entry.capitalName ?? capitals[entry.code] ?? '').toLowerCase()
  if (capital.length > 0 && capital.includes(trimmed)) return 'capital'
  return null
}

/** Country index filter for the Maps combobox (name, code, slug, capital). */
export function filterMapCountrySuggestions(
  countries: readonly MapCountryIndexEntry[],
  query: string,
  capitals: Readonly<Record<string, string>> = {},
  limit = 8,
): MapCountryIndexEntry[] {
  if (!query.trim()) return []
  return countries
    .filter((entry) => mapCountrySuggestionMatchKind(entry, query, capitals))
    .slice(0, limit)
}

/** Shorten atlas orientation prose for the Maps selection plate. */
export function excerptMapAbout(about: string, max = 170): string {
  const trimmed = about.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 90 ? lastSpace : max).trimEnd()}…`
}

export type MapShareResult = 'shared' | 'copied' | 'failed' | 'aborted'

function copyTextWithFallback(value: string): boolean {
  try {
    const input = document.createElement('textarea')
    input.value = value
    input.setAttribute('readonly', '')
    input.style.position = 'fixed'
    input.style.top = '0'
    input.style.left = '0'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.focus()
    input.select()
    input.setSelectionRange(0, value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(input)
    return ok
  } catch {
    return false
  }
}

/** Prefer the Web Share API; fall back to clipboard (async API, then execCommand). */
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
    } catch {
      // Cancelled share sheets and unsupported targets fall through to clipboard.
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(absolute)
      return 'copied'
    }
  } catch {
    // Fall through to the legacy copy path.
  }

  return copyTextWithFallback(absolute) ? 'copied' : 'failed'
}
