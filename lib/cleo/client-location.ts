import type { UserLocation } from '~/lib/cleo/location'

const locationOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10_000,
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

function locationError(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
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

function readPosition(timeZone: string): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          accuracy: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timeZone,
        })
      },
      (error) => reject(locationError(error)),
      locationOptions,
    )
  })
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

    // Only restore quietly when the browser already granted access. `prompt`
    // and unknown must not call getCurrentPosition — that re-opens the dialog
    // on every refresh for "Allow once" / ephemeral grants.
    if (permission !== 'granted') {
      return Promise.reject(
        new Error('Location sharing needs an explicit allow before it can restore.'),
      )
    }
  }

  return readPosition(timeZone)
}
