import {
  latLonToVector3,
  vector3ToLatLon,
  type MapsCoords,
  type MapsMarker,
} from '~/lib/maps/markers'

const EARTH_RADIUS_KM = 6371

/** Great-circle distance between two geographic points. */
export function haversineKm(a: MapsCoords, b: MapsCoords): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const chord =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(chord)))
}

/** Mean geographic point via unit-vector average (handles wide spans better). */
export function averageLatLon(
  points: readonly MapsCoords[],
): MapsCoords | null {
  if (points.length === 0) return null
  let x = 0
  let y = 0
  let z = 0
  for (const point of points) {
    const [vx, vy, vz] = latLonToVector3(point.lat, point.lon, 1)
    x += vx
    y += vy
    z += vz
  }
  return vector3ToLatLon(x, y, z)
}

/** Centroid of a region’s country markers, or null when the set is empty. */
export function regionMarkerCentroid(
  markers: readonly MapsMarker[],
  region: string,
): MapsCoords | null {
  return averageLatLon(
    markers.filter((marker) => marker.region === region),
  )
}

export type NearestMapsMarker = {
  marker: MapsMarker
  distanceKm: number
}

/** Closest catalog country to a sampled lat/lon (centroid distance). */
export function nearestMapsMarker(
  coords: MapsCoords,
  markers: readonly MapsMarker[],
): NearestMapsMarker | null {
  let best: NearestMapsMarker | null = null
  for (const marker of markers) {
    const distanceKm = haversineKm(coords, {
      lat: marker.lat,
      lon: marker.lon,
    })
    if (!best || distanceKm < best.distanceKm) {
      best = { marker, distanceKm }
    }
  }
  return best
}

/** Compact distance label for HUD / toolbar actions. */
export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km`
  if (distanceKm < 1000) return `${Math.round(distanceKm)} km`
  return `${(distanceKm / 1000).toFixed(1)}k km`
}
