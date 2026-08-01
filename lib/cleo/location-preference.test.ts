// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'

import {
  readCachedUserLocation,
  resetLocationCacheForTests,
  writeCachedUserLocation,
} from './location-cache'
import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
  subscribeToLocationSync,
  type LocationSyncChange,
} from './location-preference'

afterEach(() => {
  window.localStorage.clear()
  resetLocationCacheForTests()
})

describe('location sync preference', () => {
  it('defaults to disabled so Cleo does not prompt first-time visitors', () => {
    expect(isLocationSyncEnabled()).toBe(false)
  })

  it('notifies the active Cleo view when the dock setting changes', () => {
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    setLocationSyncEnabled(true)
    setLocationSyncEnabled(false)
    unsubscribe()

    expect(observed).toEqual([
      { allowPrompt: true, enabled: true },
      { allowPrompt: true, enabled: false },
    ])
    expect(isLocationSyncEnabled()).toBe(false)
  })

  it('restores account preference silently so sign-in does not re-prompt', () => {
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    setLocationSyncEnabled(true, { allowPrompt: false })
    unsubscribe()

    expect(observed).toEqual([{ allowPrompt: false, enabled: true }])
    expect(isLocationSyncEnabled()).toBe(true)
  })

  it('clears the cached fix when Location is turned off', () => {
    writeCachedUserLocation({
      accuracy: 8,
      latitude: 35.6895,
      longitude: 139.6917,
      timeZone: 'Asia/Tokyo',
    })
    setLocationSyncEnabled(true)
    expect(readCachedUserLocation()).not.toBeNull()

    setLocationSyncEnabled(false)
    expect(isLocationSyncEnabled()).toBe(false)
    expect(readCachedUserLocation()).toBeNull()
  })

  it('keeps cross-tab storage sync silent so other tabs do not re-prompt', () => {
    const observed: LocationSyncChange[] = []
    const unsubscribe = subscribeToLocationSync((change) => observed.push(change))

    window.localStorage.setItem('cleo-location-sync', 'enabled')
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cleo-location-sync',
        newValue: 'enabled',
        storageArea: window.localStorage,
      }),
    )
    unsubscribe()

    expect(observed).toEqual([{ allowPrompt: false, enabled: true }])
  })
})
