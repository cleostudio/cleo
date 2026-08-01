// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const usePathname = vi.hoisted(() => vi.fn(() => '/topics'))

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import { SiteFooterSlot } from './site-footer-slot'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

beforeEach(() => {
  usePathname.mockReturnValue('/topics')
})

describe('SiteFooterSlot', () => {
  it('keeps the footer mounted but hidden on /cleo', () => {
    usePathname.mockReturnValue('/cleo')
    const { container } = render(
      <SiteFooterSlot>
        <span>footer body</span>
      </SiteFooterSlot>,
    )

    expect(screen.getByText('footer body')).not.toBeNull()
    expect(container.firstElementChild?.classList.contains('hidden')).toBe(true)
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('exposes the footer on public routes without an extra layout box', () => {
    const { container } = render(
      <SiteFooterSlot>
        <span>footer body</span>
      </SiteFooterSlot>,
    )

    expect(screen.getByText('footer body')).not.toBeNull()
    expect(container.firstElementChild?.classList.contains('contents')).toBe(true)
    expect(container.firstElementChild?.classList.contains('hidden')).toBe(false)
    expect(container.firstElementChild?.hasAttribute('aria-hidden')).toBe(false)
  })
})
