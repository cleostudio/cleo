// @vitest-environment jsdom

import { readFileSync } from 'node:fs'
import path from 'node:path'

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

  it('clears empty-state overflow when leaving /cleo', () => {
    const { rerender } = render(<CleoRouteAttribute />)
    document.documentElement.setAttribute('data-cleo-empty', '')

    usePathname.mockReturnValue('/topics')
    rerender(<CleoRouteAttribute />)

    expect(document.documentElement.hasAttribute('data-cleo-route')).toBe(false)
    expect(document.documentElement.hasAttribute('data-cleo-empty')).toBe(false)
  })

  it('syncs route locks with useLayoutEffect so destinations paint unlocked', () => {
    // useEffect would leave Topics (and other exits) one frame under Cleo's
    // zero padding / hidden rulers / empty overflow lock. Named React hooks
    // are not spyable under Vite ESM, so pin the layout-phase contract here.
    const source = readFileSync(
      path.join(process.cwd(), 'components/cleo-route-attribute.tsx'),
      'utf8',
    )

    expect(source).toMatch(/^import \{ useLayoutEffect \} from 'react'$/m)
    expect(source).toMatch(/useLayoutEffect\s*\(/)
    expect(source).not.toMatch(/^import \{ useEffect \} from 'react'$/m)
  })
})
