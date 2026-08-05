import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
}))

const db = vi.hoisted(() => ({
  isDatabaseConfigured: vi.fn(),
  getDb: vi.fn(),
  selectLimit: vi.fn(),
  insertValues: vi.fn(),
  updateSet: vi.fn(),
}))

vi.mock('~/lib/auth', () => ({
  getSession: auth.getSession,
}))

vi.mock('~/lib/db', () => ({
  isDatabaseConfigured: db.isDatabaseConfigured,
  getDb: db.getDb,
}))

import { resetCleoRateLimitForTests } from '~/lib/cleo/rate-limit'

import { POST } from './route'

function feedbackRequest(body: unknown, init: RequestInit = {}) {
  return new Request('https://cleo.example/api/cleo/feedback', {
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    ...init,
  })
}

const validBody = {
  turnId: 'turn_test_1',
  rating: 'down' as const,
  comment: 'Invented guide link',
  prompt: 'Tell me about Atlantis',
  assistant: 'See [Atlantis](/explore/atlantis).',
}

beforeEach(() => {
  auth.getSession.mockReset()
  db.isDatabaseConfigured.mockReset()
  db.getDb.mockReset()
  db.selectLimit.mockReset()
  db.insertValues.mockReset()
  db.updateSet.mockReset()
  resetCleoRateLimitForTests()

  auth.getSession.mockResolvedValue(null)
  db.isDatabaseConfigured.mockReturnValue(true)
  db.selectLimit.mockResolvedValue([])
  db.insertValues.mockResolvedValue(undefined)
  db.updateSet.mockResolvedValue(undefined)

  db.getDb.mockReturnValue({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: db.selectLimit,
        }),
      }),
    }),
    insert: () => ({
      values: db.insertValues,
    }),
    update: () => ({
      set: () => ({
        where: db.updateSet,
      }),
    }),
  })
})

afterEach(() => {
  resetCleoRateLimitForTests()
})

describe('POST /api/cleo/feedback', () => {
  it('fails open with stored:false when Neon is unset', async () => {
    db.isDatabaseConfigured.mockReturnValue(false)

    const response = await POST(feedbackRequest(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true, stored: false })
    expect(db.getDb).not.toHaveBeenCalled()
  })

  it('stores feedback when Neon is configured', async () => {
    auth.getSession.mockResolvedValue({ user: { id: 'user_ada', name: 'Ada' } })

    const response = await POST(feedbackRequest(validBody))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      stored: true,
      updated: false,
    })
    expect(db.insertValues).toHaveBeenCalledTimes(1)
    const inserted = db.insertValues.mock.calls[0]?.[0] as {
      userId: string
      rating: string
      inventedPaths: boolean
    }
    expect(inserted.userId).toBe('user_ada')
    expect(inserted.rating).toBe('down')
    expect(inserted.inventedPaths).toBe(true)
  })

  it('updates an existing turn feedback row', async () => {
    db.selectLimit.mockResolvedValue([{ id: 'existing' }])

    const response = await POST(
      feedbackRequest({ ...validBody, rating: 'up', comment: 'Actually fine' }),
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      stored: true,
      updated: true,
    })
    expect(db.updateSet).toHaveBeenCalled()
    expect(db.insertValues).not.toHaveBeenCalled()
  })

  it('rejects invalid rating without leaking body contents', async () => {
    const response = await POST(
      feedbackRequest({
        ...validBody,
        rating: 'secret-token-xyz',
      }),
    )
    expect(response.status).toBe(400)
    const payload = await response.json()
    expect(payload.error).toMatch(/rating/i)
    expect(JSON.stringify(payload)).not.toContain('secret-token-xyz')
  })

  it('rate limits repeated feedback posts', async () => {
    for (let i = 0; i < 12; i += 1) {
      const response = await POST(
        feedbackRequest({ ...validBody, turnId: `turn_${i}` }),
      )
      expect(response.status).toBe(200)
    }

    const blocked = await POST(
      feedbackRequest({ ...validBody, turnId: 'turn_overflow' }),
    )
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('retry-after')).toBeTruthy()
  })

  it('continues when session lookup throws', async () => {
    auth.getSession.mockRejectedValue(new Error('neon blip'))

    const response = await POST(feedbackRequest(validBody))
    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(payload.stored).toBe(true)
    const inserted = db.insertValues.mock.calls[0]?.[0] as {
      userId: string | null
      guestKeyHash: string | null
    }
    expect(inserted.userId).toBeNull()
    expect(inserted.guestKeyHash).toBeTruthy()
  })
})
