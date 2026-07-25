import guides from '~/content/country-guides.json'
import { countries, countriesByRegion, type Country } from '~/lib/countries'

export interface CountryPlace {
  name: string
  image: string
  alt: string
  credit: string
}

export interface CountryGuide {
  code: string
  name: string
  slug: string
  region: string
  subregion: string
  about: string
  place: CountryPlace
}

const bySlug = new Map(
  Object.entries(guides as Record<string, CountryGuide>).map(([slug, guide]) => [
    slug,
    guide,
  ]),
)

export function getCountryGuide(slug: string): CountryGuide | undefined {
  return bySlug.get(slug)
}

export function allCountryGuides(): CountryGuide[] {
  return countries.map((country) => {
    const guide = bySlug.get(country.slug)
    if (!guide) {
      throw new Error(`Missing country guide for ${country.slug}`)
    }
    return guide
  })
}

export function countryGuidesByRegion(): [string, CountryGuide[]][] {
  return countriesByRegion().map(([region, regionCountries]) => [
    region,
    regionCountries.map((country) => {
      const guide = bySlug.get(country.slug)
      if (!guide) {
        throw new Error(`Missing country guide for ${country.slug}`)
      }
      return guide
    }),
  ])
}

export function countryDescription(country: Country | CountryGuide) {
  const guide = 'about' in country ? country : bySlug.get(country.slug)
  if (guide?.about) return guide.about
  return `${country.name} — ${country.subregion}, ${country.region}.`
}

export function photoPreviewGuides(limit = 3): CountryGuide[] {
  return allCountryGuides().slice(0, limit)
}
