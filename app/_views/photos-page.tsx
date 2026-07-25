import { CountryAtlas } from '~/components/country-atlas'
import { PixelCluster } from '~/components/pixel-cluster'
import {
  allAtlasEntries,
  atlasRegions,
} from '~/lib/atlas'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function photosPageMetadata() {
  const copy = publicPageMetadata.photos
  const count = allAtlasEntries().length
  return localeMetadata({
    path: '/photos',
    title: copy.title,
    description: `${count} country atlas places — filter by region or search by country and place.`,
  })
}

export function PhotosPageView() {
  const entries = allAtlasEntries()
  const regions = atlasRegions()

  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[34rem]">
          <h1 className="page-eyebrow enter">
            <T zh="照片" en="Photos" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Country atlas — one curated place photograph for every country on
            Explore. Filter by region or search by country and place.
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-8">
        <CountryAtlas entries={entries} regions={regions} />
      </div>
    </div>
  )
}
