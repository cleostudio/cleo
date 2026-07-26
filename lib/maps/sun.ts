/**
 * Approximate geocentric sun direction for a UTC instant.
 *
 * Returns a unit vector in Earth-fixed coordinates where +X is lat/lng (0,0),
 * +Y is 90°E on the equator, and +Z is the north pole — matching equirectangular
 * Blue Marble / Solar System Scope maps on a Three.js Y-up sphere after the
 * ECEF→scene remap in `ecefToScene`.
 */

const DEG = Math.PI / 180
const DAY_MS = 86_400_000

/** Julian Date (UT1 ≈ UTC for this visualisation). */
export function julianDate(date: Date): number {
  return date.getTime() / DAY_MS + 2_440_587.5
}

/**
 * Low-precision solar apparent longitude & declination (degrees / radians),
 * good to ~0.1° — enough for a believable terminator on a 2K globe.
 */
export function sunEquatorial(date: Date): {
  declination: number
  greenwichHourAngle: number
} {
  const n = julianDate(date) - 2_451_545.0
  const meanLongitude = (280.46 + 0.9856474 * n) % 360
  const meanAnomaly = ((357.528 + 0.9856003 * n) % 360) * DEG
  const eclipticLongitude =
    (meanLongitude +
      1.915 * Math.sin(meanAnomaly) +
      0.02 * Math.sin(2 * meanAnomaly)) *
    DEG
  const obliquity = (23.439 - 4.0e-7 * n) * DEG

  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude))
  const rightAscension = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude),
    Math.cos(eclipticLongitude),
  )

  // Greenwich mean sidereal time (hours) → radians.
  const gmstHours = (18.697374558 + 24.06570982441908 * n) % 24
  const gst = ((gmstHours + 24) % 24) * 15 * DEG
  const greenwichHourAngle = gst - rightAscension

  return { declination, greenwichHourAngle }
}

/** Unit sun vector in ECEF (+X Greenwich, +Y 90°E, +Z north). */
export function sunDirectionEcef(date: Date): [number, number, number] {
  const { declination, greenwichHourAngle } = sunEquatorial(date)
  const cosDec = Math.cos(declination)
  return [
    cosDec * Math.cos(greenwichHourAngle),
    cosDec * Math.sin(greenwichHourAngle),
    Math.sin(declination),
  ]
}

/**
 * Remap ECEF into Three.js scene space for a Y-up SphereGeometry whose
 * texture center (Greenwich) sits on +X and 90°E on −Z.
 */
export function ecefToScene(
  ecef: readonly [number, number, number],
): [number, number, number] {
  const [x, y, z] = ecef
  return [x, z, -y]
}

/** Unit sun direction in scene space for `date`. */
export function sunDirectionScene(date: Date): [number, number, number] {
  return ecefToScene(sunDirectionEcef(date))
}
