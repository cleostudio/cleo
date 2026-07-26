import { describe, expect, it } from 'vitest'

import {
  averageLatLon,
  formatDistanceKm,
  haversineKm,
  nearestMapsMarker,
  regionMarkerCentroid,
} from './geo'
import { mapsMarkers } from './markers'

describe('maps geo helpers', () => {
  const markers = mapsMarkers()

  it('measures a known great-circle distance', () => {
    // Tokyo ↔ Osaka ≈ 400 km
    const km = haversineKm(
      { lat: 35.68, lon: 139.69 },
      { lat: 34.69, lon: 135.5 },
    )
    expect(km).toBeGreaterThan(350)
    expect(km).toBeLessThan(450)
  })

  it('averages points toward a mid-ocean centroid', () => {
    const mid = averageLatLon([
      { lat: 0, lon: -10 },
      { lat: 0, lon: 10 },
    ])
    expect(mid?.lat).toBeCloseTo(0, 5)
    expect(mid?.lon).toBeCloseTo(0, 5)
  })

  it('finds Japan as nearest to a Honshu sample', () => {
    const nearest = nearestMapsMarker({ lat: 35.7, lon: 139.7 }, markers)
    expect(nearest?.marker.slug).toBe('japan')
    expect(nearest?.distanceKm).toBeLessThan(250)
  })

  it('computes a region centroid inside that region’s lon span', () => {
    const asia = regionMarkerCentroid(markers, 'Asia')
    expect(asia).toBeTruthy()
    if (!asia) return
    expect(asia.lat).toBeGreaterThan(0)
    expect(asia.lon).toBeGreaterThan(40)
    expect(asia.lon).toBeLessThan(150)
  })

  it('formats distances for the toolbar', () => {
    expect(formatDistanceKm(3.2)).toBe('3.2 km')
    expect(formatDistanceKm(412)).toBe('412 km')
    expect(formatDistanceKm(2400)).toBe('2.4k km')
  })
})
