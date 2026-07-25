// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { DockFallback } from './dock'

afterEach(cleanup)

describe('DockFallback', () => {
  it('keeps the dock shell useful while route state resolves', () => {
    render(<DockFallback locale="en" />)

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(navigation.getAttribute('aria-busy')).toBe('true')
    expect(navigation.style.viewTransitionName).toBe('site-dock')
    expect(screen.getByRole('link', { name: /Home/ }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: /Writing/ }).getAttribute('href')).toBe(
      '/blog',
    )
    expect(screen.getByRole('link', { name: /Explore/ }).getAttribute('href')).toBe(
      '/explore',
    )
    expect(screen.getByRole('link', { name: /Topics/ }).getAttribute('href')).toBe(
      '/topics',
    )
    expect(screen.getByRole('link', { name: /Cleo/ }).getAttribute('href')).toBe(
      '/cleo',
    )

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(hrefs.indexOf('/explore')).toBeLessThan(hrefs.indexOf('/topics'))
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })
})
