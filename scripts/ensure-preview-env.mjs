#!/usr/bin/env node
/**
 * Ensure always-required site env vars exist for `next build`.
 *
 * Writes stub values into `.env.production.local` for any key that is unset
 * in the environment and absent from that file. Real project env always wins.
 */

import { existsSync, readFileSync, appendFileSync } from 'node:fs'

const stubs = {
  // Default alpha deploy origin when VERCEL_ENV is absent/local. Override in
  // the deployment environment when the canonical host changes.
  SITE_URL: 'https://cleoalpha.vercel.app',
  PUBLIC_SITE_URL: 'https://cleoalpha.vercel.app',
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
