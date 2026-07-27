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
  filterMapCountrySuggestions,
  findMapCountryIndexEntry,
  findMapRegionCamera,
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
  mapCountryHref,
  mapCountrySuggestionMatchKind,
  mapHrefWithLayers,
  mapRegionHref,
  mapViewHref,
  parseMapCameraHash,
  parseMapLayersSearchParams,
  readStoredMapLayers,
  resolveMapCountry,
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

const MAP_REGION_PADDING = {
  top: 120,
  bottom: 140,
  left: 40,
  right: 40,
} as const

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

const BORDER_LAYER_IDS = ['country-fill', 'country-line'] as const
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
  for (const id of BORDER_LAYER_IDS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', borderVisibility)
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
  onHome?: () => void,
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
    padding: { ...MAP_FOCUS_PADDING },
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
  const selectionPanelRef = useRef<HTMLDivElement | null>(null)
  const suggestionsOpenRef = useRef(false)
  const layersRef = useRef<MapLayerVisibility>({ ...DEFAULT_MAP_LAYERS })
  const resetViewRef = useRef<() => void>(() => {})
  const cameraHashPausedRef = useRef(false)
  const fittedFocusKeyRef = useRef<string | null>(null)

  const [ready, setReady] = useState(false)
  /** Bumps when a MapLibre instance becomes ready so deep links re-apply after remounts. */
  const [mapEpoch, setMapEpoch] = useState(0)
  const [coords, setCoords] = useState('—')
  const [zoom, setZoom] = useState(MAP_MIN_ZOOM)
  const [selected, setSelected] = useState<MapCountryHit | null>(null)
  const [query, setQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<MapCountryIndexEntry[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [regions, setRegions] = useState<MapRegionCamera[]>(
    initialIndex?.regions ?? [],
  )
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_MAP_LAYERS)
  const [layersHydrated, setLayersHydrated] = useState(false)
  const [copyState, setCopyState] = useState<
    'idle' | 'copied' | 'shared' | 'failed'
  >('idle')
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'degraded'>(
    'loading',
  )
  const [focusAnnouncement, setFocusAnnouncement] = useState('')

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
      'Interactive map of Earth. Arrow keys pan, plus and minus zoom, Home resets.',
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

    const setHover = (code: string | null) => {
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
      } else {
        map.getCanvas().style.cursor = ''
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
        const capitalName = indexed?.capitalName
        setFocusAnnouncement(
          preferCapital && capitalName
            ? `Selected ${hit.name}. Showing ${capitalName}.`
            : `Selected ${hit.name}.`,
        )
        syncMapFocusSearchParams({
          kind: 'country',
          value: hit.country?.slug ?? hit.code,
        })
        if (indexed) {
          withCameraHashPause(map, cameraHashPausedRef, () => {
            fitCountry(map, indexed, { preferCapital })
          })
        }
      } else {
        setQuery('')
        setFocusAnnouncement('Selection cleared.')
        syncMapFocusSearchParams(null)
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

    const bindInteractionHandlers = () => {
      if (!countryHandlersBound && map.getLayer('country-fill')) {
        countryHandlersBound = true

        map.on('mousemove', 'country-fill', (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          const code = feature
            ? String(feature.id ?? feature.properties?.code ?? '')
            : ''
          setHover(code || null)
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
          // Prefer a capital hit when the click lands on both layers.
          if (map.getLayer('capital-hits')) {
            const capitalHits = map.queryRenderedFeatures(event.point, {
              layers: ['capital-hits'],
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
          if (!map.getLayer('country-fill')) return
          const layers = ['country-fill']
          if (map.getLayer('capital-hits')) layers.push('capital-hits')
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
          setHover(code || null)
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
        upsertLabelLayers(map, indexRef.current, regionsRef.current)
        applyLayerVisibility(map, layersRef.current, selectedCodeRef.current)
      } catch {
        indexFailed = true
        if (!initialIndex?.countries.length) {
          indexRef.current = []
          regionsRef.current = []
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
      if (!map.getSource('countries') || !countryHandlersBound) {
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
    if (!ready || mapEpoch === 0) return
    const map = mapRef.current
    if (!map) return
    if (countryParam) {
      const entry = findMapCountryIndexEntry(indexRef.current, countryParam)
      if (!entry) {
        setFocusAnnouncement(`No country matched “${countryParam}”.`)
        syncMapFocusSearchParams(null)
        fittedFocusKeyRef.current = null
        return
      }
      const focusKey = `country:${entry.code}@${mapEpoch}`
      if (fittedFocusKeyRef.current === focusKey) return
      fittedFocusKeyRef.current = focusKey
      flyToCountry(entry, { syncUrl: false })
      return
    }
    if (regionParam) {
      const region = findMapRegionCamera(regionsRef.current, regionParam)
      if (!region) {
        setFocusAnnouncement(`No region matched “${regionParam}”.`)
        syncMapFocusSearchParams(null)
        fittedFocusKeyRef.current = null
        return
      }
      const focusKey = `region:${region.id}@${mapEpoch}`
      if (fittedFocusKeyRef.current === focusKey) return
      fittedFocusKeyRef.current = focusKey
      flyToRegion(region, { syncUrl: false })
      return
    }
    fittedFocusKeyRef.current = null
  }, [ready, mapEpoch, countryParam, regionParam])

  useEffect(() => {
    if (!selected && !activeRegion) return
    const panel = selectionPanelRef.current
    if (!panel) return
    // Defer so fitBounds / paint settle before moving focus.
    const id = window.requestAnimationFrame(() => {
      panel.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(id)
  }, [selected?.code, activeRegion])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (suggestionsOpenRef.current) return
      if (!selectedCodeRef.current && !activeRegionRef.current) return
      event.preventDefault()
      resetViewRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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
    const next = filterMapCountrySuggestions(
      indexRef.current,
      trimmed,
      capitals,
    )
    setSuggestions(next)
    setActiveSuggestion(0)
  }, [query, ready, suggestionsOpen, countryPhotos])

  function flyToCountry(
    entry: MapCountryIndexEntry,
    {
      syncUrl = true,
      preferCapital = false,
    }: { syncUrl?: boolean; preferCapital?: boolean } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    const hit = resolveMapCountry(entry.code, entry.name)
    const previous = selectedCodeRef.current
    syncSelectionFeatureState(map, previous, hit.code)
    selectedCodeRef.current = hit.code
    setSelected(hit)
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
      preferCapital && capitalName
        ? `Selected ${hit.name}. Showing ${capitalName}.`
        : `Selected ${hit.name}.`,
    )
    if (syncUrl) {
      syncMapFocusSearchParams({
        kind: 'country',
        value: entry.slug ?? entry.code,
      })
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      fitCountry(map, entry, { preferCapital })
    })
  }

  function flyToCountryFromQuery(entry: MapCountryIndexEntry) {
    const capitals: Record<string, string> = {}
    for (const [code, photo] of Object.entries(countryPhotos)) {
      if (photo.capital) capitals[code] = photo.capital
    }
    const kind = mapCountrySuggestionMatchKind(entry, query, capitals)
    flyToCountry(entry, { preferCapital: kind === 'capital' })
  }

  function resetView() {
    const map = mapRef.current
    if (!map) return
    syncSelectionFeatureState(map, selectedCodeRef.current, null)
    selectedCodeRef.current = null
    setSelected(null)
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    syncCapitalLayerPresentation(map, layersRef.current.labels, null)
    setFocusAnnouncement('Map reset.')
    syncMapFocusSearchParams(null)
    cameraHashPausedRef.current = true
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      cameraHashPausedRef.current = false
      syncMapCameraHash(null)
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

  function toggleLayer(id: MapLayerId) {
    setLayers((current) => ({ ...current, [id]: !current[id] }))
  }

  function flyToRegion(
    region: MapRegionCamera,
    { syncUrl = true }: { syncUrl?: boolean } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    syncSelectionFeatureState(map, selectedCodeRef.current, null)
    selectedCodeRef.current = null
    setSelected(null)
    setQuery('')
    setSuggestionsOpen(false)
    setSuggestions([])
    setCopyState('idle')
    syncCapitalLayerPresentation(map, layersRef.current.labels, null)
    setActiveRegion(region.id)
    activeRegionRef.current = region.id
    setFocusAnnouncement(`Viewing ${region.label}.`)
    if (syncUrl) {
      syncMapFocusSearchParams({ kind: 'region', value: region.id })
    }
    withCameraHashPause(map, cameraHashPausedRef, () => {
      map.fitBounds(region.bounds, {
        padding: { ...MAP_REGION_PADDING },
        maxZoom: region.maxZoom,
        duration: mapMotionMs(800),
      })
    })
  }

  async function shareDeepLink(href: string, text?: string) {
    const result = await shareOrCopyMapLink(mapHrefWithLayers(href, layers), {
      title: 'Cleo Maps',
      text,
    })
    if (result === 'aborted') return
    setCopyState(result)
    window.setTimeout(() => setCopyState('idle'), 2200)
  }

  async function shareCurrentView() {
    const map = mapRef.current
    if (map) writeCameraHashFromMap(map)
    await shareDeepLink(mapViewHref(), 'Earth on Cleo Maps')
  }

  const activeRegionCamera = activeRegion
    ? regions.find((region) => region.id === activeRegion)
    : undefined

  const searchListId = `${reactId}-map-suggestions`
  const photo = selected ? countryPhotos[selected.code] : undefined
  const showSuggestionEmpty =
    suggestionsOpen &&
    query.trim().length > 0 &&
    suggestions.length === 0 &&
    ready &&
    loadState === 'ready'
  const regionButtons =
    regions.length > 0 ? regions : FALLBACK_MAP_REGIONS

  const showStatus =
    loadState !== 'ready' ||
    focusAnnouncement.startsWith('No country matched') ||
    focusAnnouncement.startsWith('No region matched')

  return (
    <div
      className={cn('earth-map', className)}
      data-has-selection={selected || activeRegion ? '' : undefined}
      aria-busy={loadState === 'loading' || undefined}
    >
      <div
        ref={containerRef}
        className="earth-map-canvas"
        role="application"
        aria-label="Interactive map of Earth. Arrow keys pan, plus and minus zoom, Home resets."
        onKeyDown={(event) => {
          handleMapCanvasKeyDown(event, mapRef.current, resetView)
        }}
      />

      <div className="earth-map-hud">
        <div className="earth-map-chrome earth-map-chrome-top">
          <div className="earth-map-panel earth-map-brand">
            <MapsGlass />
            <h1 className="page-eyebrow">Maps</h1>
            <p className="earth-map-lede">
              NASA Blue Marble imagery with Natural Earth borders — find a
              country or jump by region.
            </p>
            <div className="earth-map-search">
              <label className="sr-only" htmlFor={`${reactId}-map-search`}>
                Find a country
              </label>
              <input
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
                    flyToCountryFromQuery(suggestions[activeSuggestion]!)
                    return
                  }
                  if (event.key === 'Escape') {
                    if (suggestions.length > 0 || suggestionsOpen) {
                      setSuggestionsOpen(false)
                      setSuggestions([])
                      return
                    }
                    if (selected || activeRegion) {
                      event.preventDefault()
                      resetView()
                    }
                  }
                }}
                placeholder={ready ? 'Find a country' : 'Loading map…'}
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
                    ? `${reactId}-option-${suggestions[activeSuggestion]!.code}`
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
                  {suggestions.map((entry, index) => {
                    const capital = countryPhotos[entry.code]?.capital
                    return (
                      <li key={entry.code}>
                        <button
                          id={`${reactId}-option-${entry.code}`}
                          type="button"
                          role="option"
                          aria-selected={index === activeSuggestion}
                          data-active={index === activeSuggestion || undefined}
                          onMouseDown={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            flyToCountryFromQuery(entry)
                          }}
                        >
                          <span className="earth-map-suggestion-main">
                            <span>{entry.name}</span>
                            {capital ? (
                              <span className="earth-map-suggestion-meta">
                                Capital · {capital}
                              </span>
                            ) : null}
                          </span>
                          <span className="tabular-nums text-muted-foreground">
                            {entry.code}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : showSuggestionEmpty ? (
                <p
                  id={searchListId}
                  className="earth-map-suggestions earth-map-suggestions-empty"
                  role="status"
                >
                  No countries match “{query.trim()}”.
                </p>
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
                  onClick={() => flyToRegion(region)}
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
                  loadState === 'degraded' || focusAnnouncement.startsWith('No ')
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
            </div>
          ) : null}
        </div>

        <div className="earth-map-chrome earth-map-chrome-meta">
          <div className="earth-map-panel earth-map-meta" aria-live="polite">
            <MapsGlass />
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
              {copyState === 'shared'
                ? 'Shared'
                : copyState === 'copied'
                  ? 'Copied'
                  : copyState === 'failed'
                    ? 'Failed'
                    : 'Share'}
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

        <div className="earth-map-chrome earth-map-chrome-bottom">
          {selected ? (
            <div
              ref={selectionPanelRef}
              className="earth-map-panel earth-map-selection"
              tabIndex={-1}
            >
              <MapsGlass />
              {photo ? (
                <Link href={photo.href} className="earth-map-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static atlas JPEG with known path */}
                  <img src={photo.src} alt={photo.alt} width={160} height={106} />
                  <span className="earth-map-photo-caption">
                    <span className="earth-map-selection-code tabular-nums">
                      {selected.code}
                    </span>
                    <span className="earth-map-selection-name">{selected.name}</span>
                    <span className="earth-map-photo-place">
                      {[
                        selected.country?.region,
                        photo.capital ? `Capital · ${photo.capital}` : null,
                        photo.placeName,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                </Link>
              ) : (
                <div>
                  <p className="earth-map-selection-code tabular-nums">
                    {selected.code}
                  </p>
                  <p className="earth-map-selection-name">{selected.name}</p>
                  {selected.country?.region ? (
                    <p className="earth-map-photo-place">
                      {selected.country.region}
                    </p>
                  ) : null}
                </div>
              )}
              {photo?.aboutExcerpt ? (
                <p className="earth-map-selection-about">{photo.aboutExcerpt}</p>
              ) : null}
              {photo?.places?.length ? (
                <p className="earth-map-selection-places">
                  {photo.places.join(' · ')}
                </p>
              ) : null}
              <div className="earth-map-selection-actions">
                {selected.href ? (
                  <Link href={selected.href} className="earth-map-guide-link">
                    Open field guide →
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No Explore guide yet
                  </p>
                )}
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={() => {
                    void shareDeepLink(
                      selected.mapHref ?? mapCountryHref(selected.code),
                      selected.name,
                    )
                  }}
                >
                  {copyState === 'shared'
                    ? 'Shared'
                    : copyState === 'copied'
                      ? 'Copied link'
                      : copyState === 'failed'
                        ? 'Share failed'
                        : 'Share link'}
                </button>
              </div>
            </div>
          ) : activeRegionCamera ? (
            <div
              ref={selectionPanelRef}
              className="earth-map-panel earth-map-selection"
              tabIndex={-1}
            >
              <MapsGlass />
              <div>
                <p className="earth-map-selection-code tabular-nums">Region</p>
                <p className="earth-map-selection-name">
                  {activeRegionCamera.label}
                </p>
                <p className="earth-map-photo-place">
                  {activeRegionCamera.tally} Explore guides
                </p>
              </div>
              <div className="earth-map-selection-actions">
                <Link
                  href={exploreRegionHref(activeRegionCamera.id)}
                  className="earth-map-guide-link"
                >
                  Browse Explore guides →
                </Link>
                <button
                  type="button"
                  className="earth-map-copy"
                  onClick={() => {
                    void shareDeepLink(
                      mapRegionHref(activeRegionCamera.id),
                      activeRegionCamera.label,
                    )
                  }}
                >
                  {copyState === 'shared'
                    ? 'Shared'
                    : copyState === 'copied'
                      ? 'Copied link'
                      : copyState === 'failed'
                        ? 'Share failed'
                        : 'Share link'}
                </button>
              </div>
            </div>
          ) : (
            <div className="earth-map-panel">
              <MapsGlass />
              <p className="earth-map-hint">
                Pan and zoom (arrow keys when the map is focused; Home resets),
                share the current view, toggle borders, labels, and graticule,
                jump by region, or click a country or capital for its Explore
                field guide.
              </p>
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
            <span>
              {copyState === 'shared'
                ? 'Link shared'
                : copyState === 'copied'
                  ? 'Link copied'
                  : 'Could not share link'}
            </span>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {[
          focusAnnouncement,
          copyState === 'shared'
            ? 'Link shared'
            : copyState === 'copied'
              ? 'Link copied to clipboard'
              : copyState === 'failed'
                ? 'Could not share link'
                : '',
        ]
          .filter(Boolean)
          .join(' ')}
      </p>
    </div>
  )
}
