import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit does not auto-load `.env.local`.
loadEnv({ path: '.env.local' })
loadEnv()

if (!process.env.DATABASE_URL?.trim()) {
  throw new Error(
    'DATABASE_URL is required for drizzle-kit (set it in .env.local)',
  )
}

export default defineConfig({
  schema: './lib/auth-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
