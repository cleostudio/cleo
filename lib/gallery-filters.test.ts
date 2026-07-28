import { describe, expect, it } from 'vitest'

import {
  countMatchingGalleryItems,
  galleryItemMatchesFilters,
  parseGalleryCollection,
  parseGalleryQuery,
} from './gallery-filters'

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

describe('galleryItemMatchesFilters', () => {
  const japan = {
    searchText: 'Japan Asia Tokyo place',
    collection: 'places',
  }
  const mars = {
    searchText: 'Mars planet space',
    collection: 'space',
  }

  it('matches query and collection together', () => {
    expect(
      galleryItemMatchesFilters(japan, { query: 'tokyo', collection: 'places' }),
    ).toBe(true)
    expect(
      galleryItemMatchesFilters(japan, { query: 'tokyo', collection: 'space' }),
    ).toBe(false)
    expect(
      galleryItemMatchesFilters(mars, { query: '', collection: 'space' }),
    ).toBe(true)
    expect(
      galleryItemMatchesFilters(mars, { query: 'japan', collection: 'all' }),
    ).toBe(false)
  })

  it('counts matching items for SSR status lines', () => {
    expect(
      countMatchingGalleryItems([japan, mars], {
        query: 'mars',
        collection: 'all',
      }),
    ).toBe(1)
    expect(
      countMatchingGalleryItems([japan, mars], {
        query: '',
        collection: 'places',
      }),
    ).toBe(1)
  })
})
