/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HomeSiteSearch } from './home-site-search'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

afterEach(() => {
  cleanup()
  push.mockClear()
})

describe('HomeSiteSearch', () => {
  const hits = [
    {
      id: 'explore:japan',
      kind: 'explore' as const,
      title: 'Japan',
      subtitle: 'Asia',
      href: '/explore/japan',
      searchText: 'japan asia jp',
    },
    {
      id: 'space:mars',
      kind: 'space' as const,
      title: 'Mars',
      subtitle: 'Planet',
      href: '/space/mars',
      searchText: 'mars planet',
    },
  ]

  it('exposes combobox semantics and keyboard navigation', () => {
    render(<HomeSiteSearch hits={hits} />)

    const input = screen.getByRole('combobox', { name: 'Search the catalog' })
    expect(input.getAttribute('aria-expanded')).toBe('false')

    fireEvent.change(input, { target: { value: 'ma' } })

    expect(input.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('option', { name: /Mars/ }).getAttribute('aria-selected')).toBe(
      'true',
    )

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(push).toHaveBeenCalledWith('/space/mars')

    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveProperty('value', '')
    expect(input.getAttribute('aria-expanded')).toBe('false')
  })
})
