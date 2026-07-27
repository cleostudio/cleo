import { allAtlasEntries } from '~/lib/atlas'
import { atlasRendition } from '~/lib/atlas/static-image'
import { galleryHref } from '~/lib/gallery'
import { excerptMapAbout, type MapCountryPhoto } from '~/lib/maps'

/** Atlas place thumbnails and selection-plate facts keyed by ISO code. */
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
      width: entry.photo.width,
      height: entry.photo.height,
      photographer: entry.photo.photographer,
      license: entry.photo.license,
      renditions: entry.photo.renditions.map((item) => ({
        src: item.src,
        width: item.width,
      })),
      href: `/explore/${entry.slug}`,
      galleryHref: galleryHref(entry.name),
      aboutExcerpt: excerptMapAbout(entry.about),
      places: entry.places.map((place) => place.name),
    }
  }
  return photos
}
