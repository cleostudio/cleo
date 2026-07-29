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

/** The first gallery image remains the country guide hero. */
export function atlasFeaturedPhoto(entry: AtlasEntry) {
  return entry.photos[0]
}

export function atlasPhotoPreview(limit = 3): AtlasEntry[] {
  return allAtlasEntries().slice(0, limit)
}

/** Curated homepage highlights — one place photo per country slug. */
const HIGHLIGHT_SLUGS = [
  'japan',
  'greece',
  'iceland',
  'egypt',
  'peru',
  'italy',
  'new-zealand',
  'norway',
] as const

export function highlightedAtlasEntries(limit = 6): AtlasEntry[] {
  const selected: AtlasEntry[] = []
  for (const slug of HIGHLIGHT_SLUGS) {
    const entry = bySlug.get(slug)
    if (entry) selected.push(entry)
    if (selected.length >= limit) break
  }
  if (selected.length < limit) {
    for (const entry of allAtlasEntries()) {
      if (selected.some((item) => item.slug === entry.slug)) continue
      selected.push(entry)
      if (selected.length >= limit) break
    }
  }
  return selected
}

export function atlasRegions(): string[] {
  return atlasEntriesByRegion().map(([region]) => region)
}
