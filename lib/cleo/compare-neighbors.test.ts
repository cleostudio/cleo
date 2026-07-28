import { describe, expect, it } from 'vitest'

import {
  exploreComparePeer,
  spaceComparePeer,
} from '~/lib/cleo/compare-neighbors'

describe('compare neighbors', () => {
  it('picks another country in the same Explore subregion', () => {
    const peer = exploreComparePeer('japan')
    expect(peer).toBeTruthy()
    expect(peer).not.toBe('Japan')
  })

  it('picks another Space subject in the same category', () => {
    const peer = spaceComparePeer('mars')
    expect(peer).toBeTruthy()
    expect(peer).not.toBe('Mars')
  })

  it('returns undefined for unknown slugs', () => {
    expect(exploreComparePeer('not-a-country')).toBeUndefined()
    expect(spaceComparePeer('not-a-subject')).toBeUndefined()
  })
})
