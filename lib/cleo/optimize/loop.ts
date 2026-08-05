import type { CleoEvalCase } from '~/lib/cleo/evals/types'
import { CLEO_BASE_INSTRUCTIONS } from '~/lib/cleo/instructions'
import type { GenerateReplyFn, ReviseInstructionsFn } from '~/lib/cleo/optimize/generate'
import { formatOptimizeHandoff } from '~/lib/cleo/optimize/handoff'
import {
  buildInstructionMetaPrompt,
  collectOptimizeFailures,
  parseRevisedBaseInstructions,
} from '~/lib/cleo/optimize/meta-prompt'
import {
  scoreOptimizeCases,
  shouldPromoteCandidate,
  withAssistantOutput,
  type OptimizeScorecard,
} from '~/lib/cleo/optimize/score'
import { filterOptimizeTargetCases } from '~/lib/cleo/optimize/targets'

export type OptimizeLoopResult = {
  promoted: boolean
  rounds: number
  baseline: OptimizeScorecard
  candidate: OptimizeScorecard
  baselineInstructions: string
  candidateInstructions: string
  handoffMarkdown: string
}

async function scoreWithGenerator(
  targets: CleoEvalCase[],
  baseInstructions: string,
  generateReply: GenerateReplyFn,
): Promise<{ cases: CleoEvalCase[]; scorecard: OptimizeScorecard }> {
  const generated: CleoEvalCase[] = []
  for (const evalCase of targets) {
    const assistant = await generateReply(baseInstructions, evalCase.prompt)
    generated.push(withAssistantOutput(evalCase, assistant))
  }
  return { cases: generated, scorecard: scoreOptimizeCases(generated) }
}

/**
 * Offline optimize loop. Dry-run scores frozen assistants; live regenerates
 * with OpenAI and may revise `CLEO_BASE_INSTRUCTIONS`.
 */
export async function runOptimizeLoop(options: {
  cases: readonly CleoEvalCase[]
  mode: 'dry-run' | 'live'
  maxRounds?: number
  baseInstructions?: string
  generateReply?: GenerateReplyFn
  reviseInstructions?: ReviseInstructionsFn
  candidatePath?: string
}): Promise<OptimizeLoopResult> {
  const maxRounds = options.maxRounds ?? 2
  const baselineInstructions =
    options.baseInstructions ?? CLEO_BASE_INSTRUCTIONS
  const targets = filterOptimizeTargetCases(options.cases)

  if (options.mode === 'dry-run') {
    const baseline = scoreOptimizeCases(targets)
    const failures = collectOptimizeFailures(targets, baseline.reports)
    const handoffMarkdown = formatOptimizeHandoff({
      mode: 'dry-run',
      promoted: false,
      rounds: 0,
      baseline,
      candidate: baseline,
      failures,
      candidatePath: options.candidatePath,
      notes: [
        'Dry-run scored frozen optimize-target assistants only.',
        'Re-run with `--live` and `OPENAI_API_KEY` to regenerate + revise instructions.',
        'Negative detector fixtures are excluded from optimize scoring.',
      ],
    })

    return {
      promoted: false,
      rounds: 0,
      baseline,
      candidate: baseline,
      baselineInstructions,
      candidateInstructions: baselineInstructions,
      handoffMarkdown,
    }
  }

  if (!options.generateReply || !options.reviseInstructions) {
    throw new Error('Live optimize requires generateReply and reviseInstructions.')
  }

  const baselineRun = await scoreWithGenerator(
    targets,
    baselineInstructions,
    options.generateReply,
  )
  let bestInstructions = baselineInstructions
  let bestCases = baselineRun.cases
  let bestScore = baselineRun.scorecard
  let rounds = 0

  for (let round = 1; round <= maxRounds; round += 1) {
    const failures = collectOptimizeFailures(bestCases, bestScore.reports)
    if (failures.length === 0) break

    const metaPrompt = buildInstructionMetaPrompt({
      baseInstructions: bestInstructions,
      failures,
    })
    const rawRevised = await options.reviseInstructions(metaPrompt)
    const revised = parseRevisedBaseInstructions(rawRevised)
    if (!revised || revised === bestInstructions) {
      break
    }

    rounds = round
    const candidateRun = await scoreWithGenerator(
      targets,
      revised,
      options.generateReply,
    )

    if (shouldPromoteCandidate(bestScore, candidateRun.scorecard)) {
      bestInstructions = revised
      bestCases = candidateRun.cases
      bestScore = candidateRun.scorecard
    } else {
      // Keep best so far; stop if the revision did not clear the promotion bar.
      break
    }
  }

  const promoted = shouldPromoteCandidate(baselineRun.scorecard, bestScore)
  const failures = collectOptimizeFailures(bestCases, bestScore.reports)
  const handoffMarkdown = formatOptimizeHandoff({
    mode: 'live',
    promoted,
    rounds,
    baseline: baselineRun.scorecard,
    candidate: bestScore,
    failures,
    candidatePath: options.candidatePath,
    notes: promoted
      ? [
          'Candidate beat baseline on train and holdout.',
          'Apply only via human-reviewed PR — do not hot-patch production.',
        ]
      : [
          'Candidate did not strictly improve both train and holdout.',
          'Keep current `CLEO_BASE_INSTRUCTIONS` unless a human overrides with evidence.',
        ],
  })

  return {
    promoted,
    rounds,
    baseline: baselineRun.scorecard,
    candidate: bestScore,
    baselineInstructions,
    candidateInstructions: bestInstructions,
    handoffMarkdown,
  }
}
