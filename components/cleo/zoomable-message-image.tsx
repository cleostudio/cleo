'use client'

import { useEffect, useState } from 'react'

import { ZoomImage } from '~/components/zoom-image'
import { cn } from '~/lib/utils'

type ZoomableMessageImageProps = {
  src: string
  alt: string
  className?: string
}

/**
 * Click-to-zoom for Cleo attachment / generated data-URL images.
 * Measures intrinsic size once so ZoomImage can FLIP without a catalog entry.
 */
export function ZoomableMessageImage({
  src,
  alt,
  className,
}: ZoomableMessageImageProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    // Drop stale geometry while a partial → final (or swapped) src loads.
    setSize(null)
    const probe = new window.Image()
    probe.decoding = 'async'
    probe.onload = () => {
      if (cancelled) return
      setSize({
        width: Math.max(1, probe.naturalWidth || 1024),
        height: Math.max(1, probe.naturalHeight || 1024),
      })
    }
    probe.onerror = () => {
      if (cancelled) return
      setSize({ width: 1024, height: 1024 })
    }
    probe.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  if (!size) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- data URLs from the local conversation
      <img alt={alt} className={className} src={src} />
    )
  }

  return (
    <span className={cn('cleo-message-photo-frame', className)}>
      <ZoomImage
        alt={alt}
        className="message-image-zoom"
        height={size.height}
        renditions={[{ src, width: size.width }]}
        sizes="(max-width: 40rem) 100vw, 24rem"
        src={src}
        width={size.width}
      />
    </span>
  )
}
