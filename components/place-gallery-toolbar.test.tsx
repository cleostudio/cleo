/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PlaceGalleryToolbar } from './place-gallery-toolbar'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('PlaceGalleryToolbar', () => {
  it('filters server-rendered gallery items without remounting the masonry', () => {
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar
          filterKeys={['Europe', 'Solar System']}
          totalCount={2}
        />
        <ul>
          <li
            data-gallery-item
            data-filter-key="Europe"
            data-search-text="France Paris place"
          >
            France
          </li>
          <li
            data-gallery-item
            data-filter-key="Solar System"
            data-search-text="Mars space"
          >
            Mars
          </li>
        </ul>
        <p data-gallery-empty hidden>
          No photographs match that filter.
        </p>
      </div>,
    )

    expect(screen.getByText('2 photographs')).toBeTruthy()

    fireEvent.click(screen.getByRole('radio', { name: 'Europe' }))

    const france = screen
      .getByText('France')
      .closest('[data-gallery-item]') as HTMLElement | null
    const mars = screen
      .getByText('Mars')
      .closest('[data-gallery-item]') as HTMLElement | null
    expect(france?.hidden).toBe(false)
    expect(mars?.hidden).toBe(true)
    expect(screen.getByText('1 photograph')).toBeTruthy()

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'mars' },
    })

    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(true)
    expect(screen.getByText('0 photographs')).toBeTruthy()
    expect(
      screen.getByText('No photographs match that filter.').hidden,
    ).toBe(false)
  })

  it('seeds the search box from the gallery ?q= query', async () => {
    window.history.replaceState({}, '', '/gallery?q=France')

    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar
          filterKeys={['Europe', 'Solar System']}
          totalCount={2}
        />
        <ul>
          <li
            data-gallery-item
            data-filter-key="Europe"
            data-search-text="France Paris place"
          >
            France
          </li>
          <li
            data-gallery-item
            data-filter-key="Solar System"
            data-search-text="Mars space"
          >
            Mars
          </li>
        </ul>
        <p data-gallery-empty hidden>
          No photographs match that filter.
        </p>
      </div>,
    )

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toHaveProperty('value', 'France')
    })
    await waitFor(() => {
      expect(screen.getByText('1 photograph')).toBeTruthy()
    })

    const france = screen
      .getByText('France')
      .closest('[data-gallery-item]') as HTMLElement | null
    const mars = screen
      .getByText('Mars')
      .closest('[data-gallery-item]') as HTMLElement | null
    expect(france?.hidden).toBe(false)
    expect(mars?.hidden).toBe(true)
  })
})
