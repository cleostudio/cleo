/**
 * Client-safe helpers for Cleo ↔ portal guide deep links and topic photos.
 * Kept free of heavy catalog imports so the ask-form bundle stays light.
 */

export type PortalGuideLink = {
  collection: 'explore' | 'space' | 'maps'
  href: string
  label: string
  slug: string
}

function portalLinkPattern() {
  return /\[([^\]]*)\]\((\/explore\/([a-z0-9-]+)|\/space\/([a-z0-9-]+)|\/maps\?c=([a-z0-9-]+))\)/gi
}

/** Curated static JPEGs under the site image roots. */
const CURATED_TOPIC_IMAGE_SRC =
  /^\/images\/(atlas|space)\/[a-z0-9-]+\/w(640|1280|2048)\.jpg$/

const MARKDOWN_IMAGE =
  /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

/** True when Markdown image src is a same-site curated atlas/space JPEG. */
export function isCuratedTopicImageSrc(src: string): boolean {
  return CURATED_TOPIC_IMAGE_SRC.test(src)
}

/**
 * Keep curated topic photographs; drop other Markdown images so the model
 * cannot inject arbitrary remote or data-URL images via text.
 */
export function presentTopicPhotoMarkdown(markdown: string): string {
  return markdown.replace(MARKDOWN_IMAGE, (full, alt: string, src: string) => {
    if (!isCuratedTopicImageSrc(src)) {
      return alt.trim() || ''
    }
    return `![${alt}](${src})`
  })
}

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
    .replace(/\s+on\s+maps\s*$/i, '')
    .replace(/\s*(?:explore|space)?\s*(?:field\s*)?guides?\s*$/i, '')
    .replace(/^(?:explore|space|maps)\s*[·|:–-]\s*/i, '')
    .replace(/^(?:the\s+)?(?:explore|space|maps)\s+/i, '')
    .trim()

  return cleaned || titleFromSlug(slug)
}

function portalLinkFromParts(
  rawLabel: string,
  href: string,
  exploreSlug?: string,
  spaceSlug?: string,
  mapsSlug?: string,
): PortalGuideLink | null {
  if (exploreSlug) {
    return {
      collection: 'explore',
      href,
      label: cleanPortalGuideLabel(rawLabel, exploreSlug),
      slug: exploreSlug,
    }
  }
  if (spaceSlug) {
    return {
      collection: 'space',
      href,
      label: cleanPortalGuideLabel(rawLabel, spaceSlug),
      slug: spaceSlug,
    }
  }
  if (mapsSlug) {
    return {
      collection: 'maps',
      href,
      label: cleanPortalGuideLabel(rawLabel, mapsSlug),
      slug: mapsSlug,
    }
  }
  return null
}

/** Pull unique Explore/Space/Maps links from assistant Markdown. */
export function extractPortalGuideLinks(markdown: string): PortalGuideLink[] {
  const found = new Map<string, PortalGuideLink>()

  for (const match of markdown.matchAll(portalLinkPattern())) {
    const link = portalLinkFromParts(
      match[1] ?? '',
      match[2] ?? '',
      match[3],
      match[4],
      match[5],
    )
    if (!link || found.has(link.href)) continue
    found.set(link.href, link)
  }

  return [...found.values()]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Strip leading guide-callout chrome only ("Explore …", "See …",
 * "For a fuller primer, see …") so real prose is not emptied by
 * mid-sentence word removal.
 */
function stripLeadingGuideChrome(block: string) {
  let remainder = block.trim()
  let previous = ''

  while (remainder !== previous) {
    previous = remainder
    remainder = remainder
      .replace(/^for a fuller primer,?\s*see\s+/i, '')
      .replace(/^see\s+(?:the\s+)?/i, '')
      .replace(/^(?:explore|space|maps)\s+/i, '')
      .trim()
  }

  return remainder
}

/**
 * True when a block only restates guides already linked earlier (footer
 * callouts like "Explore Japan" or "For a fuller primer, see Japan.").
 */
function isRedundantGuideFooter(
  block: string,
  guideNames: ReadonlySet<string>,
): boolean {
  if (guideNames.size === 0) {
    return false
  }

  let remainder = stripLeadingGuideChrome(block)
  if (!remainder) {
    return false
  }

  for (const name of guideNames) {
    remainder = remainder.replace(new RegExp(escapeRegExp(name), 'gi'), ' ')
  }

  remainder = remainder.replace(/[\s·•|,.;:!?—–-]+/g, '')
  return remainder.length === 0
}

/**
 * Keep the first Markdown link per Explore/Space/Maps path (short label), turn
 * later repeats into plain text, and drop redundant guide-only footer blocks.
 */
export function presentPortalGuideMarkdown(markdown: string): string {
  const seenHrefs = new Set<string>()
  // Footer matching uses guide subject names only (not arbitrary link text
  // like "global ocean"), so short real paragraphs are not dropped.
  const guideNames = new Set<string>()

  const rewriteLinks = (block: string) =>
    block.replace(
      portalLinkPattern(),
      (
        full,
        rawLabel: string,
        href: string,
        exploreSlug: string | undefined,
        spaceSlug: string | undefined,
        mapsSlug: string | undefined,
      ) => {
        const link = portalLinkFromParts(
          rawLabel,
          href,
          exploreSlug,
          spaceSlug,
          mapsSlug,
        )
        if (!link) return full
        const guideName = titleFromSlug(link.slug)
        if (seenHrefs.has(link.href)) {
          return link.label
        }
        seenHrefs.add(link.href)
        guideNames.add(guideName)
        return `[${link.label}](${link.href})`
      },
    )

  const blocks = presentTopicPhotoMarkdown(markdown).split(/\n{2,}/)
  const kept: string[] = []

  for (const block of blocks) {
    const hrefsBefore = seenHrefs.size
    const rewritten = rewriteLinks(block)

    if (
      kept.length > 0 &&
      seenHrefs.size === hrefsBefore &&
      isRedundantGuideFooter(rewritten, guideNames)
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
  {
    label: 'Where is Japan?',
    prompt:
      'Where is Japan on Earth? Deep-link Maps with /maps?c=japan when you locate it.',
  },
] as const
