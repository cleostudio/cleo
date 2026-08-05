// @vitest-environment jsdom

import { Activity, StrictMode } from 'react'
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

vi.mock('~/lib/auth-client', () => ({
  authClient: {
    useSession: () => ({ data: null, isPending: false }),
  },
}))

import { writeCachedUserLocation } from '~/lib/cleo/location-cache'
import { setLocationSyncEnabled } from '~/lib/cleo/location-preference'

import { AskForm } from './ask-form'

let originalGeolocation: PropertyDescriptor | undefined
let originalPermissions: PropertyDescriptor | undefined
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

function mockPermissions(state: PermissionState) {
  originalPermissions ??= Object.getOwnPropertyDescriptor(navigator, 'permissions')
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    value: {
      query: vi.fn(async () => ({ state })),
    },
  })
}

beforeEach(() => {
  window.localStorage.clear()
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
  window.localStorage.clear()
  window.history.replaceState(null, '', '/')
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation)
  } else {
    Reflect.deleteProperty(navigator, 'geolocation')
  }
  if (originalPermissions) {
    Object.defineProperty(navigator, 'permissions', originalPermissions)
  } else {
    Reflect.deleteProperty(navigator, 'permissions')
  }
  if (originalScrollIntoView) {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView)
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  }
  originalGeolocation = undefined
  originalPermissions = undefined
  originalScrollIntoView = undefined
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('AskForm location context', () => {
  it('requests location only after dock preferences enable location sync', async () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    render(<AskForm />)

    expect(getCurrentPosition).not.toHaveBeenCalled()

    await act(async () => {
      setLocationSyncEnabled(true)
    })

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 9,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'What should I do this evening?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1]
    expect(request).toBeDefined()
    const payload = JSON.parse(request?.body as string)

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

  it('stops attaching location as soon as the dock setting is disabled', async () => {
    let resolvePosition: PositionCallback | undefined
    mockGeolocation((success) => {
      resolvePosition = success
    })
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    render(<AskForm />)

    await act(async () => {
      setLocationSyncEnabled(true)
    })
    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 9,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })
    await act(async () => {
      setLocationSyncEnabled(false)
    })

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'Tell me about Mars.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(request?.body as string)

    expect(payload).not.toHaveProperty('location')
  })

  it('keeps location out of the request when browser permission is denied', async () => {
    let rejectPosition: PositionErrorCallback | undefined
    mockGeolocation((_success, error) => {
      rejectPosition = error
    })
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    render(<AskForm />)

    await act(async () => {
      setLocationSyncEnabled(true)
    })

    await act(async () => {
      rejectPosition?.({
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        code: 1,
        message: 'denied',
      } as GeolocationPositionError)
    })

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'Tell me about Japan.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(request?.body as string)

    expect(payload).not.toHaveProperty('location')
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('does not re-prompt on refresh when preference is on but browser permission is still prompt', async () => {
    mockPermissions('prompt')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt on restore')
    })

    setLocationSyncEnabled(true)
    render(<AskForm />)

    await act(async () => {
      await Promise.resolve()
    })

    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('uses the cached fix on refresh when permission is still prompt', async () => {
    mockPermissions('prompt')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt on restore')
    })
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    writeCachedUserLocation({
      accuracy: 12,
      latitude: 48.8566,
      longitude: 2.3522,
      timeZone: 'Europe/Paris',
    })
    setLocationSyncEnabled(true)
    render(<AskForm />)

    await act(async () => {
      await Promise.resolve()
    })
    expect(getCurrentPosition).not.toHaveBeenCalled()

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'What is nearby?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(String(request?.body)) as {
      location?: { latitude: number; longitude: number }
    }
    expect(payload.location).toMatchObject({
      latitude: 48.8566,
      longitude: 2.3522,
    })
  })

  it('quietly restores location on refresh when browser permission is already granted', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockResolvedValue(new Response('{"type":"text","delta":"Hi"}\n'))
    vi.stubGlobal('fetch', fetchMock)

    setLocationSyncEnabled(true)
    render(<AskForm />)

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 12,
          latitude: 48.8566,
          longitude: 2.3522,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'What is nearby?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    const request = fetchMock.mock.calls[0]?.[1]
    const payload = JSON.parse(request?.body as string)

    expect(payload.location).toEqual({
      accuracy: 12,
      latitude: 48.8566,
      longitude: 2.3522,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  })
})

