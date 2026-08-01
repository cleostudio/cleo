import { describe, expect, it } from 'vitest'

import {
  SESSION_HINT_COOKIE,
  hasSessionHintCookie,
} from './auth-session-hint'

describe('hasSessionHintCookie', () => {
  it('is false for empty or missing cookies', () => {
    expect(hasSessionHintCookie(undefined)).toBe(false)
    expect(hasSessionHintCookie('')).toBe(false)
    expect(hasSessionHintCookie('other=1')).toBe(false)
  })

  it('is true only for a non-empty, non-zero hint value', () => {
    expect(hasSessionHintCookie(`${SESSION_HINT_COOKIE}=1`)).toBe(true)
    expect(hasSessionHintCookie(`a=1; ${SESSION_HINT_COOKIE}=yes`)).toBe(true)
    expect(hasSessionHintCookie(`${SESSION_HINT_COOKIE}=0`)).toBe(false)
    expect(hasSessionHintCookie(`${SESSION_HINT_COOKIE}=`)).toBe(false)
  })
})
