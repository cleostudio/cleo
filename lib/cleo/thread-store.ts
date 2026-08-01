/**
 * Stage 1 local thread store (IndexedDB).
 *
 * - Thread / message ids are client UUIDs (Stage 2 Postgres PKs).
 * - Image bytes are stored as Blob, never base64 strings.
 * - Reasoning is a TTL'd expendable cache; threads load without it.
 * - Location coordinates are never written.
 * - Any IndexedDB failure degrades to ephemeral no-op persistence.
 */

import type { MessageIncomplete } from '~/lib/cleo/conversation-helpers'
import type { EncryptedReasoningItem } from '~/lib/cleo/reasoning-items'
import type { ActivityItem, MessageImage } from '~/lib/cleo/stream'
import { blobToDataUrl, dataUrlToBlob } from '~/lib/cleo/thread-image-codec'
import { threadStoreLimits } from '~/lib/cleo/thread-limits'
import { newImageId, newMessageId } from '~/lib/cleo/thread-id'
import { titleFromFirstUserMessage } from '~/lib/cleo/thread-title'

export const THREAD_DB_NAME = 'cleo-threads'
export const THREAD_DB_VERSION = 1

const STORE_THREADS = 'threads'
const STORE_MESSAGES = 'messages'
const STORE_IMAGES = 'images'
const STORE_REASONING = 'reasoning'

export type StoredThreadMeta = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  lastMessageAt: number
  byteSize: number
}

export type StoredMessageRecord = {
  id: string
  threadId: string
  seq: number
  role: 'assistant' | 'user'
  content: string
  hidden?: boolean
  incomplete?: MessageIncomplete
  activities?: ActivityItem[]
  imageIds: string[]
  createdAt: number
}

export type StoredImageRecord = {
  id: string
  threadId: string
  messageId: string
  mime: string
  bytes: number
  blob: Blob
}

export type StoredReasoningRecord = {
  messageId: string
  threadId: string
  items: EncryptedReasoningItem[]
  bytes: number
  expiresAt: number
  createdAt: number
}

/** AskForm-shaped message used at the persistence boundary. */
export type PersistableMessage = {
  activities?: ActivityItem[]
  content: string
  hidden?: boolean
  /** Session-local numeric id for React keys. */
  id: number
  images?: MessageImage[]
  incomplete?: MessageIncomplete
  reasoningItems?: EncryptedReasoningItem[]
  role: 'assistant' | 'user'
  /** Durable UUID; assigned on first persist if missing. */
  stableId?: string
}

export type LoadedThread = {
  meta: StoredThreadMeta
  messages: PersistableMessage[]
}

type ThreadStoreDriver = {
  available: boolean
  listThreads(): Promise<StoredThreadMeta[]>
  getThread(threadId: string): Promise<LoadedThread | null>
  saveThread(threadId: string, messages: PersistableMessage[]): Promise<boolean>
  renameThread(threadId: string, title: string): Promise<boolean>
  deleteThread(threadId: string): Promise<boolean>
}

function reasoningBytes(items: EncryptedReasoningItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.encrypted_content.length + item.id.length,
    0,
  )
}

function openDatabase(
  indexedDB: IDBFactory,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(THREAD_DB_NAME, THREAD_DB_VERSION)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB open failed'))
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_THREADS)) {
        db.createObjectStore(STORE_THREADS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
        const messages = db.createObjectStore(STORE_MESSAGES, { keyPath: 'id' })
        messages.createIndex('byThread', 'threadId', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        const images = db.createObjectStore(STORE_IMAGES, { keyPath: 'id' })
        images.createIndex('byThread', 'threadId', { unique: false })
        images.createIndex('byMessage', 'messageId', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_REASONING)) {
        const reasoning = db.createObjectStore(STORE_REASONING, {
          keyPath: 'messageId',
        })
        reasoning.createIndex('byThread', 'threadId', { unique: false })
        reasoning.createIndex('byExpiry', 'expiresAt', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
  })
}

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function idbTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () =>
      reject(tx.error ?? new Error('IndexedDB transaction failed'))
    tx.onabort = () =>
      reject(tx.error ?? new Error('IndexedDB transaction aborted'))
  })
}

async function readAll<T>(store: IDBObjectStore): Promise<T[]> {
  return idbRequest(store.getAll()) as Promise<T[]>
}

function createEphemeralDriver(): ThreadStoreDriver {
  return {
    available: false,
    async listThreads() {
      return []
    },
    async getThread() {
      return null
    },
    async saveThread() {
      return false
    },
    async renameThread() {
      return false
    },
    async deleteThread() {
      return false
    },
  }
}

