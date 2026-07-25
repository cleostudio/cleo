import {
  PhotosPageView,
  photosPageMetadata,
} from '../../_views/photos-page'

// Country place masonry is static content from baked guides.
export const instant = true

export const metadata = photosPageMetadata()

export default function EnglishPhotosPage() {
  return <PhotosPageView />
}
