import { and, asc, desc, eq, isNull, max, sql } from 'drizzle-orm'

import { user } from '~/lib/auth-schema'
import {
  message,
  messageReasoning,
  thread,
} from '~/lib/cleo/thread-schema'
import { ThreadAuthError, requireUserId } from '~/lib/cleo/thread-errors'
import {
  MAX_REASONING_BYTES_PER_THREAD,
  REASONING_TTL_MS,
} from '~/lib/cleo/thread-limits'
import { newMessageId } from '~/lib/cleo/thread-id'
import { titleFromFirstUserMessage } from '~/lib/cleo/thread-title'
import {
  sanitizeReasoningItems,
  type EncryptedReasoningItem,
} from '~/lib/cleo/reasoning-items'
import { getDb } from '~/lib/db'

export type MessageRole = 'user' | 'assistant'
export type MessageStatus = 'complete' | 'incomplete' | 'error'

export type ThreadListItem = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
}

export type ThreadMessageRow = {
  id: string
  threadId: string
  seq: number
  role: MessageRole
  content: string
  status: MessageStatus
  createdAt: Date
  reasoningItems?: EncryptedReasoningItem[]
}

function db() {
  return getDb()
}

/** Load a non-deleted thread owned by `userId`, or throw 404. */
export async function getOwnedThread(userId: string, threadId: string) {
  const ownerId = requireUserId(userId)
  const rows = await db()
    .select()
    .from(thread)
    .where(
      and(
        eq(thread.id, threadId),
        eq(thread.userId, ownerId),
        isNull(thread.deletedAt),
      ),
    )
    .limit(1)

  const row = rows[0]
  if (!row) {
    throw new ThreadAuthError(404, 'Thread not found.')
  }
  return row
}

export async function listThreadsForUser(
  userId: string | null | undefined,
): Promise<ThreadListItem[]> {
  const ownerId = requireUserId(userId)
  const rows = await db()
    .select({
      id: thread.id,
      title: thread.title,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      lastMessageAt: thread.lastMessageAt,
    })
    .from(thread)
    .where(and(eq(thread.userId, ownerId), isNull(thread.deletedAt)))
    .orderBy(desc(thread.lastMessageAt))

  return rows
}

/**
 * Create a thread owned by `userId`, or return the existing one if it already
 * belongs to them. Never adopts another user's id.
 */
export async function ensureThreadForUser(input: {
  userId: string | null | undefined
  threadId: string
  title?: string
}): Promise<{ id: string; created: boolean }> {
  const ownerId = requireUserId(input.userId)
  const existing = await db()
    .select()
    .from(thread)
    .where(eq(thread.id, input.threadId))
    .limit(1)

  if (existing[0]) {
    if (existing[0].userId !== ownerId || existing[0].deletedAt) {
      throw new ThreadAuthError(404, 'Thread not found.')
    }
    return { id: existing[0].id, created: false }
  }

  const now = new Date()
  await db()
    .insert(thread)
    .values({
      id: input.threadId,
      userId: ownerId,
      title: input.title?.trim() || 'New conversation',
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    })

  return { id: input.threadId, created: true }
}

export async function appendUserMessage(input: {
  userId: string | null | undefined
  threadId: string
  messageId?: string
  content: string
}): Promise<ThreadMessageRow> {
  const ownerId = requireUserId(input.userId)
  const id = input.messageId?.trim() || newMessageId()
  const now = new Date()
  const content = input.content

  const finalSeq = await db().transaction(async (tx) => {
    // Row lock on the owned thread so concurrent turns cannot share a seq.
    const owned = await tx
      .select({ id: thread.id, title: thread.title })
      .from(thread)
      .where(
        and(
          eq(thread.id, input.threadId),
          eq(thread.userId, ownerId),
          isNull(thread.deletedAt),
        ),
      )
      .for('update')
      .limit(1)

    if (!owned[0]) {
      throw new ThreadAuthError(404, 'Thread not found.')
    }

    const [agg] = await tx
      .select({ maxSeq: max(message.seq) })
      .from(message)
      .where(eq(message.threadId, input.threadId))

    const nextSeq = (agg?.maxSeq ?? 0) + 1

    await tx.insert(message).values({
      id,
      threadId: input.threadId,
      seq: nextSeq,
      role: 'user',
      content,
      status: 'complete',
      createdAt: now,
    })

    const title =
      owned[0].title === 'New conversation' && nextSeq === 1
        ? titleFromFirstUserMessage(content)
        : owned[0].title

    await tx
      .update(thread)
      .set({
        title,
        updatedAt: now,
        lastMessageAt: now,
      })
      .where(and(eq(thread.id, input.threadId), eq(thread.userId, ownerId)))

    return nextSeq
  })

  return {
    id,
    threadId: input.threadId,
    seq: finalSeq,
    role: 'user',
    content,
    status: 'complete',
    createdAt: now,
  }
}

