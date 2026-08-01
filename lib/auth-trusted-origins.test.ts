import { describe, expect, it } from 'vitest'

import {
  authBaseURLFromEnv,
  isProductionAuthEnv,
  trustedOriginsFromEnv,
} from './auth-trusted-origins'

describe('trustedOriginsFromEnv', () => {
  it('derives production and preview hosts from Vercel system env vars', () => {
    const origins = trustedOriginsFromEnv({
      VERCEL_ENV: 'preview',
      VERCEL_PROJECT_PRODUCTION_URL: 'cleoalpha.vercel.app',
      VERCEL_BRANCH_URL: 'cleo-git-feature-user.vercel.app',
      VERCEL_URL: 'cleo-abc123.vercel.app',
    })

    expect(origins).toEqual(
      expect.arrayContaining([
        'https://cleoalpha.vercel.app',
        'https://cleo-git-feature-user.vercel.app',
        'https://cleo-abc123.vercel.app',
        'http://localhost:*',
        'http://127.0.0.1:*',
      ]),
    )
  })

  it('never leaves localhost in a production list', () => {
    const origins = trustedOriginsFromEnv({
      NODE_ENV: 'production',
      VERCEL_ENV: 'production',
      VERCEL: '1',
      VERCEL_PROJECT_PRODUCTION_URL: 'cleoalpha.vercel.app',
      BETTER_AUTH_URL: 'http://localhost:3000',
      PUBLIC_SITE_URL: 'https://cleoalpha.vercel.app',
    })

    expect(origins.every((origin) => !origin.includes('localhost'))).toBe(true)
    expect(origins).toContain('https://cleoalpha.vercel.app')
  })
})

describe('authBaseURLFromEnv', () => {
  it('prefers BETTER_AUTH_URL, then production / branch hosts', () => {
    expect(
      authBaseURLFromEnv({
        BETTER_AUTH_URL: 'https://example.com/',
      }),
    ).toBe('https://example.com')

    expect(
      authBaseURLFromEnv({
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'cleoalpha.vercel.app',
      }),
    ).toBe('https://cleoalpha.vercel.app')
  })

  it('defaults to localhost outside production', () => {
    expect(isProductionAuthEnv({ NODE_ENV: 'development' })).toBe(false)
    expect(authBaseURLFromEnv({ NODE_ENV: 'development' })).toBe(
      'http://localhost:3000',
    )
  })
})
