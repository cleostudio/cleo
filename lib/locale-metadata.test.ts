import { describe, expect, it } from 'vitest'

import { localeMetadata } from './locale-metadata'
import { seo } from './seo'

describe('localeMetadata', () => {
  it('builds English self-canonical metadata and language alternates', () => {
    const metadata = localeMetadata({
      locale: 'en',
      path: '/blog/a-post',
      title: 'A post',
      description: 'An English summary',
      type: 'article',
    })

    expect(metadata.alternates).toEqual({
      canonical: new URL('/blog/a-post', seo.url),
      languages: {
        en: new URL('/blog/a-post', seo.url).href,
        'x-default': new URL('/blog/a-post', seo.url).href,
      },
    })
    expect(metadata.openGraph).toMatchObject({
      title: 'A post',
      description: 'An English summary',
      locale: 'en_US',
      type: 'article',
      url: new URL('/blog/a-post', seo.url),
      images: [
        expect.objectContaining({
          url: new URL('/og?locale=en&path=%2Fblog%2Fa-post', seo.url),
          width: 1200,
          height: 630,
          type: 'image/png',
        }),
      ],
    })
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'A post',
      description: 'An English summary',
      images: [
        {
          url: new URL('/og?locale=en&path=%2Fblog%2Fa-post', seo.url),
          width: 1200,
          height: 630,
          alt: 'A post · Cali Castle',
          type: 'image/png',
        },
      ],
    })
  })

  it('strips a legacy English locale prefix from the path', () => {
    const metadata = localeMetadata({
      locale: 'en',
      path: '/en/blog/a-post',
      title: 'A post',
      description: 'An English summary',
    })

    expect(metadata.alternates?.canonical).toEqual(new URL('/blog/a-post', seo.url))
    expect(metadata.openGraph?.url).toEqual(new URL('/blog/a-post', seo.url))
  })
})
