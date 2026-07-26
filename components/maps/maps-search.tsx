'use client'

import { useMemo, useState } from 'react'

import type { MapsMarker } from '~/lib/maps/markers'

export function MapsSearch({
  markers,
  onPick,
}: {
  markers: MapsMarker[]
  onPick: (marker: MapsMarker) => void
}) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return markers
      .filter(
        (marker) =>
          marker.name.toLowerCase().includes(q) ||
          marker.code.toLowerCase().includes(q) ||
          marker.region.toLowerCase().includes(q) ||
          marker.subregion.toLowerCase().includes(q),
      )
      .slice(0, 7)
  }, [markers, query])

  return (
    <div className="maps-search">
      <label className="maps-search-label" htmlFor="maps-country-search">
        Find a country
      </label>
      <input
        id="maps-country-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Name, code, or region"
        autoComplete="off"
        className="maps-search-input"
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul className="maps-search-list" role="listbox" aria-label="Country matches">
            {matches.map((marker) => (
              <li key={marker.slug}>
                <button
                  type="button"
                  role="option"
                  className="maps-search-option"
                  onClick={() => {
                    onPick(marker)
                    setQuery('')
                  }}
                >
                  <span className="maps-search-option-name">{marker.name}</span>
                  <span className="maps-search-option-meta">
                    {marker.code} · {marker.region}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="maps-search-empty" aria-live="polite">
            No countries match “{query.trim()}”.
          </p>
        )
      ) : null}
    </div>
  )
}
