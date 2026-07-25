import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import {
  allGalleryItems,
  galleryDescription,
  galleryFilterKeys,
} from './gallery'
import { spaceSubjects } from './space'

describe('gallery catalog', () => {
  it('merges Explore place photos and Space body photos', () => {
    const items = allGalleryItems()
    expect(items).toHaveLength(countries.length + spaceSubjects.length)
    expect(items.some((item) => item.collection === 'places')).toBe(true)
    expect(items.some((item) => item.collection === 'space')).toBe(true)
    expect(items.some((item) => item.href === '/space/mars')).toBe(true)
    expect(items.every((item) => item.photo.renditions.length === 3)).toBe(true)
  })

  it('exposes place regions and space categories as filter keys', () => {
    const keys = galleryFilterKeys()
    expect(keys).toContain('Asia')
    expect(keys).toContain('Solar System')
    expect(keys).toContain('Moons')
    expect(keys).toContain('Deep Space')
  })

  it('describes the combined photograph count', () => {
    expect(galleryDescription(210)).toBe(
      '210 curated photographs — places from Explore and bodies from Space.',
    )
  })
})
