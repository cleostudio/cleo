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
  it('marks the document while on /cleo and /cleo/[threadId], clears elsewhere', () => {
    const { rerender, unmount } = render(<CleoRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(true)

    usePathname.mockReturnValue('/cleo/11111111-1111-4111-8111-111111111111')
    rerender(<CleoRouteAttribute />)
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
})
