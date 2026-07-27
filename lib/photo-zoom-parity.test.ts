/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { allGalleryItems } from '~/lib/gallery'
import { getAtlasEntry } from '~/lib/atlas'
import { getPlaceGuide } from '~/lib/places'
import { getSpaceSubject } from '~/lib/space'

describe('PhotoZoomDetails field parity', () => {
  it('gallery country items match Explore topic page fields', () => {
    const countries = allGalleryItems().filter(
      (i) => i.collection === 'places' && /^\/explore\/[a-z0-9-]+$/.test(i.href),
    )
    expect(countries.length).toBeGreaterThan(0)
    for (const item of countries) {
      const slug = item.href.replace('/explore/', '')
      const entry = getAtlasEntry(slug)
      expect(entry, slug).toBeTruthy()
      expect(item.title).toBe(entry!.photo.placeName)
      expect(item.subtitle).toBe(entry!.name)
      expect(item.photo.photographer).toBe(entry!.photo.photographer)
      expect(item.photo.license).toBe(entry!.photo.license)
    }
  })

  it('gallery nested place items match place guide fields', () => {
    const places = allGalleryItems().filter(
      (i) =>
        i.collection === 'places' &&
        /^\/explore\/[a-z0-9-]+\/[a-z0-9-]+$/.test(i.href),
    )
    expect(places.length).toBeGreaterThan(0)
    for (const item of places) {
      const placeSlug = item.href.split('/').at(-1)!
      const place = getPlaceGuide(placeSlug)
      expect(place, placeSlug).toBeTruthy()
      expect(item.title).toBe(place!.photo.featureName)
      expect(item.subtitle).toBe(place!.name)
      expect(item.photo.photographer).toBe(place!.photo.photographer)
      expect(item.photo.license).toBe(place!.photo.license)
    }
  })

  it('gallery space items match Space topic page fields', () => {
    const space = allGalleryItems().filter((i) => i.collection === 'space')
    expect(space.length).toBeGreaterThan(0)
    for (const item of space) {
      const slug = item.href.replace('/space/', '')
      const subject = getSpaceSubject(slug)
      expect(subject, slug).toBeTruthy()
      expect(item.title).toBe(subject!.photo.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(subject!.photo.photographer)
      expect(item.photo.license).toBe(subject!.photo.license)
    }
  })
})
