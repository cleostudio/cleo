import { hasInventedPortalPaths } from '~/lib/cleo/guardrails'
import type { GraderResult } from '~/lib/cleo/graders/types'

/** Assert the raw reply has no invented portal paths/images. */
export function gradeNoInventedPaths(markdown: string): GraderResult {
  if (!hasInventedPortalPaths(markdown)) {
    return {
      grader: 'no_invented_paths',
      pass: true,
      diagnostic: 'No invented portal guide links or curated image paths.',
    }
  }

  return {
    grader: 'no_invented_paths',
    pass: false,
    diagnostic:
      'Reply contains invented portal guide links and/or curated image paths.',
  }
}

/** Negative fixture: invented paths must be present (documents a failure mode). */
export function gradeExpectInventedPaths(markdown: string): GraderResult {
  if (hasInventedPortalPaths(markdown)) {
    return {
      grader: 'expect_invented_paths',
      pass: true,
      diagnostic:
        'Negative fixture confirmed: invented portal paths/images are present.',
    }
  }

  return {
    grader: 'expect_invented_paths',
    pass: false,
    diagnostic:
      'Negative fixture expected invented portal paths/images, but none were found.',
  }
}
