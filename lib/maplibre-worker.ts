'use client'

import { getWorkerUrl, setWorkerUrl } from 'maplibre-gl'

/**
 * MapLibre 6's default Turbopack/Next worker stub can fail to resolve its
 * shared chunk, which stalls GeoJSON parsing and the map `load` event.
 * Point the library at first-party module workers under /public/maplibre.
 */
export function ensureMapLibreWorker() {
  if (typeof window === 'undefined') return
  if (getWorkerUrl()) return
  setWorkerUrl('/maplibre/maplibre-gl-worker.mjs')
}
