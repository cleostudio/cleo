/**
 * Portal function tools for the Responses API — search/lookup Explore & Space
 * guides and curated topic photographs without stuffing the full catalog into
 * developer instructions.
 */

import type { FunctionTool } from 'openai/resources/responses/responses'

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import { countries } from '~/lib/countries'
import { filterSiteSearchHits, type SiteSearchHit } from '~/lib/site-search'
import { getSpaceSubject, spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

import {
  resolveTopicPhotos,
  type TopicPhoto,
} from '~/lib/cleo/topic-photos'

export const PORTAL_TOOL_NAMES = [
  'search_portal_topics',
  'lookup_guide',
  'get_topic_photos',
] as const

export type PortalToolName = (typeof PORTAL_TOOL_NAMES)[number]

export function isPortalToolName(value: string): value is PortalToolName {
  return (PORTAL_TOOL_NAMES as readonly string[]).includes(value)
}

function haystack(...parts: string[]) {
  return parts
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join(' ')
}

function portalSearchCatalog(): SiteSearchHit[] {
  return [
    ...countries.map((country) => ({
      id: `explore:${country.slug}`,
      kind: 'explore' as const,
      title: country.name,
      subtitle: `${country.code} · ${country.region}`,
      href: `/explore/${country.slug}`,
      searchText: haystack(
        country.name,
        country.code,
        country.region,
        country.subregion,
        'country',
        'explore',
      ),
    })),
    ...spaceSubjects.map((subject) => ({
      id: `space:${subject.slug}`,
      kind: 'space' as const,
      title: subject.name,
      subtitle: `${subject.code} · ${subject.category}`,
      href: `/space/${subject.slug}`,
      searchText: haystack(
        subject.name,
        subject.code,
        subject.category,
        subject.facts.kind,
        subject.subtitle,
        'space',
      ),
    })),
  ]
}

/** Truncate evergreen about prose for tool payloads. */
function clipAbout(about: string, maxChars = 480) {
  const trimmed = about.trim()
  if (trimmed.length <= maxChars) return trimmed
  const slice = trimmed.slice(0, maxChars)
  const boundary = slice.lastIndexOf(' ')
  return `${(boundary > 200 ? slice.slice(0, boundary) : slice).trimEnd()}…`
}

export const PORTAL_FUNCTION_TOOLS: FunctionTool[] = [
  {
    type: 'function',
    name: 'search_portal_topics',
    description:
      'Search this site’s Explore country guides and Space field guides by name, region, category, or keywords. Use before linking a guide when you are unsure of the exact slug, or to discover related subjects.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (country, planet, moon, region, keyword).',
        },
        limit: {
          type: 'integer',
          description: 'Max hits to return (1–12). Defaults to 6.',
        },
      },
      required: ['query', 'limit'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'lookup_guide',
    description:
      'Load one Explore or Space field guide by collection and slug: orientation summary, key facts, site path, and curated photograph path for Markdown embedding.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          enum: ['explore', 'space'],
          description: 'Guide collection.',
        },
        slug: {
          type: 'string',
          description: 'Exact guide slug (e.g. japan, europa).',
        },
      },
      required: ['collection', 'slug'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'get_topic_photos',
    description:
      'Resolve curated Explore/Space JPEG paths for one or more catalog subjects so you can embed real site photographs with Markdown image syntax.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        topics: {
          type: 'array',
          description: 'Subjects to resolve photographs for.',
          items: {
            type: 'object',
            properties: {
              collection: {
                type: 'string',
                enum: ['explore', 'space'],
              },
              slug: {
                type: 'string',
              },
            },
            required: ['collection', 'slug'],
            additionalProperties: false,
          },
        },
      },
      required: ['topics'],
      additionalProperties: false,
    },
  },
]

function searchPortalTopics(query: string, limit: number) {
  const capped = Math.min(12, Math.max(1, Number.isFinite(limit) ? limit : 6))
  const hits = filterSiteSearchHits(portalSearchCatalog(), query, capped)
  return {
    query,
    count: hits.length,
    results: hits.map((hit) => ({
      collection: hit.kind,
      name: hit.title,
      slug: hit.href.split('/').pop(),
      href: hit.href,
      subtitle: hit.subtitle,
    })),
  }
}

