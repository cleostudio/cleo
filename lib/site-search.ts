/**
 * Homepage typeahead: hit types plus the pure matching engine the client runs
 * over the catalog. Catalog assembly lives in `site-search-catalog.ts` so the
 * client can import this module without pulling guide records, post files, or
 * photo manifests into the bundle.
 */

export type SiteSearchKind =
  | 'topic'
  | 'explore'
  | 'space'
  | 'photo'
  | 'writing'
  | 'surface'

export interface SiteSearchHit {
  id: string
  kind: SiteSearchKind
  title: string
  /** Quiet meta shown on the right (e.g. "JP · Asia", "Jul 2026"). */
  subtitle: string
  href: string
  /**
   * Extra search terms beyond title and subtitle — codes, capitals, place
   * names, post descriptions. Title, subtitle, and the kind's own vocabulary
   * are all indexed automatically, so none of them need repeating here.
   */
  keywords?: string
}

/** Result-kind badge shown on every row; also indexed as a search term. */
export const SITE_SEARCH_KIND_LABEL: Record<SiteSearchKind, string> = {
  topic: 'Topic',
  explore: 'Country',
  space: 'Space',
  photo: 'Photograph',
  writing: 'Writing',
  surface: 'Portal',
}

/** Plural group heading for a run of results of the same kind. */
export const SITE_SEARCH_GROUP_LABEL: Record<SiteSearchKind, string> = {
  topic: 'Topics',
  explore: 'Countries',
  space: 'Space',
  photo: 'Photographs',
  writing: 'Writing',
  surface: 'Portal',
}

/**
 * Vocabulary indexed with every hit of a kind, so "images of iceland" or
 * "japan essay" reach the right rows without repeating the words 200 times in
 * the serialized catalog.
 */
const KIND_TERMS: Record<SiteSearchKind, string> = {
  topic: 'topic topics collection collections catalog',
  explore: 'country countries nation explore guide place',
  space: 'space astronomy astronomical body guide',
  // Not "gallery": that word belongs to the portal surface of the same name.
  photo: 'photo photos photograph photographs photography image images picture pictures view',
  writing: 'writing essay essays post posts article articles blog note notes',
  surface: 'portal page section',
}

/** Catalog order, which is also the tie-break order for equal scores. */
const KIND_RANK = new Map<SiteSearchKind, number>(
  (['topic', 'explore', 'space', 'photo', 'writing', 'surface'] as const).map(
    (kind, index) => [kind, index],
  ),
)

/** A nudge, not a verdict: match quality decides the order first. */
const KIND_PRIOR: Record<SiteSearchKind, number> = {
  topic: 12,
  explore: 10,
  space: 10,
  surface: 8,
  writing: 6,
  photo: 2,
}

const COMBINING_MARKS = /\p{M}/gu
const WORD = /[\p{L}\p{N}]+/gu
const WORD_CHARACTER = /[\p{L}\p{N}]/u

/** Folded text alongside source offsets, so match emphasis can be exact. */
interface FoldedText {
  text: string
  /** Source offset each folded code unit came from. */
  starts: number[]
  /** Source offset just past the character each folded code unit came from. */
  ends: number[]
}

function foldCharacter(character: string): string {
  return character.normalize('NFKD').replace(COMBINING_MARKS, '').toLowerCase()
}

/**
 * Fold one character at a time. Whole-string normalization would be faster but
 * would lose the mapping back to source offsets that match emphasis needs, and
 * the two must agree or highlights drift off the matched letters.
 */
function fold(value: string): FoldedText {
  let text = ''
  const starts: number[] = []
  const ends: number[] = []
  let offset = 0

  for (const character of value) {
    const folded = foldCharacter(character)
    const next = offset + character.length
    for (let unit = 0; unit < folded.length; unit += 1) {
      starts.push(offset)
      ends.push(next)
    }
    text += folded
    offset = next
  }

  return { text, starts, ends }
}

/** Accent-insensitive lowercase form used for every comparison. */
function foldForSearch(value: string): string {
  return fold(value).text
}

