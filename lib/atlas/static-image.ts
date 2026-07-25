import type { AtlasPhoto, AtlasRendition } from './types'

/** Prebuilt atlas JPEGs are immutable static files — never re-encode at request time. */
export function atlasSrcSet(renditions: readonly AtlasRendition[]): string {
  return [...renditions]
    .sort((a, b) => a.width - b.width)
    .map((rendition) => `${rendition.src} ${rendition.width}w`)
    .join(', ')
}

export function atlasRendition(
  photo: Pick<AtlasPhoto, 'renditions'>,
  width: number,
): AtlasRendition {
  const sorted = [...photo.renditions].sort((a, b) => a.width - b.width)
  return (
    sorted.find((rendition) => rendition.width >= width) ??
    sorted[sorted.length - 1]!
  )
}

export function atlasIntrinsicSize(photo: Pick<AtlasPhoto, 'width' | 'height'>, displayWidth: number) {
  return {
    width: displayWidth,
    height: Math.max(1, Math.round((displayWidth * photo.height) / photo.width)),
  }
}
