/**
 * Slim atlas snapshots for the Maps place card — safe to pass from a Server
 * Component into the client explorer without shipping full guide prose.
 */

import { allAtlasEntries } from '~/lib/atlas'

export interface MapPlacePreview {
  capital: string
  photoSrc: string
  photoAlt: string
  placeName: string
}

export type MapPlacePreviewCatalog = Record<string, MapPlacePreview>

/** Build the Maps place-card catalog from the atlas manifest. */
export function buildMapPlacePreviews(): MapPlacePreviewCatalog {
  const catalog: MapPlacePreviewCatalog = {}
  for (const entry of allAtlasEntries()) {
    const photo =
      entry.photo.renditions.find((rendition) => rendition.width === 640) ??
      entry.photo.renditions[0]
    if (!photo) continue
    catalog[entry.slug] = {
      capital: entry.facts.capital,
      photoSrc: photo.src,
      photoAlt: entry.photo.alt,
      placeName: entry.photo.placeName,
    }
  }
  return catalog
}
