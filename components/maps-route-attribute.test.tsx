// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MapsRouteAttribute } from './maps-route-attribute'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-maps-route')
  usePathname.mockReset()
  usePathname.mockImplementation(() => '/')
})

describe('MapsRouteAttribute', () => {
  it('sets data-maps-route on /maps and clears it elsewhere', () => {
    usePathname.mockReturnValue('/maps')
    const { rerender } = render(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(true)

    usePathname.mockReturnValue('/explore')
    rerender(<MapsRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-maps-route')).toBe(false)
  })
})
