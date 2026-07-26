import {
  ACCEPTED_IMAGE_MIME_TYPES,
  isAcceptedImageMimeType,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGES_PER_MESSAGE,
  type AcceptedImageMimeType,
} from "~/lib/cleo/images"

export { MAX_IMAGES_PER_MESSAGE }

export const IMAGE_ACCEPT = [...ACCEPTED_IMAGE_MIME_TYPES, "image/jpg"].join(
  ","
)

function loadImageElement(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read that image."))
    image.src = url
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: AcceptedImageMimeType,
  quality?: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not prepare that image."))
          return
        }

        resolve(blob)
      },
      type,
      quality
    )
  })
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read that image."))
        return
      }

      resolve(reader.result)
    }
    reader.onerror = () => reject(new Error("Could not read that image."))
    reader.readAsDataURL(blob)
  })
}

async function resizeImageFile(file: File): Promise<string> {
  const mimeType = file.type === "image/jpg" ? "image/jpeg" : file.type

  if (!isAcceptedImageMimeType(mimeType)) {
    throw new Error("Use a PNG, JPEG, WEBP, or GIF image.")
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `Each image must be ${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))}MB or smaller.`
    )
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageElement(objectUrl)
    const longest = Math.max(image.naturalWidth, image.naturalHeight)
    const scale =
      longest > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / longest : 1
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))

    // Keep small GIFs as-is so we do not flatten animation frames unexpectedly
    // beyond the first frame the API can already use.
    if (mimeType === "image/gif" && scale === 1) {
      return blobToDataUrl(file)
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Could not prepare that image.")
    }

    context.drawImage(image, 0, 0, width, height)

    const outputType: AcceptedImageMimeType =
      mimeType === "image/png" || mimeType === "image/webp"
        ? mimeType
        : "image/jpeg"
    const blob = await canvasToBlob(
      canvas,
      outputType,
      outputType === "image/jpeg" ? 0.92 : undefined
    )

    if (blob.size > MAX_IMAGE_BYTES) {
      throw new Error(
        `Each image must be ${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))}MB or smaller.`
      )
    }

    return blobToDataUrl(blob)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function filesToMessageImages(files: FileList | File[]) {
  const list = Array.from(files)

  if (list.length === 0) {
    return [] as string[]
  }

  const urls: string[] = []

  for (const file of list) {
    urls.push(await resizeImageFile(file))
  }

  return urls
}
