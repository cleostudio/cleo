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

  it('pairs high-traffic Explore guides with curated neighbors', () => {
    expect(exploreComparePeer('italy')).toBe('Switzerland')
    expect(exploreComparePeer('egypt')).toBe('Morocco')
    expect(exploreComparePeer('iceland')).toBe('Norway')
    expect(exploreComparePeer('turkiye')).toBe('Greece')
    expect(exploreComparePeer('nigeria')).toBe('Ghana')
    expect(exploreComparePeer('indonesia')).toBe('Malaysia')
  })

  it('pairs Mars with Earth', () => {
    expect(spaceComparePeer('mars')).toBe('Earth')
  })

  it('pairs ISS and Sun with Earth instead of the Asteroid Belt', () => {
    expect(spaceComparePeer('iss')).toBe('Earth')
    expect(spaceComparePeer('sun')).toBe('Earth')
  })

  it('pairs nebulae and galaxies with sensible peers', () => {
    expect(spaceComparePeer('orion-nebula')).toBe('Carina Nebula')
    expect(spaceComparePeer('crab-nebula')).toBe('Orion Nebula')
    expect(spaceComparePeer('milky-way')).toBe('Andromeda')
    expect(spaceComparePeer('andromeda')).toBe('Milky Way')
  })

  it('falls back within the same Space category when no override exists', () => {
    const peer = spaceComparePeer('enceladus')
    expect(peer).toBe('Titan')
  })

  it('returns undefined for unknown slugs', () => {
    expect(exploreComparePeer('not-a-country')).toBeUndefined()
    expect(spaceComparePeer('not-a-subject')).toBeUndefined()
  })
})
