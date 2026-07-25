import { TopicsPageView } from '../../_views/topics-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.topics

export const metadata = localeMetadata({
  locale: 'en',
  path: '/topics',
  ...copy,
})

export default function EnglishTopicsPage() {
  return <TopicsPageView />
}
