import { describe, expect, it } from 'vitest'

import {
  CLEO_ASK_AUTO_PARAM,
  CLEO_ASK_QUERY_PARAM,
  CLEO_ASK_TOPIC_PARAM,
  cleoAskHref,
  compareAskHref,
  compareAskPrompt,
  essayAskHref,
  essayAskPrompt,
  factsAskHref,
  factsAskPrompt,
  featureAskHref,
  featureAskPrompt,
  galleryItemAskHref,
  guideAskHref,
  guideAskPrompt,
  homeAskHref,
  homeAskPrompt,
  placeAskHref,
  placeAskPrompt,
  searchAskHref,
  searchAskPrompt,
  surfaceAskHref,
  surfaceAskPrompt,
  topicAskHref,
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

  it('builds compact topic= hrefs', () => {
    expect(topicAskHref('explore', 'japan')).toContain(
      `${CLEO_ASK_TOPIC_PARAM}=explore%2Fjapan`,
    )
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

  it('builds place, feature, compare, gallery, and essay prompts', () => {
    expect(placeAskPrompt('Mount Fuji', 'Japan')).toMatch(/Mount Fuji/)
    expect(placeAskHref('Mount Fuji', 'Japan')).toContain('auto=1')
    expect(featureAskPrompt('Olympus Mons', 'Mars')).toMatch(/Olympus Mons/)
    expect(featureAskHref('Olympus Mons', 'Mars')).toContain('/cleo?')
    expect(compareAskPrompt('space', 'Mars', 'Earth')).toMatch(/Mars/)
    expect(compareAskHref('explore', 'Japan', 'South Korea')).toContain('auto=1')
    expect(
      galleryItemAskHref('Mount Fuji', 'Japan', 'places'),
    ).toContain('/cleo?')
    expect(essayAskPrompt('Pale Blue Marble', 'pale-blue-marble')).toContain(
      '/blog/pale-blue-marble',
    )
    expect(essayAskHref('Pale Blue Marble', 'pale-blue-marble')).toContain(
      `${CLEO_ASK_TOPIC_PARAM}=writing%2Fpale-blue-marble`,
    )
    expect(essayAskHref('Pale Blue Marble')).toContain('q=')
    expect(factsAskPrompt('explore', 'Japan')).toMatch(/fact plate for Japan/)
    expect(factsAskHref('space', 'Mars')).toContain('auto=1')
  })

  it('builds home, surface, and search prompts', () => {
    expect(homeAskPrompt()).toMatch(/knowledge portal/)
    expect(homeAskPrompt()).not.toMatch(/Topics tour/)
    expect(homeAskHref()).toContain('q=')
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
