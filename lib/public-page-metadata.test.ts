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
        'Planets, moons, and deep-sky neighbors — structure, motion, and the view across the Solar System and beyond.',
    })
    expect(publicPageMetadata.civilizations).toEqual({
      title: 'Civilizations',
      description:
        'Cultures that shaped regions across millennia — signature sites, durable facts, and what remains.',
    })
    expect(publicPageMetadata.cities).toEqual({
      title: 'Cities',
      description:
        'Capitals and corridor cities where routes meet — harbors, plazas, walls, and urban layers.',
    })
    expect(publicPageMetadata.oceans).toEqual({
      title: 'Oceans',
      description:
        'World basins, major seas, and polar waters — currents, trenches, climate roles, and open blue.',
    })
    expect(publicPageMetadata.rivers).toEqual({
      title: 'Rivers',
      description:
        'Major courses that cut continents — sources, floodplains, basins, and the paths water draws.',
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
