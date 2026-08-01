'use client'

import { ThreadSession } from '~/components/cleo/thread-session'
import type { AskFormMessage } from '~/components/cleo/ask-form'
import type { StoredThreadMeta } from '~/lib/cleo/thread-store'

/**
 * `/cleo` shell. Thread identity and hydration are owned by `ThreadSession`.
 * When `signedIn` is true, persistence is Postgres; otherwise Stage 1 IndexedDB.
 */
export function CleoPageView({
  signedIn = false,
  initialServerThreads,
  initialServerMessages,
  routeThreadId,
}: {
  signedIn?: boolean
  initialServerThreads?: StoredThreadMeta[]
  initialServerMessages?: AskFormMessage[]
  routeThreadId?: string
}) {
  return (
    <ThreadSession
      signedIn={signedIn}
      initialServerThreads={initialServerThreads}
      initialServerMessages={initialServerMessages}
      routeThreadId={routeThreadId}
    />
  )
}
