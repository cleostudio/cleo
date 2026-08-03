/** @vitest-environment jsdom */

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    href: string
    prefetch?: boolean
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('~/components/copyright-year', () => ({
  CopyrightYear: () => 2026,
}))

vi.mock('~/components/footer-clock', () => ({
  FooterClock: () => <span>clock</span>,
}))

vi.mock('~/components/footer-coordinates', () => ({
  FooterCoordinates: () => <span>coords</span>,
}))

import { SiteFooter } from '~/components/site-footer'
import { allTopics } from '~/lib/topics'

afterEach(() => {
  cleanup()
})

function treeByLabel(label: RegExp) {
  const heading = screen.getByRole('heading', { name: label })
  const tree = heading.closest('.footer-tree')
  expect(tree).not.toBeNull()
  return within(tree as HTMLElement)
}

describe('SiteFooter', () => {
  it('keeps Gallery under Index, ordered like the dock', () => {
    render(<SiteFooter locale="en" />)

    const topics = treeByLabel(/topics/i)
    const index = treeByLabel(/index/i)

    expect(
      topics.getAllByRole('link').map((link) => link.textContent?.trim()),
    ).toEqual([
      'All topics',
      ...allTopics().map((topic) => topic.name),
    ])
    expect(topics.queryByRole('link', { name: /^Gallery$/i })).toBeNull()

    expect(
      index.getAllByRole('link').map((link) => [
        link.textContent?.trim(),
        link.getAttribute('href'),
      ]),
    ).toEqual([
      ['Home', '/'],
      ['Writing', '/blog'],
      ['Gallery', '/gallery'],
      ['Explore', '/explore'],
      ['Ask', '/cleo'],
    ])
  })
})
