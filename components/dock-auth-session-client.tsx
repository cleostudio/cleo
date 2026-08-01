'use client'

import { useEffect, useState } from 'react'

import { useSession } from '~/lib/auth-client'
import { hasSessionHintCookie } from '~/lib/auth-session-hint'

/**
 * Stage 0: Client Component session read via `useSession()`.
 *
 * Gated behind a non-httpOnly hint cookie so signed-out visitors do not
 * pay for `/api/auth/get-session` on every page load. Better Auth's
 * useSession always fetches on mount — so we must not mount it at all
 * when the hint is absent.
 */
export function DockAuthSessionClient() {
  const [hint, setHint] = useState<'unknown' | 'absent' | 'present'>('unknown')

  useEffect(() => {
    setHint(hasSessionHintCookie() ? 'present' : 'absent')
  }, [])

  if (hint === 'unknown') {
    return (
      <span data-stage0-auth-client="hint-pending" className="sr-only">
        hint pending
      </span>
    )
  }

  if (hint === 'absent') {
    return (
      <span data-stage0-auth-client="signed-out-no-hint" className="sr-only">
        signed-out-no-hint
      </span>
    )
  }

  return <DockAuthSessionClientLive />
}

function DockAuthSessionClientLive() {
  const { data, isPending } = useSession()
  const state = isPending ? 'pending' : data ? 'signed-in' : 'signed-out'

  return (
    <span data-stage0-auth-client={state} className="sr-only">
      {state}
    </span>
  )
}
