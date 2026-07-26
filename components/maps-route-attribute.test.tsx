// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { MapsRouteAttribute } from './maps-route-attribute'

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-maps-route')
  usePathname.mockReset()
  usePathname.mockImplementation(() => '/')
})

describe('MapsRouteAttribute', () => {
  it('sets data-maps-route on /maps', () => {
    usePathname.mockReturnValue('/maps')
    render(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(true)
  })

  it('clears the attribute off /maps', () => {
    usePathname.mockReturnValue('/maps')
    const { rerender } = render(<MapsRouteAttribute />)
    usePathname.mockReturnValue('/explore')
    rerender(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(false)
  })

  it('cleans up on unmount', () => {
    usePathname.mockReturnValue('/maps')
    const { unmount } = render(<MapsRouteAttribute />)
    unmount()
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(false)
  })
})
