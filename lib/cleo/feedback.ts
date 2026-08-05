import { createHash, randomUUID } from 'node:crypto'

import { isCleoFailureMode, type CleoFailureMode } from '~/lib/cleo/evals/taxonomy'
import {
  CLEO_FEEDBACK_BODY_MAX_CHARS,
  CLEO_FEEDBACK_COMMENT_MAX,
  CLEO_FEEDBACK_EXCERPT_MAX,
  CLEO_FEEDBACK_TURN_ID_MAX,
  isCleoFeedbackRating,
  type CleoFeedbackRating,
} from '~/lib/cleo/feedback-shared'
import { hasInventedPortalPaths } from '~/lib/cleo/guardrails'

export type {
  CleoFeedbackRating,
} from '~/lib/cleo/feedback-shared'
export {
  CLEO_FEEDBACK_BODY_MAX_CHARS,
  CLEO_FEEDBACK_COMMENT_MAX,
  CLEO_FEEDBACK_EXCERPT_MAX,
  CLEO_FEEDBACK_RATINGS,
  CLEO_FEEDBACK_TURN_ID_MAX,
  isCleoFeedbackRating,
} from '~/lib/cleo/feedback-shared'

export type CleoFeedbackInput = {
  turnId: string
  rating: CleoFeedbackRating
  comment?: string
  prompt: string
  assistant: string
}

export type ParsedCleoFeedback =
  | { ok: true; value: CleoFeedbackInput & { inventedPaths: boolean } }
  | { ok: false; error: string; status: number }

export function hashCleoFeedbackText(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function hashCleoGuestKey(clientKey: string): string {
  return createHash('sha256')
    .update(`cleo:feedback-guest:${clientKey}`)
    .digest('hex')
}

export function excerptCleoFeedbackText(
  value: string,
  max = CLEO_FEEDBACK_EXCERPT_MAX,
): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

export function newCleoFeedbackId(): string {
  return randomUUID()
}

export function parseCleoFeedbackBody(body: unknown): ParsedCleoFeedback {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body.', status: 400 }
  }

  const record = body as Record<string, unknown>
  const { turnId, rating, comment, prompt, assistant } = record

  if (typeof turnId !== 'string' || !turnId.trim()) {
    return { ok: false, error: 'turnId is required.', status: 400 }
  }
  if (turnId.length > CLEO_FEEDBACK_TURN_ID_MAX) {
    return { ok: false, error: 'turnId is too long.', status: 400 }
  }
  if (!isCleoFeedbackRating(rating)) {
    return { ok: false, error: 'rating must be "up" or "down".', status: 400 }
  }
  if (typeof prompt !== 'string') {
    return { ok: false, error: 'prompt is required.', status: 400 }
  }
  if (typeof assistant !== 'string') {
    return { ok: false, error: 'assistant is required.', status: 400 }
  }
  if (prompt.length + assistant.length > CLEO_FEEDBACK_BODY_MAX_CHARS) {
    return { ok: false, error: 'Feedback payload is too large.', status: 413 }
  }

  let normalizedComment: string | undefined
  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      return { ok: false, error: 'comment must be a string.', status: 400 }
    }
    const trimmed = comment.trim()
    if (trimmed.length > CLEO_FEEDBACK_COMMENT_MAX) {
      return {
        ok: false,
        error: `comment must be at most ${CLEO_FEEDBACK_COMMENT_MAX} characters.`,
        status: 400,
      }
    }
    if (trimmed) normalizedComment = trimmed
  }

  return {
    ok: true,
    value: {
      turnId: turnId.trim(),
      rating,
      comment: normalizedComment,
      prompt,
      assistant,
      inventedPaths: hasInventedPortalPaths(assistant),
    },
  }
}

/** Suggest taxonomy codes for human triage when exporting feedback → eval cases. */
export function suggestFailureModesFromFeedback(input: {
  rating: CleoFeedbackRating
  comment?: string | null
  inventedPaths: boolean
  assistantExcerpt?: string | null
}): CleoFailureMode[] {
  const modes = new Set<CleoFailureMode>()
  if (input.inventedPaths) {
    modes.add('invented_guide_link')
    const assistant = input.assistantExcerpt ?? ''
    if (
      /!\[/.test(assistant) &&
      /\/images\/(atlas|space|civilizations|cities|oceans|rivers)\//.test(
        assistant,
      )
    ) {
      modes.add('invented_curated_image')
    }
  }

  const comment = (input.comment ?? '').toLowerCase()
  if (
    comment.includes('stock') ||
    comment.includes('robotic') ||
    comment.includes('generic')
  ) {
    modes.add('stock_phrase')
  }
  if (
    comment.includes('wrong') &&
    (comment.includes('link') || comment.includes('shelf'))
  ) {
    modes.add('wrong_shelf')
  }
  if (comment.includes('missing') && comment.includes('link')) {
    modes.add('missing_catalog_link')
  }

  return [...modes].filter(isCleoFailureMode)
}
