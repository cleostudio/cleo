'use client'

import { useEffect, useId, useMemo, useState } from 'react'

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
  const listId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

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

  useEffect(() => {
    setActiveIndex(0)
  }, [query, region])

  const pick = (marker: WorldMarker) => {
    onPick(marker)
    setQuery('')
    setActiveIndex(0)
  }

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
        onKeyDown={(event) => {
          if (!query.trim() || matches.length === 0) return
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % matches.length)
            return
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + matches.length) % matches.length)
            return
          }
          if (event.key === 'Enter') {
            event.preventDefault()
            const marker = matches[activeIndex] ?? matches[0]
            if (marker) pick(marker)
            return
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            setQuery('')
          }
        }}
        placeholder={region ? `In ${region}…` : 'Name, code, or region'}
        autoComplete="off"
        className="world-search-input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={query.trim().length > 0 && matches.length > 0}
        aria-controls={listId}
        aria-activedescendant={
          matches[activeIndex] ? `${listId}-${matches[activeIndex].slug}` : undefined
        }
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul
            id={listId}
            className="world-search-list"
            role="listbox"
            aria-label="Country matches"
          >
            {matches.map((marker, index) => (
              <li key={marker.slug}>
                <button
                  type="button"
                  id={`${listId}-${marker.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="world-search-option"
                  data-active={index === activeIndex || undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => pick(marker)}
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
