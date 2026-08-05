import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
}))

const store = vi.hoisted(() => ({
  isDatabaseConfigured: vi.fn(),
  listUserMemoryNotes: vi.fn(),
  addUserMemoryNote: vi.fn(),
  deleteUserMemoryNote: vi.fn(),
  clearUserMemoryNotes: vi.fn(),
}))

vi.mock('~/lib/auth', () => ({
  getSession: auth.getSession,
}))

vi.mock('~/lib/db', () => ({
  isDatabaseConfigured: store.isDatabaseConfigured,
}))

vi.mock('~/lib/cleo/memory-store', () => ({
  listUserMemoryNotes: store.listUserMemoryNotes,
  addUserMemoryNote: store.addUserMemoryNote,
  deleteUserMemoryNote: store.deleteUserMemoryNote,
  clearUserMemoryNotes: store.clearUserMemoryNotes,
}))

import { resetCleoRateLimitForTests } from '~/lib/cleo/rate-limit'

import { DELETE, GET, POST } from './route'

function memoryRequest(method: string, body?: unknown) {
  return new Request('https://cleo.example/api/cleo/memory', {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

beforeEach(() => {
  auth.getSession.mockReset()
  store.isDatabaseConfigured.mockReset()
  store.listUserMemoryNotes.mockReset()
  store.addUserMemoryNote.mockReset()
  store.deleteUserMemoryNote.mockReset()
  store.clearUserMemoryNotes.mockReset()
  resetCleoRateLimitForTests()

  auth.getSession.mockResolvedValue({ user: { id: 'user_ada', name: 'Ada' } })
  store.isDatabaseConfigured.mockReturnValue(true)
})

afterEach(() => {
  resetCleoRateLimitForTests()
})

describe('GET /api/cleo/memory', () => {
  it('requires a signed-in session', async () => {
    auth.getSession.mockResolvedValue(null)
    const response = await GET(memoryRequest('GET'))
    expect(response.status).toBe(401)
  })

  it('lists only via the session user id (isolation seam)', async () => {
    store.listUserMemoryNotes.mockResolvedValue({
      ok: true,
      value: [
        {
          id: 'n1',
          note: 'Prefer metric',
          createdAt: new Date('2026-01-01T00:00:00Z'),
        },
      ],
    })

    const response = await GET(memoryRequest('GET'))
    expect(response.status).toBe(200)
    expect(store.listUserMemoryNotes).toHaveBeenCalledWith('user_ada')
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      stored: true,
      notes: [{ id: 'n1', note: 'Prefer metric' }],
    })
  })

  it('returns empty notes when Neon is unset', async () => {
    store.isDatabaseConfigured.mockReturnValue(false)
    const response = await GET(memoryRequest('GET'))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      notes: [],
      stored: false,
    })
    expect(store.listUserMemoryNotes).not.toHaveBeenCalled()
  })
})

describe('POST /api/cleo/memory', () => {
  it('adds a note for the signed-in user', async () => {
    store.addUserMemoryNote.mockResolvedValue({
      ok: true,
      value: {
        id: 'n2',
        note: 'Interested in rivers',
        createdAt: new Date('2026-01-02T00:00:00Z'),
      },
    })

    const response = await POST(
      memoryRequest('POST', { note: 'Interested in rivers' }),
    )
    expect(response.status).toBe(201)
    expect(store.addUserMemoryNote).toHaveBeenCalledWith(
      'user_ada',
      'Interested in rivers',
    )
  })

  it('rejects guests and does not write', async () => {
    auth.getSession.mockResolvedValue(null)
    const response = await POST(memoryRequest('POST', { note: 'secret' }))
    expect(response.status).toBe(401)
    expect(store.addUserMemoryNote).not.toHaveBeenCalled()
    const payload = await response.json()
    expect(JSON.stringify(payload)).not.toContain('secret')
  })
})

describe('DELETE /api/cleo/memory', () => {
  it('deletes one note scoped to the session user', async () => {
    store.deleteUserMemoryNote.mockResolvedValue({
      ok: true,
      value: { deleted: true },
    })

    const response = await DELETE(
      new Request('https://cleo.example/api/cleo/memory?id=n1', {
        method: 'DELETE',
      }),
    )
    expect(response.status).toBe(200)
    expect(store.deleteUserMemoryNote).toHaveBeenCalledWith('user_ada', 'n1')
  })

  it('clears all notes for the session user only', async () => {
    store.clearUserMemoryNotes.mockResolvedValue({
      ok: true,
      value: { cleared: 3 },
    })

    const response = await DELETE(memoryRequest('DELETE', { all: true }))
    expect(response.status).toBe(200)
    expect(store.clearUserMemoryNotes).toHaveBeenCalledWith('user_ada')
    await expect(response.json()).resolves.toEqual({ ok: true, cleared: 3 })
  })
})
