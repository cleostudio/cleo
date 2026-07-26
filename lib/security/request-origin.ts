export type RequestOriginVerdict = 'same-origin' | 'cross-origin' | 'unknown'

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Origins a browser on this deployment can legitimately post from.
 *
 * Preview deployments get generated hostnames that no environment variable
 * knows about, so the request's own forwarded host counts too.
 */
export function allowedRequestOrigins(
  request: Request,
  configuredOrigin?: string,
): string[] {
  const origins = new Set<string>()

  const add = (value: string | null | undefined) => {
    if (!value) {
      return
    }

    const origin = normalizeOrigin(value)

    if (origin) {
      origins.add(origin)
    }
  }

  add(configuredOrigin)
  add(request.url)

  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host')

  if (host) {
    const protocol = request.headers.get('x-forwarded-proto') ?? 'https'

    add(`${protocol}://${host}`)
  }

  return [...origins]
}

/**
 * Classifies where a request came from using `Sec-Fetch-Site` first and the
 * `Origin` header as a fallback.
 *
 * Returns `unknown` rather than guessing when neither header is present, so
 * callers can decide whether an unlabelled request is worth rejecting. Both
 * headers are absent only for non-browser clients and header-stripping
 * proxies, which rate limiting already covers.
 */
export function classifyRequestOrigin(
  request: Request,
  allowedOrigins: readonly string[],
): RequestOriginVerdict {
  const fetchSite = request.headers.get('sec-fetch-site')

  if (fetchSite === 'same-origin') {
    return 'same-origin'
  }

  // `none` means a user-initiated navigation, which cannot produce a POST from
  // the chat UI; `same-site` means another subdomain, which the site does not
  // use. Both are cross-origin as far as this endpoint is concerned.
  if (fetchSite) {
    return 'cross-origin'
  }

  const origin = request.headers.get('origin')

  if (!origin) {
    return 'unknown'
  }

  const normalized = normalizeOrigin(origin)

  if (!normalized) {
    return 'cross-origin'
  }

  return allowedOrigins.includes(normalized) ? 'same-origin' : 'cross-origin'
}
