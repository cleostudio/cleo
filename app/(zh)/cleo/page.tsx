import { CleoPageView } from '../../_views/cleo-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo.zh

export const metadata = localeMetadata({
  locale: 'zh',
  path: '/cleo',
  ...copy,
})

export default function ChineseCleoPage() {
  return <CleoPageView />
}
