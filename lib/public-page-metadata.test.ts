import { describe, expect, it } from 'vitest'

import { publicPageMetadata } from './public-page-metadata'

describe('public page metadata copy', () => {
  it('uses a timeless homepage title without a portal blurb', () => {
    expect(publicPageMetadata.home).toEqual({
      title: 'Cleo',
      description: '',
      ogDescription: '',
    })
  })

  it('keeps each public section content-specific', () => {
    expect(publicPageMetadata.blog).toEqual({
      title: 'Writing',
      description:
        'Creative essays about Earth, the ocean, deep time, and the wider universe — place, scale, and what endures.',
    })
    expect(publicPageMetadata.gallery).toEqual({
      title: 'Gallery',
      description: '',
    })
    expect(publicPageMetadata.topics).toEqual({
      title: 'Topics',
      description: '',
    })
    expect(publicPageMetadata.explore).toEqual({
      title: 'Explore',
      description: '',
    })
    expect(publicPageMetadata.maps).toEqual({
      title: 'Maps',
      description:
        'A realistic interactive map of Earth — NASA Blue Marble imagery, accurate country borders, and deep links into Explore field guides.',
    })
    expect(publicPageMetadata.space).toEqual({
      title: 'Space',
      description:
        'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
    })
    expect(publicPageMetadata.cleo).toEqual({
      title: 'Cleo',
      description:
        'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link field guides, read images, and generate them.',
    })
  })

  it('keeps section descriptions within social preview budgets', () => {
    for (const section of [
      'blog',
      'gallery',
      'topics',
      'explore',
      'maps',
      'space',
      'cleo',
    ] as const) {
      expect(publicPageMetadata[section].description.length, section).toBeLessThanOrEqual(160)
    }
  })
})
