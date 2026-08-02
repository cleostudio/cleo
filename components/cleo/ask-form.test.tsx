// @vitest-environment jsdom

import { StrictMode } from 'react'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
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

import { writeCachedUserLocation } from '~/lib/cleo/location-cache'
import { setLocationSyncEnabled } from '~/lib/cleo/location-preference'
import { readThreadsStore, upsertThread } from '~/lib/cleo/threads'

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

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
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

describe('AskForm arrivals', () => {

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
})

describe('AskForm chat sidebar', () => {
  it('lists a New chat control and persists a finished turn into history', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('min-width: 64rem'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    const fetchMock = stubStream('A cold desert world.')
    render(<AskForm />)

    const history = screen.getByRole('complementary', { name: 'Chat history' })
    const newChat = within(history).getByRole('button', { name: 'New chat' })
    expect(newChat).toBeTruthy()
    // Open sidebar keeps New chat as an icon-only control.
    expect(newChat.textContent?.replace(/\s+/g, '')).toBe('')

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'What is Mars like?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('A cold desert world.')).toBeTruthy()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'What is Mars like?' }),
      ).toBeTruthy()
    })
    expect(readThreadsStore().threads[0]?.title).toBe('What is Mars like?')
  })

  it('restores the active thread from localStorage on mount', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('min-width: 64rem'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    upsertThread({
      id: 'thread-restore-1',
      nextMessageId: 3,
      messages: [
        { id: 1, role: 'user', content: 'Orient me to Japan' },
        { id: 2, role: 'assistant', content: 'An archipelago in the Pacific.' },
      ],
    })

    render(<AskForm />)

    await waitFor(() => {
      expect(screen.getByText('An archipelago in the Pacific.')).toBeTruthy()
      expect(document.querySelector('.user-message-text')?.textContent).toBe(
        'Orient me to Japan',
      )
    })
    expect(
      within(screen.getByRole('complementary', { name: 'Chat history' }))
        .getByRole('button', { name: 'Orient me to Japan' })
        .getAttribute('aria-current'),
    ).toBe('true')
  })

  it('opens the mobile history drawer above page chrome', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<AskForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Open chat history' }))

    await waitFor(() => {
      expect(
        document.documentElement.hasAttribute('data-cleo-sidebar-open'),
      ).toBe(true)
      expect(
        document.getElementById('cleo-sidebar')?.hasAttribute('data-open'),
      ).toBe(true)
      expect(document.getElementById('cleo-sidebar')?.getAttribute('role')).toBe(
        'dialog',
      )
    })

    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(
        document.documentElement.hasAttribute('data-cleo-sidebar-open'),
      ).toBe(false)
    })
  })

  it('collapses the desktop rail from the header sidebar control', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('min-width: 64rem'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<AskForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Close sidebar' }))

    await waitFor(() => {
      expect(
        document.documentElement.hasAttribute('data-cleo-sidebar-collapsed'),
      ).toBe(true)
      expect(window.localStorage.getItem('cleo-sidebar-collapsed')).toBe('1')
    })

    // Closed chrome is icon-only: open history + new chat (no visible label).
    expect(screen.getByRole('button', { name: 'Open chat history' })).toBeTruthy()
    const closedNewChat = screen.getByRole('button', { name: 'New chat' })
    expect(closedNewChat.textContent?.replace(/\s+/g, '')).toBe('')

    fireEvent.click(screen.getByRole('button', { name: 'Open chat history' }))

    await waitFor(() => {
      expect(
        document.documentElement.hasAttribute('data-cleo-sidebar-collapsed'),
      ).toBe(false)
    })
    const openNewChat = within(
      screen.getByRole('complementary', { name: 'Chat history' }),
    ).getByRole('button', { name: 'New chat' })
    expect(openNewChat.textContent?.replace(/\s+/g, '')).toBe('')
  })

  it('starts a blank composer when New chat is pressed', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('min-width: 64rem'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    stubStream('Kept in history.')
    render(<AskForm />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
      target: { value: 'First thread' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Kept in history.')).toBeTruthy()
    })

    fireEvent.click(
      within(screen.getByRole('complementary', { name: 'Chat history' })).getByRole(
        'button',
        { name: 'New chat' },
      ),
    )

    await waitFor(() => {
      expect(screen.queryByText('Kept in history.')).toBeNull()
      expect(document.querySelector('.user-message-text')).toBeNull()
    })
    expect(screen.getByRole('button', { name: 'First thread' })).toBeTruthy()
  })
})
