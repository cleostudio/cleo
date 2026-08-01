// @vitest-environment jsdom

import 'fake-indexeddb/auto'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { resetThreadStoreLimitsForTests, threadStoreLimits } from './thread-limits'
import { newThreadId } from './thread-id'
import {
  THREAD_DB_NAME,
  createThreadStoreForTests,
  resetThreadStoreForTests,
  type PersistableMessage,
} from './thread-store'

function textMessage(
  role: 'user' | 'assistant',
  content: string,
  extras: Partial<PersistableMessage> = {},
): PersistableMessage {
  return {
    id: extras.id ?? 0,
    role,
    content,
    stableId: extras.stableId ?? crypto.randomUUID(),
    ...extras,
  }
}

function largeDataUrl(bytes: number): string {
  const raw = new Uint8Array(bytes)
  raw.fill(7)
  let binary = ''
  for (let i = 0; i < raw.length; i += 1) binary += String.fromCharCode(raw[i]!)
  return `data:application/octet-stream;base64,${btoa(binary)}`
}

let openStores: Array<{ close?: () => void }> = []

async function deleteDb() {
  for (const store of openStores) store.close?.()
  openStores = []
  resetThreadStoreForTests()
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(THREAD_DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => resolve()
  })
}

async function openStore() {
  const store = await createThreadStoreForTests(indexedDB)
  openStores.push(store)
  return store
}

beforeEach(async () => {
  resetThreadStoreLimitsForTests()
  await deleteDb()
})

afterEach(async () => {
  resetThreadStoreLimitsForTests()
  await deleteDb()
})

describe('thread store (IndexedDB)', () => {
  it('creates, resumes, renames, and deletes a thread with client UUIDs', async () => {
    const store = await openStore()
    expect(store.available).toBe(true)

    const threadId = newThreadId()
    const saved = await store.saveThread(threadId, [
      textMessage('user', 'What is the ISS?', { id: 0 }),
      textMessage('assistant', 'A laboratory in orbit.', { id: 1 }),
    ])
    expect(saved).toBe(true)

    const listed = await store.listThreads()
    expect(listed).toHaveLength(1)
    expect(listed[0]?.id).toBe(threadId)
    expect(listed[0]?.title).toBe('What is the ISS?')

    const loaded = await store.getThread(threadId)
    expect(loaded?.messages).toHaveLength(2)
    expect(loaded?.messages[0]?.stableId).toMatch(/^[0-9a-f-]{36}$/i)
    expect(loaded?.messages[0]?.content).toBe('What is the ISS?')
    expect(loaded?.messages[1]?.content).toBe('A laboratory in orbit.')

    await store.renameThread(threadId, 'Orbital lab')
    expect((await store.getThread(threadId))?.meta.title).toBe('Orbital lab')

    await store.saveThread(threadId, [
      textMessage('user', 'What is the ISS?', { id: 0 }),
      textMessage('assistant', 'A laboratory in orbit.', { id: 1 }),
      textMessage('user', 'How high?', { id: 2 }),
    ])
    expect((await store.getThread(threadId))?.meta.title).toBe('Orbital lab')

    await store.deleteThread(threadId)
    expect(await store.listThreads()).toHaveLength(0)
    expect(await store.getThread(threadId)).toBeNull()
  })

  it('stores image payloads as Blobs and restores data URLs', async () => {
    const store = await openStore()
    const threadId = newThreadId()
    const url = largeDataUrl(2_048)

    const ok = await store.saveThread(threadId, [
      textMessage('user', 'Describe this', {
        id: 0,
        images: [{ id: 'img-1', url }],
      }),
      textMessage('assistant', 'A pattern.', { id: 1 }),
    ])
    expect(ok).toBe(true)

    const loaded = await store.getThread(threadId)
    expect(loaded?.meta.byteSize).toBeGreaterThan(2_000)
    expect(loaded?.messages[0]?.images?.length).toBe(1)
    expect(loaded?.messages[0]?.images?.[0]?.url.startsWith('data:')).toBe(true)
    expect(loaded?.messages[0]?.images?.[0]?.id).toBeTruthy()
  })

  it('treats reasoning as optional cache with TTL', async () => {
    const store = await openStore()
    const threadId = newThreadId()

    await store.saveThread(threadId, [
      textMessage('user', 'Continue later', { id: 0 }),
      textMessage('assistant', 'Partial answer', {
        id: 1,
        reasoningItems: [
          {
            type: 'reasoning',
            id: 'rs_1',
            encrypted_content: 'enc-payload',
          },
        ],
      }),
    ])

    const withReasoning = await store.getThread(threadId)
    expect(withReasoning?.messages[1]?.reasoningItems?.[0]?.id).toBe('rs_1')

    const messageId = withReasoning!.messages[1]!.stableId!
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(THREAD_DB_NAME, 1)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('reasoning', 'readwrite')
      const getReq = tx.objectStore('reasoning').get(messageId)
      getReq.onsuccess = () => {
        const row = getReq.result
        tx.objectStore('reasoning').put({ ...row, expiresAt: Date.now() - 1 })
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()

    const withoutReasoning = await store.getThread(threadId)
    expect(withoutReasoning?.messages[1]?.content).toBe('Partial answer')
    expect(withoutReasoning?.messages[1]?.reasoningItems).toBeUndefined()
  })

  it('evicts oldest threads when the total byte cap is exceeded', async () => {
    threadStoreLimits.maxTotalBytes = 20_000
    threadStoreLimits.maxThreadBytes = 12_000

    const store = await openStore()
    const ids = [newThreadId(), newThreadId(), newThreadId()]

    for (const [index, threadId] of ids.entries()) {
      await store.saveThread(threadId, [
        textMessage('user', `Photo set ${index}`, {
          id: 0,
          images: [{ url: largeDataUrl(8_000) }],
        }),
        textMessage('assistant', 'Noted.', { id: 1 }),
      ])
    }

    const listed = await store.listThreads()
    const total = listed.reduce((sum, thread) => sum + thread.byteSize, 0)
    expect(total).toBeLessThanOrEqual(threadStoreLimits.maxTotalBytes)
    expect(listed.some((thread) => thread.id === ids[0])).toBe(false)
    expect(listed.some((thread) => thread.id === ids[2])).toBe(true)
  })

  it('falls back to ephemeral no-ops when IndexedDB is unavailable', async () => {
    const store = await createThreadStoreForTests(null)
    expect(store.available).toBe(false)

    const threadId = newThreadId()
    expect(
      await store.saveThread(threadId, [
        textMessage('user', 'Hello', { id: 0 }),
      ]),
    ).toBe(false)
    expect(await store.listThreads()).toEqual([])
    expect(await store.getThread(threadId)).toBeNull()
    expect(await store.renameThread(threadId, 'X')).toBe(false)
    expect(await store.deleteThread(threadId)).toBe(false)
  })
})
