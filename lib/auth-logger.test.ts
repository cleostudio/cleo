import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  logAuthEvent,
  redactAuthLogArg,
  redactAuthLogMessage,
} from '~/lib/auth-logger'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('redactAuthLogMessage', () => {
  it('redacts SQL-shaped adapter errors that include bind params', () => {
    const sql =
      'Failed query: select "id", "token" from "session" where "token" = $1 params: session_secret_value'

    expect(redactAuthLogMessage(sql)).toBe(
      'Database operation failed (details redacted).',
    )
  })

  it('keeps short operational messages', () => {
    expect(redactAuthLogMessage('Invalid origin')).toBe('Invalid origin')
  })
})

describe('redactAuthLogArg', () => {
  it('never stringifies Error objects with query text', () => {
    const error = new Error(
      'Failed query: insert into "session" ("token") values ($1) params: abc',
    )
    expect(redactAuthLogArg(error)).toBe(
      'Error: Database operation failed (details redacted).',
    )
  })

  it('collapses objects and arrays instead of dumping them', () => {
    expect(redactAuthLogArg({ token: 'secret', email: 'a@b.c' })).toBe(
      '[object]',
    )
    expect(redactAuthLogArg(['a', 'b'])).toBe('[2 args]')
  })
})

describe('logAuthEvent', () => {
  it('writes redacted lines to the matching console sink', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    logAuthEvent(
      'warn',
      'Failed query: select * from session where token = $1 params: tok',
      new Error('Failed query: select token from session where id = $1 params: x'),
    )

    expect(warn).toHaveBeenCalledWith(
      '[better-auth] Database operation failed (details redacted).',
      'Error: Database operation failed (details redacted).',
    )
  })
})
