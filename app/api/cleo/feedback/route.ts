import { eq } from 'drizzle-orm'

import { getSession } from '~/lib/auth'
import {
  excerptCleoFeedbackText,
  hashCleoFeedbackText,
  hashCleoGuestKey,
  newCleoFeedbackId,
  parseCleoFeedbackBody,
} from '~/lib/cleo/feedback'
import {
  checkCleoRateLimit,
  clientKeyFromHeaders,
} from '~/lib/cleo/rate-limit'
import { getDb, isDatabaseConfigured } from '~/lib/db'
import { cleoFeedback } from '~/lib/db/cleo-schema'

function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export async function POST(request: Request) {
  const rateLimit = checkCleoRateLimit(clientKeyFromHeaders(request.headers))
  if (!rateLimit.ok) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again shortly.' }),
      {
        status: 429,
        headers: {
          'content-type': 'application/json',
          'retry-after': String(rateLimit.retryAfterSeconds),
        },
      },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const parsed = parseCleoFeedbackBody(body)
  if (!parsed.ok) {
    return json({ error: parsed.error }, parsed.status)
  }

  const feedback = parsed.value

  // Fail open when Neon is unset — portal / Cleo stay usable without durable store.
  if (!isDatabaseConfigured()) {
    return json({ ok: true, stored: false })
  }

  let userId: string | null = null
  try {
    const session = await getSession(request.headers)
    userId = session?.user?.id ?? null
  } catch (error) {
    console.error('Failed to load auth session for Cleo feedback.', error)
  }

  const guestKeyHash = userId
    ? null
    : hashCleoGuestKey(clientKeyFromHeaders(request.headers))

  const row = {
    userId,
    guestKeyHash,
    turnId: feedback.turnId,
    rating: feedback.rating,
    comment: feedback.comment ?? null,
    promptHash: hashCleoFeedbackText(feedback.prompt),
    assistantHash: hashCleoFeedbackText(feedback.assistant),
    promptExcerpt: excerptCleoFeedbackText(feedback.prompt),
    assistantExcerpt: excerptCleoFeedbackText(feedback.assistant),
    inventedPaths: feedback.inventedPaths,
  }

  try {
    const db = getDb()
    const existing = await db
      .select({
        id: cleoFeedback.id,
        userId: cleoFeedback.userId,
        guestKeyHash: cleoFeedback.guestKeyHash,
      })
      .from(cleoFeedback)
      .where(eq(cleoFeedback.turnId, feedback.turnId))
      .limit(1)

    if (existing[0]) {
      const ownerOk = userId
        ? existing[0].userId === userId
        : existing[0].userId == null &&
          existing[0].guestKeyHash === guestKeyHash
      if (!ownerOk) {
        return json({ error: 'Feedback turn is not owned by this client.' }, 403)
      }

      await db
        .update(cleoFeedback)
        .set(row)
        .where(eq(cleoFeedback.turnId, feedback.turnId))
      return json({ ok: true, stored: true, updated: true })
    }

    await db.insert(cleoFeedback).values({
      id: newCleoFeedbackId(),
      ...row,
    })
    return json({ ok: true, stored: true, updated: false })
  } catch (error) {
    console.error('Failed to persist Cleo feedback.', error)
    return json({ error: 'Could not store feedback.' }, 503)
  }
}
