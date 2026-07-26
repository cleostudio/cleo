import { IdeasPageView } from '../../_views/ideas-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.ideas

export const metadata = localeMetadata({
  locale: 'en',
  path: '/ideas',
  ...copy,
})

export default function EnglishIdeasPage() {
  return <IdeasPageView />
}
