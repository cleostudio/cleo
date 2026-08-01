import { headers } from 'next/headers'

import { auth } from '~/lib/auth'

/**
 * Stage 0: Suspense-wrapped Server Component session read.
 * Calls `headers()` via Better Auth — the prerender risk under test.
 *
 * Result (Next.js 16.3.0-preview.9, cacheComponents): mounting this in
 * `SiteDocument` changes every previously-○ route to ◐ (Partial Prerender).
 * Routes stay prerendered with a static shell, but classification is not
 * identical to `main`. Kept unmounted; client `useSession` is the fallback.
 */
export async function DockAuthSessionRsc() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <span
      data-stage0-auth-rsc={session ? 'signed-in' : 'signed-out'}
      className="sr-only"
    >
      {session ? 'signed in' : 'signed out'}
    </span>
  )
}

export function DockAuthSessionRscFallback() {
  return (
    <span data-stage0-auth-rsc="fallback" className="sr-only">
      session loading
    </span>
  )
}
