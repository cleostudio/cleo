#!/usr/bin/env node
/**
 * Ensure always-required site env vars exist for `next build`.
 *
 * Writes stub values into `.env.production.local` for any key that is unset
 * in the environment and absent from that file. Real project env always wins.
 */

import { existsSync, readFileSync, appendFileSync } from 'node:fs'

const stubs = {
  // Neutral placeholder when VERCEL_ENV is absent/local. Set real origins in
  // the deployment environment; Preview may still derive from VERCEL_URL.
  SITE_URL: 'https://your-domain.com',
  PUBLIC_SITE_URL: 'https://your-domain.com',
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
