/**
 * Resolve curated Explore/Space/Civilizations photographs for a Cleo turn so
 * the agent can embed real site photos (not synthetic generations) when
 * answering about catalog topics.
 */

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import {
  civilizationSubjects,
  getCivilizationSubject,
} from '~/lib/civilizations'
import { countries } from '~/lib/countries'
import { getSpaceSubject, spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

/** Limit subjects, not images: each matched subject contributes its full set. */
export const MAX_TOPIC_SUBJECTS = 3

export type TopicPhotoCollection = 'explore' | 'space' | 'civilizations'

export type TopicPhoto = {
  collection: TopicPhotoCollection
  slug: string
  name: string
  href: string
  /** Place or feature name. */
  title: string
  alt: string
  caption: string
  /** One-indexed position in this subject's complete curated set. */
  position: number
  total: number
  /** Mid-size static JPEG path for Markdown embedding. */
  src: string
}

type TopicCandidate = {
  collection: TopicPhotoCollection
  slug: string
  name: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function candidateKey(topic: Pick<TopicCandidate, 'collection' | 'slug'>) {
  return `${topic.collection}/${topic.slug}`
}

/** Memoized catalog subjects — rebuilt only once per process. */
let cachedCandidates: TopicCandidate[] | null = null
/** Longer names first so "Nigeria" wins over "Niger". */
let cachedCandidatesByName: TopicCandidate[] | null = null

function allCandidates(): TopicCandidate[] {
  if (!cachedCandidates) {
    cachedCandidates = [
      ...spaceSubjects.map((subject) => ({
        collection: 'space' as const,
        slug: subject.slug,
        name: subject.name,
      })),
      ...civilizationSubjects.map((subject) => ({
        collection: 'civilizations' as const,
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
  return cachedCandidates
}

function candidatesByNameLength(): TopicCandidate[] {
  if (!cachedCandidatesByName) {
    cachedCandidatesByName = [...allCandidates()].sort(
      (a, b) => b.name.length - a.name.length,
    )
  }
  return cachedCandidatesByName
}

type NameMatcher = {
  candidate: TopicCandidate
  pattern: RegExp
}

/** Longer names first; compiled once because the catalog is build-time static. */
let nameMatchersCache: NameMatcher[] | null = null

function nameMatchers(): NameMatcher[] {
  if (!nameMatchersCache) {
    // Reuse the length-sorted candidate cache; compile patterns once.
    nameMatchersCache = candidatesByNameLength().map((candidate) => ({
      candidate,
      // No `g` flag — we only need the first hit, and a shared RegExp must
      // not retain lastIndex across requests.
      pattern: new RegExp(
        `(?<![\\p{L}\\p{N}])${escapeRegExp(candidate.name)}(?![\\p{L}\\p{N}])`,
        'iu',
      ),
    }))
  }

  return nameMatchersCache
}

function loadTopicPhotos(
  topic: Pick<TopicCandidate, 'collection' | 'slug'>,
): TopicPhoto[] {
  if (topic.collection === 'explore') {
    const entry = getAtlasEntry(topic.slug)
    if (!entry) return []
    return entry.photos.map((photo, index) => ({
      collection: 'explore' as const,
      slug: entry.slug,
      name: entry.name,
      href: `/explore/${entry.slug}`,
      title: photo.placeName,
      alt: photo.alt,
      caption: photo.caption,
      position: index + 1,
      total: entry.photos.length,
      src: atlasRendition(photo, 1280).src,
    }))
  }

  if (topic.collection === 'civilizations') {
    const subject = getCivilizationSubject(topic.slug)
    if (!subject) return []
    return subject.photos.map((photo, index) => ({
      collection: 'civilizations' as const,
      slug: subject.slug,
      name: subject.name,
      href: `/civilizations/${subject.slug}`,
      title: photo.featureName,
      alt: photo.alt,
      caption: photo.caption,
      position: index + 1,
      total: subject.photos.length,
      src: staticRendition(photo, 1280).src,
    }))
  }

  const subject = getSpaceSubject(topic.slug)
  if (!subject) return []

  return subject.photos.map((photo, index) => ({
    collection: 'space' as const,
    slug: subject.slug,
    name: subject.name,
    href: `/space/${subject.slug}`,
    title: photo.featureName,
    alt: photo.alt,
    caption: photo.caption,
    position: index + 1,
    total: subject.photos.length,
    src: staticRendition(photo, 1280).src,
  }))
}

/** Resolve topic tokens to real photographs (drops unknown slugs). */
export function resolveTopicPhotos(
  topics: readonly Pick<TopicCandidate, 'collection' | 'slug'>[],
): TopicPhoto[] {
  const seen = new Set<string>()
  const photos: TopicPhoto[] = []
  let subjects = 0

  for (const topic of topics) {
    const key = candidateKey(topic)
    if (seen.has(key)) continue
    const loaded = loadTopicPhotos(topic)
    if (loaded.length === 0) continue
    seen.add(key)
    photos.push(...loaded)
    subjects += 1
    if (subjects >= MAX_TOPIC_SUBJECTS) break
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
    /(?:^|[^A-Za-z0-9])\/(explore|space|civilizations)\/([a-z0-9-]+)(?![a-z0-9-])/gi
  for (const match of haystack.matchAll(pathPattern)) {
    const collection = match[1] as TopicPhotoCollection
    const slug = match[2]!
    const token = match[0]!
    const path = `/${collection}/${slug}`
    const pathOffset = token.indexOf(path)
    if (pathOffset < 0) continue
    const start = (match.index ?? 0) + pathOffset
    const end = start + path.length
    claim(start, end, { collection, slug, name: slug })
  }

  for (const { candidate, pattern } of nameMatchers()) {
    if (seen.has(candidateKey(candidate))) continue
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
    `Photo ${photo.position} of ${photo.total}`,
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

  const photoSets = new Map<string, TopicPhoto[]>()
  for (const photo of photos) {
    const key = `${photo.collection}/${photo.slug}`
    const set = photoSets.get(key)
    if (set) {
      set.push(photo)
    } else {
      photoSets.set(key, [photo])
    }
  }
  const blocks = [...photoSets.values()]
    .map((set) => {
      const first = set[0]!
      return [
        `### ${first.name} — ${first.href}`,
        ...set.map(formatTopicPhoto),
      ].join('\n\n')
    })
    .join('\n\n')

  return `<cleo_topic_photos>
The following complete curated photograph sets are from this website's Explore, Space, and Civilizations topics. When the user's question is about these subjects:
- You MAY and SHOULD include a curated photograph in your reply when appearance, landscape, what something looks like, or a visual orientation would help — or when the user asks to see a photo/image.
- When the user asks to see all photos, images, or a gallery for a subject, embed every listed photograph for that subject in numeric order. Otherwise, choose the single photograph that best helps, usually Photo 1.
- Embed only the exact Markdown image paths shown: \`![title](/images/...)\`. Do not invent or alter image paths.
- Still weave one Markdown deep link to the field guide (\`[Name](/explore/…)\`, \`[Name](/space/…)\`, or \`[Name](/civilizations/…)\`) on first mention.
- Prefer these curated photos over \`image_generation\` for real places, space bodies, and civilization sites. Use \`image_generation\` only if the user asks you to create, draw, redesign, or invent a visual the curated photo cannot cover (diagram, stylized illustration, edit).
- Do not dump every photo unprompted for a pure text fact question (e.g. capital city only). One well-chosen image is enough when a visual helps.
- Never claim a photo is yours or generated when you used a curated site path.

${blocks}
</cleo_topic_photos>`
}
