/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ArticleContents } from './article-contents'
import { ArticleInfobox } from './article-infobox'
import { ArticleLead } from './article-lead'

describe('reference article primitives', () => {
  it('renders a semantic contents navigation with in-page links', () => {
    render(
      <ArticleContents
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'sources', label: 'Sources' },
        ]}
      />,
    )

    const navigation = screen.getByRole('navigation', { name: 'Article contents' })
    expect(navigation.querySelector('ol')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('href')).toBe('#overview')
    expect(screen.getByRole('link', { name: 'Sources' }).getAttribute('href')).toBe('#sources')
  })

  it('keeps fact values and its single primary signal in the infobox', () => {
    const { container } = render(
      <ArticleInfobox
        id="quick-facts"
        facts={[
          { label: 'Capital', value: 'Rabat', isPrimary: true },
          { label: 'Currency', value: 'Moroccan dirham' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'At a glance' }).id).toBe('quick-facts')
    expect(screen.getByText('Capital')).toBeTruthy()
    expect(screen.getByText('Rabat')).toBeTruthy()
    expect(screen.getByText('Moroccan dirham')).toBeTruthy()
    expect(container.querySelectorAll('.spec-signal[aria-hidden="true"]')).toHaveLength(1)
  })

  it('turns newline-separated article copy into readable paragraphs', () => {
    const { container } = render(<ArticleLead about={'First paragraph.\n\nSecond paragraph.'} />)

    expect(container.querySelectorAll('.article-lead > p')).toHaveLength(2)
    expect(screen.getByText('First paragraph.')).toBeTruthy()
    expect(screen.getByText('Second paragraph.')).toBeTruthy()
  })
})
