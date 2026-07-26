'use client'

import dynamic from 'next/dynamic'

import type { MapsCoords, MapsMarker } from '~/lib/maps/markers'

type EarthGlobeProps = {
  focusSlug?: string | null
  onSelect?: (marker: MapsMarker | null) => void
  onPickCoords?: (coords: MapsCoords | null) => void
  showGraticule?: boolean
  sunAt?: Date
  regionFilter?: string | null
  resetSignal?: number
}

/** WebGL globe — client-only so SSR never touches the renderer. */
export const EarthGlobeLazy = dynamic<EarthGlobeProps>(
  () => import('./earth-globe').then((mod) => mod.EarthGlobe),
  {
    ssr: false,
    // Visible status lives in EarthGlobe while textures load — keep the chunk
    // shell quiet so "Loading Earth…" does not flash twice.
    loading: () => (
      <div
        className="maps-stage"
        role="status"
        aria-busy="true"
        aria-label="Loading Earth"
      />
    ),
  },
)
