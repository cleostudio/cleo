import { describe, expect, it } from 'vitest'

import { allGalleryItems } from '~/lib/gallery'

/**
 * Every photograph carries a licence that requires attribution, and the
 * Gallery lightbox now prints the credit on the spec plate. Commons files
 * sometimes put a file note ("NOTE: This image is a panorama…") or "Own work"
 * in the Artist field, which credits nobody; one of those shipped for a while.
 */

const photos = allGalleryItems().map((item) => ({
  credit: item.photo.photographer,
  license: item.photo.license,
  slug: item.id,
}))

describe('photo attribution', () => {
  it('credits every photograph', () => {
    expect(photos.length).toBeGreaterThan(0)

    const uncredited = photos
      .filter(({ credit }) => credit.trim().length < 3)
      .map(({ slug }) => slug)

    expect(uncredited).toEqual([])
  })

  it('names a person or institution rather than a file note', () => {
    const notes = photos
      .filter(({ credit }) =>
        /^\s*(note|warning|this (image|file|photo)|own work)\b/i.test(credit),
      )
      .map(({ credit, slug }) => `${slug}: ${credit.slice(0, 48)}`)

    expect(notes).toEqual([])
  })

  it('keeps credits short enough to read on the lightbox plate', () => {
    // Longer than this is a description that leaked into the credit field.
    const overlong = photos
      .filter(({ credit }) => credit.length > 100)
      .map(({ credit, slug }) => `${slug}: ${credit.length} chars`)

    expect(overlong).toEqual([])
  })

  it('states a licence for every photograph', () => {
    const unlicensed = photos
      .filter(({ license }) => license.trim().length < 3)
      .map(({ slug }) => slug)

    expect(unlicensed).toEqual([])
  })
})
