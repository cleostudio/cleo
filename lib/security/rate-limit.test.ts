import { describe, expect, it } from 'vitest'

import { createConcurrencyGate, createRateLimiter } from './rate-limit'

function fakeClock(start = 1_000_000) {
  let current = start

  return {
    advance: (ms: number) => {
      current += ms
    },
    now: () => current,
  }
}

describe('createRateLimiter', () => {
  it('allows a burst up to the limit and then blocks with a retry delay', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [{ limit: 3, windowMs: 10_000 }],
    })

    expect(limiter.consume('a').allowed).toBe(true)
    expect(limiter.consume('a').allowed).toBe(true)

    const last = limiter.consume('a')

    expect(last.allowed).toBe(true)
    expect(last.remaining).toBe(0)

    const blocked = limiter.consume('a')

    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBe(10)
  })

  it('keeps separate counters per key', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [{ limit: 1, windowMs: 10_000 }],
    })

    expect(limiter.consume('a').allowed).toBe(true)
    expect(limiter.consume('b').allowed).toBe(true)
    expect(limiter.consume('a').allowed).toBe(false)
  })

  it('does not let a blocked caller extend its own window', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [{ limit: 1, windowMs: 10_000 }],
    })

    limiter.consume('a')
    clock.advance(9_000)

    // Hammering while blocked must not push the reset further out.
    expect(limiter.consume('a').retryAfterSeconds).toBe(1)
    expect(limiter.consume('a').retryAfterSeconds).toBe(1)

    clock.advance(1_000)

    expect(limiter.consume('a').allowed).toBe(true)
  })

  it('reports the longest wait when several rules block', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [
        { limit: 2, windowMs: 10_000 },
        { limit: 2, windowMs: 60_000 },
      ],
    })

    limiter.consume('a')
    limiter.consume('a')

    expect(limiter.consume('a').retryAfterSeconds).toBe(60)
  })

  it('enforces a sustained rule after the burst window rolls over', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [
        { limit: 2, windowMs: 10_000 },
        { limit: 3, windowMs: 3_600_000 },
      ],
    })

    limiter.consume('a')
    limiter.consume('a')
    clock.advance(10_000)

    expect(limiter.consume('a').allowed).toBe(true)
    expect(limiter.consume('a').allowed).toBe(false)
  })

  it('bounds the key map so unique keys cannot grow it without limit', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      maxKeys: 10,
      now: clock.now,
      rules: [{ limit: 1, windowMs: 10_000 }],
    })

    for (let index = 0; index < 500; index += 1) {
      limiter.consume(`key-${index}`)
    }

    expect(limiter.size()).toBeLessThanOrEqual(10)
  })

  it('keeps a throttled key resident instead of evicting it into fresh quota', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      maxKeys: 4,
      now: clock.now,
      rules: [{ limit: 1, windowMs: 10_000 }],
    })

    limiter.consume('attacker')

    // A flood of unique keys must not reset the throttled key, which stays
    // recently seen because every blocked call refreshes it.
    for (let index = 0; index < 50; index += 1) {
      limiter.consume(`filler-${index}`)
      expect(limiter.consume('attacker').allowed).toBe(false)
    }
  })

  it('drops keys that have gone quiet for longer than the longest window', () => {
    const clock = fakeClock()
    const limiter = createRateLimiter({
      now: clock.now,
      rules: [{ limit: 5, windowMs: 10_000 }],
    })

    limiter.consume('a')
    expect(limiter.size()).toBe(1)

    clock.advance(20_000)
    limiter.consume('b')

    expect(limiter.size()).toBe(1)
  })

  it('rejects a limiter with no rules', () => {
    expect(() => createRateLimiter({ rules: [] })).toThrow()
  })
})

describe('createConcurrencyGate', () => {
  it('hands out slots up to the limit and refuses the rest', () => {
    const gate = createConcurrencyGate(2)

    expect(gate.acquire()).not.toBeNull()
    expect(gate.acquire()).not.toBeNull()
    expect(gate.acquire()).toBeNull()
    expect(gate.active()).toBe(2)
  })

  it('frees a slot once released', () => {
    const gate = createConcurrencyGate(1)
    const release = gate.acquire()

    expect(gate.acquire()).toBeNull()

    release?.()

    expect(gate.active()).toBe(0)
    expect(gate.acquire()).not.toBeNull()
  })

  it('ignores repeated releases so a slot cannot be returned twice', () => {
    const gate = createConcurrencyGate(1)
    const release = gate.acquire()

    release?.()
    release?.()
    release?.()

    expect(gate.active()).toBe(0)
    expect(gate.acquire()).not.toBeNull()
    expect(gate.acquire()).toBeNull()
  })
})
