import type { UserLocation } from '~/lib/cleo/location'

const locationOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10_000,
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

/** Requests one fresh browser position for the active Cleo session. */
export function requestUserLocation(): Promise<UserLocation> {
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
