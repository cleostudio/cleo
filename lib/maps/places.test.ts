import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'
import { latLngToScene } from '~/lib/maps/geo'

import {
  filterMapPlaces,
  getMapPlace,
  mapPlaces,
  nearestMapPlace,
  PLACE_PICK_MIN_DOT,
} from './places'

describe('map places catalog', () => {
  it('covers every Explore country with a unit direction', () => {
    expect(mapPlaces).toHaveLength(countries.length)
    for (const place of mapPlaces) {
      const length = Math.hypot(...place.direction)
      expect(length).toBeCloseTo(1, 5)
      expect(getMapPlace(place.slug)?.name).toBe(place.name)
    }
  })

  it('picks Japan when aiming near its geographic center', () => {
    const japan = getMapPlace('japan')
    expect(japan).toBeTruthy()
    const hit = nearestMapPlace(japan!.direction)
    expect(hit?.slug).toBe('japan')
  })

  it('ignores directions far from any country center', () => {
    // South Pacific open ocean, far from any country center marker.
    const ocean = latLngToScene(-40, -140)
    expect(nearestMapPlace(ocean, PLACE_PICK_MIN_DOT)).toBeNull()
  })

  it('filters by name and ISO code', () => {
    expect(filterMapPlaces('jap').map((place) => place.slug)).toContain('japan')
    expect(filterMapPlaces('jp')[0]?.slug).toBe('japan')
    expect(filterMapPlaces('zzzz-not-a-country')).toEqual([])
  })
})
