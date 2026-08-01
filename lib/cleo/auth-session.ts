import { headers } from 'next/headers'

import { auth } from '~/lib/auth'

export type CleoSessionUser = {
  id: string
  name: string
  email?: string | null
}

export type CleoSession = {
  user: CleoSessionUser
} | null

/** Server-only session read for `/cleo` RSC and `/api/responses`. */
export async function getCleoSession(): Promise<CleoSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.id) return null
  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  }
}
