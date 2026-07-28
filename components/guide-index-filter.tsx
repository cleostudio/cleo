'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

import { matchesIndexQuery } from '~/lib/index-filter'
import { replaceQueryParam } from '~/lib/url-query'

const SEARCH_FIELD_CLASS =
  'w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground'

/** Client filter for server-rendered Explore / Space / Writing index rows. */
export function GuideIndexFilter({
  label,
  placeholder,
  initialQuery = '',
  noun = 'results',
}: {
  label: string
  placeholder: string
  initialQuery?: string
  /** Plural noun used in the live “Showing N …” status line. */
  noun?: string
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
    let nextVisible = 0

    for (const item of items) {
      const visible = matchesIndexQuery(item.dataset.searchText ?? '', query)
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

    const status = root.querySelector<HTMLElement>('[data-guide-status]')
    const filtering = Boolean(query.trim())
    if (status) {
      status.hidden = !filtering || nextVisible === 0
      status.textContent =
        filtering && nextVisible > 0
          ? `Showing ${nextVisible} ${noun}`
          : ''
    }

    if (empty) empty.hidden = nextVisible !== 0
  }, [noun, query])

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Escape' || !query) return
    event.preventDefault()
    setQuery('')
  }

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
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        data-catalog-search
        className={SEARCH_FIELD_CLASS}
      />
    </div>
  )
}
