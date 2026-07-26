/** Shared image limits for vision input and generation display. */

export const MAX_IMAGES_PER_MESSAGE = 4
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 2048

/**
 * Whole-request ceilings. Per-message limits alone leave room for a 50-message
 * conversation to carry hundreds of megabytes of vision input, which is billed
 * on every turn. These bound that without constraining real conversations.
 */
export const MAX_IMAGES_PER_REQUEST = 16
export const MAX_TOTAL_IMAGE_BYTES = 6 * 1024 * 1024

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const

export type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number]

const DATA_URL_PATTERN =
  /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/

export function isAcceptedImageMimeType(
  value: string
): value is AcceptedImageMimeType {
  return (ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(value)
}

export function parseImageDataUrl(url: string): {
  mediaType: AcceptedImageMimeType
  base64: string
  bytes: number
} | null {
  const match = DATA_URL_PATTERN.exec(url.trim())

  if (!match) {
    return null
  }

  const mediaType = match[1]
  const base64 = match[2]?.replace(/\s/g, "")

  if (!mediaType || !base64 || !isAcceptedImageMimeType(mediaType)) {
    return null
  }

  // Rough decoded size: 3/4 of base64 length.
  const bytes = Math.floor((base64.length * 3) / 4)

  if (bytes > MAX_IMAGE_BYTES) {
    return null
  }

  return { mediaType, base64, bytes }
}

export function toImageDataUrl(
  mediaType: AcceptedImageMimeType | "image/png",
  base64: string
) {
  return `data:${mediaType};base64,${base64}`
}
