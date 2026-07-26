import { describe, expect, it } from 'vitest'

import { regionLookAt, WORLD_REGIONS } from './regions'

describe('world regions', () => {
  it('frames every catalog region with finite coordinates', () => {
    for (const region of WORLD_REGIONS) {
      const lookAt = regionLookAt(region)
      expect(lookAt, region).not.toBeNull()
      expect(Number.isFinite(lookAt!.lat)).toBe(true)
      expect(Number.isFinite(lookAt!.lon)).toBe(true)
    }
  })

  it('places Europe in the northern eastern hemisphere', () => {
    const europe = regionLookAt('Europe')
    expect(europe!.lat).toBeGreaterThan(30)
    expect(europe!.lon).toBeGreaterThan(-30)
    expect(europe!.lon).toBeLessThan(60)
  })
})
