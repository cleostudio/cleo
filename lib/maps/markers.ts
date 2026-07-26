import coordinates from '~/content/maps-coordinates.json'
import { countries, type Country } from '~/lib/countries'

export type MapsMarker = Country & {
  /** Degrees north. */
  lat: number
  /** Degrees east. */
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
