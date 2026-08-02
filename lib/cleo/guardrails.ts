/**
 * Sanitize assistant Markdown so Cleo cannot invent Explore/Space/Civilizations
 * guide paths or curated image URLs that are not in the site catalog.
 */

import { getAtlasEntry } from "~/lib/atlas"
import { getCivilizationSubject } from "~/lib/civilizations"
import { getSpaceSubject } from "~/lib/space"

type GuideCollection = "explore" | "space" | "civilizations"

/** Inline guide links, including optional title / angle-bracket destinations. */
const MARKDOWN_GUIDE_LINK =
  /\[([^\]]*)\]\(\s*<?(\/(explore|space|civilizations)\/([a-z0-9-]+))>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/gi

/** Reference definitions: `[id]: /explore/slug "title"`. */
const MARKDOWN_GUIDE_REF_DEF =
  /^[ \t]*\[([^\]]+)\]:[ \t]*<?(\/(explore|space|civilizations)\/([a-z0-9-]+))>?(?:[ \t]+(?:"[^"]*"|'[^']*'|\([^)]*\)))?[ \t]*$/gim

const MARKDOWN_IMAGE =
  /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

const CURATED_TOPIC_IMAGE_SRC =
  /^\/images\/(atlas|space|civilizations)\/([a-z0-9-]+)\/w(640|1280|2048)(?:-(2|3))?\.jpg$/

function guideExists(collection: GuideCollection, slug: string) {
  if (collection === "explore") {
    return Boolean(getAtlasEntry(slug))
  }
  if (collection === "civilizations") {
    return Boolean(getCivilizationSubject(slug))
  }
  return Boolean(getSpaceSubject(slug))
}

function curatedImageExists(src: string) {
  const match = src.match(CURATED_TOPIC_IMAGE_SRC)
  if (!match) return false
  const collection = match[1]
  const slug = match[2]!
  if (collection === "atlas") {
    const entry = getAtlasEntry(slug)
    return Boolean(
      entry?.photos.some((photo) =>
        photo.renditions.some((rendition) => rendition.src === src),
      ),
    )
  }
  if (collection === "civilizations") {
    const subject = getCivilizationSubject(slug)
    return Boolean(
      subject?.photos.some((photo) =>
        photo.renditions.some((rendition) => rendition.src === src),
      ),
    )
  }
  const subject = getSpaceSubject(slug)
  return Boolean(
    subject?.photos.some((photo) =>
      photo.renditions.some((rendition) => rendition.src === src),
    ),
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Drop invented guide deep-links and curated photo embeds. Valid links/images
 * are kept; invalid guide links become plain labels; invalid images become alt
 * text (or empty).
 */
export function sanitizePortalMarkdown(markdown: string): string {
  const inventedRefIds = new Set<string>()

  const withoutBadRefDefs = markdown.replace(
    MARKDOWN_GUIDE_REF_DEF,
    (
      full,
      id: string,
      href: string,
      collection: string,
      slug: string,
    ) => {
      if (
        (collection === "explore" ||
          collection === "space" ||
          collection === "civilizations") &&
        guideExists(collection, slug)
      ) {
        return `[${id}]: ${href}`
      }
      inventedRefIds.add(id.toLowerCase())
      return ""
    },
  )

  let withoutBadRefUses = withoutBadRefDefs
  for (const id of inventedRefIds) {
    const collapsed = new RegExp(
      `\\[([^\\]]*)\\](?:\\[${escapeRegExp(id)}\\]|\\[\\])`,
      "gi",
    )
    withoutBadRefUses = withoutBadRefUses.replace(
      collapsed,
      (_full, label: string) => label.trim() || id,
    )
  }

  const withoutBadImages = withoutBadRefUses.replace(
    MARKDOWN_IMAGE,
    (full, alt: string, src: string) => {
      if (curatedImageExists(src)) {
        return `![${alt}](${src})`
      }
      // Leave non-curated images for presentPortalGuideMarkdown to strip;
      // only inventing catalog paths is in scope here.
      if (
        src.startsWith("/images/atlas/") ||
        src.startsWith("/images/space/") ||
        src.startsWith("/images/civilizations/")
      ) {
        return alt.trim() || ""
      }
      return full
    }
  )

  return withoutBadImages
    .replace(
      MARKDOWN_GUIDE_LINK,
      (_full, label: string, href: string, collection: string, slug: string) => {
        if (
          (collection === "explore" ||
            collection === "space" ||
            collection === "civilizations") &&
          guideExists(collection, slug)
        ) {
          return `[${label}](${href})`
        }
        return label.trim() || slug
      },
    )
    .replace(/\n{3,}/g, "\n\n")
}

/** True when markdown contains at least one invented portal path. */
export function hasInventedPortalPaths(markdown: string): boolean {
  for (const match of markdown.matchAll(MARKDOWN_GUIDE_LINK)) {
    const collection = match[3] as GuideCollection
    const slug = match[4]!
    if (!guideExists(collection, slug)) {
      return true
    }
  }

  for (const match of markdown.matchAll(MARKDOWN_GUIDE_REF_DEF)) {
    const collection = match[3] as GuideCollection
    const slug = match[4]!
    if (!guideExists(collection, slug)) {
      return true
    }
  }

  for (const match of markdown.matchAll(MARKDOWN_IMAGE)) {
    const src = match[2]!
    if (
      (src.startsWith("/images/atlas/") ||
        src.startsWith("/images/space/") ||
        src.startsWith("/images/civilizations/")) &&
      !curatedImageExists(src)
    ) {
      return true
    }
  }

  return false
}
