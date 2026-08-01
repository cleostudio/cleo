import { createAuthMiddleware } from 'better-auth/api'

import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_VALUE,
  maxAgeSecondsUntil,
  sessionHintSetCookieString,
} from '~/lib/auth-session-hint'

function hintCookieAttributes(maxAge: number) {
  const sample = sessionHintSetCookieString({
    maxAgeSeconds: maxAge,
    secure: process.env.NODE_ENV === 'production',
  })
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: sample.includes('Secure'),
    httpOnly: false,
    maxAge,
  }
}

/**
 * Sets / clears the non-httpOnly session hint cookie alongside Better Auth
 * session cookies. Server-side writes are fine; nothing server-side may *read*
 * the hint (that would make content routes dynamic).
 */
export function sessionHintPlugin() {
  return {
    id: 'cleo-session-hint',
    hooks: {
      after: [
        {
          matcher() {
            return true
          },
          handler: createAuthMiddleware(async (ctx) => {
            const newSession = ctx.context.newSession
            if (newSession?.session?.expiresAt) {
              const maxAge = maxAgeSecondsUntil(newSession.session.expiresAt)
              ctx.setCookie(
                SESSION_HINT_COOKIE,
                SESSION_HINT_VALUE,
                hintCookieAttributes(maxAge),
              )
              return
            }

            if (ctx.path === '/sign-out') {
              ctx.setCookie(SESSION_HINT_COOKIE, '', {
                ...hintCookieAttributes(0),
                maxAge: 0,
              })
              return
            }

            // get-session resolved null → drop a stale hint so clients stop
            // paying for the round trip forever.
            if (ctx.path === '/get-session') {
              const returned = ctx.context.returned
              const hasSession =
                returned != null &&
                typeof returned === 'object' &&
                'session' in returned &&
                Boolean((returned as { session?: unknown }).session)
              if (!hasSession && !ctx.context.newSession) {
                // Only clear when the request carried a hint — avoid noisy
                // Set-Cookie on every anonymous get-session (which we also
                // try not to call).
                const cookieHeader = ctx.headers?.get('cookie') ?? ''
                if (cookieHeader.includes(SESSION_HINT_COOKIE)) {
                  ctx.setCookie(SESSION_HINT_COOKIE, '', {
                    ...hintCookieAttributes(0),
                    maxAge: 0,
                  })
                }
              }
            }
          }),
        },
      ],
    },
  }
}
