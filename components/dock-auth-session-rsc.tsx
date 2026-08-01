import { headers } from 'next/headers'

import { auth } from '~/lib/auth'

/**
 * Stage 0: Suspense-wrapped Server Component session read.
 * Calls `headers()` via Better Auth — the prerender risk under test.
 *
 * SiteDocument mount: every previously-○ route → ◐.
 * /cleo-only mount (this follow-up): expect content routes to stay ○;
 * /cleo becoming ◐ is acceptable (○ → ƒ would be the failure).
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
