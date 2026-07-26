import { BufferAttribute, BufferGeometry } from 'three'

import { latLonToVector3 } from '~/lib/maps/markers'

/** Build a lat/lon wireframe on a sphere (degrees step, Y-up geographic frame). */
export function createGraticuleGeometry(
  radius = 1.004,
  stepDegrees = 30,
): BufferGeometry {
  const positions: number[] = []

  const pushSegment = (
    aLat: number,
    aLon: number,
    bLat: number,
    bLon: number,
  ) => {
    const a = latLonToVector3(aLat, aLon, radius)
    const b = latLonToVector3(bLat, bLon, radius)
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2])
  }

  // Meridians
  for (let lon = -180; lon < 180; lon += stepDegrees) {
    for (let lat = -90; lat < 90; lat += 2) {
      pushSegment(lat, lon, Math.min(lat + 2, 90), lon)
    }
  }

  // Parallels (skip poles)
  for (let lat = -90 + stepDegrees; lat <= 90 - stepDegrees; lat += stepDegrees) {
    for (let lon = -180; lon < 180; lon += 2) {
      const nextLon = lon + 2 > 180 ? 180 : lon + 2
      pushSegment(lat, lon, lat, nextLon)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  return geometry
}
