import { describe, expect, it } from 'vitest'

import { encodeStreamEvent, parseStreamLine } from './stream'

describe('cleo stream protocol', () => {
  it('round-trips text_replace events', () => {
    const encoded = encodeStreamEvent({
      type: 'text_replace',
      content: 'See [Japan](/explore/japan) and Atlantis.',
    })

    expect(parseStreamLine(encoded)).toEqual({
      type: 'text_replace',
      content: 'See [Japan](/explore/japan) and Atlantis.',
    })
  })
})
