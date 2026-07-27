import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists Countries, Maps, and Space with their primary surfaces', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual(['countries', 'maps', 'space'])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/gallery',
      tally: `${countries.length} guides`,
    })
    expect(topics[1]).toMatchObject({
      href: '/maps',
      secondaryHref: '/gallery',
      secondaryLabel: 'Gallery',
      tally: 'Earth',
    })
    expect(topics[2]).toMatchObject({
      href: '/space',
      secondaryHref: '/gallery',
      tally: `${spaceSubjects.length} guides`,
    })
  })
})
