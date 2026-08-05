import type { GraderResult } from '~/lib/cleo/graders/types'

/** Pass when every expected canonical guide href appears in the reply. */
export function gradeCatalogMention(
  markdown: string,
  expectedHrefs: string[],
): GraderResult {
  if (expectedHrefs.length === 0) {
    return {
      grader: 'catalog_mention',
      pass: true,
      diagnostic: 'No expected catalog hrefs for this case.',
    }
  }

  const missing = expectedHrefs.filter((href) => !markdown.includes(href))
  if (missing.length === 0) {
    return {
      grader: 'catalog_mention',
      pass: true,
      diagnostic: `Found expected catalog href(s): ${expectedHrefs.join(', ')}.`,
    }
  }

  return {
    grader: 'catalog_mention',
    pass: false,
    diagnostic: `Missing expected catalog href(s): ${missing.join(', ')}.`,
  }
}
