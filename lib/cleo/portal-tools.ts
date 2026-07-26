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
export const COMPARE_GUIDES_TOOL_NAME = 'compare_guides'
export const PLAN_READING_PATH_TOOL_NAME = 'plan_reading_path'
export const SEARCH_GALLERY_TOOL_NAME = 'search_gallery'

const GUIDE_SUBJECT_PARAMS = {
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
} as const

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
    name: COMPARE_GUIDES_TOOL_NAME,
    description:
      'Load two curated Explore/Space field guides side by side (orientation, facts, highlights, Gallery links). Prefer this over two separate lookup_guide calls when comparing subjects or building a two-stop path.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        left: GUIDE_SUBJECT_PARAMS,
        right: GUIDE_SUBJECT_PARAMS,
      },
      required: ['left', 'right'],
    },
  },
  {
    type: 'function',
    name: PLAN_READING_PATH_TOOL_NAME,
    description:
      'Build a 2–4 stop reading path of real Explore/Space guides for a theme (e.g. moons, Deep Space intro, Asia islands). Returns ordered stops with hrefs, short orientation, and Gallery links so you can synthesize a path without inventing slugs.',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        theme: {
          type: 'string',
          description:
            'Path theme or goal, e.g. three-stop Space intro, icy moons, Southeast Asia.',
        },
        collection: {
          type: ['string', 'null'],
          enum: ['explore', 'space', null],
          description: 'Prefer one catalog when known. Null to infer from theme.',
        },
        stops: {
          type: ['integer', 'null'],
          description: 'Number of stops (2–4). Null defaults to 3.',
        },
      },
      required: ['theme', 'collection', 'stops'],
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

function resolveGuideFromSubjectArgs(args: Record<string, unknown>) {
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
      if (guide) return { ok: true as const, guide }
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
      ok: false as const,
      error: 'No matching Explore or Space guide on this site.',
    }
  }

  const guide = loadGroundedGuideCompact({
    collection: preferred.collection,
    slug: preferred.slug,
  })

  if (!guide) {
    return {
      ok: false as const,
      error: 'No matching Explore or Space guide on this site.',
    }
  }

  return { ok: true as const, guide }
}

function lookupGuideFromArgs(args: Record<string, unknown>): unknown {
  return resolveGuideFromSubjectArgs(args)
}

function asSubjectArgs(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }
  return value as Record<string, unknown>
}

const PATH_ROLES = ['starter', 'stretch', 'payoff', 'encore'] as const

function firstSentence(text: string, maxLength = 180) {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/)
  const sentence = (match?.[0] ?? trimmed).trim()
  if (sentence.length <= maxLength) return sentence
  return `${sentence.slice(0, maxLength - 1).trimEnd()}…`
}

function inferPathCollection(
  theme: string,
  collection: 'explore' | 'space' | null,
): 'explore' | 'space' | null {
  if (collection) return collection
  const lower = theme.toLowerCase()
  if (
    /\b(moon|planet|nebula|galaxy|solar|space|mars|jupiter|earth|europa)\b/.test(
      lower,
    )
  ) {
    return 'space'
  }
  if (
    /\b(country|countries|asia|africa|europe|americas|oceania|island|travel)\b/.test(
      lower,
    )
  ) {
    return 'explore'
  }
  return null
}

function inferPathGroup(theme: string, collection: 'explore' | 'space' | null) {
  const lower = theme.toLowerCase()
  if (collection === 'space' || !collection) {
    if (/\bmoons?\b/.test(lower)) return 'Moons'
    if (/\bdeep\s*space\b|\bnebula|\bgalaxy\b/.test(lower)) return 'Deep Space'
    if (/\bsolar\s*system\b|\bplanet/.test(lower)) return 'Solar System'
  }
  if (collection === 'explore' || !collection) {
    for (const region of EXPLORE_GROUPS) {
      if (lower.includes(region.toLowerCase())) return region
    }
  }
  return null
}

function pickPathCandidates<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items.slice()
  if (count === 1) return [items[0]!]
  if (count === 2) return [items[0]!, items[items.length - 1]!]

  const last = items.length - 1
  const mid = Math.floor(last / 2)
  const third = Math.floor((last * 2) / 3)
  const indexes =
    count === 3 ? [0, mid, last] : [0, Math.floor(last / 3), third, last]
  return [...new Set(indexes)].slice(0, count).map((index) => items[index]!)
}

