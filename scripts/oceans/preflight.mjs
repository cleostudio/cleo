#!/usr/bin/env node
/**
 * Validate checked-in Oceans photo metadata against public JPEG renditions.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const WIDTHS = [640, 1280, 2048]
const photos = JSON.parse(
  readFileSync(join(root, 'content/ocean-photos.json'), 'utf8'),
)
const sources = JSON.parse(
  readFileSync(join(root, 'scripts/oceans/ocean-photo-sources.json'), 'utf8'),
)

const errors = []
const sourceSlugs = Object.keys(sources)
const photoSlugs = Object.keys(photos)

for (const slug of sourceSlugs) {
  if (!photos[slug]) errors.push(`${slug}: missing from content/ocean-photos.json`)
}
for (const slug of photoSlugs) {
  if (!sources[slug]) errors.push(`${slug}: unexpected photo without a source row`)
}

for (const [slug, photo] of Object.entries(photos)) {
  const ctx = `oceans/${slug}`
  if (!photo.featureName?.trim()) errors.push(`${ctx}: missing featureName`)
  if (!photo.alt?.trim()) errors.push(`${ctx}: missing alt`)
  if (!photo.caption?.trim()) errors.push(`${ctx}: missing caption`)
  if (!photo.photographer?.trim()) errors.push(`${ctx}: missing photographer`)
  if (!photo.sourceUrl?.startsWith('https://')) {
    errors.push(`${ctx}: sourceUrl must be https`)
  }
  if (!photo.license?.trim()) errors.push(`${ctx}: missing license`)
  if (!/^[a-f0-9]{64}$/.test(photo.checksum ?? '')) {
    errors.push(`${ctx}: checksum must be sha256 hex`)
  }
  if (!(photo.width > 0 && photo.height > 0)) {
    errors.push(`${ctx}: invalid dimensions`)
  }
  if (!Array.isArray(photo.renditions) || photo.renditions.length !== 3) {
    errors.push(`${ctx}: must have exactly three renditions`)
    continue
  }
  const widths = photo.renditions.map((r) => r.width).sort((a, b) => a - b)
  if (widths.join(',') !== WIDTHS.join(',')) {
    errors.push(`${ctx}: rendition widths must be ${WIDTHS.join(', ')}`)
  }
  for (const rendition of photo.renditions) {
    if (!rendition.src?.startsWith(`/images/oceans/${slug}/`)) {
      errors.push(`${ctx}: bad rendition src ${rendition.src}`)
      continue
    }
    const abs = join(root, 'public', rendition.src.replace(/^\//, ''))
    if (!existsSync(abs)) {
      errors.push(`${ctx}: missing file ${rendition.src}`)
      continue
    }
    const bytes = statSync(abs).size
    if (bytes !== rendition.bytes) {
      errors.push(
        `${ctx}: byte mismatch for ${rendition.src} (meta ${rendition.bytes}, disk ${bytes})`,
      )
    }
  }
}

if (errors.length) {
  console.error('Oceans photo preflight failed:\n' + errors.join('\n'))
  process.exit(1)
}

console.log(
  `Oceans photo preflight ok (${photoSlugs.length} subjects, ${photoSlugs.length * 3} JPEGs)`,
)
