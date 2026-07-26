'use client'

import dynamic from 'next/dynamic'

/** WebGL globe — client-only so SSR never touches the renderer. */
export const EarthGlobeLazy = dynamic(
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
