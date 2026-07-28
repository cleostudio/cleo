/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PlaceGalleryToolbar } from './place-gallery-toolbar'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('PlaceGalleryToolbar', () => {
  it('filters server-rendered gallery items by search without remounting the masonry', () => {
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar initialQuery="" initialCollection="all" />
        <ul>
          <li
            data-gallery-item
            data-collection="places"
            data-search-text="France Paris place"
          >
            France
          </li>
          <li
            data-gallery-item
            data-collection="space"
            data-search-text="Mars space"
          >
            Mars
          </li>
        </ul>
        <p data-gallery-status hidden />
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
    expect(window.location.search).toContain('q=mars')
    expect(screen.getByText('Showing 1 photograph')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Places' }))
    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(true)
    expect(window.location.search).toContain('collection=places')

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(france?.hidden).toBe(false)
    expect(mars?.hidden).toBe(false)
    expect(screen.queryByText(/Showing \d+ photograph/)).toBeNull()
  })

  it('clears search and collection on Escape', () => {
    render(
      <div data-place-gallery>
        <PlaceGalleryToolbar initialQuery="mars" initialCollection="space" />
        <ul>
          <li
            data-gallery-item
            data-collection="places"
            data-search-text="France Paris place"
            hidden
          >
            France
          </li>
          <li
            data-gallery-item
            data-collection="space"
            data-search-text="Mars space"
          >
            Mars
          </li>
        </ul>
        <p data-gallery-status>Showing 1 photograph</p>
        <p data-gallery-empty hidden>
          No photographs match that search.
        </p>
      </div>,
    )

    const input = screen.getByRole('searchbox')
    expect((input as HTMLInputElement).value).toBe('mars')

    fireEvent.keyDown(input, { key: 'Escape' })

    expect((input as HTMLInputElement).value).toBe('')
    expect(
      screen.getByText('France').closest('[data-gallery-item]')?.hidden,
    ).toBe(false)
    expect(screen.queryByText(/Showing \d+ photograph/)).toBeNull()
    expect(window.location.search).not.toContain('q=')
    expect(window.location.search).not.toContain('collection=')
  })
})
