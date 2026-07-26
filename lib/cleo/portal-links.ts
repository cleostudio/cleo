/**
 * Client-safe helpers for Cleo ↔ portal guide deep links.
 * Kept free of heavy catalog imports so the ask-form bundle stays light.
 */

export type PortalGuideLink = {
  collection: 'explore' | 'space'
  href: string
  label: string
  slug: string
}

const MARKDOWN_GUIDE_LINK =
  /\[([^\]]*)\]\((\/(explore|space)\/([a-z0-9-]+))\)/gi

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** Prefer a short guide name over noisy model link text. */
export function cleanPortalGuideLabel(
  label: string,
  slug: string,
): string {
  const trimmed = label.trim()
  if (!trimmed) {
    return titleFromSlug(slug)
  }

  const cleaned = trimmed
    .replace(/\s*(?:explore|space)?\s*(?:field\s*)?guides?\s*$/i, '')
    .replace(/^(?:explore|space)\s*[·|:–-]\s*/i, '')
    .replace(/^(?:the\s+)?(?:explore|space)\s+/i, '')
    .trim()

  return cleaned || titleFromSlug(slug)
}

/** Pull unique Explore/Space guide links from assistant Markdown. */
export function extractPortalGuideLinks(markdown: string): PortalGuideLink[] {
  const found = new Map<string, PortalGuideLink>()

  for (const match of markdown.matchAll(MARKDOWN_GUIDE_LINK)) {
    const rawLabel = match[1] ?? ''
    const href = match[2]
    const collection = match[3] as 'explore' | 'space'
    const slug = match[4]

    if (!href || !collection || !slug || found.has(href)) {
      continue
    }

    found.set(href, {
      collection,
      href,
      label: cleanPortalGuideLabel(rawLabel, slug),
      slug,
    })
  }

  return [...found.values()]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * True when a block only restates guides already linked earlier (footer
 * callouts like "Explore Japan" or "For a fuller primer, see Japan.").
 */
function isRedundantGuideFooter(
  block: string,
  linkedLabels: ReadonlySet<string>,
): boolean {
  if (linkedLabels.size === 0) {
    return false
  }

  let remainder = block.trim()
  if (!remainder) {
    return false
  }

  remainder = remainder
    .replace(/\bfor a fuller primer,?\s*see\b/gi, ' ')
    .replace(/\bsee\s+(?:the\s+)?/gi, ' ')
    .replace(/\b(?:explore|space)\b/gi, ' ')

  for (const label of linkedLabels) {
    remainder = remainder.replace(new RegExp(escapeRegExp(label), 'gi'), ' ')
  }

  remainder = remainder.replace(/[\s·•|,.;:!?—–-]+/g, '')
  return remainder.length === 0
}

/**
 * Keep the first Markdown link per Explore/Space guide (short label), turn
 * later repeats into plain text, and drop redundant guide-only footer blocks.
 */
export function presentPortalGuideMarkdown(markdown: string): string {
  const seenHrefs = new Set<string>()
  const linkedLabels = new Set<string>()

  const rewriteLinks = (block: string) =>
    block.replace(
      MARKDOWN_GUIDE_LINK,
      (_full, rawLabel: string, href: string, _collection: string, slug: string) => {
        const label = cleanPortalGuideLabel(rawLabel, slug)
        if (seenHrefs.has(href)) {
          return label
        }
        seenHrefs.add(href)
        linkedLabels.add(label)
        linkedLabels.add(titleFromSlug(slug))
        return `[${label}](${href})`
      },
    )

  const blocks = markdown.split(/\n{2,}/)
  const kept: string[] = []

  for (const block of blocks) {
    const hrefsBefore = seenHrefs.size
    const rewritten = rewriteLinks(block)

    if (
      kept.length > 0 &&
      seenHrefs.size === hrefsBefore &&
      isRedundantGuideFooter(rewritten, linkedLabels)
    ) {
      continue
    }

    kept.push(rewritten)
  }

  return kept.join('\n\n')
}

/** Empty-state prompts that exercise portal grounding. */
export const CLEO_PORTAL_STARTERS = [
  {
    label: 'Orient me to Japan',
    prompt:
      'Give me a quick orientation to Japan. Deep-link its field guide when you mention the country.',
  },
  {
    label: 'Why is Europa interesting?',
    prompt:
      'Why is Europa interesting as an ocean world? Deep-link the Space guide when you name it.',
  },
  {
    label: 'Compare Mars and Earth',
    prompt:
      'Compare Mars and Earth in a few sharp points. Deep-link each Space guide when you name the planets.',
  },
] as const
