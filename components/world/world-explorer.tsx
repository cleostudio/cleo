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
  const [focusSlug, setFocusSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<WorldMarker | null>(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (!querySlug) return
    const marker = markersBySlug.get(querySlug)
    if (!marker) return
    setFocusSlug(marker.slug)
    setSelected(marker)
  }, [querySlug, markersBySlug])

  const syncUrl = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('c', slug)
    else params.delete('c')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const selectMarker = (marker: WorldMarker) => {
    setFocusSlug(marker.slug)
    setSelected(marker)
    syncUrl(marker.slug)
  }

  const dismiss = () => {
    setFocusSlug(null)
    setSelected(null)
    syncUrl(null)
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
          className="enter"
          style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        >
          <WorldSearch markers={markers} onPick={selectMarker} />
        </div>
      </header>

      <EarthGlobeLazy
        focusSlug={focusSlug}
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
