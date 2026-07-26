/**
 * Pick Responses API reasoning effort from the latest user turn.
 * Keep greetings cheap; reserve higher effort for research-heavy asks.
 */

export type CleoReasoningEffort = 'low' | 'medium' | 'high'

const GREETING =
  /^(hi|hello|hey|yo|sup|thanks|thank you|thx|good (morning|afternoon|evening)|howdy)\b/i

const HIGH_SIGNAL =
  /\b(compare|comparison|research|sources?|cite|citation|analyze|analysis|trade-?offs?|versus|\bvs\.?\b|calculate|calculation|prove|derive|debug|why does|how does)\b/i

const CATALOG_SIGNAL =
  /\b(explore|space|gallery|topics|planet|moon|nebula|country|countries|orient|field guide)\b/i

export function selectReasoningEffort(
  messages: readonly { content: string; role: string }[],
): CleoReasoningEffort {
  const userTurns = messages.filter(
    (message) => message.role === 'user' && message.content.trim(),
  )
  const last = userTurns.at(-1)?.content.trim() ?? ''

  if (!last) {
    return 'medium'
  }

  // Only true social openers stay on low effort — short factual asks stay medium.
  if (
    last.length <= 48 &&
    GREETING.test(last) &&
    !last.includes('?') &&
    !HIGH_SIGNAL.test(last) &&
    !CATALOG_SIGNAL.test(last)
  ) {
    return 'low'
  }

  if (HIGH_SIGNAL.test(last) || last.length >= 700) {
    return 'high'
  }

  if (userTurns.length >= 5 && last.length >= 160) {
    return 'high'
  }

  return 'medium'
}
