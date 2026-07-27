import { allAtlasEntries } from '~/lib/atlas'
import { atlasRendition } from '~/lib/atlas/static-image'
import type { MapCountryPhoto } from '~/lib/maps'

/** Atlas place thumbnails keyed by ISO code for the Maps selection card. */
export function mapCountryPhotos(): Record<string, MapCountryPhoto> {
  const photos: Record<string, MapCountryPhoto> = {}
  for (const entry of allAtlasEntries()) {
    const rendition = atlasRendition(entry.photo, 640)
    photos[entry.code] = {
      code: entry.code,
      slug: entry.slug,
      name: entry.name,
      capital: entry.facts.capital,
      placeName: entry.photo.placeName,
      alt: entry.photo.alt,
      src: rendition.src,
      href: `/explore/${entry.slug}`,
    }
  }
  return photos
}
