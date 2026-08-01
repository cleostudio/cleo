import {
  clearCachedUserLocation,
  readCachedUserLocation,
  writeCachedUserLocation,
} from '~/lib/cleo/location-cache'
import type { UserLocation } from '~/lib/cleo/location'

const LOCATION_BROWSER_GRANT_KEY = 'cleo-location-browser-granted'
const LOCATION_BROWSER_GRANTED = '1'

/** Interactive toggle: always prefer a fresh high-accuracy fix. */
const interactiveLocationOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10_000,
}

/**
 * Quiet restore after refresh: accept a recent cached fix so leaving/reloading
 * the app does not depend on an immediate GPS lock.
 */
const restoreLocationOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 60_000,
  timeout: 15_000,
}

export type GeolocationPermissionState = 'granted' | 'prompt' | 'denied' | 'unknown'

export type RequestUserLocationOptions = {
  /**
   * When false, never open the browser permission dialog. Used on page restore
   * so a remembered Preferences toggle does not re-prompt every refresh.
   * Defaults to true for explicit user actions (toggling Location on).
   */
  allowPrompt?: boolean
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

/** True after this browser successfully returned a position at least once. */
export function hasRememberedGeolocationGrant() {
  if (!canUseStorage()) return false
  try {
    return window.localStorage.getItem(LOCATION_BROWSER_GRANT_KEY) === LOCATION_BROWSER_GRANTED
  } catch {
    return false
  }
}

function rememberGeolocationGrant() {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(LOCATION_BROWSER_GRANT_KEY, LOCATION_BROWSER_GRANTED)
  } catch {
    /* private mode */
  }
}

function clearRememberedGeolocationGrant() {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(LOCATION_BROWSER_GRANT_KEY)
  } catch {
    /* private mode */
  }
}

/** @internal Vitest helper — clears the remembered browser grant between cases. */
export function resetRememberedGeolocationGrantForTests() {
  clearRememberedGeolocationGrant()
}

function locationError(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    clearRememberedGeolocationGrant()
    clearCachedUserLocation()
    return new Error('Location sharing was blocked. Allow it in your browser settings and try again.')
  }

  if (error.code === error.TIMEOUT) {
    return new Error('Location sharing timed out. Try again.')
  }

  return new Error('Your location could not be determined. Try again.')
}

function browserTimeZone() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (!timeZone) {
    throw new Error('Your browser could not determine a time zone.')
  }

  return timeZone
}

/** Read the browser geolocation permission without prompting. */
export async function getGeolocationPermissionState(): Promise<GeolocationPermissionState> {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'unknown'
  }

  try {
    const status = await navigator.permissions.query({
      name: 'geolocation',
    })

    if (
      status.state === 'granted' ||
      status.state === 'prompt' ||
      status.state === 'denied'
    ) {
      return status.state
    }

    return 'unknown'
  } catch {
    return 'unknown'
  }
}

function readPosition(
  timeZone: string,
  positionOptions: PositionOptions,
): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next: UserLocation = {
          accuracy: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeZone,
        }
        rememberGeolocationGrant()
        writeCachedUserLocation(next)
        resolve(next)
      },
      (error) => reject(locationError(error)),
      positionOptions,
    )
  })
}

function cachedLocationOrReject(reason: Error): Promise<UserLocation> {
  const cached = readCachedUserLocation()
  if (cached) return Promise.resolve(cached)
  return Promise.reject(reason)
}

/**
 * Whether a quiet restore may call getCurrentPosition without risking a
 * permission dialog.
 *
 * - `granted` — browser already authorized; safe.
 * - `prompt` / `denied` — never auto-call (would re-prompt or fail loudly).
 * - `unknown` — Permissions API missing/unsupported (notably some Safari
 *   builds). Only proceed when this origin previously returned a position,
 *   so refresh can restore without re-prompting first-time visitors.
 */
export function canRestoreGeolocationWithoutPrompt(
  permission: GeolocationPermissionState,
) {
  if (permission === 'granted') return true
  if (permission === 'unknown' && hasRememberedGeolocationGrant()) return true
  return false
}

/**
 * Requests one fresh browser position after location sync is enabled.
 * Pass `{ allowPrompt: false }` on restore so refresh does not re-prompt.
 */
export async function requestUserLocation(
  options: RequestUserLocationOptions = {},
): Promise<UserLocation> {
  const allowPrompt = options.allowPrompt !== false

  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.reject(new Error('Location sharing is unavailable in this browser.'))
  }

  let timeZone: string

  try {
    timeZone = browserTimeZone()
  } catch (error) {
    return Promise.reject(
      error instanceof Error
        ? error
        : new Error('Your browser could not determine a time zone.'),
    )
  }

  if (!allowPrompt) {
    const permission = await getGeolocationPermissionState()

    // Only call getCurrentPosition when it cannot open a permission dialog.
    // `prompt` must not be called — that re-opens the dialog on every refresh
    // for "Allow once" / ephemeral grants. Fall back to the last cached fix
    // so refresh/exit still shows coordinates while Location stays on.
    // `denied` means the browser revoked access — drop the cache.
    if (!canRestoreGeolocationWithoutPrompt(permission)) {
      if (permission === 'denied') {
        clearRememberedGeolocationGrant()
        clearCachedUserLocation()
        return Promise.reject(
          new Error(
            'Location sharing was blocked. Allow it in your browser settings and try again.',
          ),
        )
      }

      return cachedLocationOrReject(
        new Error('Location sharing needs an explicit allow before it can restore.'),
      )
    }

    try {
      return await readPosition(timeZone, restoreLocationOptions)
    } catch (error) {
      // Keep a recent reading through transient GPS timeouts/failures.
      if (
        error instanceof Error &&
        (error.message.includes('blocked') || error.message.includes('explicit allow'))
      ) {
        throw error
      }
      return cachedLocationOrReject(
        error instanceof Error
          ? error
          : new Error('Your location could not be determined. Try again.'),
      )
    }
  }

  return readPosition(timeZone, interactiveLocationOptions)
}
