/**
 * Client-safe helpers for Cleo deep-link query params (`q`, `auto`, `topic`).
 * Shared so AskForm (and any future client bootstrap) clear the same keys.
 */

import {
  CLEO_ASK_AUTO_PARAM,
  CLEO_ASK_QUERY_PARAM,
  CLEO_ASK_TOPIC_PARAM,
} from '~/lib/cleo/ask-links'

export const CLEO_ASK_PARAM_KEYS = [
  CLEO_ASK_QUERY_PARAM,
  CLEO_ASK_AUTO_PARAM,
  CLEO_ASK_TOPIC_PARAM,
] as const

/** True when the URL still carries an Ask Cleo deep-link param. */
export function urlHasCleoAskParams(url: URL): boolean {
  return CLEO_ASK_PARAM_KEYS.some((key) => url.searchParams.has(key))
}

/**
 * Remove Ask Cleo deep-link params from a URL (mutates `url.searchParams`).
 * Returns true when at least one param was present.
 */
export function stripCleoAskParams(url: URL): boolean {
  if (!urlHasCleoAskParams(url)) return false
  for (const key of CLEO_ASK_PARAM_KEYS) {
    url.searchParams.delete(key)
  }
  return true
}

/**
 * Strip Ask params from the current location via `history.replaceState`.
 * No-op when `window` is unavailable or no Ask params remain.
 */
export function clearCleoAskParamsFromLocation(
  historyState: unknown = typeof window !== 'undefined'
    ? window.history.state
    : null,
): boolean {
  if (typeof window === 'undefined') return false

  const url = new URL(window.location.href)
  if (!stripCleoAskParams(url)) return false

  window.history.replaceState(
    historyState,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  )
  return true
}
