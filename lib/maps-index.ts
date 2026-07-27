/**
 * Server-side Maps camera index. Import from Server Components only so the
 * client map can hydrate search/deep links without a second network hop.
 */

import countryIndex from '~/public/maps/country-index.json'
import type { MapCountryIndex } from '~/lib/maps'

export function loadMapCountryIndex(): MapCountryIndex {
  return countryIndex as MapCountryIndex
}
