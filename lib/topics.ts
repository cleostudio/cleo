import { countries } from '~/lib/countries'

/** Knowledge collections shown on /topics. Expand this list as new topics ship. */
export interface Topic {
  slug: string
  name: string
  description: string
  /** Short count / scale label shown beside the name. */
  tally: string
  /** Primary destination for the collection. */
  href: string
  /** Optional secondary surface (e.g. visual atlas). */
  secondaryHref?: string
  secondaryLabel?: string
}

export function allTopics(): Topic[] {
  const countryCount = countries.length
  return [
    {
      slug: 'countries',
      name: 'Countries',
      description:
        'Evergreen field guides for every country — orientation, notable places, facts, sources, and one curated photograph.',
      tally: `${countryCount} guides`,
      href: '/explore',
      secondaryHref: '/photos',
      secondaryLabel: 'Atlas photos',
    },
  ]
}
