/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { allGalleryItems } from '~/lib/gallery'
import { getAtlasEntry } from '~/lib/atlas'
import { getBiomeSubject } from '~/lib/biomes'
import { getElementSubject } from '~/lib/elements'
import { getOceanSubject } from '~/lib/oceans'
import { getSpaceSubject } from '~/lib/space'

describe('PhotoZoomDetails field parity', () => {
  it('gallery place items match Explore topic page fields', () => {
    const places = allGalleryItems().filter((i) => i.collection === 'places')
    expect(places.length).toBeGreaterThan(0)
    for (const item of places) {
      const slug = item.href.replace('/explore/', '')
      const entry = getAtlasEntry(slug)
      expect(entry, slug).toBeTruthy()
      expect(item.title).toBe(entry!.photo.placeName)
      expect(item.subtitle).toBe(entry!.name)
      expect(item.photo.photographer).toBe(entry!.photo.photographer)
      expect(item.photo.license).toBe(entry!.photo.license)
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

  it('gallery ocean items match Oceans topic page fields', () => {
    const oceans = allGalleryItems().filter((i) => i.collection === 'oceans')
    expect(oceans.length).toBeGreaterThan(0)
    for (const item of oceans) {
      const slug = item.href.replace('/oceans/', '')
      const subject = getOceanSubject(slug)
      expect(subject, slug).toBeTruthy()
      expect(item.title).toBe(subject!.photo.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(subject!.photo.photographer)
      expect(item.photo.license).toBe(subject!.photo.license)
    }
  })

  it('gallery biome items match Biomes topic page fields', () => {
    const biomes = allGalleryItems().filter((i) => i.collection === 'biomes')
    expect(biomes.length).toBeGreaterThan(0)
    for (const item of biomes) {
      const slug = item.href.replace('/biomes/', '')
      const subject = getBiomeSubject(slug)
      expect(subject, slug).toBeTruthy()
      expect(item.title).toBe(subject!.photo.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(subject!.photo.photographer)
      expect(item.photo.license).toBe(subject!.photo.license)
    }
  })

  it('gallery element items match Elements topic page fields', () => {
    const elements = allGalleryItems().filter((i) => i.collection === 'elements')
    expect(elements.length).toBeGreaterThan(0)
    for (const item of elements) {
      const slug = item.href.replace('/elements/', '')
      const subject = getElementSubject(slug)
      expect(subject, slug).toBeTruthy()
      expect(item.title).toBe(subject!.photo.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(subject!.photo.photographer)
      expect(item.photo.license).toBe(subject!.photo.license)
    }
  })
})

