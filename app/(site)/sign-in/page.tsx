import type { Metadata } from 'next'

import { SignInPageView } from '~/app/_views/auth-pages'
import { nonPublicRobots } from '~/lib/non-public-metadata'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Cleo account.',
  robots: nonPublicRobots,
}

export default function SignInPage() {
  return <SignInPageView />
}
