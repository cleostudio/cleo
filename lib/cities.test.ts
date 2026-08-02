import { describe, expect, it } from 'vitest'

import {
  citySubjectSlugs,
  citySubjects,
  citySubjectsByCategory,
  getCitySubject,
} from './cities'
import { getCountryByName } from './countries'

describe('city subjects', () => {
  it('ships a regional catalog with unique slugs and codes', () => {
    expect(citySubjects.length).toBeGreaterThanOrEqual(11)

    const slugs = citySubjects.map((subject) => subject.slug)
    const codes = citySubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(citySubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with local photographs', () => {
    for (const subject of citySubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.country).toBeTruthy()
      expect(subject.facts.corridors).toBeTruthy()
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
              rendition.src.startsWith('/images/cities/'),
            ),
        ),
      ).toBe(true)
      expect(getCitySubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = citySubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Mediterranean & Europe',
      'Asia',
      'Africa & Americas',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'istanbul')).toBe(
      true,
    )
    expect(groups[1]?.[1].some((subject) => subject.slug === 'kyoto')).toBe(
      true,
    )
    expect(groups[2]?.[1].some((subject) => subject.slug === 'cairo')).toBe(
      true,
    )
  })

  it('lists Explore countries by exact catalog names', () => {
    for (const subject of citySubjects) {
      expect(subject.facts.exploreLinks.length).toBeGreaterThan(0)
      for (const part of subject.facts.exploreLinks) {
        expect(getCountryByName(part)?.name).toBe(part)
      }
    }
  })
})
