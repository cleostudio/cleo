import { describe, expect, it } from 'vitest'

import {
  formatMapCoords,
  MAP_COUNTRIES_URL,
  MAP_MAX_ZOOM,
  MAP_TILE_URL,
  mapAttribution,
  resolveMapCountry,
} from './maps'

describe('maps helpers', () => {
  it('resolves Explore guides from ISO country codes', () => {
    expect(resolveMapCountry('jp')).toEqual({
      code: 'JP',
      name: 'Japan',
      country: expect.objectContaining({ slug: 'japan' }),
      href: '/explore/japan',
    })
  })

  it('keeps unknown codes readable without inventing a guide link', () => {
    expect(resolveMapCountry('ZZ', 'Hypothetical')).toEqual({
      code: 'ZZ',
      name: 'Hypothetical',
      country: undefined,
      href: undefined,
    })
  })

  it('formats map coordinates for the status readout', () => {
    expect(formatMapCoords(139.69, 35.68)).toBe('35.68°N · 139.69°E')
    expect(formatMapCoords(-74.01, -34.6)).toBe('34.60°S · 74.01°W')
  })

  it('points at first-party Blue Marble tiles and Natural Earth borders', () => {
    expect(MAP_TILE_URL).toBe('/images/maps/tiles/{z}/{x}/{y}.jpg')
    expect(MAP_COUNTRIES_URL).toBe('/maps/countries.geojson')
    expect(MAP_MAX_ZOOM).toBe(4)
    expect(mapAttribution.basemap.name).toContain('Blue Marble')
    expect(mapAttribution.boundaries.name).toContain('Natural Earth')
  })
})
