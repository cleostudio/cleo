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
  formatDistanceKm,
  nearestMapsMarker,
} from '~/lib/maps/geo'
import {
  formatLatLon,
  mapsMarkers,
  type MapsCoords,
  type MapsMarker,
} from '~/lib/maps/markers'
import { mapsRegionNeighbors } from '~/lib/maps/neighbors'
import type { MapsCountryDossier } from '~/lib/maps/previews'
import {
  filterMapsMarkersByRegion,
  mapsRegions,
} from '~/lib/maps/regions'
import { cleoAskHrefForCountry } from '~/lib/cleo/portal-links'
import { copyTextToClipboard } from '~/lib/maps/clipboard'
import { mapsSearchDocs } from '~/lib/maps/search'
import { daylightLabelAt } from '~/lib/maps/sun'
import {
  formatUtcDayLabel,
  formatUtcHourLabel,
  mapsSunAt,
  utcDayOfYear,
} from '~/lib/maps/sun-clock'
import {
  applyMapsUrlCanonical,
  mapsSharePath,
  resolveMapsUrlState,
  type MapsUrlCanonical,
} from '~/lib/maps/url-state'

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
  const queryHour = searchParams.get('h')
  const queryDay = searchParams.get('d')
  const [focusSlug, setFocusSlug] = useState<string | null>(null)
  const [selected, setSelected] = useState<MapsMarker | null>(null)
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  const [showGraticule, setShowGraticule] = useState(false)
  const [pickedSample, setPickedSample] = useState<{
    coords: MapsCoords
    label: string
  } | null>(null)
  const [sunMode, setSunMode] = useState<'live' | 'scrub'>('live')
  const [sunHour, setSunHour] = useState(() => new Date().getUTCHours())
  const [sunDay, setSunDay] = useState(() => utcDayOfYear(new Date()))
  const [liveNow, setLiveNow] = useState(() => new Date())
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  )
  const [resetSignal, setResetSignal] = useState(0)
  const [focusSignal, setFocusSignal] = useState(0)
  const [selectionAnnouncement, setSelectionAnnouncement] = useState('')
  const regionChipRefs = useRef<Array<HTMLButtonElement | null>>([])
  const guideLinkRef = useRef<HTMLAnchorElement>(null)
  const focusGuideAfterPick = useRef(false)

  const clearSample = () => {
    setPickedSample(null)
  }

  const sunCanonical = (mode: 'live' | 'scrub', hour: number, day: number) =>
    mode === 'scrub'
      ? { h: String(hour), d: String(day) }
      : { h: null, d: null }

  const writeUrl = (canonical: MapsUrlCanonical) => {
    if (
      (searchParams.get('c') ?? null) === canonical.c &&
      (searchParams.get('r') ?? null) === canonical.r &&
      (searchParams.get('h') ?? null) === canonical.h &&
      (searchParams.get('d') ?? null) === canonical.d
    ) {
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    applyMapsUrlCanonical(params, canonical)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  useEffect(() => {
    const resolved = resolveMapsUrlState({
      c: querySlug,
      r: queryRegion,
      h: queryHour,
      d: queryDay,
      markersBySlug,
      regions,
      now: liveNow,
    })

    setRegionFilter(resolved.region)
    if (resolved.marker) {
      setFocusSlug(resolved.marker.slug)
      setSelected(resolved.marker)
    } else {
      setFocusSlug(null)
      setSelected(null)
    }

    setSunMode(resolved.sunMode)
    // Only stamp scrubbed peers from the URL — live hour/day follow the clock.
    if (resolved.sunMode === 'scrub') {
      setSunHour(resolved.sunHour)
      setSunDay(resolved.sunDay)
    }

    if (!resolved.dirty) return
    writeUrl(resolved.canonical)
    // liveNow only defaults missing sun peers when the URL is dirty.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL is the source of truth
  }, [querySlug, queryRegion, queryHour, queryDay, markersBySlug, regions, pathname, router, searchParams])

  useEffect(() => {
    if (sunMode !== 'live') return
    const id = window.setInterval(() => {
      const next = new Date()
      setLiveNow(next)
      setSunHour(next.getUTCHours())
      setSunDay(utcDayOfYear(next))
    }, 60_000)
    return () => window.clearInterval(id)
  }, [sunMode])

  useEffect(() => {
    if (!selected) {
      setSelectionAnnouncement('')
      return
    }
    setSelectionAnnouncement(`${selected.name} selected on Maps`)
    if (!focusGuideAfterPick.current) return
    focusGuideAfterPick.current = false
    // Wait for the selection chip to commit before moving keyboard focus.
    const id = window.requestAnimationFrame(() => {
      guideLinkRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(id)
  }, [selected?.slug, selected?.name])

  const syncUrl = (
    slug: string | null,
    region: string | null = regionFilter,
    sun: { mode: 'live' | 'scrub'; hour: number; day: number } = {
      mode: sunMode,
      hour: sunHour,
      day: sunDay,
    },
  ) => {
    writeUrl({
      c: slug,
      r: region,
      ...sunCanonical(sun.mode, sun.hour, sun.day),
    })
  }

  const selectMarker = (marker: MapsMarker, fromSearch = false) => {
    focusGuideAfterPick.current = fromSearch
    setFocusSlug(marker.slug)
    setSelected(marker)
    clearSample()
    setCopyStatus('idle')
    syncUrl(marker.slug, regionFilter)
  }

  const dismissSelection = () => {
    setFocusSlug(null)
    setSelected(null)
    clearSample()
    setCopyStatus('idle')
    syncUrl(null, regionFilter)
  }

  const recenterSelection = () => {
    if (!selected) return
    setFocusSlug(selected.slug)
    setFocusSignal((value) => value + 1)
  }

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

  const setLiveSun = () => {
    const now = new Date()
    setSunMode('live')
    setLiveNow(now)
    setSunHour(now.getUTCHours())
    setSunDay(utcDayOfYear(now))
    syncUrl(selected?.slug ?? null, regionFilter, {
      mode: 'live',
      hour: now.getUTCHours(),
      day: utcDayOfYear(now),
    })
  }

  const scrubSunHour = (hour: number) => {
    setSunMode('scrub')
    setSunHour(hour)
    syncUrl(selected?.slug ?? null, regionFilter, {
      mode: 'scrub',
      hour,
      day: sunDay,
    })
  }

  const scrubSunDay = (day: number) => {
    setSunMode('scrub')
    setSunDay(day)
    syncUrl(selected?.slug ?? null, regionFilter, {
      mode: 'scrub',
      hour: sunHour,
      day,
    })
  }

  useEffect(() => {
    const typingInField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      if (target.isContentEditable) return true
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      return false
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '[' || event.key === ']') {
        if (typingInField(event.target)) return
        event.preventDefault()
        const base = sunMode === 'live' ? liveNow.getUTCHours() : sunHour
        const next =
          event.key === ']' ? (base + 1) % 24 : (base + 23) % 24
        scrubSunHour(next)
        return
      }
      if (event.key === '{' || event.key === '}') {
        if (typingInField(event.target)) return
        event.preventDefault()
        const base = sunMode === 'live' ? utcDayOfYear(liveNow) : sunDay
        const next =
          event.key === '}'
            ? base >= 365
              ? 1
              : base + 1
            : base <= 1
              ? 365
              : base - 1
        scrubSunDay(next)
        return
      }

      if (event.key !== 'Escape') return
      const target = event.target
      if (target instanceof HTMLElement) {
        // Let fields with content clear themselves first (MapsSearch clears
        // non-empty queries). Empty inputs should still dismiss Maps chrome.
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          const value = (target as HTMLInputElement | HTMLTextAreaElement).value
          if (value.trim()) return
        } else if (target.isContentEditable) {
          return
        }
      }
      if (pickedSample && !selected) {
        clearSample()
        return
      }
      if (!selected && !pickedSample) return
      dismissSelection()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    pickedSample,
    selected,
    regionFilter,
    sunMode,
    sunHour,
    sunDay,
    liveNow,
    pathname,
    router,
    searchParams,
  ])

  const resetView = () => {
    setResetSignal((value) => value + 1)
    setFocusSlug(null)
    setSelected(null)
    clearSample()
    setCopyStatus('idle')
    setRegionFilter(null)
    setShowGraticule(false)
    const now = new Date()
    setSunMode('live')
    setLiveNow(now)
    setSunHour(now.getUTCHours())
    setSunDay(utcDayOfYear(now))
    syncUrl(null, null, {
      mode: 'live',
      hour: now.getUTCHours(),
      day: utcDayOfYear(now),
    })
  }

  const currentShareCanonical = (
    countrySlug: string | null = selected?.slug ?? null,
  ): MapsUrlCanonical => ({
    c: countrySlug,
    r: regionFilter,
    ...sunCanonical(sunMode, sunHour, sunDay),
  })

  const copyMapsLink = async () => {
    if (!selected || typeof window === 'undefined') return
    const path = mapsSharePath(currentShareCanonical(selected.slug))
    const ok = await copyTextToClipboard(
      new URL(path, window.location.origin).toString(),
    )
    setCopyStatus(ok ? 'copied' : 'failed')
    window.setTimeout(() => setCopyStatus('idle'), ok ? 1600 : 2200)
  }

  const copySunLink = async () => {
    if (sunMode !== 'scrub' || typeof window === 'undefined') return
    const path = mapsSharePath(currentShareCanonical(null))
    const ok = await copyTextToClipboard(
      new URL(path, window.location.origin).toString(),
    )
    setCopyStatus(ok ? 'copied' : 'failed')
    window.setTimeout(() => setCopyStatus('idle'), ok ? 1600 : 2200)
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
  const searchDocs = useMemo(
    () => mapsSearchDocs(searchableMarkers, dossiers),
    [searchableMarkers, dossiers],
  )
  const nearestSample = pickedSample
    ? nearestMapsMarker(pickedSample.coords, searchableMarkers)
    : null
  const neighbors = selected
    ? mapsRegionNeighbors(selected, searchableMarkers, 4)
    : []
  const sunAt = mapsSunAt(
    sunMode,
    sunHour,
    liveNow,
    sunMode === 'scrub' ? sunDay : null,
  )
  const regionOptions = [null, ...regions] as const
  const activeSunDay = sunMode === 'live' ? utcDayOfYear(liveNow) : sunDay
  const selectionDaylight = selected
    ? daylightLabelAt(selected.lat, selected.lon, sunAt)
    : null
  const selectionSunLabel =
    sunMode === 'live'
      ? 'live UTC'
      : `${formatUtcHourLabel(sunHour)} · ${formatUtcDayLabel(sunDay, liveNow.getUTCFullYear())}`

  return (
    <div
      className="maps-page"
      data-has-selection={selected ? 'true' : undefined}
    >
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
          Drag to orbit · Scroll to zoom · [ ] sun hour · {'{ }'} season · Click
          land or sea to sample, then open the nearest country
        </p>
        <div
          className="enter"
          style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        >
          <MapsSearch
            docs={searchDocs}
            onPick={(marker) => selectMarker(marker, true)}
          />
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
            onClick={setLiveSun}
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
          {sunMode === 'scrub' ? (
            <button
              type="button"
              className="maps-toolbar-button"
              onClick={() => void copySunLink()}
            >
              {copyStatus === 'copied'
                ? 'Copied'
                : copyStatus === 'failed'
                  ? 'Copy failed'
                  : 'Copy sun link'}
            </button>
          ) : null}
        </div>
        <div
          className="maps-sun-scrub enter"
          style={{ '--enter-delay': '220ms' } as React.CSSProperties}
        >
          <label className="maps-sun-scrub-label" htmlFor="maps-sun-hour">
            Sun ·{' '}
            {sunMode === 'live'
              ? 'live UTC'
              : `${formatUtcHourLabel(sunHour)} · ${formatUtcDayLabel(sunDay, liveNow.getUTCFullYear())}`}
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
              scrubSunHour(Number(event.target.value))
            }}
          />
          <label className="maps-sun-scrub-label" htmlFor="maps-sun-day">
            Season · {formatUtcDayLabel(activeSunDay, liveNow.getUTCFullYear())}
          </label>
          <input
            id="maps-sun-day"
            className="maps-sun-scrub-input"
            type="range"
            min={1}
            max={365}
            step={1}
            value={activeSunDay}
            aria-valuetext={formatUtcDayLabel(
              activeSunDay,
              liveNow.getUTCFullYear(),
            )}
            onChange={(event) => {
              scrubSunDay(Number(event.target.value))
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
        focusSignal={focusSignal}
        onPickCoords={(coords) => {
          if (!coords) {
            clearSample()
            return
          }
          setPickedSample({
            coords,
            label: formatLatLon(coords.lat, coords.lon),
          })
        }}
        onSelect={(marker) => {
          if (!marker) {
            // Land/sea sample clears the country chip but keeps the sample HUD.
            setFocusSlug(null)
            setSelected(null)
            setCopyStatus('idle')
            syncUrl(null, regionFilter)
            return
          }
          selectMarker(marker)
        }}
      />

      {pickedSample && nearestSample ? (
        <div className="maps-sample-hud" role="region" aria-label="Coordinate sample">
          <p className="maps-sample-coords">{pickedSample.label}</p>
          <button
            type="button"
            className="maps-sample-nearest"
            onClick={() => selectMarker(nearestSample.marker, true)}
          >
            Nearest · {nearestSample.marker.name}
            <span className="maps-sample-distance">
              {formatDistanceKm(nearestSample.distanceKm)}
            </span>
          </button>
          <button
            type="button"
            className="maps-sample-clear"
            onClick={clearSample}
          >
            Clear
          </button>
        </div>
      ) : null}

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
              <Link
                href={`/gallery?q=${encodeURIComponent(dossier.place)}`}
                className="maps-selection-place"
              >
                {dossier.place}
              </Link>
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
            {selectionDaylight ? (
              <p className="maps-selection-daylight">
                {selectionDaylight} · {selectionSunLabel}
              </p>
            ) : null}
            <div
              className="maps-selection-sun-controls"
              role="group"
              aria-label="Sun at selection"
            >
              <button
                type="button"
                className="maps-selection-sun-live"
                aria-pressed={sunMode === 'live'}
                onClick={setLiveSun}
              >
                Live sun
              </button>
              <label
                className="maps-selection-sun-label"
                htmlFor="maps-selection-sun-hour"
              >
                Hour ·{' '}
                {sunMode === 'live'
                  ? formatUtcHourLabel(liveNow.getUTCHours())
                  : formatUtcHourLabel(sunHour)}
              </label>
              <input
                id="maps-selection-sun-hour"
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
                  scrubSunHour(Number(event.target.value))
                }}
              />
              <label
                className="maps-selection-sun-label"
                htmlFor="maps-selection-sun-day"
              >
                Season ·{' '}
                {formatUtcDayLabel(activeSunDay, liveNow.getUTCFullYear())}
              </label>
              <input
                id="maps-selection-sun-day"
                className="maps-sun-scrub-input"
                type="range"
                min={1}
                max={365}
                step={1}
                value={activeSunDay}
                aria-valuetext={formatUtcDayLabel(
                  activeSunDay,
                  liveNow.getUTCFullYear(),
                )}
                onChange={(event) => {
                  scrubSunDay(Number(event.target.value))
                }}
              />
            </div>
            {dossier ? (
              <>
                <p className="maps-selection-coords">{dossier.coordsLabel}</p>
                <p className="maps-selection-about">{dossier.about}</p>
                <p className="maps-selection-facts">
                  Capital ·{' '}
                  <Link
                    href={`/gallery?q=${encodeURIComponent(dossier.capital)}`}
                    className="maps-selection-inline-link"
                  >
                    {dossier.capital}
                  </Link>
                </p>
                <ul className="maps-selection-places">
                  {dossier.places.map((place) => (
                    <li key={place}>
                      <Link
                        href={`/gallery?q=${encodeURIComponent(place)}`}
                        className="maps-selection-inline-link"
                      >
                        {place}
                      </Link>
                    </li>
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
            <Link
              ref={guideLinkRef}
              href={`/explore/${selected.slug}`}
              className="maps-selection-link"
            >
              Open field guide
            </Link>
            <Link
              href={cleoAskHrefForCountry(selected.name)}
              className="maps-selection-dismiss"
            >
              Ask Cleo
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
              onClick={recenterSelection}
            >
              Recenter
            </button>
            <button
              type="button"
              className="maps-selection-dismiss"
              onClick={dismissSelection}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {copyStatus === 'copied'
          ? 'Maps link copied to clipboard'
          : copyStatus === 'failed'
            ? 'Could not copy Maps link'
            : selectionAnnouncement}
      </p>
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
          <div className="maps-stage" aria-hidden />
        </div>
      }
    >
      <MapsExplorerInner dossiers={dossiers} />
    </Suspense>
  )
}
