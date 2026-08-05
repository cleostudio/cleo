import { getSession } from '~/lib/auth'
import { parseMemoryNoteBody } from '~/lib/cleo/memory'
import {
  addUserMemoryNote,
  clearUserMemoryNotes,
  deleteUserMemoryNote,
  listUserMemoryNotes,
} from '~/lib/cleo/memory-store'
import {
  checkCleoRateLimit,
  clientKeyFromHeaders,
} from '~/lib/cleo/rate-limit'
import { isDatabaseConfigured } from '~/lib/db'

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

type AuthOk = { userId: string }
type AuthErr = { error: Response }

async function requireSignedInUser(
  request: Request,
): Promise<AuthOk | AuthErr> {
  const rateLimit = checkCleoRateLimit(clientKeyFromHeaders(request.headers))
  if (!rateLimit.ok) {
    return {
      error: new Response(
        JSON.stringify({ error: 'Too many requests. Try again shortly.' }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'retry-after': String(rateLimit.retryAfterSeconds),
          },
        },
      ),
    }
  }

  let session = null
  try {
    session = await getSession(request.headers)
  } catch (error) {
    console.error('Failed to load auth session for Cleo memory.', error)
    return { error: json({ error: 'Could not verify session.' }, 503) }
  }

  const userId = session?.user?.id
  if (!userId) {
    return {
      error: json({ error: 'Sign in to manage Cleo memory notes.' }, 401),
    }
  }

  return { userId }
}

/** List the signed-in user's memory notes (newest first). */
export async function GET(request: Request) {
  const auth = await requireSignedInUser(request)
  if ('error' in auth) return auth.error

  if (!isDatabaseConfigured()) {
    return json({ ok: true, notes: [], stored: false })
  }

  const listed = await listUserMemoryNotes(auth.userId)
  if (!listed.ok) {
    return json({ error: listed.error }, listed.status)
  }

  return json({ ok: true, notes: listed.value, stored: true })
}

/** Add an opt-in memory note for the signed-in user. */
export async function POST(request: Request) {
  const auth = await requireSignedInUser(request)
  if ('error' in auth) return auth.error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const parsed = parseMemoryNoteBody(body)
  if (!parsed.ok) {
    return json({ error: parsed.error }, parsed.status)
  }

  const added = await addUserMemoryNote(auth.userId, parsed.note)
  if (!added.ok) {
    return json({ error: added.error }, added.status)
  }

  return json({ ok: true, note: added.value }, 201)
}

/**
 * Delete one note (`?id=`) or clear all (`{ "all": true }` body).
 * Query `id` wins for single-note deletes.
 */
export async function DELETE(request: Request) {
  const auth = await requireSignedInUser(request)
  if ('error' in auth) return auth.error

  const url = new URL(request.url)
  const noteId = url.searchParams.get('id')?.trim()

  if (noteId) {
    const deleted = await deleteUserMemoryNote(auth.userId, noteId)
    if (!deleted.ok) {
      return json({ error: deleted.error }, deleted.status)
    }
    if (!deleted.value.deleted) {
      return json({ error: 'Memory note not found.' }, 404)
    }
    return json({ ok: true, deleted: true })
  }

  let body: unknown = null
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body.' }, 400)
    }
  }

  if (
    body &&
    typeof body === 'object' &&
    (body as { all?: unknown }).all === true
  ) {
    const cleared = await clearUserMemoryNotes(auth.userId)
    if (!cleared.ok) {
      return json({ error: cleared.error }, cleared.status)
    }
    return json({ ok: true, cleared: cleared.value.cleared })
  }

  return json(
    { error: 'Provide ?id=… to delete one note or { "all": true } to clear.' },
    400,
  )
}
