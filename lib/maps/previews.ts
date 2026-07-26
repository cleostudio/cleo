import { allAtlasEntries, atlasRendition } from '~/lib/atlas'

export type MapsPhotoPreview = {
  src: string
  place: string
  alt: string
}

/** Slim per-country place stills for the Maps selection chip (server → client). */
export function mapsPhotoPreviews(): Record<string, MapsPhotoPreview> {
  const out: Record<string, MapsPhotoPreview> = {}
  for (const entry of allAtlasEntries()) {
    out[entry.slug] = {
      src: atlasRendition(entry.photo, 640).src,
      place: entry.photo.placeName,
      alt: entry.photo.alt,
    }
  }
  return out
}
