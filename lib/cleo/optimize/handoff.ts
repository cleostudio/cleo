import type { OptimizeScorecard } from '~/lib/cleo/optimize/score'
import { formatSplitScore } from '~/lib/cleo/optimize/score'
import type { OptimizeFailureDetail } from '~/lib/cleo/optimize/meta-prompt'

export type OptimizeHandoffInput = {
  mode: 'dry-run' | 'live'
  promoted: boolean
  rounds: number
  baseline: OptimizeScorecard
  candidate: OptimizeScorecard
  failures: OptimizeFailureDetail[]
  candidatePath?: string
  notes?: string[]
}

/** HALO-style markdown handoff for a human-reviewed instruction PR. */
export function formatOptimizeHandoff(input: OptimizeHandoffInput): string {
  const lines: string[] = [
    '# Cleo instruction optimize handoff',
    '',
    `Mode: \`${input.mode}\``,
    `Rounds: ${input.rounds}`,
    `Promote: **${input.promoted ? 'yes' : 'no'}** (requires train **and** holdout pass-rate improvement)`,
    '',
    '## Scores',
    '',
    '| Split | Baseline | Candidate |',
    '| --- | --- | --- |',
    `| train | ${formatSplitScore(input.baseline.train)} | ${formatSplitScore(input.candidate.train)} |`,
    `| holdout | ${formatSplitScore(input.baseline.holdout)} | ${formatSplitScore(input.candidate.holdout)} |`,
    '',
  ]

  if (input.candidatePath) {
    lines.push(`Candidate base instructions: \`${input.candidatePath}\``, '')
  }

  if (input.notes && input.notes.length > 0) {
    lines.push('## Notes', '')
    for (const note of input.notes) {
      lines.push(`- ${note}`)
    }
    lines.push('')
  }

  lines.push('## Remaining failures (candidate)', '')
  if (input.failures.length === 0) {
    lines.push('_None._', '')
  } else {
    for (const failure of input.failures.slice(0, 20)) {
      lines.push(`### \`${failure.id}\` (${failure.split})`)
      lines.push(`- Modes: ${failure.failureModes.join(', ') || '—'}`)
      for (const diagnostic of failure.diagnostics) {
        lines.push(`- ${diagnostic}`)
      }
      lines.push('')
    }
  }

  lines.push(
    '## Review checklist',
    '',
    '- [ ] Diff candidate base instructions against `CLEO_BASE_INSTRUCTIONS`',
    '- [ ] Confirm guardrails / catalog grounding were not weakened',
    '- [ ] `pnpm test:cleo-eval` and `pnpm typecheck`',
    '- [ ] Manual Cleo smoke (multi-turn, search, images) before merge',
    '- [ ] Bump `CLEO_PROMPT_CACHE_KEY` if the voice prefix changed enough',
    '',
  )

  return `${lines.join('\n')}\n`
}
