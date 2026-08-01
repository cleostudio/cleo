import { toNextJsHandler } from 'better-auth/next-js'

import { getAuth, isAuthConfigured } from '~/lib/auth'

export const runtime = 'nodejs'

async function authUnavailable() {
  return Response.json(
    {
      error:
        'Authentication is not configured. Provision Neon and set BETTER_AUTH_SECRET.',
    },
    { status: 503 },
  )
}

const handler = toNextJsHandler(async (request) => {
  if (!isAuthConfigured()) {
    return authUnavailable()
  }
  return getAuth().handler(request)
})

export const GET = handler.GET
export const POST = handler.POST
export const PUT = handler.PUT
export const PATCH = handler.PATCH
export const DELETE = handler.DELETE
