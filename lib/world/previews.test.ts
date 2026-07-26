import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { worldPhotoPreviews } from './previews'

describe('worldPhotoPreviews', () => {
  it('covers every Explore country with a local 640px still', () => {
    const previews = worldPhotoPreviews()
    expect(Object.keys(previews)).toHaveLength(countries.length)

    const japan = previews.japan
    expect(japan?.place.length).toBeGreaterThan(0)
    expect(japan?.src).toMatch(/^\/images\/atlas\/japan\//)
  })
})
