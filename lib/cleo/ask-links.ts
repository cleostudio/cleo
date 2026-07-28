/**
 * Cross-site deep links into /cleo with a prefilled (optionally auto-submitted)
 * prompt. Kept free of heavy catalog imports so guide pages and the homepage
 * search client can share the same URL contract.
 */

export const CLEO_ASK_QUERY_PARAM = 'q'
export const CLEO_ASK_AUTO_PARAM = 'auto'
export const CLEO_ASK_MAX_PROMPT_LENGTH = 10_000

export type CleoAskCollection =
  | 'explore'
  | 'space'
  | 'topics'
  | 'gallery'
  | 'writing'

export type CleoAskIntent = {
  /** Prompt text placed in the Cleo input (and submitted when auto). */
  prompt: string
  /** When true, AskForm submits once on an empty conversation. */
  autoSubmit: boolean
}

function clampPrompt(prompt: string) {
  return prompt.trim().slice(0, CLEO_ASK_MAX_PROMPT_LENGTH)
}

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string') return item
    }
  }
  return undefined
}

function isTruthyFlag(value: string | undefined) {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return (
    normalized === '1' ||
    normalized === 'true' ||
    normalized === 'yes' ||
    normalized === 'auto'
  )
}

/** Build `/cleo?q=…` (and optional `auto=1`) for portal entry points. */
export function cleoAskHref(
  prompt: string,
  options?: { autoSubmit?: boolean },
): string {
  const trimmed = clampPrompt(prompt)
  if (!trimmed) return '/cleo'

  const params = new URLSearchParams()
  params.set(CLEO_ASK_QUERY_PARAM, trimmed)
  if (options?.autoSubmit) {
    params.set(CLEO_ASK_AUTO_PARAM, '1')
  }
  return `/cleo?${params.toString()}`
}

/**
 * Parse Ask Cleo intent from Next.js `searchParams` or a query-string object.
 * Returns null when `q` is missing/blank.
 */
export function parseCleoAskSearchParams(
  searchParams:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
    | null
    | undefined,
): CleoAskIntent | null {
  if (!searchParams) return null

  const rawQ =
    searchParams instanceof URLSearchParams
      ? searchParams.get(CLEO_ASK_QUERY_PARAM) ?? undefined
      : firstString(searchParams[CLEO_ASK_QUERY_PARAM])
  const prompt = clampPrompt(rawQ ?? '')
  if (!prompt) return null

  const rawAuto =
    searchParams instanceof URLSearchParams
      ? searchParams.get(CLEO_ASK_AUTO_PARAM) ?? undefined
      : firstString(searchParams[CLEO_ASK_AUTO_PARAM])

  return {
    prompt,
    autoSubmit: isTruthyFlag(rawAuto),
  }
}

/** Orientation prompt for an Explore or Space field guide. */
export function guideAskPrompt(
  collection: 'explore' | 'space',
  name: string,
): string {
  const subject = name.trim()
  if (!subject) {
    return collection === 'explore'
      ? 'Give me a quick orientation to a country on this site. Deep-link its Explore field guide when you mention it.'
      : 'Give me a quick orientation to a Space subject on this site. Deep-link its Space field guide when you mention it.'
  }

  if (collection === 'explore') {
    return `Give me a quick orientation to ${subject}. Deep-link its Explore field guide when you mention the country, and include a curated photograph if it helps.`
  }

  return `Give me a quick orientation to ${subject}. Deep-link its Space field guide when you mention it, and include a curated photograph if it helps.`
}

/** Ask about one notable place inside an Explore country guide. */
export function placeAskPrompt(placeName: string, countryName: string): string {
  const place = placeName.trim()
  const country = countryName.trim()
  if (!place || !country) {
    return guideAskPrompt('explore', country || place)
  }
  return `Tell me about ${place} in ${country}. Deep-link the ${country} Explore field guide, and include a curated photograph if it helps.`
}

/** Ask about one notable feature inside a Space field guide. */
export function featureAskPrompt(
  featureName: string,
  subjectName: string,
): string {
  const feature = featureName.trim()
  const subject = subjectName.trim()
  if (!feature || !subject) {
    return guideAskPrompt('space', subject || feature)
  }
  return `Tell me about ${feature} on ${subject}. Deep-link the ${subject} Space field guide, and include a curated photograph if it helps.`
}

