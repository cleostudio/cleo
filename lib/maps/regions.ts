import type { MapsMarker } from '~/lib/maps/markers'

/** Sorted unique region names from the Maps marker set. */
export function mapsRegions(markers: readonly MapsMarker[]): string[] {
  return [...new Set(markers.map((marker) => marker.region))].sort((a, b) =>
    a.localeCompare(b, 'en'),
  )
}

/** Filter markers to one region, or return all when `region` is null. */
export function filterMapsMarkersByRegion(
  markers: readonly MapsMarker[],
  region: string | null,
): MapsMarker[] {
  if (!region) return [...markers]
  return markers.filter((marker) => marker.region === region)
}
