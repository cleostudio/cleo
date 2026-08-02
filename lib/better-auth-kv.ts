/**
 * Better Auth Infrastructure KV / Sentinel identify URL helpers.
 *
 * The project-scoped ingestion URL
 * (`https://kv.better-auth.com/projects/{id}`) is a public endpoint — not a
 * secret. Copy it from dash.better-auth.com → project settings.
 */

/** Strip a trailing slash so `/projects/{id}` matching stays stable. */
export function normalizeIdentifyUrl(url: string): string {
  return url.trim().replace(/\/$/, '')
}

/**
 * True when the URL targets project-scoped ingestion
 * (e.g. `https://kv.better-auth.com/projects/{id}`).
 */
export function isProjectScopedIdentifyUrl(url: string): boolean {
  const normalized = normalizeIdentifyUrl(url)
  try {
    const pathname = new URL(normalized).pathname
    return /^\/projects\/[^/]+$/.test(pathname)
  } catch {
    return /\/projects\/[^/]+$/.test(normalized)
  }
}

/**
 * Browser Sentinel identify base from `NEXT_PUBLIC_BETTER_AUTH_KV_URL`.
 * Returns `undefined` when unset so `@better-auth/infra` can fall back to the
 * global default (and warn).
 */
export function getSentinelIdentifyUrl(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): string | undefined {
  const raw = env.NEXT_PUBLIC_BETTER_AUTH_KV_URL?.trim()
  if (!raw) return undefined
  return normalizeIdentifyUrl(raw)
}
