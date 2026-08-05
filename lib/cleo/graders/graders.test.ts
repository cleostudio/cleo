import { describe, expect, it } from 'vitest'

import { gradeCuratedImages } from '~/lib/cleo/graders/curated-images'
import { gradeGuardrailNoop } from '~/lib/cleo/graders/guardrail-noop'
import { gradeGuideLinkValidity } from '~/lib/cleo/graders/guide-links'
import {
  gradeExpectInventedPaths,
  gradeNoInventedPaths,
} from '~/lib/cleo/graders/invented-paths'

describe('cleo deterministic graders', () => {
  it('accepts real guide links and curated photos', () => {
    const markdown =
      'See [Japan](/explore/japan) and ![Fuji](/images/atlas/japan/w1280.jpg).'

    expect(gradeGuideLinkValidity(markdown).pass).toBe(true)
    expect(gradeCuratedImages(markdown).pass).toBe(true)
    expect(gradeNoInventedPaths(markdown).pass).toBe(true)
    expect(gradeGuardrailNoop(markdown).pass).toBe(true)
  })

  it('flags invented guide links with diagnostic ASI', () => {
    const markdown = 'Visit [Atlantis](/explore/atlantis).'
    const result = gradeGuideLinkValidity(markdown)

    expect(result.pass).toBe(false)
    expect(result.diagnostic).toContain('/explore/atlantis')
    expect(gradeExpectInventedPaths(markdown).pass).toBe(true)
  })

  it('flags invented curated images', () => {
    const markdown = '![Atlantis](/images/atlas/atlantis/w1280.jpg)'
    const result = gradeCuratedImages(markdown)

    expect(result.pass).toBe(false)
    expect(result.diagnostic.toLowerCase()).toMatch(/atlantis|catalog/)
  })
})
