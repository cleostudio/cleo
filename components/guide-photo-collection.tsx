'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { Button } from '~/components/ui/button'
import { ZoomImage } from '~/components/zoom-image'
import type { GalleryCollection } from '~/lib/gallery'
import { staticRendition, type StaticPhoto } from '~/lib/static-photo'

export type GuidePhoto = Pick<
  StaticPhoto,
  | 'alt'
  | 'caption'
  | 'photographer'
  | 'sourceUrl'
  | 'license'
  | 'width'
  | 'height'
  | 'renditions'
> & {
  title: string
}

/**
 * Guides keep one photograph in focus at a time. The first image is the
 * editor-selected hero; previous/next controls reveal the other two views.
 */
export function GuidePhotoCollection({
  collection,
  subject,
  photos,
  sourceLabel,
}: {
  collection: GalleryCollection
  subject: string
  photos: readonly GuidePhoto[]
  sourceLabel: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const photo = photos[activeIndex] ?? photos[0]
  if (!photo) return null
  const hasPrevious = activeIndex > 0
  const hasNext = activeIndex < photos.length - 1

  return (
    <section className="enter mt-8" aria-label="Photographs">
      <figure>
        <div className="relative">
          <ZoomImage
            key={photo.sourceUrl}
            src={staticRendition(photo, 1280).src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="photo-frame aspect-[3/2] w-full object-cover"
            sizes="(max-width: 40rem) 100vw, 42rem"
            renditions={photo.renditions.map((rendition) => ({
              src: rendition.src,
              width: rendition.width,
            }))}
            expandedContent={
              <PhotoZoomDetails
                collection={collection}
                title={photo.title}
                subtitle={subject}
                photographer={photo.photographer}
                license={photo.license}
              />
            }
          />
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="Previous photograph"
              disabled={!hasPrevious}
              onClick={() => setActiveIndex((index) => index - 1)}
              expandHitArea
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              aria-label="Next photograph"
              disabled={!hasNext}
              onClick={() => setActiveIndex((index) => index + 1)}
              expandHitArea
            >
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
        <figcaption className="guide-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span>
            <span className="mr-2 tabular-nums" aria-live="polite">
              {activeIndex + 1} / {photos.length}
            </span>
            {photo.caption}
          </span>
          <span>
            {photo.photographer} ·{' '}
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              {sourceLabel}
            </a>
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
