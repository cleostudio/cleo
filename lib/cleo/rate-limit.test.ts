import { afterEach, describe, expect, it } from 'vitest'

import {
  checkCleoRateLimit,
  clientKeyFromHeaders,
  resetCleoRateLimitForTests,
} from './rate-limit'

afterEach(() => {
  resetCleoRateLimitForTests()
})

describe('clientKeyFromHeaders', () => {
  it('prefers the first x-forwarded-for hop', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.9, 10.0.0.1',
      'x-real-ip': '198.51.100.2',
    })
    expect(clientKeyFromHeaders(headers)).toBe('203.0.113.9')
  })

  it('falls back to x-real-ip, then anonymous', () => {
    expect(
      clientKeyFromHeaders(new Headers({ 'x-real-ip': '198.51.100.2' })),
    ).toBe('198.51.100.2')
    expect(clientKeyFromHeaders(new Headers())).toBe('anonymous')
  })
})

describe('checkCleoRateLimit', () => {
  it('allows traffic under the cap and rejects the overflow', () => {
    const start = 1_000_000
    for (let i = 0; i < 3; i++) {
      expect(
        checkCleoRateLimit('client-a', start + i, { max: 3, windowMs: 1_000 }),
      ).toMatchObject({ ok: true })
    }

    const blocked = checkCleoRateLimit('client-a', start + 3, {
      max: 3,
      windowMs: 1_000,
    })
    expect(blocked).toEqual({ ok: false, retryAfterSeconds: 1 })
  })

  it('tracks clients independently and expires with the window', () => {
    const start = 2_000_000
    expect(
      checkCleoRateLimit('client-a', start, { max: 1, windowMs: 100 }),
    ).toMatchObject({ ok: true })
    expect(
      checkCleoRateLimit('client-b', start, { max: 1, windowMs: 100 }),
    ).toMatchObject({ ok: true })
    expect(
      checkCleoRateLimit('client-a', start + 1, { max: 1, windowMs: 100 }),
    ).toMatchObject({ ok: false })
    expect(
      checkCleoRateLimit('client-a', start + 101, { max: 1, windowMs: 100 }),
    ).toMatchObject({ ok: true })
  })
})
