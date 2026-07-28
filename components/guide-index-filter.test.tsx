/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { GuideIndexFilter } from './guide-index-filter'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('GuideIndexFilter', () => {
  it('seeds from initialQuery on first paint', () => {
    render(
      <div data-guide-index>
        <GuideIndexFilter
          label="Search countries"
          placeholder="Country"
          initialQuery="japan"
        />
        <section data-guide-section>
          <h2>
            Asia
            <span data-guide-count>2</span>
          </h2>
          <ul>
            <li data-guide-item data-search-text="Japan Asia">
              Japan
            </li>
            <li data-guide-item data-search-text="France Europe">
              France
            </li>
          </ul>
        </section>
        <p data-guide-empty hidden>
          No countries match that search.
        </p>
      </div>,
    )

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).value,
    ).toBe('japan')
    const france = screen
      .getByText('France')
      .closest('[data-guide-item]') as HTMLElement | null
    expect(france?.hidden).toBe(true)
    expect(
      screen.getByText('Asia').querySelector('[data-guide-count]')?.textContent,
    ).toBe('1')
  })

  it('filters guide rows, updates live counts, and syncs ?q=', () => {
    render(
      <div data-guide-index>
        <GuideIndexFilter
          label="Search countries"
          placeholder="Country"
          initialQuery=""
        />
        <section data-guide-section>
          <h2>
            Asia
            <span data-guide-count>2</span>
          </h2>
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
          <h2>
            Americas
            <span data-guide-count>1</span>
          </h2>
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
    const asiaCount = screen
      .getByText('Asia')
      .querySelector('[data-guide-count]')

    expect(japan?.hidden).toBe(false)
    expect(france?.hidden).toBe(true)
    expect(brazilSection?.hidden).toBe(true)
    expect(asiaCount?.textContent).toBe('1')
    expect(window.location.search).toContain('q=japan')
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
