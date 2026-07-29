import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { ZoomImage } from '~/components/zoom-image'
import type { GalleryCollection } from '~/lib/gallery'
import { staticRendition, type StaticPhoto } from '~/lib/static-photo'

export type GuidePhoto = Pick<
  StaticPhoto,
  | 'alt'
  | 'caption'
  | 'photographer'
  | 'sourceUrl'
  | 'license'
  | 'width'
  | 'height'
  | 'renditions'
> & {
  title: string
}

/**
 * The guide hero carries the editor's strongest image; these companion views
 * complete its three-photograph set without repeating the hero in the grid.
 */
export function GuidePhotoCollection({
  collection,
  subject,
  photos,
  sourceLabel,
}: {
  collection: GalleryCollection
  subject: string
  photos: readonly GuidePhoto[]
  sourceLabel: string
}) {
  if (photos.length === 0) return null

  return (
    <section className="mt-10" aria-labelledby="guide-more-photographs">
      <h2 id="guide-more-photographs" className="guide-label">
        More photographs
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <figure key={photo.sourceUrl}>
            <ZoomImage
              src={staticRendition(photo, 1280).src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="photo-frame aspect-[3/2] w-full object-cover"
              sizes="(max-width: 40rem) 100vw, 20rem"
              renditions={photo.renditions.map((rendition) => ({
                src: rendition.src,
                width: rendition.width,
              }))}
              expandedContent={
                <PhotoZoomDetails
                  collection={collection}
                  title={photo.title}
                  subtitle={subject}
                  photographer={photo.photographer}
                  license={photo.license}
                />
              }
            />
            <figcaption className="guide-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
              <span>{photo.caption}</span>
              <span>
                {photo.photographer} ·{' '}
                <a
                  href={photo.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  {sourceLabel}
                </a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
