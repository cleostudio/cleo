import { describe, expect, it } from 'vitest'

import { countries } from './countries'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries and space as the first knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual(['countries', 'space'])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/gallery',
      tally: `${countries.length} articles`,
    })
    expect(topics[1]).toMatchObject({
      href: '/space',
      secondaryHref: '/gallery',
      tally: `${spaceSubjects.length} articles`,
    })
  })
})
