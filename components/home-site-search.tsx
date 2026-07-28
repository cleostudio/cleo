'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  filterSiteSearchHits,
  type SiteSearchHit,
  type SiteSearchKind,
} from '~/lib/site-search'

const KIND_LABEL: Record<SiteSearchKind, string> = {
  explore: 'Country',
  space: 'Space',
  topic: 'Topic',
  surface: 'Portal',
  writing: 'Writing',
}

const SEARCH_FIELD_CLASS =
  'w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2.5 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground'

export function HomeSiteSearch({ hits }: { hits: SiteSearchHit[] }) {
  const router = useRouter()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const matches = useMemo(() => filterSiteSearchHits(hits, query), [hits, query])
  const expanded = Boolean(query.trim())
  const activeHit = activeIndex >= 0 ? matches[activeIndex] : undefined

  useEffect(() => {
    setActiveIndex(matches.length > 0 ? 0 : -1)
  }, [matches])

  useEffect(() => {
    function focusSearch() {
      inputRef.current?.focus()
    }

    function focusFromHash() {
      if (window.location.hash === '#home-site-search') {
        focusSearch()
      }
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href="#home-site-search"]')
      if (!anchor) return
      // Hash may already be set; still complete the “open the catalog” action.
      requestAnimationFrame(focusSearch)
    }

    focusFromHash()
    window.addEventListener('hashchange', focusFromHash)
    document.addEventListener('click', onDocumentClick)
    return () => {
      window.removeEventListener('hashchange', focusFromHash)
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      if (!query) return
      event.preventDefault()
      setQuery('')
      setActiveIndex(-1)
      return
    }

    if (!expanded || matches.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) =>
        current < matches.length - 1 ? current + 1 : 0,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) =>
        current > 0 ? current - 1 : matches.length - 1,
      )
      return
    }

    if (event.key === 'Enter' && activeHit) {
      event.preventDefault()
      router.push(activeHit.href)
    }
  }

  return (
    <div className="home-site-search">
      <input
        ref={inputRef}
        id="home-site-search"
        type="search"
        role="combobox"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Country, planet, moon, topic, or essay"
        aria-label="Search the catalog"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listboxId}
        aria-activedescendant={
          activeHit ? `${listboxId}-option-${activeHit.id}` : undefined
        }
        autoComplete="off"
        className={SEARCH_FIELD_CLASS}
      />
      {expanded ? (
        matches.length > 0 ? (
          <ul
            id={listboxId}
            className="mt-2 border border-[var(--border)]"
            role="listbox"
            aria-label="Search matches"
          >
            {matches.map((hit, index) => (
              <li key={hit.id} className="hairline-top first:border-0">
                <SearchHitLink
                  hit={hit}
                  id={`${listboxId}-option-${hit.id}`}
                  active={index === activeIndex}
                  onPointerEnter={() => setActiveIndex(index)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
            No guides match “{query.trim()}”.
          </p>
        )
      ) : null}
    </div>
  )
}

function SearchHitLink({
  hit,
  id,
  active,
  onPointerEnter,
}: {
  hit: SiteSearchHit
  id: string
  active: boolean
  onPointerEnter: () => void
}) {
  return (
    <Link
      id={id}
      href={hit.href}
      role="option"
      aria-selected={active}
      onPointerEnter={onPointerEnter}
      className={
        active
          ? 'flex items-baseline justify-between gap-3 bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground'
          : 'flex items-baseline justify-between gap-3 px-3 py-2.5 text-sm outline-none hover:bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground'
      }
    >
      <span className="min-w-0">
        <span className="font-medium text-foreground">{hit.title}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {KIND_LABEL[hit.kind]}
        </span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {hit.subtitle}
      </span>
    </Link>
  )
}
