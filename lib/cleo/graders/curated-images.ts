import { hasInventedPortalPaths } from '~/lib/cleo/guardrails'
import type { GraderResult } from '~/lib/cleo/graders/types'
import { isCuratedTopicImageSrc } from '~/lib/cleo/portal-links'

const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

/**
 * Curated topic image embeds must match allowlisted rendition paths that
 * exist in the catalog (via production `hasInventedPortalPaths`).
 */
export function gradeCuratedImages(markdown: string): GraderResult {
  const curatedSrcs: string[] = []
  for (const match of markdown.matchAll(MARKDOWN_IMAGE)) {
    const src = match[2]!
    if (
      src.startsWith('/images/atlas/') ||
      src.startsWith('/images/space/') ||
      src.startsWith('/images/civilizations/') ||
      src.startsWith('/images/cities/') ||
      src.startsWith('/images/oceans/') ||
      src.startsWith('/images/rivers/')
    ) {
      curatedSrcs.push(src)
    }
  }

  if (curatedSrcs.length === 0) {
    return {
      grader: 'curated_images',
      pass: true,
      diagnostic: 'No curated topic image embeds to validate.',
    }
  }

  const badPattern = curatedSrcs.filter((src) => !isCuratedTopicImageSrc(src))
  if (badPattern.length > 0) {
    return {
      grader: 'curated_images',
      pass: false,
      diagnostic: `Image src(s) do not match curated topic JPEG pattern: ${badPattern.join(', ')}.`,
    }
  }

  // Pattern-ok but not in catalog (wrong slug/rendition) surfaces here.
  const probe = curatedSrcs.map((src) => `![](${src})`).join('\n')
  if (hasInventedPortalPaths(probe)) {
    return {
      grader: 'curated_images',
      pass: false,
      diagnostic: `Curated image path(s) are not in the catalog renditions: ${curatedSrcs.join(', ')}.`,
    }
  }

  return {
    grader: 'curated_images',
    pass: true,
    diagnostic: `All ${curatedSrcs.length} curated topic image(s) match catalog renditions.`,
  }
}
