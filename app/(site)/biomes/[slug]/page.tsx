import {
  biomeSubjectMetadata,
  biomeSubjectStaticParams,
  BiomesSubjectPageView,
} from '../../../_views/biomes-subject-page'

export function generateStaticParams() {
  return biomeSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return biomeSubjectMetadata(slug)
}

export default async function BiomesSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BiomesSubjectPageView slug={slug} />
}
