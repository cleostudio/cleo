import type { GalleryCollection } from '~/lib/gallery'

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
