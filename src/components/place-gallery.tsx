import Link from 'next/link'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PlaceGalleryToolbar } from '~/components/place-gallery-toolbar'
import { ZoomImage } from '~/components/zoom-image'
import type { GalleryItem } from '~/lib/gallery'
import { staticRendition } from '~/lib/static-photo'

const LOADING_ASPECT_RATIOS = ['4 / 3', '3 / 4', '1 / 1', '3 / 4', '4 / 3', '1 / 1']

export function PlaceGallery({
  entries,
  filterKeys,
}: {
  entries: GalleryItem[]
  filterKeys: string[]
}) {
  return (
    <div className="place-gallery" data-place-gallery>
      <PlaceGalleryToolbar filterKeys={filterKeys} totalCount={entries.length} />

      <ul className="photo-masonry">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="photo-item"
            data-gallery-item
            data-filter-key={entry.filterKey}
            data-search-text={entry.searchText}
          >
            <div className="photo-frame relative overflow-hidden">
              <ZoomImage
                src={staticRendition(entry.photo, 640).src}
                alt={entry.photo.alt}
                width={entry.photo.width}
                height={entry.photo.height}
                className="h-auto w-full object-cover"
                sizes="(max-width: 40rem) 50vw, 12.5rem"
                renditions={entry.photo.renditions.map((rendition) => ({
                  src: rendition.src,
                  width: rendition.width,
                }))}
                expandedContent={
                  <PhotoZoomDetails
                    collection={entry.collection}
                    title={entry.title}
                    subtitle={entry.subtitle}
                    photographer={entry.photo.photographer}
                    license={entry.photo.license}
                  />
                }
              />
              <span className="calibration-corners" aria-hidden />
            </div>
            <Link
              href={entry.href}
              prefetch={false}
              className="mt-2 block px-0.5 outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="block text-sm font-medium text-foreground">
                {entry.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {entry.subtitle}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground" data-gallery-empty hidden>
        No photographs match that filter.
      </p>
    </div>
  )
}

/** Quiet masonry shell for the prefetched Gallery route (cali.so photos pattern). */
export function PlaceGalleryLoading() {
  return (
    <div className="photo-masonry" role="status" aria-busy="true">
      <span className="sr-only">Loading photographs</span>
      {LOADING_ASPECT_RATIOS.map((aspectRatio, index) => (
        <span
          key={index}
          className="photo-item photo-masonry-placeholder"
          style={{ aspectRatio }}
          aria-hidden
        />
      ))}
    </div>
  )
}
