/**
 * The `/cleo?q=…` handoff. Anywhere on the site can hand Cleo a question by
 * linking to this route; `components/cleo/ask-form.tsx` reads the question on
 * arrival, asks it, and only then strips the parameter so a reload does not
 * re-run the turn.
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
 * The handoff prompt waiting in the current URL, or null when there is none.
 *
 * Reading is deliberately free of side effects: the URL stays the carrier until
 * a turn actually starts, so a chat shell that is torn down or re-activated
 * before the question is sent can still find it. Reading `location` directly
 * (rather than `useSearchParams`) keeps `/cleo` prerendered instead of bailing
 * the whole chat shell out to client-side rendering.
 */
export function readCleoPromptFromLocation(): string | null {
  if (typeof window === 'undefined') return null
  return parseCleoPromptParam(window.location.search)
}

/**
 * Drop the handoff parameter once the transcript owns the question, so a reload
 * starts clean and a later visit to `/cleo` does not re-run the turn.
 *
 * The existing history state is passed straight back through because it carries
 * the router's own marker, which is what keeps Next.js from reading this edit as
 * a navigation. The parameter is Cleo's alone and means nothing to routing.
 */
export function clearCleoPromptFromLocation(): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (!url.searchParams.has(CLEO_PROMPT_PARAM)) return

  url.searchParams.delete(CLEO_PROMPT_PARAM)
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  )
}
