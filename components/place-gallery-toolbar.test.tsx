/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PlaceGalleryToolbar } from './place-gallery-toolbar'

afterEach(() => {
  cleanup()
})

describe('PlaceGalleryToolbar', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/gallery')
  })

  it('filters server-rendered gallery items by search without remounting the masonry', () => {
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar />
        <ul>
          <li data-gallery-item data-search-text="France Paris place">
            France
          </li>
          <li data-gallery-item data-search-text="Mars space">
            Mars
          </li>
        </ul>
        <p data-gallery-empty hidden>
          No photographs match that search.
        </p>
      </div>,
    )

    expect(screen.getByLabelText('Search photographs')).toBeTruthy()
    expect(screen.queryByText(/^\d+ photographs?$/)).toBeNull()
    expect(screen.queryByText('Search')).toBeNull()
    expect(screen.queryByText('Collection')).toBeNull()

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'mars' },
    })

    const france = screen
      .getByText('France')
      .closest('[data-gallery-item]') as HTMLElement | null
    const mars = screen
      .getByText('Mars')
      .closest('[data-gallery-item]') as HTMLElement | null
    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(false)
    expect(window.location.search).toBe('?q=mars')

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'nowhere' },
    })

    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(true)
    expect(
      screen.getByText('No photographs match that search.').hidden,
    ).toBe(false)
  })

  it('hydrates the search box from ?q= on load', () => {
    window.history.replaceState({}, '', '/gallery?q=Japan')
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar />
        <ul>
          <li data-gallery-item data-search-text="Japan Tokyo place">
            Japan
          </li>
          <li data-gallery-item data-search-text="Mars space">
            Mars
          </li>
        </ul>
        <p data-gallery-empty hidden>
          No photographs match that search.
        </p>
      </div>,
    )

    expect(screen.getByRole('searchbox')).toHaveProperty('value', 'Japan')
    expect(
      screen.getByText('Japan').closest('[data-gallery-item]') as HTMLElement,
    ).toMatchObject({ hidden: false })
    expect(
      screen.getByText('Mars').closest('[data-gallery-item]') as HTMLElement,
    ).toMatchObject({ hidden: true })
  })
})
