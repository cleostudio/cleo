'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'
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
 * Guides keep one photograph in focus while adjacent images preview the
 * previous and next choices. The first image is the editor-selected hero.
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
  const previousIndex = (activeIndex - 1 + photos.length) % photos.length
  const nextIndex = (activeIndex + 1) % photos.length
  const previousPhoto = photos[previousIndex]!
  const nextPhoto = photos[nextIndex]!
  const position = `${String(activeIndex + 1).padStart(2, '0')} / ${String(
    photos.length,
  ).padStart(2, '0')}`

  function showPhoto(index: number) {
    setActiveIndex(index)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPhoto(previousIndex)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showPhoto(nextIndex)
    }
  }

  return (
    <section
      className="enter mt-8 outline-none focus-visible:[&_.guide-photo-status]:text-foreground"
      tabIndex={0}
      aria-label={`Photographs for ${subject}`}
      aria-roledescription="carousel"
      aria-keyshortcuts="ArrowLeft ArrowRight"
      onKeyDown={handleKeyDown}
    >
      <figure>
        <div className="grid grid-cols-[1fr_5fr_1fr] items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            className="photo-frame group relative block h-full min-h-0 w-full overflow-hidden opacity-70 outline-none transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Show previous photograph: ${previousPhoto.title}`}
            onClick={() => showPhoto(previousIndex)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticRendition(previousPhoto, 640).src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/35 text-foreground transition-colors duration-150 group-hover:bg-background/50">
              <ChevronLeft aria-hidden />
            </span>
          </button>

          <ZoomImage
            src={staticRendition(photo, 1280).src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="photo-frame aspect-[3/2] w-full object-cover"
            triggerClassName="outline-none focus-visible:outline-none focus-visible:opacity-95"
            sizes="(max-width: 40rem) 72vw, 30rem"
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

          <button
            type="button"
            className="photo-frame group relative block h-full min-h-0 w-full overflow-hidden opacity-70 outline-none transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Show next photograph: ${nextPhoto.title}`}
            onClick={() => showPhoto(nextIndex)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticRendition(nextPhoto, 640).src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/35 text-foreground transition-colors duration-150 group-hover:bg-background/50">
              <ChevronRight aria-hidden />
            </span>
          </button>
        </div>
        <figcaption className="guide-credit hairline-top mt-3 grid gap-2 pt-3 text-xs text-muted-foreground sm:grid-cols-[auto_1fr_auto] sm:items-baseline">
          <span
            className="guide-label guide-photo-status tabular-nums transition-colors duration-150"
            aria-live="polite"
          >
            Photo {position}
          </span>
          <span className="font-medium text-foreground">{photo.caption}</span>
          <span className="sm:text-right">
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