function lookupGuide(collection: 'explore' | 'space', slug: string) {
  const normalized = slug.trim().toLowerCase()

  if (collection === 'explore') {
    const entry = getAtlasEntry(normalized)
    if (!entry) {
      return { found: false, collection, slug: normalized }
    }
    const photo = {
      title: entry.photo.placeName,
      alt: entry.photo.alt,
      caption: entry.photo.caption,
      src: atlasRendition(entry.photo, 1280).src,
    }
    return {
      found: true,
      collection,
      slug: entry.slug,
      name: entry.name,
      href: `/explore/${entry.slug}`,
      region: entry.region,
      subregion: entry.subregion,
      about: clipAbout(entry.about),
      facts: entry.facts,
      places: entry.places.map((place) => place.name),
      photo,
      markdownImage: `![${photo.title}](${photo.src})`,
      markdownLink: `[${entry.name}](/explore/${entry.slug})`,
    }
  }

  const subject = getSpaceSubject(normalized)
  if (!subject) {
    return { found: false, collection, slug: normalized }
  }

  const photo = {
    title: subject.photo.featureName,
    alt: subject.photo.alt,
    caption: subject.photo.caption,
    src: staticRendition(subject.photo, 1280).src,
  }

  return {
    found: true,
    collection,
    slug: subject.slug,
    name: subject.name,
    href: `/space/${subject.slug}`,
    category: subject.category,
    subtitle: subject.subtitle,
    about: clipAbout(subject.about),
    facts: subject.facts,
    features: subject.features.map((feature) => feature.name),
    photo,
    markdownImage: `![${photo.title}](${photo.src})`,
    markdownLink: `[${subject.name}](/space/${subject.slug})`,
  }
}

function getTopicPhotosPayload(
  topics: readonly { collection: 'explore' | 'space'; slug: string }[],
) {
  const photos: TopicPhoto[] = resolveTopicPhotos(
    topics.map((topic) => ({
      collection: topic.collection,
      slug: topic.slug.trim().toLowerCase(),
    })),
  )

  return {
    count: photos.length,
    photos: photos.map((photo) => ({
      collection: photo.collection,
      slug: photo.slug,
      name: photo.name,
      href: photo.href,
      title: photo.title,
      alt: photo.alt,
      caption: photo.caption,
      src: photo.src,
      markdownImage: `![${photo.title.replace(/[\[\]\r\n]+/g, ' ').trim()}](${photo.src})`,
    })),
  }
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null
    }
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

/** Execute a portal function tool; always returns a JSON string for the model. */
export function executePortalTool(name: string, argumentsJson: string): string {
  if (!isPortalToolName(name)) {
    return JSON.stringify({ error: `Unknown portal tool: ${name}` })
  }

  const args = parseJsonObject(argumentsJson)
  if (!args) {
    return JSON.stringify({ error: 'Tool arguments must be a JSON object.' })
  }

  try {
    if (name === 'search_portal_topics') {
      const query = typeof args.query === 'string' ? args.query : ''
      const limit =
        typeof args.limit === 'number'
          ? args.limit
          : typeof args.limit === 'string'
            ? Number(args.limit)
            : 6
      if (!query.trim()) {
        return JSON.stringify({ error: 'query is required.', results: [] })
      }
      return JSON.stringify(searchPortalTopics(query, limit))
    }

    if (name === 'lookup_guide') {
      const collection = args.collection
      const slug = typeof args.slug === 'string' ? args.slug : ''
      if (collection !== 'explore' && collection !== 'space') {
        return JSON.stringify({ error: 'collection must be explore or space.' })
      }
      if (!slug.trim()) {
        return JSON.stringify({ error: 'slug is required.', found: false })
      }
      return JSON.stringify(lookupGuide(collection, slug))
    }

    const topicsRaw = args.topics
    if (!Array.isArray(topicsRaw)) {
      return JSON.stringify({ error: 'topics must be an array.', photos: [] })
    }

    const topics: { collection: 'explore' | 'space'; slug: string }[] = []
    for (const item of topicsRaw) {
      if (typeof item !== 'object' || item === null) continue
      const record = item as Record<string, unknown>
      const collection = record.collection
      const slug = record.slug
      if (
        (collection === 'explore' || collection === 'space') &&
        typeof slug === 'string' &&
        slug.trim()
      ) {
        topics.push({ collection, slug })
      }
    }

    return JSON.stringify(getTopicPhotosPayload(topics))
  } catch (error) {
    return JSON.stringify({
      error:
        error instanceof Error ? error.message : 'Portal tool execution failed.',
    })
  }
}

/** Short label for the activity panel. */
export function portalToolActivityLabel(
  name: string,
  argumentsJson: string,
  status: 'in_progress' | 'completed' | 'failed',
): string {
  const args = parseJsonObject(argumentsJson) ?? {}

  if (name === 'search_portal_topics') {
    const query = typeof args.query === 'string' ? args.query.trim() : ''
    if (status === 'completed') {
      return query ? `Searched guides for “${query}”` : 'Searched portal guides'
    }
    return query ? `Searching guides for “${query}”` : 'Searching portal guides'
  }

  if (name === 'lookup_guide') {
    const slug = typeof args.slug === 'string' ? args.slug.trim() : ''
    if (status === 'completed') {
      return slug ? `Opened guide “${slug}”` : 'Opened a field guide'
    }
    return slug ? `Opening guide “${slug}”` : 'Opening a field guide'
  }

  if (name === 'get_topic_photos') {
    if (status === 'completed') {
      return 'Fetched topic photographs'
    }
    return 'Fetching topic photographs'
  }

  return status === 'completed' ? 'Used a portal tool' : 'Using a portal tool'
}
