import { allAtlasEntries, atlasRendition } from '~/lib/atlas'
import { formatLatLon, mapsMarkers } from '~/lib/maps/markers'

export type MapsPhotoPreview = {
  src: string
  place: string
  alt: string
}

export type MapsCountryDossier = MapsPhotoPreview & {
  capital: string
  about: string
  places: string[]
  lat: number
  lon: number
  coordsLabel: string
}

function excerptAbout(about: string, maxChars = 220): string {
  const compact = about.replace(/\s+/g, ' ').trim()
  if (compact.length <= maxChars) return compact
  const slice = compact.slice(0, maxChars)
  const boundary = slice.lastIndexOf(' ')
  const trimmed = (boundary > 120 ? slice.slice(0, boundary) : slice).trimEnd()
  return `${trimmed}…`
}

/** Slim per-country place stills for the Maps selection chip (server → client). */
export function mapsPhotoPreviews(): Record<string, MapsPhotoPreview> {
  const out: Record<string, MapsPhotoPreview> = {}
  for (const entry of allAtlasEntries()) {
    out[entry.slug] = {
      src: atlasRendition(entry.photo, 640).src,
      place: entry.photo.placeName,
      alt: entry.photo.alt,
    }
  }
  return out
}

/** Richer per-country cards: photo, orientation excerpt, places, coordinates. */
export function mapsCountryDossiers(): Record<string, MapsCountryDossier> {
  const markers = new Map(mapsMarkers().map((marker) => [marker.slug, marker]))
  const out: Record<string, MapsCountryDossier> = {}

  for (const entry of allAtlasEntries()) {
    const marker = markers.get(entry.slug)
    if (!marker) continue
    out[entry.slug] = {
      src: atlasRendition(entry.photo, 640).src,
      place: entry.photo.placeName,
      alt: entry.photo.alt,
      capital: entry.facts.capital,
      about: excerptAbout(entry.about),
      places: entry.places.map((place) => place.name),
      lat: marker.lat,
      lon: marker.lon,
      coordsLabel: formatLatLon(marker.lat, marker.lon),
    }
  }

  return out
}
