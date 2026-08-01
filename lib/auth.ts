import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'

/**
 * Stage 0 spike only — throwaway local SQLite, no Neon.
 * Session reads here exist solely to prove the prerender contract under
 * `cacheComponents: true`. Do not treat this as the production auth surface.
 *
 * Note: `node:sqlite` + `npx auth migrate` failed on this stack
 * (`stmt.columns is not a function`); better-sqlite3 is the spike substitute.
 */
const spikeDatabasePath =
  process.env.BETTER_AUTH_SQLITE_PATH ?? '.spike-auth.sqlite'

const spikeSecret =
  process.env.BETTER_AUTH_SECRET ??
  'stage0-spike-secret-not-for-production-use'

const spikeBaseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  'http://localhost:3000'

export const auth = betterAuth({
  database: new Database(spikeDatabasePath),
  secret: spikeSecret,
  baseURL: spikeBaseURL,
  // Email/password kept off — Stage 0 only needs getSession / useSession.
  emailAndPassword: {
    enabled: false,
  },
})
