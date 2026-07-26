import { biomeSubjects } from '~/lib/biomes'
import { countries } from '~/lib/countries'
import { elementSubjects } from '~/lib/elements'
import { oceanSubjects } from '~/lib/oceans'
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
  const oceanCount = oceanSubjects.length
  const biomeCount = biomeSubjects.length
  const elementCount = elementSubjects.length
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
      secondaryHref: '/sky',
      secondaryLabel: 'Sky atlas',
    },
    {
      slug: 'oceans',
      name: 'Oceans',
      description:
        'Evergreen field guides for the World Ocean, major basins, and signature seas — orientation, features, facts, a photograph, and sources.',
      tally: `${oceanCount} guides`,
      href: '/oceans',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'biomes',
      name: 'Biomes',
      description:
        'Evergreen field guides for Earth’s major biomes — climate, range, cover, exemplars, facts, a photograph, and sources.',
      tally: `${biomeCount} guides`,
      href: '/biomes',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'elements',
      name: 'Elements',
      description:
        'Evergreen field guides for high-signal chemical elements — atomic facts, features, a specimen photograph, and sources.',
      tally: `${elementCount} guides`,
      href: '/elements',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
