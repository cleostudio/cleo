import { describe, expect, it } from 'vitest'

import { getAllPosts } from './content'
import {
  ESSAY_RELATED_TOPICS,
  essayFieldGuideLinks,
  essayRelatedTopics,
} from './essay-topics'

describe('essayRelatedTopics', () => {
  it('covers every published Writing essay with at least one guide', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)

    for (const post of posts) {
      const topics = essayRelatedTopics(post.slug)
      expect(topics.length, post.slug).toBeGreaterThan(0)
      expect(ESSAY_RELATED_TOPICS[post.slug]).toBeTruthy()
    }
  })

  it('resolves field-guide links against the live catalog', () => {
    const links = essayFieldGuideLinks('the-long-night-of-enceladus')
    expect(links).toEqual([
      {
        collection: 'space',
        slug: 'enceladus',
        name: 'Enceladus',
        href: '/space/enceladus',
        kind: 'Space',
      },
    ])

    const sahara = essayFieldGuideLinks('when-the-sahara-was-green')
    expect(sahara.map((link) => link.href)).toEqual([
      '/explore/algeria',
      '/explore/egypt',
    ])
  })

  it('returns an empty list for unknown essays', () => {
    expect(essayRelatedTopics('not-a-real-essay')).toEqual([])
    expect(essayFieldGuideLinks('not-a-real-essay')).toEqual([])
  })
})
