/** Shared image limits for vision input and generation display. */

export const MAX_IMAGES_PER_MESSAGE = 4
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 2048

/** Responses `image_generation` output — jpeg keeps multi-turn payloads smaller. */
export const GENERATED_IMAGE_MEDIA_TYPE = "image/jpeg" as const
export const GENERATED_IMAGE_OUTPUT_FORMAT = "jpeg" as const
export const GENERATED_IMAGE_OUTPUT_COMPRESSION = 85
export const GENERATED_IMAGE_PARTIAL_IMAGES = 1

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
  const estimatedBytes = Math.floor((base64.length * 3) / 4)

  if (estimatedBytes > MAX_IMAGE_BYTES) {
    return null
  }

  return { mediaType, base64 }
}

export function toImageDataUrl(
  mediaType: AcceptedImageMimeType | "image/png",
  base64: string
) {
  return `data:${mediaType};base64,${base64}`
}
