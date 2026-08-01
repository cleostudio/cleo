/**
 * Stage 0 prototype: non-httpOnly hint that JS can read before calling
 * Better Auth's useSession(). Without this cookie, signed-out visitors skip
 * the /api/auth/get-session round-trip.
 *
 * Real session tokens stay httpOnly (Better Auth). This hint is only a
 * "maybe signed in" signal — never authoritative.
 */
export const SESSION_HINT_COOKIE = 'cleo.session-hint'

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
