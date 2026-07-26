import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { filterMapsMarkersByQuery } from './search'

describe('filterMapsMarkersByQuery', () => {
  const markers = mapsMarkers()

  it('returns nothing for an empty query', () => {
    expect(filterMapsMarkersByQuery(markers, '   ')).toEqual([])
  })

  it('matches by name, code, and subregion', () => {
    expect(filterMapsMarkersByQuery(markers, 'japan')[0]?.slug).toBe('japan')
    expect(filterMapsMarkersByQuery(markers, 'jp')[0]?.code).toBe('JP')
    expect(
      filterMapsMarkersByQuery(markers, 'eastern asia').some(
        (marker) => marker.slug === 'japan',
      ),
    ).toBe(true)
  })

  it('respects the result limit', () => {
    expect(filterMapsMarkersByQuery(markers, 'a', 3)).toHaveLength(3)
  })
})
