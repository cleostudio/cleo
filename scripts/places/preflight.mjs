#!/usr/bin/env node
/**
 * Validate place photo files on disk match content/place-photos.json.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const targets = JSON.parse(
  readFileSync(join(root, 'scripts/places/place-targets.json'), 'utf8'),
)
const photos = JSON.parse(
  readFileSync(join(root, 'content/place-photos.json'), 'utf8'),
)

const errors = []

for (const slug of Object.keys(targets)) {
  const photo = photos[slug]
  if (!photo) {
    errors.push(`${slug}: missing from place-photos.json`)
    continue
  }
  if (!photo.featureName || !photo.photographer || !photo.license) {
    errors.push(`${slug}: incomplete credit metadata`)
  }
  if (!Array.isArray(photo.renditions) || photo.renditions.length !== 3) {
    errors.push(`${slug}: expected 3 renditions`)
    continue
  }
  for (const rendition of photo.renditions) {
    if (!rendition.src?.startsWith(`/images/places/${slug}/`)) {
      errors.push(`${slug}: bad rendition path ${rendition.src}`)
      continue
    }
    const abs = join(root, 'public', rendition.src)
    if (!existsSync(abs)) {
      errors.push(`${slug}: missing file ${rendition.src}`)
      continue
    }
    const bytes = statSync(abs).size
    if (bytes !== rendition.bytes) {
      errors.push(
        `${slug}: byte mismatch for ${rendition.src} (disk ${bytes} vs manifest ${rendition.bytes})`,
      )
    }
    if (bytes < 5_000) {
      errors.push(`${slug}: suspiciously small file ${rendition.src} (${bytes} B)`)
    }
  }
}

for (const slug of Object.keys(photos)) {
  if (!targets[slug]) {
    errors.push(`${slug}: photo without place-targets entry`)
  }
}

if (errors.length) {
  console.error('Place preflight failed:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(
  `Place preflight ok — ${Object.keys(targets).length} places, files on disk match manifest.`,
)
