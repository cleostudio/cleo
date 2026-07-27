/**
 * Curated knowledge trails: short guided routes through Explore and Space
 * field guides. Progress is browser-only (sessionStorage); the site never
 * persists trail state server-side.
 */

export type TrailCollection = 'places' | 'space' | 'themes'

export type TrailStop = {
  /** Same-site guide path. */
  href: string
  label: string
  /** One-line cue for why this stop sits on the trail. */
  note: string
}

export type Trail = {
  slug: string
  name: string
  summary: string
  collection: TrailCollection
  stops: TrailStop[]
}

export const TRAIL_COLLECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'places', label: 'Places' },
  { id: 'space', label: 'Space' },
  { id: 'themes', label: 'Themes' },
] as const

export type TrailCollectionFilter = (typeof TRAIL_COLLECTIONS)[number]['id']

const GUIDE_HREF = /^\/(explore|space)\/[a-z0-9-]+$/

export const trails: Trail[] = [
  {
    slug: 'pacific-ring',
    name: 'Pacific Ring',
    summary:
      'Volcanic arcs and ocean edges around the Pacific — islands, trenches, and living coasts.',
    collection: 'places',
    stops: [
      {
        href: '/explore/japan',
        label: 'Japan',
        note: 'Island arc where Pacific plates meet old forest and dense cities.',
      },
      {
        href: '/explore/indonesia',
        label: 'Indonesia',
        note: 'The world\'s largest archipelago along the Ring of Fire.',
      },
      {
        href: '/explore/chile',
        label: 'Chile',
        note: 'A long Pacific spine between Andes peaks and cold Humboldt current.',
      },
      {
        href: '/explore/new-zealand',
        label: 'New Zealand',
        note: 'Young mountains, fjords, and geothermal country at the rim’s edge.',
      },
    ],
  },
  {
    slug: 'mediterranean-shore',
    name: 'Mediterranean Shore',
    summary:
      'Shared sea, shared histories — ports and peninsulas around the Middle Sea.',
    collection: 'places',
    stops: [
      {
        href: '/explore/greece',
        label: 'Greece',
        note: 'Archipelagos and classical cities facing a busy inland sea.',
      },
      {
        href: '/explore/italy',
        label: 'Italy',
        note: 'A long peninsula bridging Alps, Adriatic, and Tyrrhenian coasts.',
      },
      {
        href: '/explore/spain',
        label: 'Spain',
        note: 'Western gate of the Mediterranean, open also to the Atlantic.',
      },
      {
        href: '/explore/morocco',
        label: 'Morocco',
        note: 'North Africa’s Maghreb shore across the Strait of Gibraltar.',
      },
      {
        href: '/explore/egypt',
        label: 'Egypt',
        note: 'Nile delta meeting the eastern Mediterranean and Red Sea routes.',
      },
    ],
  },
  {
    slug: 'northern-light',
    name: 'Northern Light',
    summary:
      'High-latitude lands of long winters, forests, and pale summer skies.',
    collection: 'places',
    stops: [
      {
        href: '/explore/iceland',
        label: 'Iceland',
        note: 'Mid-Atlantic ridge risen into glaciers, lava, and sparse coasts.',
      },
      {
        href: '/explore/norway',
        label: 'Norway',
        note: 'Deep fjords cut into a mountainous North Atlantic edge.',
      },
      {
        href: '/explore/finland',
        label: 'Finland',
        note: 'Lakes and boreal forest between Baltic and Arctic latitudes.',
      },
      {
        href: '/explore/sweden',
        label: 'Sweden',
        note: 'A long Scandinavian spine from farmland south to Lapland north.',
      },
      {
        href: '/explore/canada',
        label: 'Canada',
        note: 'Continental north with taiga, tundra, and Pacific-to-Atlantic breadth.',
      },
    ],
  },
  {
    slug: 'ancient-crossroads',
    name: 'Ancient Crossroads',
    summary:
      'Early civilizational hearths where rivers, deserts, and trade routes met.',
    collection: 'places',
    stops: [
      {
        href: '/explore/egypt',
        label: 'Egypt',
        note: 'Nile corridor that concentrated farming and monumental cities.',
      },
      {
        href: '/explore/greece',
        label: 'Greece',
        note: 'Aegean networks that spread language, trade, and city-states.',
      },
      {
        href: '/explore/india',
        label: 'India',
        note: 'Subcontinent of river plains, plateaus, and long cultural continuity.',
      },
      {
        href: '/explore/china',
        label: 'China',
        note: 'East Asian heartland of river civilizations and imperial scale.',
      },
      {
        href: '/explore/peru',
        label: 'Peru',
        note: 'Andean highlands and Pacific desert where Inca roads ran.',
      },
    ],
  },
  {
    slug: 'inner-planets',
    name: 'Inner Planets',
    summary:
      'Rocky neighbors of the Sun — from scorched Mercury out to dusty Mars.',
    collection: 'space',
    stops: [
      {
        href: '/space/mercury',
        label: 'Mercury',
        note: 'Smallest planet, extremes of day heat and night cold.',
      },
      {
        href: '/space/venus',
        label: 'Venus',
        note: 'Thick CO₂ greenhouse and a slow retrograde spin.',
      },
      {
        href: '/space/earth',
        label: 'Earth',
        note: 'The reference ocean world with plate tectonics and life.',
      },
      {
        href: '/space/moon',
        label: 'Moon',
        note: 'Earth’s companion — maria, highlands, and a battered far side.',
      },
      {
        href: '/space/mars',
        label: 'Mars',
        note: 'Cold desert planet with giant volcanoes and polar ice.',
      },
    ],
  },
  {
    slug: 'nebulae-tour',
    name: 'Nebulae Tour',
    summary:
      'Clouds where stars are born or die — nearby deep-sky landmarks.',
    collection: 'space',
    stops: [
      {
        href: '/space/orion-nebula',
        label: 'Orion Nebula',
        note: 'A bright stellar nursery in Orion’s sword.',
      },
      {
        href: '/space/carina-nebula',
        label: 'Carina Nebula',
        note: 'A vast southern star-forming complex with massive stars.',
      },
      {
        href: '/space/crab-nebula',
        label: 'Crab Nebula',
        note: 'Supernova remnant still expanding from 1054 CE.',
      },
      {
        href: '/space/milky-way',
        label: 'Milky Way',
        note: 'Home galaxy — the band that holds these nebulae.',
      },
    ],
  },
  {
    slug: 'ocean-worlds',
    name: 'Ocean Worlds',
    summary:
      'Liquid water known and suspected — Earth plus icy moons with hidden seas.',
    collection: 'themes',
    stops: [
      {
        href: '/space/earth',
        label: 'Earth',
        note: 'Surface oceans under an open sky — the only confirmed case so far.',
      },
      {
        href: '/space/europa',
        label: 'Europa',
        note: 'Jupiter’s icy moon with a global subsurface ocean.',
      },
      {
        href: '/space/enceladus',
        label: 'Enceladus',
        note: 'Saturn moon spraying south-polar plumes from a salty sea.',
      },
      {
        href: '/space/titan',
        label: 'Titan',
        note: 'Thick atmosphere, methane lakes, and a possible deep ocean.',
      },
    ],
  },
  {
    slug: 'giant-systems',
    name: 'Giant Systems',
    summary:
      'Gas giants and their courts — scale, storms, and major moons.',
    collection: 'themes',
    stops: [
      {
        href: '/space/jupiter',
        label: 'Jupiter',
        note: 'Largest planet — Great Red Spot and a fierce magnetosphere.',
      },
      {
        href: '/space/io',
        label: 'Io',
        note: 'Most volcanic world known, tidally kneaded by Jupiter.',
      },
      {
        href: '/space/europa',
        label: 'Europa',
        note: 'Smooth ice shell over a moon-wide ocean.',
      },
      {
        href: '/space/saturn',
        label: 'Saturn',
        note: 'Ringed giant with a deep hydrogen envelope.',
      },
      {
        href: '/space/titan',
        label: 'Titan',
        note: 'Saturn’s largest moon — atmosphere denser than Earth’s.',
      },
    ],
  },
]

