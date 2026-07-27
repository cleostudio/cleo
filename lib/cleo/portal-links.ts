/**
 * Client-safe helpers for Cleo ↔ portal guide deep links and topic photos.
 * Kept free of heavy catalog imports so the ask-form bundle stays light.
 *
 * Invented Explore/Space paths are stripped using the slim zoom index
 * (`topic-photo-zoom.ts`). Server-side `guardrails.ts` covers the same bar
 * with live atlas/space lookups for unit tests.
 */

import { isKnownPortalGuideSlug } from '~/lib/cleo/topic-photo-zoom'
import { isPublishedPostSlug } from '~/lib/public-content-routes'

export type PortalGuideLink = {
  collection: 'explore' | 'space'
  href: string
  label: string
  slug: string
}

const MARKDOWN_GUIDE_LINK =
  /\[([^\]]*)\]\((\/(explore|space)\/([a-z0-9-]+))\)/gi

const MARKDOWN_WRITING_LINK =
  /\[([^\]]*)\]\((\/blog\/([a-z0-9-]+))\)/gi

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
      .replace(/^(?:explore|space)\s+/i, '')
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
 * Keep the first Markdown link per Explore/Space guide (short label), turn
 * later repeats into plain text, and drop redundant guide-only footer blocks.
 * Invented Writing `/blog/...` hrefs become plain labels.
 */
export function presentPortalGuideMarkdown(markdown: string): string {
  const seenHrefs = new Set<string>()
  // Footer matching uses guide subject names only (not arbitrary link text
  // like "global ocean"), so short real paragraphs are not dropped.
  const guideNames = new Set<string>()

  const rewriteGuideLinks = (block: string) =>
    block.replace(
      MARKDOWN_GUIDE_LINK,
      (
        _full,
        rawLabel: string,
        href: string,
        collection: string,
        slug: string,
      ) => {
        const label = cleanPortalGuideLabel(rawLabel, slug)
        if (
          collection !== 'explore' &&
          collection !== 'space'
        ) {
          return label
        }
        if (!isKnownPortalGuideSlug(collection, slug)) {
          // Invented catalog path — keep the label, drop the href.
          return label
        }
        const guideName = titleFromSlug(slug)
        if (seenHrefs.has(href)) {
          return label
        }
        seenHrefs.add(href)
        guideNames.add(guideName)
        return `[${label}](${href})`
      },
    )

  const rewriteWritingLinks = (block: string) =>
    block.replace(
      MARKDOWN_WRITING_LINK,
      (_full, rawLabel: string, href: string, slug: string) => {
        const label = (rawLabel as string).trim() || titleFromSlug(slug)
        if (!isPublishedPostSlug(slug)) {
          return label
        }
        if (seenHrefs.has(href)) {
          return label
        }
        seenHrefs.add(href)
        return `[${label}](${href})`
      },
    )

  const blocks = presentTopicPhotoMarkdown(markdown).split(/\n{2,}/)
  const kept: string[] = []

  for (const block of blocks) {
    const hrefsBefore = seenHrefs.size
    const rewritten = rewriteWritingLinks(rewriteGuideLinks(block))

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

/** Empty-state prompts that exercise portal grounding and tool use. */
export const CLEO_PORTAL_STARTERS = [
  {
    label: 'Orient me to Japan',
    prompt:
      'Give me a quick orientation to Japan — look up its field guide and show the curated photo if it helps.',
  },
  {
    label: 'Compare Mars and Earth',
    prompt:
      'Compare Mars and Earth in a few sharp points. Look up both Space guides and deep-link each planet.',
  },
  {
    label: 'Browse Topics',
    prompt:
      'What topics can I explore here? Point me to the Topics catalog at /topics and deep-link Countries and Space with a one-line tease for each.',
  },
  {
    label: 'Fact-check the ISS orbit',
    prompt:
      'Fact-check this claim with sources: the International Space Station orbits Earth about every 90 minutes. Use the Space guide if one exists.',
  },
  {
    label: 'Find nebula photos',
    prompt:
      'Search the Gallery for nebula photographs and show one or two with short captions, linking each Space guide.',
  },
  {
    label: 'Find a Writing essay',
    prompt:
      'Search Writing for an essay about Earth from space and deep-link the best match with a one-sentence tease.',
  },
] as const
