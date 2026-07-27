import { describe, expect, it } from 'vitest'

import {
  parseCleoSession,
  serializeCleoSession,
} from './session'

describe('cleo session persistence', () => {
  it('round-trips a text conversation', () => {
    const raw = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Tell me about Mars' },
        {
          id: 1,
          role: 'assistant',
          content: 'Mars is next door.',
          activities: [
            {
              id: 'ws_1',
              kind: 'web_search',
              status: 'completed',
            },
          ],
        },
      ],
      2,
    )

    expect(raw).toBeTruthy()
    const parsed = parseCleoSession(raw!)
    expect(parsed?.messages).toHaveLength(2)
    expect(parsed?.nextId).toBe(2)
    expect(parsed?.messages[1]?.activities?.[0]?.kind).toBe('web_search')
  })

  it('drops oversized data-URL images', () => {
    const raw = serializeCleoSession(
      [
        {
          id: 0,
          role: 'user',
          content: 'look',
          images: [{ url: `data:image/png;base64,${'A'.repeat(80_000)}` }],
        },
      ],
      1,
    )

    const parsed = parseCleoSession(raw!)
    expect(parsed?.messages[0]?.images).toBeUndefined()
  })

  it('rejects unknown versions', () => {
    expect(parseCleoSession(JSON.stringify({ version: 2, messages: [] }))).toBe(
      null,
    )
  })

  it('round-trips encrypted reasoning items on assistant messages', () => {
    const raw = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Why?' },
        {
          id: 1,
          role: 'assistant',
          content: 'Because.',
          reasoningItems: [
            {
              type: 'reasoning',
              id: 'rs_1',
              encrypted_content: 'opaque-token',
              summary: [{ type: 'summary_text', text: 'think' }],
            },
          ],
        },
      ],
      2,
    )

    const parsed = parseCleoSession(raw!)
    expect(parsed?.messages[1]?.reasoningItems?.[0]?.encrypted_content).toBe(
      'opaque-token',
    )
  })

  it('round-trips incomplete answer markers', () => {
    const raw = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Long essay?' },
        {
          id: 1,
          role: 'assistant',
          content: 'Once upon a time…',
          incomplete: {
            reason: 'max_output_tokens',
            message: 'This answer was cut short before it finished.',
          },
        },
      ],
      2,
    )

    const parsed = parseCleoSession(raw!)
    expect(parsed?.messages[1]?.incomplete?.reason).toBe('max_output_tokens')
  })
})
