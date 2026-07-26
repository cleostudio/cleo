import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { mapsCountryDossiers, mapsPhotoPreviews } from './previews'

describe('mapsPhotoPreviews', () => {
  it('covers every Explore country with a local 640px still', () => {
    const previews = mapsPhotoPreviews()
    expect(Object.keys(previews)).toHaveLength(countries.length)

    const japan = previews.japan
    expect(japan?.place.length).toBeGreaterThan(0)
    expect(japan?.src).toMatch(/^\/images\/atlas\/japan\//)
  })
})

describe('mapsCountryDossiers', () => {
  it('adds orientation, places, and coordinates for every country', () => {
    const dossiers = mapsCountryDossiers()
    expect(Object.keys(dossiers)).toHaveLength(countries.length)

    const japan = dossiers.japan
    expect(japan?.capital.length).toBeGreaterThan(0)
    expect(japan?.about.length).toBeGreaterThan(40)
    expect(japan?.about.endsWith('…') || japan?.about.length <= 220).toBe(true)
    expect(japan?.places).toHaveLength(3)
    expect(japan?.coordsLabel).toMatch(/°[NS] .*°[EW]/)
  })
})
