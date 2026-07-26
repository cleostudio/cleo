import { utcDayOfYear } from '~/lib/maps/sun-clock'
import type { MapsMarker } from '~/lib/maps/markers'

export type MapsUrlCanonical = {
  c: string | null
  r: string | null
  /** UTC hour 0–23 when sun is scrubbed; omitted when live. */
  h: string | null
  /** Day-of-year 1–365 when sun is scrubbed; omitted when live. */
  d: string | null
}

export type MapsUrlResolution = {
  marker: MapsMarker | null
  region: string | null
  sunMode: 'live' | 'scrub'
  sunHour: number
  sunDay: number
  /** Canonical query values after dropping invalid / conflicting params. */
  canonical: MapsUrlCanonical
  /** True when the incoming query should be rewritten to `canonical`. */
  dirty: boolean
}

function parseBoundedInt(
  raw: string | null,
  min: number,
  max: number,
): number | null {
  if (raw == null || raw === '') return null
  if (!/^\d+$/.test(raw)) return null
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) return null
  return value
}

/**
 * Resolve Maps deep-link query params against the live marker catalog and sun
 * scrubber. Unknown values are dropped; a country that conflicts with a region
 * filter wins (region is cleared). `h` / `d` enable sun scrubbing.
 */
export function resolveMapsUrlState(input: {
  c: string | null
  r: string | null
  h: string | null
  d: string | null
  markersBySlug: ReadonlyMap<string, MapsMarker>
  regions: readonly string[]
  now?: Date
}): MapsUrlResolution {
  const now = input.now ?? new Date()
  const region =
    input.r && input.regions.includes(input.r) ? input.r : null
  const marker = input.c ? (input.markersBySlug.get(input.c) ?? null) : null

  const parsedHour = parseBoundedInt(input.h, 0, 23)
  const parsedDay = parseBoundedInt(input.d, 1, 365)
  const sunRequested =
    (input.h != null && input.h !== '') || (input.d != null && input.d !== '')
  const sunValid = parsedHour != null || parsedDay != null
  const sunMode: 'live' | 'scrub' = sunRequested && sunValid ? 'scrub' : 'live'
  const sunHour =
    sunMode === 'scrub' ? (parsedHour ?? now.getUTCHours()) : now.getUTCHours()
  const sunDay =
    sunMode === 'scrub' ? (parsedDay ?? utcDayOfYear(now)) : utcDayOfYear(now)

  if (marker && region && marker.region !== region) {
    const canonical: MapsUrlCanonical = {
      c: marker.slug,
      r: null,
      h: sunMode === 'scrub' ? String(sunHour) : null,
      d: sunMode === 'scrub' ? String(sunDay) : null,
    }
    return {
      marker,
      region: null,
      sunMode,
      sunHour,
      sunDay,
      canonical,
      dirty: true,
    }
  }

  const canonical: MapsUrlCanonical = {
    c: marker?.slug ?? null,
    r: region,
    h: sunMode === 'scrub' ? String(sunHour) : null,
    d: sunMode === 'scrub' ? String(sunDay) : null,
  }
  const dirty =
    (input.c ?? null) !== canonical.c ||
    (input.r ?? null) !== canonical.r ||
    (input.h ?? null) !== canonical.h ||
    (input.d ?? null) !== canonical.d

  return {
    marker,
    region,
    sunMode,
    sunHour,
    sunDay,
    canonical,
    dirty,
  }
}

/** Apply a Maps canonical query onto a URLSearchParams instance. */
export function applyMapsUrlCanonical(
  params: URLSearchParams,
  canonical: MapsUrlCanonical,
) {
  if (canonical.c) params.set('c', canonical.c)
  else params.delete('c')
  if (canonical.r) params.set('r', canonical.r)
  else params.delete('r')
  if (canonical.h) params.set('h', canonical.h)
  else params.delete('h')
  if (canonical.d) params.set('d', canonical.d)
  else params.delete('d')
}

/** Relative `/maps` path for Copy link / Copy sun link from canonical peers. */
export function mapsSharePath(canonical: MapsUrlCanonical): string {
  const params = new URLSearchParams()
  applyMapsUrlCanonical(params, canonical)
  const query = params.toString()
  return query ? `/maps?${query}` : '/maps'
}
