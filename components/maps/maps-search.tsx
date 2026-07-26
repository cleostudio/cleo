'use client'

import { useEffect, useMemo, useState } from 'react'

import type { MapsMarker } from '~/lib/maps/markers'

export function MapsSearch({
  markers,
  onPick,
}: {
  markers: MapsMarker[]
  onPick: (marker: MapsMarker) => void
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

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

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const pick = (marker: MapsMarker) => {
    onPick(marker)
    setQuery('')
    setActiveIndex(0)
  }

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
        onKeyDown={(event) => {
          if (!matches.length) return
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((index) => Math.max(index - 1, 0))
          } else if (event.key === 'Enter') {
            event.preventDefault()
            const marker = matches[activeIndex]
            if (marker) pick(marker)
          } else if (event.key === 'Escape') {
            setQuery('')
          }
        }}
        placeholder="Name, code, or region"
        autoComplete="off"
        className="maps-search-input"
        aria-autocomplete="list"
        aria-controls="maps-country-results"
        aria-activedescendant={
          matches[activeIndex] ? `maps-option-${matches[activeIndex].slug}` : undefined
        }
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul
            id="maps-country-results"
            className="maps-search-list"
            role="listbox"
            aria-label="Country matches"
          >
            {matches.map((marker, index) => (
              <li key={marker.slug}>
                <button
                  type="button"
                  id={`maps-option-${marker.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="maps-search-option"
                  data-active={index === activeIndex ? 'true' : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => pick(marker)}
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
