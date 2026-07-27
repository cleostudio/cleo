/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  boundsArea,
  boundsCenter,
  buildCountryLabelCollection,
  buildRegionLabelCollection,
  DEFAULT_MAP_LAYERS,
  exploreRegionHref,
  findMapCountryIndexEntry,
  findMapRegionCamera,
  formatMapCoords,
  mapCountryHref,
  mapRegionHref,
  MAP_COUNTRIES_URL,
  MAP_COUNTRY_INDEX_URL,
  MAP_GLYPHS_URL,
  MAP_LAYER_STORAGE_KEY,
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  mapAttribution,
  parseMapCountryParam,
  parseMapRegionParam,
  readStoredMapLayers,
  resolveMapCountry,
  shareOrCopyMapLink,
  syncMapFocusSearchParams,
  writeStoredMapLayers,
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
    expect(exploreRegionHref('asia')).toBe('/explore#region-Asia')
    expect(exploreRegionHref('Americas')).toBe('/explore#region-Americas')
    expect(exploreRegionHref('atlantis')).toBe('/explore')
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

  it('points at first-party Blue Marble tiles, glyphs, and Natural Earth borders', () => {
    expect(MAP_TILE_URL).toBe('/images/maps/tiles/{z}/{x}/{y}.jpg')
    expect(MAP_COUNTRIES_URL).toBe('/maps/countries.geojson')
    expect(MAP_COUNTRY_INDEX_URL).toBe('/maps/country-index.json')
    expect(MAP_GLYPHS_URL).toBe('/maplibre/fonts/{fontstack}/{range}.pbf')
    expect(MAP_MAX_ZOOM).toBe(6)
    expect(mapAttribution.basemap.name).toContain('Blue Marble')
    expect(mapAttribution.boundaries.name).toContain('Natural Earth')
  })

  it('builds ranked country and region label collections', () => {
    const countries = buildCountryLabelCollection([
      ...sampleIndex,
      {
        code: 'AQ',
        name: 'Antarctica',
        slug: null,
        region: null,
        center: [0, -80],
        bounds: [
          [-180, -90],
          [180, -60],
        ],
        maxZoom: 2,
      },
    ])
    expect(countries.features.map((feature) => feature.properties.code)).toEqual(
      ['JP', 'US'],
    )
    expect(countries.features[1]?.properties.rank).toBeLessThan(
      countries.features[0]?.properties.rank ?? 0,
    )

    const regions = buildRegionLabelCollection(sampleRegions)
    expect(regions.features[0]).toMatchObject({
      properties: { name: 'Asia', rank: -47 },
      geometry: { type: 'Point', coordinates: boundsCenter(sampleRegions[0]!.bounds) },
    })
    expect(boundsArea(sampleIndex[1]!.bounds)).toBeGreaterThan(
      boundsArea(sampleIndex[0]!.bounds),
    )
  })

  it('persists layer visibility in sessionStorage', () => {
    window.sessionStorage.clear()
    expect(readStoredMapLayers()).toEqual(DEFAULT_MAP_LAYERS)
    writeStoredMapLayers({ borders: false, labels: true })
    expect(window.sessionStorage.getItem(MAP_LAYER_STORAGE_KEY)).toContain(
      '"borders":false',
    )
    expect(readStoredMapLayers()).toEqual({ borders: false, labels: true })
  })

  it('shares map links when available and otherwise copies', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    })
    await expect(shareOrCopyMapLink('/maps?country=japan')).resolves.toBe(
      'shared',
    )
    expect(share).toHaveBeenCalled()

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    await expect(shareOrCopyMapLink('/maps?region=asia')).resolves.toBe(
      'copied',
    )
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('/maps?region=asia'),
    )
  })

  it('keeps country and region query params mutually exclusive', () => {
    window.history.replaceState({}, '', '/maps?country=japan&region=asia#globe')

    syncMapFocusSearchParams({ kind: 'region', value: 'Europe' })
    expect(window.location.pathname).toBe('/maps')
    expect(window.location.search).toBe('?region=europe')
    expect(window.location.hash).toBe('#globe')

    syncMapFocusSearchParams({ kind: 'country', value: 'JP' })
    expect(window.location.search).toBe('?country=jp')

    syncMapFocusSearchParams(null)
    expect(window.location.search).toBe('')
    expect(window.location.hash).toBe('#globe')
  })
})

afterEach(() => {
  window.history.replaceState({}, '', '/')
  window.sessionStorage.clear()
})
