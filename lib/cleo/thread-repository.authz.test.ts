import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { newMessageId, newThreadId } from '~/lib/cleo/thread-id'
import { ThreadAuthError } from '~/lib/cleo/thread-errors'
import {
  appendAssistantMessage,
  appendUserMessage,
  deleteTestUser,
  ensureThreadForUser,
  exportThreadsForUser,
  insertTestUser,
  listMessagesForUser,
  listThreadsForUser,
  renameThreadForUser,
  softDeleteThreadForUser,
} from '~/lib/cleo/thread-repository'

/**
 * Authorization is the one part of Stage 2b that must not be retrofitted.
 * Every assertion here scopes by the server-resolved user id — never by a
 * client-supplied owner field.
 */
const userA = newThreadId()
const userB = newThreadId()
const threadA = newThreadId()

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim())

// These tests are the Stage 2b security floor. Skipping them silently in CI
// would greenwash a missing DATABASE_URL; fail loud there, skip only locally.
if (!hasDatabase && process.env.CI) {
  throw new Error(
    'DATABASE_URL is required to run thread authorization tests in CI.',
  )
}

describe.skipIf(!hasDatabase)('thread repository authorization', () => {
  beforeAll(async () => {
    await insertTestUser(userA, 'User A')
    await insertTestUser(userB, 'User B')
    await ensureThreadForUser({
      userId: userA,
      threadId: threadA,
      title: 'Alpha thread',
    })
    await appendUserMessage({
      userId: userA,
      threadId: threadA,
      messageId: newMessageId(),
      content: 'Hello from A',
    })
  })

  afterAll(async () => {
    await deleteTestUser(userA)
    await deleteTestUser(userB)
  })

  it('returns 401 for unauthenticated list (not an empty list)', async () => {
    await expect(listThreadsForUser(null)).rejects.toMatchObject({
      name: 'ThreadAuthError',
      status: 401,
    } satisfies Partial<ThreadAuthError>)
    await expect(listThreadsForUser(undefined)).rejects.toMatchObject({
      status: 401,
    })
  })

  it('returns 401 for unauthenticated read / append / rename / delete / export', async () => {
    await expect(listMessagesForUser(null, threadA)).rejects.toMatchObject({
      status: 401,
    })
    await expect(
      appendUserMessage({
        userId: null,
        threadId: threadA,
        content: 'nope',
      }),
    ).rejects.toMatchObject({ status: 401 })
    await expect(
      renameThreadForUser({
        userId: null,
        threadId: threadA,
        title: 'Hijacked',
      }),
    ).rejects.toMatchObject({ status: 401 })
    await expect(
      softDeleteThreadForUser({ userId: null, threadId: threadA }),
    ).rejects.toMatchObject({ status: 401 })
    await expect(exportThreadsForUser(null)).rejects.toMatchObject({
      status: 401,
    })
  })

  it('does not list user A threads to user B', async () => {
    const listed = await listThreadsForUser(userB)
    expect(listed.find((t) => t.id === threadA)).toBeUndefined()
    const owned = await listThreadsForUser(userA)
    expect(owned.some((t) => t.id === threadA)).toBe(true)
  })

  it('does not let user B read user A messages', async () => {
    await expect(listMessagesForUser(userB, threadA)).rejects.toMatchObject({
      status: 404,
    })
  })

  it('does not let user B append to user A thread', async () => {
    await expect(
      appendUserMessage({
        userId: userB,
        threadId: threadA,
        content: 'intrusion',
      }),
    ).rejects.toMatchObject({ status: 404 })

    await expect(
      appendAssistantMessage({
        userId: userB,
        threadId: threadA,
        content: 'forged assistant',
        status: 'complete',
      }),
    ).rejects.toMatchObject({ status: 404 })
  })

  it('does not let user B rename or delete user A thread', async () => {
    await expect(
      renameThreadForUser({
        userId: userB,
        threadId: threadA,
        title: 'Stolen title',
      }),
    ).rejects.toMatchObject({ status: 404 })

    await expect(
      softDeleteThreadForUser({ userId: userB, threadId: threadA }),
    ).rejects.toMatchObject({ status: 404 })

    const stillThere = await listThreadsForUser(userA)
    expect(stillThere.some((t) => t.id === threadA)).toBe(true)
  })

  it('does not let user B claim user A thread id via ensureThreadForUser', async () => {
    await expect(
      ensureThreadForUser({ userId: userB, threadId: threadA }),
    ).rejects.toMatchObject({ status: 404 })
  })

  it('export for user B never includes user A threads or messages', async () => {
    const exported = await exportThreadsForUser(userB)
    expect(
      exported.threads.find((t) => t.id === threadA),
    ).toBeUndefined()
  })

  it('owner can rename, append, and soft-delete their own thread', async () => {
    const ownedId = newThreadId()
    await ensureThreadForUser({
      userId: userA,
      threadId: ownedId,
      title: 'New conversation',
    })
    await appendUserMessage({
      userId: userA,
      threadId: ownedId,
      content: 'First question about Japan',
    })
    await renameThreadForUser({
      userId: userA,
      threadId: ownedId,
      title: 'Japan notes',
    })
    const listed = await listThreadsForUser(userA)
    expect(listed.find((t) => t.id === ownedId)?.title).toBe('Japan notes')

    await softDeleteThreadForUser({ userId: userA, threadId: ownedId })
    const after = await listThreadsForUser(userA)
    expect(after.find((t) => t.id === ownedId)).toBeUndefined()
  })
})
