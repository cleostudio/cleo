import { and, asc, count, desc, eq } from 'drizzle-orm'

import {
  CLEO_MEMORY_NOTES_MAX,
  newCleoMemoryId,
  type CleoMemoryNote,
} from '~/lib/cleo/memory'
import { getDb, isDatabaseConfigured } from '~/lib/db'
import { cleoMemory } from '~/lib/db/cleo-schema'

export type MemoryStoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; status: number }

function toNote(row: {
  id: string
  note: string
  createdAt: Date
}): CleoMemoryNote {
  return {
    id: row.id,
    note: row.note,
    createdAt: row.createdAt,
  }
}

/** List newest-first notes for a signed-in user. Empty when Neon is unset. */
export async function listUserMemoryNotes(
  userId: string,
): Promise<MemoryStoreResult<CleoMemoryNote[]>> {
  if (!isDatabaseConfigured()) {
    return { ok: true, value: [] }
  }

  try {
    const db = getDb()
    const rows = await db
      .select({
        id: cleoMemory.id,
        note: cleoMemory.note,
        createdAt: cleoMemory.createdAt,
      })
      .from(cleoMemory)
      .where(eq(cleoMemory.userId, userId))
      .orderBy(desc(cleoMemory.createdAt))
      .limit(CLEO_MEMORY_NOTES_MAX)

    return { ok: true, value: rows.map(toNote) }
  } catch (error) {
    console.error('Failed to list Cleo memory notes.', error)
    return { ok: false, error: 'Could not load memory notes.', status: 503 }
  }
}

/** Notes oldest→newest for injection (fail-open empty on errors). */
export async function loadUserMemoryNotesForInjection(
  userId: string,
): Promise<CleoMemoryNote[]> {
  if (!isDatabaseConfigured()) return []

  try {
    const db = getDb()
    const rows = await db
      .select({
        id: cleoMemory.id,
        note: cleoMemory.note,
        createdAt: cleoMemory.createdAt,
      })
      .from(cleoMemory)
      .where(eq(cleoMemory.userId, userId))
      .orderBy(asc(cleoMemory.createdAt))
      .limit(CLEO_MEMORY_NOTES_MAX)

    return rows.map(toNote)
  } catch (error) {
    console.error('Failed to load Cleo memory for injection.', error)
    return []
  }
}

export async function addUserMemoryNote(
  userId: string,
  note: string,
): Promise<MemoryStoreResult<CleoMemoryNote>> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'Memory storage is unavailable.', status: 503 }
  }

  try {
    const db = getDb()
    const [countRow] = await db
      .select({ value: count() })
      .from(cleoMemory)
      .where(eq(cleoMemory.userId, userId))
    const existing = Number(countRow?.value ?? 0)

    if (existing >= CLEO_MEMORY_NOTES_MAX) {
      return {
        ok: false,
        error: `You can save at most ${CLEO_MEMORY_NOTES_MAX} notes. Delete one to add another.`,
        status: 409,
      }
    }

    const id = newCleoMemoryId()
    const [row] = await db
      .insert(cleoMemory)
      .values({ id, userId, note })
      .returning({
        id: cleoMemory.id,
        note: cleoMemory.note,
        createdAt: cleoMemory.createdAt,
      })

    if (!row) {
      return { ok: false, error: 'Could not save memory note.', status: 503 }
    }

    return { ok: true, value: toNote(row) }
  } catch (error) {
    console.error('Failed to add Cleo memory note.', error)
    return { ok: false, error: 'Could not save memory note.', status: 503 }
  }
}

export async function deleteUserMemoryNote(
  userId: string,
  noteId: string,
): Promise<MemoryStoreResult<{ deleted: boolean }>> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'Memory storage is unavailable.', status: 503 }
  }

  try {
    const db = getDb()
    const deleted = await db
      .delete(cleoMemory)
      .where(and(eq(cleoMemory.userId, userId), eq(cleoMemory.id, noteId)))
      .returning({ id: cleoMemory.id })

    return { ok: true, value: { deleted: deleted.length > 0 } }
  } catch (error) {
    console.error('Failed to delete Cleo memory note.', error)
    return { ok: false, error: 'Could not delete memory note.', status: 503 }
  }
}

export async function clearUserMemoryNotes(
  userId: string,
): Promise<MemoryStoreResult<{ cleared: number }>> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: 'Memory storage is unavailable.', status: 503 }
  }

  try {
    const db = getDb()
    const deleted = await db
      .delete(cleoMemory)
      .where(eq(cleoMemory.userId, userId))
      .returning({ id: cleoMemory.id })

    return { ok: true, value: { cleared: deleted.length } }
  } catch (error) {
    console.error('Failed to clear Cleo memory notes.', error)
    return { ok: false, error: 'Could not clear memory notes.', status: 503 }
  }
}
