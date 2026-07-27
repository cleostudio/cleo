import type { Metadata } from 'next'
import { describe, expect, it } from 'vitest'

import { localeMetadata } from './locale-metadata'
import { publicPageMetadata } from './public-page-metadata'

function imageAlt(metadata: Metadata) {
  const images = metadata.openGraph?.images
  const image = Array.isArray(images) ? images[0] : images
  return typeof image === 'object' && image && 'alt' in image ? image.alt : undefined
}

function metadataFor(path: string, title: string, description: string) {
  return localeMetadata({ locale: 'en', path, title, description })
}

describe('social OG image metadata', () => {
  it('does not invent a homepage blurb when the portal intro is empty', () => {
    const home = publicPageMetadata.home

    expect(imageAlt(metadataFor('/', home.title, home.description))).toBe('Cleo')
  })

  it.each([
    [
      '/blog',
      publicPageMetadata.blog,
      'Writing · Cleo. Essays on place, scale, and deep time - Earth, the ocean, and the wider universe.',
    ],
    ['/gallery', publicPageMetadata.gallery, 'Gallery · Cleo'],
    ['/topics', publicPageMetadata.topics, 'Topics · Cleo'],
    ['/explore', publicPageMetadata.explore, 'Explore · Cleo'],
    [
      '/space',
      publicPageMetadata.space,
      'Space · Cleo. Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
    ],
    [
      '/cleo',
      publicPageMetadata.cleo,
      'Cleo. A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
    ],
  ] as const)('describes the %s artwork with its own content', (path, copy, expected) => {
    expect(imageAlt(metadataFor(path, copy.title, copy.description))).toBe(expected)
  })

  it('describes article and newsletter artwork with the title', () => {
    expect(
      imageAlt(
        metadataFor(
          '/blog/the-thin-blue-shell',
          'The Thin Blue Shell',
          'Article summary',
        ),
      ),
    ).toBe('The Thin Blue Shell · Cleo')
    expect(
      imageAlt(
        metadataFor(
          '/newsletters/1',
          'Cleo Monthly Update Newsletter 01',
          'Archive summary',
        ),
      ),
    ).toBe('Cleo Monthly Update Newsletter 01 · Cleo')
  })
})
