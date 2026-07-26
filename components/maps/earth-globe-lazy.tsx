'use client'

import dynamic from 'next/dynamic'

import type { MapsCoords, MapsMarker } from '~/lib/maps/markers'

type EarthGlobeProps = {
  focusSlug?: string | null
  onSelect?: (marker: MapsMarker | null) => void
  onPickCoords?: (coords: MapsCoords | null) => void
  showGraticule?: boolean
}

/** WebGL globe — client-only so SSR never touches the renderer. */
export const EarthGlobeLazy = dynamic<EarthGlobeProps>(
  () => import('./earth-globe').then((mod) => mod.EarthGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="maps-stage">
        <p className="maps-status" role="status">
          Loading Earth…
        </p>
      </div>
    ),
  },
)
