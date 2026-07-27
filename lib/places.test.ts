import { describe, expect, it } from 'vitest'

import { countrySlugs } from './countries'
import {
  assertPlaceCatalogIntegrity,
  getPlaceGuide,
  matchPlaceGuideForBlurb,
  placeGuideSlugs,
  placeGuides,
  placeGuidesByKind,
  placeHref,
  placesForCountry,
} from './places'

describe('place guides', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(placeGuides.length).toBeGreaterThanOrEqual(210)

    const slugs = placeGuides.map((place) => place.slug)
    const codes = placeGuides.map((place) => place.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(placeGuideSlugs()).toEqual(slugs)
    expect(() => assertPlaceCatalogIntegrity()).not.toThrow()
  })

  it('keeps each guide structured like a field record with a local photograph', () => {
    for (const place of placeGuides) {
      expect(place.about.length).toBeGreaterThan(120)
      expect(place.features).toHaveLength(3)
      expect(place.sources.length).toBeGreaterThanOrEqual(1)
      expect(place.facts.kind).toBeTruthy()
      expect(place.facts.country).toBeTruthy()
      expect(countrySlugs()).toContain(place.countrySlug)
      expect(place.photo.renditions).toHaveLength(3)
      expect(
        place.photo.renditions.every((r) =>
          r.src.startsWith(`/images/places/${place.slug}/`),
        ),
      ).toBe(true)
      expect(getPlaceGuide(place.slug)).toEqual(place)
      expect(placeHref(place)).toBe(`/explore/${place.countrySlug}/${place.slug}`)
    }
  })

  it('groups places by kind and parents them to countries', () => {
    const kinds = placeGuidesByKind().map(([kind]) => kind)
    expect(kinds).toEqual(
      expect.arrayContaining(['City', 'State', 'Region', 'Island', 'Landmark']),
    )
    expect(placesForCountry('japan').some((place) => place.slug === 'tokyo')).toBe(
      true,
    )
    expect(matchPlaceGuideForBlurb('japan', 'Mount Fuji')?.slug).toBe('mount-fuji')
    expect(matchPlaceGuideForBlurb('greece', 'Santorini Caldera')?.slug).toBe(
      'santorini',
    )
    expect(matchPlaceGuideForBlurb('china', 'Great Wall of China')?.slug).toBe(
      'great-wall',
    )
    expect(matchPlaceGuideForBlurb('vietnam', 'Ha Long Bay')?.slug).toBe(
      'ha-long-bay',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Acropolis of Athens')?.slug).toBe(
      'athens',
    )
    expect(matchPlaceGuideForBlurb('france', 'Mont Saint-Michel')?.slug).toBe(
      'mont-saint-michel',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Banff National Park')?.slug).toBe(
      'banff',
    )
    expect(matchPlaceGuideForBlurb('tanzania', 'Mount Kilimanjaro')?.slug).toBe(
      'kilimanjaro',
    )
    expect(matchPlaceGuideForBlurb('india', 'New Delhi')?.slug).toBe('delhi')
    expect(matchPlaceGuideForBlurb('mexico', 'Chichen Itza')?.slug).toBe(
      'chichen-itza',
    )
    expect(matchPlaceGuideForBlurb('united-kingdom', 'Stonehenge')?.slug).toBe(
      'stonehenge',
    )
    expect(
      matchPlaceGuideForBlurb('brazil', 'Christ the Redeemer')?.slug,
    ).toBe('christ-the-redeemer')
    expect(matchPlaceGuideForBlurb('vietnam', 'Saigon')?.slug).toBe(
      'ho-chi-minh',
    )
    expect(
      matchPlaceGuideForBlurb('spain', 'Sagrada Familia')?.slug,
    ).toBe('sagrada-familia')
    expect(matchPlaceGuideForBlurb('japan', 'Fushimi Inari')?.slug).toBe(
      'fushimi-inari',
    )
  })

  it('never reuses a sentence between place guides', () => {
    const seen = new Map<string, string>()
    const shared: string[] = []

    for (const place of placeGuides) {
      const sentences = place.about
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.split(/\s+/).length >= 6)

      for (const sentence of sentences) {
        const owner = seen.get(sentence)
        if (owner && owner !== place.slug) {
          shared.push(`${owner} / ${place.slug}: "${sentence.slice(0, 60)}…"`)
        } else {
          seen.set(sentence, place.slug)
        }
      }
    }

    expect(shared).toEqual([])
  })
})
