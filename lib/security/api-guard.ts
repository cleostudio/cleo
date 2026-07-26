import { clientAddress } from './client-address'
import { allowedRequestOrigins, classifyRequestOrigin } from './request-origin'
import {
  type ConcurrencyGate,
  createConcurrencyGate,
  createRateLimiter,
  type RateLimiter,
  type RateLimitRule,
} from './rate-limit'

/**
 * Abuse and cost controls for the Cleo Responses endpoint.
 *
 * `POST /api/responses` is unauthenticated and bills OpenAI on every call, so
 * it is the one route where an anonymous caller can spend money. The guard
 * layers three cheap checks in front of that spend: reject requests a browser
 * on this deployment could not have made, reject bodies too large to be a real
 * conversation, and throttle per client. A per-instance concurrency gate then
 * bounds how fast any single instance can fan out to OpenAI.
 */

/** Comfortably above a person asking follow-up questions in conversation. */
const DEFAULT_BURST: RateLimitRule = { limit: 5, windowMs: 20_000 }
const DEFAULT_HOURLY: RateLimitRule = { limit: 60, windowMs: 60 * 60_000 }
const DEFAULT_CONCURRENCY = 16
/**
 * Coarse outer bound so an oversized body is rejected before it is buffered.
 * `MAX_TOTAL_IMAGE_BYTES` is the precise limit, and base64 inflates payloads by
 * a third, so this sits above what a maximal legitimate request encodes to.
 */
const DEFAULT_MAX_BODY_BYTES = 9 * 1024 * 1024

export type ApiGuard = {
  /** Returns a response to send back, or null when the request may proceed. */
  screen: (request: Request) => Response | null
  /** Returns an idempotent release callback, or null when saturated. */
  acquireSlot: () => (() => void) | null
}

export type ApiGuardOptions = {
  burst?: RateLimitRule
  concurrency?: number
  configuredOrigin?: string
  hourly?: RateLimitRule
  maxBodyBytes?: number
  now?: () => number
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function guardResponse(error: string, status: number, headers?: HeadersInit) {
  return Response.json({ error }, { headers, status })
}

function formatBytes(bytes: number) {
  const megabytes = bytes / (1024 * 1024)

  return megabytes >= 1
    ? `${Math.round(megabytes)}MB`
    : `${Math.round(bytes / 1024)}KB`
}

function formatDelay(seconds: number) {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'}`
  }

  const minutes = Math.ceil(seconds / 60)

  return `${minutes} minute${minutes === 1 ? '' : 's'}`
}

/**
 * Bucket key for throttling. Falling back to the user agent keeps deployments
 * without forwarded-address headers from sharing one bucket, where a single
 * client could otherwise lock out everyone else.
 */
function throttleKey(request: Request) {
  const address = clientAddress(request.headers)

  if (address) {
    return `ip:${address}`
  }

  return `ua:${request.headers.get('user-agent')?.slice(0, 100) ?? 'unknown'}`
}

export function createApiGuard({
  burst = DEFAULT_BURST,
  concurrency = DEFAULT_CONCURRENCY,
  configuredOrigin,
  hourly = DEFAULT_HOURLY,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  now,
}: ApiGuardOptions = {}): ApiGuard {
  const limiter: RateLimiter = createRateLimiter({
    now,
    rules: [burst, hourly],
  })
  const gate: ConcurrencyGate = createConcurrencyGate(concurrency)

  return {
    acquireSlot: () => gate.acquire(),
    screen(request) {
      const verdict = classifyRequestOrigin(
        request,
        allowedRequestOrigins(request, configuredOrigin),
      )

      if (verdict === 'cross-origin') {
        return guardResponse('This endpoint only serves the Cleo site.', 403)
      }

      const declaredBytes = Number(request.headers.get('content-length'))

      if (Number.isFinite(declaredBytes) && declaredBytes > maxBodyBytes) {
        return guardResponse(
          `Requests must be ${formatBytes(maxBodyBytes)} or smaller. Send fewer or smaller images.`,
          413,
        )
      }

      const decision = limiter.consume(throttleKey(request))

      if (!decision.allowed) {
        return guardResponse(
          `Too many requests. Try again in ${formatDelay(decision.retryAfterSeconds)}.`,
          429,
          { 'Retry-After': String(decision.retryAfterSeconds) },
        )
      }

      return null
    },
  }
}

let cached: ApiGuard | null = null

/**
 * Shared guard for the Cleo endpoint. Built on first use so limits come from
 * the runtime environment rather than the build.
 */
export function cleoApiGuard(): ApiGuard {
  cached ??= createApiGuard({
    burst: {
      limit: positiveInteger(
        process.env.CLEO_RATE_LIMIT_BURST,
        DEFAULT_BURST.limit,
      ),
      windowMs:
        positiveInteger(
          process.env.CLEO_RATE_LIMIT_BURST_WINDOW_SECONDS,
          DEFAULT_BURST.windowMs / 1000,
        ) * 1000,
    },
    concurrency: positiveInteger(
      process.env.CLEO_MAX_CONCURRENT_STREAMS,
      DEFAULT_CONCURRENCY,
    ),
    configuredOrigin:
      process.env.PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim(),
    hourly: {
      limit: positiveInteger(
        process.env.CLEO_RATE_LIMIT_HOURLY,
        DEFAULT_HOURLY.limit,
      ),
      windowMs: DEFAULT_HOURLY.windowMs,
    },
  })

  return cached
}
