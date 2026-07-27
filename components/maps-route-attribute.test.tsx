// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.fn(() => '/maps')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { MapsRouteAttribute } from './maps-route-attribute'

afterEach(() => {
  cleanup()
  usePathname.mockReturnValue('/maps')
  document.documentElement.removeAttribute('data-maps-route')
})

describe('MapsRouteAttribute', () => {
  it('marks the document while on /maps and clears it elsewhere', () => {
    const { rerender, unmount } = render(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(true)

    usePathname.mockReturnValue('/')
    rerender(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(false)

    usePathname.mockReturnValue('/maps')
    rerender(<MapsRouteAttribute />)
    unmount()
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(false)
  })
})
