'use server'

import { getCleoSession } from '~/lib/cleo/auth-session'
import { makeIncomplete } from '~/lib/cleo/conversation-helpers'
import { ThreadAuthError } from '~/lib/cleo/thread-errors'
import {
  adoptLocalThread,
  exportThreadsForUser,
  listMessagesForUser,
  listThreadsForUser,
  renameThreadForUser,
  softDeleteThreadForUser,
  type MessageRole,
  type MessageStatus,
} from '~/lib/cleo/thread-repository'
import type { EncryptedReasoningItem } from '~/lib/cleo/reasoning-items'

function toActionError(error: unknown): { ok: false; status: number; error: string } {
  if (error instanceof ThreadAuthError) {
    return { ok: false, status: error.status, error: error.message }
  }
  console.error('Thread action failed.', error)
  return { ok: false, status: 500, error: 'Something went wrong.' }
}

export async function listServerThreadsAction() {
  try {
    const session = await getCleoSession()
    const threads = await listThreadsForUser(session?.user.id)
    return {
      ok: true as const,
      threads: threads.map((t) => ({
        id: t.id,
        title: t.title,
        createdAt: t.createdAt.getTime(),
        updatedAt: t.updatedAt.getTime(),
        lastMessageAt: t.lastMessageAt.getTime(),
        byteSize: 0,
      })),
    }
  } catch (error) {
    return toActionError(error)
  }
}

export async function loadServerThreadAction(threadId: string) {
  try {
    const session = await getCleoSession()
    const messages = await listMessagesForUser(session?.user.id, threadId, {
      includeReasoning: true,
    })
    return {
      ok: true as const,
      messages: messages.map((m, index) => ({
        id: index + 1,
        stableId: m.id,
        role: m.role,
        content: m.content,
        incomplete:
          m.status === 'incomplete'
            ? makeIncomplete('stopped')
            : m.status === 'error'
              ? makeIncomplete('other', 'This turn failed.')
              : undefined,
        reasoningItems: m.reasoningItems,
        images: [] as Array<{ id: string; url: string }>,
      })),
    }
  } catch (error) {
    return toActionError(error)
  }
}

export async function renameServerThreadAction(threadId: string, title: string) {
  try {
    const session = await getCleoSession()
    await renameThreadForUser({
      userId: session?.user.id,
      threadId,
      title,
    })
    return { ok: true as const }
  } catch (error) {
    return toActionError(error)
  }
}

export async function deleteServerThreadAction(threadId: string) {
  try {
    const session = await getCleoSession()
    await softDeleteThreadForUser({
      userId: session?.user.id,
      threadId,
    })
    return { ok: true as const }
  } catch (error) {
    return toActionError(error)
  }
}

export async function exportServerThreadsAction() {
  try {
    const session = await getCleoSession()
    const payload = await exportThreadsForUser(session?.user.id)
    return { ok: true as const, payload }
  } catch (error) {
    return toActionError(error)
  }
}

export type AdoptableLocalThread = {
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
}

export async function adoptLocalThreadsAction(threads: AdoptableLocalThread[]) {
  try {
    const session = await getCleoSession()
    if (!session?.user.id) {
      throw new ThreadAuthError(401, 'Sign in to continue.')
    }
    for (const item of threads) {
      await adoptLocalThread({
        userId: session.user.id,
        thread: item.thread,
        messages: item.messages,
      })
    }
    return { ok: true as const, count: threads.length }
  } catch (error) {
    return toActionError(error)
  }
}
