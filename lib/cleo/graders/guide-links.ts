import { hasInventedPortalPaths } from '~/lib/cleo/guardrails'
import type { GraderResult } from '~/lib/cleo/graders/types'
import { extractPortalGuideLinks } from '~/lib/cleo/portal-links'

/**
 * Every portal guide link in the reply must resolve via production catalog
 * getters (shared through `hasInventedPortalPaths`).
 */
export function gradeGuideLinkValidity(markdown: string): GraderResult {
  const links = extractPortalGuideLinks(markdown)
  if (links.length === 0) {
    return {
      grader: 'guide_link_validity',
      pass: true,
      diagnostic: 'No portal guide links to validate.',
    }
  }

  if (!hasInventedPortalPaths(markdown)) {
    return {
      grader: 'guide_link_validity',
      pass: true,
      diagnostic: `All ${links.length} portal guide link(s) resolve in the catalog.`,
    }
  }

  const invented = links
    .filter((link) => {
      // hasInventedPortalPaths also checks images; isolate link-only failures.
      const probe = `[x](${link.href})`
      return hasInventedPortalPaths(probe)
    })
    .map((link) => link.href)

  return {
    grader: 'guide_link_validity',
    pass: false,
    diagnostic:
      invented.length > 0
        ? `Invented or unresolved guide link(s): ${invented.join(', ')}.`
        : 'Reply contains invented portal paths (see images or reference defs).',
  }
}
