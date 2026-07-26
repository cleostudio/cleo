import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { mapsRegions } from './regions'
import { resolveMapsUrlState } from './url-state'

describe('resolveMapsUrlState', () => {
  const markers = mapsMarkers()
  const markersBySlug = new Map(markers.map((marker) => [marker.slug, marker]))
  const regions = mapsRegions(markers)

  it('accepts a valid country and region pair', () => {
    const resolved = resolveMapsUrlState({
      c: 'japan',
      r: 'Asia',
      markersBySlug,
      regions,
    })
    expect(resolved.marker?.slug).toBe('japan')
    expect(resolved.region).toBe('Asia')
    expect(resolved.dirty).toBe(false)
  })

  it('drops an unknown country slug and marks dirty', () => {
    const resolved = resolveMapsUrlState({
      c: 'not-a-country',
      r: null,
      markersBySlug,
      regions,
    })
    expect(resolved.marker).toBeNull()
    expect(resolved.canonical.c).toBeNull()
    expect(resolved.dirty).toBe(true)
  })

  it('drops an unknown region', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: 'Middle-Earth',
      markersBySlug,
      regions,
    })
    expect(resolved.region).toBeNull()
    expect(resolved.dirty).toBe(true)
  })

  it('prefers the country when it conflicts with the region filter', () => {
    const resolved = resolveMapsUrlState({
      c: 'japan',
      r: 'Europe',
      markersBySlug,
      regions,
    })
    expect(resolved.marker?.slug).toBe('japan')
    expect(resolved.region).toBeNull()
    expect(resolved.canonical).toEqual({ c: 'japan', r: null })
    expect(resolved.dirty).toBe(true)
  })

  it('clears selection when c is absent', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: 'Asia',
      markersBySlug,
      regions,
    })
    expect(resolved.marker).toBeNull()
    expect(resolved.region).toBe('Asia')
    expect(resolved.dirty).toBe(false)
  })
})
