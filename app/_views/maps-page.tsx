import { Suspense } from 'react'

import { EarthMap } from '~/components/earth-map'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
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
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="地图" en="Maps" />
          </h1>
          <p
            className="enter mt-3 text-sm text-muted-foreground"
            style={{ '--enter-delay': '80ms' } as React.CSSProperties}
          >
            {publicPageMetadata.maps.description}
          </p>
        </header>
        <PixelCluster variant={5} className="enter shrink-0" />
      </div>

      <div
        className="enter mt-6"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
      >
        <Suspense
          fallback={
            <div className="earth-map" aria-busy="true">
              <p className="earth-map-status">Loading map…</p>
              <div className="earth-map-canvas" aria-hidden />
            </div>
          }
        >
          <EarthMap countryPhotos={countryPhotos} />
        </Suspense>
      </div>
    </div>
  )
}
