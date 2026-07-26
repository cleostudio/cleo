'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

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

function parseRegion(value: string | null): WorldRegion | null {
  if (!value) return null
  return (WORLD_REGIONS as readonly string[]).includes(value)
    ? (value as WorldRegion)
    : null
}

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
  const focusSlug =
    querySlug && markersBySlug.has(querySlug) ? querySlug : null
  const selected = focusSlug ? (markersBySlug.get(focusSlug) ?? null) : null
  const region = focusSlug ? null : parseRegion(searchParams.get('r'))
  const lookAt = useMemo(
    () => (region ? regionLookAt(region) : null),
    [region],
  )

  const [copied, setCopied] = useState(false)

  const syncUrl = (slug: string | null, nextRegion: WorldRegion | null) => {
    const currentSlug = searchParams.get('c')
    const currentRegion = searchParams.get('r')
    if (slug) {
      if (currentSlug === slug) return
    } else if (nextRegion) {
      if (!currentSlug && currentRegion === nextRegion) return
    } else if (!currentSlug && !currentRegion) {
      return
    }

    const params = new URLSearchParams()
    if (slug) params.set('c', slug)
    else if (nextRegion) params.set('r', nextRegion)
    const query = params.toString()
    // Push so Back/Forward restore country and region deep-links.
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const selectMarker = (marker: WorldMarker) => {
    syncUrl(marker.slug, null)
  }

  const selectRegion = (next: WorldRegion | null) => {
    syncUrl(null, next)
  }

  const dismiss = () => {
    syncUrl(null, null)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !searchParams.get('c')) return
      event.preventDefault()
      router.push(pathname, { scroll: false })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchParams, pathname, router])

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
            {preview?.teaser ? (
              <p className="world-selection-teaser">{preview.teaser}</p>
            ) : null}
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
