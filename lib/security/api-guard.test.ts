import { describe, expect, it } from 'vitest'

import { createApiGuard } from './api-guard'

const CONFIGURED_ORIGIN = 'https://cleo.example'

function guard(options: Parameters<typeof createApiGuard>[0] = {}) {
  return createApiGuard({ configuredOrigin: CONFIGURED_ORIGIN, ...options })
}

/** An empty override value drops that header, standing in for a client that omits it. */
function askRequest(overrides: Record<string, string> = {}) {
  const headers = new Headers({
    'sec-fetch-site': 'same-origin',
    'x-vercel-forwarded-for': '203.0.113.4',
  })

  for (const [key, value] of Object.entries(overrides)) {
    if (value) {
      headers.set(key, value)
    } else {
      headers.delete(key)
    }
  }

  return new Request('https://cleo.example/api/responses', {
    headers,
    method: 'POST',
  })
}

describe('Cleo API guard: origin', () => {
  it('lets a same-origin browser request through', () => {
    expect(guard().screen(askRequest())).toBeNull()
  })

  it('lets a request from the configured origin through', () => {
    expect(
      guard().screen(
        askRequest({ origin: CONFIGURED_ORIGIN, 'sec-fetch-site': '' }),
      ),
    ).toBeNull()
  })

  it('rejects a request posted from another site', async () => {
    const response = guard().screen(
      askRequest({ 'sec-fetch-site': 'cross-site' }),
    )

    expect(response?.status).toBe(403)
    await expect(response?.json()).resolves.toEqual({
      error: 'This endpoint only serves the Cleo site.',
    })
  })

  it('rejects a foreign Origin header when fetch metadata is absent', () => {
    expect(
      guard().screen(
        askRequest({ origin: 'https://attacker.example', 'sec-fetch-site': '' }),
      )?.status,
    ).toBe(403)
  })
})

describe('Cleo API guard: body size', () => {
  it('rejects a declared body larger than the ceiling before it is read', async () => {
    const response = guard({ maxBodyBytes: 1024 }).screen(
      askRequest({ 'content-length': String(1024 * 1024) }),
    )

    expect(response?.status).toBe(413)
    await expect(response?.json()).resolves.toEqual({
      error: 'Requests must be 1KB or smaller. Send fewer or smaller images.',
    })
  })

  it('allows a body within the ceiling', () => {
    expect(
      guard({ maxBodyBytes: 1024 }).screen(
        askRequest({ 'content-length': '512' }),
      ),
    ).toBeNull()
  })

  it('ignores a missing or unparseable content length', () => {
    expect(
      guard({ maxBodyBytes: 1024 }).screen(
        askRequest({ 'content-length': 'chunked' }),
      ),
    ).toBeNull()
  })
})

describe('Cleo API guard: throttling', () => {
  it('throttles a caller past the burst limit with a Retry-After header', () => {
    const throttled = guard({ burst: { limit: 2, windowMs: 20_000 } })

    expect(throttled.screen(askRequest())).toBeNull()
    expect(throttled.screen(askRequest())).toBeNull()

    const response = throttled.screen(askRequest())

    expect(response?.status).toBe(429)
    expect(response?.headers.get('retry-after')).toBe('20')
  })

  it('explains the wait in the message the chat surfaces', async () => {
    const throttled = guard({ burst: { limit: 1, windowMs: 20_000 } })

    throttled.screen(askRequest())

    await expect(throttled.screen(askRequest())?.json()).resolves.toEqual({
      error: 'Too many requests. Try again in 20 seconds.',
    })
  })

  it('rounds a long wait up to whole minutes', async () => {
    const throttled = guard({
      burst: { limit: 1, windowMs: 90_000 },
      hourly: { limit: 1, windowMs: 90_000 },
    })

    throttled.screen(askRequest())

    await expect(throttled.screen(askRequest())?.json()).resolves.toEqual({
      error: 'Too many requests. Try again in 2 minutes.',
    })
  })

  it('throttles each client address independently', () => {
    const throttled = guard({ burst: { limit: 1, windowMs: 20_000 } })

    expect(
      throttled.screen(askRequest({ 'x-vercel-forwarded-for': '203.0.113.1' })),
    ).toBeNull()
    expect(
      throttled.screen(askRequest({ 'x-vercel-forwarded-for': '203.0.113.2' })),
    ).toBeNull()
    expect(
      throttled.screen(askRequest({ 'x-vercel-forwarded-for': '203.0.113.1' }))
        ?.status,
    ).toBe(429)
  })

  it('falls back to the user agent when no address header is forwarded', () => {
    const throttled = guard({ burst: { limit: 1, windowMs: 20_000 } })
    const anonymous = (agent: string) =>
      new Request('https://cleo.example/api/responses', {
        headers: { 'sec-fetch-site': 'same-origin', 'user-agent': agent },
        method: 'POST',
      })

    expect(throttled.screen(anonymous('browser-a'))).toBeNull()
    expect(throttled.screen(anonymous('browser-b'))).toBeNull()
    expect(throttled.screen(anonymous('browser-a'))?.status).toBe(429)
  })

  it('screens origin before spending a throttle allowance', () => {
    const throttled = guard({ burst: { limit: 1, windowMs: 20_000 } })

    expect(
      throttled.screen(askRequest({ 'sec-fetch-site': 'cross-site' }))?.status,
    ).toBe(403)
    expect(throttled.screen(askRequest())).toBeNull()
  })
})

describe('Cleo API guard: concurrency', () => {
  it('stops handing out slots once the instance is saturated', () => {
    const limited = guard({ concurrency: 2 })
    const first = limited.acquireSlot()
    const second = limited.acquireSlot()

    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(limited.acquireSlot()).toBeNull()

    first?.()

    expect(limited.acquireSlot()).not.toBeNull()
  })
})
