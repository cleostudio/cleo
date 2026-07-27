'use client'

import { useEffect, useId, useRef, useState } from 'react'

function readWritingQueryFromUrl() {
  if (typeof window === 'undefined') return ''
  try {
    return new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
  } catch {
    return ''
  }
}

function writeWritingQueryToUrl(query: string) {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    const trimmed = query.trim()
    if (trimmed) {
      url.searchParams.set('q', trimmed)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    )
  } catch {
    // History API unavailable — ignore.
  }
}

/** Client-side Writing index filter, synced with `?q=` for Cleo deep-links. */
export function WritingIndexToolbar() {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setQuery(readWritingQueryFromUrl())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeWritingQueryToUrl(query)
  }, [hydrated, query])

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-writing-index]')
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-writing-item]')
    const empty = root.querySelector<HTMLElement>('[data-writing-empty]')
    const sections = root.querySelectorAll<HTMLElement>('[data-writing-year]')
    const normalizedQuery = query.trim().toLowerCase()
    let nextVisible = 0

    for (const item of items) {
      const searchText = item.dataset.searchText ?? ''
      const visible =
        !normalizedQuery || searchText.toLowerCase().includes(normalizedQuery)
      item.hidden = !visible
      if (visible) nextVisible += 1
    }

    for (const section of sections) {
      const visibleInYear = section.querySelectorAll(
        '[data-writing-item]:not([hidden])',
      ).length
      section.hidden = visibleInYear === 0
    }

    if (empty) empty.hidden = nextVisible !== 0
  }, [query])

  return (
    <div
      ref={rootRef}
      className="writing-toolbar sticky top-0 z-[2] -mx-6 mb-4 bg-background px-6 py-3"
    >
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Title or topic"
        aria-label="Search Writing essays"
        className="w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none"
      />
    </div>
  )
}
