import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { newMessageId, newThreadId } from '~/lib/cleo/thread-id'
import {
  appendAssistantMessage,
  appendUserMessage,
  deleteReasoningForMessage,
  deleteTestUser,
  ensureThreadForUser,
  insertTestUser,
  listMessagesForUser,
} from '~/lib/cleo/thread-repository'

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim())

if (!hasDatabase && process.env.CI) {
  throw new Error(
    'DATABASE_URL is required to run thread persistence tests in CI.',
  )
}

describe.skipIf(!hasDatabase)('thread repository persistence', () => {
  const userId = newThreadId()

  beforeAll(async () => {
    await insertTestUser(userId, 'Persist user')
  })

  afterAll(async () => {
    await deleteTestUser(userId)
  })

  it('allocates gap-free unique seq under concurrent appends', async () => {
    const threadId = newThreadId()
    await ensureThreadForUser({ userId, threadId, title: 'Seq race' })

    const results = await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        appendUserMessage({
          userId,
          threadId,
          messageId: newMessageId(),
          content: `concurrent ${index}`,
        }),
      ),
    )

    const seqs = results.map((row) => row.seq).sort((a, b) => a - b)
    expect(seqs).toEqual([1, 2, 3, 4, 5, 6, 7, 8])

    const listed = await listMessagesForUser(userId, threadId)
    expect(listed.map((row) => row.seq)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('persists incomplete assistant rows for Continue recovery', async () => {
    const threadId = newThreadId()
    await ensureThreadForUser({ userId, threadId })
    await appendUserMessage({
      userId,
      threadId,
      content: 'Tell me about Mars',
    })
    const assistant = await appendAssistantMessage({
      userId,
      threadId,
      content: 'Mars is',
      status: 'incomplete',
      reasoningItems: [
        {
          type: 'reasoning',
          id: 'rs_test_incomplete',
          encrypted_content: 'opaque-ciphertext',
        },
      ],
    })

    expect(assistant.seq).toBe(2)
    expect(assistant.status).toBe('incomplete')

    const messages = await listMessagesForUser(userId, threadId, {
      includeReasoning: true,
    })
    const last = messages.at(-1)
    expect(last?.status).toBe('incomplete')
    expect(last?.content).toBe('Mars is')
    expect(last?.reasoningItems?.length).toBe(1)
  })

  it('renders and continues when message_reasoning rows are missing', async () => {
    const threadId = newThreadId()
    await ensureThreadForUser({ userId, threadId })
    await appendUserMessage({
      userId,
      threadId,
      content: 'What is ISS?',
    })
    const assistant = await appendAssistantMessage({
      userId,
      threadId,
      content: 'The International Space Station',
      status: 'complete',
      reasoningItems: [
        {
          type: 'reasoning',
          id: 'rs_cache_miss',
          encrypted_content: 'will-be-deleted',
        },
      ],
    })

    await deleteReasoningForMessage(assistant.id)

    const withoutCache = await listMessagesForUser(userId, threadId, {
      includeReasoning: true,
    })
    expect(withoutCache).toHaveLength(2)
    expect(withoutCache[1]?.content).toContain('International Space Station')
    expect(withoutCache[1]?.reasoningItems).toBeUndefined()

    // A further turn still appends with a contiguous seq.
    const continued = await appendUserMessage({
      userId,
      threadId,
      content: 'Continue from where you left off.',
    })
    expect(continued.seq).toBe(3)
  })
})
