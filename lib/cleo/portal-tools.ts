/**
 * Custom Responses API function tools for Cleo’s portal catalog.
 * Executed server-side in the /api/responses agentic loop.
 */

import type { FunctionTool } from 'openai/resources/responses/responses'

import { parseGuideFocus } from '~/lib/cleo/ask-links'
import {
  loadGroundedGuideCompact,
  matchGuidesInText,
} from '~/lib/cleo/guide-grounding'
import { countries } from '~/lib/countries'
import { allGalleryItems, gallerySearchHref } from '~/lib/gallery'
import { spaceSubjects } from '~/lib/space'

export const LOOKUP_GUIDE_TOOL_NAME = 'lookup_guide'
export const LIST_GUIDES_TOOL_NAME = 'list_guides'
export const SEARCH_GALLERY_TOOL_NAME = 'search_gallery'

const EXPLORE_GROUPS = [
  ...new Set(countries.map((country) => country.region)),
].sort()
const SPACE_GROUPS = [
  ...new Set(spaceSubjects.map((subject) => subject.category)),
]

export const PORTAL_FUNCTION_TOOLS: FunctionTool[] = [
  {
    type: 'function',
    name: LOOKUP_GUIDE_TOOL_NAME,
    description:
      'Load the curated Explore or Space field-guide record for a subject on this site (orientation, facts, places/features, Gallery photo links). Use when you need accurate site content beyond a brief mention, or when no excerpt was pre-attached.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        collection: {
          type: ['string', 'null'],
          enum: ['explore', 'space', null],
          description:
            'Guide collection when known. Null to resolve from name alone.',
        },
        slug: {
          type: ['string', 'null'],
          description: 'Canonical slug such as japan or europa. Null if unknown.',
        },
        name: {
          type: ['string', 'null'],
          description: 'Subject display name such as Japan or Europa.',
        },
      },
      required: ['collection', 'slug', 'name'],
    },
  },
  {
    type: 'function',
    name: LIST_GUIDES_TOOL_NAME,
    description:
      'Browse or filter the site’s Explore country guides and Space field guides. Use to discover subjects by region/category or name before recommending a reading path; prefer lookup_guide for full orientation on a chosen pick.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        collection: {
          type: ['string', 'null'],
          enum: ['explore', 'space', null],
          description:
            'Which catalog to browse. Null returns both (compact).',
        },
        group: {
          type: ['string', 'null'],
          description:
            'Explore region (Africa, Americas, Asia, Europe, Oceania) or Space category (Solar System, Moons, Deep Space). Null for any.',
        },
        query: {
          type: ['string', 'null'],
          description:
            'Optional name/slug substring filter, e.g. japan, nebula, europe.',
        },
        limit: {
          type: ['integer', 'null'],
          description: 'Max guides to return (1–24). Null defaults to 12.',
        },
      },
      required: ['collection', 'group', 'query', 'limit'],
    },
  },
  {
    type: 'function',
    name: SEARCH_GALLERY_TOOL_NAME,
    description:
      'Search curated Gallery photographs (Explore places and Space bodies) by country, place, region, or space subject. Returns titles, captions, field-guide hrefs, and Gallery deep links.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        query: {
          type: 'string',
          description: 'Search text, e.g. Japan, Mount Fuji, Mars, Solar System.',
        },
        limit: {
          type: ['integer', 'null'],
          description: 'Max results to return (1–8). Null defaults to 5.',
        },
      },
      required: ['query', 'limit'],
    },
  },
]

function clampLimit(value: unknown, fallback = 5, max = 8) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }
  return Math.max(1, Math.min(max, Math.trunc(value)))
}

type ListedGuide = {
  collection: 'explore' | 'space'
  group: string
  href: string
  name: string
  slug: string
  subtitle?: string
}

function normalizeGroupKey(value: string) {
  return value.trim().toLowerCase()
}

