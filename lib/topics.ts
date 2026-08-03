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
        'Every nation on the map — landforms, capitals, places that define a country, and one photograph to open the door.',
      tally: `${countryCount} countries`,
      href: '/explore',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'space',
      name: 'Space',
      description:
        'Planets, moons, and deep-sky neighbors — structure, motion, and the view from close range or across light-years.',
      tally: `${spaceCount} subjects`,
      href: '/space',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'civilizations',
      name: 'Civilizations',
      description:
        'Cultures that shaped regions across millennia — signature sites, durable facts, and photographs of what remains.',
      tally: `${civilizationCount} subjects`,
      href: '/civilizations',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'cities',
      name: 'Cities',
      description:
        'Capitals and corridor cities where routes meet — harbors, plazas, walls, and the layers a metropolis keeps.',
      tally: `${cityCount} cities`,
      href: '/cities',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'oceans',
      name: 'Oceans',
      description:
        'World basins, major seas, and polar waters — currents, trenches, climate roles, and the open blue between shores.',
      tally: `${oceanCount} basins`,
      href: '/oceans',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
    {
      slug: 'rivers',
      name: 'Rivers',
      description:
        'Major courses that cut continents — sources, floodplains, cataracts, and the paths water draws through land.',
      tally: `${riverCount} rivers`,
      href: '/rivers',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
    },
  ]
}
