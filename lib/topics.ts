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
        'About every country — geography, notable places, facts, sources, and one curated photograph.',
      tally: `${countryCount} countries`,
      href: '/explore',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'space',
      name: 'Space',
      description:
        'About the Solar System, major moons, and nearby deep space — overview, features, facts, a photograph, and sources.',
      tally: `${spaceCount} subjects`,
      href: '/space',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'civilizations',
      name: 'Civilizations',
      description:
        'About historical civilizations — overview, signature sites, facts, sources, and curated photographs.',
      tally: `${civilizationCount} subjects`,
      href: '/civilizations',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'cities',
      name: 'Cities',
      description:
        'About capitals and route cities — overview, signature sites, facts, sources, and curated photographs.',
      tally: `${cityCount} cities`,
      href: '/cities',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'oceans',
      name: 'Oceans',
      description:
        'About world ocean basins, major seas, and polar seas — overview, features, facts, sources, and curated photographs.',
      tally: `${oceanCount} basins`,
      href: '/oceans',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'rivers',
      name: 'Rivers',
      description:
        'About major rivers across Africa, Asia, and Europe, Americas & Oceania — overview, course features, facts, sources, and curated photographs.',
      tally: `${riverCount} rivers`,
      href: '/rivers',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
