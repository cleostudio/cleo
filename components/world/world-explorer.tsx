'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { EarthGlobeLazy } from '~/components/world/earth-globe-lazy'
import { WorldSearch } from '~/components/world/world-search'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { worldMarkers, type WorldMarker } from '~/lib/world/markers'
import type { WorldPhotoPreview } from '~/lib/world/previews'
import {
  regionLookAt,
  WORLD_REGIONS,
  type WorldRegion,
} from '~/lib/world/regions'

function WorldExplorerInner({
  previews,
}: {
  previews: Record<string, WorldPhotoPreview>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const markers = useMemo(() => worldMarkers(), [])
  const markersBySlug = useMemo(
    () => new Map(markers.map((marker) => [marker.slug, marker])),
    [markers],
  )

  const querySlug = searchParams.get('c')
  const queryRegion = searchParams.get('r')
  const initialRegion =
    queryRegion && (WORLD_REGIONS as readonly string[]).includes(queryRegion)
      ? (queryRegion as WorldRegion)
      : null

  const [focusSlug, setFocusSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<WorldMarker | null>(null)
  const [region, setRegion] = useState<WorldRegion | null>(initialRegion)
  const [lookAt, setLookAt] = useState<{ lat: number; lon: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (querySlug) {
      const marker = markersBySlug.get(querySlug)
      if (marker) {
        setFocusSlug(marker.slug)
        setSelected(marker)
        setRegion(null)
        setLookAt(null)
        return
      }
    }
    if (initialRegion) {
      const point = regionLookAt(initialRegion)
      if (point) setLookAt(point)
    }
  }, [querySlug, markersBySlug, initialRegion])

  const syncUrl = (slug: string | null, nextRegion: WorldRegion | null) => {
    const params = new URLSearchParams()
    if (slug) params.set('c', slug)
    else if (nextRegion) params.set('r', nextRegion)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const selectMarker = (marker: WorldMarker) => {
    setFocusSlug(marker.slug)
    setSelected(marker)
    setRegion(null)
    setLookAt(null)
    syncUrl(marker.slug, null)
  }

  const selectRegion = (next: WorldRegion | null) => {
    setRegion(next)
    setFocusSlug(null)
    setSelected(null)
    if (!next) {
      setLookAt(null)
      syncUrl(null, null)
      return
    }
    const point = regionLookAt(next)
    setLookAt(point)
    syncUrl(null, next)
  }

  const dismiss = () => {
    setFocusSlug(null)
    setSelected(null)
    setLookAt(null)
    syncUrl(null, region)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !selected) return
      event.preventDefault()
      setFocusSlug(null)
      setSelected(null)
      setLookAt(null)
      syncUrl(null, region)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, region, pathname, router])

  const copyLink = async () => {
    if (!selected || typeof window === 'undefined') return
    const url = new URL(`/world?c=${selected.slug}`, window.location.origin)
    try {
      await navigator.clipboard.writeText(url.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const preview = selected ? previews[selected.slug] : undefined

  return (
    <div className="world-page">
      <header className="world-header">
        <h1 className="page-eyebrow enter">World</h1>
        <p
          className="world-lead enter"
          style={{ '--enter-delay': '70ms' } as React.CSSProperties}
        >
          {publicPageMetadata.world.description}
        </p>
        <p
          className="world-hint enter"
          style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        >
          Drag to orbit · Scroll to zoom · Search or click a point
        </p>
        <div
          className="world-regions enter"
          style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          role="group"
          aria-label="Frame a region"
        >
          <button
            type="button"
            className="world-region-chip"
            data-active={region === null || undefined}
            onClick={() => selectRegion(null)}
          >
            All
          </button>
          {WORLD_REGIONS.map((name) => (
            <button
              key={name}
              type="button"
              className="world-region-chip"
              data-active={region === name || undefined}
              onClick={() => selectRegion(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div
          className="enter"
          style={{ '--enter-delay': '170ms' } as React.CSSProperties}
        >
          <WorldSearch
            markers={markers}
            region={region}
            onPick={selectMarker}
          />
        </div>
      </header>

      <EarthGlobeLazy
        focusSlug={focusSlug}
        lookAt={focusSlug ? null : lookAt}
        onSelect={(marker) => {
          if (!marker) {
            dismiss()
            return
          }
          selectMarker(marker)
        }}
      />

      {selected ? (
        <div className="world-selection" role="dialog" aria-label={selected.name}>
          {preview ? (
            <div className="world-selection-photo">
              <Image
                src={preview.src}
                alt={preview.alt}
                width={640}
                height={400}
                className="world-selection-image"
                sizes="22rem"
              />
              <p className="world-selection-place">{preview.place}</p>
            </div>
          ) : null}
          <div className="world-selection-copy">
            <p className="world-selection-code">{selected.code}</p>
            <h2 className="world-selection-name">{selected.name}</h2>
            <p className="world-selection-meta">
              {selected.subregion} · {selected.region}
            </p>
          </div>
          <div className="world-selection-actions">
            <Link href={`/explore/${selected.slug}`} className="world-selection-link">
              Open field guide
            </Link>
            <button
              type="button"
              className="world-selection-dismiss"
              onClick={() => void copyLink()}
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <button
              type="button"
              className="world-selection-dismiss"
              onClick={dismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** Client World shell — search, deep-links, selection chip, and the globe. */
export function WorldExplorer({
  previews,
}: {
  previews: Record<string, WorldPhotoPreview>
}) {
  return (
    <Suspense
      fallback={
        <div className="world-page">
          <div className="world-stage">
            <p className="world-status" role="status">
              Loading Earth…
            </p>
          </div>
        </div>
      }
    >
      <WorldExplorerInner previews={previews} />
    </Suspense>
  )
}
