import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import {
  allGalleryItems,
  galleryDescription,
  galleryFilterKeys,
} from './gallery'
import { oceanSubjects } from './oceans'
import { spaceSubjects } from './space'

describe('gallery catalog', () => {
  it('merges Explore, Space, and Oceans photographs', () => {
    const items = allGalleryItems()
    expect(items).toHaveLength(
      countries.length + spaceSubjects.length + oceanSubjects.length,
    )
    expect(items.some((item) => item.collection === 'places')).toBe(true)
    expect(items.some((item) => item.collection === 'space')).toBe(true)
    expect(items.some((item) => item.collection === 'oceans')).toBe(true)
    expect(items.some((item) => item.href === '/space/mars')).toBe(true)
    expect(items.some((item) => item.href === '/oceans/pacific')).toBe(true)
    expect(items.every((item) => item.photo.renditions.length === 3)).toBe(true)
  })

  it('exposes place regions, space categories, and ocean categories as filter keys', () => {
    const keys = galleryFilterKeys()
    expect(keys).toContain('Asia')
    expect(keys).toContain('Solar System')
    expect(keys).toContain('Moons')
    expect(keys).toContain('Deep Space')
    expect(keys).toContain('Ocean basins')
    expect(keys).toContain('Seas & gulfs')
  })

  it('describes the combined photograph count', () => {
    expect(galleryDescription(210)).toBe(
      '210 curated photographs — places from Explore, bodies from Space, and waters from Oceans.',
    )
  })
})

