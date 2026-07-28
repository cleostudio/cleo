'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
  type FilterSpecification,
  type GeoJSONSource,
  type MapLayerMouseEvent,
  type MapMouseEvent,
  type StyleSpecification,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { ZoomImage } from '~/components/zoom-image'
import { galleryHref } from '~/lib/gallery'
import { ensureMapLibreWorker } from '~/lib/maplibre-worker'
import {
  buildCountryLabelCollection,
  buildGraticuleCollection,
  buildRegionLabelCollection,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_LAYERS,
  DEFAULT_MAP_ZOOM,
  FALLBACK_MAP_REGIONS,
  exploreRegionHref,
  filterMapSuggestions,
  findMapCountryIndexEntry,
  findMapNeighbors,
  findMapRegionCamera,
  findMapRegionSamples,
  formatMapCoords,
  MAP_CAPITALS_URL,
  MAP_COUNTRIES_URL,
  MAP_COUNTRY_INDEX_URL,
  MAP_GLYPHS_URL,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_TILE_SIZE,
  MAP_TILE_URL,
  mapAttribution,
  mapCapitalCamera,
  mapCountryHref,
  mapRegionHref,
  mapShareHref,
  mapSuggestionSecondary,
  mapsFocusDocumentTitle,
  mapViewHref,
  normalizeMapCamera,
  parseMapCameraHash,
  parseMapLayersSearchParams,
  parseMapRegionParam,
  readStoredMapLayers,
  resolveMapCountry,
  resolveMapIdleStarters,
  resolveMapLayers,
  shareOrCopyMapLink,
  syncMapCameraHash,
  syncMapFocusSearchParams,
  syncMapLayersSearchParams,
  writeStoredMapLayers,
  type MapCamera,
  type MapCountryHit,
  type MapCountryIndex,
  type MapCountryIndexEntry,
  type MapCountryPhoto,
  type MapLayerId,
  type MapLayerVisibility,
  type MapRegionCamera,
  type MapSearchSuggestion,
} from '~/lib/maps'
import { cn } from '~/lib/utils'

type EarthMapProps = {
  className?: string
  countryPhotos?: Record<string, MapCountryPhoto>
  /** Server-hydrated camera index so search/deep links skip a client fetch. */
  initialIndex?: MapCountryIndex
}

const MAPS_GLASS_STYLE = {
  backdropFilter: 'blur(12px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(12px) saturate(1.25)',
} as React.CSSProperties

function MapsGlass() {
  return <span className="earth-map-glass" aria-hidden style={MAPS_GLASS_STYLE} />
}

const MAP_FOCUS_PADDING = {
  top: 150,
  bottom: 170,
  left: 48,
  right: 48,
} as const

const MAP_FOCUS_PADDING_NARROW = {
  top: 120,
  bottom: 210,
  left: 28,
  right: 28,
} as const

const MAP_REGION_PADDING = {
  top: 120,
  bottom: 140,
  left: 40,
  right: 40,
} as const

const MAP_REGION_PADDING_NARROW = {
  top: 96,
  bottom: 180,
  left: 24,
  right: 24,
} as const

/** Measured bottom-chrome height (dossier/idle + credit); drives fit padding. */
let measuredDossierLiftPx = 0

function setMeasuredDossierLiftPx(px: number) {
  measuredDossierLiftPx = Math.max(0, Math.round(px))
}

function withMeasuredBottomPadding(base: {
  top: number
  bottom: number
  left: number
  right: number
}) {
  if (measuredDossierLiftPx <= 0) return { ...base }
  return {
    ...base,
    bottom: Math.max(base.bottom, measuredDossierLiftPx + 28),
  }
}

/** Keyboard activation (Enter/Space) reports detail 0; pointer clicks are > 0. */
function isKeyboardActivation(
  event: { detail?: number } | null | undefined,
): boolean {
  return (event?.detail ?? 1) === 0
}

function mapFocusPadding() {
  const base =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 40rem)').matches
      ? MAP_FOCUS_PADDING_NARROW
      : MAP_FOCUS_PADDING
  return withMeasuredBottomPadding(base)
}

function mapRegionPadding() {
  const base =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 40rem)').matches
      ? MAP_REGION_PADDING_NARROW
      : MAP_REGION_PADDING
  return withMeasuredBottomPadding(base)
}

function basemapStyle(): StyleSpecification {
  return {
    version: 8,
    glyphs: MAP_GLYPHS_URL,
    sources: {
      blueMarble: {
        type: 'raster',
        tiles: [MAP_TILE_URL],
        tileSize: MAP_TILE_SIZE,
        minzoom: MAP_MIN_ZOOM,
        maxzoom: MAP_MAX_ZOOM,
        attribution: mapAttribution.basemap.credit,
      },
    },
    layers: [
      {
        id: 'blue-marble',
        type: 'raster',
        source: 'blueMarble',
      },
    ],
  }
}

/** Drawn border strokes — toggled by the Borders control. */
const BORDER_LINE_LAYER_IDS = ['country-line'] as const
/**
 * Invisible hit fill stays mounted so hover/click/Enter-at-center keep working
 * when Borders are off (capitals alone are not enough).
 */
const BORDER_HIT_LAYER_IDS = ['country-fill'] as const
const LABEL_LAYER_IDS = ['region-labels', 'country-labels'] as const
const CAPITAL_LAYER_IDS = [
  'capital-hits',
  'capital-dots',
  'capital-labels',
] as const
const GRATICULE_LAYER_IDS = ['graticule-lines'] as const

function addGraticuleLayer(map: MapLibreMap) {
  if (!map.getSource('graticule')) {
    map.addSource('graticule', {
      type: 'geojson',
      data: buildGraticuleCollection(30),
    })
  }

  if (!map.getLayer('graticule-lines')) {
    map.addLayer(
      {
        id: 'graticule-lines',
        type: 'line',
        source: 'graticule',
        layout: {
          visibility: 'none',
        },
        paint: {
          'line-color': 'rgba(255, 255, 255, 0.28)',
          'line-width': [
            'case',
            ['==', ['get', 'value'], 0],
            1.15,
            0.55,
          ],
          'line-opacity': [
            'case',
            ['==', ['get', 'value'], 0],
            0.55,
            0.32,
          ],
        },
      },
      map.getLayer('country-fill') ? 'country-fill' : undefined,
    )
  }
}

function addCountryLayers(map: MapLibreMap) {
  if (map.getSource('countries')) return

  map.addSource('countries', {
    type: 'geojson',
    data: MAP_COUNTRIES_URL,
    attribution: mapAttribution.boundaries.credit,
    promoteId: 'code',
  })

  // WebGL paint values cannot read CSS variables; warm signal-adjacent oranges
  // are fixed here to match --signal on the Blue Marble basemap.
  map.addLayer({
    id: 'country-fill',
    type: 'fill',
    source: 'countries',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        'rgba(232, 156, 74, 0.38)',
        ['boolean', ['feature-state', 'hover'], false],
        'rgba(255, 255, 255, 0.2)',
        'rgba(0, 0, 0, 0)',
      ],
      'fill-opacity': 1,
    },
  })

  map.addLayer({
    id: 'country-line',
    type: 'line',
    source: 'countries',
    paint: {
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        'rgba(255, 196, 120, 0.95)',
        ['boolean', ['feature-state', 'hover'], false],
        'rgba(255, 255, 255, 0.92)',
        'rgba(255, 255, 255, 0.42)',
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        1.6,
        ['boolean', ['feature-state', 'hover'], false],
        1.25,
        0.6,
      ],
      'line-opacity': 0.95,
    },
  })
}

function upsertLabelLayers(
  map: MapLibreMap,
  countries: readonly MapCountryIndexEntry[],
  regions: readonly MapRegionCamera[],
) {
  const countryData = buildCountryLabelCollection(countries)
  const regionData = buildRegionLabelCollection(regions)

  const countrySource = map.getSource('country-labels') as GeoJSONSource | undefined
  if (countrySource) {
    countrySource.setData(countryData)
  } else {
    map.addSource('country-labels', {
      type: 'geojson',
      data: countryData,
    })
  }

  const regionSource = map.getSource('region-labels') as GeoJSONSource | undefined
  if (regionSource) {
    regionSource.setData(regionData)
  } else {
    map.addSource('region-labels', {
      type: 'geojson',
      data: regionData,
    })
  }

  if (!map.getLayer('region-labels')) {
    map.addLayer({
      id: 'region-labels',
      type: 'symbol',
      source: 'region-labels',
      maxzoom: 3.6,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          11,
          2,
          14,
          3.5,
          16,
        ],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.14,
        'text-max-width': 8,
        'text-padding': 12,
        'text-allow-overlap': false,
        'symbol-sort-key': ['get', 'rank'],
      },
      paint: {
        'text-color': 'rgba(255, 255, 255, 0.9)',
        'text-halo-color': 'rgba(8, 16, 28, 0.78)',
        'text-halo-width': 1.4,
        'text-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.92,
          2.4,
          0.85,
          3.5,
          0,
        ],
      },
    })
  }

  if (!map.getLayer('country-labels')) {
    map.addLayer({
      id: 'country-labels',
      type: 'symbol',
      source: 'country-labels',
      minzoom: 2.1,
      filter: ['<=', ['get', 'labelMinZoom'], ['zoom']],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular'],
        'text-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.1,
          10,
          4,
          12,
          6,
          14,
        ],
        'text-max-width': 7,
        'text-padding': 8,
        'text-optional': true,
        'text-allow-overlap': false,
        'symbol-sort-key': ['get', 'rank'],
      },
      paint: {
        'text-color': 'rgba(255, 252, 246, 0.94)',
        'text-halo-color': 'rgba(10, 18, 30, 0.82)',
        'text-halo-width': 1.15,
        'text-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.1,
          0,
          2.6,
          0.88,
          6,
          0.95,
        ],
      },
    })
  }
}

