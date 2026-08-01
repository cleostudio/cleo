import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { getSessionFromCtx } from 'better-auth/api'
import { setSessionCookie } from 'better-auth/cookies'
import { nextCookies } from 'better-auth/next-js'

import * as schema from '~/lib/auth-schema'
import { sessionHintPlugin } from '~/lib/auth-session-hint-plugin'
import { syntheticEmailForUserId } from '~/lib/auth-synthetic-email'
import {
  authBaseURLFromEnv,
  trustedOriginsFromEnv,
} from '~/lib/auth-trusted-origins'
import { getDb } from '~/lib/db'

function githubSocialProvider() {
  const clientId = process.env.GITHUB_CLIENT_ID?.trim()
  const clientSecret = process.env.GITHUB_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) return undefined

  return {
    clientId,
    clientSecret,
  }
}

function createAuth() {
  const github = githubSocialProvider()
  const baseURL = authBaseURLFromEnv()

  return betterAuth({
    appName: 'Cleo',
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema,
    }),
    trustedOrigins: trustedOriginsFromEnv(),
    advanced: {
      ipAddress: {
        // Vercel’s proxy emits comma-separated X-Forwarded-For; Better Auth’s
        // default refuses that chain and would key rate limits on a spoofable
        // value. Prefer the platform’s single-client header.
        ipAddressHeaders: ['x-vercel-forwarded-for'],
      },
    },
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: github ? { github } : {},
    // Account recovery is a second passkey + GitHub linking — no email sender.
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: github ? ['github'] : [],
      },
    },
    databaseHooks: {
      user: {
        create: {
          // OAuth provider avatar URLs point at CDNs our img-src blocks.
          async before(user) {
            return { data: { ...user, image: undefined } }
          },
        },
        update: {
          async before(user) {
            return { data: { ...user, image: undefined } }
          },
        },
      },
    },
    plugins: [
      passkey({
        rpName: 'Cleo',
        rpID: new URL(baseURL).hostname,
        origin: baseURL,
        registration: {
          requireSession: false,
          resolveUser: async ({ ctx, context }) => {
            let name = 'Cleo visitor'
            if (typeof context === 'string' && context.trim()) {
              try {
                const parsed = JSON.parse(context) as { name?: unknown }
                if (typeof parsed.name === 'string' && parsed.name.trim()) {
                  name = parsed.name.trim().slice(0, 64)
                } else {
                  name = context.trim().slice(0, 64)
                }
              } catch {
                name = context.trim().slice(0, 64)
              }
            }

            const id = crypto.randomUUID()
            const email = syntheticEmailForUserId(id)
            const user = await ctx.context.internalAdapter.createUser({
              id,
              name,
              email,
              emailVerified: false,
            })
            if (!user) {
              throw new Error('Failed to create user for passkey registration')
            }
            return {
              id: user.id,
              name: user.name,
              displayName: user.name,
            }
          },
          afterVerification: async ({ ctx, user }) => {
            // Passkey verify-registration alone does not open a session.
            // Sign the user in after a successful first credential so signup
            // is one WebAuthn ceremony.
            const existing = await getSessionFromCtx(ctx)
            if (existing?.user?.id) return {}

            const session = await ctx.context.internalAdapter.createSession(
              user.id,
            )
            const dbUser = await ctx.context.internalAdapter.findUserById(
              user.id,
            )
            if (!session || !dbUser) {
              throw new Error('Failed to create session after passkey signup')
            }
            await setSessionCookie(ctx, { session, user: dbUser })
            return {}
          },
        },
      }),
      sessionHintPlugin(),
      // Must be last — Better Auth Next.js cookie helper for Server Actions.
      nextCookies(),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>

let authInstance: Auth | undefined

/**
 * Lazy Better Auth instance. Avoids constructing a Pool / reading secrets at
 * import time during tooling that only needs types.
 */
export function getAuth(): Auth {
  if (!authInstance) {
    authInstance = createAuth()
  }
  return authInstance
}

/** Eager export for `npx auth@latest generate` and route handlers. */
export const auth = getAuth()
