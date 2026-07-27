import { Suspense } from 'react'

import { EarthMap } from '~/components/earth-map'
import { localeMetadata } from '~/lib/locale-metadata'
import { mapsDeepLinkMetadata } from '~/lib/maps'
import { loadMapCountryIndex } from '~/lib/maps-index'
import { mapCountryPhotos } from '~/lib/maps-photos'
import { publicPageMetadata } from '~/lib/public-page-metadata'

function firstSearchValue(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0] ?? null
  return null
}

export function mapsPageMetadata(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const index = loadMapCountryIndex()
  const params = new URLSearchParams()
  const country = firstSearchValue(searchParams?.country)
  const region = firstSearchValue(searchParams?.region)
  if (country) params.set('country', country)
  if (region) params.set('region', region)
  const copy = searchParams
    ? mapsDeepLinkMetadata(params, index)
    : {
        title: publicPageMetadata.maps.title,
        description: publicPageMetadata.maps.description,
      }
  const focusPath =
    country != null && country.trim()
      ? `/maps?country=${encodeURIComponent(country.trim().toLowerCase())}`
      : region != null && region.trim()
        ? `/maps?region=${encodeURIComponent(region.trim().toLowerCase())}`
        : '/maps'
  return localeMetadata({
    path: focusPath,
    title: copy.title,
    description: copy.description,
  })
}

export function MapsPageView() {
  const countryPhotos = mapCountryPhotos()
  const countryIndex = loadMapCountryIndex()

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
        <EarthMap
          countryPhotos={countryPhotos}
          initialIndex={countryIndex}
        />
      </Suspense>
    </div>
  )
}
