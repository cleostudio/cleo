'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

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
  const [query, setQuery] = useState('')

  const matches = useMemo(() => filterSiteSearchHits(hits, query), [hits, query])

  return (
    <div className="home-site-search">
      <input
        id="home-site-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Country, planet, moon, topic, or essay"
        aria-label="Search the catalog"
        autoComplete="off"
        className={SEARCH_FIELD_CLASS}
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul className="mt-2 border border-[var(--border)]" role="listbox" aria-label="Search matches">
            {matches.map((hit) => (
              <li key={hit.id} className="hairline-top first:border-0">
                <SearchHitLink hit={hit} />
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

function SearchHitLink({ hit }: { hit: SiteSearchHit }) {
  return (
    <Link
      href={hit.href}
      role="option"
      className="flex items-baseline justify-between gap-3 px-3 py-2.5 text-sm outline-none hover:bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground"
    >
      <span className="min-w-0">
        <span className="font-medium text-foreground">{hit.title}</span>
        <span className="ml-2 text-xs text-muted-foreground">{KIND_LABEL[hit.kind]}</span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{hit.subtitle}</span>
    </Link>
  )
}
