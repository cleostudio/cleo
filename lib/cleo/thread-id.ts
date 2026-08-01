/**
 * Client-generated thread (and message) ids for Stage 1 local storage.
 * These become Postgres primary keys in Stage 2 — never remap them.
 */
export function newThreadId(): string {
  return crypto.randomUUID()
}

export function newMessageId(): string {
  return crypto.randomUUID()
}

export function newImageId(): string {
  return crypto.randomUUID()
}

const THREAD_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isThreadId(value: string): boolean {
  return THREAD_ID_RE.test(value)
}
