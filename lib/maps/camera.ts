import type { PerspectiveCamera, Vector3 } from 'three'

/** Ease-out cubic — physical deceleration for camera flights. */
export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 3
}

/**
 * Camera position that looks at the origin while framing a surface point
 * (unit-ish direction × distance).
 */
export function framingPosition(
  direction: { x: number; y: number; z: number },
  distance: number,
): [number, number, number] {
  const length = Math.hypot(direction.x, direction.y, direction.z) || 1
  return [
    (direction.x / length) * distance,
    (direction.y / length) * distance,
    (direction.z / length) * distance,
  ]
}

/** Linear interpolate a camera toward a framing position. */
export function stepCameraToward(
  camera: PerspectiveCamera,
  from: Vector3,
  to: Vector3,
  t: number,
) {
  const k = easeOutCubic(t)
  camera.position.set(
    from.x + (to.x - from.x) * k,
    from.y + (to.y - from.y) * k,
    from.z + (to.z - from.z) * k,
  )
}
