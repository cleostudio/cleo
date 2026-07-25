import atlas from '~/content/atlas.json'
import { countries, countriesByRegion } from '~/lib/countries'
import type { AtlasEntry, AtlasManifest } from './types'
import { validateAtlasManifest } from './validate'

const manifest = atlas as unknown as AtlasManifest

// Fail fast in development / tests if the checked-in manifest drifts.
validateAtlasManifest(manifest)

const bySlug = new Map(Object.entries(manifest))

export type { AtlasEntry, AtlasManifest, AtlasPhoto, AtlasPlace, AtlasSource } from './types'
export { validateAtlasManifest, AtlasValidationError } from './validate'
export {
  atlasIntrinsicSize,
  atlasRendition,
  atlasSrcSet,
} from './static-image'

export function getAtlasEntry(slug: string): AtlasEntry | undefined {
  return bySlug.get(slug)
}

export function allAtlasEntries(): AtlasEntry[] {
  return countries.map((country) => {
    const entry = bySlug.get(country.slug)
    if (!entry) throw new Error(`Missing atlas entry for ${country.slug}`)
    return entry
  })
}

export function atlasEntriesByRegion(): [string, AtlasEntry[]][] {
  return countriesByRegion().map(([region, regionCountries]) => [
    region,
    regionCountries.map((country) => {
      const entry = bySlug.get(country.slug)
      if (!entry) throw new Error(`Missing atlas entry for ${country.slug}`)
      return entry
    }),
  ])
}

export function atlasDescription(entry: AtlasEntry) {
  return entry.about
}

export function atlasPhotoPreview(limit = 3): AtlasEntry[] {
  return allAtlasEntries().slice(0, limit)
}

export function atlasRegions(): string[] {
  return atlasEntriesByRegion().map(([region]) => region)
}
