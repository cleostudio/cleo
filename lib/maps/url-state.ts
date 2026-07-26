import { getMapPlace } from '~/lib/maps/places'

/** Query key for the focused Explore country on `/maps`. */
export const MAPS_COUNTRY_PARAM = 'c'

/** Read a country slug from a `?c=` search string. */
export function mapsCountryFromSearch(search: string): string | null {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  )
  const raw = params.get(MAPS_COUNTRY_PARAM)?.trim().toLowerCase()
  if (!raw) return null
  return getMapPlace(raw) ? raw : null
}

/** Build a Maps href, optionally focused on an Explore slug. */
export function mapsHref(slug?: string | null): string {
  if (!slug || !getMapPlace(slug)) return '/maps'
  return `/maps?${MAPS_COUNTRY_PARAM}=${encodeURIComponent(slug)}`
}

/**
 * Keep the address bar in sync with the focused country without a navigation.
 * Clears the param when `slug` is null.
 */
export function replaceMapsCountryInUrl(slug: string | null): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (slug && getMapPlace(slug)) {
    url.searchParams.set(MAPS_COUNTRY_PARAM, slug)
  } else {
    url.searchParams.delete(MAPS_COUNTRY_PARAM)
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next !== current) {
    window.history.replaceState(window.history.state, '', next)
  }
}
