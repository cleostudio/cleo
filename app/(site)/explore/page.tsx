import { explorePageMetadata, ExplorePageView } from '../../_views/explore-page'
import { parseIndexQuery } from '~/lib/gallery-filters'

// Prefetched Explore index — dock navigation should paint without blocking.
export const instant = true

// Deep links carry ?q=; resolve that URL data at prefetch time.
export const prefetch = 'allow-runtime' as const

export const metadata = explorePageMetadata()

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return <ExplorePageView initialQuery={parseIndexQuery(params.q)} />
}
