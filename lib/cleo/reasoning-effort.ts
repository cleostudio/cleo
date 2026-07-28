/**
 * Heuristic reasoning effort for Cleo turns — keep greetings snappy and
 * reserve heavier thinking for research, comparisons, and contested claims.
 */

export type CleoReasoningEffort = "low" | "medium" | "high"

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
    return "low"
  }

  if (HIGH_SIGNAL.test(text) || text.length > 400) {
    return "high"
  }

  return "medium"
}
