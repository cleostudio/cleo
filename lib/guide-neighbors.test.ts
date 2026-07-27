import { describe, expect, it } from 'vitest'

import { guideNeighbors } from './guide-neighbors'

describe('guideNeighbors', () => {
  const items = [
    { slug: 'a', name: 'A' },
    { slug: 'b', name: 'B' },
    { slug: 'c', name: 'C' },
  ]

  it('returns previous and next siblings', () => {
    expect(guideNeighbors(items, 'b')).toEqual({
      previous: items[0],
      next: items[2],
    })
  })

  it('omits neighbors at the ends of the list', () => {
    expect(guideNeighbors(items, 'a')).toEqual({
      previous: undefined,
      next: items[1],
    })
    expect(guideNeighbors(items, 'c')).toEqual({
      previous: items[1],
      next: undefined,
    })
  })

  it('returns empty neighbors for unknown slugs', () => {
    expect(guideNeighbors(items, 'missing')).toEqual({
      previous: undefined,
      next: undefined,
    })
  })
})
