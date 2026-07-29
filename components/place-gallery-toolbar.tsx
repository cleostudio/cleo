'use client'

import { useEffect, useId, useRef, useState } from 'react'

function searchTokens(value: string): string[] {
  return (
    value
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}]+/gu) ?? []
  )
}

export function PlaceGalleryToolbar() {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-place-gallery]')
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
    const empty = root.querySelector<HTMLElement>('[data-gallery-empty]')
    const queryTokens = searchTokens(query)
    let nextVisible = 0

    for (const item of items) {
      const searchText = item.dataset.searchText ?? ''
      const itemTokens = searchTokens(searchText)
      const visible =
        queryTokens.length === 0 ||
        queryTokens.every((token) => itemTokens.includes(token))
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