function listGuidesFromArgs(args: Record<string, unknown>): unknown {
  const collection =
    args.collection === 'explore' || args.collection === 'space'
      ? args.collection
      : null
  const group =
    typeof args.group === 'string' && args.group.trim()
      ? args.group.trim()
      : null
  const query =
    typeof args.query === 'string' && args.query.trim()
      ? args.query.trim().toLowerCase()
      : null
  const limit = clampLimit(args.limit, 12, 24)

  const explore: ListedGuide[] = countries.map((country) => ({
    collection: 'explore',
    group: country.region,
    href: `/explore/${country.slug}`,
    name: country.name,
    slug: country.slug,
    subtitle: country.subregion,
  }))

  const space: ListedGuide[] = spaceSubjects.map((subject) => ({
    collection: 'space',
    group: subject.category,
    href: `/space/${subject.slug}`,
    name: subject.name,
    slug: subject.slug,
    subtitle: subject.subtitle,
  }))

  let pool =
    collection === 'explore'
      ? explore
      : collection === 'space'
        ? space
        : [...explore, ...space]

  if (group) {
    const needle = normalizeGroupKey(group)
    const filtered = pool.filter(
      (guide) => normalizeGroupKey(guide.group) === needle,
    )
    if (filtered.length === 0) {
      return {
        ok: false,
        error: `Unknown group “${group}”.`,
        exploreGroups: EXPLORE_GROUPS,
        spaceGroups: SPACE_GROUPS,
      }
    }
    pool = filtered
  }

  if (query) {
    pool = pool.filter((guide) => {
      const haystack = [
        guide.name,
        guide.slug,
        guide.group,
        guide.subtitle ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }

  const results = pool.slice(0, limit).map((guide) => ({
    collection: guide.collection,
    group: guide.group,
    href: guide.href,
    name: guide.name,
    slug: guide.slug,
    ...(guide.subtitle ? { subtitle: guide.subtitle } : {}),
  }))

  return {
    ok: true,
    collection: collection ?? 'all',
    group,
    query,
    count: results.length,
    totalMatched: pool.length,
    exploreGroups: EXPLORE_GROUPS,
    spaceGroups: SPACE_GROUPS,
    results,
  }
}

function lookupGuideFromArgs(args: Record<string, unknown>): unknown {
  const collection =
    args.collection === 'explore' || args.collection === 'space'
      ? args.collection
      : null
  const slug = typeof args.slug === 'string' ? args.slug.trim() : ''
  const name = typeof args.name === 'string' ? args.name.trim() : ''

  if (collection && slug) {
    const focus = parseGuideFocus(`${collection}/${slug}`)
    if (focus) {
      const guide = loadGroundedGuideCompact(focus)
      if (guide) return { ok: true, guide }
    }
  }

  const haystack = [name, slug].filter(Boolean).join(' ')
  const matched = matchGuidesInText(haystack)
  const preferred =
    (collection
      ? matched.find((guide) => guide.collection === collection)
      : null) ?? matched[0]

  if (!preferred) {
    return {
      ok: false,
      error: 'No matching Explore or Space guide on this site.',
    }
  }

  return {
    ok: true,
    guide: loadGroundedGuideCompact({
      collection: preferred.collection,
      slug: preferred.slug,
    }),
  }
}

function searchGalleryFromArgs(args: Record<string, unknown>): unknown {
  const query = typeof args.query === 'string' ? args.query.trim() : ''
  if (!query) {
    return { ok: false, error: 'A non-empty query is required.' }
  }

  const limit = clampLimit(args.limit)
  const needle = query.toLowerCase()
  const results = allGalleryItems()
    .filter((item) => item.searchText.toLowerCase().includes(needle))
    .slice(0, limit)
    .map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      collection: item.collection,
      filterKey: item.filterKey,
      guideHref: item.href,
      galleryHref: gallerySearchHref(item.subtitle),
      caption: item.photo.caption,
      photographer: item.photo.photographer,
    }))

  return {
    ok: true,
    query,
    count: results.length,
    gallerySearchHref: gallerySearchHref(query),
    results,
  }
}

/** Run a portal function tool; always returns a JSON string for the model. */
export function executePortalTool(name: string, argumentsJson: string): string {
  let args: Record<string, unknown> = {}

  try {
    const parsed = JSON.parse(argumentsJson) as unknown
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      args = parsed as Record<string, unknown>
    }
  } catch {
    return JSON.stringify({
      ok: false,
      error: 'Tool arguments must be valid JSON.',
    })
  }

  try {
    if (name === LOOKUP_GUIDE_TOOL_NAME) {
      return JSON.stringify(lookupGuideFromArgs(args))
    }
    if (name === LIST_GUIDES_TOOL_NAME) {
      return JSON.stringify(listGuidesFromArgs(args))
    }
    if (name === SEARCH_GALLERY_TOOL_NAME) {
      return JSON.stringify(searchGalleryFromArgs(args))
    }
    return JSON.stringify({ ok: false, error: `Unknown tool: ${name}` })
  } catch (error) {
    return JSON.stringify({
      ok: false,
      error:
        error instanceof Error ? error.message : 'Tool execution failed.',
    })
  }
}

export function portalToolActivitySummary(
  name: string,
  argumentsJson: string,
): string | undefined {
  try {
    const args = JSON.parse(argumentsJson) as Record<string, unknown>
    if (name === LOOKUP_GUIDE_TOOL_NAME) {
      const label =
        (typeof args.name === 'string' && args.name.trim()) ||
        (typeof args.slug === 'string' && args.slug.trim()) ||
        'guide'
      return `Looking up ${label}`
    }
    if (name === LIST_GUIDES_TOOL_NAME) {
      const group = typeof args.group === 'string' ? args.group.trim() : ''
      const query = typeof args.query === 'string' ? args.query.trim() : ''
      const collection =
        args.collection === 'explore' || args.collection === 'space'
          ? args.collection
          : 'guides'
      if (group) return `Browsing ${group}`
      if (query) return `Listing guides for “${query}”`
      return `Listing ${collection}`
    }
    if (name === SEARCH_GALLERY_TOOL_NAME) {
      const query = typeof args.query === 'string' ? args.query.trim() : ''
      return query ? `Searching Gallery for “${query}”` : 'Searching Gallery'
    }
  } catch {
    /* ignore */
  }
  return undefined
}
