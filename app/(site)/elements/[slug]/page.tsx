import {
  elementSubjectMetadata,
  elementSubjectStaticParams,
  ElementsSubjectPageView,
} from '../../../_views/elements-subject-page'

export function generateStaticParams() {
  return elementSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return elementSubjectMetadata(slug)
}

export default async function ElementsSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ElementsSubjectPageView slug={slug} />
}
