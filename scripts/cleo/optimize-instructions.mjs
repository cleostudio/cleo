#!/usr/bin/env node
/**
 * Offline Cleo instruction optimize (Phase C).
 *
 * Dry-run (default, no network):
 *   pnpm optimize:cleo
 *
 * Live regenerate + meta-prompt revise (needs OPENAI_API_KEY):
 *   pnpm optimize:cleo -- --live --max-rounds 2
 *
 * Writes artifacts under tmp/cleo-optimize/ (handoff.md + candidate base
 * instructions). Never merges to main — human reviews and opens a PR.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { config } from 'dotenv'

import { loadCleoEvalCases } from '../../lib/cleo/evals/load-cases.ts'
import {
  createOpenAIGenerateReply,
  createOpenAIReviseInstructions,
} from '../../lib/cleo/optimize/generate.ts'
import { runOptimizeLoop } from '../../lib/cleo/optimize/loop.ts'
import { formatSplitScore } from '../../lib/cleo/optimize/score.ts'

config({ path: '.env.local' })

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function argValue(flag, fallback) {
  const index = process.argv.indexOf(flag)
  if (index === -1) return fallback
  return process.argv[index + 1] ?? fallback
}

const live = hasFlag('--live')
const maxRounds = Number.parseInt(argValue('--max-rounds', '2'), 10)
const outDir = resolve(argValue('--out', 'tmp/cleo-optimize'))

if (!Number.isFinite(maxRounds) || maxRounds < 0) {
  console.error('--max-rounds must be a non-negative integer.')
  process.exit(1)
}

if (live && !process.env.OPENAI_API_KEY?.trim()) {
  console.error('OPENAI_API_KEY is required for --live optimize.')
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
const candidatePath = resolve(outDir, 'candidate-base-instructions.txt')
const handoffPath = resolve(outDir, 'handoff.md')

const cases = loadCleoEvalCases()
const result = await runOptimizeLoop({
  cases,
  mode: live ? 'live' : 'dry-run',
  maxRounds,
  candidatePath,
  ...(live
    ? {
        generateReply: createOpenAIGenerateReply(),
        reviseInstructions: createOpenAIReviseInstructions(),
      }
    : {}),
})

writeFileSync(candidatePath, `${result.candidateInstructions}\n`, 'utf8')
writeFileSync(handoffPath, result.handoffMarkdown, 'utf8')

console.log(`Mode: ${live ? 'live' : 'dry-run'}`)
console.log(
  `Baseline train ${formatSplitScore(result.baseline.train)} | holdout ${formatSplitScore(result.baseline.holdout)}`,
)
console.log(
  `Candidate train ${formatSplitScore(result.candidate.train)} | holdout ${formatSplitScore(result.candidate.holdout)}`,
)
console.log(`Promoted: ${result.promoted ? 'yes' : 'no'} (rounds=${result.rounds})`)
console.log(`Wrote ${candidatePath}`)
console.log(`Wrote ${handoffPath}`)
if (result.promoted) {
  console.log(
    'Next: copy candidate into CLEO_BASE_INSTRUCTIONS via a human-reviewed PR; bump CLEO_PROMPT_CACHE_KEY if needed.',
  )
}
