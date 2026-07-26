/**
 * In-process throttling primitives for public API routes.
 *
 * Counters live in the running serverless instance, so a limit applies per
 * instance rather than globally. That is deliberate: hosted rate limiting can
 * only be configured in a dashboard, and `docs/security/baseline.md` requires
 * controls that stay effective from what is committed here. Warm instance
 * reuse means sustained abuse from one client still converges on the limit,
 * and the concurrency gate bounds spend per instance regardless of key.
 */

export type RateLimitRule = {
  /** Requests allowed inside one window. */
  limit: number
  windowMs: number
}

export type RateLimitDecision = {
  allowed: boolean
  /** Requests left against the tightest rule, after this call. */
  remaining: number
  retryAfterSeconds: number
}

export type RateLimiter = {
  consume: (key: string) => RateLimitDecision
  size: () => number
}

type CountWindow = { count: number; startedAt: number }

type Entry = { seenAt: number; windows: CountWindow[] }

const DEFAULT_MAX_KEYS = 10_000

/**
 * Fixed-window limiter over an LRU-bounded key map.
 *
 * The map is bounded so that a flood of unique keys cannot grow it without
 * limit. Keys are re-inserted on every call, which keeps JavaScript's
 * insertion order equal to least-recently-seen order and, importantly, keeps
 * an actively throttled key resident instead of evicting it into a fresh
 * quota.
 */
export function createRateLimiter({
  rules,
  maxKeys = DEFAULT_MAX_KEYS,
  now = Date.now,
}: {
  rules: readonly RateLimitRule[]
  maxKeys?: number
  now?: () => number
}): RateLimiter {
  if (rules.length === 0) {
    throw new Error('A rate limiter needs at least one rule.')
  }

  const entries = new Map<string, Entry>()
  const longestWindowMs = Math.max(...rules.map((rule) => rule.windowMs))
  let prunedAt = now()

  const prune = (timestamp: number) => {
    if (timestamp - prunedAt < longestWindowMs) {
      return
    }

    prunedAt = timestamp

    for (const [key, entry] of entries) {
      if (timestamp - entry.seenAt < longestWindowMs) {
        // Iteration follows least-recently-seen order, so every later entry
        // is at least this fresh.
        break
      }

      entries.delete(key)
    }
  }

  return {
    consume(key) {
      const timestamp = now()

      prune(timestamp)

      const existing = entries.get(key)

      if (existing) {
        entries.delete(key)
      } else {
        while (entries.size >= maxKeys) {
          const oldest = entries.keys().next()

          if (oldest.done) {
            break
          }

          entries.delete(oldest.value)
        }
      }

      const windows =
        existing?.windows ??
        rules.map(() => ({ count: 0, startedAt: timestamp }))

      let remaining = Number.POSITIVE_INFINITY
      let retryAfterMs = 0

      rules.forEach((rule, index) => {
        const window = windows[index] as CountWindow

        if (timestamp - window.startedAt >= rule.windowMs) {
          window.count = 0
          window.startedAt = timestamp
        }

        if (window.count >= rule.limit) {
          retryAfterMs = Math.max(
            retryAfterMs,
            window.startedAt + rule.windowMs - timestamp,
          )
        }

        remaining = Math.min(remaining, rule.limit - window.count)
      })

      const allowed = retryAfterMs === 0

      if (allowed) {
        // A blocked call must not extend the window it is blocked by, so only
        // successful calls count.
        for (const window of windows) {
          window.count += 1
        }

        remaining -= 1
      }

      entries.set(key, { seenAt: timestamp, windows })

      return {
        allowed,
        remaining: Math.max(0, remaining),
        retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil(retryAfterMs / 1000)),
      }
    },
    size: () => entries.size,
  }
}

export type ConcurrencyGate = {
  /** Returns an idempotent release callback, or null when saturated. */
  acquire: () => (() => void) | null
  active: () => number
}

/** Caps simultaneous in-flight work so one instance cannot fan out unbounded. */
export function createConcurrencyGate(limit: number): ConcurrencyGate {
  let active = 0

  return {
    acquire() {
      if (active >= limit) {
        return null
      }

      active += 1
      let released = false

      return () => {
        if (released) {
          return
        }

        released = true
        active -= 1
      }
    },
    active: () => active,
  }
}
