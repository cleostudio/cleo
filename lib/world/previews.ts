import { allAtlasEntries, atlasRendition } from '~/lib/atlas'

export type WorldPhotoPreview = {
  src: string
  place: string
  alt: string
}

/** Slim per-country place stills for the World selection chip (server → client). */
export function worldPhotoPreviews(): Record<string, WorldPhotoPreview> {
  const out: Record<string, WorldPhotoPreview> = {}
  for (const entry of allAtlasEntries()) {
    out[entry.slug] = {
      src: atlasRendition(entry.photo, 640).src,
      place: entry.photo.placeName,
      alt: entry.photo.alt,
    }
  }
  return out
}
