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

/**
 * Stable prompt-cache key for Cleo's shared voice + portal catalog prefix.
 * Bump the trailing version when `CLEO_INSTRUCTIONS` changes enough to warrant
 * a fresh cache partition. Do not key this on per-turn user text — GPT-5.6
 * matches exact prefixes at breakpoints, and a conversation-specific key
 * fragments the shared instruction cache.
 */
export const CLEO_PROMPT_CACHE_KEY = "cleo:gpt-5.6-terra:voice-v1"
