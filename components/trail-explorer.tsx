'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '~/components/ui/button'
import { CheckboxGroup, CheckboxItem } from '~/components/ui/checkbox-group'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { RadioGroup, RadioItem } from '~/components/ui/radio-group'
import { Switch } from '~/components/ui/switch'
import { TabItem, Tabs, TabsList } from '~/components/ui/tabs'
import {
  TRAIL_COLLECTIONS,
  TRAIL_PROGRESS_STORAGE_KEY,
  type Trail,
  type TrailCollectionFilter,
  getTrail,
  isTrailSlug,
  parseTrailProgress,
  serializeTrailProgress,
  trailsForCollection,
  type TrailProgressMap,
} from '~/lib/trails'
import { cn } from '~/lib/utils'

function readStoredProgress(): TrailProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    return parseTrailProgress(
      window.sessionStorage.getItem(TRAIL_PROGRESS_STORAGE_KEY),
    )
  } catch {
    return {}
  }
}

function writeStoredProgress(map: TrailProgressMap) {
  try {
    window.sessionStorage.setItem(
      TRAIL_PROGRESS_STORAGE_KEY,
      serializeTrailProgress(map),
    )
  } catch {
    // Private mode / quota — keep in-memory progress only.
  }
}

function initialTrailSlug(preferred?: string | null): string {
  if (preferred && isTrailSlug(preferred)) return preferred
  return trailsForCollection('all')[0]?.slug ?? 'pacific-ring'
}

