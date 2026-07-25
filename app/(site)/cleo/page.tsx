import { CleoPageView } from '../../_views/cleo-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

export default function EnglishCleoPage() {
  return <CleoPageView />
}
