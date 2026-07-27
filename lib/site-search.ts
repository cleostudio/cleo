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
}

/** Prefer field guides over Maps deep links when match quality ties. */
const KIND_RANK: Record<SiteSearchKind, number> = {
  topic: 0,
  explore: 1,
  space: 2,
  maps: 3,
  surface: 4,
}

function matchRank(hit: SiteSearchHit, q: string): number {
  const title = hit.title.toLowerCase()
  if (title === q) return 0
  if (title.startsWith(q)) return 1
  if (title.includes(q)) return 2
  if (hit.subtitle.toLowerCase().includes(q)) return 3
  return 4
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
}
