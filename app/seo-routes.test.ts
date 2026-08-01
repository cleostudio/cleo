import { describe, expect, it } from 'vitest'

import robots from './robots'
import sitemap from './sitemap'
import { getAllPosts } from '~/lib/content'
import { countrySlugs } from '~/lib/countries'
import { archivedNewsletterIds } from '~/lib/newsletters'
import { seo } from '~/lib/seo'
import { spaceSubjectSlugs } from '~/lib/space'

describe('discovery routes', () => {
  it('publishes an explicit crawler policy for public and private surfaces', () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/confirm/',
          '/api/',
          '/sign-in',
          '/sign-up',
          '/account',
        ],
      },
      sitemap: new URL('/sitemap.xml', seo.url).href,
      host: seo.url.origin,
    })
  })

  it('publishes every public English route once', () => {
    const entries = sitemap()
    const expectedPaths = [
      '/',
      '/blog',
      '/gallery',
      '/topics',
      '/explore',
      '/space',
      '/cleo',
      ...countrySlugs().map((slug) => `/explore/${slug}`),
      ...spaceSubjectSlugs().map((slug) => `/space/${slug}`),
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
