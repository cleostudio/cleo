/**
 * Client-safe lookup for Cleo Markdown topic photographs → Gallery zoom props.
 * Backed by content/cleo-topic-photo-zoom.json (regenerate with
 * `pnpm generate:cleo-topic-photo-zoom`).
 */

import topicPhotoZoom from '~/content/cleo-topic-photo-zoom.json'
import type { GalleryCollection } from '~/lib/gallery'

export type TopicPhotoZoomRecord = {
  collection: GalleryCollection
  title: string
  subtitle: string
  alt: string
  photographer: string
  license: string
  width: number
  height: number
  renditions: ReadonlyArray<{ src: string; width: number }>
}

const CURATED_TOPIC_IMAGE_PATH =
  /^\/images\/(atlas|space)\/([a-z0-9-]+)\/w(640|1280|2048)\.jpg$/

const index = topicPhotoZoom as Record<string, TopicPhotoZoomRecord>

/** Parse a curated atlas/space JPEG path into a zoom catalog key. */
export function topicPhotoZoomKeyFromSrc(src: string): string | null {
  const match = CURATED_TOPIC_IMAGE_PATH.exec(src)
  if (!match) return null
  return `${match[1]}/${match[2]}`
}

/** Resolve Gallery-parity zoom metadata for a curated topic photo src. */
export function topicPhotoZoomForSrc(
  src: string,
): TopicPhotoZoomRecord | null {
  const key = topicPhotoZoomKeyFromSrc(src)
  if (!key) return null
  return index[key] ?? null
}

/**
 * True when an Explore/Space guide slug has a curated photograph entry — used
 * as a client-safe catalog existence check (same keys as the zoom index).
 */
export function isKnownPortalGuideSlug(
  collection: 'explore' | 'space',
  slug: string,
): boolean {
  const normalized = slug.trim().toLowerCase()
  if (!normalized) return false
  const key =
    collection === 'explore' ? `atlas/${normalized}` : `space/${normalized}`
  return key in index
}
