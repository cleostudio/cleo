import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { mapsPhotoPreviews } from './previews'

describe('mapsPhotoPreviews', () => {
  it('covers every Explore country with a local 640px still', () => {
    const previews = mapsPhotoPreviews()
    expect(Object.keys(previews)).toHaveLength(countries.length)

    const japan = previews.japan
    expect(japan?.place.length).toBeGreaterThan(0)
    expect(japan?.src).toMatch(/^\/images\/atlas\/japan\//)
  })
})
