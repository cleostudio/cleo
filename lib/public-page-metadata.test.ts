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
        'Essays by Cleo about design, engineering, products, and the people and ideas that matter along the way.',
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
        'A live 3D Earth — real day and night, click a country, and open its Explore guide.',
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
