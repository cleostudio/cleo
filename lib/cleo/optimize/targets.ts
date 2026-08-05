import type { CleoEvalCase } from '~/lib/cleo/evals/types'

/**
 * Positive behavioral targets for live / dry-run optimize scoring.
 * Negative detector fixtures (`hasInventedPaths`, etc.) stay in the grader
 * suite and are excluded here — regenerating a good reply would "fail" them.
 */
export function isOptimizeTargetCase(evalCase: CleoEvalCase): boolean {
  const { expect } = evalCase
  if (expect.hasInventedPaths) return false
  if (expect.hasStockPhrases) return false
  if (expect.missingCatalogHrefs && expect.missingCatalogHrefs.length > 0) {
    return false
  }

  return Boolean(
    expect.noInventedPaths ||
      expect.guardrailNoop ||
      expect.noStockPhrases ||
      (expect.catalogHrefs && expect.catalogHrefs.length > 0),
  )
}

export function filterOptimizeTargetCases(
  cases: readonly CleoEvalCase[],
): CleoEvalCase[] {
  return cases.filter(isOptimizeTargetCase)
}
