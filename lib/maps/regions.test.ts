import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { filterMapsMarkersByRegion, mapsRegions } from './regions'

describe('mapsRegions', () => {
  it('lists sorted unique regions', () => {
    const regions = mapsRegions(mapsMarkers())
    expect(regions.length).toBeGreaterThan(3)
    expect(regions).toEqual([...regions].sort((a, b) => a.localeCompare(b, 'en')))
    expect(regions).toContain('Asia')
    expect(regions).toContain('Europe')
  })
})

describe('filterMapsMarkersByRegion', () => {
  it('returns all markers when region is null', () => {
    const markers = mapsMarkers()
    expect(filterMapsMarkersByRegion(markers, null)).toHaveLength(markers.length)
  })

  it('keeps only the requested region', () => {
    const markers = mapsMarkers()
    const asia = filterMapsMarkersByRegion(markers, 'Asia')
    expect(asia.length).toBeGreaterThan(0)
    expect(asia.every((marker) => marker.region === 'Asia')).toBe(true)
  })
})
