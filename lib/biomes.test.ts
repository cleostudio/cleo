import { describe, expect, it } from 'vitest'

import {
  biomeSubjectSlugs,
  biomeSubjects,
  biomeSubjectsByCategory,
  getBiomeSubject,
} from './biomes'

describe('biome subjects', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(biomeSubjects.length).toBe(12)

    const slugs = biomeSubjects.map((subject) => subject.slug)
    const codes = biomeSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(biomeSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each guide structured like a field record with a local photograph', () => {
    for (const subject of biomeSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.climate).toBeTruthy()
      expect(subject.photo.renditions).toHaveLength(3)
      expect(
        subject.photo.renditions.every((r) => r.src.startsWith('/images/biomes/')),
      ).toBe(true)
      expect(subject.photo.license).toContain('NASA')
      expect(getBiomeSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = biomeSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Polar & montane',
      'Forests',
      'Open lands',
      'Waters',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'tundra')).toBe(true)
    expect(groups[1]?.[1].some((subject) => subject.slug === 'boreal-forest')).toBe(
      true,
    )
    expect(groups[2]?.[1].some((subject) => subject.slug === 'desert')).toBe(true)
    expect(groups[3]?.[1].some((subject) => subject.slug === 'coral-reef')).toBe(
      true,
    )
  })

  it('keeps orientation sentences unique across the Biomes corpus', () => {
    const seen = new Map<string, string>()
    for (const subject of biomeSubjects) {
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
