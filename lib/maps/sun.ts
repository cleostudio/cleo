import { latLonToVector3 } from '~/lib/maps/markers'

/**
 * Approximate subsolar latitude (solar declination) in degrees for a UTC date.
 * Uses a standard mean-orbit formula good enough for a globe terminator.
 */
export function solarDeclinationDegrees(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const dayOfYear =
    (date.getTime() - start) / 86_400_000 +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440
  return 23.44 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365)
}

/**
 * Approximate subsolar longitude in degrees east for a UTC instant.
 * At 12:00 UTC the sun is near the prime meridian.
 */
export function subsolarLongitudeDegrees(date: Date): number {
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600
  let lon = 15 * (12 - utcHours)
  if (lon > 180) lon -= 360
  if (lon < -180) lon += 360
  return lon
}

/** Unit sun direction in the same Y-up frame as `latLonToVector3`. */
export function sunDirectionAt(date: Date): [number, number, number] {
  const lat = solarDeclinationDegrees(date)
  const lon = subsolarLongitudeDegrees(date)
  const [x, y, z] = latLonToVector3(lat, lon, 1)
  const length = Math.hypot(x, y, z) || 1
  return [x / length, y / length, z / length]
}

/**
 * Whether a geographic point is on the lit side of the terminator at `date`.
 * Uses the same sun model as the globe (dot of surface normal and sun dir).
 */
export function isDaylightAt(lat: number, lon: number, date: Date): boolean {
  const [sx, sy, sz] = sunDirectionAt(date)
  const [nx, ny, nz] = latLonToVector3(lat, lon, 1)
  const length = Math.hypot(nx, ny, nz) || 1
  return (nx / length) * sx + (ny / length) * sy + (nz / length) * sz > 0
}

/** Compact dossier label for the lit/dark side of the terminator. */
export function daylightLabelAt(
  lat: number,
  lon: number,
  date: Date,
): 'Daylight' | 'Night' {
  return isDaylightAt(lat, lon, date) ? 'Daylight' : 'Night'
}
