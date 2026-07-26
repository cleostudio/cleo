import {
  oceanSubjectMetadata,
  oceanSubjectStaticParams,
  OceansSubjectPageView,
} from '../../../_views/oceans-subject-page'

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

export default async function OceansSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <OceansSubjectPageView slug={slug} />
}
