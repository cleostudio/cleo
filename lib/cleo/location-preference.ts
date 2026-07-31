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

export function setLocationSyncEnabled(enabled: boolean) {
  if (!canUseStorage()) return

  try {
    if (enabled) {
      window.localStorage.setItem(LOCATION_SYNC_STORAGE_KEY, LOCATION_SYNC_ENABLED)
    } else {
      window.localStorage.removeItem(LOCATION_SYNC_STORAGE_KEY)
    }
  } catch {
    return
  }

  window.dispatchEvent(new Event(LOCATION_SYNC_CHANGE_EVENT))
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

  const notifyLocal = () => {
    onChange({ allowPrompt: true, enabled: isLocationSyncEnabled() })
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
