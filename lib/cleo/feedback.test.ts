import { describe, expect, it } from 'vitest'

import {
  excerptCleoFeedbackText,
  parseCleoFeedbackBody,
  suggestFailureModesFromFeedback,
} from '~/lib/cleo/feedback'
import {
  feedbackRowToEvalCandidate,
  feedbackRowsToEvalCandidates,
} from '~/lib/cleo/feedback-export'

describe('parseCleoFeedbackBody', () => {
  it('accepts a valid rating payload', () => {
    const parsed = parseCleoFeedbackBody({
      turnId: 'turn_abc',
      rating: 'down',
      comment: ' Invented a fake /explore link ',
      prompt: 'Tell me about Atlantis',
      assistant: 'See [Atlantis](/explore/atlantis).',
    })

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.value.comment).toBe('Invented a fake /explore link')
    expect(parsed.value.inventedPaths).toBe(true)
  })

  it('rejects invalid ratings and oversized comments', () => {
    expect(
      parseCleoFeedbackBody({
        turnId: 't1',
        rating: 'meh',
        prompt: 'a',
        assistant: 'b',
      }).ok,
    ).toBe(false)

    expect(
      parseCleoFeedbackBody({
        turnId: 't1',
        rating: 'up',
        comment: 'x'.repeat(501),
        prompt: 'a',
        assistant: 'b',
      }).ok,
    ).toBe(false)
  })

  it('does not echo secrets in error messages', () => {
    const parsed = parseCleoFeedbackBody({
      turnId: 't1',
      rating: 'up',
      prompt: 'sk-secret-value',
      assistant: 'ok',
      comment: 'x'.repeat(501),
    })
    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.error).not.toContain('sk-secret-value')
  })
})

describe('feedback export candidates', () => {
  it('suggests invented_guide_link from inventedPaths', () => {
    expect(
      suggestFailureModesFromFeedback({
        rating: 'down',
        inventedPaths: true,
        assistantExcerpt: 'See [X](/explore/nope)',
      }),
    ).toContain('invented_guide_link')
  })

  it('maps down feedback with excerpts into a triage candidate', () => {
    const candidate = feedbackRowToEvalCandidate({
      id: 'fb1',
      turnId: 'turn_1',
      rating: 'down',
      comment: 'wrong link',
      promptExcerpt: 'Link Istanbul explore',
      assistantExcerpt: 'See [Istanbul](/explore/istanbul).',
      inventedPaths: true,
      createdAt: new Date(),
    })

    expect(candidate).not.toBeNull()
    expect(candidate?.id).toBe('feedback-turn_1')
    expect(candidate?.expect.hasInventedPaths).toBe(true)
    expect(candidate?.failureModes.length).toBeGreaterThan(0)
  })

  it('skips bare thumbs-up without failure signal', () => {
    expect(
      feedbackRowsToEvalCandidates([
        {
          id: 'fb2',
          turnId: 'turn_2',
          rating: 'up',
          comment: null,
          promptExcerpt: 'hi',
          assistantExcerpt: 'Hey there',
          inventedPaths: false,
          createdAt: new Date(),
        },
      ]),
    ).toEqual([])
  })
})

describe('excerptCleoFeedbackText', () => {
  it('caps long excerpts with an ellipsis', () => {
    const excerpt = excerptCleoFeedbackText('a'.repeat(2_050), 2_000)
    expect(excerpt.length).toBe(2_000)
    expect(excerpt.endsWith('…')).toBe(true)
  })
})
