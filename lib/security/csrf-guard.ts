import {
  allowedRequestOrigins,
  classifyRequestOrigin,
} from '~/lib/security/request-origin'

/**
 * CSRF screening for routes that carry ambient credentials (session cookies).
 *
 * Restores the origin / `Sec-Fetch-Site` half of the pre-`c120dc3` api-guard.
 * Rate limiting stays out — Stage 4 WAF / product decision in `c120dc3`.
 */

export type CsrfGuardOptions = {
  configuredOrigin?: string
}

function guardResponse(error: string, status: number) {
  return Response.json({ error }, { status })
}

/**
 * Returns a Response to reject the request, or null when it may proceed.
 *
 * - `sec-fetch-site: same-origin` → allow
 * - other `sec-fetch-site` values → reject
 * - no fetch metadata → fall back to `Origin` against allowed origins
 * - neither header → allow (non-browser clients; same as the recovered guard's
 *   `unknown` path when not combined with rate limiting)
 */
export function screenCsrf(
  request: Request,
  options: CsrfGuardOptions = {},
): Response | null {
  const configuredOrigin =
    options.configuredOrigin ??
    (process.env.PUBLIC_SITE_URL?.trim() ||
      process.env.SITE_URL?.trim() ||
      process.env.BETTER_AUTH_URL?.trim())

  const verdict = classifyRequestOrigin(
    request,
    allowedRequestOrigins(request, configuredOrigin),
  )

  if (verdict === 'cross-origin') {
    return guardResponse('This endpoint only serves the Cleo site.', 403)
  }

  return null
}
