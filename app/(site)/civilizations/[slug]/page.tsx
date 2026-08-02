import {
  civilizationSubjectMetadata,
  civilizationSubjectStaticParams,
  CivilizationSubjectPageView,
} from '../../../_views/civilization-subject-page'

export function generateStaticParams() {
  return civilizationSubjectStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return civilizationSubjectMetadata(slug)
}

export default async function CivilizationSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <CivilizationSubjectPageView slug={slug} />
}
