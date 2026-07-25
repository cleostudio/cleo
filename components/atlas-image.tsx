import {
  atlasIntrinsicSize,
  atlasRendition,
  atlasSrcSet,
} from '~/lib/atlas/static-image'
import type { AtlasPhoto } from '~/lib/atlas/types'
import { cn } from '~/lib/utils'

type AtlasImageProps = {
  photo: AtlasPhoto
  /** Preferred display width used to pick the default `src` rendition. */
  width: number
  sizes: string
  className?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Serves import-time atlas JPEGs directly from `/images/atlas/*`.
 * No Next image optimizer, CDN account, or runtime third-party fetch.
 */
export function AtlasImage({
  photo,
  width,
  sizes,
  className,
  alt = photo.alt,
  loading = 'lazy',
  fetchPriority,
}: AtlasImageProps) {
  const preferred = atlasRendition(photo, width)
  const intrinsic = atlasIntrinsicSize(photo, preferred.width)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static atlas srcset must bypass /_next/image
    <img
      src={preferred.src}
      srcSet={atlasSrcSet(photo.renditions)}
      sizes={sizes}
      width={intrinsic.width}
      height={intrinsic.height}
      alt={alt}
      className={cn(className)}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
    />
  )
}
