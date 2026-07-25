'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { AtlasImage } from '~/components/atlas-image'
import type { GalleryItem } from '~/lib/gallery'

export function PlaceGallery({
  entries,
  filterKeys,
}: {
  entries: GalleryItem[]
  filterKeys: string[]
}) {
  const [filter, setFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => {
      if (filter !== 'all' && entry.filterKey !== filter) return false
      if (!q) return true
      return entry.searchText.toLowerCase().includes(q)
    })
  }, [entries, query, filter])

  return (
    <div className="place-gallery">
      <div className="gallery-toolbar enter sticky top-0 z-[2] -mx-6 mb-6 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)] px-6 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <label className="guide-label" htmlFor="gallery-search">
              Search
            </label>
            <input
              id="gallery-search"
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
          {filtered.length} {filtered.length === 1 ? 'photograph' : 'photographs'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photographs match that filter.</p>
      ) : (
        <ul className="photo-masonry">
          {filtered.map((entry) => (
            <li key={entry.id} className="photo-item">
              <Link
                href={entry.href}
                className="group block outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <AtlasImage
                  photo={entry.photo}
                  width={640}
                  alt={entry.photo.alt}
                  className="photo-frame w-full object-cover transition-[filter] duration-200 group-hover:brightness-[1.03]"
                  sizes="(max-width: 40rem) 50vw, 12.5rem"
                  loading="lazy"
                />
                <div className="mt-2 space-y-0.5 px-0.5">
                  <p className="text-sm font-medium text-foreground">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">{entry.subtitle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
