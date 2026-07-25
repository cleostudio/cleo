#!/usr/bin/env node
/**
 * Ensure always-required site env vars exist for `next build`.
 *
 * On hosts that only configure OPENAI_API_KEY (typical Cleo Vercel Git
 * previews), missing Neon/Clerk/Bunny pairs would otherwise crash prerender.
 * This writes stub values into `.env.production.local` for any key that is
 * unset in the environment and absent from that file. Real project env always
 * wins. Runtime features still fail closed against stub credentials.
 */

import { existsSync, readFileSync, appendFileSync } from 'node:fs'

const stubs = {
  DATABASE_URL: 'postgresql://runtime:runtime@127.0.0.1:5432/cali',
  ADMIN_EMAIL: 'owner@example.com',
  AMA_ENCRYPTION_KEY: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  MEDIA_ENCRYPTION_KEY: 'BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU=',
  RATE_LIMIT_HASH_KEY: 'AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI=',
  BUNNY_MEDIA_REGION: 'ny',
  BUNNY_MEDIA_ZONE: 'ci-media',
  BUNNY_MEDIA_PASSWORD: 'ci-media-password',
  BUNNY_MEDIA_CDN_URL: 'https://media-ci.example.com',
  BUNNY_CDN_API_KEY: 'ci-cdn-api-key',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsuY2FsaS5zbyQ',
  CLERK_SECRET_KEY: 'sk_live_ci_secret_not_real',
  // Used when VERCEL_ENV is absent/local; Preview derives from VERCEL_URL.
  SITE_URL: 'https://cali.so',
  PUBLIC_SITE_URL: 'https://cali.so',
}

const target = '.env.production.local'
const existingFile = existsSync(target) ? readFileSync(target, 'utf8') : ''
const presentInFile = new Set(
  existingFile
    .split('\n')
    .map((line) => line.match(/^([A-Z0-9_]+)=/))
    .filter(Boolean)
    .map((match) => match[1]),
)

const lines = []
for (const [key, value] of Object.entries(stubs)) {
  const fromEnv = typeof process.env[key] === 'string' && process.env[key].trim() !== ''
  if (fromEnv || presentInFile.has(key)) continue
  lines.push(`${key}=${value}`)
}

if (lines.length === 0) {
  console.log('ensure-preview-env: site credentials already present')
  process.exit(0)
}

const prefix = existingFile && !existingFile.endsWith('\n') ? '\n' : ''
appendFileSync(target, `${prefix}${lines.join('\n')}\n`)
console.log(
  `ensure-preview-env: wrote ${lines.length} stub credential(s) to ${target}`,
)