function createIndexedDbDriver(db: IDBDatabase): ThreadStoreDriver {
  async function listThreadMetas(): Promise<StoredThreadMeta[]> {
    const tx = db.transaction(STORE_THREADS, 'readonly')
    const rows = await readAll<StoredThreadMeta>(tx.objectStore(STORE_THREADS))
    await idbTransaction(tx)
    return rows.sort((a, b) => b.lastMessageAt - a.lastMessageAt)
  }

  async function deleteThreadInternal(
    threadId: string,
    mode: IDBTransactionMode = 'readwrite',
  ): Promise<void> {
    const tx = db.transaction(
      [STORE_THREADS, STORE_MESSAGES, STORE_IMAGES, STORE_REASONING],
      mode,
    )
    const messages = tx.objectStore(STORE_MESSAGES)
    const images = tx.objectStore(STORE_IMAGES)
    const reasoning = tx.objectStore(STORE_REASONING)

    const messageRows = (await idbRequest(
      messages.index('byThread').getAll(threadId),
    )) as StoredMessageRecord[]
    for (const row of messageRows) {
      messages.delete(row.id)
      reasoning.delete(row.id)
    }

    const imageRows = (await idbRequest(
      images.index('byThread').getAll(threadId),
    )) as StoredImageRecord[]
    for (const row of imageRows) {
      images.delete(row.id)
    }

    tx.objectStore(STORE_THREADS).delete(threadId)
    await idbTransaction(tx)
  }

  async function purgeExpiredReasoning(): Promise<void> {
    const now = Date.now()
    const tx = db.transaction(STORE_REASONING, 'readwrite')
    const store = tx.objectStore(STORE_REASONING)
    const rows = await readAll<StoredReasoningRecord>(store)
    for (const row of rows) {
      if (row.expiresAt <= now) store.delete(row.messageId)
    }
    await idbTransaction(tx)
  }

  async function totalBytes(): Promise<number> {
    const threads = await listThreadMetas()
    return threads.reduce((sum, thread) => sum + thread.byteSize, 0)
  }

  async function evictOldestUntilFit(requiredFree: number): Promise<void> {
    await purgeExpiredReasoning()
    let used = await totalBytes()
    if (used + requiredFree <= threadStoreLimits.maxTotalBytes) return

    const threads = await listThreadMetas()
    // Oldest first.
    const oldestFirst = [...threads].sort(
      (a, b) => a.lastMessageAt - b.lastMessageAt,
    )
    for (const thread of oldestFirst) {
      if (used + requiredFree <= threadStoreLimits.maxTotalBytes) break
      await deleteThreadInternal(thread.id)
      used -= thread.byteSize
    }
  }

  return {
    available: true,

    async listThreads() {
      return listThreadMetas()
    },

    async getThread(threadId) {
      const tx = db.transaction(
        [STORE_THREADS, STORE_MESSAGES, STORE_IMAGES, STORE_REASONING],
        'readonly',
      )
      const meta = (await idbRequest(
        tx.objectStore(STORE_THREADS).get(threadId),
      )) as StoredThreadMeta | undefined
      if (!meta) {
        await idbTransaction(tx)
        return null
      }

      const messageRows = (
        (await idbRequest(
          tx.objectStore(STORE_MESSAGES).index('byThread').getAll(threadId),
        )) as StoredMessageRecord[]
      ).sort((a, b) => a.seq - b.seq)

      const imageRows = (await idbRequest(
        tx.objectStore(STORE_IMAGES).index('byThread').getAll(threadId),
      )) as StoredImageRecord[]
      const imagesById = new Map(imageRows.map((row) => [row.id, row]))

      const reasoningRows = (await idbRequest(
        tx.objectStore(STORE_REASONING).index('byThread').getAll(threadId),
      )) as StoredReasoningRecord[]
      const now = Date.now()
      const reasoningByMessage = new Map(
        reasoningRows
          .filter((row) => row.expiresAt > now)
          .map((row) => [row.messageId, row]),
      )

      await idbTransaction(tx)

      const messages: PersistableMessage[] = []
      for (const [index, row] of messageRows.entries()) {
        const images: MessageImage[] = []
        for (const imageId of row.imageIds) {
          const stored = imagesById.get(imageId)
          if (!stored?.blob) continue
          try {
            // fake-indexeddb / some runtimes may revive Blob-like objects that
            // are not instanceof Blob — normalize before decoding.
            const blob =
              stored.blob instanceof Blob
                ? stored.blob
                : new Blob([stored.blob as BlobPart], {
                    type: stored.mime || 'application/octet-stream',
                  })
            images.push({
              id: stored.id,
              url: await blobToDataUrl(blob),
            })
          } catch {
            // Skip undecodable blobs; transcript text still loads.
          }
        }

        const reasoning = reasoningByMessage.get(row.id)
        messages.push({
          id: index,
          stableId: row.id,
          role: row.role,
          content: row.content,
          ...(row.hidden ? { hidden: true } : {}),
          ...(row.incomplete ? { incomplete: row.incomplete } : {}),
          ...(row.activities && row.activities.length > 0
            ? { activities: row.activities }
            : {}),
          ...(images.length > 0 ? { images } : {}),
          ...(reasoning ? { reasoningItems: reasoning.items } : {}),
        })
      }

      return { meta, messages }
    },

    async saveThread(threadId, messages) {
      const visibleFirstUser = messages.find(
        (message) =>
          message.role === 'user' &&
          !message.hidden &&
          message.content.trim(),
      )
      const title = titleFromFirstUserMessage(visibleFirstUser?.content ?? '')
      const now = Date.now()

      type PreparedMessage = {
        record: StoredMessageRecord
        images: StoredImageRecord[]
        reasoning: StoredReasoningRecord | null
        runtimeStableId: string
      }

      const prepared: PreparedMessage[] = []
      let threadBytes = 0

      for (const [seq, message] of messages.entries()) {
        const stableId = message.stableId ?? newMessageId()
        const imageIds: string[] = []
        const images: StoredImageRecord[] = []

        for (const image of message.images ?? []) {
          if (!image.url) continue
          try {
            const { blob, mime, bytes } = await dataUrlToBlob(image.url)
            const id = image.id && image.id.length > 0 ? image.id : newImageId()
            imageIds.push(id)
            images.push({
              id,
              threadId,
              messageId: stableId,
              mime,
              bytes,
              blob,
            })
            threadBytes += bytes
          } catch {
            // Drop images that cannot be encoded; keep the rest of the turn.
          }
        }

        const contentBytes = new TextEncoder().encode(message.content).length
        threadBytes += contentBytes

        let reasoning: StoredReasoningRecord | null = null
        if (
          message.role === 'assistant' &&
          message.reasoningItems &&
          message.reasoningItems.length > 0
        ) {
          const bytes = reasoningBytes(message.reasoningItems)
          if (bytes <= threadStoreLimits.maxReasoningBytesPerThread) {
            reasoning = {
              messageId: stableId,
              threadId,
              items: message.reasoningItems,
              bytes,
              createdAt: now,
              expiresAt: now + threadStoreLimits.reasoningTtlMs,
            }
            threadBytes += bytes
          }
        }

        const activitiesJson = message.activities
          ? JSON.stringify(message.activities).length
          : 0
        threadBytes += activitiesJson

        prepared.push({
          runtimeStableId: stableId,
          images,
          reasoning,
          record: {
            id: stableId,
            threadId,
            seq,
            role: message.role,
            content: message.content,
            imageIds,
            createdAt: now,
            ...(message.hidden ? { hidden: true } : {}),
            ...(message.incomplete ? { incomplete: message.incomplete } : {}),
            ...(message.activities && message.activities.length > 0
              ? { activities: message.activities }
              : {}),
          },
        })
      }

      // If a single thread exceeds the per-thread cap, drop reasoning then
      // oldest images until it fits — never drop message text.
      if (threadBytes > threadStoreLimits.maxThreadBytes) {
        for (const item of prepared) {
          if (threadBytes <= threadStoreLimits.maxThreadBytes) break
          if (item.reasoning) {
            threadBytes -= item.reasoning.bytes
            item.reasoning = null
          }
        }
        const imageQueue = prepared.flatMap((item) =>
          item.images.map((image) => ({ item, image })),
        )
        for (const entry of imageQueue) {
          if (threadBytes <= threadStoreLimits.maxThreadBytes) break
          threadBytes -= entry.image.bytes
          entry.item.images = entry.item.images.filter(
            (image) => image.id !== entry.image.id,
          )
          entry.item.record.imageIds = entry.item.record.imageIds.filter(
            (id) => id !== entry.image.id,
          )
        }
      }

      await evictOldestUntilFit(threadBytes)

      const existingList = await listThreadMetas()
      const prior = existingList.find((thread) => thread.id === threadId)
      // Keep a manual rename; refresh the auto title while it is still default.
      const nextTitle =
        prior && prior.title !== 'New conversation' ? prior.title : title
      const meta: StoredThreadMeta = {
        id: threadId,
        title: nextTitle,
        createdAt: prior?.createdAt ?? now,
        updatedAt: now,
        lastMessageAt: now,
        byteSize: threadBytes,
      }

      // Replace prior rows for this thread.
      await deleteThreadInternal(threadId)

      const tx = db.transaction(
        [STORE_THREADS, STORE_MESSAGES, STORE_IMAGES, STORE_REASONING],
        'readwrite',
      )
      tx.objectStore(STORE_THREADS).put(meta)
      for (const item of prepared) {
        tx.objectStore(STORE_MESSAGES).put(item.record)
        for (const image of item.images) {
          tx.objectStore(STORE_IMAGES).put(image)
        }
        if (item.reasoning) {
          tx.objectStore(STORE_REASONING).put(item.reasoning)
        }
      }
      await idbTransaction(tx)

      // Stamp stable ids back onto the runtime messages for subsequent saves.
      for (const [index, message] of messages.entries()) {
        message.stableId = prepared[index]?.runtimeStableId ?? message.stableId
        const imageIds = prepared[index]?.record.imageIds ?? []
        if (message.images) {
          message.images = message.images.map((image, imageIndex) => ({
            ...image,
            id: imageIds[imageIndex] ?? image.id,
          }))
        }
      }

      // Final pass: if we are still over the global cap (e.g. this thread alone
      // is huge), evict other oldest threads — never delete the one we just saved
      // unless it is the only offender and still over after image drops.
      await evictOldestUntilFit(0)
      const used = await totalBytes()
      if (used > threadStoreLimits.maxTotalBytes) {
        const threads = await listThreadMetas()
        for (const thread of [...threads].sort(
          (a, b) => a.lastMessageAt - b.lastMessageAt,
        )) {
          if (thread.id === threadId) continue
          if ((await totalBytes()) <= threadStoreLimits.maxTotalBytes) break
          await deleteThreadInternal(thread.id)
        }
      }

      return true
    },

    async renameThread(threadId, title) {
      const trimmed = title.replace(/\s+/g, ' ').trim()
      if (!trimmed) return false
      const tx = db.transaction(STORE_THREADS, 'readwrite')
      const store = tx.objectStore(STORE_THREADS)
      const meta = (await idbRequest(store.get(threadId))) as
        | StoredThreadMeta
        | undefined
      if (!meta) {
        await idbTransaction(tx)
        return false
      }
      store.put({
        ...meta,
        title: trimmed.slice(0, 120),
        updatedAt: Date.now(),
      })
      await idbTransaction(tx)
      return true
    },

    async deleteThread(threadId) {
      await deleteThreadInternal(threadId)
      return true
    },
  }
}

