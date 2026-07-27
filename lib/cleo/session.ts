/**
 * Browser-only Cleo conversation persistence (localStorage). No auth or server
 * storage — reload restores the last thread; New chat clears it.
 */

import {
  sanitizeReasoningItems,
  type EncryptedReasoningItem,
} from '~/lib/cleo/reasoning-items'
import type {
  ActivityItem,
  IncompleteReason,
  MessageImage,
} from '~/lib/cleo/stream'

export const CLEO_SESSION_STORAGE_KEY = 'cleo:conversation:v1'

/** Soft budget so data-URL attachments do not blow the ~5MB quota. */
const MAX_PERSISTED_IMAGE_CHARS = 64_000
const MAX_SESSION_CHARS = 4_000_000

export type PersistedIncomplete = {
  message: string
  reason?: IncompleteReason
}

export type PersistedCleoMessage = {
  activities?: ActivityItem[]
  content: string
  id: number
  images?: MessageImage[]
  incomplete?: PersistedIncomplete
  /** Opaque OpenAI encrypted reasoning for store:false multi-turn. */
  reasoningItems?: EncryptedReasoningItem[]
  role: 'assistant' | 'user'
}

export type CleoSessionSnapshot = {
  messages: PersistedCleoMessage[]
  nextId: number
  savedAt: number
  version: 1
}

function isActivityItem(value: unknown): value is ActivityItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.kind === 'string' &&
    typeof item.status === 'string'
  )
}

function isMessageImage(value: unknown): value is MessageImage {
  if (typeof value !== 'object' || value === null) return false
  const image = value as Record<string, unknown>
  if (typeof image.url !== 'string' || !image.url) return false
  if (image.id !== undefined && typeof image.id !== 'string') return false
  return true
}

function sanitizeImages(images: unknown): MessageImage[] | undefined {
  if (!Array.isArray(images)) return undefined
  const kept = images
    .filter(isMessageImage)
    .filter((image) => image.url.length <= MAX_PERSISTED_IMAGE_CHARS)
    .slice(0, 4)
  return kept.length > 0 ? kept : undefined
}

function sanitizeIncomplete(value: unknown): PersistedIncomplete | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const record = value as Record<string, unknown>
  if (typeof record.message !== 'string' || !record.message) return undefined
  const incomplete: PersistedIncomplete = {
    message: record.message.slice(0, 280),
  }
  if (
    record.reason === 'max_output_tokens' ||
    record.reason === 'content_filter' ||
    record.reason === 'other'
  ) {
    incomplete.reason = record.reason
  }
  return incomplete
}

function sanitizeMessage(value: unknown): PersistedCleoMessage | null {
  if (typeof value !== 'object' || value === null) return null
  const message = value as Record<string, unknown>
  if (typeof message.id !== 'number' || !Number.isFinite(message.id)) {
    return null
  }
  if (message.role !== 'user' && message.role !== 'assistant') {
    return null
  }
  if (typeof message.content !== 'string') {
    return null
  }

  const activities = Array.isArray(message.activities)
    ? message.activities.filter(isActivityItem).slice(0, 40)
    : undefined

  const images = sanitizeImages(message.images)
  const reasoningItems =
    message.role === 'assistant'
      ? sanitizeReasoningItems(message.reasoningItems)
      : undefined
  const incomplete =
    message.role === 'assistant'
      ? sanitizeIncomplete(message.incomplete)
      : undefined

  return {
    id: message.id,
    role: message.role,
    content: message.content.slice(0, 10_000),
    ...(activities && activities.length > 0 ? { activities } : {}),
    ...(images ? { images } : {}),
    ...(reasoningItems ? { reasoningItems } : {}),
    ...(incomplete ? { incomplete } : {}),
  }
}

export function parseCleoSession(raw: string): CleoSessionSnapshot | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const record = parsed as Record<string, unknown>
    if (record.version !== 1) return null
    if (!Array.isArray(record.messages)) return null
    if (typeof record.nextId !== 'number' || !Number.isFinite(record.nextId)) {
      return null
    }

    const messages = record.messages
      .map(sanitizeMessage)
      .filter((message): message is PersistedCleoMessage => message !== null)
      .slice(0, 50)

    return {
      version: 1,
      messages,
      nextId: Math.max(
        record.nextId,
        messages.reduce((max, message) => Math.max(max, message.id + 1), 0),
      ),
      savedAt:
        typeof record.savedAt === 'number' ? record.savedAt : Date.now(),
    }
  } catch {
    return null
  }
}

export function serializeCleoSession(
  messages: readonly PersistedCleoMessage[],
  nextId: number,
): string | null {
  const snapshot: CleoSessionSnapshot = {
    version: 1,
    messages: messages.slice(-50).map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content.slice(0, 10_000),
      ...(message.activities && message.activities.length > 0
        ? { activities: message.activities.slice(0, 40) }
        : {}),
      ...(sanitizeImages(message.images)
        ? { images: sanitizeImages(message.images) }
        : {}),
      ...(message.role === 'assistant' &&
      sanitizeReasoningItems(message.reasoningItems)
        ? { reasoningItems: sanitizeReasoningItems(message.reasoningItems) }
        : {}),
      ...(message.role === 'assistant' &&
      sanitizeIncomplete(message.incomplete)
        ? { incomplete: sanitizeIncomplete(message.incomplete) }
        : {}),
    })),
    nextId,
    savedAt: Date.now(),
  }

  const raw = JSON.stringify(snapshot)
  if (raw.length > MAX_SESSION_CHARS) {
    // Drop images, then encrypted reasoning, then truncate older turns.
    const withoutImages: CleoSessionSnapshot = {
      ...snapshot,
      messages: snapshot.messages.map(({ images: _images, ...rest }) => rest),
    }
    let trimmed = JSON.stringify(withoutImages)
    if (trimmed.length > MAX_SESSION_CHARS) {
      withoutImages.messages = withoutImages.messages.map(
        ({ reasoningItems: _reasoningItems, ...rest }) => rest,
      )
      trimmed = JSON.stringify(withoutImages)
    }
    if (trimmed.length > MAX_SESSION_CHARS) {
      withoutImages.messages = withoutImages.messages.slice(-20)
      const shorter = JSON.stringify(withoutImages)
      if (shorter.length > MAX_SESSION_CHARS) return null
      return shorter
    }
    return trimmed
  }
  return raw
}

export function loadCleoSession(): CleoSessionSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CLEO_SESSION_STORAGE_KEY)
    if (!raw) return null
    return parseCleoSession(raw)
  } catch {
    return null
  }
}

export function saveCleoSession(
  messages: readonly PersistedCleoMessage[],
  nextId: number,
): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (messages.length === 0) {
      window.localStorage.removeItem(CLEO_SESSION_STORAGE_KEY)
      return true
    }
    const raw = serializeCleoSession(messages, nextId)
    if (!raw) {
      window.localStorage.removeItem(CLEO_SESSION_STORAGE_KEY)
      return false
    }
    window.localStorage.setItem(CLEO_SESSION_STORAGE_KEY, raw)
    return true
  } catch {
    return false
  }
}

export function clearCleoSession() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CLEO_SESSION_STORAGE_KEY)
  } catch {
    // Quota / privacy mode — ignore.
  }
}
