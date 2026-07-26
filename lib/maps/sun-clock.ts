/** UTC day-of-year for a date (1 = 1 Jan). */
export function utcDayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const day = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  )
  return Math.round((day - start) / 86_400_000)
}

/**
 * Build a UTC Date for sun lighting: live clock, or a scrubbed hour on a
 * chosen day-of-year (defaults to today's UTC calendar day).
 */
export function mapsSunAt(
  mode: 'live' | 'scrub',
  utcHour: number,
  now = new Date(),
  dayOfYear: number | null = null,
): Date {
  if (mode === 'live') return now
  const hour = ((Math.floor(utcHour) % 24) + 24) % 24
  const year = now.getUTCFullYear()
  const day =
    dayOfYear == null
      ? utcDayOfYear(now)
      : Math.min(365, Math.max(1, Math.floor(dayOfYear)))
  // Day-of-year on a non-leap scaffold keeps solstice/equinox scrubbing stable.
  return new Date(Date.UTC(year, 0, day, hour, 0, 0, 0))
}

/** Compact label for the sun scrubber, e.g. `12:00 UTC`. */
export function formatUtcHourLabel(utcHour: number): string {
  const hour = ((Math.floor(utcHour) % 24) + 24) % 24
  return `${String(hour).padStart(2, '0')}:00 UTC`
}

/** Compact seasonal label for the day scrubber, e.g. `20 Mar`. */
export function formatUtcDayLabel(dayOfYear: number, year = 2026): string {
  const day = Math.min(365, Math.max(1, Math.floor(dayOfYear)))
  const date = new Date(Date.UTC(year, 0, day))
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
