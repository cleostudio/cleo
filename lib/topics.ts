import { citySubjects } from '~/lib/cities'
import { civilizationSubjects } from '~/lib/civilizations'
import { countries } from '~/lib/countries'
import { oceanSubjects } from '~/lib/oceans'
import { riverSubjects } from '~/lib/rivers'
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
  const civilizationCount = civilizationSubjects.length
  const cityCount = citySubjects.length
  const oceanCount = oceanSubjects.length
  const riverCount = riverSubjects.length
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
      slug: 'space',
      name: 'Space',
      description:
        'Evergreen field guides for the Solar System, major moons, and nearby deep space — orientation, features, facts, a photograph, and sources.',
      tally: `${spaceCount} guides`,
      href: '/space',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'civilizations',
      name: 'Civilizations',
      description:
        'Evergreen field guides for historical civilizations — orientation, signature sites, facts, sources, and curated photographs.',
      tally: `${civilizationCount} guides`,
      href: '/civilizations',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'cities',
      name: 'Cities',
      description:
        'Evergreen field guides for capitals and route cities — orientation, signature sites, facts, sources, and curated photographs.',
      tally: `${cityCount} guides`,
      href: '/cities',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'oceans',
      name: 'Oceans',
      description:
        'Evergreen field guides for world ocean basins and polar seas — orientation, features, facts, sources, and curated photographs.',
      tally: `${oceanCount} guides`,
      href: '/oceans',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'rivers',
      name: 'Rivers',
      description:
        'Evergreen field guides for major rivers across Africa, Asia, and Europe & Americas — orientation, course features, facts, sources, and curated photographs.',
      tally: `${riverCount} guides`,
      href: '/rivers',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
