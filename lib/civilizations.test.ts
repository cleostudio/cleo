import { describe, expect, it } from 'vitest'

import {
  civilizationSubjectSlugs,
  civilizationSubjects,
  civilizationSubjectsByCategory,
  getCivilizationSubject,
} from './civilizations'
import { countries, getCountryByName } from './countries'

describe('civilization subjects', () => {
  it('ships a starter catalog with unique slugs and codes', () => {
    expect(civilizationSubjects.length).toBeGreaterThanOrEqual(3)

    const slugs = civilizationSubjects.map((subject) => subject.slug)
    const codes = civilizationSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(civilizationSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with local photographs', () => {
    for (const subject of civilizationSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.heartland).toBeTruthy()
      expect(subject.facts.era).toBeTruthy()
      expect(subject.photos).toHaveLength(3)
      expect(
        new Set(subject.photos.map((photo) => photo.commonsTitle)).size,
      ).toBe(3)
      expect(
        subject.photos.every(
          (photo) =>
            photo.renditions.length >= 1 &&
            photo.renditions.length <= 3 &&
            photo.renditions.every((rendition) =>
              rendition.src.startsWith('/images/civilizations/'),
            ),
        ),
      ).toBe(true)
      expect(getCivilizationSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = civilizationSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Africa & Near East',
      'Mediterranean',
      'Asia',
      'Americas',
      'Oceania',
    ])
    expect(
      groups[0]?.[1].some((subject) => subject.slug === 'ancient-egypt'),
    ).toBe(true)
    expect(
      groups[1]?.[1].some((subject) => subject.slug === 'roman-empire'),
    ).toBe(true)
    expect(groups[2]?.[1].some((subject) => subject.slug === 'han-china')).toBe(
      true,
    )
    expect(groups[3]?.[1].some((subject) => subject.slug === 'maya')).toBe(true)
    expect(groups[4]?.[1].some((subject) => subject.slug === 'polynesia')).toBe(
      true,
    )
  })

  it('covers a broad starter set across regions', () => {
    expect(civilizationSubjects.length).toBeGreaterThanOrEqual(27)
    expect(civilizationSubjectSlugs()).toEqual(
      expect.arrayContaining([
        'mesopotamia',
        'classical-greece',
        'han-china',
        'inca',
        'mali-empire',
        'achaemenid-persia',
        'ottoman-empire',
        'mongol-empire',
        'tang-china',
        'classical-japan',
        'kush',
        'great-zimbabwe',
        'gupta-empire',
        'teotihuacan',
        'polynesia',
        'chola-empire',
        'olmec',
        'early-caliphates',
      ]),
    )
  })

  it('lists Explore countries by exact catalog names', () => {
    const names = new Set(countries.map((country) => country.name))
    for (const subject of civilizationSubjects) {
      expect(subject.facts.exploreLinks.length).toBeGreaterThan(0)
      for (const part of subject.facts.exploreLinks) {
        expect(names.has(part), `${subject.slug}: ${part}`).toBe(true)
        expect(getCountryByName(part)?.name).toBe(part)
      }
    }
  })
})