export function TrailExplorer({
  initialTrail,
}: {
  initialTrail?: string | null
}) {
  const [collection, setCollection] = useState<TrailCollectionFilter>('all')
  const [trailSlug, setTrailSlug] = useState(() =>
    initialTrailSlug(initialTrail),
  )
  const [progress, setProgress] = useState<TrailProgressMap>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [hideCompleted, setHideCompleted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const availableTrails = useMemo(
    () => trailsForCollection(collection),
    [collection],
  )

  const trail: Trail | undefined = useMemo(() => {
    const selected = getTrail(trailSlug)
    if (selected && availableTrails.some((item) => item.slug === selected.slug)) {
      return selected
    }
    return availableTrails[0]
  }, [trailSlug, availableTrails])

  const doneHrefs = useMemo(() => {
    if (!trail) return new Set<string>()
    return new Set(progress[trail.slug] ?? [])
  }, [progress, trail])

  useEffect(() => {
    setProgress(readStoredProgress())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeStoredProgress(progress)
  }, [progress, hydrated])

  useEffect(() => {
    if (!trail) return
    if (trail.slug !== trailSlug) {
      setTrailSlug(trail.slug)
      setActiveIndex(0)
    }
  }, [trail, trailSlug])

  useEffect(() => {
    if (!trail) return
    setActiveIndex((current) =>
      Math.min(Math.max(current, 0), Math.max(trail.stops.length - 1, 0)),
    )
  }, [trail])

  if (!trail) {
    return (
      <p className="mt-10 text-sm text-muted-foreground">
        No trails are available yet.
      </p>
    )
  }

  const activeTrail = trail
  const stop = activeTrail.stops[activeIndex] ?? activeTrail.stops[0]
  const doneCount = activeTrail.stops.filter((item) =>
    doneHrefs.has(item.href),
  ).length
  const progressPct =
    activeTrail.stops.length === 0
      ? 0
      : (doneCount / activeTrail.stops.length) * 100
  const isCurrentDone = doneHrefs.has(stop.href)
  const checkedIndices = new Set(
    activeTrail.stops.flatMap((item, index) =>
      doneHrefs.has(item.href) ? [index] : [],
    ),
  )
  const visibleStops = activeTrail.stops
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !hideCompleted || !doneHrefs.has(item.href))

  function selectTrail(slug: string) {
    setTrailSlug(slug)
    setActiveIndex(0)
  }

  function toggleStop(href: string) {
    const slug = activeTrail.slug
    setProgress((current) => {
      const existing = new Set(current[slug] ?? [])
      if (existing.has(href)) existing.delete(href)
      else existing.add(href)
      const next = { ...current }
      if (existing.size === 0) delete next[slug]
      else next[slug] = [...existing]
      return next
    })
  }

  function markCurrentDone() {
    if (!isCurrentDone) toggleStop(stop.href)
    if (activeIndex < activeTrail.stops.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  function resetTrailProgress() {
    const slug = activeTrail.slug
    setProgress((current) => {
      const next = { ...current }
      delete next[slug]
      return next
    })
    setActiveIndex(0)
  }

  return (
    <div className="mt-10 flex flex-col gap-10">
      <section aria-labelledby="trail-collection-label">
        <div className="flex flex-col gap-4">
          <h2
            id="trail-collection-label"
            className="text-sm font-medium text-muted-foreground"
          >
            Collections
          </h2>
          <Tabs
            value={collection}
            onValueChange={(value) =>
              setCollection(value as TrailCollectionFilter)
            }
          >
            <TabsList variant="subtle" aria-label="Trail collections">
              {TRAIL_COLLECTIONS.map((item) => (
                <TabItem key={item.id} value={item.id} label={item.label} />
              ))}
            </TabsList>
          </Tabs>
        </div>

        <RadioGroup
          value={activeTrail.slug}
          onValueChange={selectTrail}
          aria-label="Trails"
          className="mt-5 flex flex-col gap-1"
        >
          {availableTrails.map((entry, index) => (
            <RadioItem
              key={entry.slug}
              index={index}
              value={entry.slug}
              label={entry.name}
            />
          ))}
        </RadioGroup>
      </section>

      <section
        aria-labelledby="trail-active-label"
        className="hairline-top pt-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <header className="max-w-content-narrow">
            <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Active trail
            </p>
            <h2
              id="trail-active-label"
              className="mt-1 text-[15px] font-medium text-foreground"
            >
              {activeTrail.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {activeTrail.summary}
            </p>
          </header>
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <Switch
              label="Hide completed"
              checked={hideCompleted}
              onCheckedChange={setHideCompleted}
            />
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="tertiary" size="sm">
                    Reset
                  </Button>
                }
              />
              <DialogContent size="sm">
                <DialogHeader>
                  <DialogTitle>Reset trail progress?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Clear checked stops for {activeTrail.name}. This only affects
                  this browser tab.
                </DialogDescription>
                <DialogBody>
                  <p className="text-sm text-muted-foreground">
                    Field guides stay unchanged — only your checklist marks are
                    removed.
                  </p>
                </DialogBody>
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose variant="primary" onClick={resetTrailProgress}>
                    Reset progress
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div
          className="mt-6"
          role="group"
          aria-label={`Progress: ${doneCount} of ${activeTrail.stops.length} stops`}
        >
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {doneCount} of {activeTrail.stops.length} stops
            </span>
            <span className="tabular-nums text-muted-foreground">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-200 ease-[var(--ease-swift)] motion-reduce:transition-none"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <article
          className="mt-6 rounded-[2px] border border-border px-5 py-5"
          aria-live="polite"
        >
          <p className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
            Stop {activeIndex + 1} of {activeTrail.stops.length}
          </p>
          <h3 className="mt-2 text-[15px] font-medium text-foreground">
            {stop.label}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {stop.note}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            >
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={markCurrentDone}>
              {activeIndex === activeTrail.stops.length - 1
                ? isCurrentDone
                  ? 'Done'
                  : 'Mark done'
                : isCurrentDone
                  ? 'Continue'
                  : 'Mark & continue'}
            </Button>
            <Button variant="tertiary" size="sm" asChild>
              <Link href={stop.href}>Open guide</Link>
            </Button>
          </div>
        </article>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-foreground">Checklist</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Mark stops as you visit their field guides. Progress stays in this
            tab.
          </p>
          {visibleStops.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Every stop is marked complete. Turn off Hide completed to review
              them.
            </p>
          ) : (
            <CheckboxGroup
              checkedIndices={checkedIndices}
              className="mt-4"
              aria-label={`${activeTrail.name} checklist`}
            >
              {visibleStops.map(({ item, index }) => (
                <CheckboxItem
                  key={`${activeTrail.slug}:${item.href}`}
                  index={index}
                  label={`${String(index + 1).padStart(2, '0')} ${item.label}`}
                  checked={doneHrefs.has(item.href)}
                  onToggle={() => {
                    toggleStop(item.href)
                    setActiveIndex(index)
                  }}
                  className={cn(
                    index === activeIndex &&
                      'ring-1 ring-[color:var(--focus-ring)]',
                  )}
                />
              ))}
            </CheckboxGroup>
          )}
        </div>
      </section>
    </div>
  )
}
