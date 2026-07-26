import type { MapsMarker } from '~/lib/maps/markers'

/**
 * Nearby-in-catalog countries for a Maps dossier: prefer the same subregion,
 * then fill from the broader region. No geodesic math — atlas taxonomy only.
 */
export function mapsRegionNeighbors(
  marker: MapsMarker,
  all: readonly MapsMarker[],
  limit = 4,
): MapsMarker[] {
  const sameSubregion = all.filter(
    (candidate) =>
      candidate.slug !== marker.slug && candidate.subregion === marker.subregion,
  )
  const sameRegion = all.filter(
    (candidate) =>
      candidate.slug !== marker.slug &&
      candidate.region === marker.region &&
      candidate.subregion !== marker.subregion,
  )

  return [...sameSubregion, ...sameRegion].slice(0, limit)
}
