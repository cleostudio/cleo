import type { MetadataRoute } from 'next'

import { getAllPosts } from '~/lib/content'
import { countrySlugs } from '~/lib/countries'
import { localeRoutePair } from '~/lib/locale-metadata'
import { archivedNewsletterIds } from '~/lib/newsletters'
import { citySubjectSlugs } from '~/lib/cities'
import { civilizationSubjectSlugs } from '~/lib/civilizations'
import { spaceSubjectSlugs } from '~/lib/space'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  // newest first per getAllPosts — the site "changed" when the latest post landed
  const latest = posts[0]?.publishedAt

  const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap[number] => {
    const pair = localeRoutePair(path)
    return {
      url: pair.en.href,
      lastModified,
      alternates: { languages: pair.languages },
    }
  }

  return [
    entry('/', latest),
    entry('/blog', latest),
    entry('/gallery', latest),
    entry('/topics', latest),
    entry('/explore'),
    entry('/space'),
    entry('/civilizations'),
    entry('/cities'),
    entry('/cleo'),
    ...countrySlugs().map((slug) => entry(`/explore/${slug}`)),
    ...spaceSubjectSlugs().map((slug) => entry(`/space/${slug}`)),
    ...civilizationSubjectSlugs().map((slug) => entry(`/civilizations/${slug}`)),
    ...citySubjectSlugs().map((slug) => entry(`/cities/${slug}`)),
    ...archivedNewsletterIds.map((id) => entry(`/newsletters/${id}`)),
    ...posts.map((post) => entry(`/blog/${post.slug}`, post.publishedAt)),
  ]
}
