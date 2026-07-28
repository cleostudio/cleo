import { describe, expect, it } from 'vitest'

import {
  exploreComparePeer,
  spaceComparePeer,
} from '~/lib/cleo/compare-neighbors'

describe('compare neighbors', () => {
  it('prefers South Korea over North Korea for Japan', () => {
    expect(exploreComparePeer('japan')).toBe('Korea, South')
  })

  it('pairs South Korea with Japan', () => {
    expect(exploreComparePeer('korea-south')).toBe('Japan')
  })

  it('pairs Mars with Earth', () => {
    expect(spaceComparePeer('mars')).toBe('Earth')
  })

  it('falls back within the same Space category when no override exists', () => {
    const peer = spaceComparePeer('andromeda')
    expect(peer).toBeTruthy()
    expect(peer).not.toBe('Andromeda')
  })

  it('returns undefined for unknown slugs', () => {
    expect(exploreComparePeer('not-a-country')).toBeUndefined()
    expect(spaceComparePeer('not-a-subject')).toBeUndefined()
  })
})
