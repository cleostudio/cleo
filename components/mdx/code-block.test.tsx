// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CodeBlockPre } from './code-block'

/** Advance fake timers and let React flush whatever state they set. */
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

const writeText = vi.fn().mockResolvedValue(undefined)

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  // jsdom lays everything out at zero height, so `innerText` is empty; the
  // copy handler reads it to decide whether there is anything to copy.
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: true,
    get() {
      return this.textContent
    },
  })
})

afterEach(() => {
  cleanup()
  writeText.mockClear()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function renderCodeBlock() {
  return render(
    <CodeBlockPre>
      <code>const answer = 42</code>
    </CodeBlockPre>,
  )
}

describe('CodeBlockPre', () => {
  it('confirms the copy, then returns to the idle icon', () => {
    renderCodeBlock()
    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(writeText).toHaveBeenCalledWith('const answer = 42')
    expect(button.getAttribute('aria-label')).toBe('Code copied')

    advance(1500)

    expect(button.getAttribute('aria-label')).toBe('Copy code')
  })

  it('drops the pending reset when the post unmounts mid-confirmation', () => {
    const { unmount } = renderCodeBlock()

    fireEvent.click(screen.getByRole('button'))
    expect(vi.getTimerCount()).toBe(1)

    unmount()

    // A timer surviving here would fire `setCopied` against a torn-down tree.
    expect(vi.getTimerCount()).toBe(0)
  })

  it('restarts the window when the reader copies again', () => {
    renderCodeBlock()
    const button = screen.getByRole('button')

    fireEvent.click(button)
    advance(1400)
    fireEvent.click(button)
    advance(1400)

    expect(vi.getTimerCount()).toBe(1)
    expect(button.getAttribute('aria-label')).toBe('Code copied')
  })
})
