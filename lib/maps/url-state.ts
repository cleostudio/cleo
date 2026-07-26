import type { MapsMarker } from '~/lib/maps/markers'

export type MapsUrlResolution = {
  marker: MapsMarker | null
  region: string | null
  /** Canonical query values after dropping invalid / conflicting params. */
  canonical: { c: string | null; r: string | null }
  /** True when the incoming query should be rewritten to `canonical`. */
  dirty: boolean
}

/**
 * Resolve Maps deep-link query params (`c` country, `r` region) against the
 * live marker catalog. Unknown values are dropped; a country that conflicts
 * with a region filter wins (region is cleared).
 */
export function resolveMapsUrlState(input: {
  c: string | null
  r: string | null
  markersBySlug: ReadonlyMap<string, MapsMarker>
  regions: readonly string[]
}): MapsUrlResolution {
  const region =
    input.r && input.regions.includes(input.r) ? input.r : null
  const marker = input.c ? (input.markersBySlug.get(input.c) ?? null) : null

  if (marker && region && marker.region !== region) {
    return {
      marker,
      region: null,
      canonical: { c: marker.slug, r: null },
      dirty: true,
    }
  }

  const canonical = {
    c: marker?.slug ?? null,
    r: region,
  }
  const dirty =
    (input.c ?? null) !== canonical.c || (input.r ?? null) !== canonical.r

  return {
    marker,
    region,
    canonical,
    dirty,
  }
}
