/**
 * Sanitize assistant Markdown so Cleo cannot invent Explore/Space guide paths
 * or curated image URLs that are not in the site catalog.
 */

import { getAtlasEntry } from '~/lib/atlas'
import { getSpaceSubject } from '~/lib/space'

const MARKDOWN_GUIDE_LINK =
  /\[([^\]]*)\]\((\/(explore|space)\/([a-z0-9-]+))\)/gi

const MARKDOWN_IMAGE =
  /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

const CURATED_TOPIC_IMAGE_SRC =
  /^\/images\/(atlas|space)\/([a-z0-9-]+)\/w(640|1280|2048)\.jpg$/

function guideExists(collection: 'explore' | 'space', slug: string) {
  if (collection === 'explore') {
    return Boolean(getAtlasEntry(slug))
  }
  return Boolean(getSpaceSubject(slug))
}

function curatedImageExists(src: string) {
  const match = src.match(CURATED_TOPIC_IMAGE_SRC)
  if (!match) return false
  const collection = match[1]
  const slug = match[2]!
  if (collection === 'atlas') {
    return Boolean(getAtlasEntry(slug))
  }
  return Boolean(getSpaceSubject(slug))
}

/**
 * Drop invented guide deep-links and curated photo embeds. Valid links/images
 * are kept; invalid guide links become plain labels; invalid images become alt
 * text (or empty).
 */
export function sanitizePortalMarkdown(markdown: string): string {
  const withoutBadImages = markdown.replace(
    MARKDOWN_IMAGE,
    (full, alt: string, src: string) => {
      if (curatedImageExists(src)) {
        return `![${alt}](${src})`
      }
      // Leave non-curated images for presentTopicPhotoMarkdown to strip;
      // only inventing catalog paths is in scope here.
      if (src.startsWith('/images/atlas/') || src.startsWith('/images/space/')) {
        return alt.trim() || ''
      }
      return full
    },
  )

  return withoutBadImages.replace(
    MARKDOWN_GUIDE_LINK,
    (_full, label: string, _href: string, collection: string, slug: string) => {
      if (
        (collection === 'explore' || collection === 'space') &&
        guideExists(collection, slug)
      ) {
        return `[${label}](/${collection}/${slug})`
      }
      return label.trim() || slug
    },
  )
}

/** True when markdown contains at least one invented portal path. */
export function hasInventedPortalPaths(markdown: string): boolean {
  for (const match of markdown.matchAll(MARKDOWN_GUIDE_LINK)) {
    const collection = match[3] as 'explore' | 'space'
    const slug = match[4]!
    if (!guideExists(collection, slug)) {
      return true
    }
  }

  for (const match of markdown.matchAll(MARKDOWN_IMAGE)) {
    const src = match[2]!
    if (
      (src.startsWith('/images/atlas/') || src.startsWith('/images/space/')) &&
      !curatedImageExists(src)
    ) {
      return true
    }
  }

  return false
}
