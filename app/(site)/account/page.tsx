import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { AccountPageView } from '~/app/_views/auth-pages'
import { getSession } from '~/lib/auth'
import type { CleoMemoryNote } from '~/lib/cleo/memory'
import { listUserMemoryNotes } from '~/lib/cleo/memory-store'
import { isDatabaseConfigured } from '~/lib/db'
import { nonPublicRobots } from '~/lib/non-public-metadata'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your Cleo account.',
  robots: nonPublicRobots,
}

// Session lookup uses headers(); do not prerender a shared shell.
export const instant = false

export default async function AccountPage() {
  const session = await getSession(await headers())
  const user = session?.user
    ? { name: session.user.name, email: session.user.email }
    : null

  let memoryNotes: CleoMemoryNote[] = []
  let memoryStored = false
  if (session?.user?.id && isDatabaseConfigured()) {
    const listed = await listUserMemoryNotes(session.user.id)
    if (listed.ok) {
      memoryNotes = listed.value
      memoryStored = true
    }
  }

  return (
    <AccountPageView
      user={user}
      memoryNotes={memoryNotes}
      memoryStored={memoryStored}
    />
  )
}
