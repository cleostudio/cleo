import { CleoPageView } from '../../_views/cleo-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

// Prefetched Ask Cleo surface — dock navigation should paint without blocking.
export const instant = true

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

export default function EnglishCleoPage() {
  return <CleoPageView />
}
