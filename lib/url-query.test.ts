/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest'

import { readQueryParam, replaceQueryParam } from './url-query'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('url query helpers', () => {
  it('reads and replaces query params without stacking history', () => {
    expect(readQueryParam('q')).toBe('')

    replaceQueryParam('q', 'mars')
    expect(readQueryParam('q')).toBe('mars')
    expect(window.location.search).toBe('?q=mars')

    replaceQueryParam('collection', 'space')
    expect(window.location.search).toContain('q=mars')
    expect(window.location.search).toContain('collection=space')

    replaceQueryParam('q', '')
    expect(readQueryParam('q')).toBe('')
    expect(window.location.search).toBe('?collection=space')
  })
})
