import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
} from '~/lib/cleo/location-preference'

/**
 * When a signed-in session arrives, the account preference is canonical.
 * Hydrate localStorage quietly so refresh / new devices never re-prompt.
 * Returns the effective enabled state for UI.
 */
export function hydrateLocationSyncFromAccount(
  accountEnabled: boolean | null | undefined,
): boolean | null {
  if (typeof accountEnabled !== 'boolean') return null
  if (accountEnabled !== isLocationSyncEnabled()) {
    setLocationSyncEnabled(accountEnabled, { allowPrompt: false })
  }
  return accountEnabled
}
