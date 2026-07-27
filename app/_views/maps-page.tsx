import { Suspense } from 'react'

import { EarthMap } from '~/components/earth-map'
import { localeMetadata } from '~/lib/locale-metadata'
import { mapCountryPhotos } from '~/lib/maps-photos'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function mapsPageMetadata() {
  const copy = publicPageMetadata.maps
  return localeMetadata({
    path: '/maps',
    title: copy.title,
    description: copy.description,
  })
}

export function MapsPageView() {
  const countryPhotos = mapCountryPhotos()

  return (
    <div className="maps-page">
      <Suspense
        fallback={
          <div className="earth-map" aria-busy="true">
            <div className="earth-map-canvas" aria-hidden />
            <div className="earth-map-hud">
              <p className="earth-map-status earth-map-status-overlay">
                Loading map…
              </p>
            </div>
          </div>
        }
      >
        <EarthMap countryPhotos={countryPhotos} />
      </Suspense>
    </div>
  )
}
