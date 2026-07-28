import { describe, expect, it } from 'vitest'

import {
  CLEO_ASK_AUTO_PARAM,
  CLEO_ASK_QUERY_PARAM,
  cleoAskHref,
  essayAskHref,
  essayAskPrompt,
  guideAskHref,
  guideAskPrompt,
  parseCleoAskSearchParams,
  placeAskHref,
  placeAskPrompt,
  searchAskHref,
  searchAskPrompt,
  surfaceAskHref,
  surfaceAskPrompt,
} from '~/lib/cleo/ask-links'

describe('cleoAskHref', () => {
  it('returns /cleo for blank prompts', () => {
    expect(cleoAskHref('   ')).toBe('/cleo')
  })

  it('encodes q and optional auto', () => {
    const href = cleoAskHref('Orient me to Japan', { autoSubmit: true })
    const url = new URL(href, 'https://cleo.example')
    expect(url.pathname).toBe('/cleo')
    expect(url.searchParams.get(CLEO_ASK_QUERY_PARAM)).toBe(
      'Orient me to Japan',
    )
    expect(url.searchParams.get(CLEO_ASK_AUTO_PARAM)).toBe('1')
  })
})

describe('parseCleoAskSearchParams', () => {
  it('reads Next.js searchParams objects', () => {
    expect(
      parseCleoAskSearchParams({
        q: 'Why is Europa interesting?',
        auto: '1',
      }),
    ).toEqual({
      prompt: 'Why is Europa interesting?',
      autoSubmit: true,
    })
  })

  it('reads URLSearchParams and ignores blank q', () => {
    expect(
      parseCleoAskSearchParams(new URLSearchParams('q=%20&auto=true')),
    ).toBeNull()
    expect(
      parseCleoAskSearchParams(new URLSearchParams('q=hello&auto=yes')),
    ).toEqual({ prompt: 'hello', autoSubmit: true })
  })

  it('defaults autoSubmit to false', () => {
    expect(parseCleoAskSearchParams({ q: 'hi' })).toEqual({
      prompt: 'hi',
      autoSubmit: false,
    })
  })
})

describe('guide, place, essay, and surface prompts', () => {
  it('builds explore/space orientation prompts', () => {
    expect(guideAskPrompt('explore', 'Japan')).toMatch(/Japan/)
    expect(guideAskPrompt('space', 'Europa')).toMatch(/Europa/)
    expect(guideAskHref('explore', 'Japan')).toContain('/cleo?')
    expect(guideAskHref('space', 'Europa', { autoSubmit: false })).not.toContain(
      'auto=',
    )
  })

  it('builds place and essay prompts', () => {
    expect(placeAskPrompt('Mount Fuji', 'Japan')).toMatch(/Mount Fuji/)
    expect(placeAskHref('Mount Fuji', 'Japan')).toContain('auto=1')
    expect(essayAskPrompt('Pale Blue Marble', 'pale-blue-marble')).toContain(
      '/blog/pale-blue-marble',
    )
    expect(essayAskHref('Pale Blue Marble', 'pale-blue-marble')).toContain(
      '/cleo?',
    )
  })

  it('builds surface and search prompts', () => {
    expect(surfaceAskPrompt('topics')).toMatch(/Topics/)
    expect(surfaceAskPrompt('writing')).toMatch(/Writing/)
    expect(surfaceAskHref('gallery')).toContain('q=')
    expect(searchAskPrompt('atlantis')).toMatch(/no matching guide/)
    expect(searchAskPrompt('japan', { hasMatches: true })).toMatch(
      /matching guides/,
    )
    expect(searchAskPrompt('japan', { hasMatches: true })).not.toMatch(
      /no matching guide/,
    )
    expect(searchAskHref('atlantis')).toContain(encodeURIComponent('atlantis'))
  })
})
