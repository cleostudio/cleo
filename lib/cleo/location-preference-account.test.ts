// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  hydrateLocationSyncFromAccount,
  persistLocationSyncToAccount,
} from './location-preference-account'
import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
  subscribeToLocationSync,
  type LocationSyncChange,
} from './location-preference'

afterEach(() => {
  window.localStorage.clear()
})

describe('hydrateLocationSyncFromAccount', () => {
  it('ignores unresolved account values', () => {
    expect(hydrateLocationSyncFromAccount(undefined)).toBeNull()
    expect(hydrateLocationSyncFromAccount(null)).toBeNull()
    expect(isLocationSyncEnabled()).toBe(false)
  })

  it('restores enabled account preference silently', () => {
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    expect(hydrateLocationSyncFromAccount(true)).toBe(true)
    unsubscribe()

    expect(isLocationSyncEnabled()).toBe(true)
    expect(observed).toEqual([{ allowPrompt: false, enabled: true }])
  })

  it('clears a stale local enable when the account is off', () => {
    setLocationSyncEnabled(true)
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    expect(hydrateLocationSyncFromAccount(false)).toBe(false)
    unsubscribe()

    expect(isLocationSyncEnabled()).toBe(false)
    expect(observed).toEqual([{ allowPrompt: false, enabled: false }])
  })

  it('is a no-op when local already matches the account', () => {
    setLocationSyncEnabled(true)
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    expect(hydrateLocationSyncFromAccount(true)).toBe(true)
    unsubscribe()

    expect(observed).toEqual([])
    expect(isLocationSyncEnabled()).toBe(true)
  })
})

describe('persistLocationSyncToAccount', () => {
  it('keeps the local preference when the account write succeeds', async () => {
    setLocationSyncEnabled(true)
    const updateUser = vi.fn(async () => ({}))

    await expect(
      persistLocationSyncToAccount({
        enabled: true,
        previous: false,
        updateUser,
      }),
    ).resolves.toBe(true)

    expect(updateUser).toHaveBeenCalledWith({ locationSyncEnabled: true })
    expect(isLocationSyncEnabled()).toBe(true)
  })

  it('reverts local preference silently when the account write fails', async () => {
    setLocationSyncEnabled(true)
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))
    const updateUser = vi.fn(async () => ({ error: new Error('network') }))

    await expect(
      persistLocationSyncToAccount({
        enabled: true,
        previous: false,
        updateUser,
      }),
    ).resolves.toBe(false)
    unsubscribe()

    expect(isLocationSyncEnabled()).toBe(false)
    expect(observed).toEqual([{ allowPrompt: false, enabled: false }])
  })
})
