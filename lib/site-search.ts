/**
 * Homepage typeahead types and pure filter/rank helpers.
 * Catalog assembly lives in `site-search-catalog.ts` so the client can import
 * this module without pulling full Explore/Space guide records into the bundle.
 */

export type SiteSearchKind =
  | 'explore'
  | 'space'
  | 'topic'
  | 'maps'
  | 'writing'
  | 'surface'

export interface SiteSearchHit {
  id: string
  kind: SiteSearchKind
  title: string
  /** Quiet meta shown on the right (e.g. "JP · Asia", "Space · Moon"). */
  subtitle: string
  href: string
  /** Lowercased haystack for substring matching. */
  searchText: string
  /**
   * When the query matches this capital name, prefer `capitalHref` for Maps
   * hits so homepage search opens the capital camera.
   */
  capitalName?: string
  capitalHref?: string
}

/** Prefer field guides over Maps deep links when match quality ties. */
const KIND_RANK: Record<SiteSearchKind, number> = {
  topic: 0,
  explore: 1,
  space: 2,
  writing: 3,
  maps: 4,
  surface: 5,
}

function matchRank(hit: SiteSearchHit, q: string): number {
  const title = hit.title.toLowerCase()
  if (title === q) return 0
  if (title.startsWith(q)) return 1
  if (title.includes(q)) return 2
  if (hit.subtitle.toLowerCase().includes(q)) return 3
  return 4
}

function presentSiteSearchHit(hit: SiteSearchHit, q: string): SiteSearchHit {
  if (
    hit.kind !== 'maps' ||
    !hit.capitalName ||
    !hit.capitalHref ||
    !hit.capitalName.toLowerCase().includes(q)
  ) {
    if (!hit.capitalName && !hit.capitalHref) return hit
    // Strip optional capital fields from the client-facing hit.
    const { capitalName: _n, capitalHref: _h, ...rest } = hit
    return rest
  }
  const { capitalName, capitalHref, ...rest } = hit
  return {
    ...rest,
    href: capitalHref,
    title: capitalName,
    subtitle: `Capital · ${hit.title} on the map`,
  }
}

/** Filter and rank hits for a query. Empty / whitespace query → []. */
export function filterSiteSearchHits(
  hits: SiteSearchHit[],
  query: string,
  limit = 8,
): SiteSearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return hits
    .filter((hit) => hit.searchText.includes(q))
    .sort((a, b) => {
      const rankDiff = matchRank(a, q) - matchRank(b, q)
      if (rankDiff !== 0) return rankDiff
      const kindDiff = KIND_RANK[a.kind] - KIND_RANK[b.kind]
      if (kindDiff !== 0) return kindDiff
      return a.title.localeCompare(b.title)
    })
    .slice(0, limit)
    .map((hit) => presentSiteSearchHit(hit, q))
}
