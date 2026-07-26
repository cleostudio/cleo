import { describe, expect, it } from 'vitest'

import { biomeSubjects } from './biomes'
import { countries } from './countries'
import { elementSubjects } from './elements'
import {
  allGalleryItems,
  galleryDescription,
  galleryFilterKeys,
} from './gallery'
import { oceanSubjects } from './oceans'
import { spaceSubjects } from './space'

describe('gallery catalog', () => {
  it('merges Explore, Space, Oceans, Biomes, and Elements photographs', () => {
    const items = allGalleryItems()
    expect(items).toHaveLength(
      countries.length +
        spaceSubjects.length +
        oceanSubjects.length +
        biomeSubjects.length +
        elementSubjects.length,
    )
    expect(items.some((item) => item.collection === 'places')).toBe(true)
    expect(items.some((item) => item.collection === 'space')).toBe(true)
    expect(items.some((item) => item.collection === 'oceans')).toBe(true)
    expect(items.some((item) => item.collection === 'biomes')).toBe(true)
    expect(items.some((item) => item.collection === 'elements')).toBe(true)
    expect(items.some((item) => item.href === '/space/mars')).toBe(true)
    expect(items.some((item) => item.href === '/oceans/pacific')).toBe(true)
    expect(items.some((item) => item.href === '/biomes/tundra')).toBe(true)
    expect(items.some((item) => item.href === '/elements/iron')).toBe(true)
    expect(items.every((item) => item.photo.renditions.length === 3)).toBe(true)
  })

  it('exposes place, space, ocean, biome, and element categories as filter keys', () => {
    const keys = galleryFilterKeys()
    expect(keys).toContain('Asia')
    expect(keys).toContain('Solar System')
    expect(keys).toContain('Moons')
    expect(keys).toContain('Deep Space')
    expect(keys).toContain('Ocean basins')
    expect(keys).toContain('Seas & gulfs')
    expect(keys).toContain('Forests')
    expect(keys).toContain('Open lands')
    expect(keys).toContain('Nonmetals')
    expect(keys).toContain('Transition & heavy')
  })

  it('describes the combined photograph count', () => {
    expect(galleryDescription(230)).toBe(
      '230 curated photographs — places from Explore, bodies from Space, waters from Oceans, biomes, and elements.',
    )
  })
})


