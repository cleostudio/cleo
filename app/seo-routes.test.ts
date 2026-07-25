import { describe, expect, it } from 'vitest'

import { buildFeedXml } from './feed.xml/route'
import robots from './robots'
import sitemap from './sitemap'
import { getAllPosts } from '~/lib/content'
import { archivedNewsletterIds } from '~/lib/newsletters'
import { seo } from '~/lib/seo'

describe('discovery routes', () => {
  it('publishes an explicit crawler policy for public and private surfaces', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin',
          '/confirm/',
          '/ama/manage/',
        ],
      },
      sitemap: new URL('/sitemap.xml', seo.url).href,
      host: seo.url.origin,
    })
  })

  it('publishes English feed item URLs under unprefixed paths', () => {
    const xml = buildFeedXml()

    expect(xml).toContain(
      `<atom:link href="${new URL('/feed.xml', seo.url).href}" rel="self"`,
    )
    expect(xml).toContain(`<link>${seo.url.href}</link>`)
    for (const post of getAllPosts()) {
      const url = new URL(`/blog/${post.slug}`, seo.url).href
      expect(xml).toContain(`<guid isPermaLink="false">${url}</guid>`)
      expect(xml).toContain(`<link>${url}</link>`)
    }
  })

  it('publishes every public English route once', () => {
    const entries = sitemap()
    const expectedPaths = [
      '/',
      '/blog',
      '/photos',
      '/projects',
      '/ama',
      '/cleo',
      ...archivedNewsletterIds.map((id) => `/newsletters/${id}`),
      ...getAllPosts().map((post) => `/blog/${post.slug}`),
    ]

    for (const path of expectedPaths) {
      const url = new URL(path, seo.url).href

      expect(entries).toContainEqual(
        expect.objectContaining({
          url,
          alternates: {
            languages: {
              en: url,
              'x-default': url,
            },
          },
        }),
      )
    }

    expect(entries).toHaveLength(expectedPaths.length)
  })
})
