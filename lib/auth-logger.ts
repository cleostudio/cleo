/**
 * Better Auth can log adapter Errors whose messages include SQL + bind params
 * (session tokens, emails). Keep console output to safe scalars only.
 */

export type AuthLogLevel = 'debug' | 'info' | 'warn' | 'error'

const SENSITIVE_FRAGMENT =
  /\b(password|token|secret|authorization|cookie|session[_-]?token|email)\b/i

/** Collapse Error / object dumps that often carry query params. */
export function redactAuthLogArg(value: unknown): string {
  if (value == null) return String(value)

  if (typeof value === 'string') {
    return redactAuthLogMessage(value)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value instanceof Error) {
    const name = value.name || 'Error'
    return `${name}: ${redactAuthLogMessage(value.message)}`
  }

  if (Array.isArray(value)) {
    return `[${value.length} args]`
  }

  if (typeof value === 'object') {
    const ctor = value.constructor?.name
    return ctor && ctor !== 'Object' ? `[${ctor}]` : '[object]'
  }

  return typeof value
}

export function redactAuthLogMessage(message: string): string {
  const trimmed = message.trim()
  if (!trimmed) return trimmed

  // Drizzle / neon-http errors often embed the full SQL statement.
  if (
    /\b(select|insert|update|delete|from|where|values)\b/i.test(trimmed) &&
    (trimmed.includes('$') || trimmed.includes('?') || /\bparams?\b/i.test(trimmed))
  ) {
    return 'Database operation failed (details redacted).'
  }

  if (SENSITIVE_FRAGMENT.test(trimmed) && trimmed.length > 80) {
    return 'Auth event (details redacted).'
  }

  if (trimmed.length > 240) {
    return `${trimmed.slice(0, 240)}…[truncated]`
  }

  return trimmed
}

export function logAuthEvent(
  level: AuthLogLevel,
  message: string,
  ...args: unknown[]
): void {
  const line = `[better-auth] ${redactAuthLogMessage(String(message))}`
  const safeArgs = args.map(redactAuthLogArg)
  const sink =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log

  if (safeArgs.length === 0) {
    sink(line)
    return
  }

  sink(line, ...safeArgs)
}
