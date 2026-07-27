/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { GuideIndexFilter } from './guide-index-filter'

afterEach(() => {
  cleanup()
})

describe('GuideIndexFilter', () => {
  it('filters guide rows and hides empty sections', () => {
    render(
      <div data-guide-index>
        <GuideIndexFilter label="Search countries" placeholder="Country" />
        <section data-guide-section>
          <ul>
            <li data-guide-item data-search-text="Japan Asia">
              Japan
            </li>
            <li data-guide-item data-search-text="France Europe">
              France
            </li>
          </ul>
        </section>
        <section data-guide-section>
          <ul>
            <li data-guide-item data-search-text="Brazil Americas">
              Brazil
            </li>
          </ul>
        </section>
        <p data-guide-empty hidden>
          No countries match that search.
        </p>
      </div>,
    )

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'japan' },
    })

    const japan = screen
      .getByText('Japan')
      .closest('[data-guide-item]') as HTMLElement | null
    const france = screen
      .getByText('France')
      .closest('[data-guide-item]') as HTMLElement | null
    const brazilSection = screen
      .getByText('Brazil')
      .closest('[data-guide-section]') as HTMLElement | null

    expect(japan?.hidden).toBe(false)
    expect(france?.hidden).toBe(true)
    expect(brazilSection?.hidden).toBe(true)
    expect(screen.getByText('No countries match that search.').hidden).toBe(
      true,
    )

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'nowhere' },
    })

    expect(screen.getByText('No countries match that search.').hidden).toBe(
      false,
    )
  })
})
