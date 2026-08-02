/**
 * Browser-only Cleo chat threads (localStorage). No server sync — same privacy
 * boundary as guest Location preference.
 */

import type { MessageIncomplete } from "~/lib/cleo/conversation-helpers"
import type { EncryptedReasoningItem } from "~/lib/cleo/reasoning-items"
import type { ActivityItem, MessageImage } from "~/lib/cleo/stream"

export const CLEO_THREADS_STORAGE_KEY = "cleo-threads"
export const CLEO_THREADS_VERSION = 1 as const
/** Hard cap so localStorage stays usable across long-lived browsers. */
export const MAX_CLEO_THREADS = 40
const MAX_TITLE_LENGTH = 72

export type CleoThreadMessage = {
  activities?: ActivityItem[]
  content: string
  hidden?: boolean
  id: number
  images?: MessageImage[]
  incomplete?: MessageIncomplete
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

export type CleoThread = {
  createdAt: number
  id: string
  messages: CleoThreadMessage[]
  /** Next numeric message id for this thread (AskForm messageIdRef). */
  nextMessageId: number
  title: string
  updatedAt: number
}

export type CleoThreadsStore = {
  activeThreadId: string | null
  threads: CleoThread[]
  version: typeof CLEO_THREADS_VERSION
}

export type CleoThreadSummary = {
  createdAt: number
  id: string
  title: string
  updatedAt: number
}

const CLEO_THREADS_CHANGE_EVENT = "cleo-threads-change"

function canUseStorage() {
  return typeof window !== "undefined"
}

function emptyStore(): CleoThreadsStore {
  return {
    version: CLEO_THREADS_VERSION,
    activeThreadId: null,
    threads: [],
  }
}

export function createThreadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `cleo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Title from the first visible user text; image-only turns get a fallback. */
export function titleFromMessages(
  messages: readonly CleoThreadMessage[],
): string {
  for (const message of messages) {
    if (message.role !== "user" || message.hidden) continue
    const text = message.content.trim().replace(/\s+/g, " ")
    if (text) {
      if (text.length <= MAX_TITLE_LENGTH) return text
      return `${text.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`
    }
    if (message.images && message.images.length > 0) {
      return "Image chat"
    }
  }
  return "New chat"
}

/**
 * Drop oversized data-URL attachments before persist. Curated topic paths and
 * https URLs stay; encrypted reasoning stays (needed for multi-turn replay).
 */
export function sanitizeMessagesForStorage(
  messages: readonly CleoThreadMessage[],
): CleoThreadMessage[] {
  return messages.map((message) => {
    if (!message.images || message.images.length === 0) {
      return { ...message }
    }

    const images = message.images.filter((image) => {
      const url = image.url
      if (!url) return false
      if (url.startsWith("data:")) return false
      return true
    })

    if (images.length === 0) {
      const { images: _drop, ...rest } = message
      return { ...rest }
    }

    return { ...message, images }
  })
}

function isRole(value: unknown): value is CleoThreadMessage["role"] {
  return value === "assistant" || value === "user"
}

function parseMessage(value: unknown): CleoThreadMessage | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>
  if (typeof record.id !== "number" || !Number.isFinite(record.id)) return null
  if (!isRole(record.role)) return null
  if (typeof record.content !== "string") return null

  const message: CleoThreadMessage = {
    id: record.id,
    role: record.role,
    content: record.content,
  }

  if (record.hidden === true) message.hidden = true
  if (Array.isArray(record.images)) {
    const images = record.images.filter(
      (image): image is MessageImage =>
        typeof image === "object" &&
        image !== null &&
        typeof (image as MessageImage).url === "string" &&
        Boolean((image as MessageImage).url),
    )
    if (images.length > 0) message.images = images
  }
  if (Array.isArray(record.activities)) {
    message.activities = record.activities as ActivityItem[]
  }
  if (Array.isArray(record.reasoningItems)) {
    message.reasoningItems = record.reasoningItems as EncryptedReasoningItem[]
  }
  if (
    typeof record.incomplete === "object" &&
    record.incomplete !== null &&
    typeof (record.incomplete as MessageIncomplete).message === "string"
  ) {
    message.incomplete = record.incomplete as MessageIncomplete
  }

  return message
}

function parseThread(value: unknown): CleoThread | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>
  if (typeof record.id !== "string" || !record.id) return null
  if (typeof record.title !== "string") return null
  if (typeof record.createdAt !== "number") return null
  if (typeof record.updatedAt !== "number") return null
  if (typeof record.nextMessageId !== "number") return null
  if (!Array.isArray(record.messages)) return null

  const messages = record.messages
    .map(parseMessage)
    .filter((message): message is CleoThreadMessage => message !== null)

  return {
    id: record.id,
    title: record.title || "New chat",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    nextMessageId: Math.max(0, Math.floor(record.nextMessageId)),
    messages,
  }
}

export function parseThreadsStore(raw: string | null): CleoThreadsStore {
  if (!raw) return emptyStore()

  try {
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== "object" || parsed === null) return emptyStore()
    const record = parsed as Record<string, unknown>
    if (record.version !== CLEO_THREADS_VERSION) return emptyStore()
    if (!Array.isArray(record.threads)) return emptyStore()

    const threads = record.threads
      .map(parseThread)
      .filter((thread): thread is CleoThread => thread !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CLEO_THREADS)

    const activeThreadId =
      typeof record.activeThreadId === "string" &&
      threads.some((thread) => thread.id === record.activeThreadId)
        ? record.activeThreadId
        : (threads[0]?.id ?? null)

    return {
      version: CLEO_THREADS_VERSION,
      activeThreadId,
      threads,
    }
  } catch {
    return emptyStore()
  }
}

export function readThreadsStore(): CleoThreadsStore {
  if (!canUseStorage()) return emptyStore()

  try {
    return parseThreadsStore(
      window.localStorage.getItem(CLEO_THREADS_STORAGE_KEY),
    )
  } catch {
    return emptyStore()
  }
}

function writeThreadsStore(store: CleoThreadsStore) {
  if (!canUseStorage()) return

  const payload: CleoThreadsStore = {
    version: CLEO_THREADS_VERSION,
    activeThreadId: store.activeThreadId,
    threads: store.threads
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_CLEO_THREADS)
      .map((thread) => ({
        ...thread,
        messages: sanitizeMessagesForStorage(thread.messages),
      })),
  }

  try {
    window.localStorage.setItem(
      CLEO_THREADS_STORAGE_KEY,
      JSON.stringify(payload),
    )
  } catch {
    // Quota or private mode — keep in-memory UI working.
    return
  }

  window.dispatchEvent(new Event(CLEO_THREADS_CHANGE_EVENT))
}

export function listThreadSummaries(
  store: CleoThreadsStore = readThreadsStore(),
): CleoThreadSummary[] {
  return store.threads.map(({ id, title, createdAt, updatedAt }) => ({
    id,
    title,
    createdAt,
    updatedAt,
  }))
}

export function getThread(
  threadId: string,
  store: CleoThreadsStore = readThreadsStore(),
): CleoThread | null {
  return store.threads.find((thread) => thread.id === threadId) ?? null
}

/** Persist a thread with messages; empty drafts are dropped from the list. */
export function upsertThread(input: {
  active?: boolean
  createdAt?: number
  id: string
  messages: readonly CleoThreadMessage[]
  nextMessageId: number
  title?: string
}): CleoThreadsStore {
  const store = readThreadsStore()
  const now = Date.now()
  const existing = store.threads.find((thread) => thread.id === input.id)
  const hasVisible = input.messages.some(
    (message) =>
      !message.hidden &&
      (Boolean(message.content.trim()) ||
        Boolean(message.images?.length) ||
        Boolean(message.activities?.length) ||
        Boolean(message.incomplete)),
  )

  if (!hasVisible) {
    const threads = store.threads.filter((thread) => thread.id !== input.id)
    const next: CleoThreadsStore = {
      version: CLEO_THREADS_VERSION,
      activeThreadId:
        input.active === false
          ? store.activeThreadId === input.id
            ? (threads[0]?.id ?? null)
            : store.activeThreadId
          : null,
      threads,
    }
    writeThreadsStore(next)
    return next
  }

  const thread: CleoThread = {
    id: input.id,
    title: input.title ?? titleFromMessages(input.messages),
    createdAt: existing?.createdAt ?? input.createdAt ?? now,
    updatedAt: now,
    nextMessageId: input.nextMessageId,
    messages: sanitizeMessagesForStorage(input.messages),
  }

  const threads = [
    thread,
    ...store.threads.filter((item) => item.id !== input.id),
  ]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_CLEO_THREADS)

  const next: CleoThreadsStore = {
    version: CLEO_THREADS_VERSION,
    activeThreadId: input.active === false ? store.activeThreadId : input.id,
    threads,
  }
  writeThreadsStore(next)
  return next
}

export function setActiveThreadId(threadId: string | null): CleoThreadsStore {
  const store = readThreadsStore()
  const activeThreadId =
    threadId && store.threads.some((thread) => thread.id === threadId)
      ? threadId
      : threadId === null
        ? null
        : store.activeThreadId

  const next: CleoThreadsStore = {
    ...store,
    activeThreadId,
  }
  writeThreadsStore(next)
  return next
}

export function deleteThread(threadId: string): CleoThreadsStore {
  const store = readThreadsStore()
  const threads = store.threads.filter((thread) => thread.id !== threadId)
  const next: CleoThreadsStore = {
    version: CLEO_THREADS_VERSION,
    activeThreadId:
      store.activeThreadId === threadId
        ? (threads[0]?.id ?? null)
        : store.activeThreadId,
    threads,
  }
  writeThreadsStore(next)
  return next
}

/** Subscribe to same-tab writes and cross-tab storage events. */
export function subscribeToThreads(onChange: () => void) {
  if (!canUseStorage()) return () => undefined

  const onStorage = (event: StorageEvent) => {
    if (event.key === CLEO_THREADS_STORAGE_KEY || event.key === null) {
      onChange()
    }
  }

  window.addEventListener(CLEO_THREADS_CHANGE_EVENT, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(CLEO_THREADS_CHANGE_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
  }
}
