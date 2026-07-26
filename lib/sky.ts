/**
 * Sky atlas hotspots — deep links into existing Space field guides.
 * v1 is a static plate with curated targets, not a full constellation catalog.
 */

export interface SkyHotspot {
  /** Stable id for the hotspot control. */
  id: string
  /** Label shown on the plate. */
  label: string
  /** Matching Space guide slug. */
  spaceSlug: string
  /** Short evergreen note under the label. */
  blurb: string
  /** Position on the 100×100 chart viewBox (percent-like units). */
  x: number
  y: number
}

/** Six deep-sky / nearby targets that already have Space guides. */
export const skyHotspots: SkyHotspot[] = [
  {
    id: 'orion',
    label: 'Orion Nebula',
    spaceSlug: 'orion-nebula',
    blurb: 'Star-forming cloud in Orion',
    x: 38,
    y: 62,
  },
  {
    id: 'andromeda',
    label: 'Andromeda',
    spaceSlug: 'andromeda',
    blurb: 'Nearest large spiral galaxy',
    x: 72,
    y: 28,
  },
  {
    id: 'crab',
    label: 'Crab Nebula',
    spaceSlug: 'crab-nebula',
    blurb: 'Supernova remnant in Taurus',
    x: 48,
    y: 36,
  },
  {
    id: 'carina',
    label: 'Carina Nebula',
    spaceSlug: 'carina-nebula',
    blurb: 'Southern star-forming complex',
    x: 22,
    y: 78,
  },
  {
    id: 'milky-way',
    label: 'Milky Way',
    spaceSlug: 'milky-way',
    blurb: 'Our galaxy’s bright band',
    x: 55,
    y: 52,
  },
  {
    id: 'moon',
    label: 'Moon',
    spaceSlug: 'moon',
    blurb: 'Earth’s companion world',
    x: 82,
    y: 58,
  },
]

export function skyHotspotHref(hotspot: SkyHotspot): string {
  return `/space/${hotspot.spaceSlug}`
}
