'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import {
  compareHref,
  formatCompareRef,
  type CompareCollection,
} from '~/lib/compare'

type Option = {
  collection: CompareCollection
  slug: string
  name: string
  code: string
}

export function ComparePicker({
  countries,
  planets,
  initialA,
  initialB,
}: {
  countries: Option[]
  planets: Option[]
  initialA?: string
  initialB?: string
}) {
  const router = useRouter()
  const [collection, setCollection] = useState<CompareCollection>(() => {
    if (initialA?.startsWith('space:') || initialB?.startsWith('space:')) {
      return 'space'
    }
    return 'explore'
  })
  const [a, setA] = useState(() => initialA?.split(':')[1] ?? '')
  const [b, setB] = useState(() => initialB?.split(':')[1] ?? '')

  const options = collection === 'explore' ? countries : planets

  const canSubmit = useMemo(() => {
    return Boolean(a && b && a !== b)
  }, [a, b])

  function onCollectionChange(next: CompareCollection) {
    setCollection(next)
    setA('')
    setB('')
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    router.push(
      compareHref(
        { collection, slug: a },
        { collection, slug: b },
      ),
    )
  }

  return (
    <form className="compare-picker mt-6" onSubmit={onSubmit}>
      <fieldset className="flex flex-wrap gap-3 text-sm">
        <legend className="guide-label mb-2 w-full">Pair kind</legend>
        {(
          [
            ['explore', 'Countries'],
            ['space', 'Planets'],
          ] as const
        ).map(([value, label]) => (
          <label
            key={value}
            className="inline-flex cursor-pointer items-center gap-2 text-foreground"
          >
            <input
              type="radio"
              name="compare-kind"
              value={value}
              checked={collection === value}
              onChange={() => onCollectionChange(value)}
              className="accent-[var(--foreground)]"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="guide-label">Subject A</span>
          <select
            value={a}
            onChange={(event) => setA(event.target.value)}
            className="mt-1.5 w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <option value="">Select…</option>
            {options.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name} ({option.code})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="guide-label">Subject B</span>
          <select
            value={b}
            onChange={(event) => setB(event.target.value)}
            className="mt-1.5 w-full rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-base text-foreground outline-none focus-visible:ring-1 focus-visible:ring-foreground"
          >
            <option value="">Select…</option>
            {options.map((option) => (
              <option key={option.slug} value={option.slug} disabled={option.slug === a}>
                {option.name} ({option.code})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-[2px] border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors duration-150 ease-[ease] hover:bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] focus-visible:ring-1 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare
        </button>
        {canSubmit ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatCompareRef({ collection, slug: a })} ·{' '}
            {formatCompareRef({ collection, slug: b })}
          </span>
        ) : null}
      </div>
    </form>
  )
}
