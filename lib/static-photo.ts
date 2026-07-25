/** Shared static JPEG photo shape for atlas places and space subjects. */

export type StaticRenditionWidth = 640 | 1024 | 1600

export interface StaticRendition {
  width: StaticRenditionWidth
  src: string
  bytes: number
}

export interface StaticPhoto {
  /** Featured place / feature name shown in Gallery tiles. */
  featureName: string
  alt: string
  caption: string
  photographer: string
  sourceUrl: string
  license: string
  provenance: string
  checksum: string
  width: number
  height: number
  renditions: StaticRendition[]
}

/** Prebuilt JPEGs are immutable static files — never re-encode at request time. */
export function staticSrcSet(renditions: readonly StaticRendition[]): string {
  return [...renditions]
    .sort((a, b) => a.width - b.width)
    .map((rendition) => `${rendition.src} ${rendition.width}w`)
    .join(', ')
}

export function staticRendition(
  photo: Pick<StaticPhoto, 'renditions'>,
  width: number,
): StaticRendition {
  const sorted = [...photo.renditions].sort((a, b) => a.width - b.width)
  return (
    sorted.find((rendition) => rendition.width >= width) ??
    sorted[sorted.length - 1]!
  )
}

export function staticIntrinsicSize(
  photo: Pick<StaticPhoto, 'width' | 'height'>,
  displayWidth: number,
) {
  return {
    width: displayWidth,
    height: Math.max(1, Math.round((displayWidth * photo.height) / photo.width)),
  }
}
