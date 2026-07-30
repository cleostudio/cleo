import { allAtlasEntries, atlasRegions } from '~/lib/atlas'
import type { StaticPhoto } from '~/lib/static-photo'
import { spaceSubjects } from '~/lib/space'

export type GalleryCollection = 'places' | 'space'

export interface GalleryItem {
  id: string
  collection: GalleryCollection
  href: string
  /** Featured place / feature name on the tile. */
  title: string
  /** Country or space-subject name under the title. */
  subtitle: string
  /** Region (places) or category (space). */
  filterKey: string
  searchText: string
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
      searchText: [
        entry.name,
        photo.placeName,
        entry.subregion,
        entry.code,
        entry.region,
        'place',
        'country',
      ].join(' '),
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
      searchText: [
        subject.name,
        photo.featureName,
        subject.code,
        subject.category,
        subject.facts.kind,
        'space',
      ].join(' '),
      photo,
    })),
  )

  return [...places, ...space]
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
  return [...placeRegions, ...spaceCategories]
}

export function galleryDescription(count: number): string {
  return `${count} curated photographs — places from Explore and bodies from Space.`
}
