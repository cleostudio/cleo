/**
 * Resolve curated Explore/Space guide excerpts for a Cleo turn.
 *
 * Catalog paths stay in developer instructions; this layer adds orientation
 * prose + facts for subjects the user (or an Ask Cleo deep link) actually
 * mentions — without stuffing all 195 country abouts into every request.
 */

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import type { PortalGuideFocus } from '~/lib/cleo/ask-links'
import { formatGuideFocus, parseGuideFocus } from '~/lib/cleo/ask-links'
import { countries } from '~/lib/countries'
import { galleryFilterHref, gallerySearchHref } from '~/lib/gallery'
import { getSpaceSubject, spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

export const MAX_GROUNDED_GUIDES = 3

export type GroundedGuide = {
  collection: 'explore' | 'space'
  slug: string
  name: string
  href: string
  about: string
  factsLine: string
  highlights: { name: string; description: string }[]
  photoCaption: string
  /** Featured place or feature name shown on the Gallery tile. */
  photoTitle: string
  /** Mid-size static JPEG path for the curated photograph. */
  photoSrc: string
  /** Gallery search that surfaces this subject's photograph. */
  galleryHref: string
  /** Gallery collection chip for the subject's region/category. */
  galleryFilterHref: string
}

type GuideCandidate = {
  collection: 'explore' | 'space'
  slug: string
  name: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function candidateKey(guide: Pick<GuideCandidate, 'collection' | 'slug'>) {
  return formatGuideFocus(guide)
}

function allCandidates(): GuideCandidate[] {
  return [
    ...spaceSubjects.map((subject) => ({
      collection: 'space' as const,
      slug: subject.slug,
      name: subject.name,
    })),
    ...countries.map((country) => ({
      collection: 'explore' as const,
      slug: country.slug,
      name: country.name,
    })),
  ]
}

export function loadGroundedGuide(
  focus: PortalGuideFocus,
): GroundedGuide | null {
  if (focus.collection === 'explore') {
    const entry = getAtlasEntry(focus.slug)
    if (!entry) return null
    return {
      collection: 'explore',
      slug: entry.slug,
      name: entry.name,
      href: `/explore/${entry.slug}`,
      about: entry.about.trim(),
      factsLine: [
        `Capital ${entry.facts.capital}`,
        `Languages ${entry.facts.languages.join(', ')}`,
        `Currency ${entry.facts.currency}`,
        `Area ${entry.facts.areaKm2.toLocaleString('en-US')} km²`,
        `Region ${entry.facts.region}`,
      ].join('; '),
      highlights: entry.places.map((place) => ({
        name: place.name,
        description: place.description,
      })),
      photoCaption: entry.photo.caption,
      photoTitle: entry.photo.placeName,
      photoSrc: atlasRendition(entry.photo, 1280).src,
      galleryHref: gallerySearchHref(entry.name),
      galleryFilterHref: galleryFilterHref(entry.region),
    }
  }

  const subject = getSpaceSubject(focus.slug)
  if (!subject) return null

  return {
    collection: 'space',
    slug: subject.slug,
    name: subject.name,
    href: `/space/${subject.slug}`,
    about: subject.about.trim(),
    factsLine: [
      `Kind ${subject.facts.kind}`,
      `System ${subject.facts.system}`,
      `Mean distance ${subject.facts.meanDistance}`,
      subject.facts.radiusKm != null
        ? `Equatorial radius ${subject.facts.radiusKm.toLocaleString('en-US')} km`
        : null,
      `Orbital period ${subject.facts.orbitalPeriod}`,
      `Rotation ${subject.facts.rotationPeriod}`,
      `Companions ${subject.facts.companions}`,
    ]
      .filter(Boolean)
      .join('; '),
    highlights: subject.features.map((feature) => ({
      name: feature.name,
      description: feature.description,
    })),
    photoCaption: subject.photo.caption,
    photoTitle: subject.photo.featureName,
    photoSrc: staticRendition(subject.photo, 1280).src,
    galleryHref: gallerySearchHref(subject.name),
    galleryFilterHref: galleryFilterHref(subject.category),
  }
}

/** Compact JSON-friendly guide payload for function-tool results. */
export function loadGroundedGuideCompact(focus: PortalGuideFocus) {
  const guide = loadGroundedGuide(focus)
  if (!guide) return null
  return {
    collection: guide.collection,
    slug: guide.slug,
    name: guide.name,
    href: guide.href,
    about: guide.about,
    facts: guide.factsLine,
    highlights: guide.highlights,
    photo: {
      title: guide.photoTitle,
      caption: guide.photoCaption,
      src: guide.photoSrc,
      galleryHref: guide.galleryHref,
      galleryFilterHref: guide.galleryFilterHref,
    },
  }
}

/** Resolve focus tokens to real guides (drops unknown slugs). */
export function resolveFocusGuides(
  focus: readonly PortalGuideFocus[],
): GroundedGuide[] {
  const seen = new Set<string>()
  const guides: GroundedGuide[] = []

  for (const item of focus) {
    const key = candidateKey(item)
    if (seen.has(key)) continue
    const loaded = loadGroundedGuide(item)
    if (!loaded) continue
    seen.add(key)
    guides.push(loaded)
    if (guides.length >= MAX_GROUNDED_GUIDES) break
  }

  return guides
}

/**
 * Find catalog subjects mentioned in free text via site paths or names.
 * Longer names win over nested shorter ones (Nigeria before Niger).
 */
export function matchGuidesInText(text: string): GroundedGuide[] {
  const haystack = text.trim()
  if (!haystack) return []

  const claimed: Array<[number, number]> = []
  const ordered: GuideCandidate[] = []
  const seen = new Set<string>()

  const claim = (start: number, end: number, candidate: GuideCandidate) => {
    if (claimed.some(([a, b]) => start < b && end > a)) {
      return
    }
    const key = candidateKey(candidate)
    if (seen.has(key)) return
    claimed.push([start, end])
    seen.add(key)
    ordered.push(candidate)
  }

  const pathPattern =
    /(?:^|[^A-Za-z0-9])\/(explore|space)\/([a-z0-9-]+)(?![a-z0-9-])/gi
  for (const match of haystack.matchAll(pathPattern)) {
    const collection = match[1] as 'explore' | 'space'
    const slug = match[2]!
    const token = match[0]!
    const path = `/${collection}/${slug}`
    const pathOffset = token.indexOf(path)
    if (pathOffset < 0) continue
    const start = (match.index ?? 0) + pathOffset
    const end = start + path.length
    claim(start, end, { collection, slug, name: slug })
  }

  const byName = allCandidates().sort((a, b) => b.name.length - a.name.length)

  for (const candidate of byName) {
    if (seen.has(candidateKey(candidate))) continue
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(candidate.name)}(?![\\p{L}\\p{N}])`,
      'giu',
    )
    const match = pattern.exec(haystack)
    if (!match) continue
    claim(match.index, match.index + match[0].length, candidate)
  }

  return resolveFocusGuides(
    ordered.map(({ collection, slug }) => ({ collection, slug })),
  )
}

/**
 * Merge explicit Ask Cleo focus guides with text matches from the turn.
 * Focus guides are listed first; total capped at MAX_GROUNDED_GUIDES.
 */
export function selectGroundedGuides(options: {
  focusGuides?: readonly PortalGuideFocus[]
  text: string
}): GroundedGuide[] {
  const focused = resolveFocusGuides(options.focusGuides ?? [])
  if (focused.length >= MAX_GROUNDED_GUIDES) {
    return focused.slice(0, MAX_GROUNDED_GUIDES)
  }

  const seen = new Set(focused.map((guide) => candidateKey(guide)))
  const matched = matchGuidesInText(options.text)
  const merged = [...focused]

  for (const guide of matched) {
    const key = candidateKey(guide)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(guide)
    if (merged.length >= MAX_GROUNDED_GUIDES) break
  }

  return merged
}

function formatGuideExcerpt(guide: GroundedGuide): string {
  const highlightLabel =
    guide.collection === 'explore' ? 'Places' : 'Features'
  const highlights = guide.highlights
    .map((item) => `- ${item.name}: ${item.description}`)
    .join('\n')

  return [
    `### ${guide.name} — ${guide.href}`,
    'Orientation:',
    guide.about,
    '',
    `Facts: ${guide.factsLine}`,
    '',
    `${highlightLabel}:`,
    highlights,
    '',
    `Curated photograph: "${guide.photoTitle}" — ${guide.photoCaption}`,
    `Gallery search (preferred photo link): ${guide.galleryHref}`,
    `Gallery collection filter: ${guide.galleryFilterHref}`,
    `Static JPEG path (only if the user asks for the asset file): ${guide.photoSrc}`,
  ].join('\n')
}

/** Per-request instruction block with curated excerpts, or empty string. */
export function buildGuideGroundingInstructions(
  guides: readonly GroundedGuide[],
): string {
  if (guides.length === 0) return ''

  const excerpts = guides.map(formatGuideExcerpt).join('\n\n')

  return `<cleo_guide_excerpts>
The following curated field-guide excerpts are from this website. For evergreen orientation, places/features, and fact-plate details about these subjects:
- Prefer these excerpts over memory or web_search.
- Paraphrase in your normal voice — do not paste the Orientation block verbatim.
- Still weave one Markdown deep link to the field guide using the exact path shown (short subject-name label).
- When the look of a place or body matters — or the user asks about a photograph — also weave one Markdown link to the Gallery search URL shown (short photo/subject label). Prefer Gallery search over the collection filter; use the filter when talking about a whole region or Space category. Do not invent image URLs. Do not link the static JPEG path unless the user asks for the file.
- Use web_search for current events, live data, or claims these excerpts do not cover.
- If the user asks about something outside these excerpts, answer normally (catalog paths still apply).

${excerpts}
</cleo_guide_excerpts>`
}

/** Collect grounding text from the latest user turns (follow-ups stay useful). */
export function conversationGroundingText(
  messages: readonly { role: string; content: string }[],
): string {
  const userTexts = messages
    .filter((message) => message.role === 'user' && message.content.trim())
    .map((message) => message.content.trim())
    .slice(-3)

  return userTexts.join('\n')
}

/** Parse API `focusGuides` values; unknown shapes become an empty list. */
export function parseFocusGuideInput(value: unknown): PortalGuideFocus[] | null {
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    return null
  }

  if (value.length > MAX_GROUNDED_GUIDES) {
    return null
  }

  const tokens: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') {
      return null
    }
    if (!parseGuideFocus(item)) {
      return null
    }
    tokens.push(item)
  }

  return resolveFocusGuides(
    tokens.map((token) => parseGuideFocus(token)!),
  ).map((guide) => ({
    collection: guide.collection,
    slug: guide.slug,
  }))
}
