/**
 * The `/cleo?q=…` handoff. Anywhere on the site can hand Cleo a question by
 * linking to this route; `components/cleo/ask-form.tsx` sends it once on mount
 * and strips the parameter so a reload does not re-run the turn.
 *
 * Client-safe: no catalog, model, or Node imports.
 */

export const CLEO_PROMPT_PARAM = 'q'

/**
 * A shared link should stay a link. Longer prompts belong in the prompt dock,
 * where the 10,000-character message limit applies.
 */
export const MAX_CLEO_PROMPT_PARAM_LENGTH = 1_000

/** Link that opens Cleo and immediately asks `prompt`. */
export function cleoAskHref(prompt: string): string {
  const trimmed = prompt.trim()
  if (!trimmed) return '/cleo'
  return `/cleo?${CLEO_PROMPT_PARAM}=${encodeURIComponent(trimmed.slice(0, MAX_CLEO_PROMPT_PARAM_LENGTH))}`
}

/** Read a handoff prompt out of a query string, or null when there is none. */
export function parseCleoPromptParam(search: string): string | null {
  let params: URLSearchParams
  try {
    params = new URLSearchParams(search)
  } catch {
    return null
  }

  const raw = params.get(CLEO_PROMPT_PARAM)
  if (raw === null) return null

  const prompt = raw.trim()
  if (!prompt || prompt.length > MAX_CLEO_PROMPT_PARAM_LENGTH) return null
  return prompt
}

/**
 * Take the handoff prompt from the current URL and drop the parameter, so the
 * transcript owns the question from then on and a reload starts clean. Reading
 * `location` directly (rather than `useSearchParams`) keeps `/cleo` prerendered
 * instead of bailing the whole chat shell out to client-side rendering.
 */
export function takeCleoPromptFromLocation(): string | null {
  if (typeof window === 'undefined') return null

  const prompt = parseCleoPromptParam(window.location.search)
  if (!prompt) return null

  const url = new URL(window.location.href)
  url.searchParams.delete(CLEO_PROMPT_PARAM)
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  )

  return prompt
}
