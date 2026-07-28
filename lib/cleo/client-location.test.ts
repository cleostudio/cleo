// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { requestUserLocation } from './client-location'

let originalGeolocation: PropertyDescriptor | undefined

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

afterEach(() => {
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation)
  } else {
    Reflect.deleteProperty(navigator, 'geolocation')
  }
  originalGeolocation = undefined
  vi.restoreAllMocks()
})

describe('requestUserLocation', () => {
  it('requests a fresh high-accuracy position only when called', async () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    const location = requestUserLocation()

    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      },
    )

    resolvePosition?.({
      coords: {
        accuracy: 8,
        latitude: 35.6895,
        longitude: 139.6917,
      } as GeolocationCoordinates,
    } as GeolocationPosition)

    await expect(location).resolves.toEqual({
      accuracy: 8,
      latitude: 35.6895,
      longitude: 139.6917,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  })

  it('explains a denied browser permission without exposing location data', async () => {
    let rejectPosition: PositionErrorCallback | undefined
    mockGeolocation((_success, error) => {
      rejectPosition = error
    })

    const location = requestUserLocation()

    rejectPosition?.({
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      code: 1,
      message: 'denied',
    } as GeolocationPositionError)

    await expect(location).rejects.toThrow(
      'Location sharing was blocked. Allow it in your browser settings and try again.',
    )
  })
})
