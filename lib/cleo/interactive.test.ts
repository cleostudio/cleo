import { describe, expect, it } from 'vitest'

import {
  isCleoWidgetHref,
  normalizeCuratedWidgetImage,
  parseCleoInteractiveBlock,
  segmentCleoMarkdown,
} from './interactive'

describe('parseCleoInteractiveBlock', () => {
  it('parses gallery widgets and normalizes image renditions', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'gallery',
          title: 'Europa in view',
          items: [
            {
              src: '/images/space/europa/w640.jpg',
              caption: 'Icy shell',
              href: '/space/europa',
            },
          ],
        }),
      ),
    ).toEqual({
      type: 'gallery',
      title: 'Europa in view',
      items: [
        {
          src: '/images/space/europa/w1280.jpg',
          caption: 'Icy shell',
          href: '/space/europa',
        },
      ],
    })
  })

  it('parses cards with curated images', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'cards',
          cards: [
            {
              label: 'Io',
              summary: 'Volcanic',
              image: '/images/space/io/w2048.jpg',
              href: '/space/io',
            },
            { label: 'Ganymede', summary: 'Largest moon' },
          ],
        }),
      ),
    ).toMatchObject({
      type: 'cards',
      cards: [{ image: '/images/space/io/w1280.jpg' }, { label: 'Ganymede' }],
    })
  })

  it('parses path widgets and compare hrefs', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'path',
          title: 'Read Japan',
          stops: [
            {
              title: 'Landscape',
              body: 'Start with islands and mountains.',
              href: '/explore/japan',
            },
            { title: 'Cities', body: 'Then dense urban continuity.' },
          ],
        }),
      ),
    ).toEqual({
      type: 'path',
      title: 'Read Japan',
      stops: [
        {
          title: 'Landscape',
          body: 'Start with islands and mountains.',
          href: '/explore/japan',
        },
        { title: 'Cities', body: 'Then dense urban continuity.' },
      ],
    })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'compare',
          columns: ['Mars', 'Earth'],
          hrefs: ['/space/mars', '/space/earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }),
      ),
    ).toMatchObject({
      type: 'compare',
      hrefs: ['/space/mars', '/space/earth'],
    })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'compare',
          columns: ['Mars', 'Earth'],
          hrefs: ['https://evil.example', '/space/earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }),
      ),
    ).toBeNull()
  })

  it('rejects unsafe gallery images and removed quiz type', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'gallery',
          items: [
            {
              src: 'https://evil.example/x.jpg',
              caption: 'Nope',
            },
          ],
        }),
      ),
    ).toBeNull()

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'quiz',
          question: 'Which moon?',
          options: [
            { id: 'a', label: 'Io' },
            { id: 'b', label: 'Europa' },
          ],
          answer: 'b',
        }),
      ),
    ).toBeNull()
  })
})

describe('segmentCleoMarkdown', () => {
  it('interleaves prose with generative widgets', () => {
    const markdown = [
      'Japan is an archipelago.',
      '',
      '```cleo',
      JSON.stringify({
        type: 'gallery',
        items: [
          {
            src: '/images/atlas/japan/w1280.jpg',
            caption: 'Mount Fuji',
          },
        ],
      }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Japan is an archipelago.\n\n' },
      {
        type: 'interactive',
        block: {
          type: 'gallery',
          items: [
            {
              src: '/images/atlas/japan/w1280.jpg',
              caption: 'Mount Fuji',
            },
          ],
        },
      },
    ])
  })
})

describe('helpers', () => {
  it('normalizes curated widget images and validates hrefs', () => {
    expect(normalizeCuratedWidgetImage('/images/space/mars/w640.jpg')).toBe(
      '/images/space/mars/w1280.jpg',
    )
    expect(isCleoWidgetHref('/explore/japan')).toBe(true)
    expect(isCleoWidgetHref('/cleo')).toBe(false)
  })
})
