#!/usr/bin/env node
/**
 * Builds labelled contact sheets of the shipped photographs so a whole
 * collection can be reviewed at once. Review aid only — writes to /tmp.
 *
 *   tsx scripts/atlas/contact-sheet.mjs [--collection=places|space] [--per=30]
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const collection =
  args.find((a) => a.startsWith('--collection='))?.split('=')[1] ?? 'places'
const perSheet = Number(
  args.find((a) => a.startsWith('--per='))?.split('=')[1] ?? 30,
)

const CELL_W = 300
const CELL_H = 200
const LABEL_H = 34
const COLS = 6
const GAP = 6

function items() {
  if (collection === 'space') {
    const photos = JSON.parse(
      readFileSync(join(root, 'content/space-photos.json'), 'utf8'),
    )
    return Object.entries(photos).map(([slug, photo]) => ({
      file: photo.renditions.find((r) => r.width === 640) ?? photo.renditions[0],
      subtitle: photo.featureName ?? '',
      title: slug,
    }))
  }

  const atlas = JSON.parse(readFileSync(join(root, 'content/atlas.json'), 'utf8'))
  return Object.entries(atlas).map(([slug, entry]) => ({
    file:
      entry.photo.renditions.find((r) => r.width === 640) ??
      entry.photo.renditions[0],
    subtitle: entry.photo.placeName,
    title: slug,
  }))
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  )
}

const all = items()
const sheets = Math.ceil(all.length / perSheet)

for (let sheet = 0; sheet < sheets; sheet += 1) {
  const batch = all.slice(sheet * perSheet, (sheet + 1) * perSheet)
  const rows = Math.ceil(batch.length / COLS)
  const width = COLS * CELL_W + (COLS + 1) * GAP
  const height = rows * (CELL_H + LABEL_H) + (rows + 1) * GAP

  const composites = []

  for (const [index, item] of batch.entries()) {
    const col = index % COLS
    const row = Math.floor(index / COLS)
    const left = GAP + col * (CELL_W + GAP)
    const top = GAP + row * (CELL_H + LABEL_H + GAP)
    const source = join(root, 'public', item.file.src)

    composites.push({
      input: await sharp(source)
        .resize(CELL_W, CELL_H, { fit: 'cover' })
        .toBuffer(),
      left,
      top,
    })

    const label = `<svg width="${CELL_W}" height="${LABEL_H}">
      <rect width="100%" height="100%" fill="#111"/>
      <text x="4" y="14" font-family="monospace" font-size="12" fill="#fff">${escapeXml(item.title.slice(0, 34))}</text>
      <text x="4" y="28" font-family="monospace" font-size="11" fill="#9c9">${escapeXml(item.subtitle.slice(0, 36))}</text>
    </svg>`

    composites.push({
      input: Buffer.from(label),
      left,
      top: top + CELL_H,
    })
  }

  const out = `/tmp/sheet-${collection}-${String(sheet + 1).padStart(2, '0')}.jpg`

  await sharp({
    create: {
      background: { b: 10, g: 10, r: 10 },
      channels: 3,
      height,
      width,
    },
  })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(out)

  console.log(`${out}  (${batch.length} photos)`)
}