/** Folded word tokens, e.g. "Côte d'Ivoire" → ["cote", "d", "ivoire"]. */
function searchTokens(value: string): string[] {
  return foldForSearch(value).match(WORD) ?? []
}

/**
 * Typo tolerance starts at five letters. One edit inside a four-letter word is
 * a quarter of it — that is how "mars" reaches "Mara" and "home" reaches
 * "Tome", which is noise rather than forgiveness.
 */
const MIN_FUZZY_LENGTH = 5

/** True when one substitution, insertion, deletion, or swap separates a and b. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true

  const drift = a.length - b.length
  if (drift > 1 || drift < -1) return false

  let head = 0
  while (head < a.length && head < b.length && a[head] === b[head]) head += 1

  if (drift === 0) {
    if (a.slice(head + 1) === b.slice(head + 1)) return true
    return (
      a[head] === b[head + 1] &&
      a[head + 1] === b[head] &&
      a.slice(head + 2) === b.slice(head + 2)
    )
  }

  const longer = drift === 1 ? a : b
  const shorter = drift === 1 ? b : a
  return longer.slice(head + 1) === shorter.slice(head)
}

/** Typo tolerance for whole words and for what the visitor has typed so far. */
function isNearMatch(candidate: string, token: string): boolean {
  if (token.length < MIN_FUZZY_LENGTH) return false
  if (withinOneEdit(candidate, token)) return true
  return (
    candidate.length > token.length &&
    withinOneEdit(candidate.slice(0, token.length), token)
  )
}

const SCORE = {
  titleTokenExact: 90,
  titleTokenPrefix: 68,
  titleTokenInside: 40,
  /** Below every exact match: a near miss never outranks a real one. */
  titleTokenTypo: 30,
  /** "us" → United States. A whole initialism is a deliberate, strong signal. */
  initialsExact: 200,
  initialsPrefix: 80,
  termExact: 45,
  termPrefix: 24,
  termInside: 12,
  termTypo: 6,
  /** Whole-query bonuses, layered on top of the per-token scores. */
  phraseExact: 220,
  phrasePrefix: 120,
  phraseInside: 60,
  tokenCovered: 60,
  everyTokenCovered: 400,
} as const

/**
 * Mid-word matches need a token with something to say: "us" inside
 * "Australia" is noise, "bourg" inside "Luxembourg" is a match.
 */
const MIN_INSIDE_LENGTH = 3

/**
 * A match has to be better than a single fuzzy brush against one keyword,
 * averaged over the tokens it covers, or it is not worth a row.
 */
const MIN_RELEVANCE_PER_TOKEN = 12

/**
 * Function words and interrogatives carry no subject. Dropping them keeps
 * "images of iceland" from ranking on the "of" in "Cliffs of Moher"; a query
 * made only of them falls back to matching them literally, so the country
 * codes IS, IT, IN, and AT stay reachable.
 */
const QUERY_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can',
  'could', 'did', 'do', 'does', 'for', 'from', 'had', 'has', 'have', 'how',
  'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'so', 'than', 'that',
  'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'to',
  'was', 'were', 'what', 'when', 'where', 'which', 'who', 'whom', 'whose',
  'why', 'will', 'with', 'would', 'you', 'your',
])

/** Query tokens worth scoring on. */
export function meaningfulTokens(query: string): string[] {
  const tokens = searchTokens(query)
  const meaningful = tokens.filter((token) => !QUERY_STOP_WORDS.has(token))
  return meaningful.length > 0 ? meaningful : tokens
}

export interface SiteSearchIndexEntry {
  hit: SiteSearchHit
  titleFold: FoldedText
  titleTokens: string[]
  /** First letters of the title words, e.g. "us" for "United States". */
  initials: string
  /** Subtitle, keyword, and kind-vocabulary tokens. */
  terms: string[]
}

export type SiteSearchIndex = SiteSearchIndexEntry[]

