import type { MapsMarker } from '~/lib/maps/markers'

/** Case-insensitive name / code / region match for the Maps search box. */
export function filterMapsMarkersByQuery(
  markers: readonly MapsMarker[],
  query: string,
  limit = 7,
): MapsMarker[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return markers
    .filter(
      (marker) =>
        marker.name.toLowerCase().includes(q) ||
        marker.code.toLowerCase().includes(q) ||
        marker.region.toLowerCase().includes(q) ||
        marker.subregion.toLowerCase().includes(q),
    )
    .slice(0, limit)
}
