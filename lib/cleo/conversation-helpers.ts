/**
 * Shared AskForm helpers for conversation payload shaping and recovery UX.
 */

import type { EncryptedReasoningItem } from "~/lib/cleo/reasoning-items"
import type { IncompleteReason, MessageImage } from "~/lib/cleo/stream"
import { incompleteStatusMessage } from "~/lib/cleo/stream"

export const CONTINUE_PROMPT = "Continue from where you left off."

export type ConversationMessagePayload = {
  content: string
  images?: MessageImage[]
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

export type MessageIncomplete = {
  message: string
  reason?: IncompleteReason
}

export type VisibleMessageLike = {
  activities?: unknown[]
  content: string
  hidden?: boolean
  images?: MessageImage[]
  incomplete?: MessageIncomplete
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

export function messageHasVisibleContent(message: VisibleMessageLike) {
  return (
    Boolean(message.content.trim()) ||
    Boolean(message.images?.length) ||
    Boolean(message.activities?.length) ||
    Boolean(message.incomplete)
  )
}

/** Build the API messages array from UI history (skip hidden Continue prompts). */
export function toConversationPayload(
  messages: readonly VisibleMessageLike[]
): ConversationMessagePayload[] {
  return messages
    .filter(
      (message) =>
        !message.hidden &&
        (Boolean(message.content.trim()) || Boolean(message.images?.length))
    )
    .map(({ role, content, images, reasoningItems }) => ({
      role,
      content,
      ...(images && images.length > 0 ? { images } : {}),
      ...(role === "assistant" &&
      reasoningItems &&
      reasoningItems.length > 0
        ? { reasoningItems }
        : {}),
    }))
}

export function makeIncomplete(
  reason: IncompleteReason,
  message?: string
): MessageIncomplete {
  return {
    reason,
    message: message ?? incompleteStatusMessage(reason),
  }
}

/** Stable prompt-cache key for a conversation's first user text. */
export function promptCacheKeyForConversation(
  messages: readonly { content: string; role: string }[]
) {
  const firstUser = messages.find(
    (message) => message.role === "user" && message.content.trim()
  )
  const seed = firstUser?.content.trim() ?? "cleo"
  // FNV-1a 32-bit — short, deterministic, good enough for cache bucketing.
  let hash = 0x811c9dc5
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return `cleo:${(hash >>> 0).toString(16)}`
}
