/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PlaceGalleryToolbar } from './place-gallery-toolbar'

afterEach(() => {
  cleanup()
})

describe('PlaceGalleryToolbar', () => {
  it('filters server-rendered gallery items by search without remounting the masonry', () => {
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar totalCount={2} />
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

    expect(screen.getByText('2 photographs')).toBeTruthy()
    expect(screen.getByLabelText('Search photographs')).toBeTruthy()
    expect(screen.queryByText('Search')).toBeNull()
    expect(screen.queryByText('Collection')).toBeNull()
    expect(screen.queryByRole('radio', { name: 'Europe' })).toBeNull()

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
    expect(screen.getByText('1 photograph')).toBeTruthy()

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'nowhere' },
    })

    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(true)
    expect(screen.getByText('0 photographs')).toBeTruthy()
    expect(
      screen.getByText('No photographs match that search.').hidden,
    ).toBe(false)
  })
})
