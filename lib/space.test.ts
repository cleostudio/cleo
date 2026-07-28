import { describe, expect, it } from 'vitest'

import {
  getSpaceSubject,
  spaceSubjectSlugs,
  spaceSubjects,
  spaceSubjectsByCategory,
} from './space'

describe('space subjects', () => {
  it('ships a curated catalog with unique slugs and codes', () => {
    expect(spaceSubjects.length).toBeGreaterThanOrEqual(20)

    const slugs = spaceSubjects.map((subject) => subject.slug)
    const codes = spaceSubjects.map((subject) => subject.code)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(codes).size).toBe(codes.length)
    expect(spaceSubjectSlugs()).toEqual(slugs)
  })

  it('keeps each article structured with a local photograph', () => {
    for (const subject of spaceSubjects) {
      expect(subject.about.length).toBeGreaterThan(120)
      expect(subject.features).toHaveLength(3)
      expect(subject.sources.length).toBeGreaterThanOrEqual(1)
      expect(subject.facts.kind).toBeTruthy()
      expect(subject.facts.system).toBeTruthy()
      expect(subject.photo.renditions).toHaveLength(3)
      expect(subject.photo.renditions.every((r) => r.src.startsWith('/images/space/'))).toBe(
        true,
      )
      expect(subject.photo.license).toContain('NASA')
      expect(getSpaceSubject(subject.slug)).toEqual(subject)
    }
  })

  it('groups subjects by category in catalog order', () => {
    const groups = spaceSubjectsByCategory()
    expect(groups.map(([category]) => category)).toEqual([
      'Solar System',
      'Moons',
      'Deep Space',
    ])
    expect(groups[0]?.[1].some((subject) => subject.slug === 'mars')).toBe(true)
    expect(groups[0]?.[1].some((subject) => subject.slug === 'iss')).toBe(true)
    expect(groups[1]?.[1].some((subject) => subject.slug === 'europa')).toBe(
      true,
    )
    expect(groups[2]?.[1].some((subject) => subject.slug === 'orion-nebula')).toBe(
      true,
    )
  })
})
