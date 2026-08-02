/**
 * Assembles the homepage search catalog: topic collections, country and space
 * guides, curated photographs, Writing posts, and portal surfaces. Import from
 * Server Components only — it pulls every guide record, reads the post files,
 * and walks the photo manifests.
 *
 * Hits stay deliberately thin. Titles, subtitles, and each kind's own
 * vocabulary are indexed by `lib/site-search.ts` on the client, so `keywords`
 * carries only the terms those fields miss.
 */

import { allAtlasEntries } from '~/lib/atlas'
import { buildPostRail, getAllPosts, type Post } from '~/lib/content'
import { formatMonthYear } from '~/lib/date'
import { allGalleryItems, galleryItemDomId } from '~/lib/gallery'
import type { SiteSearchHit, SiteSearchKind } from '~/lib/site-search'
import { spaceSubjects } from '~/lib/space'
import { allTopics } from '~/lib/topics'

const WORD = /[\p{L}\p{N}]+/gu

/** Section names carry a post's subject; the whole body would not stay lean. */
const MAX_POST_HEADINGS = 12

type SurfaceSeed = {
  title: string
  subtitle: string
  href: string
  keywords: string
}

const PORTAL_SURFACES: SurfaceSeed[] = [
  {
    title: 'Explore',
    subtitle: 'Country guides',
    href: '/explore',
    keywords: 'atlas field guides places world map',
  },
  {
    title: 'Gallery',
    subtitle: 'Photographs',
    href: '/gallery',
    keywords: 'curated places bodies photos images',
  },
  {
    title: 'Ask Cleo',
    subtitle: 'AI agent',
    href: '/cleo',
    keywords: 'ai assistant question answer chat search web',
  },
  {
    title: 'Writing',
    subtitle: 'Essays',
    href: '/blog',
    keywords: 'notes articles index',
  },
  {
    title: 'Topics',
    subtitle: 'Collections',
    href: '/topics',
    keywords: 'catalog subjects collections',
  },
  {
    title: 'Home',
    subtitle: 'Portal',
    href: '/',
    keywords: 'start overview front',
  },
]

/**
 * Distinct lowercase terms the title and subtitle do not already cover. The
 * catalog ships to the browser with the page, so every repeated word costs
 * bytes on the homepage.
 */
function extraKeywords(
  indexed: string,
  ...parts: (string | undefined)[]
): string {
  // Locale-invariant, so a build machine's locale cannot lowercase a term
  // differently from the way the browser folds it back at index time.
  const seen = new Set(indexed.toLowerCase().match(WORD) ?? [])
  const terms: string[] = []

  for (const part of parts) {
    for (const token of (part ?? '').toLowerCase().match(WORD) ?? []) {
      if (token.length < 2 || seen.has(token)) continue
      seen.add(token)
      terms.push(token)
    }
  }

  return terms.join(' ')
}

function hit(
  kind: SiteSearchKind,
  id: string,
  title: string,
  subtitle: string,
  href: string,
  ...keywordParts: (string | undefined)[]
): SiteSearchHit {
  const keywords = extraKeywords(`${title} ${subtitle}`, ...keywordParts)
  return {
    id,
    kind,
    title,
    subtitle,
    href,
    ...(keywords ? { keywords } : {}),
  }
}

function topicHits(): SiteSearchHit[] {
  return allTopics().map((topic) =>
    hit(
      'topic',
      `topic:${topic.slug}`,
      topic.name,
      topic.tally,
      topic.href,
      topic.description,
    ),
  )
}

function exploreHits(): SiteSearchHit[] {
  return allAtlasEntries().map((entry) =>
    hit(
      'explore',
      `explore:${entry.slug}`,
      entry.name,
      `${entry.code} · ${entry.region}`,
      `/explore/${entry.slug}`,
      entry.subregion,
      entry.facts.capital,
      entry.facts.languages.join(' '),
      entry.facts.currency,
      entry.places.map((place) => place.name).join(' '),
    ),
  )
}

function spaceHits(): SiteSearchHit[] {
  return spaceSubjects.map((subject) =>
    hit(
      'space',
      `space:${subject.slug}`,
      subject.name,
      `${subject.code} · ${subject.category}`,
      `/space/${subject.slug}`,
      subject.subtitle,
      subject.facts.kind,
      subject.facts.system,
      subject.features.map((feature) => feature.name).join(' '),
    ),
  )
}

/**
 * The editor-selected photograph for each place and body — the same focused
 * index `/gallery` shows, so every photo result has a tile to land on.
 */
function photoHits(): SiteSearchHit[] {
  return allGalleryItems().map((item) =>
    hit(
      'photo',
      `photo:${item.id}`,
      item.title,
      item.subtitle,
      `/gallery#${galleryItemDomId(item)}`,
      item.filterKey,
    ),
  )
}

function postHeadings(post: Post): string {
  return buildPostRail(post.title, post.body)
    .flatMap((node) =>
      node.kind === 'landmark' && node.variant === 'heading' ? [node.label] : [],
    )
    .slice(0, MAX_POST_HEADINGS)
    .join(' ')
}

function writingHits(): SiteSearchHit[] {
  return getAllPosts().map((post) =>
    hit(
      'writing',
      `writing:${post.slug}`,
      post.title,
      formatMonthYear(post.publishedAt),
      `/blog/${post.slug}`,
      post.description,
      postHeadings(post),
    ),
  )
}

function surfaceHits(): SiteSearchHit[] {
  return PORTAL_SURFACES.map((surface) =>
    hit(
      'surface',
      `surface:${surface.href}`,
      surface.title,
      surface.subtitle,
      surface.href,
      surface.keywords,
    ),
  )
}

/** Full static catalog for the homepage search typeahead. */
export function buildSiteSearchHits(): SiteSearchHit[] {
  return [
    ...topicHits(),
    ...exploreHits(),
    ...spaceHits(),
    ...photoHits(),
    ...writingHits(),
    ...surfaceHits(),
  ]
}

/** Starting points offered before the visitor has typed anything. */
const SPOTLIGHT_IDS = [
  'topic:countries',
  'topic:space',
  'explore:japan',
  'space:mars',
  'surface:/gallery',
  'surface:/cleo',
]

/** Spotlight ids that exist in the catalog, so the empty state cannot drift. */
export function siteSearchSpotlightIds(hits: SiteSearchHit[]): string[] {
  const known = new Set(hits.map((entry) => entry.id))
  return SPOTLIGHT_IDS.filter((id) => known.has(id))
}
