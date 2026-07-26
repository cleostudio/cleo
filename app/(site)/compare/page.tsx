import {
  comparePageMetadata,
  ComparePageView,
} from '../../_views/compare-page'
import type { SearchParamValue } from '~/lib/search-params'

export const metadata = comparePageMetadata()

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParamValue>>
}) {
  const params = await searchParams
  return <ComparePageView searchParams={params} />
}
