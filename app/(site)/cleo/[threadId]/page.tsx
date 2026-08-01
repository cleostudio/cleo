import { CleoThreadPageView } from '../../../_views/cleo-thread-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

// Unenumerable client UUIDs — opt out of static shell validation (plan §6).
// Do not seed generateStaticParams with a placeholder id.
export const instant = false

export default function EnglishCleoThreadPage() {
  return <CleoThreadPageView />
}
