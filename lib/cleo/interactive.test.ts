import { describe, expect, it } from 'vitest'

import { parseCleoInteractiveBlock, segmentCleoMarkdown } from './interactive'

describe('parseCleoInteractiveBlock', () => {
  it('parses tabs widgets', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'tabs',
          title: 'Japan at a glance',
          tabs: [
            { label: 'Geography', body: 'An archipelago…' },
            { label: 'Culture', body: 'Continuity and reinvention…' },
          ],
        }),
      ),
    ).toEqual({
      type: 'tabs',
      title: 'Japan at a glance',
      tabs: [
        { label: 'Geography', body: 'An archipelago…' },
        { label: 'Culture', body: 'Continuity and reinvention…' },
      ],
    })
  })

  it('parses quiz widgets and requires a matching answer id', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'quiz',
          question: 'Which moon has an ocean?',
          options: [
            { id: 'a', label: 'Io' },
            { id: 'b', label: 'Europa' },
          ],
          answer: 'b',
          explanation: 'Europa hides a global ocean under ice.',
        }),
      ),
    ).toMatchObject({ type: 'quiz', answer: 'b' })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'quiz',
          question: 'Which moon has an ocean?',
          options: [
            { id: 'a', label: 'Io' },
            { id: 'b', label: 'Europa' },
          ],
          answer: 'z',
        }),
      ),
    ).toBeNull()
  })

  it('parses timeline, facts, and compare widgets', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'timeline',
          title: 'Apollo',
          events: [
            { when: '1961', title: 'Goal set', detail: 'Kennedy speech.' },
            { when: '1969', title: 'Landing' },
          ],
        }),
      ),
    ).toMatchObject({ type: 'timeline', title: 'Apollo' })

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'facts',
          items: [
            { label: 'Capital', value: 'Tokyo' },
            {
              label: 'Ocean',
              value: 'Under ice',
              detail: 'Tidal heating helps.',
            },
          ],
        }),
      ),
    ).toMatchObject({ type: 'facts' })

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

  it('rejects suggestion-style and unknown types', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'follow_ups',
          items: [{ label: 'More', prompt: 'Tell me more' }],
        }),
      ),
    ).toBeNull()
    expect(parseCleoInteractiveBlock('{"type":"portal_actions"}')).toBeNull()
    expect(parseCleoInteractiveBlock('not-json')).toBeNull()
  })
})

describe('segmentCleoMarkdown', () => {
  it('interleaves prose with generative widgets', () => {
    const markdown = [
      'Japan is an archipelago.',
      '',
      '```cleo',
      JSON.stringify({
        type: 'tabs',
        tabs: [
          { label: 'Geography', body: 'Islands.' },
          { label: 'Culture', body: 'Continuity.' },
        ],
      }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Japan is an archipelago.\n\n' },
      {
        type: 'interactive',
        block: {
          type: 'tabs',
          tabs: [
            { label: 'Geography', body: 'Islands.' },
            { label: 'Culture', body: 'Continuity.' },
          ],
        },
      },
    ])
  })

  it('omits incomplete trailing fences while streaming', () => {
    const markdown = [
      'Comparing Mars and Earth.',
      '',
      '```cleo',
      '{"type":"compare","columns":["Mars","Earth"],"rows":[',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Comparing Mars and Earth.\n\n' },
    ])
  })
})
