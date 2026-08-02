import { allAtlasEntries, atlasRegions } from '~/lib/atlas'
import { citySubjects } from '~/lib/cities'
import { civilizationSubjects } from '~/lib/civilizations'
import { oceanSubjects } from '~/lib/oceans'
import type { StaticPhoto } from '~/lib/static-photo'
import { spaceSubjects } from '~/lib/space'

export type GalleryCollection =
  | 'places'
  | 'space'
  | 'civilizations'
  | 'cities'
  | 'oceans'

export interface GalleryItem {
  id: string
  collection: GalleryCollection
  href: string
  /** Featured place / feature name on the tile. */
  title: string
  /** Country, space-subject, civilization, city, or ocean name under the title. */
  subtitle: string
  /** Region (places) or category (space/civilizations/cities/oceans). */
  filterKey: string
  photo: StaticPhoto
}

function atlasPhotoToStatic(photo: {
  placeName: string
  alt: string
  caption: string
  photographer: string
  sourceUrl: string
  license: string
  provenance: string
  checksum: string
  width: number
  height: number
  renditions: StaticPhoto['renditions']
}): StaticPhoto {
  return {
    featureName: photo.placeName,
    alt: photo.alt,
    caption: photo.caption,
    photographer: photo.photographer,
    sourceUrl: photo.sourceUrl,
    license: photo.license,
    provenance: photo.provenance,
    checksum: photo.checksum,
    width: photo.width,
    height: photo.height,
    renditions: photo.renditions,
  }
}

function topicPhotoItems(includeAllPhotos: boolean): GalleryItem[] {
  const places: GalleryItem[] = allAtlasEntries().flatMap((entry) =>
    (includeAllPhotos ? entry.photos : [entry.photos[0]]).map((photo, index) => ({
      id: `places:${entry.slug}${index === 0 ? '' : `:${index + 1}`}`,
      collection: 'places' as const,
      href: `/explore/${entry.slug}`,
      title: photo.placeName,
      subtitle: entry.name,
      filterKey: entry.region,
      photo: atlasPhotoToStatic(photo),
    })),
  )

  const space: GalleryItem[] = spaceSubjects.flatMap((subject) =>
    (includeAllPhotos ? subject.photos : [subject.photos[0]]).map((photo, index) => ({
      id: `space:${subject.slug}${index === 0 ? '' : `:${index + 1}`}`,
      collection: 'space' as const,
      href: `/space/${subject.slug}`,
      title: photo.featureName,
      subtitle: subject.name,
      filterKey: subject.category,
      photo,
    })),
  )

  const civilizations: GalleryItem[] = civilizationSubjects.flatMap((subject) =>
    (includeAllPhotos ? subject.photos : [subject.photos[0]]).map((photo, index) => ({
      id: `civilizations:${subject.slug}${index === 0 ? '' : `:${index + 1}`}`,
      collection: 'civilizations' as const,
      href: `/civilizations/${subject.slug}`,
      title: photo.featureName,
      subtitle: subject.name,
      filterKey: subject.category,
      photo,
    })),
  )

  const cities: GalleryItem[] = citySubjects.flatMap((subject) =>
    (includeAllPhotos ? subject.photos : [subject.photos[0]]).map((photo, index) => ({
      id: `cities:${subject.slug}${index === 0 ? '' : `:${index + 1}`}`,
      collection: 'cities' as const,
      href: `/cities/${subject.slug}`,
      title: photo.featureName,
      subtitle: subject.name,
      filterKey: subject.category,
      photo,
    })),
  )

  const oceans: GalleryItem[] = oceanSubjects.flatMap((subject) =>
    (includeAllPhotos ? subject.photos : [subject.photos[0]]).map((photo, index) => ({
      id: `oceans:${subject.slug}${index === 0 ? '' : `:${index + 1}`}`,
      collection: 'oceans' as const,
      href: `/oceans/${subject.slug}`,
      title: photo.featureName,
      subtitle: subject.name,
      filterKey: subject.category,
      photo,
    })),
  )

  return [...places, ...space, ...civilizations, ...cities, ...oceans]
}

/**
 * Stable tile anchor, so homepage photo results can deep-link to the tile
 * (`/gallery#photo-places-japan`) instead of the top of the page.
 */
export function galleryItemDomId(item: Pick<GalleryItem, 'id'>): string {
  return `photo-${item.id.replaceAll(':', '-')}`
}

/** Every curated photograph, used for attribution and Cleo zoom metadata. */
export function allTopicPhotoItems(): GalleryItem[] {
  return topicPhotoItems(true)
}

/** Gallery is a focused index: the editor-selected hero for each topic. */
export function allGalleryItems(): GalleryItem[] {
  return topicPhotoItems(false)
}

export function galleryFilterKeys(): string[] {
  const placeRegions = atlasRegions()
  const spaceCategories = [
    ...new Set(spaceSubjects.map((subject) => subject.category)),
  ]
  const civilizationCategories = [
    ...new Set(civilizationSubjects.map((subject) => subject.category)),
  ]
  const cityCategories = [
    ...new Set(citySubjects.map((subject) => subject.category)),
  ]
  const oceanCategories = [
    ...new Set(oceanSubjects.map((subject) => subject.category)),
  ]
  return [
    ...placeRegions,
    ...spaceCategories,
    ...civilizationCategories,
    ...cityCategories,
    ...oceanCategories,
  ]
}

export function galleryDescription(count: number): string {
  return `${count} curated photographs — places from Explore, bodies from Space, sites from Civilizations, views from Cities, and basins from Oceans.`
}
