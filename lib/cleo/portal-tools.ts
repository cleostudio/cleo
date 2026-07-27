/**
 * Portal function tools for the Responses API — search/lookup Explore & Space
 * guides and curated topic photographs without stuffing the full catalog into
 * developer instructions.
 */

import type { FunctionTool } from 'openai/resources/responses/responses'

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import { getAllPosts, getPost, isPostSlug } from '~/lib/content'
import { countries } from '~/lib/countries'
import { allGalleryItems } from '~/lib/gallery'
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
  'search_gallery',
  'search_writing',
  'lookup_writing',
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
  {
    type: 'function',
    name: 'search_gallery',
    description:
      'Search curated Gallery photographs (Explore places and Space bodies) by place name, feature, country, or keyword. Returns embeddable JPEG paths and a filtered Gallery deep-link (`galleryHref` / `galleryMarkdownLink` with ?q=).',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Photo search query (place, feature, country, body).',
        },
        limit: {
          type: 'integer',
          description: 'Max photos to return (1–8). Defaults to 4.',
        },
      },
      required: ['query', 'limit'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'search_writing',
    description:
      'Search Writing essays on this site by title or description keywords. Use before linking a blog post.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for Writing posts.',
        },
        limit: {
          type: 'integer',
          description: 'Max posts to return (1–8). Defaults to 4.',
        },
      },
      required: ['query', 'limit'],
      additionalProperties: false,
    },
  },
  {
    type: 'function',
    name: 'lookup_writing',
    description:
      'Load one Writing essay by slug: title, description, path, and a short excerpt for orientation (not the full essay).',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Exact Writing post slug.',
        },
      },
      required: ['slug'],
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

function searchGallery(query: string, limit: number) {
  const capped = Math.min(8, Math.max(1, Number.isFinite(limit) ? limit : 4))
  const q = query.trim().toLowerCase()
  if (!q) {
    return { query, count: 0, photos: [] as const }
  }

  const ranked = allGalleryItems()
    .flatMap((item) => {
      const hay =
        `${item.searchText} ${item.title} ${item.subtitle} ${item.photo.caption}`.toLowerCase()
      let rank = 5
      if (item.title.toLowerCase() === q || item.subtitle.toLowerCase() === q) {
        rank = 0
      } else if (item.title.toLowerCase().startsWith(q)) {
        rank = 1
      } else if (hay.includes(q)) {
        rank = 2
      } else {
        return []
      }
      return [{ item, rank }]
    })
    .sort(
      (a, b) =>
        a.rank - b.rank || a.item.title.localeCompare(b.item.title),
    )
    .slice(0, capped)

  return {
    query,
    count: ranked.length,
    photos: ranked.map(({ item }) => {
      const src = staticRendition(item.photo, 1280).src
      const title = item.title.replace(/[\[\]\r\n]+/g, ' ').trim()
      const galleryHref = `/gallery?q=${encodeURIComponent(query.trim())}`
      return {
        collection: item.collection,
        title: item.title,
        subtitle: item.subtitle,
        href: item.href,
        galleryHref,
        galleryMarkdownLink: `[Gallery](${galleryHref})`,
        alt: item.photo.alt,
        caption: item.photo.caption,
        src,
        markdownImage: `![${title}](${src})`,
      }
    }),
  }
}

function writingCatalog(): SiteSearchHit[] {
  return getAllPosts().map((post) => ({
    id: `writing:${post.slug}`,
    kind: 'surface' as const,
    title: post.title,
    subtitle: 'Writing',
    href: `/blog/${post.slug}`,
    searchText: haystack(post.title, post.description ?? '', post.slug, 'writing', 'essay'),
  }))
}

function searchWriting(query: string, limit: number) {
  const capped = Math.min(8, Math.max(1, Number.isFinite(limit) ? limit : 4))
  const hits = filterSiteSearchHits(writingCatalog(), query, capped)
  return {
    query,
    count: hits.length,
    results: hits.map((hit) => ({
      slug: hit.href.replace(/^\/blog\//, ''),
      title: hit.title,
      href: hit.href,
      markdownLink: `[${hit.title}](${hit.href})`,
    })),
  }
}

function stripMdxNoise(body: string) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/import\s+.+from\s+['"][^'"]+['"]\s*;?/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function lookupWriting(slug: string) {
  const normalized = slug.trim().toLowerCase()
  if (!isPostSlug(normalized)) {
    return { found: false, slug: normalized }
  }

  const post = getPost(normalized)
  const excerpt = clipAbout(stripMdxNoise(post.body), 640)

  return {
    found: true,
    slug: post.slug,
    title: post.title,
    description: post.description ?? '',
    href: `/blog/${post.slug}`,
    publishedAt: post.publishedAt.toISOString().slice(0, 10),
    readingMinutes: post.readingMinutes,
    excerpt,
    markdownLink: `[${post.title}](/blog/${post.slug})`,
  }
}

function readLimit(args: Record<string, unknown>, fallback: number) {
  if (typeof args.limit === 'number') return args.limit
  if (typeof args.limit === 'string') return Number(args.limit)
  return fallback
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
      const limit = readLimit(args, 6)
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

    if (name === 'get_topic_photos') {
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
    }

    if (name === 'search_gallery') {
      const query = typeof args.query === 'string' ? args.query : ''
      if (!query.trim()) {
        return JSON.stringify({ error: 'query is required.', photos: [] })
      }
      return JSON.stringify(searchGallery(query, readLimit(args, 4)))
    }

    if (name === 'search_writing') {
      const query = typeof args.query === 'string' ? args.query : ''
      if (!query.trim()) {
        return JSON.stringify({ error: 'query is required.', results: [] })
      }
      return JSON.stringify(searchWriting(query, readLimit(args, 4)))
    }

    const slug = typeof args.slug === 'string' ? args.slug : ''
    if (!slug.trim()) {
      return JSON.stringify({ error: 'slug is required.', found: false })
    }
    return JSON.stringify(lookupWriting(slug))
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

  if (name === 'search_gallery') {
    const query = typeof args.query === 'string' ? args.query.trim() : ''
    if (status === 'completed') {
      return query ? `Searched Gallery for “${query}”` : 'Searched the Gallery'
    }
    return query ? `Searching Gallery for “${query}”` : 'Searching the Gallery'
  }

  if (name === 'search_writing') {
    const query = typeof args.query === 'string' ? args.query.trim() : ''
    if (status === 'completed') {
      return query ? `Searched Writing for “${query}”` : 'Searched Writing'
    }
    return query ? `Searching Writing for “${query}”` : 'Searching Writing'
  }

  if (name === 'lookup_writing') {
    const slug = typeof args.slug === 'string' ? args.slug.trim() : ''
    if (status === 'completed') {
      return slug ? `Opened Writing “${slug}”` : 'Opened a Writing essay'
    }
    return slug ? `Opening Writing “${slug}”` : 'Opening a Writing essay'
  }

  return status === 'completed' ? 'Used a portal tool' : 'Using a portal tool'
}
