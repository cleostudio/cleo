import { describe, expect, it } from 'vitest'

import { mapsMarkers } from './markers'
import { mapsCountryDossiers } from './previews'
import {
  filterMapsMarkersByQuery,
  mapsSearchDocs,
} from './search'

describe('filterMapsMarkersByQuery', () => {
  const markers = mapsMarkers()
  const docs = mapsSearchDocs(markers, mapsCountryDossiers())

  it('returns nothing for an empty query', () => {
    expect(filterMapsMarkersByQuery(docs, '   ')).toEqual([])
  })

  it('matches by name, code, and subregion', () => {
    expect(filterMapsMarkersByQuery(docs, 'japan')[0]?.marker.slug).toBe(
      'japan',
    )
    expect(filterMapsMarkersByQuery(docs, 'jp')[0]?.marker.code).toBe('JP')
    expect(
      filterMapsMarkersByQuery(docs, 'eastern asia').some(
        (hit) => hit.marker.slug === 'japan',
      ),
    ).toBe(true)
  })

  it('matches atlas capitals and places', () => {
    const tokyo = filterMapsMarkersByQuery(docs, 'tokyo')
    expect(tokyo[0]?.marker.slug).toBe('japan')
    expect(tokyo[0]?.matchLabel).toMatch(/Capital/i)

    const fuji = filterMapsMarkersByQuery(docs, 'fuji')
    expect(fuji.some((hit) => hit.marker.slug === 'japan')).toBe(true)
    expect(
      fuji.find((hit) => hit.marker.slug === 'japan')?.matchLabel,
    ).toMatch(/Place/i)
  })

  it('ranks exact name matches above broad region hits', () => {
    const hits = filterMapsMarkersByQuery(docs, 'japan', 10)
    expect(hits[0]?.marker.slug).toBe('japan')
    expect(hits[0]?.score).toBeGreaterThan(hits[1]?.score ?? 0)
  })

  it('respects the result limit', () => {
    expect(filterMapsMarkersByQuery(docs, 'a', 3)).toHaveLength(3)
  })
})
