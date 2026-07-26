import { BlogIndexPageView } from '../../_views/blog-index-page'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.blog

// Prefetched Writing index — dock navigation should paint without blocking.
export const instant = true

export const metadata = localeMetadata({
  locale: 'en',
  path: '/blog',
  ...copy,
})

export default function EnglishBlogIndexPage() {
  return <BlogIndexPageView locale="en" />
}
