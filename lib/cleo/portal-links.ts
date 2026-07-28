/**
 * Client-safe helpers for Cleo ↔ portal guide deep links and topic photos.
 * Kept free of heavy catalog imports so the ask-form bundle stays light.
 */

export type PortalGuideLink = {
  collection: 'explore' | 'space'
  href: string
  label: string
  slug: string
}

export type PortalMapLink = {
  kind: 'country' | 'region'
  href: string
  label: string
  value: string
}

const MARKDOWN_GUIDE_LINK =
  /\[([^\]]*)\]\((\/(explore|space)\/([a-z0-9-]+))\)/gi

const MARKDOWN_MAP_LINK = /\[([^\]]*)\]\((\/maps\?[^)\s]+)\)/gi

const MAP_REGION_VALUES = new Set([
  'africa',
  'americas',
  'asia',
  'europe',
  'oceania',
])

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

/** Prefer a short Maps deep-link label over noisy model link text. */
export function cleanPortalMapLabel(
  label: string,
  kind: PortalMapLink['kind'],
  value: string,
): string {
  const fallback =
    kind === 'region'
      ? titleFromSlug(value)
      : `${titleFromSlug(value)} on the map`
  const trimmed = label.trim()
  if (!trimmed) return fallback

  const cleaned = trimmed
    .replace(/\s*on\s+the\s+map\s*$/i, '')
    .replace(/^(?:view|open|see)\s+/i, '')
    .replace(/^maps?\s*[·|:–-]\s*/i, '')
    .trim()

  if (!cleaned) return fallback
  if (kind === 'region') return cleaned
  return /on the map$/i.test(trimmed) ? trimmed : `${cleaned} on the map`
}

/** Keep a valid `#zoom/lat/lng` camera; drop junk fragments. */
function portalMapCameraHash(hash: string): string {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw) return ''
  const parts = raw.split('/')
  if (parts.length < 3) return ''
  const zoom = Number(parts[0])
  const lat = Number(parts[1])
  const lng = Number(parts[2])
  if (
    !Number.isFinite(zoom) ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    zoom < 0 ||
    zoom > 22 ||
    lat < -90 ||
    lat > 90
  ) {
    return ''
  }
  return `#${zoom}/${lat}/${lng}`
}

function parsePortalMapHref(href: string): PortalMapLink | null {
  let url: URL
  try {
    url = new URL(href, 'https://cleo.local')
  } catch {
    return null
  }
  if (url.pathname !== '/maps') return null

  const cameraHash = portalMapCameraHash(url.hash)

  const country = url.searchParams.get('country')?.trim().toLowerCase()
  if (country && /^[a-z0-9-]+$/.test(country)) {
    return {
      kind: 'country',
      href: `/maps?country=${encodeURIComponent(country)}${cameraHash}`,
      label: cleanPortalMapLabel('', 'country', country),
      value: country,
    }
  }

  const region = url.searchParams.get('region')?.trim().toLowerCase()
  if (region && MAP_REGION_VALUES.has(region)) {
    return {
      kind: 'region',
      href: `/maps?region=${encodeURIComponent(region)}${cameraHash}`,
      label: cleanPortalMapLabel('', 'region', region),
      value: region,
    }
  }

  return null
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

/** Pull unique Maps country/region deep links from assistant Markdown. */
export function extractPortalMapLinks(markdown: string): PortalMapLink[] {
  const found = new Map<string, PortalMapLink>()

  for (const match of markdown.matchAll(MARKDOWN_MAP_LINK)) {
    const rawLabel = match[1] ?? ''
    const href = match[2]
    if (!href) continue
    const parsed = parsePortalMapHref(href)
    if (!parsed) continue
    // Dedupe by place focus so a later plain link does not drop a capital camera.
    const key = `${parsed.kind}:${parsed.value}`
    if (found.has(key)) continue
    found.set(key, {
      ...parsed,
      label: cleanPortalMapLabel(rawLabel, parsed.kind, parsed.value),
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
 * Keep the first Markdown link per Explore/Space guide or Maps deep link
 * (short label), turn later repeats into plain text, and drop redundant
 * guide-only footer blocks.
 */
export function presentPortalGuideMarkdown(markdown: string): string {
  const seenHrefs = new Set<string>()
  // Footer matching uses guide subject names only (not arbitrary link text
  // like "global ocean"), so short real paragraphs are not dropped.
  const guideNames = new Set<string>()

  const rewriteGuideLinks = (block: string) =>
    block.replace(
      MARKDOWN_GUIDE_LINK,
      (_full, rawLabel: string, href: string, _collection: string, slug: string) => {
        const label = cleanPortalGuideLabel(rawLabel, slug)
        const guideName = titleFromSlug(slug)
        if (seenHrefs.has(href)) {
          return label
        }
        seenHrefs.add(href)
        guideNames.add(guideName)
        return `[${label}](${href})`
      },
    )

  const rewriteMapLinks = (block: string) =>
    block.replace(
      MARKDOWN_MAP_LINK,
      (_full, rawLabel: string, href: string) => {
        const parsed = parsePortalMapHref(href)
        if (!parsed) return _full
        const label = cleanPortalMapLabel(rawLabel, parsed.kind, parsed.value)
        const focusKey = `map:${parsed.kind}:${parsed.value}`
        if (seenHrefs.has(focusKey)) {
          return label
        }
        seenHrefs.add(focusKey)
        return `[${label}](${parsed.href})`
      },
    )

  const blocks = presentTopicPhotoMarkdown(markdown).split(/\n{2,}/)
  const kept: string[] = []

  for (const block of blocks) {
    const hrefsBefore = seenHrefs.size
    const rewritten = rewriteMapLinks(rewriteGuideLinks(block))

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
    label: 'Show Japan on the map',
    prompt:
      'Where is Japan on Earth relative to its neighbors? Deep-link Maps with `/maps?country=japan` and its Explore field guide.',
  },
  {
    label: 'Frame Africa on the map',
    prompt:
      'Frame the African continent on Earth. Deep-link Maps with the Africa region camera (`/maps?region=africa`) and mention a couple of Explore guides.',
  },
  {
    label: 'Why is Europa interesting?',
    prompt:
      'Why is Europa interesting as an ocean world? Deep-link the Space guide when you name it.',
  },
  {
    label: 'Show Earth on the map',
    prompt:
      'Orient me to Earth from space, then show where it sits on the interactive map. Deep-link `/space/earth` and `/maps`.',
  },
] as const
