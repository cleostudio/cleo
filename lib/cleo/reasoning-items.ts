/**
 * Encrypted reasoning items for store:false multi-turn continuity.
 * OpenAI returns opaque `encrypted_content` on reasoning output items; clients
 * keep and replay them so reasoning.context all_turns can use prior turns.
 */

export type EncryptedReasoningSummaryPart = {
  text: string
  type: "summary_text"
}

export type EncryptedReasoningItem = {
  encrypted_content: string
  id: string
  summary?: EncryptedReasoningSummaryPart[]
  type: "reasoning"
}

/** Soft limits so request bodies stay bounded. */
export const MAX_REASONING_ITEMS_PER_MESSAGE = 8
export const MAX_ENCRYPTED_REASONING_CHARS = 120_000
/** Aggregate encrypted-reasoning budget across one `/api/responses` body. */
export const MAX_TOTAL_ENCRYPTED_REASONING_CHARS = 240_000

function isSummaryPart(value: unknown): value is EncryptedReasoningSummaryPart {
  if (typeof value !== "object" || value === null) return false
  const part = value as Record<string, unknown>
  return part.type === "summary_text" && typeof part.text === "string"
}

export function isEncryptedReasoningItem(
  value: unknown
): value is EncryptedReasoningItem {
  if (typeof value !== "object" || value === null) return false
  const item = value as Record<string, unknown>
  if (item.type !== "reasoning") return false
  if (typeof item.id !== "string" || !item.id) return false
  if (typeof item.encrypted_content !== "string" || !item.encrypted_content) {
    return false
  }
  if (item.encrypted_content.length > MAX_ENCRYPTED_REASONING_CHARS) {
    return false
  }
  if (item.summary !== undefined) {
    if (!Array.isArray(item.summary) || !item.summary.every(isSummaryPart)) {
      return false
    }
  }
  return true
}

/** Sanitize client-supplied reasoning items for API replay. */
export function sanitizeReasoningItems(
  value: unknown
): EncryptedReasoningItem[] | undefined {
  if (!Array.isArray(value)) return undefined

  const kept: EncryptedReasoningItem[] = []

  for (const entry of value) {
    if (!isEncryptedReasoningItem(entry)) continue
    kept.push({
      type: "reasoning",
      id: entry.id.slice(0, 128),
      encrypted_content: entry.encrypted_content,
      ...(entry.summary && entry.summary.length > 0
        ? {
            summary: entry.summary.slice(0, 8).map((part) => ({
              type: "summary_text" as const,
              text: part.text.slice(0, 4_000),
            })),
          }
        : {}),
    })
    if (kept.length >= MAX_REASONING_ITEMS_PER_MESSAGE) break
  }

  return kept.length > 0 ? kept : undefined
}
