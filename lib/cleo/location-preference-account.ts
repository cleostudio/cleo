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

export type LocationSyncSessionReconcile = {
  /** `hydrate`: account → local. `push-local`: keep local and sync up. */
  action: 'hydrate' | 'push-local'
  enabled: boolean
}

/**
 * Reconcile localStorage with the account when a signed-in session first
 * resolves in this tab.
 *
 * - Fresh load / refresh: account wins (`hydrate`).
 * - User toggled Location after mount while the session was still pending:
 *   keep local and push it to the account so a stale `false` cannot wipe the
 *   preference when the session finally arrives.
 */
export function reconcileLocationSyncOnSession(options: {
  accountEnabled: boolean
  localEnabled: boolean
  toggledSinceMount: boolean
}): LocationSyncSessionReconcile {
  if (options.toggledSinceMount) {
    return { action: 'push-local', enabled: options.localEnabled }
  }
  return { action: 'hydrate', enabled: options.accountEnabled }
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
