/** Document-scroll stickiness helpers for the Cleo chat surface. */

export const STICK_TO_BOTTOM_THRESHOLD_PX = 96

/** Distance from the document bottom to the viewport bottom. */
export function documentDistanceFromBottom(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
) {
  return Math.max(0, scrollHeight - (scrollY + viewportHeight))
}

/** True when the viewport is within the stick threshold of the document end. */
export function isDocumentNearBottom(
  scrollY: number,
  viewportHeight: number,
  scrollHeight: number,
  thresholdPx: number = STICK_TO_BOTTOM_THRESHOLD_PX,
) {
  return (
    documentDistanceFromBottom(scrollY, viewportHeight, scrollHeight) <=
    thresholdPx
  )
}
