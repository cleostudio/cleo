import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { AccountPageView } from '~/app/_views/auth-pages'
import { getSession } from '~/lib/auth'
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

  return <AccountPageView user={user} />
}
