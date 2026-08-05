import type { CaseGradeReport, CleoEvalCase, CleoEvalSplit } from '~/lib/cleo/evals/types'
import { gradeCleoEvalCase } from '~/lib/cleo/graders'
import { filterOptimizeTargetCases } from '~/lib/cleo/optimize/targets'

export type SplitScore = {
  split: CleoEvalSplit
  total: number
  passed: number
  passRate: number
  failures: CaseGradeReport[]
}

export type OptimizeScorecard = {
  train: SplitScore
  holdout: SplitScore
  reports: CaseGradeReport[]
}

function emptySplit(split: CleoEvalSplit): SplitScore {
  return { split, total: 0, passed: 0, passRate: 0, failures: [] }
}

function scoreSplit(
  split: CleoEvalSplit,
  reports: CaseGradeReport[],
): SplitScore {
  const forSplit = reports.filter((report) => report.split === split)
  const passed = forSplit.filter((report) => report.pass).length
  const total = forSplit.length
  return {
    split,
    total,
    passed,
    passRate: total === 0 ? 0 : passed / total,
    failures: forSplit.filter((report) => !report.pass),
  }
}

/** Grade frozen or freshly generated assistants on optimize-target cases. */
export function scoreOptimizeCases(
  cases: readonly CleoEvalCase[],
): OptimizeScorecard {
  const targets = filterOptimizeTargetCases(cases)
  const reports = targets.map((evalCase) => gradeCleoEvalCase(evalCase))
  return {
    train: scoreSplit('train', reports),
    holdout: scoreSplit('holdout', reports),
    reports,
  }
}

/**
 * Promote only when the candidate beats baseline on train **and** holdout
 * (strict pass-rate improvement on both splits).
 */
export function shouldPromoteCandidate(
  baseline: OptimizeScorecard,
  candidate: OptimizeScorecard,
): boolean {
  if (baseline.train.total === 0 || baseline.holdout.total === 0) {
    return false
  }
  if (candidate.train.total !== baseline.train.total) return false
  if (candidate.holdout.total !== baseline.holdout.total) return false

  return (
    candidate.train.passRate > baseline.train.passRate &&
    candidate.holdout.passRate > baseline.holdout.passRate
  )
}

export function formatSplitScore(score: SplitScore): string {
  const pct = (score.passRate * 100).toFixed(1)
  return `${score.passed}/${score.total} (${pct}%)`
}

export function withAssistantOutput(
  evalCase: CleoEvalCase,
  assistant: string,
): CleoEvalCase {
  return { ...evalCase, assistant }
}

export { emptySplit }
