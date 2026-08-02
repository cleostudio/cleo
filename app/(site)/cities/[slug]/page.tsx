import {
  citySubjectMetadata,
  citySubjectStaticParams,
  CitySubjectPageView,
} from '../../../_views/city-subject-page'

export function generateStaticParams() {
  return citySubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return citySubjectMetadata(slug)
}

export default async function CitySubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CitySubjectPageView slug={slug} />
}
