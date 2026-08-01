import { describe, expect, it } from 'vitest'

import { allowedRequestOrigins, classifyRequestOrigin } from './request-origin'

const request = (headers: Record<string, string> = {}) =>
  new Request('https://cleo.example/api/responses', { headers, method: 'POST' })

describe('allowedRequestOrigins', () => {
  it('accepts the configured origin and the deployment the request arrived on', () => {
    const origins = allowedRequestOrigins(
      new Request('https://internal.local/api/responses', {
        headers: {
          'x-forwarded-host': 'cleo-preview.vercel.app',
          'x-forwarded-proto': 'https',
        },
        method: 'POST',
      }),
      'https://cleo.example',
    )

    expect(origins).toContain('https://cleo.example')
    expect(origins).toContain('https://cleo-preview.vercel.app')
    expect(origins).toContain('https://internal.local')
  })

  it('ignores a configured origin that is not a URL', () => {
    expect(allowedRequestOrigins(request(), 'not a url')).not.toContain(
      'not a url',
    )
  })
})

describe('classifyRequestOrigin', () => {
  it('trusts a same-origin fetch metadata label', () => {
    expect(
      classifyRequestOrigin(request({ 'sec-fetch-site': 'same-origin' }), []),
    ).toBe('same-origin')
  })

  it.each(['cross-site', 'same-site', 'none'])(
    'treats sec-fetch-site %s as cross-origin',
    (value) => {
      expect(classifyRequestOrigin(request({ 'sec-fetch-site': value }), [])).toBe(
        'cross-origin',
      )
    },
  )

  it('falls back to the Origin header when fetch metadata is absent', () => {
    expect(
      classifyRequestOrigin(request({ origin: 'https://cleo.example' }), [
        'https://cleo.example',
      ]),
    ).toBe('same-origin')

    expect(
      classifyRequestOrigin(request({ origin: 'https://attacker.example' }), [
        'https://cleo.example',
      ]),
    ).toBe('cross-origin')
  })

  it('rejects an Origin header that is not a URL', () => {
    expect(classifyRequestOrigin(request({ origin: 'null' }), [])).toBe(
      'cross-origin',
    )
  })

  it('reports unknown when neither header is present', () => {
    expect(classifyRequestOrigin(request(), ['https://cleo.example'])).toBe(
      'unknown',
    )
  })
})
