import { describe, expect, it } from 'vitest'

import { getCountryByName } from './countries'
import {
  getOceanSubject,
  oceanSubjectSlugs,
  oceanSubjects,
  oceanSubjectsByCategory,
} from './oceans'

describe('ocean subjects', () => {
  it('ships a starter catalog with unique slugs and codes', () => {
    expect(oceanSubjects.length).toBeGreaterThanOrEqual(20)

    const slugs = oceanSubjects.map((subject) => subject.slug)
    const codes = oceanSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(oceanSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with local photographs', () => {
    for (const subject of oceanSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.extent).toBeTruthy()
      expect(subject.facts.circulation).toBeTruthy()
      expect(subject.facts.bathymetry).toBeTruthy()
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
              rendition.src.startsWith('/images/oceans/'),
            ),
        ),
      ).toBe(true)
      expect(getOceanSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = oceanSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'World ocean basins',
      'Major seas',
      'Polar seas',
    ])
    expect(
      groups[0]?.[1].some((subject) => subject.slug === 'pacific-ocean'),
    ).toBe(true)
    expect(
      groups[1]?.[1].some((subject) => subject.slug === 'mediterranean-sea'),
    ).toBe(true)
    expect(
      groups[2]?.[1].some((subject) => subject.slug === 'arctic-ocean'),
    ).toBe(true)
    expect(
      groups[2]?.[1].some((subject) => subject.slug === 'bering-sea'),
    ).toBe(true)
  })

  it('lists Explore countries by exact catalog names', () => {
    for (const subject of oceanSubjects) {
      expect(subject.facts.exploreLinks.length).toBeGreaterThan(0)
      for (const part of subject.facts.exploreLinks) {
        expect(getCountryByName(part)?.name).toBe(part)
      }
    }
  })
})
