import type { CleoFailureMode } from '~/lib/cleo/evals/taxonomy'
import type { CleoEvalCase } from '~/lib/cleo/evals/types'
import { suggestFailureModesFromFeedback } from '~/lib/cleo/feedback'
import type { CleoFeedbackRating } from '~/lib/cleo/feedback-shared'

export type CleoFeedbackExportRow = {
  id: string
  turnId: string
  rating: CleoFeedbackRating
  comment: string | null
  promptExcerpt: string | null
  assistantExcerpt: string | null
  inventedPaths: boolean
  createdAt: Date | string
}

/**
 * Map a stored feedback row into a *candidate* eval case for human triage.
 * Never auto-merge into `content/cleo-evals/cases.json`.
 */
export function feedbackRowToEvalCandidate(
  row: CleoFeedbackExportRow,
): CleoEvalCase | null {
  const prompt = row.promptExcerpt?.trim()
  const assistant = row.assistantExcerpt?.trim()
  if (!prompt || !assistant) return null

  const failureModes: CleoFailureMode[] = suggestFailureModesFromFeedback({
    rating: row.rating,
    comment: row.comment,
    inventedPaths: row.inventedPaths,
    assistantExcerpt: assistant,
  })

  if (failureModes.length === 0 && row.rating === 'up') {
    // Ups without a failure mode are weak eval seeds — skip.
    return null
  }

  const modes =
    failureModes.length > 0 ? failureModes : (['refusal_or_casual'] as CleoFailureMode[])

  return {
    id: `feedback-${row.turnId}`,
    split: 'train',
    failureModes: modes,
    prompt,
    assistant,
    expect: row.inventedPaths
      ? { hasInventedPaths: true, noStockPhrases: true }
      : {
          noInventedPaths: true,
          guardrailNoop: true,
          noStockPhrases: true,
        },
  }
}

export function feedbackRowsToEvalCandidates(
  rows: CleoFeedbackExportRow[],
): CleoEvalCase[] {
  const cases: CleoEvalCase[] = []
  for (const row of rows) {
    const candidate = feedbackRowToEvalCandidate(row)
    if (candidate) cases.push(candidate)
  }
  return cases
}
