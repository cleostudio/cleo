import { latLngToScene } from '~/lib/maps/geo'

/** Default orbit distance when framing a selected country. */
export const MAPS_FOCUS_DISTANCE = 2.15

/** Ease-out cubic for camera flights. */
export function easeOutCubic(t: number): number {
  const u = Math.min(1, Math.max(0, t))
  return 1 - (1 - u) ** 3
}

/** Camera position looking at the origin, framed on a lat/lng. */
export function cameraPositionForLatLng(
  latitude: number,
  longitude: number,
  distance = MAPS_FOCUS_DISTANCE,
): [number, number, number] {
  return latLngToScene(latitude, longitude, distance)
}

/**
 * Spherical lerp between two camera positions that both look at the origin.
 * Preserves radius blend so zoom can ease in with the orbit.
 */
export function slerpCameraPositions(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  t: number,
): [number, number, number] {
  const eased = easeOutCubic(t)
  const fromLen = Math.hypot(from[0], from[1], from[2]) || 1
  const toLen = Math.hypot(to[0], to[1], to[2]) || 1
  const fromDir: [number, number, number] = [
    from[0] / fromLen,
    from[1] / fromLen,
    from[2] / fromLen,
  ]
  const toDir: [number, number, number] = [
    to[0] / toLen,
    to[1] / toLen,
    to[2] / toLen,
  ]

  let dot =
    fromDir[0] * toDir[0] + fromDir[1] * toDir[1] + fromDir[2] * toDir[2]
  dot = Math.min(1, Math.max(-1, dot))
  const omega = Math.acos(dot)

  let x: number
  let y: number
  let z: number
  if (omega < 1e-4) {
    x = fromDir[0] + (toDir[0] - fromDir[0]) * eased
    y = fromDir[1] + (toDir[1] - fromDir[1]) * eased
    z = fromDir[2] + (toDir[2] - fromDir[2]) * eased
  } else {
    const sinOmega = Math.sin(omega)
    const a = Math.sin((1 - eased) * omega) / sinOmega
    const b = Math.sin(eased * omega) / sinOmega
    x = fromDir[0] * a + toDir[0] * b
    y = fromDir[1] * a + toDir[1] * b
    z = fromDir[2] * a + toDir[2] * b
  }

  const length = fromLen + (toLen - fromLen) * eased
  const norm = Math.hypot(x, y, z) || 1
  return [(x / norm) * length, (y / norm) * length, (z / norm) * length]
}
