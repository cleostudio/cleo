/**
 * Convert between AskForm data-URL images and IndexedDB Blobs.
 * Blobs avoid the ~33% base64 tax on already-large payloads.
 */

function parseDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } {
  const match = /^data:([^;,]+)?((?:;[^,]*)*),([\s\S]*)$/.exec(dataUrl)
  if (!match) {
    throw new Error('Unsupported image payload.')
  }

  const mime = match[1] || 'application/octet-stream'
  const params = match[2] || ''
  const payload = match[3] || ''

  if (params.includes(';base64')) {
    const binary = atob(payload)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return { mime, bytes }
  }

  const decoded = decodeURIComponent(payload)
  const bytes = new TextEncoder().encode(decoded)
  return { mime, bytes }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export async function dataUrlToBlob(dataUrl: string): Promise<{
  blob: Blob
  mime: string
  bytes: number
}> {
  const { mime, bytes } = parseDataUrl(dataUrl)
  const copy = Uint8Array.from(bytes)
  const blob = new Blob([copy], { type: mime })
  return { blob, mime, bytes: blob.size || bytes.byteLength }
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  const mime = blob.type || 'application/octet-stream'

  // Prefer FileReader when it works (browsers). Fall back to manual base64 for
  // test environments where Blob/FileReader round-trips are unreliable.
  if (typeof FileReader !== 'undefined') {
    try {
      const viaReader = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () =>
          reject(reader.error ?? new Error('Could not read image blob.'))
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
            return
          }
          reject(new Error('Could not read image blob.'))
        }
        reader.readAsDataURL(blob)
      })
      if (viaReader.startsWith('data:')) return viaReader
    } catch {
      // fall through
    }
  }

  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  return `data:${mime};base64,${bytesToBase64(bytes)}`
}

export function estimateDataUrlBytes(dataUrl: string): number {
  try {
    return parseDataUrl(dataUrl).bytes.byteLength
  } catch {
    return dataUrl.length
  }
}
