/** Country Atlas — evergreen field-guide records for every Explore slug. */

export type AtlasRenditionWidth = 640 | 1024 | 1600

export interface AtlasRendition {
  width: AtlasRenditionWidth
  src: string
  bytes: number
}

export interface AtlasPhoto {
  placeName: string
  alt: string
  caption: string
  photographer: string
  sourceUrl: string
  /** e.g. Pexels License, Public domain, CC BY-SA 4.0 */
  license: string
  provenance: string
  checksum: string
  width: number
  height: number
  renditions: AtlasRendition[]
}

export interface AtlasPlace {
  name: string
  description: string
}

export interface AtlasSource {
  label: string
  url: string
  kind: 'country' | 'place' | 'reference'
}

export interface AtlasFacts {
  capital: string
  languages: string[]
  currency: string
  areaKm2: number
  region: string
}

export interface AtlasEntry {
  slug: string
  code: string
  name: string
  region: string
  subregion: string
  /** Neutral evergreen overview, 250–350 words. */
  about: string
  facts: AtlasFacts
  /** Exactly three notable places. */
  places: [AtlasPlace, AtlasPlace, AtlasPlace]
  /** 2–4 source links; at least one authoritative country source. */
  sources: AtlasSource[]
  photo: AtlasPhoto
}

export type AtlasManifest = Record<string, AtlasEntry>
