import { describe, expect, it } from 'vitest'

import { parseGalleryCollection, parseGalleryQuery } from './gallery-filters'

describe('gallery filter parsers', () => {
  it('accepts places and space collections', () => {
    expect(parseGalleryCollection('places')).toBe('places')
    expect(parseGalleryCollection('space')).toBe('space')
    expect(parseGalleryCollection('other')).toBe('all')
    expect(parseGalleryCollection(undefined)).toBe('all')
  })

  it('trims query strings', () => {
    expect(parseGalleryQuery('  Japan  ')).toBe('Japan')
    expect(parseGalleryQuery(['Mars', 'ignored'])).toBe('Mars')
    expect(parseGalleryQuery(undefined)).toBe('')
  })
})
