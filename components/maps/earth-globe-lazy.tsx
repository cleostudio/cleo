'use client'

import dynamic from 'next/dynamic'

/** Client-only WebGL globe — keep three.js out of the server bundle. */
export const EarthGlobeLazy = dynamic(
  () => import('./earth-globe').then((module) => module.EarthGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="maps-globe">
        <p className="maps-globe-status" role="status">
          Loading Earth…
        </p>
      </div>
    ),
  },
)
