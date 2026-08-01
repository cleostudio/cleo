// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setLocationSyncEnabled } from '~/lib/cleo/location-preference'

const usePathname = vi.hoisted(() => vi.fn(() => '/topics'))

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
}))

import {
  FooterCoordinates,
  resetFooterCoordinatesCacheForTests,
} from './footer-coordinates'

let originalGeolocation: PropertyDescriptor | undefined
let originalPermissions: PropertyDescriptor | undefined

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
  resetFooterCoordinatesCacheForTests()
  usePathname.mockReturnValue('/topics')
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  resetFooterCoordinatesCacheForTests()
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
  originalGeolocation = undefined
  originalPermissions = undefined
  vi.restoreAllMocks()
})

describe('FooterCoordinates', () => {
  it('requests a fresh high-accuracy browser position only after location sync is enabled', async () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    const { container } = render(<FooterCoordinates />)

    expect(getCurrentPosition).not.toHaveBeenCalled()
    expect(screen.getByText('Location unavailable')).not.toBeNull()

    await act(async () => {
      setLocationSyncEnabled(true)
    })

    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      },
    )
    expect(screen.getByText('Locating…')).not.toBeNull()

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    expect(screen.getByText('151.20930° E')).not.toBeNull()
    expect(container.querySelector('.footer-geo')?.getAttribute('aria-label')).toContain(
      'Accuracy reported within about 8 meters.',
    )
    expect(container.textContent).not.toContain('22.4820° N')
  })

  it('does not re-prompt on refresh when the preference is remembered but permission is still prompt', async () => {
    mockPermissions('prompt')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt on restore')
    })

    setLocationSyncEnabled(true)
    render(<FooterCoordinates />)

    await waitFor(() => {
      expect(screen.getByText('Location unavailable')).not.toBeNull()
    })
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('quietly restores coordinates on refresh when browser permission is already granted', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    setLocationSyncEnabled(true)
    render(<FooterCoordinates />)

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    expect(screen.getByText('151.20930° E')).not.toBeNull()
  })

  it('clears a pending position when location sync is disabled', async () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    render(<FooterCoordinates />)

    await act(async () => {
      setLocationSyncEnabled(true)
    })
    expect(getCurrentPosition).toHaveBeenCalled()

    await act(async () => {
      setLocationSyncEnabled(false)
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('Location unavailable')).not.toBeNull()
    expect(screen.queryByText('33.86882° S')).toBeNull()
    expect(screen.queryByText('151.20930° E')).toBeNull()
  })

  it('does not display stale coordinates when location access fails', async () => {
    mockPermissions('granted')
    let rejectPosition: PositionErrorCallback | undefined
    mockGeolocation((_success, error) => {
      rejectPosition = error
    })

    setLocationSyncEnabled(true)
    render(<FooterCoordinates />)

    await waitFor(() => {
      expect(rejectPosition).toBeTypeOf('function')
    })

    await act(async () => {
      rejectPosition?.({
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        code: 2,
        message: 'unavailable',
      } as GeolocationPositionError)
    })

    expect(screen.getByText('Location unavailable')).not.toBeNull()
    expect(screen.queryByText('22.4820° N')).toBeNull()
    expect(screen.queryByText('113.9247° E')).toBeNull()
  })

  it('keeps the last stamp visible across remount while a refresh is in flight', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    setLocationSyncEnabled(true)
    const first = render(<FooterCoordinates />)

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    first.unmount()

    resolvePosition = undefined
    render(<FooterCoordinates />)

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    expect(screen.getByText('151.20930° E')).not.toBeNull()
    expect(screen.queryByText('Locating…')).toBeNull()

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 12,
          latitude: -33.87,
          longitude: 151.21,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.87000° S')).not.toBeNull()
    expect(screen.getByText('151.21000° E')).not.toBeNull()
  })

  it('quietly revalidates when leaving /cleo without flashing Locating…', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    usePathname.mockReturnValue('/cleo')
    setLocationSyncEnabled(true)
    const { rerender } = render(<FooterCoordinates />)

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()

    resolvePosition = undefined
    usePathname.mockReturnValue('/topics')
    rerender(<FooterCoordinates />)

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    expect(screen.queryByText('Locating…')).toBeNull()

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(2)
    })
  })

  it('clears the stamp when leaving /cleo after permission was revoked', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    usePathname.mockReturnValue('/cleo')
    setLocationSyncEnabled(true)
    const { rerender } = render(<FooterCoordinates />)

    await waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    })

    await act(async () => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()

    mockPermissions('denied')
    getCurrentPosition.mockImplementation(() => {
      throw new Error('should not prompt after revoke')
    })

    usePathname.mockReturnValue('/topics')
    rerender(<FooterCoordinates />)

    await waitFor(() => {
      expect(screen.getByText('Location unavailable')).not.toBeNull()
    })
    expect(screen.queryByText('33.86882° S')).toBeNull()
    expect(screen.queryByText('Locating…')).toBeNull()
  })
})
