/**
 * Browser-only Cleo conversation persistence (sessionStorage).
 *
 * Survives reload and same-tab navigation; clears when the tab closes or the
 * user starts a new chat. Images may push past the storage quota — saves then
 * retry without image payloads before giving up.
 */

import { parseImageDataUrl } from '~/lib/cleo/images'
import type { ActivityItem, MessageImage } from '~/lib/cleo/stream'

export const CLEO_SESSION_STORAGE_KEY = 'cleo:chat-v1'
export const CLEO_SESSION_VERSION = 1 as const

/** Match the API conversation cap so restored threads stay submit-ready. */
export const CLEO_SESSION_MAX_MESSAGES = 50

export type PersistedCleoMessage = {
  activities?: ActivityItem[]
  content: string
  id: number
  images?: MessageImage[]
  role: 'assistant' | 'user'
}

export type CleoSessionSnapshot = {
  messages: PersistedCleoMessage[]
  nextMessageId: number
  v: typeof CLEO_SESSION_VERSION
}

const ACTIVITY_STATUSES = new Set([
  'in_progress',
  'searching',
  'generating',
  'completed',
  'failed',
])

const ACTIVITY_KINDS = new Set([
  'web_search',
  'reasoning',
  'image_generation',
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePersistedImage(value: unknown): MessageImage | null {
  if (!isPlainObject(value) || typeof value.url !== 'string') {
    return null
  }

  if (!parseImageDataUrl(value.url)) {
    return null
  }

  const image: MessageImage = { url: value.url }

  if (value.id !== undefined) {
    if (typeof value.id !== 'string' || !value.id.trim()) {
      return null
    }
    image.id = value.id.trim()
  }

  return image
}

function parsePersistedActivity(value: unknown): ActivityItem | null {
  if (!isPlainObject(value)) {
    return null
  }

  if (
    typeof value.id !== 'string' ||
    !value.id ||
    typeof value.kind !== 'string' ||
    !ACTIVITY_KINDS.has(value.kind) ||
    typeof value.status !== 'string' ||
    !ACTIVITY_STATUSES.has(value.status)
  ) {
    return null
  }

  const activity: ActivityItem = {
    id: value.id,
    kind: value.kind as ActivityItem['kind'],
    status: value.status as ActivityItem['status'],
  }

  if (value.summary !== undefined) {
    if (typeof value.summary !== 'string') {
      return null
    }
    activity.summary = value.summary
  }

  if (value.action !== undefined) {
    if (!isPlainObject(value.action)) {
      return null
    }
    activity.action = value.action as ActivityItem['action']
  }

  // Mid-stream statuses become terminal so a restored panel does not look live.
  if (
    activity.status === 'in_progress' ||
    activity.status === 'searching' ||
    activity.status === 'generating'
  ) {
    activity.status = 'completed'
  }

  return activity
}

function parsePersistedMessage(value: unknown): PersistedCleoMessage | null {
  if (!isPlainObject(value)) {
    return null
  }

  if (
    typeof value.id !== 'number' ||
    !Number.isInteger(value.id) ||
    value.id < 0 ||
    (value.role !== 'user' && value.role !== 'assistant') ||
    typeof value.content !== 'string'
  ) {
    return null
  }

  const message: PersistedCleoMessage = {
    id: value.id,
    role: value.role,
    content: value.content,
  }

  if (value.images !== undefined) {
    if (!Array.isArray(value.images)) {
      return null
    }
    const images: MessageImage[] = []
    for (const item of value.images) {
      const parsed = parsePersistedImage(item)
      if (!parsed) {
        return null
      }
      images.push(parsed)
    }
    if (images.length > 0) {
      message.images = images
    }
  }

  if (value.activities !== undefined) {
    if (!Array.isArray(value.activities)) {
      return null
    }
    const activities: ActivityItem[] = []
    for (const item of value.activities) {
      const parsed = parsePersistedActivity(item)
      if (!parsed) {
        return null
      }
      activities.push(parsed)
    }
    if (activities.length > 0) {
      message.activities = activities
    }
  }

  const hasVisibleContent =
    Boolean(message.content.trim()) ||
    Boolean(message.images?.length) ||
    Boolean(message.activities?.length)

  if (!hasVisibleContent) {
    return null
  }

  return message
}

/** Validate and normalize a parsed JSON payload into a session snapshot. */
export function parseCleoSession(value: unknown): CleoSessionSnapshot | null {
  if (!isPlainObject(value) || value.v !== CLEO_SESSION_VERSION) {
    return null
  }

  if (!Array.isArray(value.messages) || value.messages.length === 0) {
    return null
  }

  if (value.messages.length > CLEO_SESSION_MAX_MESSAGES) {
    return null
  }

  if (
    typeof value.nextMessageId !== 'number' ||
    !Number.isInteger(value.nextMessageId) ||
    value.nextMessageId < 0
  ) {
    return null
  }

  const messages: PersistedCleoMessage[] = []
  let maxId = -1

  for (const item of value.messages) {
    const message = parsePersistedMessage(item)
    if (!message) {
      return null
    }
    maxId = Math.max(maxId, message.id)
    messages.push(message)
  }

  const nextMessageId = Math.max(value.nextMessageId, maxId + 1)

  return {
    v: CLEO_SESSION_VERSION,
    messages,
    nextMessageId,
  }
}

function stripImages(
  messages: readonly PersistedCleoMessage[],
): PersistedCleoMessage[] {
  return messages.map(({ images: _images, ...rest }) => rest)
}

function buildSnapshot(
  messages: readonly PersistedCleoMessage[],
  nextMessageId: number,
  includeImages: boolean,
): CleoSessionSnapshot {
  const visible = messages
    .filter(
      (message) =>
        Boolean(message.content.trim()) ||
        Boolean(message.images?.length) ||
        Boolean(message.activities?.length),
    )
    .slice(-CLEO_SESSION_MAX_MESSAGES)

  return {
    v: CLEO_SESSION_VERSION,
    messages: includeImages ? [...visible] : stripImages(visible),
    nextMessageId: Math.max(0, nextMessageId),
  }
}

function writeSnapshot(snapshot: CleoSessionSnapshot): void {
  sessionStorage.setItem(CLEO_SESSION_STORAGE_KEY, JSON.stringify(snapshot))
}

/** Read the active tab's Cleo conversation, or null when missing/invalid. */
export function loadCleoSession(): CleoSessionSnapshot | null {
  try {
    const raw = sessionStorage.getItem(CLEO_SESSION_STORAGE_KEY)
    if (!raw) {
      return null
    }
    return parseCleoSession(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

/**
 * Persist the conversation. Returns false when storage is unavailable or the
 * payload will not fit (even after dropping images).
 */
export function saveCleoSession(
  messages: readonly PersistedCleoMessage[],
  nextMessageId: number,
): boolean {
  const full = buildSnapshot(messages, nextMessageId, true)

  if (full.messages.length === 0) {
    clearCleoSession()
    return true
  }

  try {
    writeSnapshot(full)
    return true
  } catch (error) {
    const isQuota =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')

    if (!isQuota) {
      return false
    }
  }

  try {
    writeSnapshot(buildSnapshot(messages, nextMessageId, false))
    return true
  } catch {
    try {
      clearCleoSession()
    } catch {
      /* private mode */
    }
    return false
  }
}

export function clearCleoSession(): void {
  try {
    sessionStorage.removeItem(CLEO_SESSION_STORAGE_KEY)
  } catch {
    /* private mode */
  }
}
