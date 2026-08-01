import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'

import * as schema from '~/lib/db/auth-schema'

export type Database = NeonHttpDatabase<typeof schema>

/** Neon Marketplace injects `DATABASE_URL` (and sometimes legacy `POSTGRES_URL`). */
export function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    ''
  )
}

export function isDatabaseConfigured(): boolean {
  return getDatabaseUrl().length > 0
}

let dbInstance: Database | null = null

function createDb(): Database {
  const url = getDatabaseUrl()
  if (!url) {
    throw new Error(
      'DATABASE_URL (or POSTGRES_URL) must be set for Neon Postgres.',
    )
  }

  const sql = neon(url)
  return drizzle(sql, { schema })
}

/** Lazy Neon + Drizzle client. Safe to import without env present. */
export function getDb(): Database {
  if (!dbInstance) {
    dbInstance = createDb()
  }
  return dbInstance
}

/** Reset cached client (tests only). */
export function resetDbForTests(): void {
  dbInstance = null
}
