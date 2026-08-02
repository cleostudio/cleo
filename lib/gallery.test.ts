import { describe, expect, it } from 'vitest'

import { citySubjects } from './cities'
import { civilizationSubjects } from './civilizations'
import { countries } from './countries'
import {
  allGalleryItems,
  allTopicPhotoItems,
  galleryDescription,
  galleryFilterKeys,
} from './gallery'
import { spaceSubjects } from './space'

describe('gallery catalog', () => {
  it('shows one featured photograph per topic in Gallery', () => {
    const items = allGalleryItems()
    expect(items).toHaveLength(
      countries.length +
        spaceSubjects.length +
        civilizationSubjects.length +
        citySubjects.length,
    )
    expect(items.some((item) => item.collection === 'places')).toBe(true)
    expect(items.some((item) => item.collection === 'space')).toBe(true)
    expect(items.some((item) => item.collection === 'civilizations')).toBe(true)
    expect(items.some((item) => item.collection === 'cities')).toBe(true)
    expect(items.some((item) => item.href === '/space/mars')).toBe(true)
    expect(items.some((item) => item.href === '/civilizations/ancient-egypt')).toBe(
      true,
    )
    expect(items.some((item) => item.href === '/cities/istanbul')).toBe(true)
    expect(items.some((item) => item.id === 'places:japan:2')).toBe(false)
    expect(items.some((item) => item.id === 'space:mars:3')).toBe(false)
    expect(
      items.every(
        (item) =>
          item.photo.renditions.length >= 1 &&
          item.photo.renditions.length <= 3,
      ),
    ).toBe(true)
  })

  it('retains every three-photo topic set for guide and zoom consumers', () => {
    const items = allTopicPhotoItems()
    expect(items).toHaveLength(
      (countries.length +
        spaceSubjects.length +
        civilizationSubjects.length +
        citySubjects.length) *
        3,
    )
    expect(items.some((item) => item.id === 'places:japan:2')).toBe(true)
    expect(items.some((item) => item.id === 'space:mars:3')).toBe(true)
    expect(items.some((item) => item.id === 'civilizations:maya:3')).toBe(true)
    expect(items.some((item) => item.id === 'cities:istanbul:3')).toBe(true)
  })

  it('exposes place regions and topic categories as filter keys', () => {
    const keys = galleryFilterKeys()
    expect(keys).toContain('Asia')
    expect(keys).toContain('Solar System')
    expect(keys).toContain('Moons')
    expect(keys).toContain('Deep Space')
    expect(keys).toContain('Africa & Near East')
    expect(keys).toContain('Mediterranean')
    expect(keys).toContain('Asia')
    expect(keys).toContain('Americas')
    expect(keys).toContain('Capitals & routes')
  })

  it('describes the combined photograph count', () => {
    expect(galleryDescription(210)).toBe(
      '210 curated photographs — places from Explore, bodies from Space, sites from Civilizations, and views from Cities.',
    )
  })
})
