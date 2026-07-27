import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { mapCountryPhotos } from './maps-photos'

describe('mapCountryPhotos', () => {
  it('builds selection-plate facts for every Explore country', () => {
    const photos = mapCountryPhotos()
    expect(Object.keys(photos)).toHaveLength(countries.length)

    const japan = photos.JP
    expect(japan).toMatchObject({
      code: 'JP',
      slug: 'japan',
      name: 'Japan',
      capital: 'Tokyo',
      href: '/explore/japan',
      galleryHref: '/gallery?q=Japan',
    })
    expect(japan.src).toMatch(/^\/images\/atlas\/japan\/w640\.jpg$/)
    expect(japan.aboutExcerpt.length).toBeGreaterThan(40)
    expect(japan.aboutExcerpt.length).toBeLessThanOrEqual(180)
    expect(japan.places.length).toBe(3)
  })
})
