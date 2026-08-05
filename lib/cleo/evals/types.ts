import type { CleoFailureMode } from '~/lib/cleo/evals/taxonomy'

export type CleoEvalSplit = 'train' | 'holdout'

/** Expectations for deterministic graders over a frozen assistant reply. */
export type CleoEvalExpect = {
  /** Canonical guide hrefs that must appear in the assistant reply. */
  catalogHrefs?: string[]
  /**
   * Negative fixture: these canonical hrefs must be absent (documents a
   * missing-catalog-link failure).
   */
  missingCatalogHrefs?: string[]
  /** Raw reply must contain no invented portal paths or curated-image paths. */
  noInventedPaths?: boolean
  /** `sanitizePortalMarkdown` must leave the reply unchanged. */
  guardrailNoop?: boolean
  /** Fail when stock assistant phrases appear. */
  noStockPhrases?: boolean
  /** Negative fixture: stock phrases must be present (detector smoke). */
  hasStockPhrases?: boolean
  /** Negative fixture: raw reply must contain invented portal paths/images. */
  hasInventedPaths?: boolean
}

export type CleoEvalCase = {
  id: string
  split: CleoEvalSplit
  /** Axial codes this case exercises or guards against. */
  failureModes: CleoFailureMode[]
  /** User prompt (documentation + future live eval). */
  prompt: string
  /** Frozen assistant Markdown graded offline in Phase A. */
  assistant: string
  expect: CleoEvalExpect
}

export type GraderResult = {
  grader: string
  pass: boolean
  /** Actionable side information for offline optimize loops. */
  diagnostic: string
}

export type CaseGradeReport = {
  id: string
  split: CleoEvalSplit
  pass: boolean
  results: GraderResult[]
}
