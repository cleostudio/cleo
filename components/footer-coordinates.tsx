'use client'

import { useEffect, useState } from 'react'

type Coordinates = {
  accuracy: number
  latitude: number
  longitude: number
}

const locationOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10_000,
}

function formatCoordinate(value: number, positiveDirection: string, negativeDirection: string) {
  const direction = value >= 0 ? positiveDirection : negativeDirection
  return `${Math.abs(value).toFixed(5)}° ${direction}`
}

function accuracyDescription(accuracy: number) {
  if (!Number.isFinite(accuracy)) return ''
  return ` Accuracy reported within about ${Math.round(accuracy)} meters.`
}

export function FooterCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    let isCurrent = true

    if (!('geolocation' in navigator)) {
      setIsLocating(false)
      return () => {
        isCurrent = false
      }
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isCurrent) return

          setCoordinates({
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setIsLocating(false)
        },
        () => {
          if (isCurrent) setIsLocating(false)
        },
        locationOptions,
      )
    } catch {
      setIsLocating(false)
    }

    return () => {
      isCurrent = false
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
