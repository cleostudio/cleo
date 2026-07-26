import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'

import { buildMapPlacePreviews } from './previews'

describe('map place previews', () => {
  it('covers every Explore country with a local atlas photo', () => {
    const catalog = buildMapPlacePreviews()
    expect(Object.keys(catalog)).toHaveLength(countries.length)
    expect(catalog.japan).toMatchObject({
      capital: expect.any(String),
      photoSrc: expect.stringMatching(/^\/images\/atlas\/japan\//),
      photoAlt: expect.any(String),
      placeName: expect.any(String),
    })
  })
})
