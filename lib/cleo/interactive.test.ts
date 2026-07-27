import { describe, expect, it } from 'vitest'

import {
  isCleoWidgetHref,
  parseCleoInteractiveBlock,
  segmentCleoMarkdown,
} from './interactive'

describe('parseCleoInteractiveBlock', () => {
  it('parses tabs, timeline, facts, and compare widgets', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'tabs',
          tabs: [
            { label: 'Geography', body: 'Islands. See [Japan](/explore/japan).' },
            { label: 'Culture', body: 'Continuity.' },
          ],
        }),
      ),
    ).toMatchObject({ type: 'tabs' })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'facts',
          items: [
            { label: 'Primary', value: 'Jupiter' },
            {
              label: 'Ocean',
              value: 'Under ice',
              detail: 'Tidal heating.',
              href: '/space/europa',
            },
          ],
        }),
      ),
    ).toMatchObject({
      type: 'facts',
      items: [{ label: 'Primary' }, { href: '/space/europa' }],
    })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'compare',
          columns: ['Mars', 'Earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }),
      ),
    ).toMatchObject({ type: 'compare' })
  })

  it('parses steps and cards widgets', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'steps',
          title: 'How to read Europa',
          steps: [
            { title: 'Ice', body: 'Start with the shell.' },
            { title: 'Ocean', body: 'Infer the water below.' },
          ],
        }),
      ),
    ).toMatchObject({ type: 'steps', title: 'How to read Europa' })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'cards',
          cards: [
            {
              label: 'Io',
              summary: 'Volcanic',
              detail: 'Tidal heating.',
              href: '/space/io',
            },
            { label: 'Ganymede', summary: 'Largest moon' },
          ],
        }),
      ),
    ).toMatchObject({ type: 'cards' })
  })

  it('rejects unsafe hrefs and removed widget types', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'facts',
          items: [
            { label: 'A', value: '1' },
            {
              label: 'B',
              value: '2',
              href: 'https://evil.example',
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
        type: 'steps',
        steps: [
          { title: 'Look at the map', body: 'Four main islands.' },
          { title: 'Then the culture', body: 'Continuity and change.' },
        ],
      }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Japan is an archipelago.\n\n' },
      {
        type: 'interactive',
        block: {
          type: 'steps',
          steps: [
            { title: 'Look at the map', body: 'Four main islands.' },
            { title: 'Then the culture', body: 'Continuity and change.' },
          ],
        },
      },
    ])
  })
})

describe('isCleoWidgetHref', () => {
  it('allows portal guide paths only', () => {
    expect(isCleoWidgetHref('/explore/japan')).toBe(true)
    expect(isCleoWidgetHref('/space/europa')).toBe(true)
    expect(isCleoWidgetHref('/gallery')).toBe(true)
    expect(isCleoWidgetHref('/cleo')).toBe(false)
  })
})
