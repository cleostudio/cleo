import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { mapsRegions } from './regions'
import {
  applyMapsUrlCanonical,
  mapsSharePath,
  resolveMapsUrlState,
} from './url-state'

describe('resolveMapsUrlState', () => {
  const markers = mapsMarkers()
  const markersBySlug = new Map(markers.map((marker) => [marker.slug, marker]))
  const regions = mapsRegions(markers)
  const now = new Date('2026-07-26T15:30:00Z')

  it('accepts a valid country and region pair', () => {
    const resolved = resolveMapsUrlState({
      c: 'japan',
      r: 'Asia',
      h: null,
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.marker?.slug).toBe('japan')
    expect(resolved.region).toBe('Asia')
    expect(resolved.sunMode).toBe('live')
    expect(resolved.dirty).toBe(false)
  })

  it('drops an unknown country slug and marks dirty', () => {
    const resolved = resolveMapsUrlState({
      c: 'not-a-country',
      r: null,
      h: null,
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.marker).toBeNull()
    expect(resolved.canonical.c).toBeNull()
    expect(resolved.dirty).toBe(true)
  })

  it('drops an unknown region', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: 'Middle-Earth',
      h: null,
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.region).toBeNull()
    expect(resolved.dirty).toBe(true)
  })

  it('prefers the country when it conflicts with the region filter', () => {
    const resolved = resolveMapsUrlState({
      c: 'japan',
      r: 'Europe',
      h: null,
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.marker?.slug).toBe('japan')
    expect(resolved.region).toBeNull()
    expect(resolved.canonical).toEqual({
      c: 'japan',
      r: null,
      h: null,
      d: null,
    })
    expect(resolved.dirty).toBe(true)
  })

  it('clears selection when c is absent', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: 'Asia',
      h: null,
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.marker).toBeNull()
    expect(resolved.region).toBe('Asia')
    expect(resolved.dirty).toBe(false)
  })

  it('enables sun scrubbing from h/d and fills missing peers', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: null,
      h: '6',
      d: null,
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.sunMode).toBe('scrub')
    expect(resolved.sunHour).toBe(6)
    expect(resolved.sunDay).toBe(207)
    expect(resolved.canonical).toEqual({ c: null, r: null, h: '6', d: '207' })
    expect(resolved.dirty).toBe(true)
  })

  it('drops invalid sun params', () => {
    const resolved = resolveMapsUrlState({
      c: null,
      r: null,
      h: '99',
      d: 'nope',
      markersBySlug,
      regions,
      now,
    })
    expect(resolved.sunMode).toBe('live')
    expect(resolved.canonical.h).toBeNull()
    expect(resolved.canonical.d).toBeNull()
    expect(resolved.dirty).toBe(true)
  })

  it('applies canonical params onto a search string', () => {
    const params = new URLSearchParams('c=japan&r=Europe&h=99')
    applyMapsUrlCanonical(params, {
      c: 'japan',
      r: null,
      h: '12',
      d: '79',
    })
    expect(params.toString()).toBe('c=japan&h=12&d=79')
  })

  it('builds share paths for country links and sun-only links', () => {
    expect(
      mapsSharePath({ c: 'japan', r: 'Asia', h: '6', d: '79' }),
    ).toBe('/maps?c=japan&r=Asia&h=6&d=79')
    expect(
      mapsSharePath({ c: null, r: 'Asia', h: '6', d: '79' }),
    ).toBe('/maps?r=Asia&h=6&d=79')
    expect(
      mapsSharePath({ c: null, r: null, h: null, d: null }),
    ).toBe('/maps')
  })
})
