import { TopicsPageView } from '../../_views/topics-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.topics

// Prefetched Topics catalog — dock navigation should paint without blocking.
export const instant = true

export const metadata = localeMetadata({
  locale: 'en',
  path: '/topics',
  ...copy,
})

export default function EnglishTopicsPage() {
  return <TopicsPageView />
}
