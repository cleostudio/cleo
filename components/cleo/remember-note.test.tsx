// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const useSession = vi.fn()

vi.mock('~/lib/auth-client', () => ({
  authClient: {
    useSession: () => useSession(),
  },
}))

import { RememberNote } from './remember-note'

describe('RememberNote', () => {
  beforeEach(() => {
    useSession.mockReset()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      }),
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders nothing for guests', () => {
    useSession.mockReturnValue({ data: null, isPending: false })
    const { container } = render(<RememberNote />)
    expect(container.childElementCount).toBe(0)
  })

  it('saves a note for signed-in users', async () => {
    useSession.mockReturnValue({
      data: { user: { id: 'user_ada', name: 'Ada' } },
      isPending: false,
    })

    render(<RememberNote />)
    fireEvent.click(screen.getByRole('button', { name: /remember a preference/i }))
    fireEvent.change(screen.getByLabelText(/preference to remember/i), {
      target: { value: 'Prefer metric' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/cleo/memory',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ note: 'Prefer metric' }),
        }),
      )
    })
    expect(screen.getByText('Saved')).toBeTruthy()
  })
})
