import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Suspense } from 'react'

import {
  AccountLoadingShell,
  AccountPageView,
} from '~/app/_views/auth-pages'
import { getSession } from '~/lib/auth'
import { nonPublicRobots } from '~/lib/non-public-metadata'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your Cleo account.',
  robots: nonPublicRobots,
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoadingShell />}>
      <AccountSession />
    </Suspense>
  )
}

async function AccountSession() {
  // headers() + Neon session must stay inside Suspense so Cache Components can
  // prerender the static shell instead of hanging a Better Auth query during
  // prerender (instant = false only skips validation; it does not fix this).
  const session = await getSession(await headers())
  const user = session?.user
    ? { name: session.user.name, email: session.user.email }
    : null

  return <AccountPageView user={user} />
}
