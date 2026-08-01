import { Suspense } from 'react'

import { CleoPageView } from '../../_views/cleo-page'
import { getCleoSession } from '~/lib/cleo/auth-session'
import { listThreadsForUser } from '~/lib/cleo/thread-repository'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

const copy = publicPageMetadata.cleo

export const metadata = localeMetadata({
  locale: 'en',
  path: '/cleo',
  ...copy,
})

async function CleoSessionBranch() {
  const session = await getCleoSession()
  if (!session) {
    return <CleoPageView signedIn={false} />
  }

  const threads = await listThreadsForUser(session.user.id)
  return (
    <CleoPageView
      signedIn
      initialServerThreads={threads.map((thread) => ({
        id: thread.id,
        title: thread.title,
        createdAt: thread.createdAt.getTime(),
        updatedAt: thread.updatedAt.getTime(),
        lastMessageAt: thread.lastMessageAt.getTime(),
        byteSize: 0,
      }))}
    />
  )
}

export default function EnglishCleoPage() {
  return (
    <Suspense fallback={<CleoPageView signedIn={false} />}>
      <CleoSessionBranch />
    </Suspense>
  )
}
