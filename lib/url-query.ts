/** Read a query param from the current browser URL (client only). */
export function readQueryParam(key: string): string {
  if (typeof window === 'undefined') return ''
  return new URL(window.location.href).searchParams.get(key)?.trim() ?? ''
}

/** Replace (or clear) a query param without adding a history entry. */
export function replaceQueryParam(key: string, value: string) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const trimmed = value.trim()
  if (trimmed) url.searchParams.set(key, trimmed)
  else url.searchParams.delete(key)
  const next = `${url.pathname}${url.search}${url.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next !== current) {
    window.history.replaceState({}, '', next)
  }
}
