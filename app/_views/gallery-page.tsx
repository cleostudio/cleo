import { PlaceGallery } from '~/components/place-gallery'
import { PixelCluster } from '~/components/pixel-cluster'
import { allGalleryItems } from '~/lib/gallery'
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
        <PlaceGallery entries={entries} />
      </div>
    </div>
  )
}