function addCapitalLayers(map: MapLibreMap) {
  if (!map.getSource('capitals')) {
    map.addSource('capitals', {
      type: 'geojson',
      data: MAP_CAPITALS_URL,
      attribution: mapAttribution.capitals?.credit ?? mapAttribution.boundaries.credit,
      promoteId: 'code',
    })
  }

  // Invisible hit pad so capital clicks are reliable at small radii.
  if (!map.getLayer('capital-hits')) {
    map.addLayer({
      id: 'capital-hits',
      type: 'circle',
      source: 'capitals',
      minzoom: 2.8,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.8,
          10,
          5,
          14,
          6.5,
          16,
        ],
        'circle-color': '#000000',
        'circle-opacity': 0,
      },
    })
  }

  if (!map.getLayer('capital-dots')) {
    map.addLayer({
      id: 'capital-dots',
      type: 'circle',
      source: 'capitals',
      minzoom: 2.8,
      paint: {
        // zoom must be the top-level interpolate input — nest feature-state inside stops.
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.8,
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            4.4,
            2.2,
          ],
          5,
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            6.2,
            3.4,
          ],
          6.5,
          [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            7,
            4.2,
          ],
        ],
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          'rgba(255, 196, 120, 1)',
          'rgba(255, 236, 200, 0.95)',
        ],
        'circle-stroke-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          'rgba(255, 220, 160, 0.95)',
          'rgba(20, 28, 40, 0.75)',
        ],
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1.7,
          1,
        ],
        'circle-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2.8,
          0,
          3.2,
          0.9,
        ],
      },
    })
  }

  if (!map.getLayer('capital-labels')) {
    map.addLayer({
      id: 'capital-labels',
      type: 'symbol',
      source: 'capitals',
      minzoom: 4.2,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular'],
        // feature-state is paint-only in MapLibre — keep size static here.
        'text-size': 11,
        'text-offset': [0, 1.05],
        'text-anchor': 'top',
        'text-padding': 4,
        'text-optional': true,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          'rgba(255, 220, 160, 0.98)',
          'rgba(255, 244, 220, 0.92)',
        ],
        'text-halo-color': 'rgba(10, 18, 30, 0.8)',
        'text-halo-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1.35,
          1.05,
        ],
        'text-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4.2,
          0,
          4.7,
          0.9,
        ],
      },
    })
  }
}

/**
 * Capitals follow Labels when browsing, but the selected capital stays visible
 * (and clickable) even when Labels are toggled off.
 */
function syncCapitalLayerPresentation(
  map: MapLibreMap,
  labelsOn: boolean,
  selectedCode: string | null,
) {
  const show = labelsOn || Boolean(selectedCode)
  const filter: FilterSpecification | null = labelsOn
    ? null
    : selectedCode
      ? ['==', ['get', 'code'], selectedCode]
      : ['==', ['get', 'code'], '__none__']

  for (const id of CAPITAL_LAYER_IDS) {
    if (!map.getLayer(id)) continue
    map.setLayoutProperty(id, 'visibility', show ? 'visible' : 'none')
    map.setFilter(id, filter)
  }

  if (map.getLayer('capital-labels')) {
    const pinSelected = !labelsOn && Boolean(selectedCode)
    map.setLayoutProperty('capital-labels', 'text-allow-overlap', pinSelected)
    map.setLayoutProperty(
      'capital-labels',
      'text-ignore-placement',
      pinSelected,
    )
  }
}

/** Keep country fill and capital marker selection feature-state in sync. */
function syncSelectionFeatureState(
  map: MapLibreMap,
  previous: string | null,
  next: string | null,
) {
  for (const source of ['countries', 'capitals'] as const) {
    if (!map.getSource(source)) continue
    if (previous && previous !== next) {
      map.setFeatureState({ source, id: previous }, { selected: false })
    }
    if (next) {
      map.setFeatureState({ source, id: next }, { selected: true })
    } else if (previous) {
      map.setFeatureState({ source, id: previous }, { selected: false })
    }
  }
}

function applyLayerVisibility(
  map: MapLibreMap,
  layers: MapLayerVisibility,
  selectedCode: string | null = null,
) {
  const borderVisibility = layers.borders ? 'visible' : 'none'
  const labelVisibility = layers.labels ? 'visible' : 'none'
  const graticuleVisibility = layers.graticule ? 'visible' : 'none'
  for (const id of BORDER_LINE_LAYER_IDS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', borderVisibility)
  }
  // Hit fill stays visible for interaction; idle paint is fully transparent.
  for (const id of BORDER_HIT_LAYER_IDS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'visible')
  }
  for (const id of LABEL_LAYER_IDS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', labelVisibility)
  }
  for (const id of GRATICULE_LAYER_IDS) {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', graticuleVisibility)
    }
  }
  syncCapitalLayerPresentation(map, layers.labels, selectedCode)
}

function readMapCamera(map: MapLibreMap): MapCamera {
  const center = map.getCenter()
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
  }
}

function writeCameraHashFromMap(map: MapLibreMap) {
  syncMapCameraHash(readMapCamera(map))
}

/** Pause hash writes during programmatic flights; always settle afterward. */
function withCameraHashPause(
  map: MapLibreMap,
  pausedRef: { current: boolean },
  work: () => void,
) {
  pausedRef.current = true
  let settled = false
  const settle = () => {
    if (settled) return
    settled = true
    pausedRef.current = false
    writeCameraHashFromMap(map)
  }
  map.once('moveend', settle)
  work()
  // MapLibre may skip moveend when the camera is already at the target.
  window.setTimeout(settle, mapMotionMs(850) + 80)
}

function handleMapCanvasKeyDown(
  event: React.KeyboardEvent<HTMLDivElement>,
  map: MapLibreMap | null,
  {
    onHome,
    onSelectCenter,
  }: { onHome?: () => void; onSelectCenter?: () => void } = {},
) {
  if (!map) return
  const panPx = event.shiftKey ? 140 : 80
  const duration = mapMotionMs(180)
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      map.panBy([-panPx, 0], { duration })
      break
    case 'ArrowRight':
      event.preventDefault()
      map.panBy([panPx, 0], { duration })
      break
    case 'ArrowUp':
      event.preventDefault()
      map.panBy([0, -panPx], { duration })
      break
    case 'ArrowDown':
      event.preventDefault()
      map.panBy([0, panPx], { duration })
      break
    case '+':
    case '=':
      event.preventDefault()
      map.zoomIn({ duration: mapMotionMs(220) })
      break
    case '-':
    case '_':
      event.preventDefault()
      map.zoomOut({ duration: mapMotionMs(220) })
      break
    case 'Enter':
      if (onSelectCenter) {
        event.preventDefault()
        onSelectCenter()
      }
      break
    case 'Home':
      if (onHome) {
        event.preventDefault()
        onHome()
      }
      break
    default:
      break
  }
}

function mapMotionMs(preferred: number) {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 0
  }
  return preferred
}

function fitCountry(
  map: MapLibreMap,
  entry: MapCountryIndexEntry,
  { preferCapital = false }: { preferCapital?: boolean } = {},
) {
  if (preferCapital && entry.capital) {
    map.easeTo({
      center: entry.capital,
      zoom: Math.min(
        Math.max(entry.maxZoom, 4.6),
        MAP_MAX_ZOOM + 0.65,
      ),
      duration: mapMotionMs(800),
    })
    return
  }
  map.fitBounds(entry.bounds, {
    padding: mapFocusPadding(),
    maxZoom: Math.min(entry.maxZoom, MAP_MAX_ZOOM + 0.75),
    duration: mapMotionMs(800),
  })
}

