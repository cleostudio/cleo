'use client'

import dynamic from 'next/dynamic'

import type { MapsMarker } from '~/lib/maps/markers'

type EarthGlobeProps = {
  focusSlug?: string | null
  onSelect?: (marker: MapsMarker | null) => void
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
