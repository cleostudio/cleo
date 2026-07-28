import { describe, expect, it } from 'vitest'

import { matchesIndexQuery } from './index-filter'

describe('matchesIndexQuery', () => {
  it('matches case-insensitively and treats blank queries as match-all', () => {
    expect(matchesIndexQuery('Japan Asia JP', '')).toBe(true)
    expect(matchesIndexQuery('Japan Asia JP', '  ')).toBe(true)
    expect(matchesIndexQuery('Japan Asia JP', 'japan')).toBe(true)
    expect(matchesIndexQuery('Japan Asia JP', 'EUROPE')).toBe(false)
  })
})
