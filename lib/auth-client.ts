'use client'

import { sentinelClient } from '@better-auth/infra/client'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { getSentinelIdentifyUrl } from '~/lib/better-auth-kv'
import { userAdditionalFields } from '~/lib/auth-user-fields'

const sentinelIdentifyUrl = getSentinelIdentifyUrl()

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: userAdditionalFields,
    }),
    // Browser fingerprint + PoW challenge handling for Better Auth Infra.
    // Prefer project-scoped ingestion from NEXT_PUBLIC_BETTER_AUTH_KV_URL
    // (dash.better-auth.com → project settings); avoids the global default warn.
    sentinelClient(
      sentinelIdentifyUrl ? { identifyUrl: sentinelIdentifyUrl } : undefined,
    ),
  ],
})
