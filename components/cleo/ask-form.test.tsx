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
