import { describe, expect, it } from 'vitest'

import {
  ecefToScene,
  julianDate,
  sunDirectionEcef,
  sunDirectionScene,
  sunEquatorial,
} from './sun'

describe('maps sun clock', () => {
  it('converts the Unix epoch to the known Julian Date', () => {
    expect(julianDate(new Date('1970-01-01T00:00:00.000Z'))).toBeCloseTo(
      2_440_587.5,
      5,
    )
  })

  it('puts the March equinox sun near the equator at Greenwich noon', () => {
    // 2024-03-20 12:00 UTC — close to the March equinox.
    const date = new Date('2024-03-20T12:00:00.000Z')
    const { declination } = sunEquatorial(date)
    expect(declination * (180 / Math.PI)).toBeGreaterThan(-2)
    expect(declination * (180 / Math.PI)).toBeLessThan(2)

    const [x, y, z] = sunDirectionEcef(date)
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 5)
    // Near noon at Greenwich the sun should be mostly +X (day over Africa/Atlantic).
    expect(x).toBeGreaterThan(0.9)
    expect(Math.abs(z)).toBeLessThan(0.15)
  })

  it('tilts north in June and south in December', () => {
    const june = sunDirectionEcef(new Date('2024-06-21T12:00:00.000Z'))
    const december = sunDirectionEcef(new Date('2024-12-21T12:00:00.000Z'))
    expect(june[2]).toBeGreaterThan(0.3)
    expect(december[2]).toBeLessThan(-0.3)
  })

  it('remaps ECEF into the Three.js scene frame', () => {
    expect(ecefToScene([1, 0, 0])).toEqual([
      expect.closeTo(1),
      expect.closeTo(0),
      expect.closeTo(0),
    ])
    expect(ecefToScene([0, 1, 0])).toEqual([
      expect.closeTo(0),
      expect.closeTo(0),
      expect.closeTo(-1),
    ])
    expect(ecefToScene([0, 0, 1])).toEqual([
      expect.closeTo(0),
      expect.closeTo(1),
      expect.closeTo(0),
    ])
    expect(sunDirectionScene(new Date('2024-03-20T12:00:00.000Z'))[0]).toBeGreaterThan(
      0.9,
    )
  })
})
