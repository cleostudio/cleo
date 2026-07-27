'use client'

import { useEffect, useId, useRef, useState } from 'react'

function readGalleryQueryFromUrl() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
}

export function PlaceGalleryToolbar() {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setQuery(readGalleryQueryFromUrl())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const url = new URL(window.location.href)
    const trimmed = query.trim()
    if (trimmed) url.searchParams.set('q', trimmed)
    else url.searchParams.delete('q')
    const next = `${url.pathname}${url.search}${url.hash}`
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [query, hydrated])

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
  }, [query])

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
        className="w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none"
      />
    </div>
  )
}
