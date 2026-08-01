'use client'

import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { userAdditionalFields } from '~/lib/auth-user-fields'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: userAdditionalFields,
    }),
  ],
})
