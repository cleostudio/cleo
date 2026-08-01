import { parseUserLocation, type UserLocation } from '~/lib/cleo/location'

const LOCATION_CACHE_STORAGE_KEY = 'cleo-location-last'
/** Drop cached fixes older than a day — preference stays on, GPS can refresh. */
const LOCATION_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

type StoredLocation = UserLocation & {
  cachedAt: number
}

function canUseStorage() {
  return typeof window !== 'undefined'
}

/**
 * Last successful browser fix while Location sync is on.
 * Survives refresh/exit so the footer and Cleo do not flash “unavailable”
 * when quiet GPS restore cannot run (e.g. Permissions API still `prompt`
 * after “Allow this time”).
 */
export function readCachedUserLocation(): UserLocation | null {
  if (!canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(LOCATION_CACHE_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) {
      clearCachedUserLocation()
      return null
    }

    const cachedAt = (parsed as StoredLocation).cachedAt
    if (
      typeof cachedAt !== 'number' ||
      !Number.isFinite(cachedAt) ||
      Date.now() - cachedAt > LOCATION_CACHE_MAX_AGE_MS
    ) {
      clearCachedUserLocation()
      return null
    }

    const location = parseUserLocation(parsed)
    if (!location) {
      clearCachedUserLocation()
      return null
    }

    return location
  } catch {
    return null
  }
}

export function writeCachedUserLocation(location: UserLocation) {
  if (!canUseStorage()) return

  const stored: StoredLocation = {
    ...location,
    cachedAt: Date.now(),
  }

  try {
    window.localStorage.setItem(LOCATION_CACHE_STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* private mode */
  }
}

export function clearCachedUserLocation() {
  if (!canUseStorage()) return

  try {
    window.localStorage.removeItem(LOCATION_CACHE_STORAGE_KEY)
  } catch {
    /* private mode */
  }
}

/** @internal Vitest helper */
export function resetLocationCacheForTests() {
  clearCachedUserLocation()
}
