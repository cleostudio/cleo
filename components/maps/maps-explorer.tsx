'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import { EarthGlobeLazy } from '~/components/maps/earth-globe-lazy'
import { MapsSearch } from '~/components/maps/maps-search'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import {
  formatLatLon,
  mapsMarkers,
  type MapsMarker,
} from '~/lib/maps/markers'
import { mapsRegionNeighbors } from '~/lib/maps/neighbors'
import type { MapsCountryDossier } from '~/lib/maps/previews'
import {
  filterMapsMarkersByRegion,
  mapsRegions,
} from '~/lib/maps/regions'
import { formatUtcHourLabel, mapsSunAt } from '~/lib/maps/sun-clock'
import { resolveMapsUrlState } from '~/lib/maps/url-state'

function MapsExplorerInner({
  dossiers,
}: {
  dossiers: Record<string, MapsCountryDossier>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const markers = useMemo(() => mapsMarkers(), [])
  const regions = useMemo(() => mapsRegions(markers), [markers])
  const markersBySlug = useMemo(
    () => new Map(markers.map((marker) => [marker.slug, marker])),
    [markers],
  )

  const querySlug = searchParams.get('c')
  const queryRegion = searchParams.get('r')
  const [focusSlug, setFocusSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<MapsMarker | null>(null)
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  const [showGraticule, setShowGraticule] = useState(false)
  const [pickedCoords, setPickedCoords] = useState<string | null>(null)
  const [sunMode, setSunMode] = useState<'live' | 'scrub'>('live')
  const [sunHour, setSunHour] = useState(() => new Date().getUTCHours())
  const [liveNow, setLiveNow] = useState(() => new Date())
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  )
  const [resetSignal, setResetSignal] = useState(0)
  const regionChipRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const resolved = resolveMapsUrlState({
      c: querySlug,
      r: queryRegion,
      markersBySlug,
      regions,
    })

    setRegionFilter(resolved.region)
    if (resolved.marker) {
      setFocusSlug(resolved.marker.slug)
      setSelected(resolved.marker)
    } else {
      setFocusSlug(null)
      setSelected(null)
    }

    if (!resolved.dirty) return
    const params = new URLSearchParams(searchParams.toString())
    if (resolved.canonical.c) params.set('c', resolved.canonical.c)
    else params.delete('c')
    if (resolved.canonical.r) params.set('r', resolved.canonical.r)
    else params.delete('r')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [querySlug, queryRegion, markersBySlug, regions, pathname, router, searchParams])

  useEffect(() => {
    if (sunMode !== 'live') return
    const id = window.setInterval(() => setLiveNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [sunMode])

  const syncUrl = (slug: string | null, region: string | null = regionFilter) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('c', slug)
    else params.delete('c')
    if (region) params.set('r', region)
    else params.delete('r')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const selectMarker = (marker: MapsMarker) => {
    setFocusSlug(marker.slug)
    setSelected(marker)
    setPickedCoords(null)
    setCopyStatus('idle')
    syncUrl(marker.slug, regionFilter)
  }

  const dismissSelection = () => {
    setFocusSlug(null)
    setSelected(null)
    setPickedCoords(null)
    setCopyStatus('idle')
    syncUrl(null, regionFilter)
  }

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
      setCopyStatus('idle')
      const params = new URLSearchParams(searchParams.toString())
      if (!params.has('c')) return
      params.delete('c')
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pathname, router, searchParams])

  const applyRegion = (region: string | null) => {
    setRegionFilter(region)
    if (selected && region && selected.region !== region) {
      setFocusSlug(null)
      setSelected(null)
      setCopyStatus('idle')
      syncUrl(null, region)
      return
    }
    syncUrl(selected?.slug ?? null, region)
  }

  const resetView = () => {
    setResetSignal((value) => value + 1)
    dismissSelection()
  }

  const copyMapsLink = async () => {
    if (!selected || typeof window === 'undefined') return
    const url = new URL(`/maps?c=${selected.slug}`, window.location.origin)
    if (regionFilter) url.searchParams.set('r', regionFilter)
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 1600)
    } catch {
      setCopyStatus('failed')
      window.setTimeout(() => setCopyStatus('idle'), 2200)
    }
  }

  const onRegionChipKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const count = regions.length + 1
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + delta + count) % count
    regionChipRefs.current[next]?.focus()
  }

  const dossier = selected ? dossiers[selected.slug] : undefined
  const searchableMarkers = useMemo(
    () => filterMapsMarkersByRegion(markers, regionFilter),
    [markers, regionFilter],
  )
  const neighbors = selected
    ? mapsRegionNeighbors(selected, searchableMarkers, 4)
    : []
  const sunAt = mapsSunAt(sunMode, sunHour, liveNow)
  const regionOptions = [null, ...regions] as const

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
          <MapsSearch markers={searchableMarkers} onPick={selectMarker} />
        </div>
        <div
          className="maps-region-filters enter"
          style={{ '--enter-delay': '180ms' } as React.CSSProperties}
          role="toolbar"
          aria-label="Filter by region"
        >
          {regionOptions.map((region, index) => (
            <button
              key={region ?? 'all'}
              type="button"
              ref={(element) => {
                regionChipRefs.current[index] = element
              }}
              className="maps-region-chip"
              aria-pressed={regionFilter === region}
              onClick={() => applyRegion(region)}
              onKeyDown={(event) => onRegionChipKeyDown(event, index)}
            >
              {region ?? 'All'}
            </button>
          ))}
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
          <button
            type="button"
            className="maps-toolbar-button"
            aria-pressed={sunMode === 'live'}
            onClick={() => {
              setSunMode('live')
              setLiveNow(new Date())
              setSunHour(new Date().getUTCHours())
            }}
          >
            Live sun
          </button>
          <button
            type="button"
            className="maps-toolbar-button"
            onClick={resetView}
          >
            Reset view
          </button>
          {pickedCoords ? (
            <span className="maps-toolbar-meta" aria-live="polite">
              Sample · {pickedCoords}
            </span>
          ) : null}
        </div>
        <div
          className="maps-sun-scrub enter"
          style={{ '--enter-delay': '220ms' } as React.CSSProperties}
        >
          <label className="maps-sun-scrub-label" htmlFor="maps-sun-hour">
            Sun · {sunMode === 'live' ? 'live UTC' : formatUtcHourLabel(sunHour)}
          </label>
          <input
            id="maps-sun-hour"
            className="maps-sun-scrub-input"
            type="range"
            min={0}
            max={23}
            step={1}
            value={sunMode === 'live' ? liveNow.getUTCHours() : sunHour}
            aria-valuetext={
              sunMode === 'live'
                ? `Live sun at ${formatUtcHourLabel(liveNow.getUTCHours())}`
                : formatUtcHourLabel(sunHour)
            }
            onChange={(event) => {
              setSunMode('scrub')
              setSunHour(Number(event.target.value))
            }}
          />
        </div>
      </header>

      <EarthGlobeLazy
        focusSlug={focusSlug}
        showGraticule={showGraticule}
        sunAt={sunAt}
        regionFilter={regionFilter}
        resetSignal={resetSignal}
        onPickCoords={(coords) => {
          if (!coords) {
            setPickedCoords(null)
            return
          }
          setPickedCoords(formatLatLon(coords.lat, coords.lon))
        }}
        onSelect={(marker) => {
          if (!marker) {
            dismissSelection()
            return
          }
          selectMarker(marker)
        }}
      />

      {selected ? (
        <div
          className="maps-selection"
          role="region"
          aria-labelledby="maps-selection-name"
        >
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
            <h2 id="maps-selection-name" className="maps-selection-name">
              {selected.name}
            </h2>
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
            {neighbors.length > 0 ? (
              <div className="maps-selection-neighbors">
                <p className="maps-selection-neighbors-label">
                  {neighbors.every(
                    (neighbor) => neighbor.subregion === selected.subregion,
                  )
                    ? `More in ${selected.subregion}`
                    : `More in ${selected.region}`}
                </p>
                <ul className="maps-selection-neighbors-list">
                  {neighbors.map((neighbor) => (
                    <li key={neighbor.slug}>
                      <button
                        type="button"
                        className="maps-selection-neighbor"
                        onClick={() => selectMarker(neighbor)}
                      >
                        {neighbor.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="maps-selection-actions">
            <Link href={`/explore/${selected.slug}`} className="maps-selection-link">
              Open field guide
            </Link>
            <Link
              href={`/gallery?q=${encodeURIComponent(selected.name)}`}
              className="maps-selection-dismiss"
            >
              Gallery
            </Link>
            <button
              type="button"
              className="maps-selection-dismiss"
              onClick={() => void copyMapsLink()}
            >
              {copyStatus === 'copied'
                ? 'Copied'
                : copyStatus === 'failed'
                  ? 'Copy failed'
                  : 'Copy link'}
            </button>
            <button
              type="button"
              className="maps-selection-dismiss"
              onClick={dismissSelection}
            >
              Dismiss
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {copyStatus === 'copied'
              ? 'Maps link copied to clipboard'
              : copyStatus === 'failed'
                ? 'Could not copy Maps link'
                : ''}
          </p>
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
