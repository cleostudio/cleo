import type { GalleryCollection } from '~/lib/gallery'
import { matchesIndexQuery } from '~/lib/index-filter'

export type GalleryCollectionFilter = 'all' | GalleryCollection

export function parseGalleryCollection(
  value: string | string[] | undefined,
): GalleryCollectionFilter {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === 'places' || raw === 'space') return raw
  return 'all'
}

export function parseGalleryQuery(
  value: string | string[] | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw.trim() : ''
}

/** Shared `?q=` parser for Explore, Space, Writing, and Gallery indexes. */
export const parseIndexQuery = parseGalleryQuery

export function galleryItemMatchesFilters(
  item: {
    searchText: string
    collection: string
  },
  filters: {
    query: string
    collection: GalleryCollectionFilter | string
  },
) {
  const collection = parseGalleryCollection(filters.collection)
  const matchesQuery = matchesIndexQuery(item.searchText, filters.query)
  const matchesCollection =
    collection === 'all' || item.collection === collection

  return matchesQuery && matchesCollection
}

export function countMatchingGalleryItems(
  items: ReadonlyArray<{
    searchText: string
    collection: string
  }>,
  filters: {
    query: string
    collection: GalleryCollectionFilter | string
  },
) {
  return items.reduce(
    (count, item) =>
      galleryItemMatchesFilters(item, filters) ? count + 1 : count,
    0,
  )
}
