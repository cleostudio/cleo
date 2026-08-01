import { afterEach, describe, expect, it } from 'vitest'

import {
  getBetterAuthSecret,
  getBetterAuthUrl,
  isAuthConfigured,
  resetAuthForTests,
} from '~/lib/auth'
import { resetDbForTests } from '~/lib/db'

const keys = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'PUBLIC_SITE_URL',
  'SITE_URL',
  'VERCEL_URL',
] as const

const previous = new Map<string, string | undefined>()

function stashEnv() {
  for (const key of keys) {
    previous.set(key, process.env[key])
    delete process.env[key]
  }
  resetAuthForTests()
  resetDbForTests()
}

function restoreEnv() {
  for (const key of keys) {
    const value = previous.get(key)
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  resetAuthForTests()
  resetDbForTests()
}

afterEach(() => {
  restoreEnv()
})

describe('auth env helpers', () => {
  it('reports unconfigured when database or secret is missing', () => {
    stashEnv()
    expect(isAuthConfigured()).toBe(false)

    process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
    expect(isAuthConfigured()).toBe(false)

    process.env.BETTER_AUTH_SECRET = 'short'
    expect(isAuthConfigured()).toBe(false)
  })

  it('reports configured when Neon URL and long secret are set', () => {
    stashEnv()
    process.env.DATABASE_URL = 'postgresql://user:pass@host/db'
    process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
    expect(isAuthConfigured()).toBe(true)
    expect(getBetterAuthSecret()).toHaveLength(32)
  })

  it('accepts legacy POSTGRES_URL from Marketplace templates', () => {
    stashEnv()
    process.env.POSTGRES_URL = 'postgresql://user:pass@host/db'
    process.env.BETTER_AUTH_SECRET = 'b'.repeat(40)
    expect(isAuthConfigured()).toBe(true)
  })

  it('resolves base URL from BETTER_AUTH_URL then site URL then Vercel', () => {
    stashEnv()
    expect(getBetterAuthUrl()).toBe('http://localhost:3000')

    process.env.VERCEL_URL = 'preview.example.vercel.app'
    expect(getBetterAuthUrl()).toBe('https://preview.example.vercel.app')

    process.env.PUBLIC_SITE_URL = 'https://cleoalpha.vercel.app'
    expect(getBetterAuthUrl()).toBe('https://cleoalpha.vercel.app')

    process.env.BETTER_AUTH_URL = 'https://auth.example.com'
    expect(getBetterAuthUrl()).toBe('https://auth.example.com')
  })
})
