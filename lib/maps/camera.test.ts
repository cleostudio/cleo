import { describe, expect, it } from 'vitest'

import {
  cameraPositionForLatLng,
  easeOutCubic,
  MAPS_FOCUS_DISTANCE,
  slerpCameraPositions,
} from './camera'

describe('maps camera helpers', () => {
  it('eases out toward 1', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })

  it('frames a lat/lng at the focus distance on +X for Greenwich', () => {
    const [x, y, z] = cameraPositionForLatLng(0, 0)
    expect(Math.hypot(x, y, z)).toBeCloseTo(MAPS_FOCUS_DISTANCE, 5)
    expect(x).toBeCloseTo(MAPS_FOCUS_DISTANCE, 5)
    expect(y).toBeCloseTo(0, 5)
    expect(z).toBeCloseTo(0, 5)
  })

  it('slerps along the short arc between opposite longitudes', () => {
    const from = cameraPositionForLatLng(0, 0, 2)
    const to = cameraPositionForLatLng(0, 90, 2)
    const mid = slerpCameraPositions(from, to, 0.5)
    expect(Math.hypot(...mid)).toBeCloseTo(2, 4)
    // Halfway from +X toward −Z should sit in the +X/−Z quadrant.
    expect(mid[0]).toBeGreaterThan(0)
    expect(mid[2]).toBeLessThan(0)
  })
})
