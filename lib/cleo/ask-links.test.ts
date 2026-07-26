import { describe, expect, it } from 'vitest'

import {
  cleoAskHref,
  cleoGuideAskPrompt,
  formatGuideFocus,
  parseGuideFocus,
  parseGuideFocusList,
} from './ask-links'

describe('ask-links', () => {
  it('round-trips focus tokens', () => {
    expect(formatGuideFocus({ collection: 'explore', slug: 'japan' })).toBe(
      'explore/japan',
    )
    expect(parseGuideFocus('space/europa')).toEqual({
      collection: 'space',
      slug: 'europa',
    })
    expect(parseGuideFocus('explore/Not-Valid')).toBeNull()
    expect(parseGuideFocusList(['explore/japan', 'explore/japan', 'nope'])).toEqual([
      { collection: 'explore', slug: 'japan' },
    ])
  })

  it('builds Ask Cleo hrefs with prompt and guide focus', () => {
    expect(
      cleoAskHref({
        prompt: cleoGuideAskPrompt('Japan'),
        guide: { collection: 'explore', slug: 'japan' },
      }),
    ).toBe(
      '/cleo?q=Give+me+a+quick+orientation+to+Japan.+Deep-link+its+field+guide+when+you+mention+it.&g=explore%2Fjapan',
    )
    expect(cleoAskHref({ prompt: '  ' })).toBe('/cleo')
  })
})
