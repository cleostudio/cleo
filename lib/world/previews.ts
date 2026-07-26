import { allAtlasEntries, atlasRendition } from '~/lib/atlas'

export type WorldPhotoPreview = {
  src: string
  place: string
  alt: string
  /** First orientation sentence for the selection chip. */
  teaser: string
}

/** First sentence of orientation prose, capped for the World HUD. */
export function orientationTeaser(about: string, maxLength = 160): string {
  const compact = about.replace(/\s+/g, ' ').trim()
  if (!compact) return ''
  const sentence = compact.match(/^[^.!?]+[.!?]/)?.[0] ?? compact
  if (sentence.length <= maxLength) return sentence
  const clipped = sentence.slice(0, maxLength - 1)
  const boundary = clipped.lastIndexOf(' ')
  return `${(boundary > 80 ? clipped.slice(0, boundary) : clipped).trimEnd()}…`
}

/** Slim per-country place stills for the World selection chip (server → client). */
export function worldPhotoPreviews(): Record<string, WorldPhotoPreview> {
  const out: Record<string, WorldPhotoPreview> = {}
  for (const entry of allAtlasEntries()) {
    out[entry.slug] = {
      src: atlasRendition(entry.photo, 640).src,
      place: entry.photo.placeName,
      alt: entry.photo.alt,
      teaser: orientationTeaser(entry.about),
    }
  }
  return out
}
