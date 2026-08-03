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
      'Writing · Cleo. Creative essays about Earth, the ocean, deep time, and the wider universe — place, scale, and what endures.',
    ],
    ['/gallery', publicPageMetadata.gallery, 'Gallery · Cleo'],
    ['/topics', publicPageMetadata.topics, 'Topics · Cleo'],
    ['/explore', publicPageMetadata.explore, 'Explore · Cleo'],
    [
      '/space',
      publicPageMetadata.space,
      'Space · Cleo. Planets, moons, and deep-sky neighbors — structure, motion, and the view across the Solar System and beyond.',
    ],
    [
      '/civilizations',
      publicPageMetadata.civilizations,
      'Civilizations · Cleo. Cultures that shaped regions across millennia — signature sites, durable facts, and what remains.',
    ],
    [
      '/cities',
      publicPageMetadata.cities,
      'Cities · Cleo. Capitals and corridor cities where routes meet — harbors, plazas, walls, and urban layers.',
    ],
    [
      '/oceans',
      publicPageMetadata.oceans,
      'Oceans · Cleo. World basins, major seas, and polar waters — currents, trenches, climate roles, and open blue.',
    ],
    [
      '/rivers',
      publicPageMetadata.rivers,
      'Rivers · Cleo. Major courses that cut continents — sources, floodplains, basins, and the paths water draws.',
    ],
    [
      '/cleo',
      publicPageMetadata.cleo,
      'Cleo. A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link topic pages, read images, and generate them.',
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
