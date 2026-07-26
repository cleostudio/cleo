import { describe, expect, it } from 'vitest'

import {
  elementSubjectSlugs,
  elementSubjects,
  elementSubjectsByCategory,
  getElementSubject,
} from './elements'

describe('element subjects', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(elementSubjects.length).toBe(20)

    const slugs = elementSubjects.map((subject) => subject.slug)
    const codes = elementSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(elementSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with a local photograph', () => {
    for (const subject of elementSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.atomicNumber).toBeGreaterThan(0)
      expect(subject.facts.symbol).toBeTruthy()
      expect(subject.facts.standardState).toBeTruthy()
      expect(subject.photo.renditions).toHaveLength(3)
      expect(
        subject.photo.renditions.every((r) =>
          r.src.startsWith('/images/elements/'),
        ),
      ).toBe(true)
      expect(subject.photo.commonsFile).toBeTruthy()
      expect(subject.photo.license.length).toBeGreaterThan(0)
      expect(getElementSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = elementSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Nonmetals',
      'Alkali & alkaline earth',
      'Other metals & metalloids',
      'Transition & heavy',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'hydrogen')).toBe(
      true,
    )
    expect(groups[1]?.[1].some((subject) => subject.slug === 'sodium')).toBe(
      true,
    )
    expect(groups[2]?.[1].some((subject) => subject.slug === 'silicon')).toBe(
      true,
    )
    expect(groups[3]?.[1].some((subject) => subject.slug === 'iron')).toBe(true)
  })

  it('keeps orientation sentences unique across the Elements corpus', () => {
    const seen = new Map<string, string>()
    for (const subject of elementSubjects) {
      for (const sentence of subject.about.split(/(?<=[.!?])\s+/)) {
        const normalized = sentence.trim().toLowerCase()
        if (normalized.length < 40) continue
        const prior = seen.get(normalized)
        expect(
          prior,
          `duplicate sentence also in ${prior}: ${sentence}`,
        ).toBeUndefined()
        seen.set(normalized, subject.slug)
      }
    }
  })
})
