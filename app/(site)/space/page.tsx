import { spacePageMetadata, SpacePageView } from '../../_views/space-page'

// Prefetched Space index — dock navigation should paint without blocking.
export const instant = true

export const metadata = spacePageMetadata()

export default function SpacePage() {
  return <SpacePageView />
}
