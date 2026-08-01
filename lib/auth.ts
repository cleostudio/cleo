import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { nextCookies } from 'better-auth/next-js'

import { userAdditionalFields } from '~/lib/auth-user-fields'
import { getDb, isDatabaseConfigured } from '~/lib/db'
import * as schema from '~/lib/db/auth-schema'

export function getBetterAuthSecret(): string {
  return process.env.BETTER_AUTH_SECRET?.trim() || ''
}

function hostFromUrlOrHost(value: string | undefined): string | null {
  const raw = value?.trim()
  if (!raw) return null
  try {
    if (raw.includes('://')) return new URL(raw).host
    return raw.replace(/^\/\//, '')
  } catch {
    return null
  }
}

/**
 * Fallback base URL when the request host is unknown.
 * Production should set BETTER_AUTH_URL to the live origin.
 */
export function getBetterAuthUrl(): string {
  return (
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_URL?.trim()
      ? `https://${process.env.VERCEL_URL.trim()}`
      : '') ||
    'http://localhost:3000'
  )
}

/**
 * Hosts Better Auth may mint cookies for / trust as Origin.
 * Includes `*.vercel.app` so Preview branch + deployment URLs both work.
 */
export function getAllowedAuthHosts(): string[] {
  const hosts = new Set<string>([
    'localhost',
    'localhost:*',
    '127.0.0.1',
    '127.0.0.1:*',
    '*.vercel.app',
  ])

  for (const value of [
    process.env.BETTER_AUTH_URL,
    process.env.PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    const host = hostFromUrlOrHost(value)
    if (host) hosts.add(host)
  }

  return [...hosts]
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
    user: {
      additionalFields: userAdditionalFields,
    },
    secret: getBetterAuthSecret(),
    // Dynamic base URL: Preview hosts differ from VERCEL_URL vs branch alias.
    // allowedHosts are also added to trustedOrigins (fixes "Invalid origin").
    baseURL: {
      allowedHosts: getAllowedAuthHosts(),
      fallback: getBetterAuthUrl(),
    },
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
