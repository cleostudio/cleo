// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CLEO_THREADS_STORAGE_KEY,
  createThreadId,
  deleteThread,
  getThread,
  listThreadSummaries,
  parseThreadsStore,
  readThreadsStore,
  sanitizeMessagesForStorage,
  setActiveThreadId,
  subscribeToThreads,
  titleFromMessages,
  upsertThread,
  type CleoThreadMessage,
} from './threads'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

function userMessage(
  id: number,
  content: string,
  extras?: Partial<CleoThreadMessage>,
): CleoThreadMessage {
  return { id, role: 'user', content, ...extras }
}

describe('cleo threads store', () => {
  it('titles a thread from the first visible user message', () => {
    expect(
      titleFromMessages([
        userMessage(1, '  What is Mars like?  '),
        { id: 2, role: 'assistant', content: 'Dusty.' },
      ]),
    ).toBe('What is Mars like?')
  })

  it('falls back when the first turn is image-only', () => {
    expect(
      titleFromMessages([
        userMessage(1, '', {
          images: [{ url: '/images/atlas/jp/hero.jpg' }],
        }),
      ]),
    ).toBe('Image chat')
  })

  it('strips data-URL images before persist but keeps curated paths', () => {
    const sanitized = sanitizeMessagesForStorage([
      userMessage(1, 'Look', {
        images: [
          { url: 'data:image/png;base64,aaaa' },
          { url: '/images/space/mars/a.jpg' },
        ],
      }),
    ])

    expect(sanitized[0]?.images).toEqual([{ url: '/images/space/mars/a.jpg' }])
  })

  it('persists and restores a thread as the active chat', () => {
    const id = createThreadId()
    upsertThread({
      id,
      nextMessageId: 3,
      messages: [
        userMessage(1, 'Tell me about Japan'),
        { id: 2, role: 'assistant', content: 'An archipelago…' },
      ],
    })

    const store = readThreadsStore()
    expect(store.activeThreadId).toBe(id)
    expect(listThreadSummaries(store)[0]).toMatchObject({
      id,
      title: 'Tell me about Japan',
    })
    expect(getThread(id, store)?.messages).toHaveLength(2)
  })

  it('drops empty drafts from the list', () => {
    const id = createThreadId()
    upsertThread({
      id,
      nextMessageId: 0,
      messages: [],
    })

    expect(readThreadsStore().threads).toEqual([])
    expect(readThreadsStore().activeThreadId).toBeNull()
  })

  it('deletes a thread and clears active when it was selected', () => {
    const a = createThreadId()
    const b = createThreadId()
    upsertThread({
      id: a,
      nextMessageId: 2,
      messages: [userMessage(1, 'Alpha')],
    })
    upsertThread({
      id: b,
      nextMessageId: 2,
      messages: [userMessage(1, 'Beta')],
    })

    const store = deleteThread(b)
    expect(store.activeThreadId).toBe(a)
    expect(store.threads.map((thread) => thread.id)).toEqual([a])
  })

  it('notifies subscribers on same-tab writes', () => {
    const onChange = vi.fn()
    const unsubscribe = subscribeToThreads(onChange)

    upsertThread({
      id: createThreadId(),
      nextMessageId: 2,
      messages: [userMessage(1, 'Ping')],
    })
    unsubscribe()

    expect(onChange).toHaveBeenCalled()
  })

  it('ignores corrupt storage payloads', () => {
    window.localStorage.setItem(CLEO_THREADS_STORAGE_KEY, '{not-json')
    expect(parseThreadsStore('{not-json')).toEqual({
      version: 1,
      activeThreadId: null,
      threads: [],
    })
    expect(readThreadsStore().threads).toEqual([])
  })

  it('can clear the active pointer without deleting history', () => {
    const id = createThreadId()
    upsertThread({
      id,
      nextMessageId: 2,
      messages: [userMessage(1, 'Keep me')],
    })

    const store = setActiveThreadId(null)
    expect(store.activeThreadId).toBeNull()
    expect(store.threads).toHaveLength(1)
  })
})
