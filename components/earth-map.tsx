'use client'

import Link from 'next/link'
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
  formatMapCoords,
  MAP_COUNTRIES_URL,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  MAP_TILE_SIZE,
  MAP_TILE_URL,
  mapAttribution,
  resolveMapCountry,
  type MapCountryHit,
} from '~/lib/maps'
import { cn } from '~/lib/utils'

type CountryIndexEntry = {
  code: string
  name: string
  bbox: [number, number, number, number]
  center: [number, number]
}

type CountryFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties?: { code?: string; name?: string } | null
    geometry: {
      type: string
      coordinates?: unknown
      geometries?: Array<{ type: string; coordinates?: unknown }>
    } | null
  }>
}

type EarthMapProps = {
  className?: string
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

  map.addLayer({
    id: 'country-fill',
    type: 'fill',
    source: 'countries',
    paint: {
      // WebGL paint values cannot read CSS variables — fixed inks tuned
      // for the Blue Marble basemap in both page themes.
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

function bboxOfGeometry(geometry: {
  type: string
  coordinates?: unknown
  geometries?: Array<{ type: string; coordinates?: unknown }>
}): [number, number, number, number] | null {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords) || coords.length === 0) return
    if (typeof coords[0] === 'number') {
      const [x, y] = coords as number[]
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
      return
    }
    for (const child of coords) visit(child)
  }

  if (geometry.type === 'GeometryCollection') {
    for (const child of geometry.geometries ?? []) visit(child.coordinates)
  } else {
    visit(geometry.coordinates)
  }

  if (!Number.isFinite(minX)) return null
  return [minX, minY, maxX, maxY]
}

function buildCountryIndex(collection: CountryFeatureCollection): CountryIndexEntry[] {
  const entries: CountryIndexEntry[] = []
  for (const feature of collection.features) {
    if (!feature.geometry) continue
    const code = String(feature.properties?.code ?? '')
    if (!code) continue
    const bbox = bboxOfGeometry(feature.geometry)
    if (!bbox) continue
    const resolved = resolveMapCountry(code, String(feature.properties?.name ?? code))
    entries.push({
      code: resolved.code,
      name: resolved.name,
      bbox,
      center: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2],
    })
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export function EarthMap({ className }: EarthMapProps) {
  const reactId = useId()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const hoveredCodeRef = useRef<string | null>(null)
  const selectedCodeRef = useRef<string | null>(null)
  const indexRef = useRef<CountryIndexEntry[]>([])
  const suppressMapClickRef = useRef<() => void>(() => {})

  const [ready, setReady] = useState(false)
  const [coords, setCoords] = useState('—')
  const [zoom, setZoom] = useState(MAP_MIN_ZOOM)
  const [selected, setSelected] = useState<MapCountryHit | null>(null)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CountryIndexEntry[]>([])

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

    const setSelection = (hit: MapCountryHit | null) => {
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
    }

    const onMove = () => {
      const center = map.getCenter()
      setCoords(formatMapCoords(center.lng, center.lat))
      setZoom(map.getZoom())
    }

    let markedReady = false
    const markReady = () => {
      if (markedReady) return
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
        const entry = indexRef.current.find((item) => item.code === hit.code)
        if (entry) {
          map.fitBounds(entry.bbox, {
            padding: { top: 72, bottom: 96, left: 48, right: 48 },
            maxZoom: Math.min(MAP_MAX_ZOOM + 0.75, 5.5),
            duration: 700,
          })
        }
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
        const response = await fetch(MAP_COUNTRIES_URL)
        const collection = (await response.json()) as CountryFeatureCollection
        indexRef.current = buildCountryIndex(collection)
      } catch {
        indexRef.current = []
      }

      if (!mapRef.current) return
      try {
        ensureCountryLayers()
      } catch {
        // Style may still be swapping; a later idle pass retries below.
      }
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
      markReady()
    })

    map.on('move', onMove)

    // Expose a short click-suppression window for toolbar interactions that
    // sit above the canvas (search suggestions can overlap the map).
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
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      setSuggestions([])
      return
    }
    setSuggestions(
      indexRef.current
        .filter(
          (entry) =>
            entry.name.toLowerCase().includes(trimmed) ||
            entry.code.toLowerCase() === trimmed,
        )
        .slice(0, 8),
    )
  }, [query, ready])

  function flyToCountry(entry: CountryIndexEntry) {
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
    map.fitBounds(entry.bbox, {
      padding: { top: 72, bottom: 96, left: 48, right: 48 },
      maxZoom: Math.min(MAP_MAX_ZOOM + 0.75, 5.5),
      duration: 800,
    })
  }

  function resetView() {
    const map = mapRef.current
    if (!map) return
    if (selectedCodeRef.current) {
      map.setFeatureState(
        { source: 'countries', id: selectedCodeRef.current },
        { selected: false },
      )
      selectedCodeRef.current = null
    }
    setSelected(null)
    setQuery('')
    setSuggestions([])
    map.easeTo({ center: [10, 20], zoom: 1.2, duration: 600 })
  }

  const searchListId = `${reactId}-map-suggestions`

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
              if (event.key === 'Enter' && suggestions[0]) {
                event.preventDefault()
                flyToCountry(suggestions[0])
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
              {suggestions.map((entry) => (
                <li key={entry.code}>
                  <button
                    type="button"
                    role="option"
                    onMouseDown={(event) => {
                      // Prevent the map under the overlapping list from
                      // receiving this pointer interaction as a country click.
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

      <div
        ref={containerRef}
        className="earth-map-canvas"
        role="application"
        aria-label="Interactive map of Earth"
      />

      <div className="earth-map-footer">
        {selected ? (
          <div className="earth-map-selection">
            <div>
              <p className="earth-map-selection-code tabular-nums text-muted-foreground">
                {selected.code}
              </p>
              <p className="earth-map-selection-name">{selected.name}</p>
            </div>
            {selected.href ? (
              <Link href={selected.href} className="earth-map-guide-link">
                Open field guide →
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">No Explore guide yet</p>
            )}
          </div>
        ) : (
          <p className="earth-map-hint text-muted-foreground">
            Pan and zoom the NASA Blue Marble basemap. Click a country for its
            boundary and Explore field guide.
          </p>
        )}
        <p className="earth-map-credit text-muted-foreground">
          {mapAttribution.basemap.name} · {mapAttribution.boundaries.name}
        </p>
      </div>
    </div>
  )
}
