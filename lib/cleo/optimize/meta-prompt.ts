import type { CaseGradeReport, CleoEvalCase } from '~/lib/cleo/evals/types'

export type OptimizeFailureDetail = {
  id: string
  split: CleoEvalCase['split']
  prompt: string
  assistant: string
  failureModes: CleoEvalCase['failureModes']
  diagnostics: string[]
}

export function collectOptimizeFailures(
  cases: readonly CleoEvalCase[],
  reports: readonly CaseGradeReport[],
): OptimizeFailureDetail[] {
  const byId = new Map(cases.map((evalCase) => [evalCase.id, evalCase]))
  const details: OptimizeFailureDetail[] = []

  for (const report of reports) {
    if (report.pass) continue
    const evalCase = byId.get(report.id)
    if (!evalCase) continue
    details.push({
      id: report.id,
      split: report.split,
      prompt: evalCase.prompt,
      assistant: evalCase.assistant,
      failureModes: evalCase.failureModes,
      diagnostics: report.results
        .filter((result) => !result.pass)
        .map((result) => `${result.grader}: ${result.diagnostic}`),
    })
  }

  return details
}

/** Meta-prompt for revising CLEO_BASE_INSTRUCTIONS from grader ASI. */
export function buildInstructionMetaPrompt(input: {
  baseInstructions: string
  failures: OptimizeFailureDetail[]
}): string {
  const failureBlocks = input.failures
    .slice(0, 24)
    .map((failure, index) => {
      const modes = failure.failureModes.join(', ')
      const diagnostics = failure.diagnostics.map((line) => `  - ${line}`).join('\n')
      return `### Failure ${index + 1}: ${failure.id} (${failure.split})
Modes: ${modes}
User:
${failure.prompt}

Assistant:
${failure.assistant}

Diagnostics:
${diagnostics || '  - (no diagnostic)'}`
    })
    .join('\n\n')

  return `You revise Cleo's developer **base** instructions (voice, priorities, tools policy). The portal catalog block is appended separately — do **not** include or invent a catalog section.

## Goals
- Raise pass rate on grounded portal answers and voice constraints.
- Keep Cleo sharp, warm, and concise — not a help desk.
- Never weaken path/image grounding: the model must not invent Explore/Space/Civilizations/Cities/Oceans/Rivers links or curated image URLs.
- Prefer small, surgical edits over a total rewrite.
- Do not add fine-tuning, memory, or runtime self-modification instructions.

## Current base instructions
\`\`\`
${input.baseInstructions}
\`\`\`

## Failing eval cases (grader ASI)
${failureBlocks || '(No failures supplied — make only clearly beneficial clarifications.)'}

## Output contract
Return **only** the full revised base instructions as plain text.
- Start with exactly: Formatting re-enabled
- Keep the existing XML-ish section structure when possible (\`<identity>\`, \`<voice>\`, etc.).
- Do not wrap the result in Markdown fences.
- Do not include a portal catalog / \`<cleo_site>\` block.`
}

/**
 * Extract revised base instructions from a model reply.
 * Tolerates accidental Markdown fences.
 */
export function parseRevisedBaseInstructions(raw: string): string | null {
  let text = raw.trim()
  if (!text) return null

  const fenced = text.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) {
    text = fenced[1].trim()
  }

  if (!text.startsWith('Formatting re-enabled')) {
    const idx = text.indexOf('Formatting re-enabled')
    if (idx === -1) return null
    text = text.slice(idx).trim()
  }

  // Reject accidental catalog appends from the reviser.
  if (/<cleo_site>/.test(text) || /Portal catalog/i.test(text)) {
    text = text.split(/<cleo_site>|## Portal catalog/i)[0]?.trim() ?? text
  }

  if (text.length < 200) return null
  return text
}
