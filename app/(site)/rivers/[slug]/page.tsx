import {
  riverSubjectMetadata,
  riverSubjectStaticParams,
  RiverSubjectPageView,
} from '../../../_views/river-subject-page'

export function generateStaticParams() {
  return riverSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return riverSubjectMetadata(slug)
}

export default async function RiverSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <RiverSubjectPageView slug={slug} />
}
