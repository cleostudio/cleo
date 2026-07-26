import { describe, expect, it } from 'vitest'

import {
  easeOutCubic,
  framingPosition,
  MAPS_COUNTRY_FLY_DISTANCE,
  MAPS_REGION_FLY_DISTANCE,
} from './camera'

describe('maps camera helpers', () => {
  it('eases out from zero to one', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })

  it('frames a surface direction at the requested distance', () => {
    const [x, y, z] = framingPosition({ x: 0, y: 1, z: 0 }, 2)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(2)
    expect(z).toBeCloseTo(0)
  })

  it('frames regions farther out than a single country', () => {
    expect(MAPS_REGION_FLY_DISTANCE).toBeGreaterThan(MAPS_COUNTRY_FLY_DISTANCE)
  })
})
