// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CLEO_SESSION_STORAGE_KEY,
  clearCleoSession,
  loadCleoSession,
  parseCleoSession,
  saveCleoSession,
} from './session'

const tinyPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

describe('parseCleoSession', () => {
  it('accepts a valid v1 snapshot and bumps nextMessageId past max id', () => {
    expect(
      parseCleoSession({
        v: 1,
        nextMessageId: 1,
        messages: [
          { id: 0, role: 'user', content: 'Hello' },
          { id: 4, role: 'assistant', content: 'Hi there' },
        ],
      }),
    ).toEqual({
      v: 1,
      nextMessageId: 5,
      messages: [
        { id: 0, role: 'user', content: 'Hello' },
        { id: 4, role: 'assistant', content: 'Hi there' },
      ],
    })
  })

  it('keeps image data URLs and completes in-flight activities', () => {
    const parsed = parseCleoSession({
      v: 1,
      nextMessageId: 2,
      messages: [
        {
          id: 0,
          role: 'user',
          content: 'What is this?',
          images: [{ url: tinyPng }],
        },
        {
          id: 1,
          role: 'assistant',
          content: 'A pixel.',
          activities: [
            {
              id: 'r1',
              kind: 'reasoning',
              status: 'in_progress',
              summary: 'Looking…',
            },
          ],
        },
      ],
    })

    expect(parsed?.messages[0]?.images).toEqual([{ url: tinyPng }])
    expect(parsed?.messages[1]?.activities?.[0]?.status).toBe('completed')
  })

  it('rejects unknown versions, empty threads, and invalid images', () => {
    expect(parseCleoSession({ v: 2, nextMessageId: 1, messages: [] })).toBeNull()
    expect(
      parseCleoSession({
        v: 1,
        nextMessageId: 1,
        messages: [{ id: 0, role: 'user', content: '' }],
      }),
    ).toBeNull()
    expect(
      parseCleoSession({
        v: 1,
        nextMessageId: 1,
        messages: [
          {
            id: 0,
            role: 'user',
            content: 'x',
            images: [{ url: 'https://example.com/a.png' }],
          },
        ],
      }),
    ).toBeNull()
  })
})

describe('sessionStorage helpers', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('round-trips a conversation through load/save/clear', () => {
    expect(
      saveCleoSession(
        [
          { id: 0, role: 'user', content: 'Orient me to Japan' },
          { id: 1, role: 'assistant', content: 'Start with [Japan](/explore/japan).' },
        ],
        2,
      ),
    ).toBe(true)

    expect(loadCleoSession()).toEqual({
      v: 1,
      nextMessageId: 2,
      messages: [
        { id: 0, role: 'user', content: 'Orient me to Japan' },
        {
          id: 1,
          role: 'assistant',
          content: 'Start with [Japan](/explore/japan).',
        },
      ],
    })

    clearCleoSession()
    expect(sessionStorage.getItem(CLEO_SESSION_STORAGE_KEY)).toBeNull()
    expect(loadCleoSession()).toBeNull()
  })

  it('clears storage when saving an empty message list', () => {
    sessionStorage.setItem(
      CLEO_SESSION_STORAGE_KEY,
      JSON.stringify({
        v: 1,
        nextMessageId: 1,
        messages: [{ id: 0, role: 'user', content: 'old' }],
      }),
    )

    expect(saveCleoSession([], 0)).toBe(true)
    expect(loadCleoSession()).toBeNull()
  })

  it('retries without images when the quota is exceeded', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    setItem.mockImplementationOnce(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })

    expect(
      saveCleoSession(
        [
          {
            id: 0,
            role: 'user',
            content: 'See this',
            images: [{ url: tinyPng }],
          },
          { id: 1, role: 'assistant', content: 'Noted.' },
        ],
        2,
      ),
    ).toBe(true)

    const stored = loadCleoSession()
    expect(stored?.messages[0]).toEqual({
      id: 0,
      role: 'user',
      content: 'See this',
    })
    expect(stored?.messages[0]?.images).toBeUndefined()
    expect(setItem).toHaveBeenCalledTimes(2)
  })
})
