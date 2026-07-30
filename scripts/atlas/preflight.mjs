#!/usr/bin/env node
/**
 * Atlas image-import preflight.
 *
 * Validates content/atlas.json against the country registry and confirms every
 * referenced local JPEG rendition exists on disk with a matching byte size.
 * Run before deployment: `pnpm validate:atlas`
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

// Load the same validator the app uses (TypeScript via tsx).
const { validateAtlasManifest } = await import(
  pathToFileURL(join(root, 'lib/atlas/validate.ts')).href
)

const manifest = JSON.parse(readFileSync(join(root, 'content/atlas.json'), 'utf8'))

try {
  validateAtlasManifest(manifest)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}

let missing = 0
let mismatched = 0

for (const [slug, entry] of Object.entries(manifest)) {
  for (const [photoIndex, photo] of entry.photos.entries()) {
    for (const rendition of photo.renditions) {
      const abs = join(root, 'public', rendition.src.replace(/^\//, ''))
      if (!existsSync(abs)) {
        console.error(`Missing file for ${slug} photo ${photoIndex + 1}: ${rendition.src}`)
        missing += 1
        continue
      }
      const size = statSync(abs).size
      if (size !== rendition.bytes) {
        console.error(
          `Byte mismatch for ${slug} photo ${photoIndex + 1} ${rendition.width}px: manifest ${rendition.bytes}, disk ${size}`,
        )
        mismatched += 1
      }
      const metadata = await sharp(abs).metadata()
      if (metadata.width !== rendition.width) {
        console.error(
          `Width mismatch for ${slug} photo ${photoIndex + 1}: manifest ${rendition.width}px, disk ${metadata.width ?? 0}px`,
        )
        mismatched += 1
      }
    }
  }
}

if (missing || mismatched) {
  console.error(
    `Atlas preflight failed: ${missing} missing file(s), ${mismatched} byte mismatch(es)`,
  )
  process.exit(1)
}

console.log(
  `Atlas preflight OK — ${Object.keys(manifest).length} countries × 3 photographs, all renditions present.`,
)
