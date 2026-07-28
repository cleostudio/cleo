/**
 * Client-safe helpers for Cleo ↔ portal article links and topic photos.
 * Kept free of heavy catalog imports so the ask-form bundle stays light.
 */

export type PortalArticleLink = {
  collection: 'explore' | 'space'
  href: string
  label: string
  slug: string
}

const MARKDOWN_ARTICLE_LINK =
  /\[([^\]]*)\]\((\/(explore|space)\/([a-z0-9-]+))\)/gi

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

/** Prefer a short article name over noisy model link text. */
export function cleanPortalArticleLabel(
  label: string,
  slug: string,
): string {
  const trimmed = label.trim()
  if (!trimmed) {
    return titleFromSlug(slug)
  }

  const cleaned = trimmed
    .replace(/\s*(?:explore|space)?\s*(?:(?:field\s*)?guides?|articles?)\s*$/i, '')
    .replace(/^(?:explore|space)\s*[·|:–-]\s*/i, '')
    .replace(/^(?:the\s+)?(?:explore|space)\s+/i, '')
    .trim()

  return cleaned || titleFromSlug(slug)
}

/** Pull unique Explore/Space article links from assistant Markdown. */
export function extractPortalArticleLinks(markdown: string): PortalArticleLink[] {
  const found = new Map<string, PortalArticleLink>()

  for (const match of markdown.matchAll(MARKDOWN_ARTICLE_LINK)) {
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
      label: cleanPortalArticleLabel(rawLabel, slug),
      slug,
    })
  }

  return [...found.values()]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Strip leading article-callout chrome only ("Explore …", "See …",
 * "For more, see …") so real prose is not emptied by
 * mid-sentence word removal.
 */
function stripLeadingArticleChrome(block: string) {
  let remainder = block.trim()
  let previous = ''

  while (remainder !== previous) {
    previous = remainder
    remainder = remainder
      .replace(/^for (?:a fuller primer|more),?\s*see\s+/i, '')
      .replace(/^see\s+(?:the\s+)?/i, '')
      .replace(/^(?:explore|space)\s+/i, '')
      .trim()
  }

  return remainder
}

/**
 * True when a block only restates articles already linked earlier (footer
 * callouts like "Explore Japan" or "For more, see Japan.").
 */
function isRedundantArticleFooter(
  block: string,
  articleNames: ReadonlySet<string>,
): boolean {
  if (articleNames.size === 0) {
    return false
  }

  let remainder = stripLeadingArticleChrome(block)
  if (!remainder) {
    return false
  }

  for (const name of articleNames) {
    remainder = remainder.replace(new RegExp(escapeRegExp(name), 'gi'), ' ')
  }

  remainder = remainder.replace(/[\s·•|,.;:!?—–-]+/g, '')
  return remainder.length === 0
}

/**
 * Keep the first Markdown link per Explore/Space article (short label), turn
 * later repeats into plain text, and drop redundant article-only footer blocks.
 */
export function presentPortalArticleMarkdown(markdown: string): string {
  const seenHrefs = new Set<string>()
  // Footer matching uses article subject names only (not arbitrary link text
  // like "global ocean"), so short real paragraphs are not dropped.
  const articleNames = new Set<string>()

  const rewriteLinks = (block: string) =>
    block.replace(
      MARKDOWN_ARTICLE_LINK,
      (_full, rawLabel: string, href: string, _collection: string, slug: string) => {
        const label = cleanPortalArticleLabel(rawLabel, slug)
        const articleName = titleFromSlug(slug)
        if (seenHrefs.has(href)) {
          return label
        }
        seenHrefs.add(href)
        articleNames.add(articleName)
        return `[${label}](${href})`
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
      isRedundantArticleFooter(rewritten, articleNames)
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
    label: 'Japan at a glance',
    prompt:
      'Give me a concise overview of Japan. Link its reference article when you mention the country.',
  },
  {
    label: 'Why is Europa interesting?',
    prompt:
      'Why is Europa interesting as an ocean world? Link its Space article when you name it.',
  },
  {
    label: 'Compare Mars and Earth',
    prompt:
      'Compare Mars and Earth in a few sharp points. Link each Space article when you name the planets.',
  },
] as const
