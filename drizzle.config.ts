import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })

const url =
  process.env.DATABASE_URL_UNPOOLED?.trim() ||
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL_NON_POOLING?.trim() ||
  process.env.POSTGRES_URL?.trim()

if (!url) {
  throw new Error(
    'Set DATABASE_URL (or DATABASE_URL_UNPOOLED) before running drizzle-kit.',
  )
}

export default defineConfig({
  schema: './lib/db/auth-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
})
