import { describe, expect, it } from 'vitest'

import { civilizationSubjects } from './civilizations'
import { countries } from './countries'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries, space, and civilizations as knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual([
      'countries',
      'space',
      'civilizations',
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
  })
})
