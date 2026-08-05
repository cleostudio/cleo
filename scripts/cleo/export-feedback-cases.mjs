#!/usr/bin/env node
/**
 * Export Cleo feedback rows → candidate eval cases for human triage.
 *
 * Usage:
 *   pnpm export:cleo-feedback
 *   pnpm export:cleo-feedback -- --out tmp/feedback-candidates.json --limit 50
 *
 * Requires DATABASE_URL. Never writes into content/cleo-evals/cases.json —
 * copy curated candidates manually after review.
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { config } from 'dotenv'
import { desc } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import { cleoFeedback } from '../../lib/db/cleo-schema.ts'
import { feedbackRowsToEvalCandidates } from '../../lib/cleo/feedback-export.ts'

config({ path: '.env.local' })

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag)
  if (index === -1) return fallback
  return process.argv[index + 1] ?? fallback
}

const outPath = resolve(argValue('--out', 'tmp/cleo-feedback-candidates.json'))
const limit = Number.parseInt(argValue('--limit', '100'), 10)

const databaseUrl =
  process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || ''

if (!databaseUrl) {
  console.error('DATABASE_URL (or POSTGRES_URL) is required.')
  process.exit(1)
}

if (!Number.isFinite(limit) || limit < 1) {
  console.error('--limit must be a positive integer.')
  process.exit(1)
}

const db = drizzle(neon(databaseUrl))

const rows = await db
  .select({
    id: cleoFeedback.id,
    turnId: cleoFeedback.turnId,
    rating: cleoFeedback.rating,
    comment: cleoFeedback.comment,
    promptExcerpt: cleoFeedback.promptExcerpt,
    assistantExcerpt: cleoFeedback.assistantExcerpt,
    inventedPaths: cleoFeedback.inventedPaths,
    createdAt: cleoFeedback.createdAt,
  })
  .from(cleoFeedback)
  .orderBy(desc(cleoFeedback.createdAt))
  .limit(limit)

const candidates = feedbackRowsToEvalCandidates(
  rows.map((row) => ({
    ...row,
    rating: row.rating === 'up' ? 'up' : 'down',
  })),
)

writeFileSync(outPath, `${JSON.stringify(candidates, null, 2)}\n`, 'utf8')
console.log(
  `Wrote ${candidates.length} candidate case(s) from ${rows.length} feedback row(s) → ${outPath}`,
)
console.log('Review manually before merging into content/cleo-evals/cases.json.')
