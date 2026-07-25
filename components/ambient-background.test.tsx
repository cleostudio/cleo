// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { AmbientBackground } from './ambient-background'

afterEach(() => {
  cleanup()
  usePathname.mockReturnValue('/')
})

describe('AmbientBackground', () => {
  it('keeps edge fades outside Tailwind scroll utilities', () => {
    const { container } = render(<AmbientBackground />)

    expect(container.querySelectorAll('.viewport-edge-fade')).toHaveLength(2)
    expect(container.querySelector('[class*="scroll-fade"]')).toBeNull()
  })

  it('hides drafting column guides on the Cleo chat surface', () => {
    usePathname.mockReturnValue('/cleo')
    const { container } = render(<AmbientBackground />)

    expect(container.querySelector('.column-guides')).toBeNull()
    expect(container.querySelector('.column-rulers')).toBeNull()
    expect(container.querySelector('.paper-grain')).not.toBeNull()
  })
})
