import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries, world, and space as the first knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual([
      'countries',
      'world',
      'space',
    ])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/world',
      tally: `${countries.length} guides`,
    })
    expect(topics[1]).toMatchObject({
      href: '/world',
      secondaryHref: '/explore',
      tally: '1 globe',
    })
    expect(topics[2]).toMatchObject({
      href: '/space',
      secondaryHref: '/gallery',
      tally: `${spaceSubjects.length} guides`,
    })
  })
})
