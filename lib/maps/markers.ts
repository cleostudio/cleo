import coordinates from '~/content/maps-coordinates.json'
import { countries, type Country } from '~/lib/countries'

export type MapsMarker = Country & {
  /** Degrees north. */
  lat: number
  /** Degrees east. */
  lon: number
}

export type MapsCoords = {
  lat: number
  lon: number
}

/** One marker per Explore country, placed at the country's geographic lat/lng. */
export function mapsMarkers(): MapsMarker[] {
  return countries.flatMap((country) => {
    const pair = coordinates[country.code as keyof typeof coordinates]
    if (!pair) return []
    const [lat, lon] = pair
    return [{ ...country, lat, lon }]
  })
}

/** Convert geographic degrees to a unit-sphere Cartesian point (Y-up, +X = 0°E). */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius = 1,
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  const x = -radius * Math.sin(phi) * Math.cos(theta)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

/** Inverse of `latLonToVector3` for a point on (or near) the sphere. */
export function vector3ToLatLon(
  x: number,
  y: number,
  z: number,
): MapsCoords {
  const length = Math.hypot(x, y, z) || 1
  const ny = y / length
  const lat = (Math.asin(Math.min(1, Math.max(-1, ny))) * 180) / Math.PI
  let lon = (Math.atan2(z / length, -x / length) * 180) / Math.PI - 180
  if (lon > 180) lon -= 360
  if (lon < -180) lon += 360
  return { lat, lon }
}

/** Compact DMS-style readout, e.g. `35.68°N 139.69°E`. */
export function formatLatLon(lat: number, lon: number, digits = 2): string {
  const latHemisphere = lat >= 0 ? 'N' : 'S'
  const lonHemisphere = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(digits)}°${latHemisphere} ${Math.abs(lon).toFixed(digits)}°${lonHemisphere}`
}
