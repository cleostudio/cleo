import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { orientationTeaser, worldPhotoPreviews } from './previews'

describe('orientationTeaser', () => {
  it('keeps a short first sentence intact', () => {
    expect(orientationTeaser('Japan is an archipelago. More follows.')).toBe(
      'Japan is an archipelago.',
    )
  })

  it('clips long sentences on a word boundary', () => {
    const long = `${'word '.repeat(80)}. Next.`
    const teaser = orientationTeaser(long, 80)
    expect(teaser.endsWith('…')).toBe(true)
    expect(teaser.length).toBeLessThanOrEqual(80)
  })
})

describe('worldPhotoPreviews', () => {
  it('covers every Explore country with a local still and teaser', () => {
    const previews = worldPhotoPreviews()
    expect(Object.keys(previews)).toHaveLength(countries.length)

    const japan = previews.japan
    expect(japan?.place.length).toBeGreaterThan(0)
    expect(japan?.src).toMatch(/^\/images\/atlas\/japan\//)
    expect(japan?.teaser.length).toBeGreaterThan(20)
  })
})
