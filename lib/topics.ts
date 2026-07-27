import { countries } from '~/lib/countries'
import { spaceSubjects } from '~/lib/space'

/** Knowledge collections shown on /topics. Expand this list as new topics ship. */
export interface Topic {
  slug: string
  name: string
  description: string
  /** Short count / scale label shown beside the name. */
  tally: string
  /** Primary destination for the collection. */
  href: string
  /** Optional secondary surface (e.g. place gallery). */
  secondaryHref?: string
  secondaryLabel?: string
}

export function allTopics(): Topic[] {
  const countryCount = countries.length
  const spaceCount = spaceSubjects.length
  return [
    {
      slug: 'countries',
      name: 'Countries',
      description:
        'Evergreen field guides for every country — orientation, notable places, facts, sources, and one curated photograph.',
      tally: `${countryCount} guides`,
      href: '/explore',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'maps',
      name: 'Maps',
      description:
        'An interactive 2D map of Earth with NASA Blue Marble imagery and Natural Earth borders — pan, zoom, and open Explore guides.',
      tally: 'Earth',
      href: '/maps',
      secondaryHref: '/explore',
      secondaryLabel: 'Explore',
    },
    {
      slug: 'space',
      name: 'Space',
      description:
        'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, facts, a photograph, and sources.',
      tally: `${spaceCount} guides`,
      href: '/space',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
