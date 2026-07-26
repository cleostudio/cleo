import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { mapsRegionNeighbors } from './neighbors'

describe('mapsRegionNeighbors', () => {
  it('prefers the same subregion before the wider region', () => {
    const markers = mapsMarkers()
    const japan = markers.find((marker) => marker.slug === 'japan')
    expect(japan).toBeTruthy()
    if (!japan) return

    const neighbors = mapsRegionNeighbors(japan, markers, 4)
    expect(neighbors.length).toBeGreaterThan(0)
    expect(neighbors.every((marker) => marker.slug !== 'japan')).toBe(true)
    expect(neighbors[0]?.subregion).toBe(japan.subregion)
  })
})
