// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'

import {
  clearCachedUserLocation,
  readCachedUserLocation,
  resetLocationCacheForTests,
  writeCachedUserLocation,
} from './location-cache'

afterEach(() => {
  resetLocationCacheForTests()
  window.localStorage.clear()
})

describe('location cache', () => {
  it('round-trips a valid fix', () => {
    writeCachedUserLocation({
      accuracy: 12,
      latitude: 48.8566,
      longitude: 2.3522,
      timeZone: 'Europe/Paris',
    })

    expect(readCachedUserLocation()).toEqual({
      accuracy: 12,
      latitude: 48.8566,
      longitude: 2.3522,
      timeZone: 'Europe/Paris',
    })
  })

  it('clears on demand', () => {
    writeCachedUserLocation({
      accuracy: 12,
      latitude: 48.8566,
      longitude: 2.3522,
      timeZone: 'Europe/Paris',
    })
    clearCachedUserLocation()
    expect(readCachedUserLocation()).toBeNull()
  })

  it('rejects expired or invalid payloads', () => {
    window.localStorage.setItem(
      'cleo-location-last',
      JSON.stringify({
        accuracy: 12,
        latitude: 48.8566,
        longitude: 2.3522,
        timeZone: 'Europe/Paris',
        cachedAt: Date.now() - 25 * 60 * 60 * 1000,
      }),
    )
    expect(readCachedUserLocation()).toBeNull()

    window.localStorage.setItem('cleo-location-last', '{"latitude":999}')
    expect(readCachedUserLocation()).toBeNull()
  })
})
