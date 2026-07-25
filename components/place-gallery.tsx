import Link from 'next/link'

import { AtlasImage } from '~/components/atlas-image'
import { PlaceGalleryToolbar } from '~/components/place-gallery-toolbar'
import type { GalleryItem } from '~/lib/gallery'

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
            <Link
              href={entry.href}
              prefetch={false}
              className="group block outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <AtlasImage
                photo={entry.photo}
                width={640}
                alt={entry.photo.alt}
                className="photo-frame w-full object-cover transition-[filter] duration-200 group-hover:brightness-[1.03]"
                sizes="(max-width: 40rem) 50vw, 12.5rem"
                loading="lazy"
              />
              <div className="mt-2 space-y-0.5 px-0.5">
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground">{entry.subtitle}</p>
              </div>
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
