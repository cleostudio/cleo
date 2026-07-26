import { describe, expect, it } from 'vitest'

import {
  getOceanSubject,
  oceanSubjectSlugs,
  oceanSubjects,
  oceanSubjectsByCategory,
} from './oceans'

describe('ocean subjects', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(oceanSubjects.length).toBeGreaterThanOrEqual(12)

    const slugs = oceanSubjects.map((subject) => subject.slug)
    const codes = oceanSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(oceanSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with a local photograph', () => {
    for (const subject of oceanSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.basin).toBeTruthy()
      expect(subject.photo.renditions).toHaveLength(3)
      expect(
        subject.photo.renditions.every((r) => r.src.startsWith('/images/oceans/')),
      ).toBe(true)
      expect(subject.photo.license).toContain('NASA')
      expect(getOceanSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = oceanSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'World Ocean',
      'Ocean basins',
      'Seas & gulfs',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'world-ocean')).toBe(
      true,
    )
    expect(groups[1]?.[1].some((subject) => subject.slug === 'pacific')).toBe(true)
    expect(groups[2]?.[1].some((subject) => subject.slug === 'mediterranean')).toBe(
      true,
    )
  })

  it('keeps orientation sentences unique across the Oceans corpus', () => {
    const seen = new Map<string, string>()
    for (const subject of oceanSubjects) {
      for (const sentence of subject.about.split(/(?<=[.!?])\s+/)) {
        const normalized = sentence.trim().toLowerCase()
        if (normalized.length < 40) continue
        const prior = seen.get(normalized)
        expect(prior, `duplicate sentence also in ${prior}: ${sentence}`).toBeUndefined()
        seen.set(normalized, subject.slug)
      }
    }
  })
})
