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
import { allGalleryItems, gallerySearchHref } from '~/lib/gallery'

export const LOOKUP_GUIDE_TOOL_NAME = 'lookup_guide'
export const SEARCH_GALLERY_TOOL_NAME = 'search_gallery'

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

function clampLimit(value: unknown, fallback = 5) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }
  return Math.max(1, Math.min(8, Math.trunc(value)))
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
    if (name === SEARCH_GALLERY_TOOL_NAME) {
      const query = typeof args.query === 'string' ? args.query.trim() : ''
      return query ? `Searching Gallery for “${query}”` : 'Searching Gallery'
    }
  } catch {
    /* ignore */
  }
  return undefined
}
