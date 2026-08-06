// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ANCHOR_TOP_GAP_PX,
  groupThreadMessages,
  resolveThreadScrollTarget,
  STREAMING_SCROLL_EARLY_TRIGGER_PX,
  STREAMING_SCROLL_PROMPT_BUFFER_PX,
} from './stick-to-bottom'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('groupThreadMessages', () => {
  it('groups each visible user with following assistants', () => {
    expect(
      groupThreadMessages([
        { id: 1, role: 'user' },
        { id: 2, role: 'assistant' },
        { id: 3, role: 'user' },
        { id: 4, role: 'assistant' },
      ]),
    ).toEqual([
      {
        userMessageId: 1,
        messages: [
          { id: 1, role: 'user' },
          { id: 2, role: 'assistant' },
        ],
      },
      {
        userMessageId: 3,
        messages: [
          { id: 3, role: 'user' },
          { id: 4, role: 'assistant' },
        ],
      },
    ])
  })

  it('keeps Continue assistants on the previous turn', () => {
    expect(
      groupThreadMessages([
        { id: 1, role: 'user' },
        { id: 2, role: 'assistant' },
        { id: 3, role: 'user', hidden: true },
        { id: 4, role: 'assistant' },
      ]),
    ).toEqual([
      {
        userMessageId: 1,
        messages: [
          { id: 1, role: 'user' },
          { id: 2, role: 'assistant' },
          { id: 4, role: 'assistant' },
        ],
      },
    ])
  })
})

describe('resolveThreadScrollTarget', () => {
  function mountThread(options: {
    turnHeight: number
    visibleChildHeight: number
    promptTop: number
    viewportHeight?: number
  }) {
    const viewportHeight = options.viewportHeight ?? 800
    const scroll = document.createElement('div')
    const content = document.createElement('div')
    const turn = document.createElement('div')
    const child = document.createElement('div')
    const prompt = document.createElement('form')

    turn.dataset.messageGroup = 'turn'
    turn.dataset.userMessageId = '7'
    prompt.setAttribute('data-prompt-form', '')

    scroll.append(content)
    content.append(turn)
    turn.append(child)
    document.body.append(scroll, prompt)

    vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: viewportHeight,
      left: 0,
      right: 400,
      width: 400,
      height: viewportHeight,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    vi.spyOn(scroll, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: viewportHeight,
      left: 0,
      right: 400,
      width: 400,
      height: viewportHeight,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    vi.spyOn(turn, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 100 + options.turnHeight,
      left: 0,
      right: 400,
      width: 400,
      height: options.turnHeight,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    })
    vi.spyOn(child, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 100 + options.visibleChildHeight,
      left: 0,
      right: 400,
      width: 400,
      height: options.visibleChildHeight,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    })
    vi.spyOn(prompt, 'getBoundingClientRect').mockReturnValue({
      top: options.promptTop,
      bottom: viewportHeight,
      left: 0,
      right: 400,
      width: 400,
      height: viewportHeight - options.promptTop,
      x: 0,
      y: options.promptTop,
      toJSON: () => ({}),
    })

    return content
  }

  it('anchors the latest turn below the top gap', () => {
    const contentElement = mountThread({
      turnHeight: 120,
      visibleChildHeight: 80,
      promptTop: 640,
    })

    const result = resolveThreadScrollTarget({
      targetScrollTop: 999,
      contentElement,
      isActiveTurnInProgress: true,
      overflowPinnedTurnId: null,
    })

    expect(result.scrollTop).toBe(100 - ANCHOR_TOP_GAP_PX)
    expect(result.overflowPinnedTurnId).toBeNull()
  })

  it('falls through to bottom stick when the turn nears the prompt', () => {
    const viewportHeight = 800
    const promptTop = 640
    const promptClearance = viewportHeight - promptTop
    const earlyTriggerOffset = Math.max(
      STREAMING_SCROLL_EARLY_TRIGGER_PX,
      promptClearance + STREAMING_SCROLL_PROMPT_BUFFER_PX,
    )
    const contentElement = mountThread({
      turnHeight: 900,
      visibleChildHeight: viewportHeight - earlyTriggerOffset + 1,
      promptTop,
      viewportHeight,
    })

    const result = resolveThreadScrollTarget({
      targetScrollTop: 1234,
      contentElement,
      isActiveTurnInProgress: true,
      overflowPinnedTurnId: null,
    })

    expect(result.scrollTop).toBe(1234)
    expect(result.overflowPinnedTurnId).toBe('7')
  })

  it('keeps bottom stick after the turn ends when overflow was pinned', () => {
    const viewportHeight = 800
    const promptTop = 640
    const promptClearance = viewportHeight - promptTop
    const earlyTriggerOffset = Math.max(
      STREAMING_SCROLL_EARLY_TRIGGER_PX,
      promptClearance + STREAMING_SCROLL_PROMPT_BUFFER_PX,
    )
    const contentElement = mountThread({
      turnHeight: 900,
      visibleChildHeight: viewportHeight - earlyTriggerOffset + 1,
      promptTop,
      viewportHeight,
    })

    const result = resolveThreadScrollTarget({
      targetScrollTop: 1500,
      contentElement,
      isActiveTurnInProgress: false,
      overflowPinnedTurnId: '7',
    })

    expect(result.scrollTop).toBe(1500)
    expect(result.overflowPinnedTurnId).toBe('7')
  })
})
