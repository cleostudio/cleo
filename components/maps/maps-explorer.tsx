'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { EarthGlobeLazy } from '~/components/maps/earth-globe-lazy'
import { formatLatLng } from '~/lib/maps/geo'
import { filterMapPlaces, getMapPlace, type MapPlace } from '~/lib/maps/places'

export function MapsExplorer() {
  const searchId = useId()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [focusToken, setFocusToken] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const hits = filterMapPlaces(query)
  const selected = selectedSlug ? getMapPlace(selectedSlug) : undefined

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function focusPlace(place: MapPlace) {
    setSelectedSlug(place.slug)
    setFocusToken((token) => token + 1)
    setQuery('')
    inputRef.current?.blur()
  }

  function clearSelection() {
    setSelectedSlug(null)
  }

  return (
    <div className="maps-explorer">
      <div className="maps-explorer-chrome">
        <div className="maps-search">
          <label className="sr-only" htmlFor={searchId}>
            Find a country
          </label>
          <input
            ref={inputRef}
            id={searchId}
            type="search"
            className="maps-search-input"
            placeholder="Find a country"
            value={query}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              hits[activeIndex] ? `${listId}-${hits[activeIndex].slug}` : undefined
            }
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((index) =>
                  hits.length ? (index + 1) % hits.length : 0,
                )
                return
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((index) =>
                  hits.length ? (index - 1 + hits.length) % hits.length : 0,
                )
                return
              }
              if (event.key === 'Enter' && hits[activeIndex]) {
                event.preventDefault()
                focusPlace(hits[activeIndex])
                return
              }
              if (event.key === 'Escape') {
                if (query) {
                  event.preventDefault()
                  setQuery('')
                } else if (selectedSlug) {
                  event.preventDefault()
                  clearSelection()
                }
              }
            }}
          />
          {hits.length > 0 ? (
            <ul id={listId} className="maps-search-results" role="listbox">
              {hits.map((place, index) => (
                <li key={place.slug} role="presentation">
                  <button
                    type="button"
                    id={`${listId}-${place.slug}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className="maps-search-option"
                    data-active={index === activeIndex || undefined}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => focusPlace(place)}
                  >
                    <span className="maps-search-option-code">{place.code}</span>
                    <span className="maps-search-option-name">{place.name}</span>
                    <span className="maps-search-option-region">
                      {place.subregion}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {selected ? (
          <aside className="maps-place-card" aria-live="polite">
            <div className="maps-place-card-head">
              <p className="maps-place-card-code">{selected.code}</p>
              <button
                type="button"
                className="maps-place-card-close"
                onClick={clearSelection}
                aria-label={`Clear ${selected.name}`}
              >
                Close
              </button>
            </div>
            <h2 className="maps-place-card-title">{selected.name}</h2>
            <p className="maps-place-card-meta">
              {selected.subregion}
              <span aria-hidden> · </span>
              {formatLatLng(selected.latitude, selected.longitude)}
            </p>
            <Link
              href={`/explore/${selected.slug}`}
              className="maps-place-card-link"
            >
              Open Explore guide
            </Link>
          </aside>
        ) : null}
      </div>

      <EarthGlobeLazy
        selectedSlug={selectedSlug}
        focusToken={focusToken}
        onSelect={setSelectedSlug}
      />
    </div>
  )
}
