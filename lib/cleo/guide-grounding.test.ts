import { describe, expect, it } from 'vitest'

import {
  buildGuideGroundingInstructions,
  conversationGroundingText,
  matchGuidesInText,
  MAX_GROUNDED_GUIDES,
  parseFocusGuideInput,
  selectGroundedGuides,
} from './guide-grounding'

describe('matchGuidesInText', () => {
  it('matches country and space names with word boundaries', () => {
    const matched = matchGuidesInText(
      'Compare Mars and Japan, then mention Europa.',
    )
    expect(matched.map((guide) => guide.href).sort()).toEqual([
      '/explore/japan',
      '/space/europa',
      '/space/mars',
    ])
  })

  it('prefers Nigeria over a nested Niger token', () => {
    const matched = matchGuidesInText('Tell me about Nigeria.')
    expect(matched.map((guide) => guide.slug)).toEqual(['nigeria'])
  })

  it('matches explicit site paths', () => {
    const matched = matchGuidesInText(
      'See /explore/iceland and /space/orion-nebula please.',
    )
    expect(matched.map((guide) => guide.href)).toEqual([
      '/explore/iceland',
      '/space/orion-nebula',
    ])
  })
})

describe('selectGroundedGuides', () => {
  it('puts focus guides first and caps the list', () => {
    const selected = selectGroundedGuides({
      focusGuides: [{ collection: 'explore', slug: 'japan' }],
      text: 'Compare Mars, Earth, Europa, and the Moon.',
    })

    expect(selected[0]).toMatchObject({
      collection: 'explore',
      slug: 'japan',
    })
    expect(selected).toHaveLength(MAX_GROUNDED_GUIDES)
    expect(selected.slice(1).every((guide) => guide.collection === 'space')).toBe(
      true,
    )
  })

  it('drops unknown focus slugs', () => {
    expect(
      selectGroundedGuides({
        focusGuides: [{ collection: 'explore', slug: 'not-a-country' }],
        text: '',
      }),
    ).toEqual([])
  })
})

describe('buildGuideGroundingInstructions', () => {
  it('returns an empty string without guides', () => {
    expect(buildGuideGroundingInstructions([])).toBe('')
  })

  it('includes orientation, guide path, and Gallery photo links', () => {
    const [japan] = selectGroundedGuides({
      focusGuides: [{ collection: 'explore', slug: 'japan' }],
      text: '',
    })
    expect(japan).toBeDefined()
    expect(japan!.galleryHref).toBe('/gallery?q=Japan')
    expect(japan!.photoSrc).toMatch(/^\/images\/atlas\/japan\//)
    const block = buildGuideGroundingInstructions([japan!])
    expect(block).toContain('<cleo_guide_excerpts>')
    expect(block).toContain('/explore/japan')
    expect(block).toContain('/gallery?q=Japan')
    expect(block).toContain('Orientation:')
    expect(block).toContain(japan!.about.slice(0, 40))
    expect(block).toContain('do not paste the Orientation block verbatim')
    expect(block).toContain('Prefer Gallery search')
  })
})

describe('helpers', () => {
  it('joins the latest user turns for matching', () => {
    expect(
      conversationGroundingText([
        { role: 'user', content: 'Japan?' },
        { role: 'assistant', content: '…' },
        { role: 'user', content: 'And the capital?' },
      ]),
    ).toBe('Japan?\nAnd the capital?')
  })

  it('parses focusGuide request values', () => {
    expect(parseFocusGuideInput(undefined)).toEqual([])
    expect(parseFocusGuideInput(['explore/japan'])).toEqual([
      { collection: 'explore', slug: 'japan' },
    ])
    expect(parseFocusGuideInput(['explore/nope'])).toEqual([])
    expect(parseFocusGuideInput('explore/japan')).toBeNull()
    expect(parseFocusGuideInput(['EXPLORER/japan'])).toBeNull()
  })
})
