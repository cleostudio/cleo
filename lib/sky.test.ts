import { describe, expect, it } from 'vitest'

import { getSpaceSubject } from './space'
import { skyHotspotHref, skyHotspots } from './sky'

describe('sky atlas hotspots', () => {
  it('points six curated targets at real Space guides', () => {
    expect(skyHotspots).toHaveLength(6)

    const ids = skyHotspots.map((hotspot) => hotspot.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const hotspot of skyHotspots) {
      expect(getSpaceSubject(hotspot.spaceSlug), hotspot.spaceSlug).toBeTruthy()
      expect(skyHotspotHref(hotspot)).toBe(`/space/${hotspot.spaceSlug}`)
      expect(hotspot.x).toBeGreaterThan(0)
      expect(hotspot.x).toBeLessThan(100)
      expect(hotspot.y).toBeGreaterThan(0)
      expect(hotspot.y).toBeLessThan(100)
    }
  })
})
