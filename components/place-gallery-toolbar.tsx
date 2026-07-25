'use client'

import { useEffect, useId, useState } from 'react'

export function PlaceGalleryToolbar({
  filterKeys,
  totalCount,
}: {
  filterKeys: string[]
  totalCount: number
}) {
  const searchId = useId()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(totalCount)

  useEffect(() => {
    const root = document.querySelector('[data-place-gallery]')
    if (!(root instanceof HTMLElement)) return

    const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
    const empty = root.querySelector<HTMLElement>('[data-gallery-empty]')
    const normalizedQuery = query.trim().toLowerCase()
    let nextVisible = 0

    for (const item of items) {
      const filterKey = item.dataset.filterKey ?? ''
      const searchText = item.dataset.searchText ?? ''
      const matchesFilter = filter === 'all' || filterKey === filter
      const matchesQuery =
        !normalizedQuery || searchText.toLowerCase().includes(normalizedQuery)
      const visible = matchesFilter && matchesQuery
      item.hidden = !visible
      if (visible) nextVisible += 1
    }

    if (empty) empty.hidden = nextVisible !== 0
    setVisibleCount(nextVisible)
  }, [filter, query])

  return (
    <div className="gallery-toolbar sticky top-0 z-[2] -mx-6 mb-6 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)] px-6 py-3 backdrop-blur-md">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <label className="guide-label" htmlFor={searchId}>
            Search
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Country, place, or space body"
            className="mt-1.5 w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>
        <fieldset>
          <legend className="guide-label">Collection</legend>
          <div
            className="mt-1.5 flex flex-wrap gap-1.5"
            role="radiogroup"
            aria-label="Filter by collection"
          >
            {[
              { value: 'all', label: 'All' },
              ...filterKeys.map((name) => ({ value: name, label: name })),
            ].map((option) => {
              const selected = filter === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setFilter(option.value)}
                  className={
                    selected
                      ? 'rounded-[2px] border border-foreground bg-foreground px-2.5 py-1 text-xs text-background outline-none focus-visible:ring-1 focus-visible:ring-foreground'
                      : 'rounded-[2px] border border-[var(--border)] px-2.5 py-1 text-xs text-foreground outline-none hover:border-foreground/40 focus-visible:ring-1 focus-visible:ring-foreground'
                  }
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>
      <p className="mt-2 text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {visibleCount} {visibleCount === 1 ? 'photograph' : 'photographs'}
      </p>
    </div>
  )
}
