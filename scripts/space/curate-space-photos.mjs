#!/usr/bin/env node
/**
 * Apply the reviewed NASA Images selections for the two additional photographs
 * in every Space guide. The first source remains the established guide hero;
 * these two slots deliberately show different defining views or features.
 *
 * This is an editorial manifest, not a ranking scraper. Every entry was
 * checked against its NASA catalog page and original asset before it was added.
 *
 *   node scripts/space/curate-space-photos.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const sourcePath = join(root, 'scripts/space/space-photo-sources.json')
const rawSources = JSON.parse(readFileSync(sourcePath, 'utf8'))

const additions = {
  sun: [
    {
      featureName: 'SDO Transit, September 2015',
      nasaId: 'PIA19949',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA19949/PIA19949~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA19949',
      credit: 'NASA/GSFC/Solar Dynamics Observatory',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Dynamic Loops in Profile',
      nasaId: 'PIA21583',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21583/PIA21583~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21583',
      credit: 'NASA/GSFC/Solar Dynamics Observatory',
      license: 'Public Domain (NASA)',
    },
  ],
  mercury: [
    {
      featureName: 'A Detailed Look at Raditladi Basin',
      nasaId: 'PIA19409',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA19409/PIA19409~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA19409',
      credit:
        'NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Expansive Northern Volcanic Plains',
      nasaId: 'PIA19415',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA19415/PIA19415~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA19415',
      credit:
        'NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington',
      license: 'Public Domain (NASA)',
    },
  ],
  venus: [
    {
      featureName: 'Volcanic features in Atla Regio',
      nasaId: 'PIA00201',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA00201/PIA00201~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA00201',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Mosaic of Bahet and Onatah Coronae',
      nasaId: 'PIA00461',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA00461/PIA00461~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA00461',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
  ],
  earth: [
    {
      featureName: 'Earth triptych from NASA Juno spacecraft',
      nasaId: 'PIA14447',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA14447/PIA14447~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA14447',
      credit: 'NASA/JPL-Caltech/MSSS',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'A breathtaking Earthset from Orion',
      nasaId: 'art002e021278',
      downloadUrl:
        'https://images-assets.nasa.gov/image/art002e021278/art002e021278~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/art002e021278',
      credit: 'NASA',
      license: 'Public Domain (NASA)',
    },
  ],
  moon: [
    {
      featureName: 'Vallis Alpes',
      nasaId: 'PIA12934',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA12934/PIA12934~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA12934',
      credit: 'NASA/GSFC/Arizona State University',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Uplift, boulders of Tsiolkovskiy',
      nasaId: 'PIA12902',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA12902/PIA12902~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA12902',
      credit: 'NASA/GSFC/Arizona State University',
      license: 'Public Domain (NASA)',
    },
  ],
  mars: [
    {
      featureName: "Curiosity's view of sand ridges and Bolívar",
      nasaId: 'PIA25414',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA25414/PIA25414~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA25414',
      credit: 'NASA/JPL-Caltech/MSSS',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Windblown sand in Ganges Chasma',
      nasaId: 'PIA21600',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21600/PIA21600~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21600',
      credit: 'NASA/JPL-Caltech/University of Arizona',
      license: 'Public Domain (NASA)',
    },
  ],
  jupiter: [
    {
      featureName: 'Close-up views of Jupiter north pole',
      nasaId: 'PIA21031',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21031/PIA21031~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21031',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Three waves at Jupiter',
      nasaId: 'PIA22796',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA22796/PIA22796~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA22796',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS/JunoCam',
      license: 'Public Domain (NASA)',
    },
  ],
  saturn: [
    {
      featureName: 'Cassini “Noodle” mosaic of Saturn',
      nasaId: 'PIA21617',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21617/PIA21617~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21617',
      credit: 'NASA/JPL-Caltech/Space Science Institute/Hampton University',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Inside-out rings: over the limb',
      nasaId: 'PIA21897',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21897/PIA21897~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21897',
      credit: 'NASA/JPL-Caltech/Space Science Institute',
      license: 'Public Domain (NASA)',
    },
  ],
  uranus: [
    {
      featureName: 'Hubble finds many bright clouds on Uranus',
      nasaId: 'PIA02963',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA02963/PIA02963~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA02963',
      credit: 'NASA/JPL/STScI',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Uranus far-flung rings',
      nasaId: 'PIA01487',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA01487/PIA01487~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA01487',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
  ],
  neptune: [
    {
      featureName: 'Neptune Great Dark Spot in high resolution',
      nasaId: 'PIA00052',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA00052/PIA00052~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA00052',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Neptune rings',
      nasaId: 'PIA01493',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA01493/PIA01493~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA01493',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
  ],
  pluto: [
    {
      featureName: 'Closer look: majestic mountains and frozen plains',
      nasaId: 'PIA19947',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA19947/PIA19947~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA19947',
      credit:
        'NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Blue rays: New Horizons high-res farewell to Pluto',
      nasaId: 'PIA21590',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21590/PIA21590~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21590',
      credit:
        'NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute',
      license: 'Public Domain (NASA)',
    },
  ],
  'asteroid-belt': [
    {
      featureName: 'High cliffs at Vesta south pole',
      nasaId: 'PIA14713',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA14713/PIA14713~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA14713',
      credit: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Occator Crater on Ceres',
      nasaId: 'PIA20132',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA20132/PIA20132~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA20132',
      credit: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA',
      license: 'Public Domain (NASA)',
    },
  ],
  iss: [
    {
      featureName: 'ISS flyaround with Cygnus UltraFlex arrays',
      nasaId: 'iss066e080382',
      downloadUrl:
        'https://images-assets.nasa.gov/image/iss066e080382/iss066e080382~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/iss066e080382',
      credit: 'Thomas Pesquet',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'ISS flyaround with Russian segment and visiting vehicles',
      nasaId: 'iss066e080481',
      downloadUrl:
        'https://images-assets.nasa.gov/image/iss066e080481/iss066e080481~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/iss066e080481',
      credit: 'Thomas Pesquet',
      license: 'Public Domain (NASA)',
    },
  ],
  io: [
    {
      featureName: 'Io Culann-Tohil region in color',
      nasaId: 'PIA03885',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA03885/PIA03885~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA03885',
      credit: 'NASA/JPL/University of Arizona/Arizona State University',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Io plume captured by JunoCam',
      nasaId: 'PIA26235',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA26235/PIA26235~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA26235',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS',
      license: 'Public Domain (NASA)',
    },
  ],
  europa: [
    {
      featureName: "First image of Europa from Juno's close flyby",
      nasaId: 'PIA25330',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA25330/PIA25330~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA25330',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Highest-resolution Europa image and mosaic from Galileo',
      nasaId: 'PIA21431',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA21431/PIA21431~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA21431',
      credit: 'NASA/JPL-Caltech',
      license: 'Public Domain (NASA)',
    },
  ],
  ganymede: [
    {
      featureName: "Juno's Ganymede close-up",
      nasaId: 'PIA24681',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA24681/PIA24681~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA24681',
      credit: 'NASA/JPL-Caltech/SwRI/MSSS',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Ganymede Uruk Sulcus region from Galileo and Voyager',
      nasaId: 'PIA00705',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA00705/PIA00705~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA00705',
      credit: 'NASA/JPL',
      license: 'Public Domain (NASA)',
    },
  ],
  titan: [
    {
      featureName: 'Huygens Titan mosaic',
      nasaId: 'PIA07870',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA07870/PIA07870~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA07870',
      credit: 'NASA/JPL/ESA/University of Arizona',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Lakes on Titan',
      nasaId: 'PIA08630',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA08630/PIA08630~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA08630',
      credit: 'NASA/JPL-Caltech/ASI',
      license: 'Public Domain (NASA)',
    },
  ],
  enceladus: [
    {
      featureName: 'Bursting at the seams: the geyser basin of Enceladus',
      nasaId: 'PIA11688',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA11688/PIA11688~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA11688',
      credit: 'NASA/JPL/Space Science Institute',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'A fractured pole',
      nasaId: 'PIA19660',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA19660/PIA19660~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA19660',
      credit: 'NASA/JPL-Caltech/Space Science Institute',
      license: 'Public Domain (NASA)',
    },
  ],
  'milky-way': [
    {
      featureName: 'GLIMPSE the Galaxy all the way around',
      nasaId: 'PIA17996',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA17996/PIA17996~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA17996',
      credit: 'NASA/JPL-Caltech/University of Wisconsin',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'A royal celebration',
      nasaId: 'PIA15256',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA15256/PIA15256~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA15256',
      credit: 'NASA/JPL-Caltech/UCLA',
      license: 'Public Domain (NASA)',
    },
  ],
  andromeda: [
    {
      featureName: 'Our neighbor Andromeda',
      nasaId: 'PIA12832',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA12832/PIA12832~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA12832',
      credit: 'NASA/JPL-Caltech/UCLA',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Amazing Andromeda in red',
      nasaId: 'PIA03031',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA03031/PIA03031~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA03031',
      credit: 'NASA/JPL-Caltech/University of Arizona',
      license: 'Public Domain (NASA)',
    },
  ],
  'orion-nebula': [
    {
      featureName: 'Orion Nebula in infrared',
      nasaId: 'PIA25434',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA25434/PIA25434~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA25434',
      credit: 'ESA/NASA/JPL-Caltech',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Orion Nebula and bow shock',
      nasaId: 'PIA04227',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA04227/PIA04227~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA04227',
      credit: 'NASA and the Hubble Heritage Team STScI/AURA',
      license: 'Public Domain (NASA)',
    },
  ],
  'crab-nebula': [
    {
      featureName: 'Dead star creates celestial havoc',
      nasaId: 'PIA01320',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA01320/PIA01320~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA01320',
      credit: 'NASA/JPL-Caltech/ESA/CXC/University of Arizona/University of Szeged',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Crab Nebula as seen by Herschel and Hubble',
      nasaId: 'PIA17563',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA17563/PIA17563~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA17563',
      credit: 'ESA/Herschel/PACS; NASA, ESA',
      license: 'Public Domain (NASA)',
    },
  ],
  'carina-nebula': [
    {
      featureName: 'The tortured clouds of Eta Carinae',
      nasaId: 'PIA17257',
      downloadUrl: 'https://images-assets.nasa.gov/image/PIA17257/PIA17257~orig.jpg',
      sourceUrl: 'https://images.nasa.gov/details/PIA17257',
      credit: 'NASA/JPL-Caltech',
      license: 'Public Domain (NASA)',
    },
    {
      featureName: 'Cosmic Cliffs in the Carina Nebula',
      nasaId: 'carina_nebula',
      downloadUrl:
        'https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~orig.png',
      sourceUrl: 'https://images.nasa.gov/details/carina_nebula',
      credit: 'NASA/ESA/CSA/STScI',
      license: 'Public Domain (NASA)',
    },
  ],
}

const sourceSlugs = Object.keys(rawSources)
const additionSlugs = Object.keys(additions)
if (
  sourceSlugs.length !== additionSlugs.length ||
  sourceSlugs.some((slug) => !additions[slug])
) {
  throw new Error('Curated Space additions must cover every existing source slug exactly once')
}

const sources = {}
for (const slug of sourceSlugs) {
  const current = Array.isArray(rawSources[slug]) ? rawSources[slug][0] : rawSources[slug]
  const rows = [
    {
      ...current,
      downloadUrl: current.downloadUrl.replace(/^http:/, 'https:'),
    },
    ...additions[slug],
  ]

  if (rows.length !== 3 || new Set(rows.map((row) => row.nasaId)).size !== 3) {
    throw new Error(`${slug}: needs three distinct NASA image records`)
  }
  for (const row of rows) {
    if (!row.downloadUrl.startsWith('https://') || !row.sourceUrl.startsWith('https://')) {
      throw new Error(`${slug}: image and catalog URLs must use HTTPS`)
    }
    if (!row.credit.trim() || row.credit.length > 100) {
      throw new Error(`${slug}: image credit must be concise and attributable`)
    }
  }
  sources[slug] = rows
}

writeFileSync(sourcePath, `${JSON.stringify(sources, null, 2)}\n`)
console.log(`Wrote ${sourcePath} (${sourceSlugs.length} subjects × 3 curated photographs)`)