let driverPromise: Promise<ThreadStoreDriver> | null = null

export function resetThreadStoreForTests() {
  driverPromise = null
}

export async function getThreadStore(
  factory: IDBFactory | null | undefined = typeof indexedDB === 'undefined'
    ? null
    : indexedDB,
): Promise<ThreadStoreDriver> {
  if (!factory) return createEphemeralDriver()

  if (!driverPromise) {
    driverPromise = openDatabase(factory)
      .then((db) => createIndexedDbDriver(db))
      .catch(() => createEphemeralDriver())
  }

  try {
    return await driverPromise
  } catch {
    driverPromise = null
    return createEphemeralDriver()
  }
}

export async function listThreads() {
  const store = await getThreadStore()
  try {
    return await store.listThreads()
  } catch {
    return []
  }
}

export async function loadThread(threadId: string) {
  const store = await getThreadStore()
  try {
    return await store.getThread(threadId)
  } catch {
    return null
  }
}

export async function saveThread(
  threadId: string,
  messages: PersistableMessage[],
) {
  const store = await getThreadStore()
  try {
    return await store.saveThread(threadId, messages)
  } catch {
    return false
  }
}

export async function renameThread(threadId: string, title: string) {
  const store = await getThreadStore()
  try {
    return await store.renameThread(threadId, title)
  } catch {
    return false
  }
}

export async function deleteThread(threadId: string) {
  const store = await getThreadStore()
  try {
    return await store.deleteThread(threadId)
  } catch {
    return false
  }
}

export function isThreadStoreAvailable() {
  return getThreadStore().then((store) => store.available)
}

/** Test helper: build a driver against an explicit IDB factory (or null). */
export async function createThreadStoreForTests(
  factory: IDBFactory | null,
): Promise<ThreadStoreDriver & { close?: () => void }> {
  if (!factory) return createEphemeralDriver()
  try {
    const db = await openDatabase(factory)
    return {
      ...createIndexedDbDriver(db),
      close: () => db.close(),
    }
  } catch {
    return createEphemeralDriver()
  }
}
