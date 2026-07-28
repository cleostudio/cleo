/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CLEO_SESSION_STORAGE_KEY,
  parseCleoSession,
  saveCleoSession,
  serializeCleoSession,
} from './session'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

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

  it('round-trips inFlight mid-turn checkpoints', () => {
    const raw = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Long answer' },
        { id: 1, role: 'assistant', content: 'Working on it…' },
      ],
      2,
      { inFlight: true },
    )

    const parsed = parseCleoSession(raw!)
    expect(parsed?.inFlight).toBe(true)

    const idle = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Hi' },
        { id: 1, role: 'assistant', content: 'Hello.' },
      ],
      2,
    )
    expect(parseCleoSession(idle!)?.inFlight).toBeUndefined()
  })

  it('round-trips hidden Continue prompts', () => {
    const raw = serializeCleoSession(
      [
        { id: 0, role: 'user', content: 'Tell me about Mars' },
        { id: 1, role: 'assistant', content: 'Mars is…' },
        {
          id: 2,
          role: 'user',
          content: 'Continue from where you left off.',
          hidden: true,
        },
        { id: 3, role: 'assistant', content: '…red and dusty.' },
      ],
      4,
    )

    const parsed = parseCleoSession(raw!)
    expect(parsed?.messages[2]?.hidden).toBe(true)
    expect(parsed?.messages[0]?.hidden).toBeUndefined()
  })

  it('keeps the previous snapshot when localStorage write fails', () => {
    expect(
      saveCleoSession(
        [
          { id: 0, role: 'user', content: 'Keep me' },
          { id: 1, role: 'assistant', content: 'Okay.' },
        ],
        2,
      ),
    ).toBe(true)
    const prior = window.localStorage.getItem(CLEO_SESSION_STORAGE_KEY)
    expect(prior).toBeTruthy()

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(
      saveCleoSession(
        [{ id: 0, role: 'user', content: 'Replacement that cannot save' }],
        1,
      ),
    ).toBe(false)

    vi.mocked(Storage.prototype.setItem).mockRestore()
    expect(window.localStorage.getItem(CLEO_SESSION_STORAGE_KEY)).toBe(prior)
  })
})
