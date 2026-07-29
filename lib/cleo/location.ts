export type UserLocation = {
  accuracy: number
  latitude: number
  longitude: number
  timeZone: string
}

const MAX_LOCATION_ACCURACY_METERS = 20_000_000
const MAX_TIME_ZONE_LENGTH = 100

function canonicalTimeZone(value: unknown) {
  if (typeof value !== 'string') return null

  const timeZone = value.trim()

  if (!timeZone || timeZone.length > MAX_TIME_ZONE_LENGTH) return null

  try {
    return Intl.DateTimeFormat('en-US', { timeZone }).resolvedOptions().timeZone
  } catch {
    return null
  }
}

/**
 * Accept only a browser-shaped high-accuracy location. Values are validated
 * again on the server because clients can construct requests independently of
 * Cleo's consent UI.
 */
export function parseUserLocation(value: unknown): UserLocation | null {
  if (typeof value !== 'object' || value === null) return null

  const { accuracy, latitude, longitude, timeZone } = value as Record<string, unknown>

  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    typeof accuracy !== 'number' ||
    !Number.isFinite(accuracy) ||
    accuracy < 0 ||
    accuracy > MAX_LOCATION_ACCURACY_METERS
  ) {
    return null
  }

  const canonicalZone = canonicalTimeZone(timeZone)

  if (!canonicalZone) return null

  return {
    accuracy,
    latitude,
    longitude,
    timeZone: canonicalZone,
  }
}

/**
 * Keep opt-in location out of the visible conversation. It is supplied only
 * as ephemeral developer context for the current Responses API request.
 */
export function buildUserLocationInstructions(location: UserLocation) {
  const accuracy = Math.max(1, Math.round(location.accuracy))

  return `<cleo_user_location>
The user explicitly chose to share this private, approximate device location for this turn:
- Latitude: ${location.latitude.toFixed(5)}
- Longitude: ${location.longitude.toFixed(5)}
- Reported accuracy: within about ${accuracy} meters
- IANA time zone: ${location.timeZone}

Use it only when it materially improves a location-aware answer, such as local time, weather, nearby choices, or regional context. Treat it as sensitive: never volunteer it, quote its exact coordinates, infer an address, or imply that you know it unless the user asks or it is necessary to answer. Respect the reported accuracy and say when a location-specific conclusion remains uncertain.
</cleo_user_location>`
}
