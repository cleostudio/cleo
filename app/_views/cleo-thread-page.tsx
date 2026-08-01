'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ThreadSession } from '~/components/cleo/thread-session'
import { isThreadId } from '~/lib/cleo/thread-id'

/**
 * `/cleo/[threadId]` shell. Params are read on the client so the route can
 * keep a prerendered shell; the thread body loads from IndexedDB after hydrate.
 */
export function CleoThreadPageView() {
  const params = useParams<{ threadId: string }>()
  const router = useRouter()
  const threadId = typeof params?.threadId === 'string' ? params.threadId : ''

  useEffect(() => {
    if (threadId && !isThreadId(threadId)) {
      router.replace('/cleo')
    }
  }, [router, threadId])

  if (!threadId || !isThreadId(threadId)) {
    return <ThreadSession />
  }

  return <ThreadSession routeThreadId={threadId} />
}
