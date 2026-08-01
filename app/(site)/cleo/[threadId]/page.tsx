import { CleoThreadPageView } from '../../../_views/cleo-thread-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

// Cache Components requires at least one sample for build-time validation.
// Real thread ids are client UUIDs; the shell loads an empty transcript when
// IndexedDB has no row for this placeholder (plan §6 — ◐ is fine here).
export function generateStaticParams() {
  return [{ threadId: '00000000-0000-4000-8000-000000000000' }]
}

export default function EnglishCleoThreadPage() {
  return <CleoThreadPageView />
}
