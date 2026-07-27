import { describe, expect, it } from 'vitest'

import { loadMapCountryIndex } from './maps-index'
import { FALLBACK_MAP_REGIONS, MAP_REGION_IDS } from './maps'

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

  it('keeps FALLBACK_MAP_REGIONS aligned with the prepared index cameras', () => {
    expect(FALLBACK_MAP_REGIONS.map((region) => region.id)).toEqual(
      MAP_REGION_IDS as unknown as string[],
    )
    for (const fallback of FALLBACK_MAP_REGIONS) {
      const prepared = index.regions.find((region) => region.id === fallback.id)
      expect(prepared).toBeDefined()
      expect(fallback.bounds).toEqual(prepared?.bounds)
      expect(fallback.maxZoom).toBe(prepared?.maxZoom)
      expect(fallback.label).toBe(prepared?.label)
    }
  })

  it('curates region and capital metadata for no-guide territories', () => {
    const territories = index.countries.filter((entry) => !entry.slug)
    expect(territories.length).toBeGreaterThanOrEqual(40)
    expect(territories.filter((entry) => entry.region).length).toBeGreaterThanOrEqual(
      30,
    )
    expect(
      territories.filter((entry) => entry.capitalName).length,
    ).toBeGreaterThanOrEqual(30)

    const hongKong = index.countries.find((entry) => entry.code === 'HK')
    expect(hongKong).toMatchObject({
      region: 'Asia',
      capitalName: 'Hong Kong',
    })
    const greenland = index.countries.find((entry) => entry.code === 'GL')
    expect(greenland).toMatchObject({
      region: 'Americas',
      capitalName: 'Nuuk',
    })
    // Territories must not widen Explore-only region cameras.
    const europe = index.regions.find((region) => region.id === 'europe')
    expect(europe?.bounds[0][0]).toBeGreaterThanOrEqual(-26)
  })
})
