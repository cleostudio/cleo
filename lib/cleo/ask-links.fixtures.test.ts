import { describe, expect, it } from 'vitest'

import {
  compareAskPrompt,
  essayAskPrompt,
  featureAskPrompt,
  galleryItemAskPrompt,
  guideAskPrompt,
  placeAskPrompt,
  searchAskPrompt,
  surfaceAskPrompt,
  topicAskHref,
} from '~/lib/cleo/ask-links'
import {
  parseCleoAskSearchParams,
  promptFromTopicPath,
} from '~/lib/cleo/parse-ask-search-params'

/**
 * Exact prompt fixtures — the deep-link product contract.
 * Drift here means shareable Ask URLs silently change behavior.
 */
describe('ask-links prompt fixtures', () => {
  it('keeps guide orientation prompts stable', () => {
    expect(guideAskPrompt('explore', 'Japan')).toBe(
      'Give me a quick orientation to Japan. Deep-link its Explore field guide when you mention the country, and include a curated photograph if it helps.',
    )
    expect(guideAskPrompt('space', 'Europa')).toBe(
      'Give me a quick orientation to Europa. Deep-link its Space field guide when you mention it, and include a curated photograph if it helps.',
    )
  })

  it('keeps place, feature, compare, essay, and gallery prompts stable', () => {
    expect(placeAskPrompt('Mount Fuji', 'Japan')).toBe(
      'Tell me about Mount Fuji in Japan. Deep-link the Japan Explore field guide, and include a curated photograph if it helps.',
    )
    expect(featureAskPrompt('Olympus Mons', 'Mars')).toBe(
      'Tell me about Olympus Mons on Mars. Deep-link the Mars Space field guide, and include a curated photograph if it helps.',
    )
    expect(compareAskPrompt('space', 'Mars', 'Earth')).toBe(
      'Compare Mars and Earth in a few sharp points. Deep-link each Space field guide when you name the subjects.',
    )
    expect(essayAskPrompt('Pale Blue Marble', 'pale-blue-marble')).toBe(
      'Discuss the Writing essay “Pale Blue Marble” (/blog/pale-blue-marble). Deep-link that essay when you mention it, and connect it to related Explore, Space, or Gallery pages when useful.',
    )
    expect(galleryItemAskPrompt('Mount Fuji', 'Japan', 'places')).toBe(
      'Tell me about the Gallery photograph “Mount Fuji” in Japan. Deep-link the Japan Explore guide and include that curated photograph if it helps.',
    )
  })

  it('keeps surface and search prompts stable', () => {
    expect(surfaceAskPrompt('topics')).toBe(
      'Give me a quick tour of the Topics on this site and deep-link the collections that fit.',
    )
    expect(searchAskPrompt('atlantis')).toBe(
      'I searched the portal for “atlantis” and found no matching guide. Help me with that topic, and deep-link any related Explore, Space, Gallery, or Writing pages if they exist.',
    )
    expect(searchAskPrompt('japan', { hasMatches: true })).toBe(
      'I searched the portal for “japan” and see matching guides. Help me choose where to start, then deep-link the best Explore, Space, Gallery, or Writing pages.',
    )
  })
})

describe('topic= round trip', () => {
  it('parses topicAskHref back to the guide orientation prompt', () => {
    const href = topicAskHref('explore', 'japan')
    const intent = parseCleoAskSearchParams(
      new URL(href, 'https://cleo.example').searchParams,
    )

    expect(intent).toEqual({
      prompt: guideAskPrompt('explore', 'Japan'),
      autoSubmit: true,
    })
    expect(promptFromTopicPath('space/mars')).toBe(
      guideAskPrompt('space', 'Mars'),
    )
  })

  it('honors auto=0 on topic shortcuts', () => {
    const href = topicAskHref('space', 'europa', { autoSubmit: false })
    const intent = parseCleoAskSearchParams(
      new URL(href, 'https://cleo.example').searchParams,
    )

    expect(intent).toEqual({
      prompt: guideAskPrompt('space', 'Europa'),
      autoSubmit: false,
    })
  })
})
