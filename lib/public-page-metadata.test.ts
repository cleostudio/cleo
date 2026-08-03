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
    expect(publicPageMetadata.space).toEqual({
      title: 'Space',
      description:
        'About the Solar System, major moons, and nearby deep space — overview, features, and facts.',
    })
    expect(publicPageMetadata.civilizations).toEqual({
      title: 'Civilizations',
      description:
        'About historical civilizations — overview, signature sites, facts, and sources.',
    })
    expect(publicPageMetadata.cities).toEqual({
      title: 'Cities',
      description:
        'About capitals and route cities — overview, signature sites, facts, and sources.',
    })
    expect(publicPageMetadata.oceans).toEqual({
      title: 'Oceans',
      description:
        'About world ocean basins, major seas, and polar seas — overview, features, circulation, and sources.',
    })
    expect(publicPageMetadata.rivers).toEqual({
      title: 'Rivers',
      description:
        'About major rivers — overview, course, basin, hydrology, and sources.',
    })
    expect(publicPageMetadata.cleo).toEqual({
      title: 'Cleo',
      description:
        'A general-purpose AI agent on the Cleo knowledge portal — chat, search the web, deep-link topic pages, read images, and generate them.',
    })
  })

  it('keeps section descriptions within social preview budgets', () => {
    for (const section of [
      'blog',
      'gallery',
      'topics',
      'explore',
      'space',
      'civilizations',
      'cities',
      'oceans',
      'rivers',
      'cleo',
    ] as const) {
      expect(publicPageMetadata[section].description.length, section).toBeLessThanOrEqual(160)
    }
  })
})
