import type { Metadata } from 'next'

import { SignUpPageView } from '~/app/_views/auth-pages'
import { nonPublicRobots } from '~/lib/non-public-metadata'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a Cleo account with email and password.',
  robots: nonPublicRobots,
}

export default function SignUpPage() {
  return <SignUpPageView />
}
