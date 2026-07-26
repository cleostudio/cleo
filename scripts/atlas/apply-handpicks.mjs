#!/usr/bin/env node
/**
 * Apply curated Commons hand-picks into atlas-photo-sources.json.
 * Used when automated scoring still returns a detail/sign/wrong subject.
 *
 *   node scripts/atlas/apply-handpicks.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const path = join(root, 'scripts/atlas/atlas-photo-sources.json')
const sources = JSON.parse(readFileSync(path, 'utf8'))
const UA =
  'cleo-atlas-curate/2.0 (https://github.com/cleostudio/cleo; knowledge portal photo curation)'

/** [slug, Commons File: title, featured place label] */
const picks = [
  ['albania', 'File:2011 Butrint 15 Theatre and Fortress.jpg', 'Butrint'],
  ['bahamas', 'File:Bahamas 1989 (592) Exuma (25249275789).jpg', 'Exuma Cays'],
  [
    'bangladesh',
    'File:Diwan-i-Am and Tomb of Pari Bibi with Garden - North-western View - Lalbagh Fort Complex - Dhaka 2015-05-31 2732.JPG',
    'Lalbagh Fort',
  ],
  ['equatorial-guinea', 'File:Nationalpark Monte Alén.jpg', 'Monte Alen National Park'],
  ['guatemala', 'File:Tikal Temple II.jpg', 'Tikal'],
  ["jamaica", "File:Jamaica Ocho Rios Dunn's River Falls 1.jpg", "Dunn's River Falls"],
  [
    'laos',
    'File:Landscape of Luang Prabang with a temporary wooden footbridge.jpg',
    'Luang Prabang',
  ],
  ['lebanon', 'File:Jeita Grotto ITH044.jpg', 'Jeita Grotto'],
  ['luxembourg', 'File:Luxembourg City - Grund from Corniche.jpg', 'Luxembourg Old Quarters'],
  ['panama', 'File:Miraflores Locks Panama Canal.jpg', 'Panama Canal'],
  [
    'suriname',
    'File:Neveh Shalom Synagogue and Mosque Keizerstraat.jpg',
    'Paramaribo Historic Centre',
  ],
  ['slovakia', 'File:Bratislava Castle with Danube.jpeg', 'Bratislava Castle'],
  [
    'slovenia',
    'File:Bled Island in Lake Bled, Slovenia, 20240504 0901 8297.jpg',
    'Lake Bled',
  ],
  ['tunisia', 'File:Souk el berka Tunis 03.JPG', 'Medina of Tunis'],
  [
    'vietnam',
    'File:View of sea from Titov Island, Ha Long Bay, Vietnam, 20240128 1337 3732.jpg',
    'Ha Long Bay',
  ],
  ['estonia', 'File:Old town of Tallinn 06-03-2012.jpg', 'Tallinn Old Town'],
  [
    'finland',
    'File:Iso Mustasaari. Taustalla Suomenlinnan lautta ja Pikku-Mustasaari 2019-09-14.jpg',
    'Suomenlinna',
  ],
  ['mexico', 'File:Chichen Itza 3.jpg', 'Chichen Itza'],
  [
    'monaco',
    'File:Casino de Montecarlo, Mónaco, 2016-06-23, DD 05.jpg',
    'Monte Carlo Casino',
  ],
  [
    'nicaragua',
    'File:Iglesia de la Merced (Granada, Nicaragua).jpg',
    'Granada',
  ],
  ['somalia', 'File:THE ROCKY MOGADISHU COASTLINE.jpg', 'Lido Beach'],
  ['russia', "File:Saint Basil's Cathedral (Moscow, 2004).jpg", 'Red Square'],
]

function stripHtml(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function isCredit(value) {
  return (
    Boolean(value) &&
    value.length <= 120 &&
    !/^\s*(note|warning|this (image|file|photo)|own work)\b/i.test(value)
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let ok = 0
for (const [slug, title, placeName] of picks) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: title,
        prop: 'imageinfo',
        iiprop: 'url|size|mime|extmetadata|user',
      })
      const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: { 'user-agent': UA, accept: 'application/json' },
      })
      const text = await res.text()
      if (!text.startsWith('{')) {
        throw new Error(`rate-limited or non-JSON (${res.status})`)
      }
      const data = JSON.parse(text)
      const page = Object.values(data.query?.pages ?? {})[0]
      const ii = page?.imageinfo?.[0]
      if (!ii) {
        console.log('MISS', slug, title)
        break
      }
      const em = ii.extmetadata ?? {}
      const credit =
        [stripHtml(em.Artist?.value || ''), stripHtml(em.Credit?.value || ''), ii.user || '']
          .find(isCredit) || 'Wikimedia Commons contributor'

      if (!sources[slug]) {
        console.log('NO SOURCE SLOT', slug)
        break
      }

      sources[slug] = {
        placeName,
        countryName: sources[slug].countryName,
        code: sources[slug].code,
        downloadUrl: ii.url,
        sourceUrl: ii.descriptionurl,
        photographer: credit,
        license: (em.LicenseShortName?.value || '').trim(),
        commonsTitle: page.title,
        width: ii.width,
        height: ii.height,
        assessments: em.Assessments?.value || '',
        score: 0,
        handpick: true,
      }
      console.log(
        `${slug.padEnd(22)} ${String(ii.width).padStart(5)}x${String(ii.height).padEnd(5)} ${(em.LicenseShortName?.value || '').padEnd(14)} ${credit.slice(0, 40)}`,
      )
      ok += 1
      break
    } catch (error) {
      console.log(`retry ${slug}: ${error.message}`)
      await sleep(3000 * (attempt + 1))
    }
  }
  await sleep(900)
}

writeFileSync(path, `${JSON.stringify(sources, null, 2)}\n`)
console.log(`\nwritten ${ok}/${picks.length} hand-picks → ${path}`)
