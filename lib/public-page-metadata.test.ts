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
    expect(publicPageMetadata.space).toEqual({
      title: 'Space',
      description:
        'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, and facts.',
    })
    expect(publicPageMetadata.oceans).toEqual({
      title: 'Oceans',
      description:
        'Evergreen field guides for the World Ocean, major basins, and signature seas — orientation, features, and facts.',
    })
    expect(publicPageMetadata.sky).toEqual({
      title: 'Sky',
      description:
        'A static sky atlas plate with hotspots into Space field guides — nebulae, galaxies, and the Moon.',
    })
    expect(publicPageMetadata.compare).toEqual({
      title: 'Compare',
      description:
        'Side-by-side fact plates for two countries or two planets — shareable pairs from the field guides.',
    })
    expect(publicPageMetadata.biomes).toEqual({
      title: 'Biomes',
      description:
        'Evergreen field guides for Earth’s major biomes — climate, range, cover, exemplars, and facts.',
    })
    expect(publicPageMetadata.elements).toEqual({
      title: 'Elements',
      description:
        'Evergreen field guides for high-signal chemical elements — atomic facts, features, and specimen photographs.',
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
      'oceans',
      'sky',
      'compare',
      'biomes',
      'elements',
      'cleo',
    ] as const) {
      expect(publicPageMetadata[section].description.length, section).toBeLessThanOrEqual(160)
    }
  })
})

