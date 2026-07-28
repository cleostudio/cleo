import { describe, expect, it } from 'vitest'

import { ESSAY_TOPIC_GROUNDING } from '~/lib/cleo/essay-topics'
import { getCountry } from '~/lib/countries'
import { publishedPostSlugs } from '~/lib/public-content-routes'
import { getSpaceSubject } from '~/lib/space'

describe('essay topic grounding', () => {
  it('covers every published Writing essay', () => {
    expect(Object.keys(ESSAY_TOPIC_GROUNDING).sort()).toEqual(
      [...publishedPostSlugs].sort(),
    )
  })

  it('points only at real Explore/Space catalog subjects', () => {
    for (const [slug, entry] of Object.entries(ESSAY_TOPIC_GROUNDING)) {
      expect(entry.title.trim().length).toBeGreaterThan(0)
      expect(entry.topics.length).toBeGreaterThan(0)
      for (const topic of entry.topics) {
        if (topic.collection === 'explore') {
          expect(
            getCountry(topic.slug),
            `${slug} → explore/${topic.slug}`,
          ).toBeTruthy()
        } else {
          expect(
            getSpaceSubject(topic.slug),
            `${slug} → space/${topic.slug}`,
          ).toBeTruthy()
        }
      }
    }
  })
})
