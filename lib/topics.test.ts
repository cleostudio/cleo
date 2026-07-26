import { describe, expect, it } from 'vitest'

import { biomeSubjects } from './biomes'
import { countries } from './countries'
import { elementSubjects } from './elements'
import { oceanSubjects } from './oceans'
import { spaceSubjects } from './space'
import { allTopics } from './topics'

describe('topics catalog', () => {
  it('lists countries, space, oceans, biomes, and elements as knowledge collections', () => {
    const topics = allTopics()

    expect(topics.map((topic) => topic.slug)).toEqual([
      'countries',
      'space',
      'oceans',
      'biomes',
      'elements',
    ])
    expect(topics[0]).toMatchObject({
      href: '/explore',
      secondaryHref: '/gallery',
      tally: `${countries.length} guides`,
    })
    expect(topics[1]).toMatchObject({
      href: '/space',
      secondaryHref: '/sky',
      secondaryLabel: 'Sky atlas',
      tally: `${spaceSubjects.length} guides`,
    })
    expect(topics[2]).toMatchObject({
      href: '/oceans',
      secondaryHref: '/gallery',
      tally: `${oceanSubjects.length} guides`,
    })
    expect(topics[3]).toMatchObject({
      href: '/biomes',
      secondaryHref: '/gallery',
      tally: `${biomeSubjects.length} guides`,
    })
    expect(topics[4]).toMatchObject({
      href: '/elements',
      secondaryHref: '/gallery',
      tally: `${elementSubjects.length} guides`,
    })
  })
})


