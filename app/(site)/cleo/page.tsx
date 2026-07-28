import { Suspense } from 'react'

import { CleoPageView } from '../../_views/cleo-page'
import { parseCleoAskSearchParams } from '~/lib/cleo/parse-ask-search-params'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

async function CleoAskFromSearchParams({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const initialAsk = parseCleoAskSearchParams(await searchParams)
  return <CleoPageView initialAsk={initialAsk} />
}

export default function EnglishCleoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Keep a static shell; resolve deep-link q/auto inside Suspense so Cache
  // Components can prerender /cleo without blocking on request-time params.
  return (
    <Suspense fallback={<CleoPageView />}>
      <CleoAskFromSearchParams searchParams={searchParams} />
    </Suspense>
  )
}
