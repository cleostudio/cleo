import { worldMarkers } from '~/lib/world/markers'

export const WORLD_REGIONS = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
] as const

export type WorldRegion = (typeof WORLD_REGIONS)[number]

/** Geographic midpoint of markers in a UN-style region (for camera framing). */
export function regionLookAt(region: WorldRegion): { lat: number; lon: number } | null {
  const points = worldMarkers().filter((marker) => marker.region === region)
  if (points.length === 0) return null

  let x = 0
  let y = 0
  let z = 0
  for (const point of points) {
    const latRad = (point.lat * Math.PI) / 180
    const lonRad = (point.lon * Math.PI) / 180
    x += Math.cos(latRad) * Math.cos(lonRad)
    y += Math.cos(latRad) * Math.sin(lonRad)
    z += Math.sin(latRad)
  }
  x /= points.length
  y /= points.length
  z /= points.length
  const hyp = Math.hypot(x, y)
  return {
    lat: (Math.atan2(z, hyp) * 180) / Math.PI,
    lon: (Math.atan2(y, x) * 180) / Math.PI,
  }
}
