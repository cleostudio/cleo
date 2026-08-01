// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  canRestoreGeolocationWithoutPrompt,
  getGeolocationPermissionState,
  hasRememberedGeolocationGrant,
  requestUserLocation,
  resetRememberedGeolocationGrantForTests,
} from './client-location'
import {
  readCachedUserLocation,
  resetLocationCacheForTests,
  writeCachedUserLocation,
} from './location-cache'

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

function mockPermissions(state: PermissionState | null) {
  originalPermissions ??= Object.getOwnPropertyDescriptor(navigator, 'permissions')

  if (state === null) {
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: undefined,
    })
    return
  }

  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    value: {
      query: vi.fn(async () => ({ state })),
    },
  })
}

afterEach(() => {
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation)
  } else {
    Reflect.deleteProperty(navigator, 'geolocation')
  }
  originalGeolocation = undefined

  if (originalPermissions) {
    Object.defineProperty(navigator, 'permissions', originalPermissions)
  } else {
    Reflect.deleteProperty(navigator, 'permissions')
  }
  originalPermissions = undefined

  window.localStorage.clear()
  resetRememberedGeolocationGrantForTests()
  resetLocationCacheForTests()
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
    expect(hasRememberedGeolocationGrant()).toBe(true)
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

  it('restores silently only when the browser already granted geolocation', async () => {
    mockPermissions('granted')
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    const location = requestUserLocation({ allowPrompt: false })

    await vi.waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: true,
          maximumAge: 60_000,
          timeout: 15_000,
        },
      )
    })

    resolvePosition?.({
      coords: {
        accuracy: 8,
        latitude: 35.6895,
        longitude: 139.6917,
      } as GeolocationCoordinates,
    } as GeolocationPosition)

    await expect(location).resolves.toMatchObject({
      latitude: 35.6895,
      longitude: 139.6917,
    })
  })

  it('does not call getCurrentPosition on silent restore when permission is still prompt', async () => {
    mockPermissions('prompt')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt')
    })

    await expect(requestUserLocation({ allowPrompt: false })).rejects.toThrow(
      'Location sharing needs an explicit allow before it can restore.',
    )
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('returns the cached fix on silent restore when permission is still prompt', async () => {
    mockPermissions('prompt')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt')
    })
    writeCachedUserLocation({
      accuracy: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: 'America/New_York',
    })

    await expect(requestUserLocation({ allowPrompt: false })).resolves.toEqual({
      accuracy: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: 'America/New_York',
    })
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('falls back to the cached fix when a quiet GPS restore times out', async () => {
    mockPermissions('granted')
    mockGeolocation((_success, error) => {
      error({
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        code: 3,
        message: 'timeout',
      } as GeolocationPositionError)
    })
    writeCachedUserLocation({
      accuracy: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: 'America/New_York',
    })

    await expect(requestUserLocation({ allowPrompt: false })).resolves.toEqual({
      accuracy: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: 'America/New_York',
    })
  })

  it('writes a cache entry when an interactive fix succeeds', async () => {
    const { setLocationSyncEnabled } = await import('./location-preference')
    setLocationSyncEnabled(true)
    mockGeolocation((success) => {
      success({
        coords: {
          accuracy: 8,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    await requestUserLocation()
    expect(readCachedUserLocation()).toMatchObject({
      latitude: 35.6895,
      longitude: 139.6917,
    })
  })

  it('does not rewrite the cache when Location is turned off before GPS returns', async () => {
    const { setLocationSyncEnabled } = await import('./location-preference')
    setLocationSyncEnabled(true)

    let resolvePosition: PositionCallback | undefined
    mockGeolocation((success) => {
      resolvePosition = success
    })

    const pending = requestUserLocation()
    setLocationSyncEnabled(false)

    resolvePosition?.({
      coords: {
        accuracy: 8,
        latitude: 35.6895,
        longitude: 139.6917,
      } as GeolocationCoordinates,
    } as GeolocationPosition)

    await expect(pending).resolves.toMatchObject({
      latitude: 35.6895,
      longitude: 139.6917,
    })
    expect(readCachedUserLocation()).toBeNull()
  })

  it('does not call getCurrentPosition on silent restore when permission is denied', async () => {
    mockPermissions('denied')
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt')
    })
    writeCachedUserLocation({
      accuracy: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timeZone: 'America/New_York',
    })

    await expect(requestUserLocation({ allowPrompt: false })).rejects.toThrow(
      'Location sharing was blocked. Allow it in your browser settings and try again.',
    )
    expect(getCurrentPosition).not.toHaveBeenCalled()
    expect(readCachedUserLocation()).toBeNull()
  })

  it('does not call getCurrentPosition on silent restore when Permissions API is unavailable and no prior grant', async () => {
    mockPermissions(null)
    const getCurrentPosition = mockGeolocation(() => {
      throw new Error('should not prompt')
    })

    await expect(requestUserLocation({ allowPrompt: false })).rejects.toThrow(
      'Location sharing needs an explicit allow before it can restore.',
    )
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })

  it('quietly restores when Permissions API is unavailable but this browser previously granted', async () => {
    mockPermissions(null)

    // Prior interactive grant remembers that this origin already authorized.
    mockGeolocation((success) => {
      success({
        coords: {
          accuracy: 8,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })
    await requestUserLocation()
    expect(hasRememberedGeolocationGrant()).toBe(true)

    let resolvePosition: PositionCallback | undefined
    const restoreGetCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    const location = requestUserLocation({ allowPrompt: false })

    await vi.waitFor(() => {
      expect(restoreGetCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: true,
          maximumAge: 60_000,
          timeout: 15_000,
        },
      )
    })

    resolvePosition?.({
      coords: {
        accuracy: 10,
        latitude: 35.6895,
        longitude: 139.6917,
      } as GeolocationCoordinates,
    } as GeolocationPosition)

    await expect(location).resolves.toMatchObject({
      latitude: 35.6895,
      longitude: 139.6917,
    })
  })

  it('clears the remembered grant when the browser later denies access', async () => {
    mockPermissions(null)
    mockGeolocation((success) => {
      success({
        coords: {
          accuracy: 8,
          latitude: 35.6895,
          longitude: 139.6917,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })
    await requestUserLocation()
    expect(hasRememberedGeolocationGrant()).toBe(true)

    mockGeolocation((_success, error) => {
      error({
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        code: 1,
        message: 'denied',
      } as GeolocationPositionError)
    })

    await expect(requestUserLocation()).rejects.toThrow(
      'Location sharing was blocked. Allow it in your browser settings and try again.',
    )
    expect(hasRememberedGeolocationGrant()).toBe(false)
  })
})

describe('canRestoreGeolocationWithoutPrompt', () => {
  it('allows granted, and unknown only after a remembered grant', () => {
    expect(canRestoreGeolocationWithoutPrompt('granted')).toBe(true)
    expect(canRestoreGeolocationWithoutPrompt('prompt')).toBe(false)
    expect(canRestoreGeolocationWithoutPrompt('denied')).toBe(false)
    expect(canRestoreGeolocationWithoutPrompt('unknown')).toBe(false)

    window.localStorage.setItem('cleo-location-browser-granted', '1')
    expect(canRestoreGeolocationWithoutPrompt('unknown')).toBe(true)
    expect(canRestoreGeolocationWithoutPrompt('prompt')).toBe(false)
  })
})

describe('getGeolocationPermissionState', () => {
  it('reports granted, prompt, and denied from the Permissions API', async () => {
    mockPermissions('granted')
    await expect(getGeolocationPermissionState()).resolves.toBe('granted')

    mockPermissions('prompt')
    await expect(getGeolocationPermissionState()).resolves.toBe('prompt')

    mockPermissions('denied')
    await expect(getGeolocationPermissionState()).resolves.toBe('denied')
  })

  it('returns unknown when the Permissions API is missing', async () => {
    mockPermissions(null)
    await expect(getGeolocationPermissionState()).resolves.toBe('unknown')
  })
})
