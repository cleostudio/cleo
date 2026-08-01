import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
} from '~/lib/cleo/location-preference'

type UpdateUserResult = {
  error?: unknown
}

type UpdateUserFn = (data: {
  locationSyncEnabled: boolean
}) => Promise<UpdateUserResult>

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

/**
 * Persist the dock Location preference to the signed-in account.
 * On failure, revert localStorage/UI to `previous` without prompting.
 */
export async function persistLocationSyncToAccount(options: {
  enabled: boolean
  previous: boolean
  updateUser: UpdateUserFn
}): Promise<boolean> {
  const { enabled, previous, updateUser } = options
  const result = await updateUser({ locationSyncEnabled: enabled })
  if (result.error) {
    if (previous !== isLocationSyncEnabled()) {
      setLocationSyncEnabled(previous, { allowPrompt: false })
    }
    return false
  }
  return true
}
