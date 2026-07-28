/**
 * Resolve curated Explore/Space photographs for a Cleo turn so the agent can
 * embed real site photos (not synthetic generations) when answering about
 * catalog topics.
 */

import { atlasRendition, getAtlasEntry } from '~/lib/atlas'
import { ESSAY_TOPIC_GROUNDING } from '~/lib/cleo/essay-topics'
import { countries } from '~/lib/countries'
import { getSpaceSubject, spaceSubjects } from '~/lib/space'
import { staticRendition } from '~/lib/static-photo'

export const MAX_TOPIC_PHOTOS = 3

/** Keep orientation snippets short enough for per-turn developer grounding. */
export const MAX_TOPIC_ORIENTATION_CHARS = 480

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
  /** Clipped curated orientation prose from the field guide. */
  orientation: string
}

type TopicCandidate = {
  collection: 'explore' | 'space'
  slug: string
  name: string
  /** Extra match tokens (notable places / features / photo titles / colloquial names). */
  aliases: string[]
  /**
   * Short catalog codes matched case-sensitively (ISO alpha-2, ISS, …).
   * Avoids pronoun false positives like “us” → United States.
   */
  codes: string[]
}

type MatchToken = {
  candidate: TopicCandidate
  token: string
  /** When true, require the exact case from `token` (used for short codes). */
  caseSensitive?: boolean
}

/**
 * Common spoken / alternate names that the catalog primary name does not
 * cover (e.g. “Korea, South” vs “South Korea”).
 */
const EXPLORE_NAME_ALIASES: Record<string, readonly string[]> = {
  'korea-south': ['South Korea', 'Republic of Korea'],
  'korea-north': ['North Korea', 'DPRK'],
  'united-states': ['USA', 'U.S.', 'U.S.A.', 'United States of America'],
  'united-kingdom': ['UK', 'U.K.', 'Britain', 'Great Britain'],
  'united-arab-emirates': ['UAE', 'U.A.E.'],
  russia: ['Russian Federation'],
  czechia: ['Czech Republic'],
  'cote-divoire': ["Cote d'Ivoire", 'Ivory Coast'],
  myanmar: ['Burma'],
  eswatini: ['Swaziland'],
  'timor-leste': ['East Timor'],
  'north-macedonia': ['Macedonia'],
  'bosnia-and-herzegovina': ['Bosnia', 'BiH'],
  'cabo-verde': ['Cape Verde'],
  netherlands: ['Holland'],
  turkiye: ['Turkey', 'Turkiye'],
  // Longer DRC forms must beat bare “Congo” (Republic of the Congo).
  'congo-democratic-republic-of-the': [
    'Democratic Republic of the Congo',
    'DR Congo',
    'Congo-Kinshasa',
    'DRC',
  ],
  congo: ['Republic of the Congo', 'Congo-Brazzaville'],
}

