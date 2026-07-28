import { explorePageMetadata, ExplorePageView } from '../../_views/explore-page'

// Prefetched Explore index — dock navigation should paint without blocking.
export const instant = true

export const metadata = explorePageMetadata()

export default function ExplorePage() {
  return <ExplorePageView />
}
