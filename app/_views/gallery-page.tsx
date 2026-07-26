import Link from 'next/link'

import { PlaceGallery } from '~/components/place-gallery'
import { PixelCluster } from '~/components/pixel-cluster'
import { cleoAskHref } from '~/lib/cleo/ask-links'
import { allGalleryItems, galleryFilterKeys } from '~/lib/gallery'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function galleryPageMetadata() {
  const copy = publicPageMetadata.gallery
  return localeMetadata({
    path: '/gallery',
    title: copy.title,
    description: copy.description,
  })
}

/**
 * Fully static gallery: sync local catalog, no Suspense swap.
 * Instant Navigation paints the real toolbar + tiles on first click —
 * a placeholder masonry was what made dock arrivals feel shaky.
 */
export function GalleryPageView() {
  const entries = allGalleryItems()
  const filterKeys = galleryFilterKeys()

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow">
            <T zh="图库" en="Gallery" />
          </h1>
        </header>
        <PixelCluster variant={4} className="shrink-0" />
      </div>

      <div className="mt-4">
        <PlaceGallery entries={entries} filterKeys={filterKeys} />
      </div>

      <p className="mt-10 mb-4">
        <Link
          href={cleoAskHref({
            prompt:
              'Help me pick a place or space photograph to sit with — suggest a few from the Gallery and deep-link their field guides.',
          })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Ask Cleo for a photograph →
        </Link>
      </p>
    </div>
  )
}
