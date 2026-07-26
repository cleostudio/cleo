/** Geographic helpers for the Maps globe (degrees in, scene units out). */

const DEG = Math.PI / 180

/**
 * Convert geodetic lat/lng (degrees) to a point on a Y-up unit sphere whose
 * texture center (0°, 0°) lies on +X — matching Three.js SphereGeometry UVs
 * with Solar System Scope / Blue Marble equirectangular maps.
 */
export function latLngToScene(
  latitude: number,
  longitude: number,
  radius = 1,
): [number, number, number] {
  const phi = (90 - latitude) * DEG
  const theta = (longitude + 180) * DEG
  const sinPhi = Math.sin(phi)
  return [
    -radius * Math.cos(theta) * sinPhi,
    radius * Math.cos(phi),
    radius * Math.sin(theta) * sinPhi,
  ]
}

/** Inverse of `latLngToScene` for a direction from the globe origin. */
export function sceneToLatLng(
  x: number,
  y: number,
  z: number,
): { latitude: number; longitude: number } {
  const radius = Math.hypot(x, y, z) || 1
  const latitude = 90 - (Math.acos(Math.min(1, Math.max(-1, y / radius))) / DEG)
  let longitude = (Math.atan2(z, -x) / DEG) - 180
  // Keep longitude in (−180, 180].
  longitude = ((((longitude + 180) % 360) + 360) % 360) - 180
  return { latitude, longitude }
}

export function formatLatLng(latitude: number, longitude: number): string {
  const latHemisphere = latitude >= 0 ? 'N' : 'S'
  const lngHemisphere = longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(latitude).toFixed(1)}°${latHemisphere} · ${Math.abs(longitude).toFixed(1)}°${lngHemisphere}`
}
