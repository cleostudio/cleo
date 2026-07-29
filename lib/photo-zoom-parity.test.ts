/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { allGalleryItems } from '~/lib/gallery'
import { getAtlasEntry } from '~/lib/atlas'
import { getSpaceSubject } from '~/lib/space'

describe('PhotoZoomDetails field parity', () => {
  it('gallery place items match Explore topic page fields', () => {
    const places = allGalleryItems().filter((i) => i.collection === 'places')
    expect(places.length).toBeGreaterThan(0)
    for (const item of places) {
      const slug = item.href.replace('/explore/', '')
      const entry = getAtlasEntry(slug)
      expect(entry, slug).toBeTruthy()
      const photo = entry!.photos.find((photo) => photo.sourceUrl === item.photo.sourceUrl)
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.placeName)
      expect(item.subtitle).toBe(entry!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })

  it('gallery space items match Space topic page fields', () => {
    const space = allGalleryItems().filter((i) => i.collection === 'space')
    expect(space.length).toBeGreaterThan(0)
    for (const item of space) {
      const slug = item.href.replace('/space/', '')
      const subject = getSpaceSubject(slug)
      expect(subject, slug).toBeTruthy()
      const photo = subject!.photos.find((photo) => photo.sourceUrl === item.photo.sourceUrl)
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })
})
