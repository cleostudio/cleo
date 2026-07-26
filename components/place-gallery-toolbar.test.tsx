/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const replace = vi.fn()
const useSearchParams = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => '/gallery',
  useRouter: () => ({ replace }),
  useSearchParams: () => useSearchParams(),
}))

import { PlaceGalleryToolbar } from './place-gallery-toolbar'

afterEach(() => {
  cleanup()
  replace.mockReset()
})

beforeEach(() => {
  useSearchParams.mockReturnValue(new URLSearchParams())
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
    expect(replace).toHaveBeenCalledWith('/gallery?filter=Europe', {
      scroll: false,
    })

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'mars' },
    })

    expect(france?.hidden).toBe(true)
    expect(mars?.hidden).toBe(true)
    expect(screen.getByText('0 photographs')).toBeTruthy()
    expect(
      screen.getByText('No photographs match that filter.').hidden,
    ).toBe(false)
    expect(replace).toHaveBeenCalledWith('/gallery?filter=Europe&q=mars', {
      scroll: false,
    })
  })

  it('hydrates filter and search from the URL', () => {
    useSearchParams.mockReturnValue(
      new URLSearchParams('filter=Solar+System&q=Mars'),
    )

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

    expect(screen.getByRole('searchbox')).toHaveProperty('value', 'Mars')
    expect(
      screen.getByRole('radio', { name: 'Solar System' }).getAttribute(
        'aria-checked',
      ),
    ).toBe('true')
    expect(
      (
        screen.getByText('France').closest('[data-gallery-item]') as HTMLElement
      ).hidden,
    ).toBe(true)
    expect(
      (
        screen.getByText('Mars').closest('[data-gallery-item]') as HTMLElement
      ).hidden,
    ).toBe(false)
  })
})
