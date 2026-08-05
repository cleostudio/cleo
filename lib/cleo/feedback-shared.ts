export const CLEO_FEEDBACK_RATINGS = ['up', 'down'] as const
export type CleoFeedbackRating = (typeof CLEO_FEEDBACK_RATINGS)[number]

export const CLEO_FEEDBACK_COMMENT_MAX = 500
export const CLEO_FEEDBACK_EXCERPT_MAX = 2_000
export const CLEO_FEEDBACK_TURN_ID_MAX = 80
export const CLEO_FEEDBACK_BODY_MAX_CHARS = 12_000

export function isCleoFeedbackRating(value: unknown): value is CleoFeedbackRating {
  return (
    typeof value === 'string' &&
    (CLEO_FEEDBACK_RATINGS as readonly string[]).includes(value)
  )
}
