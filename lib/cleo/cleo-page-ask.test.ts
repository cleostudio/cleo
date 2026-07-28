import { describe, expect, it } from 'vitest'

import { guideAskPrompt } from '~/lib/cleo/ask-links'
import { parseCleoAskSearchParams } from '~/lib/cleo/parse-ask-search-params'

/**
 * Contract for app/(site)/cleo/page.tsx:
 * Suspense resolves searchParams through parseCleoAskSearchParams into
 * CleoPageView's initialAsk. Keep this aligned when merging Instant Navigation
 * /cleo work from other branches.
 */
describe('cleo page ask wiring contract', () => {
  it('maps topic=explore/japan to an auto-submit orientation intent', () => {
    expect(
      parseCleoAskSearchParams({ topic: 'explore/japan' }),
    ).toEqual({
      prompt: guideAskPrompt('explore', 'Japan'),
      autoSubmit: true,
    })
  })

  it('maps q= + auto=1 without requiring topic=', () => {
    expect(
      parseCleoAskSearchParams({
        q: 'Help me pick a Writing essay to start with, then deep-link it.',
        auto: '1',
      }),
    ).toEqual({
      prompt: 'Help me pick a Writing essay to start with, then deep-link it.',
      autoSubmit: true,
    })
  })

  it('returns null for empty deep links so the Suspense fallback shell stays idle', () => {
    expect(parseCleoAskSearchParams({})).toBeNull()
    expect(parseCleoAskSearchParams({ topic: 'explore/not-a-country' })).toBeNull()
  })
})