/** Colloquial / Messier / catalog nicknames for Space subjects. */
const SPACE_NAME_ALIASES: Record<string, readonly string[]> = {
  iss: ['ISS', 'space station'],
  moon: ['Luna', "Earth's Moon"],
  sun: ['Sol'],
  earth: ['Blue Marble', 'Blue Planet', 'Terra'],
  mars: ['Red Planet'],
  andromeda: ['M31', 'Messier 31', 'Andromeda Galaxy'],
  'orion-nebula': ['M42', 'Messier 42'],
  'crab-nebula': ['M1', 'Messier 1'],
  'carina-nebula': ['NGC 3372'],
  'milky-way': ['Milky Way Galaxy'],
  'asteroid-belt': ['main belt'],
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function candidateKey(topic: Pick<TopicCandidate, 'collection' | 'slug'>) {
  return `${topic.collection}/${topic.slug}`
}

function uniqueAliases(
  values: readonly string[],
  primaryName: string,
  options?: { minLength?: number },
): string[] {
  const minLength = options?.minLength ?? 3
  const seen = new Set<string>()
  const aliases: string[] = []

  for (const value of values) {
    const trimmed = value.replace(/\s+/g, ' ').trim()
    if (!trimmed || trimmed.length < minLength) continue
    if (trimmed.toLowerCase() === primaryName.toLowerCase()) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    aliases.push(trimmed)
  }

  return aliases
}

/** Uppercase short codes only — matched case-sensitively later. */
function uniqueCodes(
  values: readonly string[],
  reservedLower: ReadonlySet<string>,
): string[] {
  const seen = new Set<string>()
  const codes: string[] = []

  for (const value of values) {
    const trimmed = value.replace(/\s+/g, ' ').trim().toUpperCase()
    if (!/^[A-Z]{2,3}$/.test(trimmed)) continue
    if (reservedLower.has(trimmed.toLowerCase())) continue
    if (seen.has(trimmed)) continue
    seen.add(trimmed)
    codes.push(trimmed)
  }

  return codes
}

let cachedCandidates: TopicCandidate[] | null = null
let cachedMatchTokens: MatchToken[] | null = null

function buildCandidates(): TopicCandidate[] {
  return [
    ...spaceSubjects.map((subject) => {
      const colloquial = SPACE_NAME_ALIASES[subject.slug] ?? []
      const aliases = uniqueAliases(
        [
          subject.photo.featureName,
          ...subject.features.map((feature) => feature.name),
          ...colloquial,
        ],
        subject.name,
      )
      const aliasLower = new Set(aliases.map((alias) => alias.toLowerCase()))
      aliasLower.add(subject.name.toLowerCase())
      // Only well-known short forms (ISS) — skip opaque index codes like MWY/ORI.
      const curatedCodes = colloquial.filter((value) =>
        /^[A-Za-z]{2,3}$/.test(value.trim()),
      )
      const codes = uniqueCodes(curatedCodes, aliasLower)
      return {
        collection: 'space' as const,
        slug: subject.slug,
        name: subject.name,
        aliases,
        codes,
      }
    }),
    ...countries.map((country) => {
      const entry = getAtlasEntry(country.slug)
      const colloquial = EXPLORE_NAME_ALIASES[country.slug] ?? []
      const aliases = uniqueAliases(
        [
          entry?.photo.placeName ?? '',
          ...(entry?.places.map((place) => place.name) ?? []),
          ...colloquial,
        ],
        country.name,
      )
      const aliasLower = new Set(aliases.map((alias) => alias.toLowerCase()))
      aliasLower.add(country.name.toLowerCase())
      // ISO alpha-2 + two-letter nicknames (UK) — case-sensitive only.
      const shortNicknames = colloquial.flatMap((value) => {
        const compact = value.replace(/\./g, '').trim().toUpperCase()
        return /^[A-Z]{2}$/.test(compact) ? [compact] : []
      })
      const codes = uniqueCodes([country.code, ...shortNicknames], aliasLower)
      return {
        collection: 'explore' as const,
        slug: country.slug,
        name: country.name,
        aliases,
        codes,
      }
    }),
  ]
}

function allCandidates(): TopicCandidate[] {
  if (!cachedCandidates) {
    cachedCandidates = buildCandidates()
  }
  return cachedCandidates
}

/** Primary names + place/feature aliases + short codes, longest tokens first. */
function allMatchTokens(): MatchToken[] {
  if (cachedMatchTokens) return cachedMatchTokens

  const tokens: MatchToken[] = []

  for (const candidate of allCandidates()) {
    tokens.push({ candidate, token: candidate.name })
    for (const alias of candidate.aliases) {
      tokens.push({ candidate, token: alias })
    }
    for (const code of candidate.codes) {
      tokens.push({ candidate, token: code, caseSensitive: true })
    }
  }

  cachedMatchTokens = tokens.sort((left, right) => {
    const lengthDiff = right.token.length - left.token.length
    if (lengthDiff !== 0) return lengthDiff
    return left.token.localeCompare(right.token)
  })
  return cachedMatchTokens
}

/** Clip curated orientation without cutting mid-word when possible. */
export function clipTopicOrientation(
  about: string,
  maxChars = MAX_TOPIC_ORIENTATION_CHARS,
): string {
  const normalized = about.replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= maxChars) return normalized

  const slice = normalized.slice(0, maxChars)
  const boundary = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('! '),
    slice.lastIndexOf(' '),
  )
  const clipped = (boundary > maxChars * 0.5 ? slice.slice(0, boundary) : slice)
    .trim()
    .replace(/[,:;–—-]+$/u, '')
  return `${clipped}…`
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
      orientation: clipTopicOrientation(entry.about),
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
    orientation: clipTopicOrientation(subject.about),
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

function stubCandidate(
  collection: 'explore' | 'space',
  slug: string,
): TopicCandidate {
  return {
    collection,
    slug,
    name: slug,
    aliases: [],
    codes: [],
  }
}

/**
 * Find catalog subjects mentioned in free text via site paths or names.
 * Longer names win over nested shorter ones (Nigeria before Niger).
 * Writing paths/titles expand to related Explore/Space subjects.
 */
