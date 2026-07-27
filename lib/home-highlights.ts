import { highlightedAtlasEntries } from '~/lib/atlas'
import { getSpaceSubject } from '~/lib/space'
import type { StaticPhoto } from '~/lib/static-photo'

export type HomeHighlight = {
  id: string
  href: string
  title: string
  subtitle: string
  photo: Pick<StaticPhoto, 'alt' | 'width' | 'height' | 'renditions'>
}

const SPACE_HIGHLIGHT_SLUGS = ['mars', 'saturn'] as const

/** Homepage highlight strip — places first, then a couple of Space bodies. */
export function homeHighlights(limit = 6): HomeHighlight[] {
  const spaceSlots = Math.min(SPACE_HIGHLIGHT_SLUGS.length, Math.max(0, limit - 1))
  const placeSlots = Math.max(0, limit - spaceSlots)

  const places: HomeHighlight[] = highlightedAtlasEntries(placeSlots).map(
    (entry) => ({
      id: `places:${entry.slug}`,
      href: `/explore/${entry.slug}`,
      title: entry.photo.placeName,
      subtitle: entry.name,
      photo: entry.photo,
    }),
  )

  const space: HomeHighlight[] = []
  for (const slug of SPACE_HIGHLIGHT_SLUGS) {
    if (space.length >= spaceSlots) break
    const subject = getSpaceSubject(slug)
    if (!subject) continue
    space.push({
      id: `space:${subject.slug}`,
      href: `/space/${subject.slug}`,
      title: subject.photo.featureName,
      subtitle: subject.name,
      photo: subject.photo,
    })
  }

  return [...places, ...space].slice(0, limit)
}
