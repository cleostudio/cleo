import { describe, expect, it } from 'vitest'

import { formatUtcHourLabel, mapsSunAt } from './sun-clock'

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

  it('formats UTC hour labels', () => {
    expect(formatUtcHourLabel(0)).toBe('00:00 UTC')
    expect(formatUtcHourLabel(14)).toBe('14:00 UTC')
  })
})