export function matchTopicPhotosInText(text: string): TopicPhoto[] {
  const haystack = text.trim()
  if (!haystack) return []

  const claimed: Array<[number, number]> = []
  const ordered: TopicCandidate[] = []
  const seen = new Set<string>()

  const append = (candidate: TopicCandidate) => {
    const key = candidateKey(candidate)
    if (seen.has(key)) return false
    seen.add(key)
    ordered.push(candidate)
    return true
  }

  const claim = (start: number, end: number, candidate: TopicCandidate) => {
    if (claimed.some(([a, b]) => start < b && end > a)) {
      return
    }
    if (!append(candidate)) return
    claimed.push([start, end])
  }

  /** One span → one or more related catalog subjects (essays). */
  const claimMany = (
    start: number,
    end: number,
    candidates: readonly TopicCandidate[],
  ) => {
    if (claimed.some(([a, b]) => start < b && end > a)) {
      return
    }
    let added = false
    for (const candidate of candidates) {
      if (append(candidate)) added = true
    }
    if (added) claimed.push([start, end])
  }

  const pathPattern =
    /(?:^|[^A-Za-z0-9])\/(explore|space|blog)\/([a-z0-9-]+)(?![a-z0-9-])/gi
  for (const match of haystack.matchAll(pathPattern)) {
    const kind = match[1]!.toLowerCase()
    const slug = match[2]!
    const token = match[0]!
    const path = `/${kind}/${slug}`
    const pathOffset = token.indexOf(path)
    if (pathOffset < 0) continue
    const start = (match.index ?? 0) + pathOffset
    const end = start + path.length

    if (kind === 'blog') {
      const related = ESSAY_TOPIC_GROUNDING[slug]?.topics ?? []
      claimMany(
        start,
        end,
        related.map((topic) => stubCandidate(topic.collection, topic.slug)),
      )
      continue
    }

    claim(start, end, stubCandidate(kind as 'explore' | 'space', slug))
  }

  const essayTitles = Object.entries(ESSAY_TOPIC_GROUNDING)
    .map(([slug, entry]) => ({ slug, title: entry.title, topics: entry.topics }))
    .sort((left, right) => right.title.length - left.title.length)

  for (const essay of essayTitles) {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(essay.title)}(?![\\p{L}\\p{N}])`,
      'giu',
    )
    const match = pattern.exec(haystack)
    if (!match) continue
    claimMany(
      match.index,
      match.index + match[0].length,
      essay.topics.map((topic) => stubCandidate(topic.collection, topic.slug)),
    )
  }

  for (const { candidate, token, caseSensitive } of allMatchTokens()) {
    if (seen.has(candidateKey(candidate))) continue
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(token)}(?![\\p{L}\\p{N}])`,
      caseSensitive ? 'gu' : 'giu',
    )
    const match = pattern.exec(haystack)
    if (!match) continue
    claim(match.index, match.index + match[0].length, candidate)
  }

  return resolveTopicPhotos(ordered)
}

/**
 * Collect topic-matching text from the latest turns.
 * Prefer recent user messages, then include the latest assistant reply so
 * follow-ups like “show me a photo” still ground the subject just discussed.
 */
export function conversationTopicText(
  messages: readonly { role: string; content: string }[],
): string {
  const recent = messages
    .filter((message) => message.content.trim())
    .slice(-6)

  const userTexts = recent
    .filter((message) => message.role === 'user')
    .map((message) => message.content.trim())
    .slice(-3)

  const latestAssistant = [...recent]
    .reverse()
    .find((message) => message.role === 'assistant')
    ?.content.trim()

  return [...userTexts, ...(latestAssistant ? [latestAssistant] : [])].join(
    '\n',
  )
}

/** Keep Markdown image alts from breaking on rare `]` / newline titles. */
function markdownImageAlt(value: string) {
  return value.replace(/[\[\]\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Photograph'
}

function formatTopicPhoto(photo: TopicPhoto): string {
  const alt = markdownImageAlt(photo.title)
  const lines = [
    `### ${photo.name} — ${photo.href}`,
    `Photograph title: ${photo.title}`,
    `Alt text: ${photo.alt}`,
    `Caption: ${photo.caption}`,
    `Embed with Markdown image (required path): ![${alt}](${photo.src})`,
  ]
  if (photo.orientation) {
    lines.push(`Orientation (site copy — prefer for orientation answers): ${photo.orientation}`)
  }
  return lines.join('\n')
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
The following curated photographs and orientation snippets are from this website's Explore and Space topics. When the user's question is about these subjects:
- Prefer the provided Orientation site copy for geography, character, and structural facts about the subject. Paraphrase in Cleo's voice — do not paste the block verbatim. If Orientation is silent on a detail, say so or use \`web_search\` rather than inventing.
- You MAY and SHOULD include the curated photograph in your reply when appearance, landscape, what something looks like, or a visual orientation would help — or when the user asks to see a photo/image.
- Embed with exactly one Markdown image per subject using the path shown: \`![title](/images/...)\`. Do not invent or alter image paths.
- Still weave one Markdown deep link to the field guide (\`[Name](/explore/…)\` or \`[Name](/space/…)\`) on first mention.
- Prefer these curated photos over \`image_generation\` for real places and space bodies. Use \`image_generation\` only if the user asks you to create, draw, redesign, or invent a visual the curated photo cannot cover (diagram, stylized illustration, edit).
- Do not dump every photo unprompted for a pure text fact question (e.g. capital city only). One well-chosen image is enough when a visual helps.
- Never claim a photo is yours or generated when you used a curated site path.

${blocks}
</cleo_topic_photos>`
}
