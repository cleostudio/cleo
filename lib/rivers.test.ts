import { describe, expect, it } from 'vitest'

import { getCountryByName } from './countries'
import {
  getRiverSubject,
  riverSubjectSlugs,
  riverSubjects,
  riverSubjectsByCategory,
} from './rivers'

describe('river subjects', () => {
  it('ships a starter catalog with unique slugs and codes', () => {
    expect(riverSubjects.length).toBeGreaterThanOrEqual(26)

    const slugs = riverSubjects.map((subject) => subject.slug)
    const codes = riverSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(riverSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with local photographs', () => {
    for (const subject of riverSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.course).toBeTruthy()
      expect(subject.facts.basin).toBeTruthy()
      expect(subject.facts.hydrology).toBeTruthy()
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
              rendition.src.startsWith('/images/rivers/'),
            ),
        ),
      ).toBe(true)
      expect(getRiverSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = riverSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Africa',
      'Asia',
      'Europe, Americas & Oceania',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'niger')).toBe(
      true,
    )
    expect(groups[1]?.[1].some((subject) => subject.slug === 'indus')).toBe(
      true,
    )
    expect(
      groups[2]?.[1].some((subject) => subject.slug === 'murray-darling'),
    ).toBe(true)
  })

  it('lists Explore countries by exact catalog names', () => {
    for (const subject of riverSubjects) {
      expect(subject.facts.exploreLinks.length).toBeGreaterThan(0)
      for (const part of subject.facts.exploreLinks) {
        expect(getCountryByName(part)?.name).toBe(part)
      }
    }
  })
})
