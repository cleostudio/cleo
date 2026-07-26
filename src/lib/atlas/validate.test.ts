import { describe, expect, it } from 'vitest'

import atlas from '~/content/atlas.json'
import { countries } from '~/lib/countries'
import type { AtlasManifest } from './types'
import { AtlasValidationError, validateAtlasManifest } from './validate'

describe('atlas manifest', () => {
  it('covers every country slug exactly once with complete records', () => {
    expect(() => validateAtlasManifest(atlas as unknown as AtlasManifest)).not.toThrow()
    expect(Object.keys(atlas)).toHaveLength(countries.length)
  })

  it('rejects incomplete place counts', () => {
    const clone = structuredClone(atlas) as unknown as AtlasManifest
    const japan = clone.japan!
    japan.places = japan.places.slice(0, 2) as typeof japan.places
    expect(() => validateAtlasManifest(clone)).toThrow(AtlasValidationError)
  })
})
