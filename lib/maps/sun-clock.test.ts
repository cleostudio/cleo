import { describe, expect, it } from 'vitest'

import {
  formatUtcDayLabel,
  formatUtcHourLabel,
  mapsSunAt,
  utcDayOfYear,
} from './sun-clock'
import { solarDeclinationDegrees } from './sun'

describe('mapsSunAt', () => {
  it('returns the live clock in live mode', () => {
    const now = new Date('2026-07-26T15:30:00Z')
    expect(mapsSunAt('live', 3, now).toISOString()).toBe(now.toISOString())
  })

  it('pins a scrubbed hour on the current UTC calendar day', () => {
    const now = new Date('2026-07-26T15:30:00Z')
    expect(mapsSunAt('scrub', 6, now).toISOString()).toBe(
      '2026-07-26T06:00:00.000Z',
    )
  })

  it('scrubs a seasonal day-of-year for axial tilt', () => {
    const now = new Date('2026-07-26T15:30:00Z')
    // 2026-03-20 is day 79
    const equinox = mapsSunAt('scrub', 12, now, 79)
    expect(equinox.toISOString()).toBe('2026-03-20T12:00:00.000Z')
    expect(Math.abs(solarDeclinationDegrees(equinox))).toBeLessThan(2.5)

    const juneSolstice = mapsSunAt('scrub', 12, now, 172)
    expect(solarDeclinationDegrees(juneSolstice)).toBeGreaterThan(20)
  })

  it('formats UTC hour and day labels', () => {
    expect(formatUtcHourLabel(0)).toBe('00:00 UTC')
    expect(formatUtcHourLabel(14)).toBe('14:00 UTC')
    expect(formatUtcDayLabel(79, 2026)).toBe('Mar 20')
    expect(utcDayOfYear(new Date('2026-07-26T15:30:00Z'))).toBe(207)
  })
})
