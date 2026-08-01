'use client'

import { createAuthClient } from 'better-auth/react'

/**
 * Stage 0 spike client. Same-origin `/api/auth/*` — no baseURL override.
 */
export const authClient = createAuthClient()

export const { useSession } = authClient
