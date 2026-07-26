import { describe, expect, it } from 'vitest'

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

import {
  isKnownGuideHref,
  knownExploreGuideCount,
  knownSpaceGuideCount,
  SPACE_GUIDE_SLUGS,
} from './portal-guide-slugs'

describe('portal guide slug allowlist', () => {
  it('mirrors every Explore country slug', () => {
    expect(knownExploreGuideCount()).toBe(countries.length)
    for (const country of countries) {
      expect(isKnownGuideHref(`/explore/${country.slug}`)).toBe(true)
    }
  })

  it('mirrors every Space subject slug', () => {
    const live = spaceSubjects.map((subject) => subject.slug).sort()
    expect([...SPACE_GUIDE_SLUGS].sort()).toEqual(live)
    expect(knownSpaceGuideCount()).toBe(spaceSubjects.length)
    for (const subject of spaceSubjects) {
      expect(isKnownGuideHref(`/space/${subject.slug}`)).toBe(true)
    }
  })

  it('rejects invented guide paths', () => {
    expect(isKnownGuideHref('/explore/not-a-real-country')).toBe(false)
    expect(isKnownGuideHref('/space/krypton')).toBe(false)
    expect(isKnownGuideHref('/gallery?q=Japan')).toBe(false)
    expect(isKnownGuideHref('https://example.com/explore/japan')).toBe(false)
  })
})
