import { describe, expect, it } from 'vitest'

import {
  CLEO_PORTAL_STARTERS,
  extractPortalGuideLinks,
  extractPortalMapLinks,
  isCuratedTopicImageSrc,
  presentPortalGuideMarkdown,
  presentTopicPhotoMarkdown,
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

describe('presentPortalGuideMarkdown', () => {
  it('keeps the first guide link and drops redundant footers', () => {
    const markdown = [
      'Japan is an archipelago. Start with [Japan](/explore/japan).',
      '',
      'For a fuller primer, see [Japan](/explore/japan).',
      '',
      'Explore [Japan](/explore/japan)',
    ].join('\n')

    expect(presentPortalGuideMarkdown(markdown)).toBe(
      'Japan is an archipelago. Start with [Japan](/explore/japan).',
    )
  })

  it('dedupes repeated Space links and cleans noisy labels', () => {
    const markdown = [
      'Europa hides a [global ocean](/space/europa) under ice.',
      '',
      'Space [Europa field guide](/space/europa)',
    ].join('\n')

    expect(presentPortalGuideMarkdown(markdown)).toBe(
      'Europa hides a [global ocean](/space/europa) under ice.',
    )
  })

  it('keeps one link each when comparing two guides', () => {
    const markdown =
      'Compare [Earth](/space/earth) and [Mars](/space/mars).\n\nEarth · Mars'

    expect(presentPortalGuideMarkdown(markdown)).toBe(
      'Compare [Earth](/space/earth) and [Mars](/space/mars).',
    )
  })

  it('does not drop real short paragraphs that are not guide footers', () => {
    const markdown = [
      'Europa hides a [global ocean](/space/europa) under ice.',
      '',
      'Global ocean.',
      '',
      'See temples in Kyoto when you visit.',
      '',
      'Space is hard.',
    ].join('\n')

    expect(presentPortalGuideMarkdown(markdown)).toBe(
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

    expect(presentPortalGuideMarkdown(markdown)).toBe(markdown)
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

describe('extractPortalMapLinks', () => {
  it('collects unique Maps country and region deep links', () => {
    const markdown = [
      'See [Japan on the map](/maps?country=japan&labels=0).',
      'Then [Africa](/maps?region=africa).',
      'Repeat [Japan again](/maps?country=japan) should dedupe by place focus.',
      'Ignore [bare maps](/maps) and [docs](https://example.com/maps?country=japan).',
    ].join(' ')

    expect(extractPortalMapLinks(markdown)).toEqual([
      {
        kind: 'country',
        href: '/maps?country=japan',
        label: 'Japan on the map',
        value: 'japan',
      },
      {
        kind: 'region',
        href: '/maps?region=africa',
        label: 'Africa',
        value: 'africa',
      },
    ])
  })

  it('preserves capital camera hashes on Maps deep links', () => {
    expect(
      extractPortalMapLinks(
        'Open [Tokyo](/maps?country=japan#4.6/35.68/139.69).',
      ),
    ).toEqual([
      {
        kind: 'country',
        href: '/maps?country=japan#4.6/35.68/139.69',
        label: 'Tokyo on the map',
        value: 'japan',
      },
    ])
  })
})

describe('presentPortalGuideMarkdown maps links', () => {
  it('keeps the first Maps deep link and turns later repeats into plain text', () => {
    const markdown = [
      'Start with [Japan on the map](/maps?country=japan#4.6/35.68/139.69).',
      '',
      'Also [Japan again](/maps?country=japan&graticule=1).',
    ].join('\n')

    expect(presentPortalGuideMarkdown(markdown)).toBe(
      [
        'Start with [Japan on the map](/maps?country=japan#4.6/35.68/139.69).',
        '',
        'Also Japan again on the map.',
      ].join('\n'),
    )
  })
})

describe('CLEO_PORTAL_STARTERS', () => {
  it('ships a small set of portal-oriented prompts', () => {
    expect(CLEO_PORTAL_STARTERS.length).toBeGreaterThanOrEqual(3)
    expect(CLEO_PORTAL_STARTERS.every((starter) => starter.prompt.length > 20)).toBe(
      true,
    )
    expect(
      CLEO_PORTAL_STARTERS.some((starter) =>
        /maps\?country=japan/i.test(starter.prompt),
      ),
    ).toBe(true)
    expect(
      CLEO_PORTAL_STARTERS.some((starter) =>
        /maps\?region=africa/i.test(starter.prompt),
      ),
    ).toBe(true)
    expect(
      CLEO_PORTAL_STARTERS.some(
        (starter) =>
          /\/space\/earth/i.test(starter.prompt) &&
          /\/maps(?!\?)/i.test(starter.prompt),
      ),
    ).toBe(true)
    expect(CLEO_PORTAL_STARTERS.length).toBeLessThanOrEqual(5)
  })
})
