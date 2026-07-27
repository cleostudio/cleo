/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { WritingIndexToolbar } from './writing-index-toolbar'

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('WritingIndexToolbar', () => {
  it('filters Writing rows and syncs ?q=', async () => {
    window.history.replaceState(null, '', '/blog?q=marble')

    render(
      <div data-writing-index>
        <WritingIndexToolbar />
        <p data-writing-empty hidden>
          No essays match that search.
        </p>
        <section data-writing-year>
          <ul>
            <li data-writing-item data-search-text="Pale Blue Marble earth">
              Pale Blue Marble
            </li>
            <li data-writing-item data-search-text="Quiet Moon essay">
              Quiet Moon
            </li>
          </ul>
        </section>
      </div>,
    )

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toHaveProperty('value', 'marble')
    })
    expect(
      (
        screen
          .getByText('Pale Blue Marble')
          .closest('[data-writing-item]') as HTMLElement
      ).hidden,
    ).toBe(false)
    expect(
      (
        screen.getByText('Quiet Moon').closest('[data-writing-item]') as HTMLElement
      ).hidden,
    ).toBe(true)

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'quiet' },
    })
    expect(window.location.search).toBe('?q=quiet')
    expect(
      (
        screen.getByText('Quiet Moon').closest('[data-writing-item]') as HTMLElement
      ).hidden,
    ).toBe(false)
  })
})
