/**
 * Better Auth `trustedOrigins` for production + Vercel preview hosts.
 *
 * Preview deployments have dynamic hostnames — derive from Vercel system env
 * vars rather than hardcoding. Never leave `localhost` in a production list.
 */
function originFromHostOrUrl(value: string | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim().replace(/\/$/, '')
  if (!trimmed) return null
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return new URL(trimmed).origin
    }
    return new URL(`https://${trimmed}`).origin
  } catch {
    return null
  }
}

function isLocalOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname === '::1'
    )
  } catch {
    return false
  }
}

type EnvLike = Record<string, string | undefined>

export function isProductionAuthEnv(env: EnvLike = process.env): boolean {
  if (env.VERCEL_ENV === 'production') return true
  if (env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development') {
    return false
  }
  return env.NODE_ENV === 'production'
}

export function trustedOriginsFromEnv(env: EnvLike = process.env): string[] {
  const origins = new Set<string>()

  const add = (value: string | undefined) => {
    const origin = originFromHostOrUrl(value)
    if (origin) origins.add(origin)
  }

  add(env.VERCEL_PROJECT_PRODUCTION_URL)
  add(env.VERCEL_BRANCH_URL)
  add(env.VERCEL_URL)
  add(env.BETTER_AUTH_URL)
  add(env.PUBLIC_SITE_URL)
  add(env.SITE_URL)

  const production = isProductionAuthEnv(env)
  if (!production) {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  const list = [...origins]
  return production ? list.filter((origin) => !isLocalOrigin(origin)) : list
}

export function authBaseURLFromEnv(env: EnvLike = process.env): string {
  const explicit = originFromHostOrUrl(env.BETTER_AUTH_URL)
  if (explicit) return explicit

  const productionHost = originFromHostOrUrl(env.VERCEL_PROJECT_PRODUCTION_URL)
  if (env.VERCEL_ENV === 'production' && productionHost) return productionHost

  const branch = originFromHostOrUrl(env.VERCEL_BRANCH_URL)
  if (branch) return branch

  const vercelUrl = originFromHostOrUrl(env.VERCEL_URL)
  if (vercelUrl) return vercelUrl

  const publicSite = originFromHostOrUrl(env.PUBLIC_SITE_URL)
  if (publicSite) return publicSite

  if (!isProductionAuthEnv(env)) return 'http://localhost:3000'

  throw new Error(
    'BETTER_AUTH_URL (or VERCEL_PROJECT_PRODUCTION_URL) is required in production',
  )
}
