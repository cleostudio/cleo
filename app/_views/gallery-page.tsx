import { PlaceGallery } from '~/components/place-gallery'
import { PixelCluster } from '~/components/pixel-cluster'
import { allGalleryItems, galleryDescription } from '~/lib/gallery'
import {
  parseGalleryCollection,
  parseGalleryQuery,
} from '~/lib/gallery-filters'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function galleryPageMetadata() {
  const count = allGalleryItems().length
  return localeMetadata({
    path: '/gallery',
    title: publicPageMetadata.gallery.title,
    description: galleryDescription(count),
  })
}

/**
 * Fully static gallery: sync local catalog, no Suspense swap.
 * Instant Navigation paints the real toolbar + tiles on first click —
 * a placeholder masonry was what made dock arrivals feel shaky.
 */
export function GalleryPageView({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const entries = allGalleryItems()
  const introduction = galleryDescription(entries.length)
  const initialQuery = parseGalleryQuery(searchParams?.q)
  const initialCollection = parseGalleryCollection(searchParams?.collection)

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow">
            <T zh="图库" en="Gallery" />
          </h1>
          <p className="page-introduction mt-4 text-balance">{introduction}</p>
        </header>
        <PixelCluster variant={4} className="shrink-0" />
      </div>

      <div className="mt-4">
        <PlaceGallery
          entries={entries}
          initialQuery={initialQuery}
          initialCollection={initialCollection}
        />
      </div>
    </div>
  )
}
