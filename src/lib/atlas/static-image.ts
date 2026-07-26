import {
  staticIntrinsicSize,
  staticRendition,
  staticSrcSet,
  type StaticPhoto,
  type StaticRendition,
} from '~/lib/static-photo'

import type { AtlasPhoto, AtlasRendition } from './types'

/** Prebuilt atlas JPEGs are immutable static files — never re-encode at request time. */
export function atlasSrcSet(renditions: readonly AtlasRendition[]): string {
  return staticSrcSet(renditions)
}

export function atlasRendition(
  photo: Pick<AtlasPhoto, 'renditions'>,
  width: number,
): AtlasRendition {
  return staticRendition(photo, width) as AtlasRendition
}

export function atlasIntrinsicSize(
  photo: Pick<AtlasPhoto, 'width' | 'height'>,
  displayWidth: number,
) {
  return staticIntrinsicSize(photo, displayWidth)
}

export type { StaticPhoto, StaticRendition }
