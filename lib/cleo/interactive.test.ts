import { describe, expect, it } from 'vitest'

import {
  curatedWidgetThumbSrc,
  formatScaleValue,
  isCleoWidgetHref,
  normalizeCuratedWidgetImage,
  parseCleoInteractiveBlock,
  peekCleoWidgetType,
  resolveScaleMode,
  scaleBarPercent,
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

  it('parses cycle widgets that loop', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'cycle',
          title: "Japan's seasons",
          stages: [
            { label: 'Spring', body: 'Blossoms open the year.' },
            { label: 'Summer', body: 'Humid heat.' },
            { label: 'Autumn', body: 'Clear skies.' },
          ],
        }),
      ),
    ).toMatchObject({
      type: 'cycle',
      stages: [{ label: 'Spring' }, { label: 'Summer' }, { label: 'Autumn' }],
    })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'cycle',
          stages: [
            { label: 'A', body: 'One' },
            { label: 'B', body: 'Two' },
          ],
        }),
      ),
    ).toBeNull()
  })

  it('parses layers widgets outermost first', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'layers',
          title: 'Europa interior',
          layers: [
            {
              label: 'Ice shell',
              depth: '~20 km',
              body: 'Cracked icy crust.',
              href: '/space/europa',
            },
            { label: 'Ocean', body: 'Global salty ocean.' },
          ],
        }),
      ),
    ).toEqual({
      type: 'layers',
      title: 'Europa interior',
      layers: [
        {
          label: 'Ice shell',
          depth: '~20 km',
          body: 'Cracked icy crust.',
          href: '/space/europa',
        },
        { label: 'Ocean', body: 'Global salty ocean.' },
      ],
    })
  })

  it('parses scale widgets with units and notes', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'scale',
          title: 'Mean diameter',
          unit: 'km',
          mode: 'log',
          items: [
            {
              label: 'Earth',
              value: 12742,
              note: 'Reference rocky world.',
              href: '/space/earth',
            },
            { label: 'Mars', value: 6779, href: '/space/mars' },
          ],
        }),
      ),
    ).toEqual({
      type: 'scale',
      title: 'Mean diameter',
      unit: 'km',
      mode: 'log',
      items: [
        {
          label: 'Earth',
          value: 12742,
          note: 'Reference rocky world.',
          href: '/space/earth',
        },
        { label: 'Mars', value: 6779, href: '/space/mars' },
      ],
    })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'scale',
          items: [
            { label: 'Earth', value: 0 },
            { label: 'Mars', value: 6779 },
          ],
        }),
      ),
    ).toBeNull()
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

  it('emits a pending placeholder for incomplete streaming fences', () => {
    const markdown = [
      'Europa is an ocean world.',
      '',
      '```cleo',
      '{"type":"layers","title":"Europa interior","layers":[',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Europa is an ocean world.\n\n' },
      { type: 'pending', widgetType: 'layers' },
    ])
    expect(peekCleoWidgetType('{"type":"scale"')).toBe('scale')
  })

  it('emits an unavailable shell for invalid closed fences', () => {
    const markdown = [
      '```cleo',
      JSON.stringify({ type: 'tabs', tabs: [{ label: 'Only one', body: 'Nope' }] }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'unavailable', widgetType: 'tabs' },
    ])
  })
})

describe('helpers', () => {
  it('normalizes curated widget images and validates hrefs', () => {
    expect(normalizeCuratedWidgetImage('/images/space/mars/w640.jpg')).toBe(
      '/images/space/mars/w1280.jpg',
    )
    expect(curatedWidgetThumbSrc('/images/space/mars/w1280.jpg')).toBe(
      '/images/space/mars/w640.jpg',
    )
    expect(isCleoWidgetHref('/explore/japan')).toBe(true)
    expect(isCleoWidgetHref('/cleo')).toBe(false)
    expect(formatScaleValue(12742)).toBe('12,742')
    expect(formatScaleValue(1_200_000)).toMatch(/1\.2/)
  })

  it('auto-selects log scale for wide magnitude ranges', () => {
    const items = [
      { label: 'Earth', value: 12_742 },
      { label: 'Sun', value: 1_391_400 },
    ]
    expect(resolveScaleMode(items)).toBe('log')
    expect(resolveScaleMode(items, 'linear')).toBe('linear')
    expect(scaleBarPercent(12_742, items, 'log')).toBe(8)
    expect(scaleBarPercent(1_391_400, items, 'log')).toBe(100)
  })
})
