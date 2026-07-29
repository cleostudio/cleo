import { describe, expect, it } from 'vitest'

import {
  documentDistanceFromBottom,
  isDocumentNearBottom,
  STICK_TO_BOTTOM_THRESHOLD_PX,
} from './stick-to-bottom'

describe('stick-to-bottom', () => {
  it('measures distance from the document bottom', () => {
    expect(documentDistanceFromBottom(0, 800, 800)).toBe(0)
    expect(documentDistanceFromBottom(100, 800, 1200)).toBe(300)
    expect(documentDistanceFromBottom(500, 800, 1000)).toBe(0)
  })

  it('treats the viewport as stuck near the bottom', () => {
    expect(isDocumentNearBottom(904, 800, 1800)).toBe(true)
    expect(
      isDocumentNearBottom(800, 800, 1800, STICK_TO_BOTTOM_THRESHOLD_PX),
    ).toBe(false)
    expect(isDocumentNearBottom(0, 800, 800)).toBe(true)
  })

  it('is not stuck at the top of a tall document', () => {
    expect(isDocumentNearBottom(0, 900, 3000)).toBe(false)
    // End spacer can still sit within viewportHeight+120 of the top of a
    // medium page; document-distance is the ground truth.
    expect(isDocumentNearBottom(0, 900, 1400)).toBe(false)
  })
})
