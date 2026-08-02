import { describe, expect, it } from 'vitest'

import {
  countries,
  countriesByRegion,
  countrySlugs,
  getCountry,
  getCountryByName,
  isCountrySlug,
} from './countries'

describe('countries catalog', () => {
  it('lists every country once with a unique slug and ISO code', () => {
    expect(countries.length).toBe(195)

    const slugs = new Set(countries.map((country) => country.slug))
    const codes = new Set(countries.map((country) => country.code))

    expect(slugs.size).toBe(countries.length)
    expect(codes.size).toBe(countries.length)
    expect(countrySlugs()).toHaveLength(countries.length)
  })

  it('resolves countries by slug', () => {
    expect(isCountrySlug('japan')).toBe(true)
    expect(getCountry('japan')).toMatchObject({
      code: 'JP',
      name: 'Japan',
      region: 'Asia',
    })
    expect(getCountry('not-a-country')).toBeUndefined()
  })

  it('resolves countries by exact catalog name', () => {
    expect(getCountryByName('Türkiye')).toMatchObject({
      slug: 'turkiye',
      code: 'TR',
    })
    expect(getCountryByName('Korea, North')).toMatchObject({
      slug: 'korea-north',
    })
    expect(getCountryByName('Turkey')).toBeUndefined()
  })

  it('groups countries by region without dropping any', () => {
    const grouped = countriesByRegion()
    expect(grouped.length).toBeGreaterThan(0)
    expect(grouped.flatMap(([, list]) => list)).toHaveLength(countries.length)
  })
})
