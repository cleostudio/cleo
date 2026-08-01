'use client'

import { useSession } from '~/lib/auth-client'

/**
 * Stage 0: Client Component session read via `useSession()`.
 * No RSC `headers()` — the documented fallback if Suspense RSC breaks
 * prerender classification.
 */
export function DockAuthSessionClient() {
  const { data, isPending } = useSession()
  const state = isPending ? 'pending' : data ? 'signed-in' : 'signed-out'

  return (
    <span data-stage0-auth-client={state} className="sr-only">
      {state}
    </span>
  )
}
