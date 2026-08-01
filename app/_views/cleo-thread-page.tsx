'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { CleoPageView } from './cleo-page'
import type { AskFormMessage } from '~/components/cleo/ask-form'
import { isThreadId } from '~/lib/cleo/thread-id'
import type { StoredThreadMeta } from '~/lib/cleo/thread-store'

/**
 * `/cleo/[threadId]` client shell. When the RSC parent already resolved a
 * session, messages arrive as `initialServerMessages`.
 */
export function CleoThreadPageView({
  signedIn = false,
  initialServerThreads,
  initialServerMessages,
}: {
  signedIn?: boolean
  initialServerThreads?: StoredThreadMeta[]
  initialServerMessages?: AskFormMessage[]
} = {}) {
  const params = useParams<{ threadId: string }>()
  const router = useRouter()
  const threadId = typeof params?.threadId === 'string' ? params.threadId : ''

  useEffect(() => {
    if (threadId && !isThreadId(threadId)) {
      router.replace('/cleo')
    }
  }, [router, threadId])

  if (!threadId || !isThreadId(threadId)) {
    return (
      <CleoPageView
        signedIn={signedIn}
        initialServerThreads={initialServerThreads}
      />
    )
  }

  return (
    <CleoPageView
      signedIn={signedIn}
      initialServerThreads={initialServerThreads}
      initialServerMessages={initialServerMessages}
      routeThreadId={threadId}
    />
  )
}
