'use client'

import { useEffect, useId, useRef, useState } from 'react'

import type { GalleryCollectionFilter } from '~/lib/gallery-filters'
import { replaceQueryParam } from '~/lib/url-query'

const SEARCH_FIELD_CLASS =
  'w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground'

export function PlaceGalleryToolbar({
  initialQuery = '',
  initialCollection = 'all',
}: {
  initialQuery?: string
  initialCollection?: GalleryCollectionFilter
}) {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(initialQuery)
  const [collection, setCollection] =
    useState<GalleryCollectionFilter>(initialCollection)

  useEffect(() => {
    setQuery(initialQuery)
    setCollection(initialCollection)
  }, [initialCollection, initialQuery])

  useEffect(() => {
    replaceQueryParam('q', query)
  }, [query])

  useEffect(() => {
    replaceQueryParam('collection', collection === 'all' ? '' : collection)
  }, [collection])

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-place-gallery]')
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
    const empty = root.querySelector<HTMLElement>('[data-gallery-empty]')
    const normalizedQuery = query.trim().toLowerCase()
    let nextVisible = 0

    for (const item of items) {
      const searchText = item.dataset.searchText ?? ''
      const itemCollection = item.dataset.collection ?? ''
      const matchesCollection =
        collection === 'all' || itemCollection === collection
      const matchesQuery =
        !normalizedQuery || searchText.toLowerCase().includes(normalizedQuery)
      const visible = matchesCollection && matchesQuery
      item.hidden = !visible
      if (visible) nextVisible += 1
    }

    if (empty) empty.hidden = nextVisible !== 0
  }, [collection, query])

  return (
    <div
      ref={rootRef}
      className="gallery-toolbar sticky top-0 z-[2] -mx-6 mb-4 bg-background px-6 py-3"
    >
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Country, place, or space body"
        aria-label="Search photographs"
        className={SEARCH_FIELD_CLASS}
      />
      <div
        className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"
        role="group"
        aria-label="Photograph set"
      >
        {(
          [
            ['all', 'All'],
            ['places', 'Places'],
            ['space', 'Space'],
          ] as const
        ).map(([value, label]) => {
          const active = collection === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setCollection(value)}
              className={
                active
                  ? 'text-foreground underline decoration-[color-mix(in_oklab,var(--foreground)_35%,transparent)] underline-offset-[0.18em] outline-none focus-visible:ring-1 focus-visible:ring-foreground'
                  : 'outline-none transition-colors duration-150 ease-[var(--ease-swift)] hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground'
              }
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
