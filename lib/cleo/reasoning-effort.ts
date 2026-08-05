/**
 * Heuristic reasoning effort for Cleo turns — keep greetings snappy and
 * reserve heavier thinking for research, comparisons, and contested claims.
 */

export type CleoReasoningEffort =
  | "minimal"
  | "low"
  | "medium"
  | "high"
  | "xhigh"
export type CleoSearchContextSize = "low" | "medium" | "high"

const XHIGH_SIGNAL =
  /\b(deep\s+research|exhaustive(?:ly)?|in[- ]depth\s+(?:research|investigation|analysis)|comprehensive\s+(?:report|research|analysis|review)|thorough(?:ly)?\s+research|as\s+thorough(?:ly)?\s+as\s+possible)\b/i

const HIGH_SIGNAL =
  /\b(compare|comparison|versus|vs\.?|trade-?off|research|sources?|cite|citation|fact[- ]?check|verify|verif(?:y|ication)|pros?\s+and\s+cons?|deep\s+dive|analyze|analysis|investigate|debate|controvers(?:y|ial)|why\s+do|how\s+does|explain\s+why)\b/i

const LOW_SIGNAL =
  /^(hi+|hello|hey|yo|sup|thanks|thank\s+you|ty|ok|okay|cool|nice|lol|haha|good\s+morning|good\s+evening|good\s+night|gm|gn)([\s,!.?]*|[\s,!.?]+cleo[\s,!.?]*)?$/i

/** Pick reasoning effort from the latest user message text. */
export function selectReasoningEffort(userText: string): CleoReasoningEffort {
  const text = userText.trim()

  if (!text) {
    return "medium"
  }

  if (LOW_SIGNAL.test(text)) {
    // Snappy social turns. Use `low`, not `minimal`/`none`: Cleo always attaches
    // hosted `web_search`, and the Responses API rejects that tool when
    // reasoning.effort is `minimal` (or `none`).
    return "low"
  }

  if (XHIGH_SIGNAL.test(text)) {
    // Explicit deep-research asks only — xhigh can approach the 90s maxDuration.
    return "xhigh"
  }

  if (HIGH_SIGNAL.test(text) || text.length > 400) {
    return "high"
  }

  return "medium"
}

/**
 * Align hosted web_search context budget with the turn's reasoning effort:
 * light social turns stay cheap; research turns get more retrieved context.
 */
export function selectSearchContextSize(
  effort: CleoReasoningEffort
): CleoSearchContextSize {
  switch (effort) {
    case "minimal":
    case "low":
      return "low"
    case "high":
    case "xhigh":
      return "high"
    default:
      return "medium"
  }
}
