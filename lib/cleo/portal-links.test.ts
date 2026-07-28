import { describe, expect, it } from 'vitest'

import {
  CLEO_PORTAL_STARTERS,
  extractPortalArticleLinks,
  isCuratedTopicImageSrc,
  presentPortalArticleMarkdown,
  presentTopicPhotoMarkdown,
} from './portal-links'

describe('extractPortalArticleLinks', () => {
  it('collects unique Explore and Space Markdown links', () => {
    const markdown = [
      'Start with [Japan](/explore/japan).',
      'Then compare [Mars](/space/mars) and [Earth](/space/earth).',
      'Repeat [Japan](/explore/japan) should dedupe.',
      'Ignore [docs](https://example.com/explore/japan) and `/explore/raw`.',
    ].join(' ')

    expect(extractPortalArticleLinks(markdown)).toEqual([
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
    expect(extractPortalArticleLinks('See [](/space/orion-nebula).')).toEqual([
      {
        collection: 'space',
        href: '/space/orion-nebula',
        label: 'Orion Nebula',
        slug: 'orion-nebula',
      },
    ])
  })

  it('strips noisy article labels down to the subject name', () => {
    expect(
      extractPortalArticleLinks(
        'Read the full [Europa Space article](/space/europa) and the [Explore Japan article](/explore/japan).',
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

describe('presentPortalArticleMarkdown', () => {
  it('keeps the first article link and drops redundant footers', () => {
    const markdown = [
      'Japan is an archipelago. Start with [Japan](/explore/japan).',
      '',
      'For more, see [Japan](/explore/japan).',
      '',
      'Explore [Japan](/explore/japan)',
    ].join('\n')

    expect(presentPortalArticleMarkdown(markdown)).toBe(
      'Japan is an archipelago. Start with [Japan](/explore/japan).',
    )
  })

  it('dedupes repeated Space links and cleans noisy labels', () => {
    const markdown = [
      'Europa hides a [global ocean](/space/europa) under ice.',
      '',
      'Space [Europa article](/space/europa)',
    ].join('\n')

    expect(presentPortalArticleMarkdown(markdown)).toBe(
      'Europa hides a [global ocean](/space/europa) under ice.',
    )
  })

  it('keeps one link each when comparing two articles', () => {
    const markdown =
      'Compare [Earth](/space/earth) and [Mars](/space/mars).\n\nEarth · Mars'

    expect(presentPortalArticleMarkdown(markdown)).toBe(
      'Compare [Earth](/space/earth) and [Mars](/space/mars).',
    )
  })

  it('does not drop real short paragraphs that are not article footers', () => {
    const markdown = [
      'Europa hides a [global ocean](/space/europa) under ice.',
      '',
      'Global ocean.',
      '',
      'See temples in Kyoto when you visit.',
      '',
      'Space is hard.',
    ].join('\n')

    expect(presentPortalArticleMarkdown(markdown)).toBe(
      [
        'Europa hides a [global ocean](/space/europa) under ice.',
        '',
        'Global ocean.',
        '',
        'See temples in Kyoto when you visit.',
        '',
        'Space is hard.',
      ].join('\n'),
    )
  })

  it('keeps curated topic photographs in Markdown replies', () => {
    const markdown = [
      'Here is [Japan](/explore/japan).',
      '',
      '![Mount Fuji](/images/atlas/japan/w1280.jpg)',
    ].join('\n')

    expect(presentPortalArticleMarkdown(markdown)).toBe(markdown)
  })
})

describe('presentTopicPhotoMarkdown', () => {
  it('allows only curated atlas and space JPEG paths', () => {
    expect(isCuratedTopicImageSrc('/images/atlas/japan/w1280.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('/images/space/mars/w640.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('https://evil.example/x.jpg')).toBe(false)
    expect(isCuratedTopicImageSrc('/images/other/x.jpg')).toBe(false)

    expect(
      presentTopicPhotoMarkdown(
        'Safe ![Mount Fuji](/images/atlas/japan/w1280.jpg) and bad ![x](https://evil.example/x.jpg).',
      ),
    ).toBe('Safe ![Mount Fuji](/images/atlas/japan/w1280.jpg) and bad x.')
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
