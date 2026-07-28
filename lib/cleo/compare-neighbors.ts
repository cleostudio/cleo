/**
 * Lightweight peer picker for “Ask Cleo to compare …” links.
 * Prefers the next subject in the same Explore subregion / Space category.
 */

import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

function peerName(
  names: readonly string[],
  current: string,
): string | undefined {
  if (names.length < 2) return undefined
  const index = names.indexOf(current)
  if (index === -1) return undefined
  return names[index + 1] ?? names[index - 1]
}

/** Another country in the same subregion, when one exists. */
export function exploreComparePeer(slug: string): string | undefined {
  const country = countries.find((entry) => entry.slug === slug)
  if (!country) return undefined

  const peers = countries
    .filter((entry) => entry.subregion === country.subregion)
    .map((entry) => entry.name)

  return peerName(peers, country.name)
}

/** Another Space subject in the same category, when one exists. */
export function spaceComparePeer(slug: string): string | undefined {
  const subject = spaceSubjects.find((entry) => entry.slug === slug)
  if (!subject) return undefined

  const peers = spaceSubjects
    .filter((entry) => entry.category === subject.category)
    .map((entry) => entry.name)

  return peerName(peers, subject.name)
}
