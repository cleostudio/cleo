import { allAtlasEntries, atlasRegions } from '~/lib/atlas'
import { placeGuides, placeHref } from '~/lib/places'
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

export function allGalleryItems(): GalleryItem[] {
  const countries: GalleryItem[] = allAtlasEntries().map((entry) => ({
    id: `places:${entry.slug}`,
    collection: 'places',
    href: `/explore/${entry.slug}`,
    title: entry.photo.placeName,
    subtitle: entry.name,
    filterKey: entry.region,
    searchText: [
      entry.name,
      entry.photo.placeName,
      entry.subregion,
      entry.code,
      entry.region,
      'place',
      'country',
    ].join(' '),
    photo: atlasPhotoToStatic(entry.photo),
  }))

  const nestedPlaces: GalleryItem[] = placeGuides.map((place) => ({
    id: `places:guide:${place.slug}`,
    collection: 'places',
    href: placeHref(place),
    title: place.photo.featureName,
    subtitle: place.name,
    filterKey: place.facts.region,
    searchText: [
      place.name,
      place.photo.featureName,
      place.kind,
      place.facts.country,
      place.code,
      place.facts.region,
      'place',
      place.kind.toLowerCase(),
    ].join(' '),
    photo: place.photo,
  }))

  const space: GalleryItem[] = spaceSubjects.map((subject) => ({
    id: `space:${subject.slug}`,
    collection: 'space',
    href: `/space/${subject.slug}`,
    title: subject.photo.featureName,
    subtitle: subject.name,
    filterKey: subject.category,
    searchText: [
      subject.name,
      subject.photo.featureName,
      subject.code,
      subject.category,
      subject.facts.kind,
      'space',
    ].join(' '),
    photo: subject.photo,
  }))

  return [...countries, ...nestedPlaces, ...space]
}

export function galleryFilterKeys(): string[] {
  const placeRegions = atlasRegions()
  const spaceCategories = [
    ...new Set(spaceSubjects.map((subject) => subject.category)),
  ]
  return [...placeRegions, ...spaceCategories]
}

export function galleryDescription(count: number): string {
  return `${count} curated photographs — countries and places from Explore, bodies from Space.`
}
