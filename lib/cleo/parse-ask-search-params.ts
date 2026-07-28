/**
 * Server-side Ask Cleo deep-link parsing. Resolves compact `topic=` shortcuts
 * against the Explore/Space catalogs — keep this module off the client Ask
 * link bundle (`ask-links.ts` stays import-light).
 */

import {
  CLEO_ASK_AUTO_PARAM,
  CLEO_ASK_MAX_PROMPT_LENGTH,
  CLEO_ASK_QUERY_PARAM,
  CLEO_ASK_TOPIC_PARAM,
  type CleoAskIntent,
  guideAskPrompt,
} from '~/lib/cleo/ask-links'
import { getCountry } from '~/lib/countries'
import { getSpaceSubject } from '~/lib/space'

/** Reject pathological `topic=` values before catalog lookup. */
export const CLEO_ASK_MAX_TOPIC_LENGTH = 96

const TOPIC_PATH = /^(explore|space)\/([a-z0-9-]+)$/i

function clampPrompt(prompt: string) {
  return prompt.trim().slice(0, CLEO_ASK_MAX_PROMPT_LENGTH)
}

/**
 * Normalize compact topic shortcuts:
 * `explore/japan`, `/explore/japan`, optional whitespace.
 */
export function normalizeTopicPath(topic: string): string | null {
  const trimmed = topic.trim()
  if (!trimmed || trimmed.length > CLEO_ASK_MAX_TOPIC_LENGTH) return null

  const withoutLeadingSlash = trimmed.replace(/^\/+/, '')
  const match = TOPIC_PATH.exec(withoutLeadingSlash)
  if (!match) return null

  return `${match[1]!.toLowerCase()}/${match[2]!.toLowerCase()}`
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

/**
 * Resolve `explore/japan`, `/explore/japan`, or `space/mars` to a guide
 * orientation prompt. Unknown slugs return null so callers can fall back.
 */
export function promptFromTopicPath(topic: string): string | null {
  const normalized = normalizeTopicPath(topic)
  if (!normalized) return null

  const [collectionRaw, slug] = normalized.split('/')
  const collection = collectionRaw as 'explore' | 'space'

  if (collection === 'explore') {
    const country = getCountry(slug!)
    if (!country) return null
    return guideAskPrompt('explore', country.name)
  }

  const subject = getSpaceSubject(slug!)
  if (!subject) return null
  return guideAskPrompt('space', subject.name)
}

/**
 * Parse Ask Cleo intent from Next.js `searchParams` or a query-string object.
 * Prefers explicit `q=`; otherwise resolves `topic=explore|space/slug`.
 * `auto` defaults to true for `topic=` shortcuts (shareable one-shot starts).
 */
export function parseCleoAskSearchParams(
  searchParams:
    | URLSearchParams
    | Record<string, string | string[] | undefined>
    | null
    | undefined,
): CleoAskIntent | null {
  if (!searchParams) return null

  const rawAuto =
    searchParams instanceof URLSearchParams
      ? searchParams.get(CLEO_ASK_AUTO_PARAM) ?? undefined
      : firstString(searchParams[CLEO_ASK_AUTO_PARAM])

  const rawQ =
    searchParams instanceof URLSearchParams
      ? searchParams.get(CLEO_ASK_QUERY_PARAM) ?? undefined
      : firstString(searchParams[CLEO_ASK_QUERY_PARAM])
  const fromQuery = clampPrompt(rawQ ?? '')
  if (fromQuery) {
    return {
      prompt: fromQuery,
      autoSubmit: isTruthyFlag(rawAuto),
    }
  }

  const rawTopic =
    searchParams instanceof URLSearchParams
      ? searchParams.get(CLEO_ASK_TOPIC_PARAM) ?? undefined
      : firstString(searchParams[CLEO_ASK_TOPIC_PARAM])
  const fromTopic = rawTopic ? promptFromTopicPath(rawTopic) : null
  if (!fromTopic) return null

  return {
    prompt: fromTopic,
    autoSubmit: rawAuto === undefined ? true : isTruthyFlag(rawAuto),
  }
}
