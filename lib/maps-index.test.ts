import { describe, expect, it } from 'vitest'

import { loadMapCountryIndex } from './maps-index'
import { MAP_REGION_IDS } from './maps'

describe('loadMapCountryIndex', () => {
  const index = loadMapCountryIndex()

  it('loads countries with camera bounds and Explore capitals', () => {
    expect(index.countries.length).toBeGreaterThanOrEqual(190)
    expect(index.regions.map((region) => region.id).sort()).toEqual(
      [...MAP_REGION_IDS].sort(),
    )

    const japan = index.countries.find((entry) => entry.slug === 'japan')
    expect(japan).toMatchObject({
      code: 'JP',
      capitalName: 'Tokyo',
    })
    expect(japan?.capital).toEqual([
      expect.any(Number),
      expect.any(Number),
    ])
    expect(japan?.bounds).toHaveLength(2)
  })

  it('covers every Explore slug with a capital point', () => {
    const explore = index.countries.filter((entry) => entry.slug)
    expect(explore.length).toBeGreaterThanOrEqual(190)
    for (const entry of explore) {
      expect(entry.capital).toEqual([expect.any(Number), expect.any(Number)])
      expect(entry.capitalName?.length).toBeGreaterThan(0)
    }
  })
})
