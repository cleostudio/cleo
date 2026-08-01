'use client'

import { useEffect, useState } from 'react'

import { requestUserLocation } from '~/lib/cleo/client-location'
import {
  isLocationSyncEnabled,
  subscribeToLocationSync,
} from '~/lib/cleo/location-preference'

type Coordinates = {
  accuracy: number
  latitude: number
  longitude: number
}

/** Survives remounts so the footer stamp does not flash “Locating…”. */
let rememberedCoordinates: Coordinates | null = null

/** @internal Vitest helper — clears the module cache between cases. */
export function resetFooterCoordinatesCacheForTests() {
  rememberedCoordinates = null
}

function formatCoordinate(value: number, positiveDirection: string, negativeDirection: string) {
  const direction = value >= 0 ? positiveDirection : negativeDirection
  return `${Math.abs(value).toFixed(5)}° ${direction}`
}

function accuracyDescription(accuracy: number) {
  if (!Number.isFinite(accuracy)) return ''
  return ` Accuracy reported within about ${Math.round(accuracy)} meters.`
}

function initialCoordinates() {
  return isLocationSyncEnabled() ? rememberedCoordinates : null
}

export function FooterCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates)
  const [isLocating, setIsLocating] = useState(
    () => isLocationSyncEnabled() && rememberedCoordinates === null,
  )

  useEffect(() => {
    let isCurrent = true
    let requestId = 0

    const syncLocation = (enabled: boolean, allowPrompt: boolean) => {
      requestId += 1
      const currentRequestId = requestId

      if (!enabled) {
        rememberedCoordinates = null
        setCoordinates(null)
        setIsLocating(false)
        return
      }

      // Keep the last stamp visible while a refresh is in flight. Only show
      // “Locating…” when we have nothing to display yet.
      if (rememberedCoordinates === null) {
        setCoordinates(null)
        setIsLocating(true)
      } else {
        setCoordinates(rememberedCoordinates)
        setIsLocating(false)
      }

      void requestUserLocation({ allowPrompt })
        .then((location) => {
          if (!isCurrent || requestId !== currentRequestId) return

          const next = {
            accuracy: location.accuracy,
            latitude: location.latitude,
            longitude: location.longitude,
          }
          rememberedCoordinates = next
          setCoordinates(next)
          setIsLocating(false)
        })
        .catch(() => {
          if (!isCurrent || requestId !== currentRequestId) return

          if (rememberedCoordinates === null) {
            setCoordinates(null)
          }
          setIsLocating(false)
        })
    }

    syncLocation(isLocationSyncEnabled(), false)
    const unsubscribe = subscribeToLocationSync(({ allowPrompt, enabled }) => {
      syncLocation(enabled, allowPrompt)
    })

    return () => {
      isCurrent = false
      unsubscribe()
    }
  }, [])

  const latitude = coordinates && formatCoordinate(coordinates.latitude, 'N', 'S')
  const longitude = coordinates && formatCoordinate(coordinates.longitude, 'E', 'W')
  const ariaLabel = coordinates
    ? `Your coordinates: ${latitude}, ${longitude}.${accuracyDescription(coordinates.accuracy)}`
    : isLocating
      ? 'Getting your location'
      : 'Your location is unavailable'

  return (
    <div className="footer-geo" aria-label={ariaLabel} aria-live="polite">
      <svg className="footer-geo-globe" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="9" />
        <ellipse cx="10" cy="10" rx="4" ry="9" />
        <path d="M1 10h18M1.9 6h16.2M1.9 14h16.2" />
      </svg>
      <span className="footer-geo-lines">
        {coordinates ? (
          <>
            <span>{latitude}</span>
            <span>{longitude}</span>
          </>
        ) : (
          <span>{isLocating ? 'Locating…' : 'Location unavailable'}</span>
        )}
      </span>
    </div>
  )
}
