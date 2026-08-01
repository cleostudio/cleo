import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_VALUE,
  clearSessionHintCookie,
  hasSessionHintCookie,
  maxAgeSecondsUntil,
  sessionHintClearCookieString,
  sessionHintSetCookieString,
  setSessionHintCookie,
  syncSessionHintFromSession,
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

describe('session hint cookie strings', () => {
  it('sets Path=/, SameSite=Lax, never httpOnly, Secure in production', () => {
    const set = sessionHintSetCookieString({
      maxAgeSeconds: 120,
      secure: true,
    })
    expect(set).toContain(`${SESSION_HINT_COOKIE}=${SESSION_HINT_VALUE}`)
    expect(set).toContain('Path=/')
    expect(set).toContain('SameSite=Lax')
    expect(set).toContain('Max-Age=120')
    expect(set).toContain('Secure')
    expect(set.toLowerCase()).not.toContain('httponly')

    const clear = sessionHintClearCookieString({ secure: true })
    expect(clear).toContain(`${SESSION_HINT_COOKIE}=`)
    expect(clear).toContain('Max-Age=0')
    expect(clear).toContain('Secure')
  })

  it('omits Secure when not requested', () => {
    expect(
      sessionHintSetCookieString({ maxAgeSeconds: 10, secure: false }),
    ).not.toContain('Secure')
  })
})

describe('syncSessionHintFromSession', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('clears the hint when get-session resolves to null', () => {
    const writes: string[] = []
    vi.stubGlobal('document', {
      get cookie() {
        return writes.at(-1) ?? `${SESSION_HINT_COOKIE}=1`
      },
      set cookie(value: string) {
        writes.push(value)
      },
    })

    syncSessionHintFromSession(null)

    expect(writes.some((value) => value.includes('Max-Age=0'))).toBe(true)
    expect(hasSessionHintCookie(writes.at(-1))).toBe(false)
  })

  it('sets Max-Age from session expiry when a session is present', () => {
    const writes: string[] = []
    vi.stubGlobal('document', {
      get cookie() {
        return writes.at(-1) ?? ''
      },
      set cookie(value: string) {
        writes.push(value)
      },
    })

    const expiresAt = new Date(Date.now() + 60_000)
    syncSessionHintFromSession({ expiresAt })

    const written = writes.at(-1) ?? ''
    expect(written).toContain(`${SESSION_HINT_COOKIE}=${SESSION_HINT_VALUE}`)
    const maxAge = Number(/Max-Age=(\d+)/.exec(written)?.[1])
    expect(maxAge).toBeGreaterThan(0)
    expect(maxAge).toBeLessThanOrEqual(60)
  })

  it('clearSessionHintCookie and setSessionHintCookie are no-ops without document', () => {
    vi.stubGlobal('document', undefined)
    expect(() => clearSessionHintCookie()).not.toThrow()
    expect(() => setSessionHintCookie({ maxAgeSeconds: 1 })).not.toThrow()
  })
})

describe('maxAgeSecondsUntil', () => {
  it('floors to at least one second', () => {
    expect(maxAgeSecondsUntil(Date.now() - 10_000)).toBe(1)
  })
})
