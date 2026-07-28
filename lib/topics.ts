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
        'Reference articles for every country, with concise overviews, notable places, key facts, sources, and a curated photograph.',
      tally: `${countryCount} articles`,
      href: '/explore',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'space',
      name: 'Space',
      description:
        'Reference articles on the Solar System, major moons, and nearby deep space, with overviews, key facts, photographs, and sources.',
      tally: `${spaceCount} articles`,
      href: '/space',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
