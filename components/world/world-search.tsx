'use client'

import { useMemo, useState } from 'react'

import type { WorldMarker } from '~/lib/world/markers'
import type { WorldRegion } from '~/lib/world/regions'

export function WorldSearch({
  markers,
  region = null,
  onPick,
}: {
  markers: WorldMarker[]
  region?: WorldRegion | null
  onPick: (marker: WorldMarker) => void
}) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return markers
      .filter((marker) => (region ? marker.region === region : true))
      .filter(
        (marker) =>
          marker.name.toLowerCase().includes(q) ||
          marker.code.toLowerCase().includes(q) ||
          marker.region.toLowerCase().includes(q) ||
          marker.subregion.toLowerCase().includes(q),
      )
      .slice(0, 7)
  }, [markers, query, region])

  return (
    <div className="world-search">
      <label className="world-search-label" htmlFor="world-country-search">
        Find a country
      </label>
      <input
        id="world-country-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={region ? `In ${region}…` : 'Name, code, or region'}
        autoComplete="off"
        className="world-search-input"
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul className="world-search-list" role="listbox" aria-label="Country matches">
            {matches.map((marker) => (
              <li key={marker.slug}>
                <button
                  type="button"
                  role="option"
                  className="world-search-option"
                  onClick={() => {
                    onPick(marker)
                    setQuery('')
                  }}
                >
                  <span className="world-search-option-name">{marker.name}</span>
                  <span className="world-search-option-meta">
                    {marker.code} · {marker.region}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="world-search-empty" aria-live="polite">
            No countries match “{query.trim()}”
            {region ? ` in ${region}` : ''}.
          </p>
        )
      ) : null}
    </div>
  )
}
