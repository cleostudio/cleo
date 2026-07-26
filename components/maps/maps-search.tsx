'use client'

import { useEffect, useId, useMemo, useState } from 'react'

import type { MapsMarker } from '~/lib/maps/markers'
import {
  filterMapsMarkersByQuery,
  type MapsSearchDoc,
} from '~/lib/maps/search'

export function MapsSearch({
  docs,
  onPick,
}: {
  docs: MapsSearchDoc[]
  onPick: (marker: MapsMarker) => void
}) {
  const listId = useId()
  const inputId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(
    () => filterMapsMarkersByQuery(docs, query, 7),
    [docs, query],
  )
  const expanded = query.trim().length > 0 && matches.length > 0

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
      <label className="maps-search-label" htmlFor={inputId}>
        Find a country
      </label>
      <input
        id={inputId}
        type="search"
        role="combobox"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            if (query) {
              event.preventDefault()
              setQuery('')
            }
            return
          }
          if (!matches.length) return
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((index) => Math.min(index + 1, matches.length - 1))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((index) => Math.max(index - 1, 0))
          } else if (event.key === 'Enter') {
            event.preventDefault()
            const hit = matches[activeIndex]
            if (hit) pick(hit.marker)
          }
        }}
        placeholder="Name, capital, place, or code"
        autoComplete="off"
        className="maps-search-input"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-activedescendant={
          expanded && matches[activeIndex]
            ? `${listId}-${matches[activeIndex].marker.slug}`
            : undefined
        }
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul
            id={listId}
            className="maps-search-list"
            role="listbox"
            aria-label="Country matches"
          >
            {matches.map((hit, index) => (
              <li key={hit.marker.slug}>
                <button
                  type="button"
                  id={`${listId}-${hit.marker.slug}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="maps-search-option"
                  data-active={index === activeIndex ? 'true' : undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => pick(hit.marker)}
                >
                  <span className="maps-search-option-name">
                    {hit.marker.name}
                  </span>
                  <span className="maps-search-option-meta">{hit.matchLabel}</span>
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
