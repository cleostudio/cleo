import { describe, expect, it } from 'vitest'

import { publicPageMetadata } from './public-page-metadata'

describe('public page metadata copy', () => {
  it('keeps a short homepage portal description for search and social', () => {
    expect(publicPageMetadata.home.title).toBe('Cleo')
    expect(publicPageMetadata.home.description.length).toBeGreaterThan(20)
    expect(publicPageMetadata.home.description.length).toBeLessThanOrEqual(160)
    expect(publicPageMetadata.home.ogDescription.length).toBeGreaterThan(20)
    expect(publicPageMetadata.home.ogDescription.length).toBeLessThanOrEqual(160)
  })

  it('keeps each public section content-specific', () => {
    expect(publicPageMetadata.blog).toEqual({
      title: 'Writing',
      description:
        'Creative essays about Earth, the ocean, deep time, and the wider universe — place, scale, and what endures.',
    })
    expect(publicPageMetadata.gallery).toEqual({
      title: 'Gallery',
      description:
        'Curated photographs from Explore places and Space guides — searchable contact prints with source credit.',
    })
    expect(publicPageMetadata.topics).toEqual({
      title: 'Topics',
      description:
        'Knowledge collections on Cleo — start with Countries and Space, then open field guides and the gallery.',
    })
    expect(publicPageMetadata.explore).toEqual({
      title: 'Explore',
      description:
        'Evergreen country field guides — orientation, places, and facts for nations around the world.',
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
      'space',
      'cleo',
    ] as const) {
      expect(publicPageMetadata[section].description.length, section).toBeLessThanOrEqual(160)
    }
  })
})
