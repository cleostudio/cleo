import { describe, expect, it } from 'vitest'

import {
  isCleoPortalActionHref,
  parseCleoInteractiveBlock,
  segmentCleoMarkdown,
} from './interactive'

describe('parseCleoInteractiveBlock', () => {
  it('parses follow_ups', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'follow_ups',
          items: [
            { label: 'Food', prompt: 'Tell me about Japanese food.' },
            { label: 'Season', prompt: 'Best season to visit Japan?' },
          ],
        }),
      ),
    ).toEqual({
      type: 'follow_ups',
      items: [
        { label: 'Food', prompt: 'Tell me about Japanese food.' },
        { label: 'Season', prompt: 'Best season to visit Japan?' },
      ],
    })
  })

  it('parses choices with an optional prompt', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'choices',
          prompt: 'Which angle?',
          items: [{ label: 'History', prompt: 'History of Japan.' }],
        }),
      ),
    ).toEqual({
      type: 'choices',
      prompt: 'Which angle?',
      items: [{ label: 'History', prompt: 'History of Japan.' }],
    })
  })

  it('parses portal_actions with allowlisted hrefs', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'portal_actions',
          items: [
            { label: 'Japan guide', href: '/explore/japan' },
            { label: 'Gallery', href: '/gallery' },
          ],
        }),
      ),
    ).toEqual({
      type: 'portal_actions',
      items: [
        { label: 'Japan guide', href: '/explore/japan' },
        { label: 'Gallery', href: '/gallery' },
      ],
    })
  })

  it('rejects unsafe or unknown portal hrefs', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'portal_actions',
          items: [{ label: 'Evil', href: 'https://example.com' }],
        }),
      ),
    ).toBeNull()

    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'portal_actions',
          items: [{ label: 'Admin', href: '/admin' }],
        }),
      ),
    ).toBeNull()
  })

  it('parses compare plates', () => {
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({
          type: 'compare',
          title: 'Mars vs Earth',
          columns: ['Mars', 'Earth'],
          rows: [
            { label: 'Moons', values: ['2', '1'] },
            { label: 'Day length', values: ['24.6 h', '24 h'] },
          ],
        }),
      ),
    ).toMatchObject({
      type: 'compare',
      title: 'Mars vs Earth',
      columns: ['Mars', 'Earth'],
    })
  })

  it('rejects unknown types and malformed payloads', () => {
    expect(parseCleoInteractiveBlock('{"type":"widget"}')).toBeNull()
    expect(parseCleoInteractiveBlock('not-json')).toBeNull()
    expect(
      parseCleoInteractiveBlock(
        JSON.stringify({ type: 'follow_ups', items: [] }),
      ),
    ).toBeNull()
  })
})

describe('segmentCleoMarkdown', () => {
  it('interleaves prose with validated interactive blocks', () => {
    const markdown = [
      'Japan is an archipelago.',
      '',
      '```cleo',
      JSON.stringify({
        type: 'follow_ups',
        items: [{ label: 'Food', prompt: 'Japanese food culture?' }],
      }),
      '```',
      '',
      'Want photos next?',
      '',
      '```cleo',
      JSON.stringify({
        type: 'portal_actions',
        items: [{ label: 'Gallery', href: '/gallery' }],
      }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Japan is an archipelago.\n\n' },
      {
        type: 'interactive',
        block: {
          type: 'follow_ups',
          items: [{ label: 'Food', prompt: 'Japanese food culture?' }],
        },
      },
      { type: 'markdown', content: '\nWant photos next?\n\n' },
      {
        type: 'interactive',
        block: {
          type: 'portal_actions',
          items: [{ label: 'Gallery', href: '/gallery' }],
        },
      },
    ])
  })

  it('omits incomplete trailing fences so streaming JSON never flashes', () => {
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

  it('drops invalid closed fences without leaking them into prose', () => {
    const markdown = [
      'Hello.',
      '',
      '```cleo',
      '{"type":"nope"}',
      '```',
      '',
      'Still here.',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      { type: 'markdown', content: 'Hello.\n\n' },
      { type: 'markdown', content: '\nStill here.' },
    ])
  })

  it('accepts the cleo-ui language alias', () => {
    const markdown = [
      '```cleo-ui',
      JSON.stringify({
        type: 'choices',
        items: [{ label: 'A', prompt: 'Pick A' }],
      }),
      '```',
    ].join('\n')

    expect(segmentCleoMarkdown(markdown)).toEqual([
      {
        type: 'interactive',
        block: {
          type: 'choices',
          items: [{ label: 'A', prompt: 'Pick A' }],
        },
      },
    ])
  })
})

describe('isCleoPortalActionHref', () => {
  it('allows portal surfaces and guide paths only', () => {
    expect(isCleoPortalActionHref('/explore/japan')).toBe(true)
    expect(isCleoPortalActionHref('/space/europa')).toBe(true)
    expect(isCleoPortalActionHref('/gallery')).toBe(true)
    expect(isCleoPortalActionHref('/topics')).toBe(true)
    expect(isCleoPortalActionHref('/blog/hello')).toBe(true)
    expect(isCleoPortalActionHref('/cleo')).toBe(false)
    expect(isCleoPortalActionHref('/explore/../admin')).toBe(false)
  })
})
