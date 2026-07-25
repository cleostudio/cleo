import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

import {
  PlaceGallery,
  PlaceGalleryLoading,
} from '~/components/place-gallery'
import { PixelCluster } from '~/components/pixel-cluster'
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

export function GalleryPageView() {
  return (
    <div className="mx-auto w-full max-w-[42rem] px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[38.5rem]">
          <h1 className="page-eyebrow enter">
            <T zh="图库" en="Gallery" />
          </h1>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-8">
        <Suspense fallback={<PlaceGalleryLoading />}>
          <PlaceGalleryMasonry />
        </Suspense>
      </div>
    </div>
  )
}

async function PlaceGalleryMasonry() {
  'use cache'
  cacheLife('max')
  const entries = allGalleryItems()
  const filterKeys = galleryFilterKeys()
  return <PlaceGallery entries={entries} filterKeys={filterKeys} />
}
