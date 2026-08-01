// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.fn(() => '/cleo')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { CleoRouteAttribute } from './cleo-route-attribute'

afterEach(() => {
  cleanup()
  usePathname.mockReturnValue('/cleo')
  document.documentElement.removeAttribute('data-cleo-route')
  document.documentElement.removeAttribute('data-cleo-empty')
})

describe('CleoRouteAttribute', () => {
  it('marks the document while on /cleo and clears it elsewhere', () => {
    const { rerender, unmount } = render(<CleoRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(true)

    usePathname.mockReturnValue('/')
    rerender(<CleoRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(false)
    expect(document.documentElement.hasAttribute('data-cleo-empty')).toBe(false)

    usePathname.mockReturnValue('/cleo')
    rerender(<CleoRouteAttribute />)
    document.documentElement.setAttribute('data-cleo-empty', '')
    unmount()
    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(false)
    expect(document.documentElement.hasAttribute('data-cleo-empty')).toBe(false)
  })

  it('clears Cleo layout locks in the same commit when leaving /cleo', () => {
    // Destination pages (Topics) must not paint under zero padding / hidden
    // rulers / empty overflow. useLayoutEffect clears before paint; a
    // post-paint useEffect would leave one locked frame.
    const { rerender } = render(<CleoRouteAttribute />)
    document.documentElement.setAttribute('data-cleo-empty', '')
    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(true)

    let sawLockedAfterLayout = false
    const observer = new MutationObserver(() => {
      // If the unlock were deferred to useEffect, a layout-phase reader
      // scheduled here would still see the Cleo locks.
      sawLockedAfterLayout =
        document.documentElement.hasAttribute('data-cleo-route') ||
        document.documentElement.hasAttribute('data-cleo-empty')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-cleo-route', 'data-cleo-empty'],
    })

    usePathname.mockReturnValue('/topics')
    rerender(<CleoRouteAttribute />)

    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(false)
    expect(document.documentElement.hasAttribute('data-cleo-empty')).toBe(false)
    expect(sawLockedAfterLayout).toBe(false)
    observer.disconnect()
  })
})