function planReadingPathFromArgs(args: Record<string, unknown>): unknown {
  const theme = typeof args.theme === 'string' ? args.theme.trim() : ''
  if (!theme) {
    return { ok: false, error: 'A non-empty theme is required.' }
  }

  const collection =
    args.collection === 'explore' || args.collection === 'space'
      ? args.collection
      : null
  const stopCount = clampLimit(args.stops, 3, 4)
  const inferredCollection = inferPathCollection(theme, collection)
  const group = inferPathGroup(theme, inferredCollection)

  const listed = listGuidesFromArgs({
    collection: inferredCollection,
    group,
    query: group ? null : theme,
    limit: 24,
  }) as {
    ok: boolean
    results?: ListedGuide[]
    error?: string
  }

  let candidates = listed.ok ? (listed.results ?? []) : []

  if (candidates.length < stopCount) {
    const broader = listGuidesFromArgs({
      collection: inferredCollection,
      group: null,
      query: null,
      limit: 24,
    }) as { ok: boolean; results?: ListedGuide[] }
    if (broader.ok && broader.results?.length) {
      candidates = broader.results
    }
  }

  if (candidates.length === 0) {
    return {
      ok: false,
      error: 'No matching guides for that reading-path theme.',
      theme,
    }
  }

  const picked = pickPathCandidates(candidates, Math.min(stopCount, candidates.length))
  const stops = picked.map((item, index) => {
    const resolved = resolveGuideFromSubjectArgs({
      collection: item.collection,
      slug: item.slug,
      name: item.name,
    })
    const role = PATH_ROLES[Math.min(index, PATH_ROLES.length - 1)]!
    if (!resolved.ok) {
      return {
        role,
        href: item.href,
        name: item.name,
        slug: item.slug,
        collection: item.collection,
      }
    }
    return {
      role,
      href: resolved.guide.href,
      name: resolved.guide.name,
      slug: resolved.guide.slug,
      collection: resolved.guide.collection,
      orientation: firstSentence(resolved.guide.about),
      galleryHref: resolved.guide.photo?.galleryHref,
      photoTitle: resolved.guide.photo?.title,
    }
  })

  return {
    ok: true,
    theme,
    collection: inferredCollection ?? 'all',
    group,
    count: stops.length,
    stops,
    note: 'Synthesize a readable path in your voice using these exact hrefs; do not invent additional guide slugs.',
  }
}

function compareGuidesFromArgs(args: Record<string, unknown>): unknown {
  const leftArgs = asSubjectArgs(args.left)
  const rightArgs = asSubjectArgs(args.right)

  if (!leftArgs || !rightArgs) {
    return {
      ok: false,
      error: 'Both left and right guide subjects are required.',
    }
  }

  const left = resolveGuideFromSubjectArgs(leftArgs)
  const right = resolveGuideFromSubjectArgs(rightArgs)

  if (!left.ok || !right.ok) {
    return {
      ok: false,
      error: 'Could not resolve both guides for comparison.',
      left: left.ok ? { ok: true, guide: left.guide } : left,
      right: right.ok ? { ok: true, guide: right.guide } : right,
    }
  }

  if (left.guide.href === right.guide.href) {
    return {
      ok: false,
      error: 'Choose two different guides to compare.',
      left: { ok: true, guide: left.guide },
      right: { ok: true, guide: right.guide },
    }
  }

  return {
    ok: true,
    left: left.guide,
    right: right.guide,
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
    if (name === COMPARE_GUIDES_TOOL_NAME) {
      return JSON.stringify(compareGuidesFromArgs(args))
    }
    if (name === PLAN_READING_PATH_TOOL_NAME) {
      return JSON.stringify(planReadingPathFromArgs(args))
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
    if (name === COMPARE_GUIDES_TOOL_NAME) {
      const left = asSubjectArgs(args.left)
      const right = asSubjectArgs(args.right)
      const leftLabel =
        (typeof left?.name === 'string' && left.name.trim()) ||
        (typeof left?.slug === 'string' && left.slug.trim()) ||
        'guide'
      const rightLabel =
        (typeof right?.name === 'string' && right.name.trim()) ||
        (typeof right?.slug === 'string' && right.slug.trim()) ||
        'guide'
      return `Comparing ${leftLabel} and ${rightLabel}`
    }
    if (name === PLAN_READING_PATH_TOOL_NAME) {
      const theme = typeof args.theme === 'string' ? args.theme.trim() : ''
      return theme
        ? `Planning a path for “${theme}”`
        : 'Planning a reading path'
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
