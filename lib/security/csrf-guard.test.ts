import { describe, expect, it } from 'vitest'

import { screenCsrf } from './csrf-guard'

const CONFIGURED_ORIGIN = 'https://cleo.example'

function askRequest(headers: Record<string, string> = {}) {
  return new Request('https://cleo.example/api/responses', {
    headers: {
      'sec-fetch-site': 'same-origin',
      ...headers,
    },
    method: 'POST',
  })
}

describe('screenCsrf', () => {
  it('lets a same-origin browser request through', () => {
    expect(
      screenCsrf(askRequest(), { configuredOrigin: CONFIGURED_ORIGIN }),
    ).toBeNull()
  })

  it('lets a request from the configured Origin through when fetch metadata is absent', () => {
    expect(
      screenCsrf(askRequest({ origin: CONFIGURED_ORIGIN, 'sec-fetch-site': '' }), {
        configuredOrigin: CONFIGURED_ORIGIN,
      }),
    ).toBeNull()
  })

  it('rejects cross-site fetch metadata', async () => {
    const response = screenCsrf(
      askRequest({ 'sec-fetch-site': 'cross-site' }),
      { configuredOrigin: CONFIGURED_ORIGIN },
    )
    expect(response?.status).toBe(403)
    await expect(response?.json()).resolves.toEqual({
      error: 'This endpoint only serves the Cleo site.',
    })
  })

  it('rejects an attacker Origin when fetch metadata is absent', () => {
    expect(
      screenCsrf(
        askRequest({
          origin: 'https://attacker.example',
          'sec-fetch-site': '',
        }),
        { configuredOrigin: CONFIGURED_ORIGIN },
      )?.status,
    ).toBe(403)
  })

  it('allows unlabelled non-browser requests (unknown)', () => {
    expect(
      screenCsrf(
        new Request('https://cleo.example/api/responses', { method: 'POST' }),
        { configuredOrigin: CONFIGURED_ORIGIN },
      ),
    ).toBeNull()
  })
})
