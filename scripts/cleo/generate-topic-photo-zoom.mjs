#!/usr/bin/env node
/**
 * Build a slim client-safe index of curated
 * Explore/Space/Civilizations/Cities/Oceans photographs for Cleo Markdown
 * image zoom (Gallery-parity lightbox + caption plate).
 *
 * Avoids shipping the full atlas prose corpus to the /cleo client bundle.
 *
 * Usage: pnpm generate:cleo-topic-photo-zoom
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const outPath = join(root, 'content/cleo-topic-photo-zoom.json')

const { allTopicPhotoItems } = await import(
  pathToFileURL(join(root, 'lib/gallery.ts')).href
)

const ROOT_KEY = {
  places: 'atlas',
  space: 'space',
  civilizations: 'civilizations',
  cities: 'cities',
  oceans: 'oceans',
}

const index = {}

for (const item of allTopicPhotoItems()) {
  const rootKey = ROOT_KEY[item.collection]
  const slug = item.href.replace(
    /^\/(explore|space|civilizations|cities|oceans)\//,
    '',
  )
  const slot = item.photo.renditions[0]?.src.match(/\/w\d+-(2|3)\.jpg$/)?.[1]
  const key = `${rootKey}/${slug}${slot ? `-${slot}` : ''}`

  index[key] = {
    collection: item.collection,
    title: item.title,
    subtitle: item.subtitle,
    alt: item.photo.alt,
    photographer: item.photo.photographer,
    license: item.photo.license,
    width: item.photo.width,
    height: item.photo.height,
    renditions: item.photo.renditions.map((rendition) => ({
      src: rendition.src,
      width: rendition.width,
    })),
  }
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`)
console.log(
  `Wrote ${Object.keys(index).length} topic photo zoom records → ${outPath}`,
)
