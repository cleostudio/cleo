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
    expect(placeGuides.length).toBeGreaterThanOrEqual(448)

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
    expect(matchPlaceGuideForBlurb('france', 'Eiffel Tower')?.slug).toBe(
      'eiffel-tower',
    )
    expect(matchPlaceGuideForBlurb('italy', 'Colosseum')?.slug).toBe(
      'colosseum',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Statue of Liberty')?.slug,
    ).toBe('statue-of-liberty')
    expect(
      matchPlaceGuideForBlurb('australia', 'Sydney Opera House')?.slug,
    ).toBe('sydney-opera-house')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Golden Gate Bridge')?.slug,
    ).toBe('golden-gate')
    expect(matchPlaceGuideForBlurb('greece', 'Acropolis of Athens')?.slug).toBe(
      'acropolis',
    )
    expect(
      matchPlaceGuideForBlurb('italy', 'Leaning Tower of Pisa')?.slug,
    ).toBe('leaning-tower')
    expect(matchPlaceGuideForBlurb('turkiye', 'Hagia Sophia')?.slug).toBe(
      'hagia-sophia',
    )
    expect(matchPlaceGuideForBlurb('turkiye', 'Blue Mosque')?.slug).toBe(
      'blue-mosque',
    )
    expect(
      matchPlaceGuideForBlurb('germany', 'Brandenburg Gate')?.slug,
    ).toBe('brandenburg-gate')
    expect(matchPlaceGuideForBlurb('italy', 'Trevi Fountain')?.slug).toBe(
      'trevi-fountain',
    )
    expect(matchPlaceGuideForBlurb('france', 'Arc de Triomphe')?.slug).toBe(
      'arc-de-triomphe',
    )
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Tower Bridge')?.slug,
    ).toBe('tower-bridge')
    expect(matchPlaceGuideForBlurb('italy', 'Duomo di Milano')?.slug).toBe(
      'duomo-milan',
    )
    expect(matchPlaceGuideForBlurb('united-states', 'Sacramento')?.slug).toBe(
      'sacramento',
    )
    expect(matchPlaceGuideForBlurb('canada', 'Winnipeg')?.slug).toBe('winnipeg')
    expect(matchPlaceGuideForBlurb('croatia', 'Zagreb')?.slug).toBe('zagreb')
    expect(
      matchPlaceGuideForBlurb('bosnia-and-herzegovina', 'Sarajevo')?.slug,
    ).toBe('sarajevo')
    expect(matchPlaceGuideForBlurb('india', 'Cochin')?.slug).toBe('kochi')
    expect(matchPlaceGuideForBlurb('united-states', 'Ohio')?.slug).toBe('ohio')
    expect(matchPlaceGuideForBlurb('greece', 'Amorgos')?.slug).toBe('amorgos')
    expect(matchPlaceGuideForBlurb('italy', 'Apulia')?.slug).toBe('puglia')
    expect(
      matchPlaceGuideForBlurb('united-kingdom', 'Elizabeth Tower')?.slug,
    ).toBe('big-ben')
    expect(
      matchPlaceGuideForBlurb('france', 'Notre-Dame de Paris')?.slug,
    ).toBe('notre-dame')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Lincoln Memorial')?.slug,
    ).toBe('lincoln-memorial')
    expect(
      matchPlaceGuideForBlurb('united-states', 'Mount Rainier')?.slug,
    ).toBe('mount-rainier')
    expect(matchPlaceGuideForBlurb('russia', 'Red Square')?.slug).toBe(
      'red-square',
    )
    expect(matchPlaceGuideForBlurb('canada', 'CN Tower')?.slug).toBe('cn-tower')
    expect(matchPlaceGuideForBlurb('united-states', 'Charlotte')?.slug).toBe(
      'charlotte',
    )
    expect(matchPlaceGuideForBlurb('croatia', 'Dubrovnik')?.slug).toBe(
      'dubrovnik',
    )
    expect(matchPlaceGuideForBlurb('albania', 'Tirana')?.slug).toBe('tirana')
    expect(matchPlaceGuideForBlurb('united-states', 'Illinois')?.slug).toBe(
      'illinois',
    )
    expect(matchPlaceGuideForBlurb('greece', 'Sifnos')?.slug).toBe('sifnos')
    expect(matchPlaceGuideForBlurb('spain', 'Asturias')?.slug).toBe('asturias')
    expect(matchPlaceGuideForBlurb('united-kingdom', 'London Eye')?.slug).toBe(
      'london-eye',
    )
    expect(matchPlaceGuideForBlurb('france', 'Sacré-Cœur')?.slug).toBe(
      'sacre-coeur',
    )
    expect(
      matchPlaceGuideForBlurb('united-states', 'Devils Tower')?.slug,
    ).toBe('devils-tower')
    expect(matchPlaceGuideForBlurb('united-states', 'Crater Lake')?.slug).toBe(
      'crater-lake',
    )
    expect(
      matchPlaceGuideForBlurb('spain', 'Alcázar of Seville')?.slug,
    ).toBe('alcazar-seville')
    expect(
      matchPlaceGuideForBlurb('germany', 'Hohenzollern Castle')?.slug,
    ).toBe('hohenzollern')
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
