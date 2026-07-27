import { TrailPageView, trailPageMetadata } from '../../_views/trail-page'

export const metadata = trailPageMetadata()

export default async function EnglishTrailPage({
  searchParams,
}: {
  searchParams: Promise<{ trail?: string | string[] }>
}) {
  const params = await searchParams
  const raw = params.trail
  const initialTrail = Array.isArray(raw) ? raw[0] : raw

  return <TrailPageView initialTrail={initialTrail} />
}
