'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { EarthGlobeLazy } from '~/components/maps/earth-globe-lazy'
import { MapsSearch } from '~/components/maps/maps-search'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import {
  formatLatLon,
  mapsMarkers,
  type MapsMarker,
} from '~/lib/maps/markers'
import type { MapsCountryDossier } from '~/lib/maps/previews'

function MapsExplorerInner({
  dossiers,
}: {
  dossiers: Record<string, MapsCountryDossier>
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
  const [showGraticule, setShowGraticule] = useState(false)
  const [pickedCoords, setPickedCoords] = useState<string | null>(null)
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      setFocusSlug(null)
      setSelected(null)
      setPickedCoords(null)
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('c')) return
      params.delete('c')
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pathname, router, searchParams])

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
    setPickedCoords(null)
    syncUrl(marker.slug)
  }

  const clearCountry = () => {
    setFocusSlug(null)
    setSelected(null)
    syncUrl(null)
  }

  const dismiss = () => {
    clearCountry()
    setPickedCoords(null)
  }

  const dossier = selected ? dossiers[selected.slug] : undefined

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
          Drag to orbit · Scroll to zoom · Click land or sea for coordinates
        </p>
        <div
          className="enter"
          style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        >
          <MapsSearch markers={markers} onPick={selectMarker} />
        </div>
        <div
          className="maps-toolbar enter"
          style={{ '--enter-delay': '200ms' } as React.CSSProperties}
        >
          <button
            type="button"
            className="maps-toolbar-button"
            aria-pressed={showGraticule}
            onClick={() => setShowGraticule((value) => !value)}
          >
            {showGraticule ? 'Hide graticule' : 'Show graticule'}
          </button>
          {pickedCoords ? (
            <span className="maps-toolbar-meta" aria-live="polite">
              Sample · {pickedCoords}
            </span>
          ) : null}
        </div>
      </header>

      <EarthGlobeLazy
        focusSlug={focusSlug}
        showGraticule={showGraticule}
        onPickCoords={(coords) => {
          if (!coords) {
            setPickedCoords(null)
            return
          }
          setPickedCoords(formatLatLon(coords.lat, coords.lon))
        }}
        onSelect={(marker) => {
          if (!marker) {
            clearCountry()
            return
          }
          selectMarker(marker)
        }}
      />

      {selected ? (
        <div className="maps-selection" role="dialog" aria-label={selected.name}>
          {dossier ? (
            <div className="maps-selection-photo">
              <Image
                src={dossier.src}
                alt={dossier.alt}
                width={640}
                height={400}
                className="maps-selection-image"
                sizes="22rem"
              />
              <p className="maps-selection-place">{dossier.place}</p>
            </div>
          ) : null}
          <div className="maps-selection-copy">
            <p className="maps-selection-code">{selected.code}</p>
            <h2 className="maps-selection-name">{selected.name}</h2>
            <p className="maps-selection-meta">
              {selected.subregion} · {selected.region}
            </p>
            {dossier ? (
              <>
                <p className="maps-selection-coords">{dossier.coordsLabel}</p>
                <p className="maps-selection-about">{dossier.about}</p>
                <p className="maps-selection-facts">
                  Capital · {dossier.capital}
                </p>
                <ul className="maps-selection-places">
                  {dossier.places.map((place) => (
                    <li key={place}>{place}</li>
                  ))}
                </ul>
              </>
            ) : null}
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
  dossiers,
}: {
  dossiers: Record<string, MapsCountryDossier>
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
      <MapsExplorerInner dossiers={dossiers} />
    </Suspense>
  )
}
