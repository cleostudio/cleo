// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MessageFeedback } from './message-feedback'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('MessageFeedback', () => {
  it('posts rating and optional note to the feedback API', async () => {
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: true, stored: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(
      <MessageFeedback
        assistant="See [Japan](/explore/japan)."
        prompt="Tell me about Japan"
        turnId="turn_ui_1"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Bad response' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const first = fetchMock.mock.calls[0]
    expect(String(first?.[0])).toBe('/api/cleo/feedback')
    expect(JSON.parse(String(first?.[1]?.body))).toMatchObject({
      turnId: 'turn_ui_1',
      rating: 'down',
      prompt: 'Tell me about Japan',
      assistant: 'See [Japan](/explore/japan).',
    })

    fireEvent.change(screen.getByLabelText('Optional feedback note'), {
      target: { value: 'Missing a better opener' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toMatchObject({
      rating: 'down',
      comment: 'Missing a better opener',
    })
  })
})
