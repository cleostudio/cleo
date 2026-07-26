import { describe, expect, it } from 'vitest'

import {
  solarDeclinationDegrees,
  subsolarLongitudeDegrees,
  sunDirectionAt,
} from './sun'

describe('maps sun helpers', () => {
  it('places the subsolar point near the equator at the equinoxes', () => {
    // 2026-03-20 ~ equinox; 2026-09-22 ~ equinox
    expect(Math.abs(solarDeclinationDegrees(new Date('2026-03-20T12:00:00Z')))).toBeLessThan(2.5)
    expect(Math.abs(solarDeclinationDegrees(new Date('2026-09-22T12:00:00Z')))).toBeLessThan(2.5)
  })

  it('puts noon UTC near the prime meridian', () => {
    expect(subsolarLongitudeDegrees(new Date('2026-07-26T12:00:00Z'))).toBeCloseTo(0, 5)
    expect(subsolarLongitudeDegrees(new Date('2026-07-26T00:00:00Z'))).toBeCloseTo(180, 5)
  })

  it('returns a unit sun direction', () => {
    const [x, y, z] = sunDirectionAt(new Date('2026-07-26T12:00:00Z'))
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 5)
  })
})
