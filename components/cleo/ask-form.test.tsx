// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('thinking-orbs', () => ({
  ThinkingOrb: () => <span>Thinking</span>,
}))

vi.mock('./activity-panel', () => ({
  ActivityPanel: () => null,
}))

vi.mock('./liquid-glass', () => ({
  LiquidGlass: () => null,
}))

vi.mock('./markdown', () => ({
  Markdown: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('./zoomable-message-image', () => ({
  ZoomableMessageImage: () => null,
}))

import { AskForm } from './ask-form'

let originalGeolocation: PropertyDescriptor | undefined
let originalScrollIntoView: PropertyDescriptor | undefined

function mockGeolocation(
  implementation: (
    success: PositionCallback,
    error: PositionErrorCallback,
    options?: PositionOptions,
  ) => void,
) {
  originalGeolocation ??= Object.getOwnPropertyDescriptor(navigator, 'geolocation')
  const getCurrentPosition = vi.fn(implementation)

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  })

  return getCurrentPosition
}

beforeEach(() => {
  originalScrollIntoView ??= Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollIntoView',
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation)
  } else {
    Reflect.deleteProperty(navigator, 'geolocation')
  }
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView)
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  }
  originalGeolocation = undefined
  originalScrollIntoView = undefined
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('AskForm location sharing', () => {
  it('sends browser location only after the user explicitly shares it', async () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })
    const fetchMock = vi.fn(async () => new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    render(<AskForm />)

    expect(
      screen.getByText('Optional — share precise coordinates and time zone with OpenAI for this chat.'),
    ).not.toBeNull()
    expect(getCurrentPosition).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Share your precise location and time zone with Cleo',
      }),
    )

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    act(() => {
      resolvePosition?.({
        coords: {
          accuracy: 9,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    await waitFor(() => {
      expect(screen.getByText(/Location shared/)).not.toBeNull()
    })

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'What should I do this evening?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit
    const payload = JSON.parse(request.body as string)

    expect(payload.location).toEqual({
      accuracy: 9,
      latitude: 35.6895,
      longitude: 139.6917,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    expect(payload.messages[0]).toEqual({
      content: 'What should I do this evening?',
      role: 'user',
    })
  })
})
