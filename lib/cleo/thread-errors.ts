/**
 * Authorization / ownership failures for server thread operations.
 * Callers map these to HTTP 401 / 403 / 404 — never leak another user's rows.
 */
export class ThreadAuthError extends Error {
  readonly status: 401 | 403 | 404

  constructor(status: 401 | 403 | 404, message: string) {
    super(message)
    this.name = 'ThreadAuthError'
    this.status = status
  }
}

export function requireUserId(userId: string | null | undefined): string {
  if (!userId) {
    throw new ThreadAuthError(401, 'Sign in to continue.')
  }
  return userId
}
