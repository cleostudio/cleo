import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { nextCookies } from 'better-auth/next-js'

import { getDb, isDatabaseConfigured } from '~/lib/db'
import * as schema from '~/lib/db/auth-schema'

export function getBetterAuthSecret(): string {
  return process.env.BETTER_AUTH_SECRET?.trim() || ''
}

/** Base URL for Better Auth cookies and callbacks. */
export function getBetterAuthUrl(): string {
  return (
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.trim()}`
      : '') ||
    'http://localhost:3000'
  )
}

export function isAuthConfigured(): boolean {
  return (
    isDatabaseConfigured() &&
    getBetterAuthSecret().length >= 32
  )
}

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    secret: getBetterAuthSecret(),
    baseURL: getBetterAuthUrl(),
    plugins: [nextCookies()],
  })
}

export type Auth = ReturnType<typeof createAuth>

let authInstance: Auth | null = null

/** Lazy Better Auth instance. Throws when Neon / secret env is missing. */
export function getAuth(): Auth {
  if (!isAuthConfigured()) {
    throw new Error(
      'Auth is not configured. Set DATABASE_URL and BETTER_AUTH_SECRET (≥32 chars).',
    )
  }
  if (!authInstance) {
    authInstance = createAuth()
  }
  return authInstance
}

/** Reset cached auth (tests only). */
export function resetAuthForTests(): void {
  authInstance = null
}

/**
 * Server-side session helper for RSC / Route Handlers / Server Actions.
 * Returns null when auth env is missing or there is no session.
 */
export async function getSession(headers: Headers) {
  if (!isAuthConfigured()) return null
  return getAuth().api.getSession({ headers })
}
