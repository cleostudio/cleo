'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { replaceQueryParam } from '~/lib/url-query'

const SEARCH_FIELD_CLASS =
  'w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground'

/** Client filter for server-rendered Explore / Space / Writing index rows. */
export function GuideIndexFilter({
  label,
  placeholder,
  initialQuery = '',
}: {
  label: string
  placeholder: string
  initialQuery?: string
}) {
  const searchId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    replaceQueryParam('q', query)
  }, [query])

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('[data-guide-index]')
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-guide-item]')
    const empty = root.querySelector<HTMLElement>('[data-guide-empty]')
    const sections = root.querySelectorAll<HTMLElement>('[data-guide-section]')
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
      const visibleInSection = section.querySelectorAll(
        '[data-guide-item]:not([hidden])',
      ).length
      section.hidden = visibleInSection === 0
      const count = section.querySelector<HTMLElement>('[data-guide-count]')
      if (count) count.textContent = String(visibleInSection)
    }

    if (empty) empty.hidden = nextVisible !== 0
  }, [query])

  return (
    <div
      ref={rootRef}
      className="sticky top-0 z-[2] -mx-6 mb-6 bg-background px-6 py-3"
    >
      <input
        id={searchId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        data-catalog-search
        className={SEARCH_FIELD_CLASS}
      />
    </div>
  )
}
