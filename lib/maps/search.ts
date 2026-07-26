import type { MapsMarker } from '~/lib/maps/markers'

export type MapsSearchDoc = {
  marker: MapsMarker
  capital: string
  places: readonly string[]
}

export type MapsSearchHit = {
  marker: MapsMarker
  score: number
  /** Why this row matched — shown beside the country name. */
  matchLabel: string
}

/** Build searchable docs from markers + atlas-backed dossiers. */
export function mapsSearchDocs(
  markers: readonly MapsMarker[],
  dossiers: Record<string, { capital: string; places: readonly string[] }>,
): MapsSearchDoc[] {
  return markers.map((marker) => {
    const dossier = dossiers[marker.slug]
    return {
      marker,
      capital: dossier?.capital ?? '',
      places: dossier?.places ?? [],
    }
  })
}

function scoreDoc(doc: MapsSearchDoc, q: string): MapsSearchHit | null {
  const name = doc.marker.name.toLowerCase()
  const code = doc.marker.code.toLowerCase()
  const region = doc.marker.region.toLowerCase()
  const subregion = doc.marker.subregion.toLowerCase()
  const capital = doc.capital.toLowerCase()

  if (name === q) {
    return { marker: doc.marker, score: 100, matchLabel: `${doc.marker.code} · ${doc.marker.region}` }
  }
  if (code === q) {
    return { marker: doc.marker, score: 95, matchLabel: `Code · ${doc.marker.code}` }
  }
  if (capital && capital === q) {
    return { marker: doc.marker, score: 92, matchLabel: `Capital · ${doc.capital}` }
  }
  if (name.startsWith(q)) {
    return { marker: doc.marker, score: 88, matchLabel: `${doc.marker.code} · ${doc.marker.region}` }
  }
  if (capital && capital.startsWith(q)) {
    return { marker: doc.marker, score: 84, matchLabel: `Capital · ${doc.capital}` }
  }
  if (name.includes(q)) {
    return { marker: doc.marker, score: 72, matchLabel: `${doc.marker.code} · ${doc.marker.region}` }
  }
  if (capital && capital.includes(q)) {
    return { marker: doc.marker, score: 68, matchLabel: `Capital · ${doc.capital}` }
  }

  const place = doc.places.find((entry) => entry.toLowerCase().includes(q))
  if (place) {
    return { marker: doc.marker, score: 62, matchLabel: `Place · ${place}` }
  }

  if (subregion.includes(q)) {
    return { marker: doc.marker, score: 40, matchLabel: doc.marker.subregion }
  }
  if (region.includes(q)) {
    return { marker: doc.marker, score: 30, matchLabel: doc.marker.region }
  }
  if (code.includes(q)) {
    return { marker: doc.marker, score: 25, matchLabel: `Code · ${doc.marker.code}` }
  }

  return null
}

/**
 * Ranked Maps search: name / ISO code / region, plus atlas capital and
 * notable places. Higher scores win; ties keep catalog order.
 */
export function filterMapsMarkersByQuery(
  docs: readonly MapsSearchDoc[],
  query: string,
  limit = 7,
): MapsSearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const hits: MapsSearchHit[] = []
  for (const doc of docs) {
    const hit = scoreDoc(doc, q)
    if (hit) hits.push(hit)
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.marker.name.localeCompare(b.marker.name)
  })

  return hits.slice(0, limit)
}
