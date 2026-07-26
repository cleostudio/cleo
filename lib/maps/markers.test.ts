import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import {
  formatLatLon,
  latLonToVector3,
  mapsMarkers,
  vector3ToLatLon,
} from './markers'

describe('mapsMarkers', () => {
  it('covers every Explore country with finite coordinates', () => {
    const markers = mapsMarkers()
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

  it('round-trips lat/lon through Cartesian space', () => {
    const samples: Array<[number, number]> = [
      [0, 0],
      [35.68, 139.69],
      [-33.87, 151.21],
      [64.15, -21.94],
    ]
    for (const [lat, lon] of samples) {
      const [x, y, z] = latLonToVector3(lat, lon, 1)
      const back = vector3ToLatLon(x, y, z)
      expect(back.lat).toBeCloseTo(lat, 4)
      expect(back.lon).toBeCloseTo(lon, 4)
    }
  })

  it('formats hemispheres for a coordinate readout', () => {
    expect(formatLatLon(35.678, 139.691)).toBe('35.68°N 139.69°E')
    expect(formatLatLon(-33.87, -58.38)).toBe('33.87°S 58.38°W')
  })
})
