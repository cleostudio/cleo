import { describe, expect, it } from 'vitest'

import {
  CLEO_PORTAL_STARTERS,
  extractPortalGuideLinks,
  groupCleoPortalStarters,
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
  it('allows only curated atlas, space, civilizations, cities, oceans, and rivers JPEG paths', () => {
    expect(isCuratedTopicImageSrc('/images/atlas/japan/w1280.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('/images/atlas/japan/w1280-2.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('/images/space/mars/w2048-3.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('/images/space/mars/w640.jpg')).toBe(true)
    expect(
      isCuratedTopicImageSrc('/images/civilizations/ancient-egypt/w1280.jpg'),
    ).toBe(true)
    expect(isCuratedTopicImageSrc('/images/cities/istanbul/w1280.jpg')).toBe(
      true,
    )
    expect(
      isCuratedTopicImageSrc('/images/oceans/pacific-ocean/w1280.jpg'),
    ).toBe(true)
    expect(isCuratedTopicImageSrc('/images/rivers/nile/w1280.jpg')).toBe(true)
    expect(isCuratedTopicImageSrc('https://evil.example/x.jpg')).toBe(false)
    expect(isCuratedTopicImageSrc('/images/other/x.jpg')).toBe(false)

    expect(
      presentTopicPhotoMarkdown(
        'Safe ![Mount Fuji](/images/atlas/japan/w1280.jpg), ![Kyoto](/images/atlas/japan/w1280-2.jpg), and bad ![x](https://evil.example/x.jpg).',
      ),
    ).toBe(
      'Safe ![Mount Fuji](/images/atlas/japan/w1280.jpg), ![Kyoto](/images/atlas/japan/w1280-2.jpg), and bad x.',
    )
  })
})

describe('CLEO_PORTAL_STARTERS', () => {
  it('ships a small set of portal-oriented prompts', () => {
    expect(CLEO_PORTAL_STARTERS.length).toBeGreaterThanOrEqual(3)
    expect(CLEO_PORTAL_STARTERS.every((starter) => starter.prompt.length > 20)).toBe(
      true,
    )
    expect(CLEO_PORTAL_STARTERS).toContainEqual({
      collection: 'explore',
      label: 'Japan photos',
      prompt:
        'Show me all three curated photos of Japan and deep-link its Explore page.',
    })
    expect(CLEO_PORTAL_STARTERS).toContainEqual({
      collection: 'cities',
      label: 'Istanbul',
      prompt:
        'Tell me about Istanbul. Deep-link its Cities page when you mention the city.',
    })
    expect(CLEO_PORTAL_STARTERS).toContainEqual({
      collection: 'oceans',
      label: 'Pacific Ocean',
      prompt:
        'Tell me about the Pacific Ocean. Deep-link its Oceans page when you mention it.',
    })
    expect(CLEO_PORTAL_STARTERS).toContainEqual({
      collection: 'rivers',
      label: 'the Nile',
      prompt:
        'Tell me about the Nile. Deep-link its Rivers page when you mention the river.',
    })
  })

  it('groups starters under portal collection labels', () => {
    const groups = groupCleoPortalStarters()
    expect(groups.map((group) => group.collection)).toEqual([
      'explore',
      'space',
      'civilizations',
      'cities',
      'oceans',
      'rivers',
    ])
    expect(groups[0]).toMatchObject({
      collection: 'explore',
      label: 'Explore',
    })
    expect(groups[0]?.starters.map((starter) => starter.label)).toEqual([
      'Japan',
      'Japan photos',
    ])
    expect(groups.every((group) => group.starters.length >= 1)).toBe(true)
  })
})
