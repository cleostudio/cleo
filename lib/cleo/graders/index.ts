import type { CaseGradeReport, CleoEvalCase } from '~/lib/cleo/evals/types'
import { gradeCatalogMention } from '~/lib/cleo/graders/catalog-mention'
import { gradeCuratedImages } from '~/lib/cleo/graders/curated-images'
import { gradeGuardrailNoop } from '~/lib/cleo/graders/guardrail-noop'
import { gradeGuideLinkValidity } from '~/lib/cleo/graders/guide-links'
import {
  gradeExpectInventedPaths,
  gradeNoInventedPaths,
} from '~/lib/cleo/graders/invented-paths'
import { gradeStockPhrases } from '~/lib/cleo/graders/stock-phrases'
import type { GraderResult } from '~/lib/cleo/graders/types'

/**
 * Run deterministic graders selected by the case `expect` flags.
 * Always runs guide-link + curated-image validity over the raw reply.
 */
export function gradeCleoEvalCase(evalCase: CleoEvalCase): CaseGradeReport {
  const { assistant, expect } = evalCase
  const results: GraderResult[] = []

  if (expect.hasInventedPaths) {
    // Negative fixtures document bad model output; only assert detection.
    results.push(gradeExpectInventedPaths(assistant))
  } else {
    results.push(gradeGuideLinkValidity(assistant))
    results.push(gradeCuratedImages(assistant))
  }

  if (expect.catalogHrefs && expect.catalogHrefs.length > 0) {
    results.push(gradeCatalogMention(assistant, expect.catalogHrefs))
  }

  if (expect.missingCatalogHrefs && expect.missingCatalogHrefs.length > 0) {
    const mention = gradeCatalogMention(assistant, expect.missingCatalogHrefs)
    results.push({
      grader: 'expect_missing_catalog',
      pass: !mention.pass,
      diagnostic: mention.pass
        ? `Negative fixture expected missing href(s) ${expect.missingCatalogHrefs.join(', ')}, but they were present.`
        : `Negative fixture confirmed missing href(s): ${expect.missingCatalogHrefs.join(', ')}.`,
    })
  }

  if (expect.noInventedPaths) {
    results.push(gradeNoInventedPaths(assistant))
  }

  if (expect.guardrailNoop) {
    results.push(gradeGuardrailNoop(assistant))
  }

  if (expect.noStockPhrases) {
    results.push(gradeStockPhrases(assistant))
  }

  if (expect.hasStockPhrases) {
    const stock = gradeStockPhrases(assistant)
    results.push({
      grader: 'expect_stock_phrases',
      pass: !stock.pass,
      diagnostic: stock.pass
        ? 'Negative fixture expected stock phrases, but none were found.'
        : stock.diagnostic,
    })
  }

  return {
    id: evalCase.id,
    split: evalCase.split,
    pass: results.every((result) => result.pass),
    results,
  }
}

export {
  gradeCatalogMention,
  gradeCuratedImages,
  gradeExpectInventedPaths,
  gradeGuardrailNoop,
  gradeGuideLinkValidity,
  gradeNoInventedPaths,
  gradeStockPhrases,
}
