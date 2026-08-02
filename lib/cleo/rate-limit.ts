/**
 * Best-effort sliding-window rate limit for public Cleo API turns.
 *
 * Keyed in-process (per warm isolate on Vercel). Not a global quota — still
 * stops burst abuse against a single instance before OpenAI is called.
 */

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number }

type Bucket = {
  /** Request timestamps (ms) inside the current window. */
  hits: number[]
}

const buckets = new Map<string, Bucket>()

/** Default: 12 turns / minute per client key (IP or anonymous). */
export const CLEO_RATE_LIMIT_WINDOW_MS = 60_000
export const CLEO_RATE_LIMIT_MAX = 12

export function resetCleoRateLimitForTests() {
  buckets.clear()
}

/**
 * Resolve a stable client key from common proxy headers. Falls back to
 * `anonymous` when nothing trustworthy is present.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 128)
  }

  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp.slice(0, 128)

  const vercelForwarded = headers.get('x-vercel-forwarded-for')
  if (vercelForwarded) {
    const first = vercelForwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 128)
  }

  return 'anonymous'
}

export function checkCleoRateLimit(
  key: string,
  now = Date.now(),
  options: {
    windowMs?: number
    max?: number
  } = {},
): RateLimitResult {
  const windowMs = options.windowMs ?? CLEO_RATE_LIMIT_WINDOW_MS
  const max = options.max ?? CLEO_RATE_LIMIT_MAX
  const bucketKey = key.trim() || 'anonymous'
  const cutoff = now - windowMs
  const bucket = buckets.get(bucketKey) ?? { hits: [] }

  bucket.hits = bucket.hits.filter((stamp) => stamp > cutoff)

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0] ?? now
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000),
    )
    buckets.set(bucketKey, bucket)
    return { ok: false, retryAfterSeconds }
  }

  bucket.hits.push(now)
  buckets.set(bucketKey, bucket)

  // Bound map growth in long-lived isolates.
  if (buckets.size > 10_000) {
    for (const [entryKey, entry] of buckets) {
      entry.hits = entry.hits.filter((stamp) => stamp > cutoff)
      if (entry.hits.length === 0) buckets.delete(entryKey)
    }
  }

  return { ok: true, remaining: Math.max(0, max - bucket.hits.length) }
}
