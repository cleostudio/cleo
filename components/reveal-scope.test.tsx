// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RevealScope } from './reveal-scope'

type ObserverCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void

let observerCallback: ObserverCallback | undefined
let observed: Element[] = []

class StubIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback
  }
  observe(element: Element) {
    observed.push(element)
  }
  unobserve(element: Element) {
    observed = observed.filter((candidate) => candidate !== element)
  }
  disconnect() {
    observed = []
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  observerCallback = undefined
  observed = []

  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver)
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  // Every child must read as below the fold for RevealScope to take an
  // interest in it; jsdom otherwise reports an all-zero rect.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: window.innerHeight,
  } as DOMRect)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function renderScope() {
  return render(
    <RevealScope>
      <p>First block</p>
      <p>Second block</p>
    </RevealScope>,
  )
}

/** Arm the observer, then report one child as scrolled into view. */
function scrollFirstBlockIntoView() {
  vi.advanceTimersByTime(750)
  const target = observed[0]
  if (!target) throw new Error('RevealScope never observed a below-fold block')
  observerCallback?.([{ isIntersecting: true, target }])
  return target
}

describe('RevealScope', () => {
  it('reveals a block once it scrolls into view', () => {
    // Keep the queued frame under test control rather than the environment's.
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })

    renderScope()
    const target = scrollFirstBlockIntoView()

    expect(target.classList.contains('reveal-pending')).toBe(true)

    frames[0]?.(0)

    expect(target.classList.contains('reveal-in')).toBe(true)
    expect(target.classList.contains('reveal-pending')).toBe(false)
  })

  it('cancels the queued reveal frame when the reader navigates away', () => {
    vi.stubGlobal('requestAnimationFrame', () => 7)
    const cancel = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancel)

    const { unmount } = renderScope()
    scrollFirstBlockIntoView()

    unmount()

    // Without this the frame still runs and touches detached nodes.
    expect(cancel).toHaveBeenCalledWith(7)
  })
})
