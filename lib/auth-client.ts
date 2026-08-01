'use client'

import { passkeyClient } from '@better-auth/passkey/client'
import { createAuthClient } from 'better-auth/react'

/**
 * Same-origin Better Auth client. No baseURL override — `/api/auth/*` stays
 * on `connect-src 'self'`.
 */
export const authClient = createAuthClient({
  plugins: [passkeyClient()],
})

export const { useSession, signIn, signOut } = authClient
