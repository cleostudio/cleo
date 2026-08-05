// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountMemoryNotes } from './account-memory-notes'

describe('AccountMemoryNotes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          note: {
            id: 'n-new',
            note: 'Prefer short answers',
            createdAt: '2026-01-03T00:00:00.000Z',
          },
        }),
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('lists initial notes and posts a new note when storage is available', async () => {
    render(
      <AccountMemoryNotes
        stored
        initialNotes={[
          {
            id: 'n1',
            note: 'Interested in rivers',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ]}
      />,
    )

    expect(screen.getByText('Interested in rivers')).toBeTruthy()

    fireEvent.change(screen.getByLabelText(/new memory note/i), {
      target: { value: 'Prefer short answers' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add note/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/cleo/memory',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ note: 'Prefer short answers' }),
        }),
      )
    })
    expect(screen.getByText('Prefer short answers')).toBeTruthy()
  })

  it('disables writes when storage is unavailable', () => {
    render(<AccountMemoryNotes stored={false} initialNotes={[]} />)
    expect(screen.getByText(/memory storage is unavailable/i)).toBeTruthy()
    expect(
      (screen.getByLabelText(/new memory note/i) as HTMLInputElement).disabled,
    ).toBe(true)
  })
})
