import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

/**
 * Temporary verification endpoint for Sentry wiring. Remove after confirming
 * the test event appears in the cleo-studio/sentry-cleo project.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const marker =
    new URL(request.url).searchParams.get('marker') ??
    `Sentry test error ${Date.now()}`

  Sentry.captureException(new Error(marker))
  await Sentry.flush(2000)

  return NextResponse.json({ ok: true, marker })
}
