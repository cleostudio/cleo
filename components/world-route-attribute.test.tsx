// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { WorldRouteAttribute } from './world-route-attribute'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-world-route')
  usePathname.mockReset()
  usePathname.mockImplementation(() => '/')
})

describe('WorldRouteAttribute', () => {
  it('sets data-world-route on /world and clears it elsewhere', () => {
    usePathname.mockReturnValue('/world')
    const { rerender } = render(<WorldRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-world-route')).toBe(true)

    usePathname.mockReturnValue('/explore')
    rerender(<WorldRouteAttribute />)
    expect(document.documentElement.hasAttribute('data-world-route')).toBe(false)
  })
})
