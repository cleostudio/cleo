import { Suspense } from 'react'

import { CleoThreadPageView } from '../../../_views/cleo-thread-page'
import { getCleoSession } from '~/lib/cleo/auth-session'
import { makeIncomplete } from '~/lib/cleo/conversation-helpers'
import {
  listMessagesForUser,
  listThreadsForUser,
} from '~/lib/cleo/thread-repository'
import { isThreadId } from '~/lib/cleo/thread-id'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

// Unenumerable client UUIDs — opt out of static shell validation (plan §6).
export const instant = false

async function CleoThreadSessionBranch({
  threadId,
}: {
  threadId: string
}) {
  const session = await getCleoSession()
  if (!session) {
    return <CleoThreadPageView signedIn={false} />
  }

  const threads = await listThreadsForUser(session.user.id)
  let initialServerMessages
  try {
    const messages = await listMessagesForUser(session.user.id, threadId, {
      includeReasoning: true,
    })
    initialServerMessages = messages.map((message, index) => ({
      id: index + 1,
      stableId: message.id,
      role: message.role,
      content: message.content,
      incomplete:
        message.status === 'incomplete'
          ? makeIncomplete('stopped')
          : message.status === 'error'
            ? makeIncomplete('other', 'This turn failed.')
            : undefined,
      reasoningItems: message.reasoningItems,
      images: [],
    }))
  } catch {
    // Not owned or missing — client shell redirects away from the id.
    initialServerMessages = undefined
  }

  return (
    <CleoThreadPageView
      signedIn
      initialServerThreads={threads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        createdAt: thread.createdAt.getTime(),
        updatedAt: thread.updatedAt.getTime(),
        lastMessageAt: thread.lastMessageAt.getTime(),
        byteSize: 0,
      }))}
      initialServerMessages={initialServerMessages}
    />
  )
}

export default async function EnglishCleoThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>
}) {
  const { threadId } = await params
  if (!isThreadId(threadId)) {
    return <CleoThreadPageView signedIn={false} />
  }

  return (
    <Suspense fallback={<CleoThreadPageView signedIn={false} />}>
      <CleoThreadSessionBranch threadId={threadId} />
    </Suspense>
  )
}
