import { afterEach, describe, expect, it, vi } from 'vitest'

import { createStreamUiBuffer } from './stream-ui-buffer'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('createStreamUiBuffer', () => {
  it('coalesces text, activities, and images into one snapshot', () => {
    const buffer = createStreamUiBuffer()
    buffer.appendText('Hello')
    buffer.appendText(' world')
    buffer.applyActivity({
      id: 'r1',
      kind: 'reasoning',
      status: 'in_progress',
      summary: 'Thinking',
    })
    buffer.applyActivity({
      id: 'r1',
      kind: 'reasoning',
      status: 'completed',
      summary: 'Done thinking',
    })
    buffer.applyImage({ id: 'img1', url: 'data:image/jpeg;base64,aaa' })
    buffer.applyImage({ id: 'img1', url: 'data:image/jpeg;base64,bbb' })

    expect(buffer.consume()).toEqual({
      content: 'Hello world',
      activities: [
        {
          id: 'r1',
          kind: 'reasoning',
          status: 'completed',
          summary: 'Done thinking',
        },
      ],
      images: [{ id: 'img1', url: 'data:image/jpeg;base64,bbb' }],
    })
    expect(buffer.consume()).toBeNull()
  })

  it('schedules a single animation-frame flush', () => {
    const callbacks: FrameRequestCallback[] = []
    const raf = vi.fn((cb: FrameRequestCallback) => {
      callbacks.push(cb)
      return callbacks.length
    })
    const caf = vi.fn()
    const buffer = createStreamUiBuffer()
    const flush = vi.fn(() => {
      buffer.consume()
    })

    buffer.appendText('a')
    buffer.schedule(flush, raf)
    buffer.appendText('b')
    buffer.schedule(flush, raf)

    expect(raf).toHaveBeenCalledTimes(1)
    expect(flush).not.toHaveBeenCalled()

    callbacks[0]?.(0)
    expect(flush).toHaveBeenCalledTimes(1)
    expect(buffer.content).toBe('ab')

    buffer.cancel(caf)
  })

  it('flushNow cancels a pending frame before flushing', () => {
    const callbacks: FrameRequestCallback[] = []
    const raf = vi.fn((cb: FrameRequestCallback) => {
      callbacks.push(cb)
      return 7
    })
    const caf = vi.fn()
    const buffer = createStreamUiBuffer()
    const flush = vi.fn()

    buffer.appendText('x')
    buffer.schedule(flush, raf)
    buffer.flushNow(flush, caf)

    expect(caf).toHaveBeenCalledWith(7)
    expect(flush).toHaveBeenCalledTimes(1)
  })
})
