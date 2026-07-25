import { PlaceGallery } from '~/components/place-gallery'
import { PixelCluster } from '~/components/pixel-cluster'
import {
  allAtlasEntries,
  atlasRegions,
} from '~/lib/atlas'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function galleryPageMetadata() {
  const copy = publicPageMetadata.gallery
  const count = allAtlasEntries().length
  return localeMetadata({
    path: '/gallery',
    title: copy.title,
    description: `${count} place photographs — filter by region or search by country and place.`,
  })
}

export function GalleryPageView() {
  const entries = allAtlasEntries()
  const regions = atlasRegions()

  return (
    <div className="mx-auto w-full max-w-[42rem] px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[38.5rem]">
          <h1 className="page-eyebrow enter">
            <T zh="图库" en="Gallery" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            One curated place photograph for every country on Explore. Filter by
            region or search by country and place.
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-8">
        <PlaceGallery entries={entries} regions={regions} />
      </div>
    </div>
  )
}
