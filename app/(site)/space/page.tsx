import { spacePageMetadata, SpacePageView } from '../../_views/space-page'
import { parseIndexQuery } from '~/lib/gallery-filters'

// Prefetched Space index — dock navigation should paint without blocking.
export const instant = true

// Deep links carry ?q=; resolve that URL data at prefetch time.
export const prefetch = 'allow-runtime' as const

export const metadata = spacePageMetadata()

export default async function SpacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return <SpacePageView initialQuery={parseIndexQuery(params.q)} />
}