describe('AskForm arrivals', () => {
  /** Answers on the next tick, and honours the abort signal like `fetch` does. */
  function stubStream(text: string) {
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise((resolve, reject) => {
          const fail = () => reject(new DOMException('Aborted', 'AbortError'))
          if (init?.signal?.aborted) return fail()
          init?.signal?.addEventListener('abort', fail)
          setTimeout(
            () =>
              resolve(
                new Response(`${JSON.stringify({ type: 'text', delta: text })}\n`),
              ),
            0,
          )
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  function sentMessages(fetchMock: ReturnType<typeof stubStream>) {
    return JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string).messages
  }

  it('waits for a question on an ordinary visit', async () => {
    const fetchMock = stubStream('Hi')
    window.history.replaceState(null, '', '/cleo')

    render(<AskForm />)

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Message' })).toBeTruthy()
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('asks the question handed over in the URL, once, then clears it', async () => {
    const fetchMock = stubStream('Japan sits on four plates.')
    window.history.replaceState(null, '', '/cleo?q=Orient%20me%20to%20Japan')

    render(<AskForm />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    expect(sentMessages(fetchMock)).toEqual([
      { content: 'Orient me to Japan', role: 'user' },
    ])

    // The transcript owns the question now, so a reload starts clean.
    expect(window.location.search).toBe('')
    await waitFor(() => {
      expect(screen.getByText('Orient me to Japan')).toBeTruthy()
      expect(screen.getByText('Japan sits on four plates.')).toBeTruthy()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('asks a question passed in as a prop', async () => {
    const fetchMock = stubStream('Both are rocky.')

    render(<AskForm initialPrompt="Compare Mars and Earth" />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    expect(sentMessages(fetchMock)).toEqual([
      { content: 'Compare Mars and Earth', role: 'user' },
    ])
  })

  it('shows turn feedback after a completed assistant reply', async () => {
    stubStream('Japan sits on four plates.')
    window.history.replaceState(null, '', '/cleo?q=Orient%20me%20to%20Japan')

    render(<AskForm />)

    await waitFor(() => {
      expect(screen.getByText('Japan sits on four plates.')).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Good response' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Bad response' })).toBeTruthy()
    })
  })

  it('survives a Strict Mode remount without aborting the turn', async () => {
    const fetchMock = stubStream('Europa hides an ocean.')
    window.history.replaceState(null, '', '/cleo?q=Why%20is%20Europa%20interesting')

    render(
      <StrictMode>
        <AskForm />
      </StrictMode>,
    )

    await waitFor(() => {
      expect(screen.getByText('Europa hides an ocean.')).toBeTruthy()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(false)
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy()
  })

  it('keeps the question when the chat shell is torn down before the send', async () => {
    const fetchMock = stubStream('Europa hides an ocean.')
    window.history.replaceState(null, '', '/cleo?q=Why%20is%20Europa%20interesting')

    // Arrive and leave again inside the tick the send waits for.
    const first = render(<AskForm />)
    first.unmount()
    expect(fetchMock).not.toHaveBeenCalled()

    render(<AskForm />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    expect(sentMessages(fetchMock)).toEqual([
      { content: 'Why is Europa interesting', role: 'user' },
    ])
  })

  /** A chat shell the router can park in its bfcache and bring back. */
  function CachedShell({ visible }: { visible: boolean }) {
    return (
      <Activity mode={visible ? 'visible' : 'hidden'}>
        <AskForm />
      </Activity>
    )
  }

  // The router keeps recently visited trees alive in a hidden <Activity>
  // (Cache Components bfcache), so the second Ask Cleo handoff of a session
  // reaches the chat shell that already answered the first one.
  it('asks a second handoff that arrives at a re-activated chat shell', async () => {
    const fetchMock = stubStream('Everest, at 8,849 metres.')
    window.history.replaceState(null, '', '/cleo?q=Weather%20tomorrow')

    const view = render(<CachedShell visible />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
    expect(window.location.search).toBe('')

    // Leave Cleo, then arrive again from the homepage search with a new
    // question — same tree, same component instance.
    view.rerender(<CachedShell visible={false} />)
    window.history.replaceState(null, '', '/cleo?q=Tallest%20mountain')
    view.rerender(<CachedShell visible />)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    // The new question joins the conversation the shell kept, rather than
    // wiping an exchange the visitor can still see.
    const secondBody = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)
    expect(secondBody.messages).toEqual([
      { content: 'Weather tomorrow', role: 'user' },
      { content: 'Everest, at 8,849 metres.', role: 'assistant' },
      { content: 'Tallest mountain', role: 'user' },
    ])
    expect(window.location.search).toBe('')
  })

  it('frees the prompt dock when a re-activated shell had a turn in flight', async () => {
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >()
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    window.history.replaceState(null, '', '/cleo?q=Weather%20tomorrow')

    const view = render(<CachedShell visible />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Stop generating' })).toBeTruthy()
    })

    // Leaving Cleo aborts the turn; coming back must not find a frozen dock.
    view.rerender(<CachedShell visible={false} />)
    view.rerender(<CachedShell visible />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy()
    })
    expect(
      screen.getByRole('textbox', { name: 'Message' }).hasAttribute('disabled'),
    ).toBe(false)
  })
})
