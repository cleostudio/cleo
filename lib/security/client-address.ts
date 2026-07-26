/**
 * Only the `x-vercel-*` prefix is platform-controlled under every deployment
 * topology. Vercel overwrites `x-forwarded-for` and `x-real-ip` for traffic
 * that reaches it directly, but a client-supplied value can survive when an
 * unverified proxy fronts the deployment, so those stay as fallbacks.
 */
const ADDRESS_HEADERS = [
  'x-vercel-forwarded-for',
  'x-real-ip',
  'x-forwarded-for',
] as const

/** Drops a `host:port` suffix while leaving bare IPv6 addresses intact. */
function stripPort(value: string) {
  if (value.startsWith('[')) {
    const end = value.indexOf(']')

    return end === -1 ? value : value.slice(1, end)
  }

  const colon = value.indexOf(':')

  if (colon === -1 || value.indexOf(':', colon + 1) !== -1) {
    return value
  }

  return value.slice(0, colon)
}

/** Client IP from the most trustworthy header present, or null. */
export function clientAddress(headers: Headers): string | null {
  for (const header of ADDRESS_HEADERS) {
    const value = headers.get(header)

    if (!value) {
      continue
    }

    const first = value.split(',')[0]?.trim()

    if (!first) {
      continue
    }

    const address = stripPort(first).toLowerCase()

    if (address) {
      return address
    }
  }

  return null
}
