/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  boundsArea,
  boundsCenter,
  buildCountryLabelCollection,
  buildGraticuleCollection,
  buildRegionLabelCollection,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_LAYERS,
  DEFAULT_MAP_ZOOM,
  exploreRegionHref,
  filterMapCountrySuggestions,
  findMapCountryIndexEntry,
  findMapNeighbors,
  findMapRegionCamera,
  findMapRegionSamples,
  formatMapCameraHash,
  formatMapCoords,
  countryLabelMinZoom,
  excerptMapAbout,
  isDefaultMapCamera,
  mapCenterDistanceDeg,
  mapCountryHref,
  mapCountrySuggestionMatchKind,
  mapFocusKey,
  mapHrefWithLayers,
  mapRegionHref,
  mapRegionLabel,
  mapSuggestionSecondary,
  mapsDeepLinkMetadata,
  mapsFocusDocumentTitle,
  mapViewHref,
  resolveMapIdleStarters,
  MAP_CAPITALS_URL,
  MAP_COUNTRIES_URL,
  MAP_COUNTRY_INDEX_URL,
  MAP_GLYPHS_URL,
  MAP_LAYER_STORAGE_KEY,
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  mapAttribution,
  parseMapCameraHash,
  parseMapCountryParam,
  parseMapLayersSearchParams,
  parseMapRegionParam,
  readMapFocusSearchParams,
  readStoredMapLayers,
  resolveMapCountry,
  resolveMapLayers,
  shareOrCopyMapLink,
  syncMapCameraHash,
  syncMapFocusSearchParams,
  syncMapLayersSearchParams,
  writeStoredMapLayers,
  type MapCountryIndex,
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
    expect(mapRegionLabel('asia')).toBe('Asia')
    expect(mapRegionLabel('atlantis')).toBeNull()
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
    expect(MAP_CAPITALS_URL).toBe('/maps/capitals.geojson')
    expect(MAP_GLYPHS_URL).toBe('/maplibre/fonts/{fontstack}/{range}.pbf')
    expect(MAP_MAX_ZOOM).toBe(6)
    expect(mapAttribution.basemap.name).toContain('Blue Marble')
    expect(mapAttribution.boundaries.name).toContain('Natural Earth')
    expect(mapAttribution.capitals.name).toContain('capitals')
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

  it('builds a 30° graticule with equator and prime meridian', () => {
    const grid = buildGraticuleCollection(30)
    expect(grid.features.length).toBeGreaterThan(10)
    expect(
      grid.features.some(
        (feature) =>
          feature.properties.kind === 'parallel' && feature.properties.value === 0,
      ),
    ).toBe(true)
    expect(
      grid.features.some(
        (feature) =>
          feature.properties.kind === 'meridian' && feature.properties.value === 0,
      ),
    ).toBe(true)
  })

  it('filters country suggestions by capital as well as name', () => {
    expect(
      filterMapCountrySuggestions(sampleIndex, 'tokyo', {
        JP: 'Tokyo',
        US: 'Washington, D.C.',
      }).map((entry) => entry.code),
    ).toEqual(['JP'])
    expect(
      mapCountrySuggestionMatchKind(sampleIndex[0]!, 'tokyo', { JP: 'Tokyo' }),
    ).toBe('capital')
    expect(
      mapSuggestionSecondary(sampleIndex[0]!, 'tokyo', { JP: 'Tokyo' }),
    ).toBe('Capital · Tokyo')
    expect(
      mapSuggestionSecondary(
        {
          code: 'HK',
          name: 'Hong Kong',
          slug: null,
          region: 'Asia',
          center: [114, 22],
          bounds: [
            [113.8, 22.1],
            [114.4, 22.6],
          ],
          maxZoom: 6,
          capitalName: 'Hong Kong',
        },
        'hk',
      ),
    ).toBe('Territory · Asia')
    expect(
      mapSuggestionSecondary(
        {
          code: 'HK',
          name: 'Hong Kong',
          slug: null,
          region: 'Asia',
          center: [114, 22],
          bounds: [
            [113.8, 22.1],
            [114.4, 22.6],
          ],
          maxZoom: 6,
          capitalName: 'Hong Kong',
        },
        'hong',
      ),
    ).toBe('Capital · Hong Kong')
    expect(filterMapCountrySuggestions(sampleIndex, 'zzz')).toEqual([])
    expect(
      filterMapCountrySuggestions(
        [
          ...sampleIndex,
          {
            code: 'KR',
            name: 'South Korea',
            slug: 'south-korea',
            region: 'Asia',
            center: [127.5, 36.5],
            bounds: [
              [126, 33],
              [130, 39],
            ],
            maxZoom: 5,
            capitalName: 'Seoul',
          },
        ],
        'seoul',
        { KR: 'Seoul' },
      ).map((entry) => entry.code),
    ).toEqual(['KR'])
  })

  it('samples curated Explore guides for a region dossier', () => {
    const asiaPool: MapCountryIndexEntry[] = [
      {
        code: 'AF',
        name: 'Afghanistan',
        slug: 'afghanistan',
        region: 'Asia',
        center: [66, 33],
        bounds: [
          [60, 29],
          [75, 38],
        ],
        maxZoom: 4,
      },
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
        code: 'CN',
        name: 'China',
        slug: 'china',
        region: 'Asia',
        center: [104, 35],
        bounds: [
          [73, 18],
          [135, 53],
        ],
        maxZoom: 3,
      },
      {
        code: 'HK',
        name: 'Hong Kong',
        slug: null,
        region: 'Asia',
        center: [114, 22],
        bounds: [
          [113.8, 22.1],
          [114.4, 22.6],
        ],
        maxZoom: 6,
      },
    ]
    expect(
      findMapRegionSamples('asia', asiaPool, { limit: 2 }).map(
        (entry) => entry.code,
      ),
    ).toEqual(['JP', 'CN'])
    expect(findMapRegionSamples('atlantis', asiaPool)).toEqual([])
  })

  it('resolves idle starter chips from the country and region indexes', () => {
    const starters = resolveMapIdleStarters(sampleIndex, sampleRegions, [
      { kind: 'country', value: 'japan' },
      { kind: 'region', value: 'asia' },
      { kind: 'country', value: 'zz' },
    ])
    expect(starters.map((starter) => starter.key)).toEqual([
      'country:JP',
      'region:asia',
    ])
    expect(starters[0]).toMatchObject({ kind: 'country', label: 'Japan' })
    expect(starters[1]).toMatchObject({ kind: 'region', label: 'Asia' })
  })

  it('finds nearby places by bounds adjacency and prefers same-region guides', () => {
    const korea: MapCountryIndexEntry = {
      code: 'KR',
      name: 'South Korea',
      slug: 'south-korea',
      region: 'Asia',
      center: [127.5, 36.5],
      bounds: [
        [126, 33],
        [130, 39],
      ],
      maxZoom: 5,
    }
    const china: MapCountryIndexEntry = {
      code: 'CN',
      name: 'China',
      slug: 'china',
      region: 'Asia',
      center: [104, 35],
      bounds: [
        [73, 18],
        [135, 53],
      ],
      maxZoom: 3,
    }
    const brazil: MapCountryIndexEntry = {
      code: 'BR',
      name: 'Brazil',
      slug: 'brazil',
      region: 'Americas',
      center: [-55, -10],
      bounds: [
        [-74, -34],
        [-34, 5],
      ],
      maxZoom: 3,
    }
    const japan = sampleIndex[0]!
    const neighbors = findMapNeighbors(japan, [
      ...sampleIndex,
      korea,
      china,
      brazil,
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
    expect(neighbors.map((entry) => entry.code)).toEqual(['KR', 'CN'])
    expect(mapCenterDistanceDeg(japan.center, korea.center)).toBeLessThan(
      mapCenterDistanceDeg(japan.center, china.center),
    )
    expect(findMapNeighbors(japan, sampleIndex)).toEqual([])
  })

  it('raises label min-zoom for small countries and excerpts atlas about copy', () => {
    expect(
      countryLabelMinZoom([
        [0, 0],
        [0.2, 0.2],
      ]),
    ).toBeGreaterThan(
      countryLabelMinZoom([
        [-10, -10],
        [10, 10],
      ]),
    )
    expect(
      excerptMapAbout(
        'Japan is an archipelago in East Asia. Its islands frame the Pacific with volcanic arcs and dense coastal cities that have long oriented life toward the sea.',
        80,
      ),
    ).toMatch(/…$/)
  })

  it('persists layer visibility in sessionStorage', () => {
    window.sessionStorage.clear()
    expect(readStoredMapLayers()).toEqual(DEFAULT_MAP_LAYERS)
    writeStoredMapLayers({ borders: false, labels: true, graticule: true })
    expect(window.sessionStorage.getItem(MAP_LAYER_STORAGE_KEY)).toContain(
      '"borders":false',
    )
    expect(readStoredMapLayers()).toEqual({
      borders: false,
      labels: true,
      graticule: true,
    })
  })

  it('parses and syncs non-default layer URL params', () => {
    expect(
      parseMapLayersSearchParams(
        new URLSearchParams('borders=0&labels=1&graticule=on'),
      ),
    ).toEqual({ borders: false, labels: true, graticule: true })

    expect(
      resolveMapLayers(
        { graticule: true },
        { borders: false, labels: true, graticule: false },
      ),
    ).toEqual({ borders: false, labels: true, graticule: true })

    window.history.replaceState({}, '', '/maps?country=japan')
    syncMapLayersSearchParams({
      borders: false,
      labels: true,
      graticule: true,
    })
    expect(window.location.search).toBe('?country=japan&borders=0&graticule=1')

    expect(
      mapHrefWithLayers('/maps?country=japan', {
        borders: true,
        labels: false,
        graticule: false,
      }),
    ).toBe('/maps?country=japan&labels=0')
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

  it('falls back to clipboard when Web Share is cancelled', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Dismissed', 'AbortError'))
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    })
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    await expect(shareOrCopyMapLink('/maps#5/35.68/139.69')).resolves.toBe(
      'copied',
    )
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('/maps#5/35.68/139.69'),
    )
  })

  it('uses a legacy copy path when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })
    await expect(shareOrCopyMapLink('/maps?region=europe')).resolves.toBe(
      'copied',
    )
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('parses and formats MapLibre-style camera hashes', () => {
    expect(parseMapCameraHash('#5.2/35.68/139.691')).toEqual({
      center: [139.691, 35.68],
      zoom: 5.2,
    })
    expect(parseMapCameraHash('#5.2/35.68/139.691/-10/0')).toEqual({
      center: [139.691, 35.68],
      zoom: 5.2,
    })
    expect(parseMapCameraHash('#globe')).toBeNull()
    expect(parseMapCameraHash('#map=5/35/139')).toBeNull()
    expect(parseMapCameraHash('#99/0/0')).toBeNull()
    expect(isDefaultMapCamera({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM })).toBe(
      true,
    )
    expect(formatMapCameraHash({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM })).toBe(
      '',
    )
    expect(formatMapCameraHash({ center: [139.6912, 35.6804], zoom: 5.21 })).toBe(
      '#5.21/35.6804/139.6912',
    )

    window.history.replaceState({}, '', '/maps?country=japan#globe')
    syncMapCameraHash({ center: [139.69, 35.68], zoom: 5 })
    expect(window.location.search).toBe('?country=japan')
    expect(window.location.hash).toBe('#5/35.68/139.69')

    syncMapCameraHash({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM })
    expect(window.location.hash).toBe('')

    window.history.replaceState({}, '', '/maps?labels=0#globe')
    syncMapCameraHash(null)
    expect(window.location.hash).toBe('#globe')

    window.history.replaceState({}, '', '/maps?graticule=1')
    expect(
      mapViewHref({ center: [10, 20], zoom: 3.5 }),
    ).toBe('/maps?graticule=1#3.5/20/10')
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

  it('preserves layer params while syncing focus', () => {
    window.history.replaceState(
      {},
      '',
      '/maps?country=japan&borders=0&graticule=1',
    )
    syncMapFocusSearchParams({ kind: 'region', value: 'asia' })
    expect(window.location.search).toBe('?borders=0&graticule=1&region=asia')
  })

  it('pushes discrete focus changes and skips no-op pushes', () => {
    window.history.replaceState({}, '', '/maps')
    const start = window.history.length

    syncMapFocusSearchParams(
      { kind: 'country', value: 'japan' },
      { history: 'push' },
    )
    expect(window.location.search).toBe('?country=japan')
    expect(window.history.length).toBeGreaterThanOrEqual(start)

    const afterJapan = window.history.length
    syncMapFocusSearchParams(
      { kind: 'country', value: 'japan' },
      { history: 'push' },
    )
    expect(window.history.length).toBe(afterJapan)

    syncMapFocusSearchParams(
      { kind: 'region', value: 'asia' },
      { history: 'push' },
    )
    expect(window.location.search).toBe('?region=asia')
    expect(readMapFocusSearchParams(new URLSearchParams(window.location.search))).toEqual({
      kind: 'region',
      value: 'asia',
    })
    expect(mapFocusKey({ kind: 'country', value: 'JP' })).toBe('country:jp')
  })

  it('builds deep-link metadata and document titles for Maps focus', () => {
    const index: MapCountryIndex = {
      countries: sampleIndex,
      regions: sampleRegions,
    }
    expect(mapsDeepLinkMetadata(new URLSearchParams('country=japan'), index)).toEqual({
      title: 'Japan · Maps',
      description: expect.stringContaining('Explore field guide'),
    })
    expect(mapsDeepLinkMetadata(new URLSearchParams('region=asia'), index)).toEqual({
      title: 'Asia · Maps',
      description: expect.stringContaining('47 Explore'),
    })
    expect(mapsDeepLinkMetadata(new URLSearchParams(), index).title).toBe('Maps')
    expect(mapsFocusDocumentTitle({ countryName: 'Japan' })).toBe('Japan · Maps')
    expect(mapsFocusDocumentTitle({ regionLabel: 'Oceania' })).toBe('Oceania · Maps')
    expect(mapsFocusDocumentTitle({})).toBe('Maps')
  })
})

afterEach(() => {
  window.history.replaceState({}, '', '/')
  window.sessionStorage.clear()
})
