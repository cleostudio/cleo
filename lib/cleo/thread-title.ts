/** Derive a thread title from the first user message (plan §7.1). */
export const MAX_THREAD_TITLE_LENGTH = 64

export function titleFromFirstUserMessage(content: string): string {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (!normalized) return 'New conversation'

  if (normalized.length <= MAX_THREAD_TITLE_LENGTH) return normalized

  const slice = normalized.slice(0, MAX_THREAD_TITLE_LENGTH)
  const boundary = slice.lastIndexOf(' ')
  const truncated =
    boundary >= Math.floor(MAX_THREAD_TITLE_LENGTH * 0.5)
      ? slice.slice(0, boundary)
      : slice

  return `${truncated.trimEnd()}…`
}
