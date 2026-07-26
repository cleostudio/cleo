import { describe, expect, it } from 'vitest'

import { formatLatLng, latLngToScene, sceneToLatLng } from './geo'

describe('maps geo helpers', () => {
  it('places Greenwich on +X and the north pole on +Y', () => {
    const [x, y, z] = latLngToScene(0, 0)
    expect(x).toBeCloseTo(1, 5)
    expect(y).toBeCloseTo(0, 5)
    expect(z).toBeCloseTo(0, 5)

    const pole = latLngToScene(90, 0)
    expect(pole[1]).toBeCloseTo(1, 5)
  })

  it('round-trips lat/lng through scene space', () => {
    const samples = [
      [0, 0],
      [37.8, -122.4],
      [-33.9, 151.2],
      [51.5, -0.1],
    ] as const

    for (const [latitude, longitude] of samples) {
      const [x, y, z] = latLngToScene(latitude, longitude)
      const back = sceneToLatLng(x, y, z)
      expect(back.latitude).toBeCloseTo(latitude, 4)
      expect(back.longitude).toBeCloseTo(longitude, 4)
    }
  })

  it('formats hemispheres for the readout', () => {
    expect(formatLatLng(37.8, -122.4)).toBe('37.8°N · 122.4°W')
    expect(formatLatLng(-33.9, 151.2)).toBe('33.9°S · 151.2°E')
  })
})
