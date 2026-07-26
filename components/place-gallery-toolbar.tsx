'use client'

import { useEffect, useId, useRef, useState } from 'react'

export function PlaceGalleryToolbar({ totalCount }: { totalCount: number }) {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(totalCount)

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-place-gallery]')
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
    const empty = root.querySelector<HTMLElement>('[data-gallery-empty]')
    const normalizedQuery = query.trim().toLowerCase()
    let nextVisible = 0

    for (const item of items) {
      const searchText = item.dataset.searchText ?? ''
      const visible =
        !normalizedQuery || searchText.toLowerCase().includes(normalizedQuery)
      item.hidden = !visible
      if (visible) nextVisible += 1
    }

    if (empty) empty.hidden = nextVisible !== 0
    setVisibleCount(nextVisible)
  }, [query])

  return (
    <div
      ref={rootRef}
      className="gallery-toolbar sticky top-0 z-[2] -mx-6 mb-4 border-b border-[var(--border)] bg-background px-6 py-3"
    >
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Country, place, or space body"
        aria-label="Search photographs"
        className="w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
      />
      <p className="mt-2 text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {visibleCount} {visibleCount === 1 ? 'photograph' : 'photographs'}
      </p>
    </div>
  )
}
