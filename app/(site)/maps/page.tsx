import { MapsPageView, mapsPageMetadata } from '../../_views/maps-page'

export const instant = true

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return mapsPageMetadata(await searchParams)
}

export default function MapsPage() {
  return <MapsPageView />
}
