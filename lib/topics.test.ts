import { describe, expect, it } from 'vitest'

import { citySubjects } from './cities'
import { civilizationSubjects } from './civilizations'
import { countries } from './countries'
import { oceanSubjects } from './oceans'
import { riverSubjects } from './rivers'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries, space, civilizations, cities, oceans, and rivers as knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual([
      'countries',
      'space',
      'civilizations',
      'cities',
      'oceans',
      'rivers',
    ])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/gallery',
      tally: `${countries.length} countries`,
    })
    expect(topics[1]).toMatchObject({
      href: '/space',
      secondaryHref: '/gallery',
      tally: `${spaceSubjects.length} subjects`,
    })
    expect(topics[2]).toMatchObject({
      href: '/civilizations',
      secondaryHref: '/gallery',
      tally: `${civilizationSubjects.length} subjects`,
    })
    expect(topics[3]).toMatchObject({
      href: '/cities',
      secondaryHref: '/gallery',
      tally: `${citySubjects.length} cities`,
    })
    expect(topics[4]).toMatchObject({
      href: '/oceans',
      secondaryHref: '/gallery',
      tally: `${oceanSubjects.length} basins`,
    })
    expect(topics[5]).toMatchObject({
      href: '/rivers',
      secondaryHref: '/gallery',
      tally: `${riverSubjects.length} rivers`,
    })
  })
})
