#!/usr/bin/env node
/**
 * Validate checked-in Space photo metadata against public JPEG renditions.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const WIDTHS = [640, 1280, 2048]
const photos = JSON.parse(
  readFileSync(join(root, 'content/space-photos.json'), 'utf8'),
)
const sources = JSON.parse(
  readFileSync(join(root, 'scripts/space/space-photo-sources.json'), 'utf8'),
)

const errors = []
const sourceSlugs = Object.keys(sources)
const photoSlugs = Object.keys(photos)

for (const slug of sourceSlugs) {
  if (!Array.isArray(sources[slug]) || sources[slug].length !== 3) {
    errors.push(`${slug}: sources must contain exactly three photographs`)
  }
  if (!Array.isArray(photos[slug]) || photos[slug].length !== 3) {
    errors.push(`${slug}: manifest must contain exactly three photographs`)
  }
}
for (const slug of photoSlugs) {
  if (!sources[slug]) errors.push(`${slug}: unexpected photo without a source row`)
}

for (const [slug, photoSet] of Object.entries(photos)) {
  if (!Array.isArray(photoSet)) continue
  const sourceSet = sources[slug]
  const sourceUrls = new Set()
  const checksums = new Set()

  for (const [photoIndex, photo] of photoSet.entries()) {
    const ctx = `space/${slug} photo ${photoIndex + 1}`
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
    if (sourceSet?.[photoIndex]?.nasaId !== photo.nasaId) {
      errors.push(`${ctx}: nasaId does not match curated source`)
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
      if (!rendition.src?.startsWith(`/images/space/${slug}/`)) {
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

    if (sourceUrls.has(photo.sourceUrl)) {
      errors.push(`space/${slug}: duplicate photograph source`)
    }
    if (checksums.has(photo.checksum)) {
      errors.push(`space/${slug}: duplicate photograph content`)
    }
    sourceUrls.add(photo.sourceUrl)
    checksums.add(photo.checksum)
  }
}

if (errors.length) {
  console.error('Space photo preflight failed:\n' + errors.join('\n'))
  process.exit(1)
}

const photoCount = Object.values(photos).reduce(
  (total, photoSet) => total + (Array.isArray(photoSet) ? photoSet.length : 0),
  0,
)
console.log(`Space photo preflight ok (${photoSlugs.length} subjects × 3 photographs, ${photoCount * 3} JPEGs)`)
