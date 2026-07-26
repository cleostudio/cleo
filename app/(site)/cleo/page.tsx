import { Suspense } from 'react'

import { CleoPageView } from '../../_views/cleo-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

function CleoFallback() {
  return (
    <div className="w-full">
      <div className="app-column min-w-0" aria-busy="true" />
    </div>
  )
}

export default function EnglishCleoPage() {
  return (
    <Suspense fallback={<CleoFallback />}>
      <CleoPageView />
    </Suspense>
  )
}
