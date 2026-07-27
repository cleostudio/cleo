import { describe, expect, it } from 'vitest'

import { homeHighlights } from './home-highlights'

describe('homeHighlights', () => {
  it('mixes Explore places with Space bodies', () => {
    const highlights = homeHighlights(6)

    expect(highlights).toHaveLength(6)
    expect(highlights.some((item) => item.href.startsWith('/explore/'))).toBe(
      true,
    )
    expect(highlights.some((item) => item.href === '/space/mars')).toBe(true)
    expect(highlights.some((item) => item.href === '/space/saturn')).toBe(true)
    expect(
      highlights.every(
        (item) => item.title && item.subtitle && item.photo.renditions.length > 0,
      ),
    ).toBe(true)
  })
})
