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
  it('describes the homepage artwork with the portal blurb', () => {
    const home = publicPageMetadata.home

    expect(imageAlt(metadataFor('/', home.title, home.description))).toBe(
      `Cleo. ${home.description}`,
    )
  })

  it.each([
    [
      '/blog',
      publicPageMetadata.blog,
      'Writing · Cleo. Creative essays about Earth, the ocean, deep time, and the wider universe — place, scale, and what endures.',
    ],
    [
      '/gallery',
      publicPageMetadata.gallery,
      'Gallery · Cleo. Curated photographs from Explore places and Space guides — searchable contact prints with source credit.',
    ],
    [
      '/topics',
      publicPageMetadata.topics,
      'Topics · Cleo. Knowledge collections on Cleo — start with Countries and Space, then open field guides and the gallery.',
    ],
    [
      '/explore',
      publicPageMetadata.explore,
      'Explore · Cleo. Evergreen country field guides — orientation, places, and facts for nations around the world.',
    ],
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
          '/blog/pale-blue-marble',
          'Pale Blue Marble',
          'Article summary',
        ),
      ),
    ).toBe('Pale Blue Marble · Cleo')
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
