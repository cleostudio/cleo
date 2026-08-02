import { describe, expect, it } from 'vitest'

import { citySubjects } from './cities'
import { civilizationSubjects } from './civilizations'
import { countries } from './countries'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries, space, civilizations, and cities as knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual([
      'countries',
      'space',
      'civilizations',
      'cities',
    ])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/gallery',
      tally: `${countries.length} guides`,
    })
    expect(topics[1]).toMatchObject({
      href: '/space',
      secondaryHref: '/gallery',
      tally: `${spaceSubjects.length} guides`,
    })
    expect(topics[2]).toMatchObject({
      href: '/civilizations',
      secondaryHref: '/gallery',
      tally: `${civilizationSubjects.length} guides`,
    })
    expect(topics[3]).toMatchObject({
      href: '/cities',
      secondaryHref: '/gallery',
      tally: `${citySubjects.length} guides`,
    })
  })
})
