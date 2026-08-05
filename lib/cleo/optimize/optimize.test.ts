import { describe, expect, it, vi } from 'vitest'

import type { CleoEvalCase } from '~/lib/cleo/evals/types'
import { CLEO_BASE_INSTRUCTIONS } from '~/lib/cleo/instructions'
import { formatOptimizeHandoff } from '~/lib/cleo/optimize/handoff'
import { runOptimizeLoop } from '~/lib/cleo/optimize/loop'
import {
  buildInstructionMetaPrompt,
  parseRevisedBaseInstructions,
} from '~/lib/cleo/optimize/meta-prompt'
import {
  scoreOptimizeCases,
  shouldPromoteCandidate,
  withAssistantOutput,
} from '~/lib/cleo/optimize/score'
import {
  filterOptimizeTargetCases,
  isOptimizeTargetCase,
} from '~/lib/cleo/optimize/targets'

const groundedJapan: CleoEvalCase = {
  id: 'opt-japan',
  split: 'train',
  failureModes: ['missing_catalog_link'],
  prompt: 'Tell me about Japan.',
  assistant:
    'Japan pairs volcanoes with dense coasts. See [Japan](/explore/japan).',
  expect: {
    catalogHrefs: ['/explore/japan'],
    noInventedPaths: true,
    guardrailNoop: true,
    noStockPhrases: true,
  },
}

const groundedMarsHoldout: CleoEvalCase = {
  id: 'opt-mars',
  split: 'holdout',
  failureModes: ['missing_catalog_link'],
  prompt: 'Tell me about Mars.',
  assistant: 'Mars is a cold desert world. See [Mars](/space/mars).',
  expect: {
    catalogHrefs: ['/space/mars'],
    noInventedPaths: true,
    guardrailNoop: true,
    noStockPhrases: true,
  },
}

const negativeInvented: CleoEvalCase = {
  id: 'neg-atlantis',
  split: 'train',
  failureModes: ['invented_guide_link'],
  prompt: 'Atlantis?',
  assistant: 'See [Atlantis](/explore/atlantis).',
  expect: { hasInventedPaths: true },
}

describe('optimize targets', () => {
  it('includes positive cases and excludes negative fixtures', () => {
    expect(isOptimizeTargetCase(groundedJapan)).toBe(true)
    expect(isOptimizeTargetCase(negativeInvented)).toBe(false)
    expect(
      filterOptimizeTargetCases([groundedJapan, negativeInvented]),
    ).toEqual([groundedJapan])
  })
})

describe('optimize scoring', () => {
  it('scores train/holdout and requires both to improve for promotion', () => {
    const baseline = scoreOptimizeCases([groundedJapan, groundedMarsHoldout])
    expect(baseline.train.passed).toBe(1)
    expect(baseline.holdout.passed).toBe(1)

    const worseTrain = scoreOptimizeCases([
      withAssistantOutput(groundedJapan, 'Japan is an island country.'),
      groundedMarsHoldout,
    ])
    expect(shouldPromoteCandidate(baseline, worseTrain)).toBe(false)

    const stillGood = scoreOptimizeCases([groundedJapan, groundedMarsHoldout])
    expect(shouldPromoteCandidate(baseline, stillGood)).toBe(false)

    // Synthetic "improvement" only when rates actually rise (start from a miss).
    const lowBaseline = scoreOptimizeCases([
      withAssistantOutput(groundedJapan, 'No link here.'),
      withAssistantOutput(groundedMarsHoldout, 'No link here either.'),
    ])
    const improved = scoreOptimizeCases([groundedJapan, groundedMarsHoldout])
    expect(shouldPromoteCandidate(lowBaseline, improved)).toBe(true)
  })
})

describe('meta-prompt + parse', () => {
  it('builds a meta-prompt with grader ASI and parses revised instructions', () => {
    const failing = withAssistantOutput(
      groundedJapan,
      'Great question! Japan is nice.',
    )
    const scorecard = scoreOptimizeCases([failing])
    const prompt = buildInstructionMetaPrompt({
      baseInstructions: CLEO_BASE_INSTRUCTIONS,
      failures: [
        {
          id: failing.id,
          split: failing.split,
          prompt: failing.prompt,
          assistant: failing.assistant,
          failureModes: failing.failureModes,
          diagnostics: scorecard.train.failures[0]?.results
            .filter((result) => !result.pass)
            .map((result) => `${result.grader}: ${result.diagnostic}`) ?? [],
        },
      ],
    })

    expect(prompt).toContain('Formatting re-enabled')
    expect(prompt).toContain('opt-japan')
    expect(prompt).toContain('stock_phrases')

    const revised = `${CLEO_BASE_INSTRUCTIONS}\n\n<!-- optimize: reinforce catalog links -->`
    expect(parseRevisedBaseInstructions(`\`\`\`\n${revised}\n\`\`\``)).toBe(
      revised,
    )
    expect(parseRevisedBaseInstructions('not instructions')).toBeNull()
  })
})

describe('optimize loop', () => {
  it('dry-run scores frozen targets without calling generators', async () => {
    const generateReply = vi.fn()
    const reviseInstructions = vi.fn()

    const result = await runOptimizeLoop({
      cases: [groundedJapan, groundedMarsHoldout, negativeInvented],
      mode: 'dry-run',
      generateReply,
      reviseInstructions,
    })

    expect(generateReply).not.toHaveBeenCalled()
    expect(reviseInstructions).not.toHaveBeenCalled()
    expect(result.promoted).toBe(false)
    expect(result.handoffMarkdown).toContain('dry-run')
    expect(result.baseline.train.total).toBe(1)
    expect(result.baseline.holdout.total).toBe(1)
  })

  it('live loop revises and promotes when both splits improve', async () => {
    const generateReply = vi
      .fn()
      // baseline: both fail catalog mention
      .mockResolvedValueOnce('Japan is fine.')
      .mockResolvedValueOnce('Mars is fine.')
      // candidate: both pass
      .mockResolvedValueOnce(
        'Japan pairs coasts and highlands. See [Japan](/explore/japan).',
      )
      .mockResolvedValueOnce(
        'Mars is a cold desert world. See [Mars](/space/mars).',
      )

    const reviseInstructions = vi.fn().mockResolvedValue(
      `${CLEO_BASE_INSTRUCTIONS}\n\nAlways include the canonical portal deep link for catalog subjects.`,
    )

    const result = await runOptimizeLoop({
      cases: [groundedJapan, groundedMarsHoldout],
      mode: 'live',
      maxRounds: 1,
      generateReply,
      reviseInstructions,
      candidatePath: 'tmp/cleo-optimize/candidate-base-instructions.txt',
    })

    expect(reviseInstructions).toHaveBeenCalledTimes(1)
    expect(generateReply).toHaveBeenCalledTimes(4)
    expect(result.promoted).toBe(true)
    expect(result.candidate.train.passRate).toBe(1)
    expect(result.candidate.holdout.passRate).toBe(1)
    expect(result.handoffMarkdown).toContain('Promote: **yes**')
    expect(formatOptimizeHandoff({
      mode: 'live',
      promoted: true,
      rounds: 1,
      baseline: result.baseline,
      candidate: result.candidate,
      failures: [],
    })).toContain('Review checklist')
  })
})