async function reasoningBytesForThread(
  // Transaction client from `db().transaction` — same query surface as getDb().
  tx: Pick<ReturnType<typeof getDb>, 'select'>,
  threadId: string,
) {
  const [row] = await tx
    .select({
      total: sql<number>`coalesce(sum(${messageReasoning.bytes}), 0)`,
    })
    .from(messageReasoning)
    .innerJoin(message, eq(message.id, messageReasoning.messageId))
    .where(eq(message.threadId, threadId))

  return Number(row?.total ?? 0)
}

export async function appendAssistantMessage(input: {
  userId: string | null | undefined
  threadId: string
  messageId?: string
  content: string
  status: MessageStatus
  reasoningItems?: EncryptedReasoningItem[]
}): Promise<ThreadMessageRow> {
  const ownerId = requireUserId(input.userId)
  await getOwnedThread(ownerId, input.threadId)

  const id = input.messageId?.trim() || newMessageId()
  const now = new Date()
  const sanitized = sanitizeReasoningItems(input.reasoningItems)

  const finalSeq = await db().transaction(async (tx) => {
    const owned = await tx
      .select({ id: thread.id })
      .from(thread)
      .where(
        and(
          eq(thread.id, input.threadId),
          eq(thread.userId, ownerId),
          isNull(thread.deletedAt),
        ),
      )
      .for('update')
      .limit(1)

    if (!owned[0]) {
      throw new ThreadAuthError(404, 'Thread not found.')
    }

    const [agg] = await tx
      .select({ maxSeq: max(message.seq) })
      .from(message)
      .where(eq(message.threadId, input.threadId))

    const nextSeq = (agg?.maxSeq ?? 0) + 1

    await tx.insert(message).values({
      id,
      threadId: input.threadId,
      seq: nextSeq,
      role: 'assistant',
      content: input.content,
      status: input.status,
      createdAt: now,
    })

    if (sanitized?.length) {
      const payload = JSON.stringify(sanitized)
      const bytes = Buffer.byteLength(payload, 'utf8')
      const used = await reasoningBytesForThread(tx, input.threadId)
      // Cache only — drop rather than fail the assistant row when over cap.
      if (used + bytes <= MAX_REASONING_BYTES_PER_THREAD) {
        await tx.insert(messageReasoning).values({
          messageId: id,
          items: sanitized,
          bytes,
          expiresAt: new Date(Date.now() + REASONING_TTL_MS),
        })
      }
    }

    await tx
      .update(thread)
      .set({ updatedAt: now, lastMessageAt: now })
      .where(and(eq(thread.id, input.threadId), eq(thread.userId, ownerId)))

    return nextSeq
  })

  return {
    id,
    threadId: input.threadId,
    seq: finalSeq,
    role: 'assistant',
    content: input.content,
    status: input.status,
    createdAt: now,
    reasoningItems: sanitized,
  }
}

export async function listMessagesForUser(
  userId: string | null | undefined,
  threadId: string,
  options: { includeReasoning?: boolean } = {},
): Promise<ThreadMessageRow[]> {
  const ownerId = requireUserId(userId)
  await getOwnedThread(ownerId, threadId)

  const rows = await db()
    .select({
      id: message.id,
      threadId: message.threadId,
      seq: message.seq,
      role: message.role,
      content: message.content,
      status: message.status,
      createdAt: message.createdAt,
      reasoningItems: messageReasoning.items,
      reasoningExpiresAt: messageReasoning.expiresAt,
    })
    .from(message)
    .leftJoin(messageReasoning, eq(messageReasoning.messageId, message.id))
    .where(eq(message.threadId, threadId))
    .orderBy(asc(message.seq))

  return rows.map((row) => {
    let reasoningItems: EncryptedReasoningItem[] | undefined
    if (options.includeReasoning !== false && row.reasoningItems) {
      const expired =
        row.reasoningExpiresAt &&
        row.reasoningExpiresAt.getTime() <= Date.now()
      if (!expired) {
        reasoningItems = sanitizeReasoningItems(row.reasoningItems)
      }
    }
    return {
      id: row.id,
      threadId: row.threadId,
      seq: row.seq,
      role: row.role as MessageRole,
      content: row.content,
      status: row.status as MessageStatus,
      createdAt: row.createdAt,
      reasoningItems,
    }
  })
}

