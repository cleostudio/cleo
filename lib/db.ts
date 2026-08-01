import { attachDatabasePool } from '@vercel/functions'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from '~/lib/schema'

/**
 * Lazy Postgres access for Better Auth and application tables.
 *
 * Uses `pg` so the same code path works with a Neon `DATABASE_URL` and with
 * local Postgres. Do not call `neon()` at module scope — it throws during
 * `next build` before env stubs exist. Do not wrap the client in a `Proxy` —
 * adapters that introspect the instance break.
 */
let pool: Pool | undefined
let db: ReturnType<typeof drizzle<typeof schema>> | undefined

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Provision Neon (`vercel install neon`) or point it at local Postgres.',
    )
  }
  return url
}

export function getPool(): Pool {
  if (pool) return pool
  pool = new Pool({ connectionString: requireDatabaseUrl() })
  attachDatabasePool(pool)
  return pool
}

export function getDb() {
  if (db) return db
  db = drizzle(getPool(), { schema })
  return db
}

export type Db = ReturnType<typeof getDb>
