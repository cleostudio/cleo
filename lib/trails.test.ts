import { describe, expect, it } from 'vitest'

import { isCountrySlug } from '~/lib/countries'
import { getSpaceSubject } from '~/lib/space'
import {
  allTrails,
  getTrail,
  isTrailSlug,
  isTrailStopHref,
  parseTrailProgress,
  serializeTrailProgress,
  trailsForCollection,
} from '~/lib/trails'

describe('trails catalog', () => {
  it('ships curated trails with unique slugs and real guide stops', () => {
    const trails = allTrails()
    expect(trails.length).toBeGreaterThanOrEqual(6)

    const slugs = new Set<string>()
    for (const trail of trails) {
      expect(trail.slug).toMatch(/^[a-z0-9-]+$/)
      expect(slugs.has(trail.slug)).toBe(false)
      slugs.add(trail.slug)

      expect(trail.name.length).toBeGreaterThan(0)
      expect(trail.summary.length).toBeGreaterThan(0)
      expect(trail.stops.length).toBeGreaterThanOrEqual(3)

      for (const stop of trail.stops) {
        expect(isTrailStopHref(stop.href)).toBe(true)
        expect(stop.label.length).toBeGreaterThan(0)
        expect(stop.note.length).toBeGreaterThan(0)

        if (stop.href.startsWith('/explore/')) {
          expect(isCountrySlug(stop.href.slice('/explore/'.length))).toBe(true)
        } else {
          expect(getSpaceSubject(stop.href.slice('/space/'.length))).toBeTruthy()
        }
      }
    }
  })

  it('filters by collection and resolves known slugs', () => {
    expect(trailsForCollection('places').every((t) => t.collection === 'places')).toBe(
      true,
    )
    expect(trailsForCollection('space').every((t) => t.collection === 'space')).toBe(
      true,
    )
    expect(trailsForCollection('themes').every((t) => t.collection === 'themes')).toBe(
      true,
    )
    expect(trailsForCollection('all')).toHaveLength(allTrails().length)

    expect(isTrailSlug('pacific-ring')).toBe(true)
    expect(isTrailSlug('not-a-trail')).toBe(false)
    expect(getTrail('ocean-worlds')?.name).toBe('Ocean Worlds')
  })

  it('round-trips browser progress and drops invalid entries', () => {
    const raw = serializeTrailProgress({
      'pacific-ring': ['/explore/japan', '/explore/chile'],
      'not-a-trail': ['/explore/japan'],
      'ocean-worlds': ['https://evil.example', '/space/europa'],
    })

    expect(parseTrailProgress(raw)).toEqual({
      'pacific-ring': ['/explore/japan', '/explore/chile'],
      'ocean-worlds': ['/space/europa'],
    })
    expect(parseTrailProgress('not-json')).toEqual({})
    expect(parseTrailProgress(null)).toEqual({})
  })
})
