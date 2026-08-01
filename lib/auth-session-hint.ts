/**
 * Non-httpOnly hint that JS can read before mounting Better Auth's
 * `useSession()`. Without this cookie, signed-out visitors skip the
 * `/api/auth/get-session` round-trip.
 *
 * Real session tokens stay httpOnly (Better Auth). This hint is only a
 * "maybe signed in" signal — never authoritative, never read server-side.
 */
export const SESSION_HINT_COOKIE = 'cleo.session-hint'

export const SESSION_HINT_VALUE = '1'

/** Default Better Auth session lifetime (7 days), used when expiry is unknown. */
export const SESSION_HINT_DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type SessionHintCookieOptions = {
  maxAgeSeconds?: number
  secure?: boolean
}

export function hasSessionHintCookie(
  cookieSource: string | undefined = typeof document === 'undefined'
    ? undefined
    : document.cookie,
): boolean {
  if (!cookieSource) return false
  return cookieSource.split(';').some((part) => {
    const [rawName, ...rest] = part.trim().split('=')
    if (rawName !== SESSION_HINT_COOKIE) return false
    const value = rest.join('=').trim()
    return value !== '' && value !== '0'
  })
}

export function sessionHintSetCookieString(
  options: SessionHintCookieOptions = {},
): string {
  const maxAge = Math.max(
    1,
    Math.floor(options.maxAgeSeconds ?? SESSION_HINT_DEFAULT_MAX_AGE_SECONDS),
  )
  const secure =
    options.secure ??
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'production')
  const parts = [
    `${SESSION_HINT_COOKIE}=${SESSION_HINT_VALUE}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function sessionHintClearCookieString(
  options: Pick<SessionHintCookieOptions, 'secure'> = {},
): string {
  const secure =
    options.secure ??
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'production')
  const parts = [
    `${SESSION_HINT_COOKIE}=`,
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function maxAgeSecondsUntil(expiresAt: Date | string | number): number {
  const expiresMs =
    typeof expiresAt === 'number'
      ? expiresAt
      : typeof expiresAt === 'string'
        ? Date.parse(expiresAt)
        : expiresAt.getTime()
  if (!Number.isFinite(expiresMs)) return SESSION_HINT_DEFAULT_MAX_AGE_SECONDS
  return Math.max(1, Math.floor((expiresMs - Date.now()) / 1000))
}

/** Client-only: write the hint cookie. No-op on the server. */
export function setSessionHintCookie(
  options: SessionHintCookieOptions = {},
): void {
  if (typeof document === 'undefined') return
  document.cookie = sessionHintSetCookieString(options)
}

/** Client-only: clear the hint cookie. No-op on the server. */
export function clearSessionHintCookie(
  options: Pick<SessionHintCookieOptions, 'secure'> = {},
): void {
  if (typeof document === 'undefined') return
  document.cookie = sessionHintClearCookieString(options)
}

/**
 * Keep the hint aligned with a get-session result.
 * - session present → set / refresh Max-Age from expiry
 * - session null → clear (expired / revoked must not pay forever)
 */
export function syncSessionHintFromSession(
  session:
    | { expiresAt?: Date | string | number | null }
    | null
    | undefined,
): void {
  if (session == null) {
    clearSessionHintCookie()
    return
  }
  const maxAgeSeconds = session.expiresAt
    ? maxAgeSecondsUntil(session.expiresAt)
    : SESSION_HINT_DEFAULT_MAX_AGE_SECONDS
  setSessionHintCookie({ maxAgeSeconds })
}
