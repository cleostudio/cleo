// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'

import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
  subscribeToLocationSync,
} from './location-preference'

afterEach(() => {
  window.localStorage.clear()
})

describe('location sync preference', () => {
  it('defaults to disabled so Cleo does not prompt first-time visitors', () => {
    expect(isLocationSyncEnabled()).toBe(false)
  })

  it('notifies the active Cleo view when the dock setting changes', () => {
    const observed: boolean[] = []
    const unsubscribe = subscribeToLocationSync((enabled) => observed.push(enabled))

    setLocationSyncEnabled(true)
    setLocationSyncEnabled(false)
    unsubscribe()

    expect(observed).toEqual([true, false])
    expect(isLocationSyncEnabled()).toBe(false)
  })
})
