import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCleoFailureMode } from '~/lib/cleo/evals/taxonomy'
import type { CleoEvalCase, CleoEvalSplit } from '~/lib/cleo/evals/types'

const CASES_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../content/cleo-evals/cases.json',
)

function isSplit(value: unknown): value is CleoEvalSplit {
  return value === 'train' || value === 'holdout'
}

function assertCase(value: unknown, index: number): CleoEvalCase {
  if (!value || typeof value !== 'object') {
    throw new Error(`cleo-eval case[${index}] must be an object`)
  }

  const record = value as Record<string, unknown>
  const { id, split, failureModes, prompt, assistant, expect } = record

  if (typeof id !== 'string' || !id.trim()) {
    throw new Error(`cleo-eval case[${index}] missing id`)
  }
  if (!isSplit(split)) {
    throw new Error(`cleo-eval case ${id}: split must be train|holdout`)
  }
  if (!Array.isArray(failureModes) || failureModes.length === 0) {
    throw new Error(`cleo-eval case ${id}: failureModes required`)
  }
  for (const mode of failureModes) {
    if (typeof mode !== 'string' || !isCleoFailureMode(mode)) {
      throw new Error(`cleo-eval case ${id}: unknown failureModes entry ${String(mode)}`)
    }
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error(`cleo-eval case ${id}: prompt required`)
  }
  if (typeof assistant !== 'string') {
    throw new Error(`cleo-eval case ${id}: assistant required`)
  }
  if (!expect || typeof expect !== 'object') {
    throw new Error(`cleo-eval case ${id}: expect required`)
  }

  return {
    id,
    split,
    failureModes: failureModes as CleoEvalCase['failureModes'],
    prompt,
    assistant,
    expect: expect as CleoEvalCase['expect'],
  }
}

/** Load and validate golden cases from `content/cleo-evals/cases.json`. */
export function loadCleoEvalCases(): CleoEvalCase[] {
  const raw = JSON.parse(readFileSync(CASES_PATH, 'utf8')) as unknown
  if (!Array.isArray(raw)) {
    throw new Error('content/cleo-evals/cases.json must be a JSON array')
  }

  const cases = raw.map((entry, index) => assertCase(entry, index))
  const ids = new Set<string>()
  for (const evalCase of cases) {
    if (ids.has(evalCase.id)) {
      throw new Error(`Duplicate cleo-eval case id: ${evalCase.id}`)
    }
    ids.add(evalCase.id)
  }
  return cases
}
