/**
 * Axial failure modes for Cleo offline evals (Phase A).
 * Open-code production failures into these codes when adding cases.
 */

export const CLEO_FAILURE_MODES = [
  'invented_guide_link',
  'invented_curated_image',
  'missing_catalog_link',
  'stock_phrase',
  'wrong_shelf',
  'refusal_or_casual',
] as const

export type CleoFailureMode = (typeof CLEO_FAILURE_MODES)[number]

export const CLEO_FAILURE_MODE_NOTES: Record<CleoFailureMode, string> = {
  invented_guide_link:
    'Assistant Markdown links to /explore|space|civilizations|cities|oceans|rivers/<slug> that is not in the catalog.',
  invented_curated_image:
    'Assistant embeds /images/{atlas,space,...}/... paths that are not curated renditions.',
  missing_catalog_link:
    'Answer about a catalog subject omits the expected canonical guide deep link.',
  stock_phrase:
    'Voice uses banned stock assistant openers or closers from CLEO_INSTRUCTIONS.',
  wrong_shelf:
    'Links a real slug on the wrong collection (e.g. city under /explore).',
  refusal_or_casual:
    'Casual/refusal/chat turn that should not invent portal paths or photos.',
}

export function isCleoFailureMode(value: string): value is CleoFailureMode {
  return (CLEO_FAILURE_MODES as readonly string[]).includes(value)
}
