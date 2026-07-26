import {
  spaceSubjectMetadata,
  spaceSubjectStaticParams,
  SpaceSubjectPageView,
} from '../../../_views/space-subject-page'

export function generateStaticParams() {
  return spaceSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return spaceSubjectMetadata(slug)
}

export default async function SpaceSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <SpaceSubjectPageView slug={slug} />
}
