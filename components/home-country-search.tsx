'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { Country } from '~/lib/countries'

export function HomeCountrySearch({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return countries
      .filter(
        (country) =>
          country.name.toLowerCase().includes(q) ||
          country.code.toLowerCase().includes(q) ||
          country.region.toLowerCase().includes(q) ||
          country.subregion.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [countries, query])

  return (
    <div className="home-country-search">
      <label className="guide-label" htmlFor="home-country-search">
        Find a country
      </label>
      <input
        id="home-country-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Name, code, or region"
        autoComplete="off"
        className="mt-1.5 w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2.5 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
      />
      {query.trim() ? (
        matches.length > 0 ? (
          <ul className="mt-2 border border-[var(--border)]" role="listbox" aria-label="Country matches">
            {matches.map((country) => (
              <li key={country.slug} className="hairline-top first:border-0">
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Link
                    href={`/explore/${country.slug}`}
                    role="option"
                    className="flex min-w-0 flex-1 items-baseline justify-between gap-3 text-sm outline-none hover:text-foreground focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-foreground"
                  >
                    <span className="font-medium text-foreground">{country.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {country.code} · {country.region}
                    </span>
                  </Link>
                  <Link
                    href={`/world?c=${country.slug}`}
                    className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2"
                    aria-label={`View ${country.name} on World`}
                  >
                    World
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
            No countries match “{query.trim()}”.
          </p>
        )
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          {countries.length} field guides — type to jump straight in, or open World.
        </p>
      )}
    </div>
  )
}
