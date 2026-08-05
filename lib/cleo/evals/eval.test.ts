import { describe, expect, it } from 'vitest'

import { loadCleoEvalCases } from '~/lib/cleo/evals/load-cases'
import { CLEO_FAILURE_MODES } from '~/lib/cleo/evals/taxonomy'
import { gradeCleoEvalCase } from '~/lib/cleo/graders'
import { gradeCatalogMention } from '~/lib/cleo/graders/catalog-mention'
import { gradeStockPhrases } from '~/lib/cleo/graders/stock-phrases'

describe('cleo eval harness (Phase A)', () => {
  const cases = loadCleoEvalCases()

  it('loads a non-trivial train/holdout golden set', () => {
    expect(cases.length).toBeGreaterThanOrEqual(20)
    expect(cases.some((entry) => entry.split === 'train')).toBe(true)
    expect(cases.some((entry) => entry.split === 'holdout')).toBe(true)

    const modes = new Set(cases.flatMap((entry) => entry.failureModes))
    for (const mode of CLEO_FAILURE_MODES) {
      expect(modes.has(mode)).toBe(true)
    }
  })

  it('passes every golden case under deterministic graders', () => {
    const failures: string[] = []

    for (const evalCase of cases) {
      const report = gradeCleoEvalCase(evalCase)
      if (!report.pass) {
        const details = report.results
          .filter((result) => !result.pass)
          .map((result) => `${result.grader}: ${result.diagnostic}`)
          .join(' | ')
        failures.push(`${evalCase.id} (${evalCase.split}): ${details}`)
      }
    }

    expect(failures).toEqual([])
  })

  it('stock-phrase grader catches banned openers', () => {
    const result = gradeStockPhrases('Absolutely, Mars is cold. See /space/mars.')
    expect(result.pass).toBe(false)
    expect(result.diagnostic).toMatch(/Absolutely/i)
  })

  it('catalog-mention grader reports missing hrefs with ASI', () => {
    const result = gradeCatalogMention('No links here.', ['/explore/japan'])
    expect(result.pass).toBe(false)
    expect(result.diagnostic).toContain('/explore/japan')
  })
})
