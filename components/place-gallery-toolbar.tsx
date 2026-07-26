'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function readGalleryParams(
  searchParams: URLSearchParams,
  filterKeys: readonly string[],
) {
  const filterParam = searchParams.get('filter')?.trim() ?? ''
  const filter =
    filterParam && filterKeys.includes(filterParam) ? filterParam : 'all'
  const query = searchParams.get('q')?.trim() ?? ''
  return { filter, query }
}

function galleryParamsString(filter: string, query: string) {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('filter', filter)
  const trimmedQuery = query.trim()
  if (trimmedQuery) params.set('q', trimmedQuery)
  return params.toString()
}

export function PlaceGalleryToolbar({
  filterKeys,
  totalCount,
}: {
  filterKeys: string[]
  totalCount: number
}) {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = readGalleryParams(searchParams, filterKeys)
  const [filter, setFilter] = useState(initial.filter)
  const [query, setQuery] = useState(initial.query)
  const [visibleCount, setVisibleCount] = useState(totalCount)
  const skipUrlWriteRef = useRef(true)

  useEffect(() => {
    const next = readGalleryParams(searchParams, filterKeys)
    setFilter((current) => (current === next.filter ? current : next.filter))
    setQuery((current) => (current === next.query ? current : next.query))
  }, [filterKeys, searchParams])

  useEffect(() => {
    if (skipUrlWriteRef.current) {
      skipUrlWriteRef.current = false
      return
    }

    const next = galleryParamsString(filter, query)
    const current = galleryParamsString(
      searchParams.get('filter')?.trim() &&
        filterKeys.includes(searchParams.get('filter')!.trim())
        ? searchParams.get('filter')!.trim()
        : 'all',
      searchParams.get('q')?.trim() ?? '',
    )
    if (next === current) return
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [filter, filterKeys, pathname, query, router, searchParams])

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-place-gallery]')
    if (!root) return

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
    <div
      ref={rootRef}
      className="gallery-toolbar sticky top-0 z-[2] -mx-6 mb-4 border-b border-[var(--border)] bg-background px-6 py-3"
    >
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