/** Compare two catalog subjects in the same collection. */
export function compareAskPrompt(
  collection: 'explore' | 'space',
  leftName: string,
  rightName: string,
): string {
  const left = leftName.trim()
  const right = rightName.trim()
  if (!left || !right) {
    return guideAskPrompt(collection, left || right)
  }

  if (collection === 'explore') {
    return `Compare ${left} and ${right} in a few sharp points. Deep-link each Explore field guide when you name the countries.`
  }

  return `Compare ${left} and ${right} in a few sharp points. Deep-link each Space field guide when you name the subjects.`
}

/** Ask about a Gallery photograph (place or space feature title). */
export function galleryItemAskPrompt(
  title: string,
  subjectName: string,
  collection: 'places' | 'space',
): string {
  const item = title.trim()
  const subject = subjectName.trim()
  if (!item || !subject) {
    return collection === 'space'
      ? guideAskPrompt('space', subject || item)
      : guideAskPrompt('explore', subject || item)
  }

  if (collection === 'space') {
    return `Tell me about the Gallery photograph “${item}” (${subject}). Deep-link the ${subject} Space guide and include that curated photograph if it helps.`
  }

  return `Tell me about the Gallery photograph “${item}” in ${subject}. Deep-link the ${subject} Explore guide and include that curated photograph if it helps.`
}

/** Ask about a Writing essay on this site. */
export function essayAskPrompt(title: string, slug?: string): string {
  const name = title.trim()
  if (!name) {
    return 'Help me pick a Writing essay on this site, then deep-link it.'
  }
  const path = slug?.trim() ? `/blog/${slug.trim()}` : undefined
  return path
    ? `Discuss the Writing essay “${name}” (${path}). Deep-link that essay when you mention it, and connect it to related Explore, Space, or Gallery pages when useful.`
    : `Discuss the Writing essay “${name}”. Deep-link it when you mention it, and connect it to related Explore, Space, or Gallery pages when useful.`
}

/** Broader prompts for Topics / Gallery / Explore & Space / Writing indexes. */
export function surfaceAskPrompt(surface: CleoAskCollection): string {
  switch (surface) {
    case 'explore':
      return 'Help me pick a country field guide to start with, then deep-link it.'
    case 'space':
      return 'Help me pick a Space field guide to start with, then deep-link it.'
    case 'topics':
      return 'Give me a quick tour of the Topics on this site and deep-link the collections that fit.'
    case 'gallery':
      return 'Help me find interesting photographs in the Gallery — suggest a few subjects and deep-link them.'
    case 'writing':
      return 'Help me pick a Writing essay to start with, then deep-link it.'
  }
}

/**
 * Homepage search → Cleo prompt.
 * When catalog matches already exist, ask Cleo to help choose among them.
 * When none match, ask Cleo to cover the topic and deep-link anything related.
 */
export function searchAskPrompt(
  query: string,
  options?: { hasMatches?: boolean },
): string {
  const trimmed = query.trim()
  if (!trimmed) {
    return 'Help me explore this knowledge portal.'
  }

  if (options?.hasMatches) {
    return `I searched the portal for “${trimmed}” and see matching guides. Help me choose where to start, then deep-link the best Explore, Space, Gallery, or Writing pages.`
  }

  return `I searched the portal for “${trimmed}” and found no matching guide. Help me with that topic, and deep-link any related Explore, Space, Gallery, or Writing pages if they exist.`
}

export function guideAskHref(
  collection: 'explore' | 'space',
  name: string,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(guideAskPrompt(collection, name), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function placeAskHref(
  placeName: string,
  countryName: string,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(placeAskPrompt(placeName, countryName), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function featureAskHref(
  featureName: string,
  subjectName: string,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(featureAskPrompt(featureName, subjectName), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function compareAskHref(
  collection: 'explore' | 'space',
  leftName: string,
  rightName: string,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(compareAskPrompt(collection, leftName, rightName), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function galleryItemAskHref(
  title: string,
  subjectName: string,
  collection: 'places' | 'space',
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(galleryItemAskPrompt(title, subjectName, collection), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function essayAskHref(
  title: string,
  slug?: string,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(essayAskPrompt(title, slug), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function surfaceAskHref(
  surface: CleoAskCollection,
  options?: { autoSubmit?: boolean },
) {
  return cleoAskHref(surfaceAskPrompt(surface), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}

export function searchAskHref(
  query: string,
  options?: { autoSubmit?: boolean; hasMatches?: boolean },
) {
  return cleoAskHref(searchAskPrompt(query, { hasMatches: options?.hasMatches }), {
    autoSubmit: options?.autoSubmit ?? true,
  })
}
