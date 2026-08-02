import {
  oceanSubjectMetadata,
  oceanSubjectStaticParams,
  OceanSubjectPageView,
} from '../../../_views/ocean-subject-page'

export function generateStaticParams() {
  return oceanSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return oceanSubjectMetadata(slug)
}

export default async function OceanSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <OceanSubjectPageView slug={slug} />
}
