/**
 * Client-safe Ask Cleo deep links (`/cleo?q=&g=`).
 * Kept free of catalog imports so guide pages and the ask-form stay light.
 */

export type PortalGuideFocus = {
  collection: 'explore' | 'space'
  slug: string
}

const GUIDE_FOCUS_PATTERN = /^(explore|space)\/([a-z0-9-]+)$/

/** Serialize a focus guide for the `g` query param. */
export function formatGuideFocus(guide: PortalGuideFocus): string {
  return `${guide.collection}/${guide.slug}`
}

/** Parse `explore/japan` / `space/europa` focus tokens. */
export function parseGuideFocus(value: string): PortalGuideFocus | null {
  const match = GUIDE_FOCUS_PATTERN.exec(value.trim())
  if (!match) {
    return null
  }
  return {
    collection: match[1] as PortalGuideFocus['collection'],
    slug: match[2]!,
  }
}

export function parseGuideFocusList(
  values: readonly string[],
): PortalGuideFocus[] {
  const seen = new Set<string>()
  const guides: PortalGuideFocus[] = []

  for (const value of values) {
    const parsed = parseGuideFocus(value)
    if (!parsed) continue
    const key = formatGuideFocus(parsed)
    if (seen.has(key)) continue
    seen.add(key)
    guides.push(parsed)
  }

  return guides
}

/** Default orientation prompt when linking from a field-guide page. */
export function cleoGuideAskPrompt(name: string): string {
  return `Give me a quick orientation to ${name}. Deep-link its field guide when you mention it.`
}

/**
 * Build `/cleo?q=…&g=collection/slug` for a guide page CTA.
 * `q` prefills the prompt; `g` pins grounding even if the user edits the text.
 */
export function cleoAskHref(options: {
  prompt: string
  guide?: PortalGuideFocus
}): string {
  const params = new URLSearchParams()
  const prompt = options.prompt.trim()
  if (prompt) {
    params.set('q', prompt.slice(0, 10_000))
  }
  if (options.guide) {
    params.set('g', formatGuideFocus(options.guide))
  }
  const query = params.toString()
  return query ? `/cleo?${query}` : '/cleo'
}
