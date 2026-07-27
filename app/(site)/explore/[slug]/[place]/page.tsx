import {
  explorePlaceMetadata,
  explorePlaceStaticParams,
  ExplorePlacePageView,
} from '../../../../_views/explore-place-page'

export function generateStaticParams() {
  return explorePlaceStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; place: string }>
}) {
  const { slug, place } = await params
  return explorePlaceMetadata(slug, place)
}

export default async function ExplorePlacePage({
  params,
}: {
  params: Promise<{ slug: string; place: string }>
}) {
  const { slug, place } = await params
  return <ExplorePlacePageView countrySlug={slug} placeSlug={place} />
}