export async function renameThreadForUser(input: {
  userId: string | null | undefined
  threadId: string
  title: string
}): Promise<void> {
  const ownerId = requireUserId(input.userId)
  await getOwnedThread(ownerId, input.threadId)
  const title = input.title.replace(/\s+/g, ' ').trim().slice(0, 120)
  if (!title) {
    throw new ThreadAuthError(404, 'Thread not found.')
  }
  await db()
    .update(thread)
    .set({ title, updatedAt: new Date() })
    .where(
      and(
        eq(thread.id, input.threadId),
        eq(thread.userId, ownerId),
        isNull(thread.deletedAt),
      ),
    )
}

export async function softDeleteThreadForUser(input: {
  userId: string | null | undefined
  threadId: string
}): Promise<void> {
  const ownerId = requireUserId(input.userId)
  await getOwnedThread(ownerId, input.threadId)
  const now = new Date()
  await db()
    .update(thread)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(eq(thread.id, input.threadId), eq(thread.userId, ownerId)))
}

export async function exportThreadsForUser(
  userId: string | null | undefined,
): Promise<{
  exportedAt: string
  threads: Array<{
    id: string
    title: string
    createdAt: string
    lastMessageAt: string
    messages: Array<{
      id: string
      seq: number
      role: string
      content: string
      status: string
      createdAt: string
    }>
  }>
}> {
  const ownerId = requireUserId(userId)
  const threads = await listThreadsForUser(ownerId)
  const payload = []
  for (const item of threads) {
    const messages = await listMessagesForUser(ownerId, item.id, {
      includeReasoning: false,
    })
    payload.push({
      id: item.id,
      title: item.title,
      createdAt: item.createdAt.toISOString(),
      lastMessageAt: item.lastMessageAt.toISOString(),
      messages: messages.map((m) => ({
        id: m.id,
        seq: m.seq,
        role: m.role,
        content: m.content,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
      })),
    })
  }
  return { exportedAt: new Date().toISOString(), threads: payload }
}

/**
 * Insert a local IndexedDB thread into Postgres using the same UUID PKs.
 * Fails closed if any id already belongs to another user.
 */
export async function adoptLocalThread(input: {
  userId: string | null | undefined
  thread: {
    id: string
    title: string
    createdAt: number
    updatedAt: number
    lastMessageAt: number
  }
  messages: Array<{
    id: string
    seq: number
    role: MessageRole
    content: string
    status?: MessageStatus
    createdAt: number
    reasoningItems?: EncryptedReasoningItem[]
  }>
}): Promise<void> {
  const ownerId = requireUserId(input.userId)

  await db().transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(thread)
      .where(eq(thread.id, input.thread.id))
      .limit(1)

    if (existing[0]) {
      if (existing[0].userId !== ownerId) {
        throw new ThreadAuthError(403, 'Thread already belongs to another account.')
      }
      return
    }

    await tx.insert(thread).values({
      id: input.thread.id,
      userId: ownerId,
      title: input.thread.title || 'New conversation',
      createdAt: new Date(input.thread.createdAt),
      updatedAt: new Date(input.thread.updatedAt),
      lastMessageAt: new Date(input.thread.lastMessageAt),
    })

    let reasoningUsed = 0
    for (const msg of input.messages) {
      await tx.insert(message).values({
        id: msg.id,
        threadId: input.thread.id,
        seq: msg.seq,
        role: msg.role,
        content: msg.content,
        status: msg.status ?? 'complete',
        createdAt: new Date(msg.createdAt),
      })
      const sanitized = sanitizeReasoningItems(msg.reasoningItems)
      if (sanitized?.length) {
        const payload = JSON.stringify(sanitized)
        const bytes = Buffer.byteLength(payload, 'utf8')
        if (reasoningUsed + bytes <= MAX_REASONING_BYTES_PER_THREAD) {
          await tx.insert(messageReasoning).values({
            messageId: msg.id,
            items: sanitized,
            bytes,
            expiresAt: new Date(Date.now() + REASONING_TTL_MS),
          })
          reasoningUsed += bytes
        }
      }
    }
  })
}

/** Test helper: insert a bare auth user row. */
export async function insertTestUser(id: string, name = 'Test user') {
  await db()
    .insert(user)
    .values({
      id,
      name,
      email: `temp@${id}.com`,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
}

export async function deleteTestUser(id: string) {
  await db().delete(user).where(eq(user.id, id))
}

/** Drop reasoning cache for a message (test / cache-miss simulation). */
export async function deleteReasoningForMessage(messageId: string) {
  await db()
    .delete(messageReasoning)
    .where(eq(messageReasoning.messageId, messageId))
}

export { sql }
