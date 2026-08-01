import { clearCachedUserLocation } from '~/lib/cleo/location-cache'

const LOCATION_SYNC_CHANGE_EVENT = 'cleo-location-sync-change'
const LOCATION_SYNC_STORAGE_KEY = 'cleo-location-sync'
const LOCATION_SYNC_ENABLED = 'enabled'

function canUseStorage() {
  return typeof window !== 'undefined'
}

/** Location sync is deliberately opt-in so Cleo never prompts on first visit. */
export function isLocationSyncEnabled() {
  if (!canUseStorage()) return false

  try {
    return window.localStorage.getItem(LOCATION_SYNC_STORAGE_KEY) === LOCATION_SYNC_ENABLED
  } catch {
    return false
  }
}

export type SetLocationSyncOptions = {
  /**
   * When false, listeners must not open the browser geolocation prompt
   * (account hydrate / cross-device restore). Defaults to true for dock toggles.
   */
  allowPrompt?: boolean
}

export function setLocationSyncEnabled(
  enabled: boolean,
  options: SetLocationSyncOptions = {},
) {
  if (!canUseStorage()) return

  try {
    if (enabled) {
      window.localStorage.setItem(LOCATION_SYNC_STORAGE_KEY, LOCATION_SYNC_ENABLED)
    } else {
      window.localStorage.removeItem(LOCATION_SYNC_STORAGE_KEY)
      // Drop the last fix with the preference so refresh cannot resurrect it.
      clearCachedUserLocation()
    }
  } catch {
    return
  }

  const allowPrompt = options.allowPrompt ?? true
  window.dispatchEvent(
    new CustomEvent<LocationSyncChange>(LOCATION_SYNC_CHANGE_EVENT, {
      detail: { allowPrompt, enabled },
    }),
  )
}

export type LocationSyncChange = {
  /** True when the user toggled Location in this tab (may show a browser prompt). */
  allowPrompt: boolean
  enabled: boolean
}

/** Subscribe to settings changes from the dock or another browser tab. */
export function subscribeToLocationSync(
  onChange: (change: LocationSyncChange) => void,
) {
  if (!canUseStorage()) return () => undefined

  const notifyLocal = (event: Event) => {
    const detail =
      event instanceof CustomEvent ? (event.detail as LocationSyncChange | null) : null
    onChange({
      allowPrompt:
        typeof detail?.allowPrompt === 'boolean' ? detail.allowPrompt : true,
      enabled: isLocationSyncEnabled(),
    })
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCATION_SYNC_STORAGE_KEY) {
      // Other-tab sync must stay silent — this tab has no user gesture.
      onChange({ allowPrompt: false, enabled: isLocationSyncEnabled() })
    }
  }

  window.addEventListener(LOCATION_SYNC_CHANGE_EVENT, notifyLocal)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(LOCATION_SYNC_CHANGE_EVENT, notifyLocal)
    window.removeEventListener('storage', onStorage)
  }
}
