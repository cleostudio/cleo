import { describe, expect, it } from 'vitest'

import { formatDateEn } from './date'

describe('English long dates', () => {
  const date = new Date('2026-07-14T16:30:00.000Z')

  it('uses the Taipei calendar day', () => {
    expect(formatDateEn(date)).toBe('July 15, 2026')
  })
})
