import type { GraderResult } from '~/lib/cleo/graders/types'

/**
 * Phrases banned by CLEO_INSTRUCTIONS `<voice>`. Keep in sync when the
 * instruction list changes.
 */
export const STOCK_ASSISTANT_PHRASES = [
  'Great question',
  'Absolutely,',
  'Absolutely!',
  'Of course,',
  "I'd be happy to",
  "Let's dive in",
  "Here's a breakdown",
  "It's important to note",
  'Let me know if you need anything else',
] as const

/** Fail when stock assistant language appears (case-insensitive). */
export function gradeStockPhrases(markdown: string): GraderResult {
  const lower = markdown.toLowerCase()
  const hits = STOCK_ASSISTANT_PHRASES.filter((phrase) =>
    lower.includes(phrase.toLowerCase()),
  )

  if (hits.length === 0) {
    return {
      grader: 'stock_phrases',
      pass: true,
      diagnostic: 'No banned stock assistant phrases detected.',
    }
  }

  return {
    grader: 'stock_phrases',
    pass: false,
    diagnostic: `Stock assistant phrase(s) present: ${hits.join('; ')}.`,
  }
}
