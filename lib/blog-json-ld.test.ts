import { describe, expect, it } from 'vitest'

import { blogPostingJsonLd } from './blog-json-ld'
import { seo } from './seo'

describe('blogPostingJsonLd', () => {
  it('builds a BlogPosting payload with absolute URLs', () => {
    const publishedAt = new Date('2026-06-19T00:00:00.000Z')
    const json = blogPostingJsonLd({
      slug: 'pale-blue-marble',
      title: 'Pale Blue Marble',
      description: 'Earth from afar.',
      datePublished: publishedAt,
      image: '/images/blog/pale-blue-marble/cover.jpg',
    })

    expect(json).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Pale Blue Marble',
      description: 'Earth from afar.',
      datePublished: publishedAt.toISOString(),
      url: new URL('/blog/pale-blue-marble', seo.url).href,
      mainEntityOfPage: new URL('/blog/pale-blue-marble', seo.url).href,
      image: [new URL('/images/blog/pale-blue-marble/cover.jpg', seo.url).href],
      author: { '@type': 'Organization', name: 'Cleo' },
      publisher: { '@type': 'Organization', name: 'Cleo' },
    })
  })
})
