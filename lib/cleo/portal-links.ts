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

/** Empty-state prompts that exercise portal grounding. */
export const CLEO_PORTAL_STARTERS = [
  {
    label: 'Orient me to Japan',
    prompt:
      'Give me a quick orientation to Japan and link the Explore field guide.',
  },
  {
    label: 'Why is Europa interesting?',
    prompt:
      'Why is Europa interesting as an ocean world? Link the Space guide if you have one.',
  },
  {
    label: 'Compare Mars and Earth',
    prompt:
      'Compare Mars and Earth in a few sharp points, and link both field guides.',
  },
] as const
