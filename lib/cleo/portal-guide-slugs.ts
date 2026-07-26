/**
 * Canonical Explore/Space guide slug allowlists for client-safe Markdown
 * link verification. Kept free of Space photo manifests so the ask-form
 * bundle stays light.
 */

import { countries } from '~/lib/countries'

/**
 * Space guide slugs mirrored from `lib/space.ts`.
 * Kept in sync by `portal-guide-slugs.test.ts`.
 */
export const SPACE_GUIDE_SLUGS = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'asteroid-belt',
  'iss',
  'io',
  'europa',
  'ganymede',
  'titan',
  'enceladus',
  'milky-way',
  'andromeda',
  'orion-nebula',
  'crab-nebula',
  'carina-nebula',
] as const

const EXPLORE_SLUG_SET = new Set(countries.map((country) => country.slug))
const SPACE_SLUG_SET = new Set<string>(SPACE_GUIDE_SLUGS)

const GUIDE_PATH =
  /^\/(explore|space)\/([a-z0-9-]+)(?:[?#].*)?$/i

/** True when href is a real Explore or Space field-guide path on this site. */
export function isKnownGuideHref(href: string): boolean {
  const match = href.trim().match(GUIDE_PATH)
  if (!match) return false

  const collection = match[1]?.toLowerCase()
  const slug = match[2]?.toLowerCase()
  if (!collection || !slug) return false

  if (collection === 'explore') return EXPLORE_SLUG_SET.has(slug)
  if (collection === 'space') return SPACE_SLUG_SET.has(slug)
  return false
}

export function knownExploreGuideCount() {
  return EXPLORE_SLUG_SET.size
}

export function knownSpaceGuideCount() {
  return SPACE_SLUG_SET.size
}
