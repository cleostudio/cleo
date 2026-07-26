import { describe, expect, it } from 'vitest'

import {
  findMapCountryIndexEntry,
  findMapRegionCamera,
  formatMapCoords,
  mapCountryHref,
  mapRegionHref,
  MAP_COUNTRIES_URL,
  MAP_COUNTRY_INDEX_URL,
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  mapAttribution,
  parseMapCountryParam,
  parseMapRegionParam,
  resolveMapCountry,
  type MapCountryIndexEntry,
  type MapRegionCamera,
} from './maps'

const sampleIndex: MapCountryIndexEntry[] = [
  {
    code: 'JP',
    name: 'Japan',
    slug: 'japan',
    region: 'Asia',
    center: [138, 36],
    bounds: [
      [123, 24],
      [146, 46],
    ],
    maxZoom: 4.5,
  },
  {
    code: 'US',
    name: 'United States of America',
    slug: 'united-states',
    region: 'Americas',
    center: [-98, 39],
    bounds: [
      [-125, 24],
      [-66, 50],
    ],
    maxZoom: 3.2,
  },
]

const sampleRegions: MapRegionCamera[] = [
  {
    id: 'asia',
    label: 'Asia',
    bounds: [
      [25, -10],
      [146, 55],
    ],
    maxZoom: 1.9,
    tally: 47,
  },
]

describe('maps helpers', () => {
  it('resolves Explore guides from ISO country codes', () => {
    expect(resolveMapCountry('jp')).toEqual({
      code: 'JP',
      name: 'Japan',
      country: expect.objectContaining({ slug: 'japan', region: 'Asia' }),
      href: '/explore/japan',
      mapHref: '/maps?country=japan',
    })
  })

  it('keeps unknown codes readable without inventing a guide link', () => {
    expect(resolveMapCountry('ZZ', 'Hypothetical')).toEqual({
      code: 'ZZ',
      name: 'Hypothetical',
      country: undefined,
      href: undefined,
      mapHref: '/maps?country=zz',
    })
  })

  it('builds and parses Maps deep links for countries and regions', () => {
    expect(mapCountryHref('japan')).toBe('/maps?country=japan')
    expect(mapCountryHref('JP')).toBe('/maps?country=jp')
    expect(mapRegionHref('Asia')).toBe('/maps?region=asia')
    expect(mapRegionHref('Oceania')).toBe('/maps?region=oceania')
    expect(mapRegionHref('not-a-region')).toBe('/maps')
    expect(parseMapCountryParam('japan')).toEqual({ kind: 'slug', value: 'japan' })
    expect(parseMapCountryParam('jp')).toEqual({ kind: 'code', value: 'JP' })
    expect(parseMapRegionParam('EUROPE')).toBe('europe')
    expect(parseMapRegionParam('atlantis')).toBeNull()
    expect(findMapCountryIndexEntry(sampleIndex, 'japan')?.code).toBe('JP')
    expect(findMapCountryIndexEntry(sampleIndex, 'us')?.slug).toBe('united-states')
    expect(findMapRegionCamera(sampleRegions, 'asia')?.label).toBe('Asia')
  })

  it('formats map coordinates for the status readout', () => {
    expect(formatMapCoords(139.69, 35.68)).toBe('35.68°N · 139.69°E')
    expect(formatMapCoords(-74.01, -34.6)).toBe('34.60°S · 74.01°W')
  })

  it('points at first-party Blue Marble tiles and Natural Earth borders', () => {
    expect(MAP_TILE_URL).toBe('/images/maps/tiles/{z}/{x}/{y}.jpg')
    expect(MAP_COUNTRIES_URL).toBe('/maps/countries.geojson')
    expect(MAP_COUNTRY_INDEX_URL).toBe('/maps/country-index.json')
    expect(MAP_MAX_ZOOM).toBe(4)
    expect(mapAttribution.basemap.name).toContain('Blue Marble')
    expect(mapAttribution.boundaries.name).toContain('Natural Earth')
  })
})
