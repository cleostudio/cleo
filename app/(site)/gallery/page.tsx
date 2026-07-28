import {
  GalleryPageView,
  galleryPageMetadata,
} from '../../_views/gallery-page'

export const instant = true

// Deep links carry ?q= / ?collection=; resolve that URL data at prefetch time.
export const prefetch = 'allow-runtime' as const

export const metadata = galleryPageMetadata()

export default async function EnglishGalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return <GalleryPageView searchParams={params} />
}
