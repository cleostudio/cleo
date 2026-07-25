import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('public site origin', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('defaults production discovery to the alpha deploy when unset', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SITE_URL', 'https://staging.example.com')
    vi.stubEnv('PUBLIC_SITE_URL', '')

    const { seo } = await import('./seo')

    expect(seo.url.href).toBe('https://cleoalpha.vercel.app/')
  })

  it('accepts an explicit public site origin independently of the runtime origin', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PUBLIC_SITE_URL', 'https://example.com')
    vi.stubEnv('SITE_URL', 'https://staging.example.com')

    const { seo } = await import('./seo')

    expect(seo.url.href).toBe('https://example.com/')
  })

  it('rejects an insecure non-local public site origin', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PUBLIC_SITE_URL', 'http://example.com')

    await expect(import('./seo')).rejects.toThrowError(/PUBLIC_SITE_URL/)
  })

  it('names a malformed public site origin in the startup error', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PUBLIC_SITE_URL', 'not-a-url')

    await expect(import('./seo')).rejects.toThrowError(/PUBLIC_SITE_URL/)
  })
})
