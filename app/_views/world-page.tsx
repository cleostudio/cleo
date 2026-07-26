import { WorldExplorer } from '~/components/world/world-explorer'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { worldPhotoPreviews } from '~/lib/world/previews'

export function worldPageMetadata() {
  const copy = publicPageMetadata.world
  return localeMetadata({
    path: '/world',
    title: copy.title,
    description: copy.description,
  })
}

export function WorldPageView() {
  const previews = worldPhotoPreviews()
  return <WorldExplorer previews={previews} />
}
