/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { allTopicPhotoItems } from '~/lib/gallery'
import { getAtlasEntry } from '~/lib/atlas'
import { getCitySubject } from '~/lib/cities'
import { getCivilizationSubject } from '~/lib/civilizations'
import { getOceanSubject } from '~/lib/oceans'
import { getRiverSubject } from '~/lib/rivers'
import { getSpaceSubject } from '~/lib/space'

describe('PhotoZoomDetails field parity', () => {
  it('gallery place items match Explore topic page fields', () => {
    const places = allTopicPhotoItems().filter((i) => i.collection === 'places')
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
    const space = allTopicPhotoItems().filter((i) => i.collection === 'space')
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

  it('gallery civilization items match Civilizations topic page fields', () => {
    const civilizations = allTopicPhotoItems().filter(
      (i) => i.collection === 'civilizations',
    )
    expect(civilizations.length).toBeGreaterThan(0)
    for (const item of civilizations) {
      const slug = item.href.replace('/civilizations/', '')
      const subject = getCivilizationSubject(slug)
      expect(subject, slug).toBeTruthy()
      const photo = subject!.photos.find(
        (photo) => photo.sourceUrl === item.photo.sourceUrl,
      )
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })

  it('gallery city items match Cities topic page fields', () => {
    const cities = allTopicPhotoItems().filter((i) => i.collection === 'cities')
    expect(cities.length).toBeGreaterThan(0)
    for (const item of cities) {
      const slug = item.href.replace('/cities/', '')
      const subject = getCitySubject(slug)
      expect(subject, slug).toBeTruthy()
      const photo = subject!.photos.find(
        (photo) => photo.sourceUrl === item.photo.sourceUrl,
      )
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })

  it('gallery ocean items match Oceans topic page fields', () => {
    const oceans = allTopicPhotoItems().filter((i) => i.collection === 'oceans')
    expect(oceans.length).toBeGreaterThan(0)
    for (const item of oceans) {
      const slug = item.href.replace('/oceans/', '')
      const subject = getOceanSubject(slug)
      expect(subject, slug).toBeTruthy()
      const photo = subject!.photos.find(
        (photo) => photo.sourceUrl === item.photo.sourceUrl,
      )
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })

  it('gallery river items match Rivers topic page fields', () => {
    const rivers = allTopicPhotoItems().filter((i) => i.collection === 'rivers')
    expect(rivers.length).toBeGreaterThan(0)
    for (const item of rivers) {
      const slug = item.href.replace('/rivers/', '')
      const subject = getRiverSubject(slug)
      expect(subject, slug).toBeTruthy()
      const photo = subject!.photos.find(
        (photo) => photo.sourceUrl === item.photo.sourceUrl,
      )
      expect(photo, item.id).toBeTruthy()
      expect(item.title).toBe(photo!.featureName)
      expect(item.subtitle).toBe(subject!.name)
      expect(item.photo.photographer).toBe(photo!.photographer)
      expect(item.photo.license).toBe(photo!.license)
    }
  })
})