export function EarthMap({
  className,
  countryPhotos = {},
  initialIndex,
}: EarthMapProps) {
  const reactId = useId()
  const searchParams = useSearchParams()
  const countryParam = searchParams.get('country')
  const regionParam = searchParams.get('region')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const hoveredCodeRef = useRef<string | null>(null)
  const selectedCodeRef = useRef<string | null>(null)
  const activeRegionRef = useRef<string | null>(null)
  const indexRef = useRef<MapCountryIndexEntry[]>(initialIndex?.countries ?? [])
  const regionsRef = useRef<MapRegionCamera[]>(initialIndex?.regions ?? [])
  const suppressMapClickRef = useRef<() => void>(() => {})
  const indexReadyRef = useRef(Boolean(initialIndex?.countries.length))
  const rootRef = useRef<HTMLDivElement | null>(null)
  const topChromeRef = useRef<HTMLDivElement | null>(null)
  const bottomChromeRef = useRef<HTMLDivElement | null>(null)
  const selectionPanelRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const suggestionsOpenRef = useRef(false)
  const layersRef = useRef<MapLayerVisibility>({ ...DEFAULT_MAP_LAYERS })
  const resetViewRef = useRef<() => void>(() => {})
  const clearSelectionRef = useRef<() => void>(() => {})
  const flyToRegionRef = useRef<(region: MapRegionCamera) => void>(() => {})
  const focusMapCanvasRef = useRef<() => void>(() => {})
  const cameraHashPausedRef = useRef(false)
  const fittedFocusKeyRef = useRef<string | null>(null)
  /** Last auto-fit context — used to re-fit once after the dossier height settles. */
  const fitContextRef = useRef<{
    kind: 'country' | 'region'
    id: string
    preferCapital: boolean
    shared: boolean
    liftAtFit: number
  } | null>(null)
  const refitFrameRef = useRef<number | null>(null)
  const mapEpochRef = useRef(0)

  const [ready, setReady] = useState(false)
  /** Bumps when a MapLibre instance becomes ready so deep links re-apply after remounts. */
  const [mapEpoch, setMapEpoch] = useState(0)
  const [coords, setCoords] = useState('—')
  const [zoom, setZoom] = useState(MAP_MIN_ZOOM)
  const [pointerLabel, setPointerLabel] = useState<string | null>(null)
  const [selected, setSelected] = useState<MapCountryHit | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<MapCountryIndexEntry | null>(
    null,
  )
  const [query, setQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<MapSearchSuggestion[]>([])
  const focusDossierOnSelectRef = useRef(false)
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [regions, setRegions] = useState<MapRegionCamera[]>(
    initialIndex?.regions ?? [],
  )
  const [countries, setCountries] = useState<MapCountryIndexEntry[]>(
    initialIndex?.countries ?? [],
  )
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_MAP_LAYERS)
  const [layersHydrated, setLayersHydrated] = useState(false)
  const [copyState, setCopyState] = useState<
    'idle' | 'copied' | 'shared' | 'failed'
  >('idle')
  const [copyKind, setCopyKind] = useState<'view' | 'place'>('view')
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'degraded'>(
    'loading',
  )
  const [focusAnnouncement, setFocusAnnouncement] = useState('')
  /** Bumps on popstate so Back/Forward re-apply focus from the URL. */
  const [focusTick, setFocusTick] = useState(0)

  useEffect(() => {
    const stored = readStoredMapLayers()
    const fromUrl = parseMapLayersSearchParams(
      new URLSearchParams(window.location.search),
    )
    const resolved = resolveMapLayers(fromUrl, stored)
    layersRef.current = resolved
    setLayers(resolved)
    setLayersHydrated(true)
  }, [])

  useEffect(() => {
    suggestionsOpenRef.current = suggestionsOpen
  }, [suggestionsOpen])

  useEffect(() => {
    mapEpochRef.current = mapEpoch
  }, [mapEpoch])

  useEffect(() => {
    if (!layersHydrated) return
    layersRef.current = layers
    writeStoredMapLayers(layers)
    syncMapLayersSearchParams(layers)
    const map = mapRef.current
    if (map && ready) {
      applyLayerVisibility(map, layers, selectedCodeRef.current)
    }
  }, [layers, ready, layersHydrated])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    ensureMapLibreWorker()

    const map = new MapLibreMap({
      container,
      style: basemapStyle(),
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM + 0.85,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: false,
      fadeDuration: 0,
    })

    map.addControl(
      new NavigationControl({ showCompass: false, visualizePitch: false }),
      'top-right',
    )
    map.addControl(new AttributionControl({ compact: true }), 'bottom-right')
    map.addControl(new ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left')

    map.getCanvas().setAttribute(
      'aria-label',
      'Interactive map of Earth. Arrow keys pan, plus and minus zoom, Enter selects the place at center, Home resets.',
    )

    // Restore a shared camera when there is no country/region deep link.
    const bootstrapParams = new URLSearchParams(window.location.search)
    if (!bootstrapParams.get('country') && !bootstrapParams.get('region')) {
      const bootCamera = parseMapCameraHash(window.location.hash)
      if (bootCamera) {
        map.jumpTo({ center: bootCamera.center, zoom: bootCamera.zoom })
      }
    }

    mapRef.current = map

    const setHover = (code: string | null, label?: string | null) => {
      if (!map.getSource('countries')) return
      if (hoveredCodeRef.current && hoveredCodeRef.current !== code) {
        map.setFeatureState(
          { source: 'countries', id: hoveredCodeRef.current },
          { hover: false },
        )
      }
      hoveredCodeRef.current = code
      if (code) {
        map.setFeatureState({ source: 'countries', id: code }, { hover: true })
        map.getCanvas().style.cursor = 'pointer'
        const indexed = indexRef.current.find((item) => item.code === code)
        setPointerLabel(label?.trim() || indexed?.name || code)
      } else {
        map.getCanvas().style.cursor = ''
        setPointerLabel(null)
      }
    }

    const setSelection = (
      hit: MapCountryHit | null,
      entry?: MapCountryIndexEntry,
      { preferCapital = false }: { preferCapital?: boolean } = {},
    ) => {
      const previous = selectedCodeRef.current
      syncSelectionFeatureState(map, previous, hit?.code ?? null)
      selectedCodeRef.current = hit?.code ?? null
      setSelected(hit)
      setActiveRegion(null)
      activeRegionRef.current = null
      setCopyState('idle')
      setSuggestionsOpen(false)
      setSuggestions([])
      syncCapitalLayerPresentation(
        map,
        layersRef.current.labels,
        selectedCodeRef.current,
      )
      if (hit) {
        setQuery(hit.name)
        const indexed =
          entry ?? indexRef.current.find((item) => item.code === hit.code)
        setSelectedEntry(indexed ?? null)
        fittedFocusKeyRef.current = `country:${hit.code}@${mapEpochRef.current}`
        const capitalName = indexed?.capitalName
        setFocusAnnouncement(
          preferCapital && capitalName
            ? `Selected ${hit.name}. Showing ${capitalName}.`
            : `Selected ${hit.name}.`,
        )
        syncMapFocusSearchParams(
          {
            kind: 'country',
            value: hit.country?.slug ?? hit.code,
          },
          { history: 'push' },
        )
        if (indexed) {
          fitContextRef.current = {
            kind: 'country',
            id: hit.code,
            preferCapital,
            shared: false,
            liftAtFit: measuredDossierLiftPx,
          }
          withCameraHashPause(map, cameraHashPausedRef, () => {
            fitCountry(map, indexed, { preferCapital })
          })
        } else {
          fitContextRef.current = null
        }
      } else {
        setQuery('')
        setSelectedEntry(null)
        fittedFocusKeyRef.current = `clear@${mapEpochRef.current}`
        fitContextRef.current = null
        setFocusAnnouncement('Selection cleared.')
        syncMapFocusSearchParams(null, { history: 'push' })
      }
    }

    const onMove = () => {
      const center = map.getCenter()
      setCoords(formatMapCoords(center.lng, center.lat))
      setZoom(map.getZoom())
    }

    let markedReady = false
    let indexFailed = false
    const markReady = ({ requireIndex = true }: { requireIndex?: boolean } = {}) => {
      if (markedReady) return
      if (requireIndex && !indexReadyRef.current) return
      markedReady = true
      onMove()
      setReady(true)
      setLoadState(indexFailed ? 'degraded' : 'ready')
      // Re-bind deep-link fitting even when `ready` was already true (Strict Mode).
      setMapEpoch((epoch) => epoch + 1)
    }

    let countryHandlersBound = false
    let capitalHandlersBound = false
    let labelHandlersBound = false
    let ignoreMapClicksUntil = 0

    const selectCode = (
      code: string,
      fallbackName: string,
      { preferCapital = false }: { preferCapital?: boolean } = {},
    ) => {
      const hit = resolveMapCountry(code, fallbackName)
      const indexed = indexRef.current.find((item) => item.code === hit.code)
      setSelection(hit, indexed, { preferCapital })
    }

    const interactiveHitLayers = () => {
      const layers: string[] = []
      if (map.getLayer('country-fill')) layers.push('country-fill')
      if (map.getLayer('capital-hits')) layers.push('capital-hits')
      if (map.getLayer('capital-labels')) layers.push('capital-labels')
      if (map.getLayer('country-labels')) layers.push('country-labels')
      if (map.getLayer('region-labels')) layers.push('region-labels')
      return layers
    }

    const bindInteractionHandlers = () => {
      if (!countryHandlersBound && map.getLayer('country-fill')) {
        countryHandlersBound = true

        map.on('mousemove', 'country-fill', (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          const code = feature
            ? String(feature.id ?? feature.properties?.code ?? '')
            : ''
          const name = feature
            ? String(feature.properties?.name ?? '')
            : ''
          setHover(code || null, name || null)
          if (event.lngLat) {
            setCoords(formatMapCoords(event.lngLat.lng, event.lngLat.lat))
          }
        })

        map.on('mouseleave', 'country-fill', () => {
          setHover(null)
        })

        map.on('click', 'country-fill', (event: MapLayerMouseEvent) => {
          if (performance.now() < ignoreMapClicksUntil) return
          if (event.originalEvent.detail > 1) return
          // Prefer a capital hit/label when the click lands on both layers.
          const capitalLayers = ['capital-hits', 'capital-labels'].filter(
            (id) => map.getLayer(id),
          )
          if (capitalLayers.length > 0) {
            const capitalHits = map.queryRenderedFeatures(event.point, {
              layers: capitalLayers,
            })
            if (capitalHits.length > 0) return
          }
          const feature = event.features?.[0]
          if (!feature) return
          const code = String(feature.id ?? feature.properties?.code ?? '')
          if (!code) return
          selectCode(code, String(feature.properties?.name ?? code))
        })

        map.on('click', (event: MapMouseEvent) => {
          if (performance.now() < ignoreMapClicksUntil) return
          if (event.originalEvent.detail > 1) return
          const layers = interactiveHitLayers()
          if (layers.length === 0) return
          const hits = map.queryRenderedFeatures(event.point, { layers })
          if (hits.length === 0) setSelection(null)
        })
      }

      if (!capitalHandlersBound && map.getLayer('capital-hits')) {
        capitalHandlersBound = true

        map.on('mousemove', 'capital-hits', (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          const code = feature
            ? String(feature.id ?? feature.properties?.code ?? '')
            : ''
          const capitalName = feature
            ? String(feature.properties?.name ?? '')
            : ''
          const countryName = feature
            ? String(feature.properties?.country ?? '')
            : ''
          const label =
            capitalName && countryName
              ? `${capitalName} · ${countryName}`
              : capitalName || countryName || null
          setHover(code || null, label)
          map.getCanvas().style.cursor = code ? 'pointer' : ''
          if (event.lngLat) {
            setCoords(formatMapCoords(event.lngLat.lng, event.lngLat.lat))
          }
        })

        map.on('mouseleave', 'capital-hits', () => {
          setHover(null)
        })

        map.on('click', 'capital-hits', (event: MapLayerMouseEvent) => {
          if (performance.now() < ignoreMapClicksUntil) return
          if (event.originalEvent.detail > 1) return
          const feature = event.features?.[0]
          if (!feature) return
          const code = String(feature.id ?? feature.properties?.code ?? '')
          if (!code) return
          const countryName = String(
            feature.properties?.country ?? feature.properties?.name ?? code,
          )
          selectCode(code, countryName, { preferCapital: true })
        })

        if (map.getLayer('capital-labels')) {
          map.on('mousemove', 'capital-labels', (event: MapLayerMouseEvent) => {
            const feature = event.features?.[0]
            const code = feature
              ? String(feature.id ?? feature.properties?.code ?? '')
              : ''
            const capitalName = feature
              ? String(feature.properties?.name ?? '')
              : ''
            const countryName = feature
              ? String(feature.properties?.country ?? '')
              : ''
            const label =
              capitalName && countryName
                ? `${capitalName} · ${countryName}`
                : capitalName || countryName || null
            setHover(code || null, label)
            map.getCanvas().style.cursor = code ? 'pointer' : ''
          })

          map.on('mouseleave', 'capital-labels', () => {
            setHover(null)
          })

          map.on('click', 'capital-labels', (event: MapLayerMouseEvent) => {
            if (performance.now() < ignoreMapClicksUntil) return
            if (event.originalEvent.detail > 1) return
            const feature = event.features?.[0]
            if (!feature) return
            const code = String(feature.id ?? feature.properties?.code ?? '')
            if (!code) return
            const countryName = String(
              feature.properties?.country ?? feature.properties?.name ?? code,
            )
            selectCode(code, countryName, { preferCapital: true })
          })
        }
      }

      if (!labelHandlersBound && map.getLayer('country-labels')) {
        labelHandlersBound = true

        map.on('mousemove', 'country-labels', (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          const code = feature
            ? String(feature.id ?? feature.properties?.code ?? '')
            : ''
          const name = feature
            ? String(feature.properties?.name ?? '')
            : ''
          setHover(code || null, name || null)
          map.getCanvas().style.cursor = code ? 'pointer' : ''
        })

        map.on('mouseleave', 'country-labels', () => {
          setHover(null)
        })

        map.on('click', 'country-labels', (event: MapLayerMouseEvent) => {
          if (performance.now() < ignoreMapClicksUntil) return
          if (event.originalEvent.detail > 1) return
          const capitalLayers = ['capital-hits', 'capital-labels'].filter(
            (id) => map.getLayer(id),
          )
          if (capitalLayers.length > 0) {
            const capitalHits = map.queryRenderedFeatures(event.point, {
              layers: capitalLayers,
            })
            if (capitalHits.length > 0) return
          }
          const feature = event.features?.[0]
          if (!feature) return
          const code = String(feature.id ?? feature.properties?.code ?? '')
          if (!code) return
          selectCode(code, String(feature.properties?.name ?? code))
        })

        if (map.getLayer('region-labels')) {
          map.on('mousemove', 'region-labels', (event: MapLayerMouseEvent) => {
            const feature = event.features?.[0]
            const name = feature
              ? String(feature.properties?.name ?? feature.id ?? '')
              : ''
            if (name) {
              map.getCanvas().style.cursor = 'pointer'
              setPointerLabel(name)
            }
          })

          map.on('mouseleave', 'region-labels', () => {
            map.getCanvas().style.cursor = ''
            setPointerLabel(null)
          })

          map.on('click', 'region-labels', (event: MapLayerMouseEvent) => {
            if (performance.now() < ignoreMapClicksUntil) return
            if (event.originalEvent.detail > 1) return
            const feature = event.features?.[0]
            if (!feature) return
            const regionId = String(feature.id ?? feature.properties?.name ?? '')
            if (!regionId) return
            const region =
              findMapRegionCamera(regionsRef.current, regionId) ??
              findMapRegionCamera(FALLBACK_MAP_REGIONS, regionId)
            if (region) flyToRegionRef.current(region)
          })
        }
      }
    }

    const ensureCountryLayers = () => {
      if (!map.getSource('countries')) {
        addCountryLayers(map)
      }
      addGraticuleLayer(map)
      addCapitalLayers(map)
      if (indexRef.current.length > 0 || regionsRef.current.length > 0) {
        upsertLabelLayers(map, indexRef.current, regionsRef.current)
      }
      applyLayerVisibility(map, layersRef.current, selectedCodeRef.current)
      bindInteractionHandlers()
    }

    const hydrateCountries = async () => {
      try {
        ensureCountryLayers()
        if (indexRef.current.length === 0) {
          const indexResponse = await fetch(MAP_COUNTRY_INDEX_URL)
          if (!indexResponse.ok) {
            throw new Error(`Index HTTP ${indexResponse.status}`)
          }
          const index = (await indexResponse.json()) as MapCountryIndex
          indexRef.current = index.countries
          regionsRef.current = index.regions ?? []
          setRegions(regionsRef.current)
        }
        setCountries(indexRef.current)
        upsertLabelLayers(map, indexRef.current, regionsRef.current)
        applyLayerVisibility(map, layersRef.current, selectedCodeRef.current)
        bindInteractionHandlers()
      } catch {
        indexFailed = true
        if (!initialIndex?.countries.length) {
          indexRef.current = []
          regionsRef.current = []
          setCountries([])
          setRegions([])
        }
        try {
          ensureCountryLayers()
        } catch {
          // Idle retry below.
        }
      }
      indexReadyRef.current = true
      markReady()
    }

    map.on('load', () => {
      void hydrateCountries()
    })

    map.on('idle', () => {
      if (
        !map.getSource('countries') ||
        !countryHandlersBound ||
        (indexRef.current.length > 0 && !labelHandlersBound)
      ) {
        try {
          ensureCountryLayers()
        } catch {
          // Keep waiting for a clean style state.
        }
      }
      if (map.loaded()) markReady()
    })

    map.on('error', (event) => {
      console.warn('[earth-map]', event.error?.message ?? event)
      // Allow the toolbar to unlock even if the index request fails.
      indexReadyRef.current = true
      markReady({ requireIndex: false })
    })

    map.on('move', onMove)
    map.on('moveend', () => {
      if (cameraHashPausedRef.current) return
      writeCameraHashFromMap(map)
    })

    suppressMapClickRef.current = () => {
      ignoreMapClicksUntil = performance.now() + 400
    }

    const observer = new ResizeObserver(() => {
      map.resize()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      setHover(null)
      map.remove()
      mapRef.current = null
      markedReady = false
      setReady(false)
      setLoadState('loading')
      fittedFocusKeyRef.current = null
    }
  }, [])

  useEffect(() => {
    const onPopState = () => setFocusTick((tick) => tick + 1)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!ready) return
    const onHashChange = () => {
      if (cameraHashPausedRef.current) return
      const params = new URLSearchParams(window.location.search)
      if (params.get('country') || params.get('region')) return
      const map = mapRef.current
      if (!map) return
      const parsed = parseMapCameraHash(window.location.hash)
      const next = normalizeMapCamera(
        parsed ?? { center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM },
      )
      const current = normalizeMapCamera(readMapCamera(map))
      if (
        current.zoom === next.zoom &&
        current.center[0] === next.center[0] &&
        current.center[1] === next.center[1]
      ) {
        return
      }
      cameraHashPausedRef.current = true
      map.jumpTo({ center: next.center, zoom: next.zoom })
      window.setTimeout(() => {
        cameraHashPausedRef.current = false
      }, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [ready])

  useEffect(() => {
    if (!ready || mapEpoch === 0) return
    const map = mapRef.current
    if (!map) return
    // Prefer the live URL so pushState + Back/Forward stay authoritative even
    // when Next's useSearchParams lags behind manual history writes.
    const params = new URLSearchParams(window.location.search)
    const country = params.get('country') ?? countryParam
    const region = params.get('region') ?? regionParam
    if (country) {
      const entry = findMapCountryIndexEntry(indexRef.current, country)
      if (!entry) {
        const failKey = `missing-country:${country}@${mapEpoch}`
        if (fittedFocusKeyRef.current === failKey) return
        fittedFocusKeyRef.current = failKey
        setFocusAnnouncement(`No country matched “${country}”.`)
        return
      }
      const sharedCamera = parseMapCameraHash(window.location.hash)
      const focusKey = sharedCamera
        ? `country:${entry.code}@${mapEpoch}#shared`
        : `country:${entry.code}@${mapEpoch}`
      const countryFocus = {
        kind: 'country' as const,
        value: entry.slug ?? entry.code,
      }
      // Drop stray `region=` even when the camera is already fitted.
      syncMapFocusSearchParams(countryFocus, { history: 'replace' })
      if (fittedFocusKeyRef.current === focusKey) return
      fittedFocusKeyRef.current = focusKey
      flyToCountry(entry, {
        syncUrl: false,
        camera: sharedCamera,
      })
      return
    }
    if (region) {
      const regionCamera = findMapRegionCamera(regionsRef.current, region)
      if (!regionCamera) {
        const failKey = `missing-region:${region}@${mapEpoch}`
        if (fittedFocusKeyRef.current === failKey) return
        fittedFocusKeyRef.current = failKey
        setFocusAnnouncement(`No region matched “${region}”.`)
        return
      }
      const sharedCamera = parseMapCameraHash(window.location.hash)
      const focusKey = sharedCamera
        ? `region:${regionCamera.id}@${mapEpoch}#shared`
        : `region:${regionCamera.id}@${mapEpoch}`
      syncMapFocusSearchParams(
        { kind: 'region', value: regionCamera.id },
        { history: 'replace' },
      )
      if (fittedFocusKeyRef.current === focusKey) return
      fittedFocusKeyRef.current = focusKey
      flyToRegion(regionCamera, {
        syncUrl: false,
        camera: sharedCamera,
      })
      return
    }
    if (selectedCodeRef.current || activeRegionRef.current) {
      const clearKey = `clear@${mapEpoch}`
      if (fittedFocusKeyRef.current === clearKey) return
      fittedFocusKeyRef.current = clearKey
      fitContextRef.current = null
      syncSelectionFeatureState(map, selectedCodeRef.current, null)
      selectedCodeRef.current = null
      setSelected(null)
      setSelectedEntry(null)
      setQuery('')
      setSuggestionsOpen(false)
      setSuggestions([])
      setActiveRegion(null)
      activeRegionRef.current = null
      setCopyState('idle')
      syncCapitalLayerPresentation(map, layersRef.current.labels, null)
      setFocusAnnouncement('Selection cleared.')
      // Restore the shared camera from the history entry (or the default world).
      const camera = parseMapCameraHash(window.location.hash)
      cameraHashPausedRef.current = true
      if (camera) {
        map.jumpTo({ center: camera.center, zoom: camera.zoom })
      } else {
        map.jumpTo({
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
        })
      }
      window.setTimeout(() => {
        cameraHashPausedRef.current = false
        writeCameraHashFromMap(map)
      }, 0)
      return
    }
    fittedFocusKeyRef.current = null
  }, [ready, mapEpoch, countryParam, regionParam, focusTick])

  useEffect(() => {
    if (!selected && !activeRegion) return
    if (!focusDossierOnSelectRef.current) return
    focusDossierOnSelectRef.current = false
    const panel = selectionPanelRef.current
    if (!panel) return
    // Defer so fitBounds / paint settle before moving focus.
    const id = window.requestAnimationFrame(() => {
      panel.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(id)
  }, [selected?.code, activeRegion])

  useEffect(() => {
    document.title = `${mapsFocusDocumentTitle({
      countryName: selected?.name,
      regionLabel: activeRegion
        ? regions.find((region) => region.id === activeRegion)?.label
        : null,
    })} | Cleo`
  }, [selected?.name, activeRegion, regions])

  useEffect(() => {
    return () => {
      document.title = 'Maps | Cleo'
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null
        const tag = target?.tagName
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target?.isContentEditable
        ) {
          return
        }
        event.preventDefault()
        searchInputRef.current?.focus()
        if (query.trim()) setSuggestionsOpen(true)
        return
      }
      if (event.key !== 'Escape') return
      if (event.defaultPrevented) return
      if (suggestionsOpenRef.current) return
      // ZoomImage owns Escape while the lightbox is open.
      if (document.querySelector('.zoom-overlay[aria-modal="true"]')) return
      const active = document.activeElement as HTMLElement | null
      const tag = active?.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        active?.isContentEditable
      ) {
        return
      }
      if (!selectedCodeRef.current && !activeRegionRef.current) return
      event.preventDefault()
      const panel = selectionPanelRef.current
      const inPanel =
        panel != null &&
        (active === panel || (active instanceof Node && panel.contains(active)))
      if (inPanel) {
        focusMapCanvasRef.current()
        return
      }
      // Match ocean-click clear: drop focus/URL, keep the current framing.
      // Home / Reset still fly back to the world camera.
      clearSelectionRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [query])

  useEffect(() => {
    const trimmed = query.trim()
    if (!suggestionsOpen || !trimmed) {
      setSuggestions([])
      setActiveSuggestion(0)
      return
    }
    const capitals: Record<string, string> = {}
    for (const [code, photo] of Object.entries(countryPhotos)) {
      if (photo.capital) capitals[code] = photo.capital
    }
    const next = filterMapSuggestions(
      indexRef.current,
      regionsRef.current.length > 0 ? regionsRef.current : FALLBACK_MAP_REGIONS,
      trimmed,
      capitals,
    )
    setSuggestions(next)
    setActiveSuggestion(0)
  }, [query, ready, suggestionsOpen, countryPhotos])

  useEffect(() => {
    if (!suggestionsOpen || suggestions.length === 0) return
    const suggestion = suggestions[activeSuggestion]
    if (!suggestion) return
    const optionId =
      suggestion.kind === 'region'
        ? suggestion.region.id
        : suggestion.entry.code
    const option = document.getElementById(`${reactId}-option-${optionId}`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [activeSuggestion, suggestions, suggestionsOpen, reactId])

  useEffect(() => {
    const root = rootRef.current
    const bottom = bottomChromeRef.current
    const top = topChromeRef.current
    if (!root || !bottom) return

    const scheduleRefitForMeasuredLift = () => {
      const ctx = fitContextRef.current
      // Capital framing is center/zoom, not padded bounds — skip the second ease.
      if (!ctx || ctx.shared || ctx.preferCapital) return
      if (Math.abs(measuredDossierLiftPx - ctx.liftAtFit) < 32) return
      if (refitFrameRef.current != null) {
        window.cancelAnimationFrame(refitFrameRef.current)
      }
      refitFrameRef.current = window.requestAnimationFrame(() => {
        refitFrameRef.current = null
        const map = mapRef.current
        const latest = fitContextRef.current
        if (!map || !latest || latest.shared || latest.preferCapital) return
        if (Math.abs(measuredDossierLiftPx - latest.liftAtFit) < 32) return
        if (latest.kind === 'country') {
          if (selectedCodeRef.current !== latest.id) return
          const entry = indexRef.current.find((item) => item.code === latest.id)
          if (!entry) return
          latest.liftAtFit = measuredDossierLiftPx
          withCameraHashPause(map, cameraHashPausedRef, () => {
            fitCountry(map, entry, { preferCapital: false })
          })
          return
        }
        if (activeRegionRef.current !== latest.id) return
        const region =
          regionsRef.current.find((item) => item.id === latest.id) ??
          findMapRegionCamera(FALLBACK_MAP_REGIONS, latest.id)
        if (!region) return
        latest.liftAtFit = measuredDossierLiftPx
        withCameraHashPause(map, cameraHashPausedRef, () => {
          map.fitBounds(region.bounds, {
            padding: mapRegionPadding(),
            maxZoom: region.maxZoom,
            duration: mapMotionMs(800),
          })
        })
      })
    }

    const publish = () => {
      const bottomHeight = bottom.getBoundingClientRect().height
      setMeasuredDossierLiftPx(bottomHeight)
      root.style.setProperty('--maps-dossier-lift', `${measuredDossierLiftPx}px`)
      if (top) {
        const topHeight = Math.ceil(top.getBoundingClientRect().height)
        root.style.setProperty('--maps-top-chrome-height', `${topHeight}px`)
      }
      scheduleRefitForMeasuredLift()
    }

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(bottom)
    if (top) observer.observe(top)
    window.addEventListener('resize', publish)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', publish)
      if (refitFrameRef.current != null) {
        window.cancelAnimationFrame(refitFrameRef.current)
        refitFrameRef.current = null
      }
    }
  }, [selected?.code, activeRegion, ready, loadState, focusAnnouncement])

  function flyToCountry(
    entry: MapCountryIndexEntry,
    {
      syncUrl = true,
      preferCapital = false,
      camera = null,
      focusDossier = false,
    }: {
      syncUrl?: boolean
      preferCapital?: boolean
      /** When set (shared deep link), select the place but keep this framing. */
      camera?: MapCamera | null
      /** Keyboard / search paths move focus into the dossier plate. */
      focusDossier?: boolean
    } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    focusDossierOnSelectRef.current = focusDossier
    const hit = resolveMapCountry(entry.code, entry.name)
    const previous = selectedCodeRef.current
    syncSelectionFeatureState(map, previous, hit.code)
    selectedCodeRef.current = hit.code
    setSelected(hit)
    setSelectedEntry(entry)
    setQuery(entry.name)
    setSuggestionsOpen(false)
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    syncCapitalLayerPresentation(
      map,
      layersRef.current.labels,
      selectedCodeRef.current,
    )
    const capitalName = entry.capitalName ?? countryPhotos[entry.code]?.capital
    setFocusAnnouncement(
      camera
        ? `Selected ${hit.name}. Restored shared view.`
        : preferCapital && capitalName
          ? `Selected ${hit.name}. Showing ${capitalName}.`
          : `Selected ${hit.name}.`,
    )
    fittedFocusKeyRef.current = camera
      ? `country:${entry.code}@${mapEpochRef.current}#shared`
      : `country:${entry.code}@${mapEpochRef.current}`
    fitContextRef.current = {
      kind: 'country',
      id: entry.code,
      preferCapital,
      shared: Boolean(camera),
      liftAtFit: measuredDossierLiftPx,
    }
    if (syncUrl) {
      syncMapFocusSearchParams(
        {
          kind: 'country',
          value: entry.slug ?? entry.code,
        },
        { history: 'push' },
      )
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      if (camera) {
        map.jumpTo({ center: camera.center, zoom: camera.zoom })
        return
      }
      fitCountry(map, entry, { preferCapital })
    })
  }

  function activateSuggestion(suggestion: MapSearchSuggestion) {
    if (suggestion.kind === 'region') {
      flyToRegion(suggestion.region, { focusDossier: true })
      return
    }
    flyToCountry(suggestion.entry, {
      preferCapital: suggestion.match === 'capital',
      focusDossier: true,
    })
  }

  function clearSelection() {
    const map = mapRef.current
    if (!map) return
    if (!selectedCodeRef.current && !activeRegionRef.current) return
    syncSelectionFeatureState(map, selectedCodeRef.current, null)
    selectedCodeRef.current = null
    setSelected(null)
    setSelectedEntry(null)
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    syncCapitalLayerPresentation(map, layersRef.current.labels, null)
    setFocusAnnouncement('Selection cleared.')
    syncMapFocusSearchParams(null, { history: 'push' })
    fittedFocusKeyRef.current = `clear@${mapEpoch}`
    fitContextRef.current = null
    map.getCanvas().focus({ preventScroll: true })
  }

  clearSelectionRef.current = clearSelection

  function resetView() {
    const map = mapRef.current
    if (!map) return
    syncSelectionFeatureState(map, selectedCodeRef.current, null)
    selectedCodeRef.current = null
    setSelected(null)
    setSelectedEntry(null)
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    syncCapitalLayerPresentation(map, layersRef.current.labels, null)
    setFocusAnnouncement('Map reset.')
    syncMapFocusSearchParams(null, { history: 'push' })
    fittedFocusKeyRef.current = `clear@${mapEpoch}`
    fitContextRef.current = null
    cameraHashPausedRef.current = true
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      cameraHashPausedRef.current = false
      syncMapCameraHash(null)
      map.getCanvas().focus({ preventScroll: true })
    }
    map.once('moveend', settle)
    map.easeTo({
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      duration: mapMotionMs(600),
    })
    window.setTimeout(settle, mapMotionMs(650) + 80)
  }

  resetViewRef.current = resetView

  function focusMapCanvas() {
    mapRef.current?.getCanvas().focus({ preventScroll: true })
    setFocusAnnouncement('Map focused. Arrow keys pan. Enter selects center.')
  }

  focusMapCanvasRef.current = focusMapCanvas

  function fitSelectedCountry() {
    const map = mapRef.current
    const entry = selectedEntry
    if (!map || !entry) return
    setFocusAnnouncement(`Fitting ${entry.name}.`)
    if (fitContextRef.current?.kind === 'country') {
      fitContextRef.current.preferCapital = false
      fitContextRef.current.shared = false
      fitContextRef.current.liftAtFit = measuredDossierLiftPx
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      fitCountry(map, entry, { preferCapital: false })
    })
  }

  function fitActiveRegion() {
    const map = mapRef.current
    const regionId = activeRegionRef.current
    const region = regionId
      ? regionsRef.current.find((entry) => entry.id === regionId)
      : undefined
    if (!map || !region) return
    setFocusAnnouncement(`Fitting ${region.label}.`)
    if (fitContextRef.current?.kind === 'region') {
      fitContextRef.current.shared = false
      fitContextRef.current.liftAtFit = measuredDossierLiftPx
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      map.fitBounds(region.bounds, {
        padding: mapRegionPadding(),
        maxZoom: region.maxZoom,
        duration: mapMotionMs(800),
      })
    })
  }

  function toggleLayer(id: MapLayerId) {
    setLayers((current) => ({ ...current, [id]: !current[id] }))
  }

  function flyToRegion(
    region: MapRegionCamera,
    {
      syncUrl = true,
      camera = null,
      focusDossier = false,
    }: {
      syncUrl?: boolean
      camera?: MapCamera | null
      focusDossier?: boolean
    } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    focusDossierOnSelectRef.current = focusDossier
    syncSelectionFeatureState(map, selectedCodeRef.current, null)
    selectedCodeRef.current = null
    setSelected(null)
    setSelectedEntry(null)
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    setCopyState('idle')
    syncCapitalLayerPresentation(map, layersRef.current.labels, null)
    setActiveRegion(region.id)
    activeRegionRef.current = region.id
    setFocusAnnouncement(
      camera
        ? `Viewing ${region.label}. Restored shared view.`
        : `Viewing ${region.label}.`,
    )
    fittedFocusKeyRef.current = camera
      ? `region:${region.id}@${mapEpochRef.current}#shared`
      : `region:${region.id}@${mapEpochRef.current}`
    fitContextRef.current = {
      kind: 'region',
      id: region.id,
      preferCapital: false,
      shared: Boolean(camera),
      liftAtFit: measuredDossierLiftPx,
    }
    if (syncUrl) {
      syncMapFocusSearchParams(
        { kind: 'region', value: region.id },
        { history: 'push' },
      )
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      if (camera) {
        map.jumpTo({ center: camera.center, zoom: camera.zoom })
        return
      }
      map.fitBounds(region.bounds, {
        padding: mapRegionPadding(),
        maxZoom: region.maxZoom,
        duration: mapMotionMs(800),
      })
    })
  }

  flyToRegionRef.current = flyToRegion

  async function shareDeepLink(
    href: string,
    text?: string,
    kind: 'view' | 'place' = 'place',
  ) {
    const map = mapRef.current
    const fitContext = fitContextRef.current
    let camera = map ? readMapCamera(map) : null
    // Prefer the canonical capital camera over a mid-flight or country-fit view.
    if (
      kind === 'place' &&
      fitContext?.kind === 'country' &&
      fitContext.preferCapital &&
      selectedEntry
    ) {
      camera = mapCapitalCamera(selectedEntry) ?? camera
    }
    if (map && kind === 'view') writeCameraHashFromMap(map)
    const result = await shareOrCopyMapLink(
      mapShareHref(href, layers, camera),
      {
        title: 'Cleo Maps',
        text,
      },
    )
    if (result === 'aborted') return
    setCopyKind(kind)
    setCopyState(result)
    window.setTimeout(() => setCopyState('idle'), 2200)
  }

  async function shareCurrentView() {
    await shareDeepLink(mapViewHref(), 'Earth on Cleo Maps', 'view')
  }

  function clearInvalidFocusLink() {
    setFocusAnnouncement('')
    syncMapFocusSearchParams(null, { history: 'replace' })
    fittedFocusKeyRef.current = null
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    searchInputRef.current?.focus()
  }

  function selectAtViewportCenter() {
    const map = mapRef.current
    if (!map || !ready) return
    const point = map.project(map.getCenter())
    const layers: string[] = []
    if (map.getLayer('capital-hits')) layers.push('capital-hits')
    if (map.getLayer('capital-labels')) layers.push('capital-labels')
    if (map.getLayer('country-fill')) layers.push('country-fill')
    if (layers.length === 0) {
      setFocusAnnouncement('No place at map center.')
      return
    }
    const hits = map.queryRenderedFeatures(point, { layers })
    const capitalHit = hits.find(
      (feature) =>
        feature.layer?.id === 'capital-hits' ||
        feature.layer?.id === 'capital-labels',
    )
    const countryHit = hits.find((feature) => feature.layer?.id === 'country-fill')
    const feature = capitalHit ?? countryHit
    if (!feature) {
      setFocusAnnouncement('No place at map center.')
      return
    }
    const code = String(feature.id ?? feature.properties?.code ?? '')
    if (!code) {
      setFocusAnnouncement('No place at map center.')
      return
    }
    const entry = indexRef.current.find((item) => item.code === code)
    if (entry) {
      flyToCountry(entry, {
        preferCapital:
          feature.layer?.id === 'capital-hits' ||
          feature.layer?.id === 'capital-labels',
        focusDossier: true,
      })
      return
    }
    const fallbackName = String(
      feature.properties?.country ?? feature.properties?.name ?? code,
    )
    const hit = resolveMapCountry(code, fallbackName)
    focusDossierOnSelectRef.current = true
    selectedCodeRef.current = hit.code
    setSelected(hit)
    setSelectedEntry(null)
    setActiveRegion(null)
    activeRegionRef.current = null
    setQuery(hit.name)
    setFocusAnnouncement(`Selected ${hit.name}.`)
    syncMapFocusSearchParams(
      { kind: 'country', value: hit.country?.slug ?? hit.code },
      { history: 'push' },
    )
  }

  function showSelectedCapital() {
    const map = mapRef.current
    const entry = selectedEntry
    if (!map || !entry?.capital) return
    setFocusAnnouncement(
      entry.capitalName
        ? `Showing ${entry.capitalName}.`
        : `Showing the capital of ${entry.name}.`,
    )
    if (fitContextRef.current?.kind === 'country') {
      fitContextRef.current.preferCapital = true
      fitContextRef.current.shared = false
      fitContextRef.current.liftAtFit = measuredDossierLiftPx
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      fitCountry(map, entry, { preferCapital: true })
    })
  }

  const activeRegionCamera = activeRegion
    ? regions.find((region) => region.id === activeRegion)
    : undefined
  const selectedRegionId = selectedEntry?.region
    ? parseMapRegionParam(selectedEntry.region)
    : null
  const selectedRegionCamera = selectedRegionId
    ? regions.find((region) => region.id === selectedRegionId) ??
      findMapRegionCamera(FALLBACK_MAP_REGIONS, selectedRegionId)
    : undefined

  const searchListId = `${reactId}-map-suggestions`
  const photo = selected ? countryPhotos[selected.code] : undefined
  const neighbors =
    selectedEntry && countries.length > 0
      ? findMapNeighbors(selectedEntry, countries)
      : []
  const regionSamples =
    activeRegion && countries.length > 0
      ? findMapRegionSamples(activeRegion, countries)
      : []
  const regionPhoto = regionSamples
    .map((sample) => countryPhotos[sample.code])
    .find((entry): entry is MapCountryPhoto => Boolean(entry))
  const regionGalleryHref = activeRegionCamera
    ? galleryHref(activeRegionCamera.label)
    : null
  const idleStarters =
    !selected && !activeRegion
      ? resolveMapIdleStarters(countries, regions)
      : []
  const suggestionCapitals: Record<string, string> = {}
  for (const [code, countryPhoto] of Object.entries(countryPhotos)) {
    if (countryPhoto.capital) suggestionCapitals[code] = countryPhoto.capital
  }
  const showSuggestionEmpty =
    suggestionsOpen &&
    query.trim().length > 0 &&
    suggestions.length === 0 &&
    ready &&
    loadState === 'ready'
  const regionButtons =
    regions.length > 0 ? regions : FALLBACK_MAP_REGIONS

  const invalidFocusLink =
    focusAnnouncement.startsWith('No country matched') ||
    focusAnnouncement.startsWith('No region matched')
  const showStatus = loadState !== 'ready' || invalidFocusLink
  const recoveryStarters =
    showStatus && loadState !== 'loading'
      ? resolveMapIdleStarters(countries, regions).slice(0, 3)
      : []

  const shareToastMessage =
    copyState === 'shared'
      ? copyKind === 'view'
        ? 'View link shared'
        : 'Place link shared'
      : copyState === 'copied'
        ? copyKind === 'view'
          ? 'View link copied'
          : 'Place link copied'
        : copyState === 'failed'
          ? 'Could not share link'
          : ''

  return (
    <div
      ref={rootRef}
      className={cn('earth-map', className)}
      data-has-selection={selected || activeRegion ? '' : undefined}
      data-suggestions-open={
        suggestionsOpen && (suggestions.length > 0 || showSuggestionEmpty)
          ? ''
          : undefined
      }
      aria-busy={loadState === 'loading' || undefined}
    >
      <div
        ref={containerRef}
        className="earth-map-canvas"
        role="application"
        aria-label="Interactive map of Earth. Press slash to search. Arrow keys pan, plus and minus zoom, Enter selects the place at center, Home resets."
        onKeyDown={(event) => {
          handleMapCanvasKeyDown(event, mapRef.current, {
            onHome: resetView,
            onSelectCenter: selectAtViewportCenter,
          })
        }}
      />

      <div className="earth-map-hud">
        <div
          ref={topChromeRef}
          className="earth-map-chrome earth-map-chrome-top"
        >
          <div className="earth-map-panel earth-map-brand">
            <MapsGlass />
            <h1 className="page-eyebrow">Maps</h1>
            <p className="earth-map-lede">
              NASA Blue Marble imagery with Natural Earth borders — find a
              country, capital, or territory, or jump by region.
            </p>
            <div className="earth-map-search">
              <label className="sr-only" htmlFor={`${reactId}-map-search`}>
                Find a country, capital, or region
              </label>
              <input
                ref={searchInputRef}
                id={`${reactId}-map-search`}
                type="search"
                role="combobox"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSuggestionsOpen(true)
                }}
                onFocus={() => {
                  if (query.trim()) setSuggestionsOpen(true)
                }}
                onBlur={(event) => {
                  const next = event.relatedTarget
                  if (
                    next instanceof Node &&
                    event.currentTarget.parentElement?.contains(next)
                  ) {
                    return
                  }
                  setSuggestionsOpen(false)
                  setSuggestions([])
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' && suggestions.length > 0) {
                    event.preventDefault()
                    setActiveSuggestion(
                      (index) => (index + 1) % suggestions.length,
                    )
                    return
                  }
                  if (event.key === 'ArrowUp' && suggestions.length > 0) {
                    event.preventDefault()
                    setActiveSuggestion(
                      (index) =>
                        (index - 1 + suggestions.length) % suggestions.length,
                    )
                    return
                  }
                  if (event.key === 'Enter' && suggestions[activeSuggestion]) {
                    event.preventDefault()
                    activateSuggestion(suggestions[activeSuggestion]!)
                    return
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    if (suggestions.length > 0 || suggestionsOpen) {
                      setSuggestionsOpen(false)
                      setSuggestions([])
                      return
                    }
                    focusMapCanvas()
                  }
                }}
                placeholder={
                  ready ? 'Find a country, capital, or region' : 'Loading map…'
                }
                autoComplete="off"
                spellCheck={false}
                aria-controls={searchListId}
                aria-expanded={
                  suggestionsOpen &&
                  (suggestions.length > 0 || showSuggestionEmpty)
                }
                aria-autocomplete="list"
                aria-activedescendant={
                  suggestions[activeSuggestion]
                    ? `${reactId}-option-${
                        suggestions[activeSuggestion]!.kind === 'region'
                          ? suggestions[activeSuggestion]!.region.id
                          : suggestions[activeSuggestion]!.entry.code
                      }`
                    : undefined
                }
                disabled={!ready}
              />
              {suggestions.length > 0 ? (
                <ul
                  id={searchListId}
                  role="listbox"
                  className="earth-map-suggestions"
                >
                  {suggestions.map((suggestion, index) => {
                    const optionId =
                      suggestion.kind === 'region'
                        ? suggestion.region.id
                        : suggestion.entry.code
                    const title =
                      suggestion.kind === 'region'
                        ? suggestion.region.label
                        : suggestion.entry.name
                    const trailing =
                      suggestion.kind === 'region'
                        ? 'Region'
                        : suggestion.entry.code
                    const secondary = mapSuggestionSecondary(
                      suggestion,
                      query,
                      suggestionCapitals,
                    )
                    return (
                      <li key={`${suggestion.kind}:${optionId}`}>
                        <button
                          id={`${reactId}-option-${optionId}`}
                          type="button"
                          role="option"
                          tabIndex={-1}
                          aria-selected={index === activeSuggestion}
                          data-active={index === activeSuggestion || undefined}
                          onMouseDown={(event) => {
                            // Keep combobox focus; activate on click.
                            event.preventDefault()
                            event.stopPropagation()
                          }}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            activateSuggestion(suggestion)
                          }}
                        >
                          <span className="earth-map-suggestion-main">
                            <span>{title}</span>
                            {secondary ? (
                              <span className="earth-map-suggestion-meta">
                                {secondary}
                              </span>
                            ) : null}
                          </span>
                          <span className="tabular-nums text-muted-foreground">
                            {trailing}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : showSuggestionEmpty ? (
                <div
                  id={searchListId}
                  className="earth-map-suggestions earth-map-suggestions-empty"
                  role="status"
                >
                  <p>No places match “{query.trim()}”.</p>
                  <div className="earth-map-suggestion-empty-actions">
                    <button
                      type="button"
                      className="earth-map-copy"
                      onMouseDown={(event) => {
                        // Keep the combobox focused for pointer clicks.
                        if (event.detail > 0) event.preventDefault()
                      }}
                      onClick={() => {
                        setQuery('')
                        setSuggestions([])
                        setSuggestionsOpen(false)
                        searchInputRef.current?.focus()
                      }}
                    >
                      Clear search
                    </button>
                    {regionButtons.slice(0, 3).map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        className="earth-map-neighbor"
                        disabled={!ready}
                        onMouseDown={(event) => {
                          if (event.detail > 0) event.preventDefault()
                        }}
                        onClick={(event) => {
                          flyToRegion(region, {
                            focusDossier: isKeyboardActivation(event),
                          })
                        }}
                      >
                        {region.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {regionButtons.length > 0 ? (
            <div
              className="earth-map-regions"
              role="group"
              aria-label="Jump to region"
            >
              {regionButtons.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  className="earth-map-region"
                  data-active={activeRegion === region.id || undefined}
                  aria-pressed={activeRegion === region.id}
                  disabled={!ready}
                  onClick={(event) =>
                    flyToRegion(region, {
                      focusDossier: isKeyboardActivation(event),
                    })
                  }
                >
                  <span>{region.label}</span>
                  {region.tally > 0 ? (
                    <span className="tabular-nums text-muted-foreground">
                      {region.tally}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}

          <div
            className="earth-map-layers"
            role="group"
            aria-label="Map layers"
          >
            <button
              type="button"
              className="earth-map-layer"
              data-active={layers.borders || undefined}
              aria-pressed={layers.borders}
              disabled={!ready}
              onClick={() => toggleLayer('borders')}
            >
              Borders
            </button>
            <button
              type="button"
              className="earth-map-layer"
              data-active={layers.labels || undefined}
              aria-pressed={layers.labels}
              disabled={!ready}
              onClick={() => toggleLayer('labels')}
            >
              Labels
            </button>
            <button
              type="button"
              className="earth-map-layer"
              data-active={layers.graticule || undefined}
              aria-pressed={layers.graticule}
              disabled={!ready}
              onClick={() => toggleLayer('graticule')}
            >
              Graticule
            </button>
          </div>

          {showStatus ? (
            <div className="earth-map-panel earth-map-status-panel">
              <MapsGlass />
              <p
                className="earth-map-status"
                data-tone={
                  loadState === 'degraded' || invalidFocusLink
                    ? 'warn'
                    : undefined
                }
                aria-live="polite"
              >
                {loadState === 'loading'
                  ? 'Loading Blue Marble basemap and country borders…'
                  : loadState === 'degraded'
                    ? 'Basemap ready — country search is unavailable right now.'
                    : focusAnnouncement}
              </p>
              {loadState !== 'loading' &&
              (loadState === 'degraded' || invalidFocusLink) ? (
                <div className="earth-map-status-actions">
                  {invalidFocusLink ? (
                    <button
                      type="button"
                      className="earth-map-copy"
                      onClick={clearInvalidFocusLink}
                    >
                      Clear link
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="earth-map-copy"
                    onClick={() => searchInputRef.current?.focus()}
                  >
                    Search
                  </button>
                  {recoveryStarters.map((starter) => (
                    <button
                      key={starter.key}
                      type="button"
                      className="earth-map-neighbor"
                      disabled={!ready || countries.length === 0}
                      onClick={(event) => {
                        setFocusAnnouncement('')
                        const focusDossier = isKeyboardActivation(event)
                        if (starter.kind === 'country') {
                          flyToCountry(starter.entry, { focusDossier })
                          return
                        }
                        flyToRegion(starter.region, { focusDossier })
                      }}
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="earth-map-chrome earth-map-chrome-meta">
          <div className="earth-map-panel earth-map-meta" aria-live="polite">
            <MapsGlass />
            {pointerLabel ? (
              <span className="earth-map-pointer-label">{pointerLabel}</span>
            ) : null}
            <span>{coords}</span>
            <span className="tabular-nums">z{zoom.toFixed(1)}</span>
            <button
              type="button"
              className="earth-map-reset"
              onClick={() => {
                void shareCurrentView()
              }}
              disabled={!ready}
              title="Share or copy a link to this exact map view"
            >
              Share view
            </button>
            <button
              type="button"
              className="earth-map-reset"
              onClick={resetView}
              title="Reset map view"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          ref={bottomChromeRef}
          className="earth-map-chrome earth-map-chrome-bottom"
        >
          {selected ? (
            <div
              ref={selectionPanelRef}
              className="earth-map-panel earth-map-selection"
              tabIndex={-1}
              aria-label={`${selected.name} selected`}
            >
              <MapsGlass />
              {photo ? (
                <div className="earth-map-photo">
                  <ZoomImage
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="earth-map-photo-thumb"
                    sizes="4.75rem"
                    renditions={photo.renditions}
                    expandedContent={
                      <PhotoZoomDetails
                        collection="places"
                        title={photo.placeName}
                        subtitle={photo.name}
                        photographer={photo.photographer}
                        license={photo.license}
                      />
                    }
                  />
                  <div className="earth-map-photo-caption">
                    <p className="earth-map-selection-code tabular-nums">
                      {selected.code}
                    </p>
                    <p className="earth-map-selection-name">{selected.name}</p>
                    <p className="earth-map-photo-place">
                      {[
                        selectedEntry?.region ?? selected.country?.region,
                        (selectedEntry?.capitalName ?? photo.capital)
                          ? `Capital · ${selectedEntry?.capitalName ?? photo.capital}`
                          : null,
                        photo.placeName,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="earth-map-selection-code tabular-nums">
                    {selected.code}
                  </p>
                  <p className="earth-map-selection-name">{selected.name}</p>
                  <p className="earth-map-photo-place">
                    {[
                      selectedEntry?.region ?? selected.country?.region,
                      selectedEntry?.capitalName
                        ? `Capital · ${selectedEntry.capitalName}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Territory on the map'}
                  </p>
                </div>
              )}
              {photo?.aboutExcerpt ? (
                <p className="earth-map-selection-about">{photo.aboutExcerpt}</p>
              ) : !selected.href ? (
                <p className="earth-map-selection-about">
                  Borders and place name from Natural Earth — no Explore field
                  guide for this territory yet.
                </p>
              ) : null}
              {photo?.places?.length ? (
                <p className="earth-map-selection-places">
                  {photo.places.join(' · ')}
                </p>
              ) : null}
              {neighbors.length > 0 ? (
                <div className="earth-map-neighbors">
                  <p className="earth-map-neighbors-label">Nearby</p>
                  <div
                    className="earth-map-neighbors-list"
                    role="group"
                    aria-label="Nearby places"
                  >
                    {neighbors.map((neighbor) => (
                      <button
                        key={neighbor.code}
                        type="button"
                        className="earth-map-neighbor"
                        onClick={(event) =>
                          flyToCountry(neighbor, {
                            focusDossier: isKeyboardActivation(event),
                          })
                        }
                      >
                        {neighbor.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="earth-map-selection-actions">
                {selected.href ? (
                  <Link href={selected.href} className="earth-map-guide-link">
                    Open field guide →
                  </Link>
                ) : (
                  <Link href="/explore" className="earth-map-guide-link">
                    Browse Explore →
                  </Link>
                )}
                {photo?.galleryHref ? (
                  <Link href={photo.galleryHref} className="earth-map-guide-link">
                    Photos →
                  </Link>
                ) : null}
                <Link href="/space/earth" className="earth-map-guide-link">
                  Earth from space →
                </Link>
                {selectedEntry ? (
                  <button
                    type="button"
                    className="earth-map-copy"
                    onClick={fitSelectedCountry}
                  >
                    Fit country
                  </button>
                ) : null}
                {selectedEntry?.capital ? (
                  <button
                    type="button"
                    className="earth-map-copy"
                    onClick={showSelectedCapital}
                  >
                    Show capital
                  </button>
                ) : null}
                {selectedRegionCamera ? (
                  <button
                    type="button"
                    className="earth-map-copy"
                    onClick={(event) =>
                      flyToRegion(selectedRegionCamera, {
                        focusDossier: isKeyboardActivation(event),
                      })
                    }
                  >
                    {selectedRegionCamera.label}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={() => {
                    void shareDeepLink(
                      selected.mapHref ?? mapCountryHref(selected.code),
                      selected.name,
                      'place',
                    )
                  }}
                >
                  Share place
                </button>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={clearSelection}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={focusMapCanvas}
                >
                  Back to map
                </button>
              </div>
            </div>
          ) : activeRegionCamera ? (
            <div
              ref={selectionPanelRef}
              className="earth-map-panel earth-map-selection"
              tabIndex={-1}
              aria-label={`${activeRegionCamera.label} region`}
            >
              <MapsGlass />
              {regionPhoto ? (
                <div className="earth-map-photo">
                  <ZoomImage
                    src={regionPhoto.src}
                    alt={regionPhoto.alt}
                    width={regionPhoto.width}
                    height={regionPhoto.height}
                    className="earth-map-photo-thumb"
                    sizes="4.75rem"
                    renditions={regionPhoto.renditions}
                    expandedContent={
                      <PhotoZoomDetails
                        collection="places"
                        title={regionPhoto.placeName}
                        subtitle={regionPhoto.name}
                        photographer={regionPhoto.photographer}
                        license={regionPhoto.license}
                      />
                    }
                  />
                  <div className="earth-map-photo-caption">
                    <p className="earth-map-selection-code tabular-nums">
                      Region
                    </p>
                    <p className="earth-map-selection-name">
                      {activeRegionCamera.label}
                    </p>
                    <p className="earth-map-photo-place">
                      {activeRegionCamera.tally} Explore guides · framed on
                      Blue Marble Earth
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="earth-map-selection-code tabular-nums">Region</p>
                  <p className="earth-map-selection-name">
                    {activeRegionCamera.label}
                  </p>
                  <p className="earth-map-photo-place">
                    {activeRegionCamera.tally} Explore guides · framed on Blue
                    Marble Earth
                  </p>
                </div>
              )}
              {regionSamples.length > 0 ? (
                <div className="earth-map-neighbors">
                  <p className="earth-map-neighbors-label">Places</p>
                  <div
                    className="earth-map-neighbors-list"
                    role="group"
                    aria-label={`Places in ${activeRegionCamera.label}`}
                  >
                    {regionSamples.map((sample) => (
                      <button
                        key={sample.code}
                        type="button"
                        className="earth-map-neighbor"
                        onClick={(event) =>
                          flyToCountry(sample, {
                            focusDossier: isKeyboardActivation(event),
                          })
                        }
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="earth-map-selection-actions">
                <Link
                  href={exploreRegionHref(activeRegionCamera.id)}
                  className="earth-map-guide-link"
                >
                  Browse Explore guides →
                </Link>
                {regionGalleryHref ? (
                  <Link href={regionGalleryHref} className="earth-map-guide-link">
                    Photos →
                  </Link>
                ) : null}
                <Link href="/space/earth" className="earth-map-guide-link">
                  Earth from space →
                </Link>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={fitActiveRegion}
                >
                  Fit region
                </button>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={() => {
                    void shareDeepLink(
                      mapRegionHref(activeRegionCamera.id),
                      activeRegionCamera.label,
                      'place',
                    )
                  }}
                >
                  Share region
                </button>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={clearSelection}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={focusMapCanvas}
                >
                  Back to map
                </button>
              </div>
            </div>
          ) : (
            <div className="earth-map-panel earth-map-idle">
              <MapsGlass />
              <p className="earth-map-hint">
                Pick a place to begin. Press / to search · arrows pan · Enter
                selects the place at center.
              </p>
              {idleStarters.length > 0 ? (
                <div
                  className="earth-map-starters"
                  role="group"
                  aria-label="Suggested places"
                >
                  {idleStarters.map((starter) => (
                    <button
                      key={starter.key}
                      type="button"
                      className="earth-map-neighbor"
                      disabled={!ready}
                      onClick={(event) => {
                        const focusDossier = isKeyboardActivation(event)
                        if (starter.kind === 'country') {
                          flyToCountry(starter.entry, { focusDossier })
                          return
                        }
                        flyToRegion(starter.region, { focusDossier })
                      }}
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="earth-map-selection-actions">
                <Link href="/space/earth" className="earth-map-guide-link">
                  Earth from space →
                </Link>
              </div>
            </div>
          )}
          <p className="earth-map-credit">
            {mapAttribution.basemap.name} · {mapAttribution.boundaries.name}
            {mapAttribution.capitals?.name
              ? ` · ${mapAttribution.capitals.name}`
              : ''}
          </p>
        </div>

        {copyState !== 'idle' ? (
          <div
            className="earth-map-toast"
            role="status"
            data-tone={copyState === 'failed' ? 'warn' : undefined}
          >
            <MapsGlass />
            <span>{shareToastMessage}</span>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {[focusAnnouncement, shareToastMessage].filter(Boolean).join(' ')}
      </p>
    </div>
  )
}
