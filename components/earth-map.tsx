'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
  type MapLayerMouseEvent,
  type MapMouseEvent,
  type StyleSpecification,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { ensureMapLibreWorker } from '~/lib/maplibre-worker'
import {
  findMapCountryIndexEntry,
  findMapRegionCamera,
  formatMapCoords,
  MAP_COUNTRIES_URL,
  MAP_COUNTRY_INDEX_URL,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_TILE_SIZE,
  MAP_TILE_URL,
  mapAttribution,
  mapCountryHref,
  mapRegionHref,
  resolveMapCountry,
  syncMapFocusSearchParams,
  type MapCountryHit,
  type MapCountryIndex,
  type MapCountryIndexEntry,
  type MapCountryPhoto,
  type MapRegionCamera,
} from '~/lib/maps'
import { cn } from '~/lib/utils'

type EarthMapProps = {
  className?: string
  countryPhotos?: Record<string, MapCountryPhoto>
}

function basemapStyle(): StyleSpecification {
  return {
    version: 8,
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

function fitCountry(map: MapLibreMap, entry: MapCountryIndexEntry) {
  map.fitBounds(entry.bounds, {
    padding: { top: 72, bottom: 110, left: 48, right: 48 },
    maxZoom: Math.min(entry.maxZoom, MAP_MAX_ZOOM + 1.25),
    duration: 800,
  })
}

export function EarthMap({ className, countryPhotos = {} }: EarthMapProps) {
  const reactId = useId()
  const searchParams = useSearchParams()
  const countryParam = searchParams.get('country')
  const regionParam = searchParams.get('region')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const hoveredCodeRef = useRef<string | null>(null)
  const selectedCodeRef = useRef<string | null>(null)
  const activeRegionRef = useRef<string | null>(null)
  const indexRef = useRef<MapCountryIndexEntry[]>([])
  const regionsRef = useRef<MapRegionCamera[]>([])
  const suppressMapClickRef = useRef<() => void>(() => {})
  const indexReadyRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [coords, setCoords] = useState('—')
  const [zoom, setZoom] = useState(MAP_MIN_ZOOM)
  const [selected, setSelected] = useState<MapCountryHit | null>(null)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<MapCountryIndexEntry[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [regions, setRegions] = useState<MapRegionCamera[]>([])
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    ensureMapLibreWorker()

    const map = new MapLibreMap({
      container,
      style: basemapStyle(),
      center: [10, 20],
      zoom: 1.2,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM + 1.5,
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

    const setSelection = (hit: MapCountryHit | null, entry?: MapCountryIndexEntry) => {
      if (map.getSource('countries')) {
        const previous = selectedCodeRef.current
        if (previous && previous !== hit?.code) {
          map.setFeatureState({ source: 'countries', id: previous }, { selected: false })
        }
        if (hit) {
          map.setFeatureState({ source: 'countries', id: hit.code }, { selected: true })
        }
      }
      selectedCodeRef.current = hit?.code ?? null
      setSelected(hit)
      setActiveRegion(null)
      activeRegionRef.current = null
      setCopyState('idle')
      if (hit) {
        syncMapFocusSearchParams({
          kind: 'country',
          value: hit.country?.slug ?? hit.code,
        })
        if (entry) fitCountry(map, entry)
        else {
          const indexed = indexRef.current.find((item) => item.code === hit.code)
          if (indexed) fitCountry(map, indexed)
        }
      } else {
        syncMapFocusSearchParams(null)
      }
    }

    const onMove = () => {
      const center = map.getCenter()
      setCoords(formatMapCoords(center.lng, center.lat))
      setZoom(map.getZoom())
    }

    let markedReady = false
    const markReady = ({ requireIndex = true }: { requireIndex?: boolean } = {}) => {
      if (markedReady) return
      if (requireIndex && !indexReadyRef.current) return
      markedReady = true
      onMove()
      setReady(true)
    }

    let countryHandlersBound = false
    let ignoreMapClicksUntil = 0

    const bindCountryHandlers = () => {
      if (countryHandlersBound || !map.getLayer('country-fill')) return
      countryHandlersBound = true

      map.on('mousemove', 'country-fill', (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0]
        const code = feature ? String(feature.id ?? feature.properties?.code ?? '') : ''
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
        const feature = event.features?.[0]
        if (!feature) return
        const code = String(feature.id ?? feature.properties?.code ?? '')
        if (!code) return
        const hit = resolveMapCountry(code, String(feature.properties?.name ?? code))
        setSelection(hit)
      })

      map.on('click', (event: MapMouseEvent) => {
        if (performance.now() < ignoreMapClicksUntil) return
        if (!map.getLayer('country-fill')) return
        const hits = map.queryRenderedFeatures(event.point, {
          layers: ['country-fill'],
        })
        if (hits.length === 0) setSelection(null)
      })
    }

    const ensureCountryLayers = () => {
      if (!map.getSource('countries')) {
        addCountryLayers(map)
      }
      bindCountryHandlers()
    }

    const hydrateCountries = async () => {
      try {
        ensureCountryLayers()
        const indexResponse = await fetch(MAP_COUNTRY_INDEX_URL)
        const index = (await indexResponse.json()) as MapCountryIndex
        indexRef.current = index.countries
        regionsRef.current = index.regions ?? []
        setRegions(regionsRef.current)
      } catch {
        indexRef.current = []
        regionsRef.current = []
        setRegions([])
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
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (countryParam) {
      const entry = findMapCountryIndexEntry(indexRef.current, countryParam)
      if (!entry) return
      if (selectedCodeRef.current === entry.code) return
      flyToCountry(entry, { syncUrl: false })
      return
    }
    if (regionParam) {
      const region = findMapRegionCamera(regionsRef.current, regionParam)
      if (!region) return
      if (activeRegionRef.current === region.id && !selectedCodeRef.current) return
      flyToRegion(region, { syncUrl: false })
    }
  }, [ready, countryParam, regionParam])

  useEffect(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      setSuggestions([])
      setActiveSuggestion(0)
      return
    }
    const next = indexRef.current
      .filter(
        (entry) =>
          entry.name.toLowerCase().includes(trimmed) ||
          entry.code.toLowerCase() === trimmed ||
          entry.slug?.toLowerCase() === trimmed,
      )
      .slice(0, 8)
    setSuggestions(next)
    setActiveSuggestion(0)
  }, [query, ready])

  function flyToCountry(
    entry: MapCountryIndexEntry,
    { syncUrl = true }: { syncUrl?: boolean } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    const hit = resolveMapCountry(entry.code, entry.name)
    const previous = selectedCodeRef.current
    if (map.getSource('countries')) {
      if (previous && previous !== hit.code) {
        map.setFeatureState({ source: 'countries', id: previous }, { selected: false })
      }
      map.setFeatureState({ source: 'countries', id: hit.code }, { selected: true })
    }
    selectedCodeRef.current = hit.code
    setSelected(hit)
    setQuery(entry.name)
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    if (syncUrl) {
      syncMapFocusSearchParams({
        kind: 'country',
        value: entry.slug ?? entry.code,
      })
    }
    fitCountry(map, entry)
  }

  function resetView() {
    const map = mapRef.current
    if (!map) return
    if (selectedCodeRef.current && map.getSource('countries')) {
      map.setFeatureState(
        { source: 'countries', id: selectedCodeRef.current },
        { selected: false },
      )
    }
    selectedCodeRef.current = null
    setSelected(null)
    setQuery('')
    setSuggestions([])
    setActiveRegion(null)
    activeRegionRef.current = null
    setCopyState('idle')
    syncMapFocusSearchParams(null)
    map.easeTo({ center: [10, 20], zoom: 1.2, duration: 600 })
  }

  function flyToRegion(
    region: MapRegionCamera,
    { syncUrl = true }: { syncUrl?: boolean } = {},
  ) {
    const map = mapRef.current
    if (!map) return
    suppressMapClickRef.current()
    if (selectedCodeRef.current && map.getSource('countries')) {
      map.setFeatureState(
        { source: 'countries', id: selectedCodeRef.current },
        { selected: false },
      )
    }
    selectedCodeRef.current = null
    setSelected(null)
    setQuery('')
    setSuggestions([])
    setCopyState('idle')
    setActiveRegion(region.id)
    activeRegionRef.current = region.id
    if (syncUrl) {
      syncMapFocusSearchParams({ kind: 'region', value: region.id })
    }
    map.fitBounds(region.bounds, {
      padding: { top: 72, bottom: 96, left: 40, right: 40 },
      maxZoom: region.maxZoom,
      duration: 800,
    })
  }

  async function copyDeepLink(href: string) {
    const absolute = new URL(href, window.location.origin).href
    try {
      await navigator.clipboard.writeText(absolute)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('failed')
      window.setTimeout(() => setCopyState('idle'), 1600)
    }
  }

  const activeRegionCamera = activeRegion
    ? regions.find((region) => region.id === activeRegion)
    : undefined

  const searchListId = `${reactId}-map-suggestions`
  const photo = selected ? countryPhotos[selected.code] : undefined

  return (
    <div className={cn('earth-map', className)}>
      <div className="earth-map-toolbar">
        <div className="earth-map-search">
          <label className="sr-only" htmlFor={`${reactId}-map-search`}>
            Find a country
          </label>
          <input
            id={`${reactId}-map-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && suggestions.length > 0) {
                event.preventDefault()
                setActiveSuggestion((index) => (index + 1) % suggestions.length)
                return
              }
              if (event.key === 'ArrowUp' && suggestions.length > 0) {
                event.preventDefault()
                setActiveSuggestion(
                  (index) => (index - 1 + suggestions.length) % suggestions.length,
                )
                return
              }
              if (event.key === 'Enter' && suggestions[activeSuggestion]) {
                event.preventDefault()
                flyToCountry(suggestions[activeSuggestion]!)
              }
              if (event.key === 'Escape') {
                setSuggestions([])
              }
            }}
            placeholder="Find a country"
            autoComplete="off"
            spellCheck={false}
            aria-controls={searchListId}
            aria-expanded={suggestions.length > 0}
            aria-autocomplete="list"
            disabled={!ready}
          />
          {suggestions.length > 0 ? (
            <ul id={searchListId} role="listbox" className="earth-map-suggestions">
              {suggestions.map((entry, index) => (
                <li key={entry.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeSuggestion}
                    data-active={index === activeSuggestion || undefined}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      flyToCountry(entry)
                    }}
                  >
                    <span>{entry.name}</span>
                    <span className="tabular-nums text-muted-foreground">{entry.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="earth-map-meta" aria-live="polite">
          <span>{coords}</span>
          <span className="tabular-nums">z{zoom.toFixed(1)}</span>
          <button type="button" className="earth-map-reset" onClick={resetView}>
            Reset
          </button>
        </div>
      </div>

      {regions.length > 0 ? (
        <div className="earth-map-regions" role="group" aria-label="Jump to region">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className="earth-map-region"
              data-active={activeRegion === region.id || undefined}
              disabled={!ready}
              onClick={() => flyToRegion(region)}
            >
              <span>{region.label}</span>
              <span className="tabular-nums text-muted-foreground">{region.tally}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="earth-map-canvas"
        role="application"
        aria-label="Interactive map of Earth"
      />

      <div className="earth-map-footer">
        {selected ? (
          <div className="earth-map-selection">
            {photo ? (
              <Link href={photo.href} className="earth-map-photo">
                {/* eslint-disable-next-line @next/next/no-img-element -- static atlas JPEG with known path */}
                <img src={photo.src} alt={photo.alt} width={160} height={106} />
                <span className="earth-map-photo-caption">
                  <span className="earth-map-selection-code tabular-nums">
                    {selected.code}
                  </span>
                  <span className="earth-map-selection-name">{selected.name}</span>
                  {selected.country?.region ? (
                    <span className="earth-map-photo-place text-muted-foreground">
                      {selected.country.region}
                      {photo.placeName ? ` · ${photo.placeName}` : ''}
                    </span>
                  ) : (
                    <span className="earth-map-photo-place text-muted-foreground">
                      {photo.placeName}
                    </span>
                  )}
                </span>
              </Link>
            ) : (
              <div>
                <p className="earth-map-selection-code tabular-nums text-muted-foreground">
                  {selected.code}
                </p>
                <p className="earth-map-selection-name">{selected.name}</p>
                {selected.country?.region ? (
                  <p className="earth-map-photo-place text-muted-foreground">
                    {selected.country.region}
                  </p>
                ) : null}
              </div>
            )}
            <div className="earth-map-selection-actions">
              {selected.href ? (
                <Link href={selected.href} className="earth-map-guide-link">
                  Open field guide →
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No Explore guide yet</p>
              )}
              <button
                type="button"
                className="earth-map-copy"
                onClick={() => {
                  void copyDeepLink(
                    selected.mapHref ?? mapCountryHref(selected.code),
                  )
                }}
              >
                {copyState === 'copied'
                  ? 'Copied link'
                  : copyState === 'failed'
                    ? 'Copy failed'
                    : 'Copy link'}
              </button>
            </div>
          </div>
        ) : activeRegionCamera ? (
          <div className="earth-map-selection">
            <div>
              <p className="earth-map-selection-code tabular-nums text-muted-foreground">
                Region
              </p>
              <p className="earth-map-selection-name">{activeRegionCamera.label}</p>
              <p className="earth-map-photo-place text-muted-foreground">
                {activeRegionCamera.tally} Explore guides
              </p>
            </div>
            <div className="earth-map-selection-actions">
              <button
                type="button"
                className="earth-map-copy"
                onClick={() => {
                  void copyDeepLink(mapRegionHref(activeRegionCamera.id))
                }}
              >
                {copyState === 'copied'
                  ? 'Copied link'
                  : copyState === 'failed'
                    ? 'Copy failed'
                    : 'Copy link'}
              </button>
            </div>
          </div>
        ) : (
          <p className="earth-map-hint text-muted-foreground">
            Pan and zoom the NASA Blue Marble basemap, jump by region, or click a
            country for its boundary and Explore field guide.
          </p>
        )}
        <p className="earth-map-credit text-muted-foreground">
          {mapAttribution.basemap.name} · {mapAttribution.boundaries.name}
        </p>
      </div>
    </div>
  )
}
