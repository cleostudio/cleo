// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { SiteChrome } from './site-chrome'

afterEach(() => {
  cleanup()
  usePathname.mockReturnValue('/')
})

describe('SiteChrome', () => {
  it('uses the scrolling public shell off Cleo', () => {
    const { container } = render(
      <SiteChrome footer={<span data-footer="" />}>
        <p>page</p>
      </SiteChrome>,
    )

    const shell = container.firstElementChild
    expect(shell?.className).toContain('min-h-screen')
    expect(shell?.className).toContain('pb-20')
    expect(shell?.className).not.toContain('overflow-hidden')
  })

  it('locks the Cleo chat surface to the viewport', () => {
    usePathname.mockReturnValue('/cleo')
    const { container } = render(
      <SiteChrome footer={null}>
        <p>cleo</p>
      </SiteChrome>,
    )

    const shell = container.firstElementChild
    expect(shell?.className).toContain('h-svh')
    expect(shell?.className).toContain('overflow-hidden')
    expect(shell?.className).not.toContain('min-h-screen')
    expect(shell?.querySelector('main')?.className).not.toContain('pt-14')
  })
})