/** Tokenize the catalog once; the result is reused for every keystroke. */
export function createSiteSearchIndex(hits: SiteSearchHit[]): SiteSearchIndex {
  return hits.map((hit) => {
    const titleFold = fold(hit.title)
    const titleTokens = titleFold.text.match(WORD) ?? []
    const terms = new Set([
      ...searchTokens(hit.subtitle),
      ...searchTokens(hit.keywords ?? ''),
      ...searchTokens(SITE_SEARCH_KIND_LABEL[hit.kind]),
      ...searchTokens(KIND_TERMS[hit.kind]),
    ])

    return {
      hit,
      titleFold,
      titleTokens,
      initials: titleTokens.map((token) => token[0] ?? '').join(''),
      terms: [...terms],
    }
  })
}

function bestTitleScore(entry: SiteSearchIndexEntry, token: string): number {
  const canMatchInside = token.length >= MIN_INSIDE_LENGTH
  let best = 0

  for (const titleToken of entry.titleTokens) {
    if (titleToken === token) return SCORE.titleTokenExact
    if (titleToken.startsWith(token)) {
      best = Math.max(best, SCORE.titleTokenPrefix)
    } else if (canMatchInside && titleToken.includes(token)) {
      best = Math.max(best, SCORE.titleTokenInside)
    } else if (isNearMatch(titleToken, token)) {
      best = Math.max(best, SCORE.titleTokenTypo)
    }
  }
  return best
}

/**
 * Keywords match on whole words or on a real prefix. A two-letter prefix is
 * all noise ("us" against Ushguli), while a two-letter whole word is a code
 * worth finding ("jp" against JP).
 */
function bestTermScore(entry: SiteSearchIndexEntry, token: string): number {
  const canMatchInside = token.length >= MIN_INSIDE_LENGTH
  let best = 0

  for (const term of entry.terms) {
    if (term === token) return SCORE.termExact
    if (canMatchInside && term.startsWith(token)) {
      best = Math.max(best, SCORE.termPrefix)
    } else if (canMatchInside && term.includes(token)) {
      best = Math.max(best, SCORE.termInside)
    } else if (isNearMatch(term, token)) {
      best = Math.max(best, SCORE.termTypo)
    }
  }
  return best
}

function scoreToken(entry: SiteSearchIndexEntry, token: string): number {
  let best = Math.max(bestTitleScore(entry, token), bestTermScore(entry, token))

  if (token.length >= 2 && entry.initials.startsWith(token)) {
    best = Math.max(
      best,
      entry.initials === token ? SCORE.initialsExact : SCORE.initialsPrefix,
    )
  }
  return best
}

/** True when `phrase` starts on a word boundary inside `text`. */
function containsPhraseAtWordStart(text: string, phrase: string): boolean {
  let from = 0
  while (from <= text.length - phrase.length) {
    const at = text.indexOf(phrase, from)
    if (at === -1) return false
    if (at === 0 || !WORD_CHARACTER.test(text[at - 1]!)) return true
    from = at + 1
  }
  return false
}

/**
 * Emphasis ranges over the source title. Word-anchored occurrences win so
 * "an" in a query does not light up the middle of "Japan"; a mid-word match
 * is only marked when the token appears nowhere else.
 */
function titleMatchRanges(
  titleFold: FoldedText,
  tokens: string[],
): [number, number][] {
  const spans: [number, number][] = []

  for (const token of tokens) {
    let anchored = false
    let firstLoose: [number, number] | null = null
    let from = 0

    while (from <= titleFold.text.length - token.length) {
      const at = titleFold.text.indexOf(token, from)
      if (at === -1) break

      const span: [number, number] = [
        titleFold.starts[at]!,
        titleFold.ends[at + token.length - 1]!,
      ]
      if (at === 0 || !WORD_CHARACTER.test(titleFold.text[at - 1]!)) {
        spans.push(span)
        anchored = true
      } else if (!firstLoose) {
        firstLoose = span
      }
      from = at + 1
    }

    if (!anchored && firstLoose) spans.push(firstLoose)
  }

  spans.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  const merged: [number, number][] = []
  for (const [start, end] of spans) {
    const last = merged.at(-1)
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end)
      continue
    }
    merged.push([start, end])
  }
  return merged
}

export interface SiteSearchResult {
  hit: SiteSearchHit
  score: number
  /** Source-title ranges the query covers, for match emphasis. */
  titleMatches: [number, number][]
}

