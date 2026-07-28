import { BlogIndexPageView } from '../../_views/blog-index-page'
import { parseIndexQuery } from '~/lib/gallery-filters'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.blog

// Prefetched Writing index — dock navigation should paint without blocking.
export const instant = true

// Deep links carry ?q=; resolve that URL data at prefetch time.
export const prefetch = 'allow-runtime' as const

export const metadata = localeMetadata({
  locale: 'en',
  path: '/blog',
  ...copy,
})

export default async function EnglishBlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return (
    <BlogIndexPageView locale="en" initialQuery={parseIndexQuery(params.q)} />
  )
}
