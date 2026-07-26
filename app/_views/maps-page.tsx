import { MapsExplorer } from '~/components/maps/maps-explorer'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { mapsPhotoPreviews } from '~/lib/maps/previews'

export function mapsPageMetadata() {
  const copy = publicPageMetadata.maps
  return localeMetadata({
    path: '/maps',
    title: copy.title,
    description: copy.description,
  })
}

export function MapsPageView() {
  const previews = mapsPhotoPreviews()
  return <MapsExplorer previews={previews} />
}
