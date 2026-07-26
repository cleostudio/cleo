import { describe, expect, it } from 'vitest'

import { clientAddress } from './client-address'

const headers = (init: Record<string, string>) => new Headers(init)

describe('clientAddress', () => {
  it('prefers the platform-controlled Vercel header over spoofable ones', () => {
    expect(
      clientAddress(
        headers({
          'x-forwarded-for': '10.0.0.1',
          'x-real-ip': '10.0.0.2',
          'x-vercel-forwarded-for': '203.0.113.7',
        }),
      ),
    ).toBe('203.0.113.7')
  })

  it('falls back through x-real-ip to x-forwarded-for', () => {
    expect(
      clientAddress(
        headers({ 'x-forwarded-for': '10.0.0.1', 'x-real-ip': '203.0.113.8' }),
      ),
    ).toBe('203.0.113.8')

    expect(clientAddress(headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe(
      '203.0.113.9',
    )
  })

  it('takes the client entry from a forwarding chain', () => {
    expect(
      clientAddress(
        headers({ 'x-forwarded-for': '203.0.113.10, 70.41.3.18, 150.172.238.178' }),
      ),
    ).toBe('203.0.113.10')
  })

  it('strips a port from an IPv4 address', () => {
    expect(clientAddress(headers({ 'x-real-ip': '203.0.113.11:54321' }))).toBe(
      '203.0.113.11',
    )
  })

  it('keeps a bare IPv6 address intact and unwraps a bracketed one', () => {
    expect(
      clientAddress(headers({ 'x-real-ip': '2001:db8::8a2e:370:7334' })),
    ).toBe('2001:db8::8a2e:370:7334')

    expect(
      clientAddress(headers({ 'x-real-ip': '[2001:db8::8a2e:370:7334]:443' })),
    ).toBe('2001:db8::8a2e:370:7334')
  })

  it('returns null when no address header carries a value', () => {
    expect(clientAddress(headers({}))).toBeNull()
    expect(clientAddress(headers({ 'x-forwarded-for': '   ' }))).toBeNull()
  })
})
