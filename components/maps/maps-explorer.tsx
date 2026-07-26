'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { EarthGlobeLazy } from '~/components/maps/earth-globe-lazy'
import { MapsSearch } from '~/components/maps/maps-search'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { mapsMarkers, type MapsMarker } from '~/lib/maps/markers'
import type { MapsPhotoPreview } from '~/lib/maps/previews'

function MapsExplorerInner({
  previews,
}: {
  previews: Record<string, MapsPhotoPreview>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const markers = useMemo(() => mapsMarkers(), [])
  const markersBySlug = useMemo(
    () => new Map(markers.map((marker) => [marker.slug, marker])),
    [markers],
  )

  const querySlug = searchParams.get('c')
  const [focusSlug, setFocusSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<MapsMarker | null>(null)
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

  const selectMarker = (marker: MapsMarker) => {
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
    <div className="maps-page">
      <header className="maps-header">
        <h1 className="page-eyebrow enter">Maps</h1>
        <p
          className="maps-lead enter"
          style={{ '--enter-delay': '70ms' } as React.CSSProperties}
        >
          {publicPageMetadata.maps.description}
        </p>
        <p
          className="maps-hint enter"
          style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        >
          Drag to orbit · Scroll to zoom · Search or click a point
        </p>
        <div
          className="enter"
          style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        >
          <MapsSearch markers={markers} onPick={selectMarker} />
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
        <div className="maps-selection" role="dialog" aria-label={selected.name}>
          {preview ? (
            <div className="maps-selection-photo">
              <Image
                src={preview.src}
                alt={preview.alt}
                width={640}
                height={400}
                className="maps-selection-image"
                sizes="22rem"
              />
              <p className="maps-selection-place">{preview.place}</p>
            </div>
          ) : null}
          <div className="maps-selection-copy">
            <p className="maps-selection-code">{selected.code}</p>
            <h2 className="maps-selection-name">{selected.name}</h2>
            <p className="maps-selection-meta">
              {selected.subregion} · {selected.region}
            </p>
          </div>
          <div className="maps-selection-actions">
            <Link href={`/explore/${selected.slug}`} className="maps-selection-link">
              Open field guide
            </Link>
            <button
              type="button"
              className="maps-selection-dismiss"
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

/** Client Maps shell — search, deep-links, selection chip, and the globe. */
export function MapsExplorer({
  previews,
}: {
  previews: Record<string, MapsPhotoPreview>
}) {
  return (
    <Suspense
      fallback={
        <div className="maps-page">
          <div className="maps-stage">
            <p className="maps-status" role="status">
              Loading Earth…
            </p>
          </div>
        </div>
      }
    >
      <MapsExplorerInner previews={previews} />
    </Suspense>
  )
}