/**
 * Rank the catalog for a query. Each token contributes its best field match,
 * covering every token beats a strong partial hit, and an exact or leading
 * title match settles the rest. Two gates keep the tail honest: once anything
 * matches the whole query, thinner matches are dropped, and a match has to
 * clear a minimum average relevance to earn a row at all.
 *
 * Empty query → [].
 */
export function searchSiteCatalog(
  index: SiteSearchIndex,
  query: string,
  limit = 8,
): SiteSearchResult[] {
  const phrase = foldForSearch(query.trim())
  const tokens = meaningfulTokens(phrase)
  if (tokens.length === 0) return []

  const scored: {
    entry: SiteSearchIndexEntry
    score: number
    covered: number
  }[] = []
  let bestCoverage = 0

  for (const entry of index) {
    let relevance = 0
    let covered = 0

    for (const token of tokens) {
      const tokenScore = scoreToken(entry, token)
      if (tokenScore === 0) continue
      covered += 1
      relevance += tokenScore
    }

    if (covered === 0) continue
    if (relevance < covered * MIN_RELEVANCE_PER_TOKEN) continue

    const title = entry.titleFold.text
    if (title === phrase) relevance += SCORE.phraseExact
    else if (title.startsWith(phrase)) relevance += SCORE.phrasePrefix
    else if (containsPhraseAtWordStart(title, phrase)) {
      relevance += SCORE.phraseInside
    }

    let score = relevance + covered * SCORE.tokenCovered
    if (covered === tokens.length) score += SCORE.everyTokenCovered

    // A concise title matched by the same query is the more specific answer.
    score += KIND_PRIOR[entry.hit.kind] - Math.min(entry.titleTokens.length, 6)

    bestCoverage = Math.max(bestCoverage, covered)
    scored.push({ entry, score, covered })
  }

  return scored
    .filter((candidate) => candidate.covered === bestCoverage)
    .sort(
      (a, b) =>
        b.score - a.score ||
        KIND_RANK.get(a.entry.hit.kind)! - KIND_RANK.get(b.entry.hit.kind)! ||
        a.entry.hit.title.localeCompare(b.entry.hit.title),
    )
    .slice(0, limit)
    .map(({ entry, score }) => ({
      hit: entry.hit,
      score,
      titleMatches: titleMatchRanges(entry.titleFold, tokens),
    }))
}

/** Split a title into plain and emphasized runs for rendering. */
export function splitTitleMatches(
  title: string,
  ranges: [number, number][],
): { text: string; match: boolean }[] {
  const parts: { text: string; match: boolean }[] = []
  let cursor = 0

  for (const [start, end] of ranges) {
    if (start > cursor) {
      parts.push({ text: title.slice(cursor, start), match: false })
    }
    parts.push({ text: title.slice(start, end), match: true })
    cursor = end
  }

  if (cursor < title.length) {
    parts.push({ text: title.slice(cursor), match: false })
  }
  return parts
}

/**
 * Words that open a request rather than name a subject. A query that starts
 * with one reads as something to ask Cleo, not something to look up.
 */
const REQUEST_LEAD_WORDS = new Set([
  'am', 'are', 'ask', 'can', 'compare', 'contrast', 'could', 'describe', 'did',
  'do', 'does', 'draw', 'explain', 'find', 'generate', 'give', 'help', 'how',
  'is', 'list', 'make', 'plan', 'recommend', 'should', 'show', 'suggest',
  'summarise', 'summarize', 'tell', 'was', 'were', 'what', 'when', 'where',
  'which', 'who', 'whose', 'why', 'will', 'would', 'write',
])

const REQUEST_TOKEN_COUNT = 5

/**
 * True when a query reads as a question for Cleo rather than a catalog lookup,
 * which promotes the Ask Cleo row to the top of the suggestions.
 */
export function looksLikeCleoRequest(query: string): boolean {
  const trimmed = query.trim()
  if (!trimmed) return false
  if (trimmed.includes('?')) return true

  const tokens = searchTokens(trimmed)
  if (tokens.length >= REQUEST_TOKEN_COUNT) return true
  return tokens.length >= 2 && REQUEST_LEAD_WORDS.has(tokens[0]!)
}
