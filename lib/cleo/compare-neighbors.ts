/**
 * Peer picker for “Ask Cleo to compare …” links.
 * Prefers a curated partner when the naive next-neighbor is a poor fit,
 * otherwise the next (then previous) subject in the same Explore subregion
 * or Space category — skipping denylisted pairs.
 */

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

/**
 * Preferred compare partners by slug. Used when alphabetical “next in
 * subregion” pairs poorly (e.g. Japan → Korea, North).
 */
const EXPLORE_COMPARE_PREFERRED: Record<string, string> = {
  japan: 'korea-south',
  'korea-south': 'japan',
  'korea-north': 'korea-south',
  china: 'japan',
  mongolia: 'china',
  'united-states': 'canada',
  canada: 'united-states',
  mexico: 'united-states',
  'united-kingdom': 'ireland',
  ireland: 'united-kingdom',
  australia: 'new-zealand',
  'new-zealand': 'australia',
  brazil: 'argentina',
  argentina: 'brazil',
  chile: 'peru',
  peru: 'chile',
  colombia: 'peru',
  india: 'pakistan',
  pakistan: 'india',
  indonesia: 'malaysia',
  malaysia: 'indonesia',
  thailand: 'vietnam',
  vietnam: 'thailand',
  germany: 'france',
  france: 'germany',
  spain: 'portugal',
  portugal: 'spain',
  italy: 'switzerland',
  switzerland: 'italy',
  austria: 'switzerland',
  hungary: 'austria',
  poland: 'czechia',
  czechia: 'poland',
  greece: 'turkiye',
  turkiye: 'greece',
  netherlands: 'belgium',
  belgium: 'netherlands',
  sweden: 'norway',
  norway: 'sweden',
  finland: 'sweden',
  denmark: 'sweden',
  iceland: 'norway',
  egypt: 'morocco',
  morocco: 'egypt',
  algeria: 'morocco',
  nigeria: 'ghana',
  ghana: 'nigeria',
  kenya: 'ethiopia',
  ethiopia: 'kenya',
  ecuador: 'peru',
  russia: 'ukraine',
  ukraine: 'poland',
}

/** Never suggest these slugs as a compare peer for the given country. */
const EXPLORE_COMPARE_AVOID: Record<string, readonly string[]> = {
  japan: ['korea-north'],
  'korea-south': ['korea-north', 'mongolia'],
  china: ['korea-north'],
  russia: ['korea-north'],
}

const SPACE_COMPARE_PREFERRED: Record<string, string> = {
  mars: 'earth',
  earth: 'mars',
  venus: 'earth',
  mercury: 'venus',
  jupiter: 'saturn',
  saturn: 'jupiter',
  uranus: 'neptune',
  neptune: 'uranus',
  moon: 'earth',
  sun: 'earth',
  iss: 'earth',
  pluto: 'neptune',
  'asteroid-belt': 'mars',
  europa: 'ganymede',
  ganymede: 'europa',
  titan: 'europa',
  io: 'europa',
  enceladus: 'titan',
  'milky-way': 'andromeda',
  andromeda: 'milky-way',
  'orion-nebula': 'carina-nebula',
  'carina-nebula': 'orion-nebula',
  'crab-nebula': 'orion-nebula',
}

/** Never suggest these slugs as a compare peer for the given Space subject. */
const SPACE_COMPARE_AVOID: Record<string, readonly string[]> = {
  iss: ['asteroid-belt', 'pluto', 'sun'],
  sun: ['asteroid-belt', 'iss'],
  earth: ['asteroid-belt', 'iss'],
  'asteroid-belt': ['iss', 'sun'],
}

function nameForExploreSlug(slug: string): string | undefined {
  return countries.find((entry) => entry.slug === slug)?.name
}

function nameForSpaceSlug(slug: string): string | undefined {
  return spaceSubjects.find((entry) => entry.slug === slug)?.name
}

function peerFromList(
  peers: readonly { slug: string; name: string }[],
  currentSlug: string,
  avoid: ReadonlySet<string>,
): string | undefined {
  const index = peers.findIndex((entry) => entry.slug === currentSlug)
  if (index === -1 || peers.length < 2) return undefined

  const candidates = [
    ...peers.slice(index + 1),
    ...peers.slice(0, index).reverse(),
  ]

  for (const candidate of candidates) {
    if (avoid.has(candidate.slug)) continue
    return candidate.name
  }

  return undefined
}

/** Another country in the same subregion, when one exists. */
export function exploreComparePeer(slug: string): string | undefined {
  const country = countries.find((entry) => entry.slug === slug)
  if (!country) return undefined

  const preferredSlug = EXPLORE_COMPARE_PREFERRED[slug]
  if (preferredSlug) {
    const preferredName = nameForExploreSlug(preferredSlug)
    if (preferredName) return preferredName
  }

  const avoid = new Set(EXPLORE_COMPARE_AVOID[slug] ?? [])
  const peers = countries
    .filter((entry) => entry.subregion === country.subregion)
    .map((entry) => ({ slug: entry.slug, name: entry.name }))

  return peerFromList(peers, slug, avoid)
}

/** Another Space subject in the same category, when one exists. */
export function spaceComparePeer(slug: string): string | undefined {
  const subject = spaceSubjects.find((entry) => entry.slug === slug)
  if (!subject) return undefined

  const preferredSlug = SPACE_COMPARE_PREFERRED[slug]
  if (preferredSlug) {
    const preferredName = nameForSpaceSlug(preferredSlug)
    if (preferredName) return preferredName
  }

  const avoid = new Set(SPACE_COMPARE_AVOID[slug] ?? [])
  const peers = spaceSubjects
    .filter((entry) => entry.category === subject.category)
    .map((entry) => ({ slug: entry.slug, name: entry.name }))

  return peerFromList(peers, slug, avoid)
}
