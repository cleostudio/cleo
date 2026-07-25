import {
  staticIntrinsicSize,
  staticRendition,
  staticSrcSet,
  type StaticPhoto,
} from '~/lib/static-photo'
import { cn } from '~/lib/utils'

type AtlasImageProps = {
  photo: Pick<StaticPhoto, 'alt' | 'width' | 'height' | 'renditions'>
  /** Preferred display width used to pick the default `src` rendition. */
  width: number
  sizes: string
  className?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Serves import-time static JPEGs directly from `/images/*`.
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
  const preferred = staticRendition(photo, width)
  const intrinsic = staticIntrinsicSize(photo, preferred.width)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static srcset must bypass /_next/image
    <img
      src={preferred.src}
      srcSet={staticSrcSet(photo.renditions)}
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
