import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { latLonToVector3, worldMarkers } from './markers'

describe('worldMarkers', () => {
  it('covers every Explore country with finite coordinates', () => {
    const markers = worldMarkers()
    expect(markers).toHaveLength(countries.length)

    for (const marker of markers) {
      expect(Number.isFinite(marker.lat)).toBe(true)
      expect(Number.isFinite(marker.lon)).toBe(true)
      expect(marker.lat).toBeGreaterThanOrEqual(-90)
      expect(marker.lat).toBeLessThanOrEqual(90)
      expect(marker.lon).toBeGreaterThanOrEqual(-180)
      expect(marker.lon).toBeLessThanOrEqual(180)
    }
  })

  it('places the equator and prime meridian on expected axes', () => {
    const [x, y, z] = latLonToVector3(0, 0, 1)
    expect(y).toBeCloseTo(0, 5)
    expect(Math.hypot(x, z)).toBeCloseTo(1, 5)
  })
})
