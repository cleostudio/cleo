import { describe, expect, it } from 'vitest'

import {
  daylightLabelAt,
  isDaylightAt,
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

  it('reports daylight under the subsolar point and night on the far side', () => {
    const noon = new Date('2026-03-20T12:00:00Z')
    expect(isDaylightAt(0, 0, noon)).toBe(true)
    expect(isDaylightAt(0, 180, noon)).toBe(false)
    expect(daylightLabelAt(0, 0, noon)).toBe('Daylight')
    expect(daylightLabelAt(0, 180, noon)).toBe('Night')
  })

  it('places Japan in daylight mid-afternoon JST and night before dawn', () => {
    // Japan ~36°N 138°E; 06:00 UTC ≈ 15:00 JST, 18:00 UTC ≈ 03:00 JST.
    expect(isDaylightAt(36, 138, new Date('2026-03-20T06:00:00Z'))).toBe(true)
    expect(isDaylightAt(36, 138, new Date('2026-03-20T18:00:00Z'))).toBe(false)
  })
})
