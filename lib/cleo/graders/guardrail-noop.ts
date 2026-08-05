import { sanitizePortalMarkdown } from '~/lib/cleo/guardrails'
import type { GraderResult } from '~/lib/cleo/graders/types'

/** Pass when production sanitize leaves the reply unchanged. */
export function gradeGuardrailNoop(markdown: string): GraderResult {
  const sanitized = sanitizePortalMarkdown(markdown)
  if (sanitized === markdown) {
    return {
      grader: 'guardrail_noop',
      pass: true,
      diagnostic: 'sanitizePortalMarkdown left the reply unchanged.',
    }
  }

  return {
    grader: 'guardrail_noop',
    pass: false,
    diagnostic:
      'sanitizePortalMarkdown altered the reply (invented guide links or curated images were stripped).',
  }
}
