'use client'

import dynamic from 'next/dynamic'

import type { WorldMarker } from '~/lib/world/markers'

type EarthGlobeProps = {
  focusSlug?: string | null
  lookAt?: { lat: number; lon: number } | null
  onSelect?: (marker: WorldMarker | null) => void
}

/** WebGL globe — client-only so SSR never touches the renderer. */
export const EarthGlobeLazy = dynamic<EarthGlobeProps>(
  () => import('./earth-globe').then((mod) => mod.EarthGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="world-stage">
        <p className="world-status" role="status">
          Loading Earth…
        </p>
      </div>
    ),
  },
)
