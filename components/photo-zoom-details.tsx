import type { CSSProperties } from 'react'

import type { GalleryCollection } from '~/lib/gallery'

/**
 * Capture plate for the photo lightbox. Shared by Gallery tiles and field-guide
 * heroes so the same photograph always shows the same labeled cells.
 * The overlay is view-only (`.zoom-overlay-details` is `pointer-events: none`).
 */
export function PhotoZoomDetails({
  collection,
  title,
  subtitle,
  photographer,
  license,
}: {
  collection: GalleryCollection
  /** Featured place / feature name. */
  title: string
  /** Country, space-subject, civilization, or city name. */
  subtitle: string
  photographer: string
  license: string
}) {
  const titleLabel =
    collection === 'places'
      ? 'Place'
      : collection === 'civilizations' || collection === 'cities'
        ? 'Site'
        : 'Feature'
  const subjectLabel =
    collection === 'places'
      ? 'Country'
      : collection === 'civilizations'
        ? 'Civilization'
        : collection === 'cities'
          ? 'City'
          : 'Subject'
  const fields = [
    { label: titleLabel, value: title },
    { label: subjectLabel, value: subtitle },
    { label: 'Photograph', value: photographer },
    { label: 'License', value: license },
  ]

  return (
    <div className="mx-auto w-full max-w-content px-6 text-foreground">
      <dl className="spec-plate spec-plate-flow zoom-detail-frame">
        {fields.map((field, index) => (
          <div
            className="zoom-detail-item"
            key={field.label}
            style={{ '--detail-index': index } as CSSProperties}
          >
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