export function allTrails(): Trail[] {
  return trails
}

export function getTrail(slug: string): Trail | undefined {
  return trails.find((trail) => trail.slug === slug)
}

export function isTrailSlug(slug: string): boolean {
  return trails.some((trail) => trail.slug === slug)
}

export function trailsForCollection(filter: TrailCollectionFilter): Trail[] {
  if (filter === 'all') return trails
  return trails.filter((trail) => trail.collection === filter)
}

/** True when every stop points at a same-site Explore/Space guide. */
export function isTrailStopHref(href: string): boolean {
  return GUIDE_HREF.test(href)
}

export const TRAIL_PROGRESS_STORAGE_KEY = 'cleo:trail-progress:v1'

export type TrailProgressMap = Record<string, string[]>

export function parseTrailProgress(raw: string | null): TrailProgressMap {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }
    const result: TrailProgressMap = {}
    for (const [slug, value] of Object.entries(parsed)) {
      if (!isTrailSlug(slug) || !Array.isArray(value)) continue
      const hrefs = value.filter(
        (item): item is string =>
          typeof item === 'string' && isTrailStopHref(item),
      )
      if (hrefs.length > 0) result[slug] = [...new Set(hrefs)]
    }
    return result
  } catch {
    return {}
  }
}

export function serializeTrailProgress(map: TrailProgressMap): string {
  return JSON.stringify(map)
}
