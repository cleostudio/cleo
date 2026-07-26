/**
 * Resolve curated Explore/Space photographs for a Cleo turn so the agent can
 * embed real site photos (not synthetic generations) when answering about
 * catalog topics.
 */

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import { countries } from '~/lib/countries'
import { getSpaceSubject, spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

export const MAX_TOPIC_PHOTOS = 3

export type TopicPhoto = {
  collection: 'explore' | 'space'
  slug: string
  name: string
  href: string
  /** Featured place or feature name. */
  title: string
  alt: string
  caption: string
  /** Mid-size static JPEG path for Markdown embedding. */
  src: string
}

type TopicCandidate = {
  collection: 'explore' | 'space'
  slug: string
  name: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function candidateKey(topic: Pick<TopicCandidate, 'collection' | 'slug'>) {
  return `${topic.collection}/${topic.slug}`
}

function allCandidates(): TopicCandidate[] {
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

function loadTopicPhoto(
  topic: Pick<TopicCandidate, 'collection' | 'slug'>,
): TopicPhoto | null {
  if (topic.collection === 'explore') {
    const entry = getAtlasEntry(topic.slug)
    if (!entry) return null
    return {
      collection: 'explore',
      slug: entry.slug,
      name: entry.name,
      href: `/explore/${entry.slug}`,
      title: entry.photo.placeName,
      alt: entry.photo.alt,
      caption: entry.photo.caption,
      src: atlasRendition(entry.photo, 1280).src,
    }
  }

  const subject = getSpaceSubject(topic.slug)
  if (!subject) return null

  return {
    collection: 'space',
    slug: subject.slug,
    name: subject.name,
    href: `/space/${subject.slug}`,
    title: subject.photo.featureName,
    alt: subject.photo.alt,
    caption: subject.photo.caption,
    src: staticRendition(subject.photo, 1280).src,
  }
}

/** Resolve topic tokens to real photographs (drops unknown slugs). */
export function resolveTopicPhotos(
  topics: readonly Pick<TopicCandidate, 'collection' | 'slug'>[],
): TopicPhoto[] {
  const seen = new Set<string>()
  const photos: TopicPhoto[] = []

  for (const topic of topics) {
    const key = candidateKey(topic)
    if (seen.has(key)) continue
    const loaded = loadTopicPhoto(topic)
    if (!loaded) continue
    seen.add(key)
    photos.push(loaded)
    if (photos.length >= MAX_TOPIC_PHOTOS) break
  }

  return photos
}

/**
 * Find catalog subjects mentioned in free text via site paths or names.
 * Longer names win over nested shorter ones (Nigeria before Niger).
 */
export function matchTopicPhotosInText(text: string): TopicPhoto[] {
  const haystack = text.trim()
  if (!haystack) return []

  const claimed: Array<[number, number]> = []
  const ordered: TopicCandidate[] = []
  const seen = new Set<string>()

  const claim = (start: number, end: number, candidate: TopicCandidate) => {
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

  return resolveTopicPhotos(ordered)
}

/** Collect topic-matching text from the latest user turns. */
export function conversationTopicText(
  messages: readonly { role: string; content: string }[],
): string {
  const userTexts = messages
    .filter((message) => message.role === 'user' && message.content.trim())
    .map((message) => message.content.trim())
    .slice(-3)

  return userTexts.join('\n')
}

/** Keep Markdown image alts from breaking on rare `]` / newline titles. */
function markdownImageAlt(value: string) {
  return value.replace(/[\[\]\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Photograph'
}

function formatTopicPhoto(photo: TopicPhoto): string {
  const alt = markdownImageAlt(photo.title)
  return [
    `### ${photo.name} — ${photo.href}`,
    `Photograph title: ${photo.title}`,
    `Alt text: ${photo.alt}`,
    `Caption: ${photo.caption}`,
    `Embed with Markdown image (required path): ![${alt}](${photo.src})`,
  ].join('\n')
}

/**
 * Per-request instruction block that allows/encourages curated topic photos
 * in the assistant reply, or empty string when nothing matched.
 */
export function buildTopicPhotoInstructions(
  photos: readonly TopicPhoto[],
): string {
  if (photos.length === 0) return ''

  const blocks = photos.map(formatTopicPhoto).join('\n\n')

  return `<cleo_topic_photos>
The following curated photographs are from this website's Explore and Space topics. When the user's question is about these subjects:
- You MAY and SHOULD include the curated photograph in your reply when appearance, landscape, what something looks like, or a visual orientation would help — or when the user asks to see a photo/image.
- Embed with exactly one Markdown image per subject using the path shown: \`![title](/images/...)\`. Do not invent or alter image paths.
- Still weave one Markdown deep link to the field guide (\`[Name](/explore/…)\` or \`[Name](/space/…)\`) on first mention.
- Prefer these curated photos over \`image_generation\` for real places and space bodies. Use \`image_generation\` only if the user asks you to create, draw, redesign, or invent a visual the curated photo cannot cover (diagram, stylized illustration, edit).
- Do not dump every photo unprompted for a pure text fact question (e.g. capital city only). One well-chosen image is enough when a visual helps.
- Never claim a photo is yours or generated when you used a curated site path.

${blocks}
</cleo_topic_photos>`
}
