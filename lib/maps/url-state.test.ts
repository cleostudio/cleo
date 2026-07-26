import { afterEach, describe, expect, it, vi } from 'vitest'

import { mapsCountryFromSearch, mapsHref, replaceMapsCountryInUrl } from './url-state'

describe('maps url state', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads a valid country slug from ?c=', () => {
    expect(mapsCountryFromSearch('?c=japan')).toBe('japan')
    expect(mapsCountryFromSearch('c=japan')).toBe('japan')
    expect(mapsCountryFromSearch('?c=JP')).toBeNull()
    expect(mapsCountryFromSearch('?c=not-a-country')).toBeNull()
    expect(mapsCountryFromSearch('')).toBeNull()
  })

  it('builds Maps hrefs for known slugs only', () => {
    expect(mapsHref('japan')).toBe('/maps?c=japan')
    expect(mapsHref('not-a-country')).toBe('/maps')
    expect(mapsHref(null)).toBe('/maps')
  })

  it('replaces the query string without navigating', () => {
    const replaceState = vi.fn()
    vi.stubGlobal('window', {
      location: {
        href: 'https://cleo.example/maps?c=france',
        pathname: '/maps',
        search: '?c=france',
        hash: '',
      },
      history: { state: null, replaceState },
    })

    replaceMapsCountryInUrl('japan')
    expect(replaceState).toHaveBeenCalledWith(null, '', '/maps?c=japan')

    replaceMapsCountryInUrl(null)
    expect(replaceState).toHaveBeenCalledWith(null, '', '/maps')
  })
})
