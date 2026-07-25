import { describe, expect, it } from 'vitest'

import {
  CLEO_PORTAL_STARTERS,
  extractPortalGuideLinks,
} from './portal-links'

describe('extractPortalGuideLinks', () => {
  it('collects unique Explore and Space Markdown links', () => {
    const markdown = [
      'Start with [Japan](/explore/japan).',
      'Then compare [Mars](/space/mars) and [Earth](/space/earth).',
      'Repeat [Japan](/explore/japan) should dedupe.',
      'Ignore [docs](https://example.com/explore/japan) and `/explore/raw`.',
    ].join(' ')

    expect(extractPortalGuideLinks(markdown)).toEqual([
      {
        collection: 'explore',
        href: '/explore/japan',
        label: 'Japan',
        slug: 'japan',
      },
      {
        collection: 'space',
        href: '/space/mars',
        label: 'Mars',
        slug: 'mars',
      },
      {
        collection: 'space',
        href: '/space/earth',
        label: 'Earth',
        slug: 'earth',
      },
    ])
  })

  it('falls back to a title-cased slug when the link text is empty', () => {
    expect(extractPortalGuideLinks('See [](/space/orion-nebula).')).toEqual([
      {
        collection: 'space',
        href: '/space/orion-nebula',
        label: 'Orion Nebula',
        slug: 'orion-nebula',
      },
    ])
  })

  it('strips noisy guide labels down to the subject name', () => {
    expect(
      extractPortalGuideLinks(
        'Read the full [Europa Space guide](/space/europa) and the [Explore Japan field guide](/explore/japan).',
      ),
    ).toEqual([
      {
        collection: 'space',
        href: '/space/europa',
        label: 'Europa',
        slug: 'europa',
      },
      {
        collection: 'explore',
        href: '/explore/japan',
        label: 'Japan',
        slug: 'japan',
      },
    ])
  })
})

describe('CLEO_PORTAL_STARTERS', () => {
  it('ships a small set of portal-oriented prompts', () => {
    expect(CLEO_PORTAL_STARTERS.length).toBeGreaterThanOrEqual(3)
    expect(CLEO_PORTAL_STARTERS.every((starter) => starter.prompt.length > 20)).toBe(
      true,
    )
  })
})
