import {
  exploreCountryMetadata,
  exploreCountryStaticParams,
  ExploreCountryPageView,
} from '../../../_views/explore-country-page'

export function generateStaticParams() {
  return exploreCountryStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return exploreCountryMetadata(slug)
}

export default async function ExploreCountryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ExploreCountryPageView slug={slug} />
}
