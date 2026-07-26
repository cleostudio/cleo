/** Build a UTC Date for sun lighting: live clock, or a fixed hour on today's UTC date. */
export function mapsSunAt(mode: 'live' | 'scrub', utcHour: number, now = new Date()): Date {
  if (mode === 'live') return now
  const hour = ((Math.floor(utcHour) % 24) + 24) % 24
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hour,
      0,
      0,
      0,
    ),
  )
}

/** Compact label for the sun scrubber, e.g. `12:00 UTC`. */
export function formatUtcHourLabel(utcHour: number): string {
  const hour = ((Math.floor(utcHour) % 24) + 24) % 24
  return `${String(hour).padStart(2, '0')}:00 UTC`
}
