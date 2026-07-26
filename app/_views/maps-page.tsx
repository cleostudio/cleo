import '~/app/maps.css'

import { MapsExplorer } from '~/components/maps/maps-explorer'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { EARTH_TEXTURE_CREDIT } from '~/lib/maps/textures'
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
  return (
    <div className="maps-page">
      <div className="maps-page-sky" aria-hidden />
      <header className="maps-page-header">
        <div>
          <h1 className="page-eyebrow">
            <T zh="地图" en="Maps" />
          </h1>
          <p>{publicPageMetadata.maps.description}</p>
        </div>
        <p className="maps-page-credit">
          Textures{' '}
          <a href={EARTH_TEXTURE_CREDIT.href} rel="noreferrer" target="_blank">
            {EARTH_TEXTURE_CREDIT.label}
          </a>
          <br />
          {EARTH_TEXTURE_CREDIT.license}
        </p>
      </header>
      <MapsExplorer />
    </div>
  )
}
