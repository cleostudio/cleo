import { describe, expect, it } from 'vitest'

import { formatDate, formatDateEn, formatMonthYear } from './date'

describe('localized long dates', () => {
  const date = new Date('2026-07-14T16:30:00.000Z')

  it('formats the same Taipei calendar day in Chinese and English', () => {
    expect(formatDate(date)).toBe('2026年7月15日')
    expect(formatDateEn(date)).toBe('July 15, 2026')
  })
})

describe('formatMonthYear', () => {
  it('stamps the month and year', () => {
    expect(formatMonthYear(new Date('2026-07-14T16:30:00.000Z'))).toBe('Jul 2026')
  })

  it('reads the site time zone, not the build machine', () => {
    // 08:30 on the 1st in Taipei; still the previous month almost everywhere west.
    expect(formatMonthYear(new Date('2026-07-01T00:30:00.000Z'))).toBe('Jul 2026')
  })
})
