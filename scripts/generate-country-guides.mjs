#!/usr/bin/env node
/**
 * Regenerates content/country-guides.json — about copy + a beautiful place
 * photo for every country in lib/countries.ts.
 *
 * Images are static Unsplash CDN URLs (no API key). Re-run after editing
 * PLACE_BY_CODE or the Unsplash pools.
 */

import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// Load countries via tsx-compatible dynamic import when run with `pnpm exec tsx`.
const { countries } = await import('../lib/countries.ts')

/** Famous place (or iconic landscape) per ISO code. */
const PLACE_BY_CODE = {
  AF: 'Band-e Amir lakes',
  AL: 'Berat old town',
  DZ: 'Sahara dunes near Timimoun',
  AD: 'Coma Pedrosa peaks',
  AO: 'Tundavala Gap',
  AG: 'Dickenson Bay',
  AR: 'Perito Moreno Glacier',
  AM: 'Tatev Monastery',
  AU: 'Uluru at dawn',
  AT: 'Hallstatt on the lake',
  AZ: 'Old City of Baku',
  BS: 'Exuma sandbars',
  BH: 'Manama corniche at dusk',
  BD: 'Sundarbans mangrove waterways',
  BB: 'Bathsheba coast',
  BY: 'Mir Castle',
  BE: 'Ghent canal houses',
  BZ: 'Great Blue Hole',
  BJ: 'Ganvié lake village',
  BT: 'Tiger’s Nest Monastery',
  BO: 'Salar de Uyuni',
  BA: 'Stari Most, Mostar',
  BW: 'Okavango Delta',
  BR: 'Sugarloaf Mountain, Rio',
  BN: 'Kampong Ayer water village',
  BG: 'Rila Monastery',
  BF: 'Cascades de Banfora',
  BI: 'Lake Tanganyika shore',
  CV: 'Pico do Fogo crater',
  KH: 'Angkor Wat at sunrise',
  CM: 'Mount Cameroon slopes',
  CA: 'Moraine Lake, Banff',
  CF: 'Dzanga Bai forest clearing',
  TD: 'Ennedi Plateau arches',
  CL: 'Torres del Paine',
  CN: 'Li River, Guilin',
  CO: 'Cocora Valley wax palms',
  KM: 'Mount Karthala',
  CG: 'Congo Basin canopy',
  CR: 'Arenal Volcano',
  HR: 'Plitvice Lakes',
  CU: 'Viñales Valley',
  CY: 'Akamas Peninsula',
  CZ: 'Charles Bridge, Prague',
  CD: 'Virunga volcanoes',
  DK: 'Nyhavn harbor',
  DJ: 'Lake Assal',
  DM: 'Boiling Lake trail',
  DO: 'Samaná Bay',
  EC: 'Galápagos coastline',
  EG: 'Giza pyramids at dusk',
  SV: 'Santa Ana Volcano',
  GQ: 'Bioko Island rainforest',
  ER: 'Dahlak Archipelago',
  EE: 'Tallinn old town',
  SZ: 'Mlilwane wildlife hills',
  ET: 'Simien Mountains',
  FJ: 'Yasawa Islands reef',
  FI: 'Lapland northern lights',
  FR: 'Mont Saint-Michel',
  GA: 'Loango coastline',
  GM: 'River Gambia wetlands',
  GE: 'Kazbegi and Mount Kazbek',
  DE: 'Neuschwanstein Castle',
  GH: 'Cape Coast shoreline',
  GR: 'Santorini caldera',
  GD: 'Grand Anse Beach',
  GT: 'Lake Atitlán',
  GN: 'Fouta Djallon highlands',
  GW: 'Bijagós Archipelago',
  GY: 'Kaieteur Falls',
  HT: 'Citadelle Laferrière',
  HN: 'Copán ruins in mist',
  HU: 'Parliament on the Danube',
  IS: 'Skógafoss waterfall',
  IN: 'Taj Mahal at sunrise',
  ID: 'Tegallalang rice terraces',
  IR: 'Nasir al-Mulk Mosque light',
  IQ: 'Erbil citadel',
  IE: 'Cliffs of Moher',
  IL: 'Old City of Jerusalem',
  IT: 'Amalfi Coast',
  CI: 'Basilica of Our Lady of Peace',
  JM: 'Blue Mountains ridgeline',
  JP: 'Mount Fuji and cherry blossoms',
  JO: 'Petra Treasury',
  KZ: 'Charyn Canyon',
  KE: 'Maasai Mara savanna',
  KI: 'Tarawa lagoon',
  KW: 'Kuwait Towers waterfront',
  KG: 'Issyk-Kul lake shore',
  LA: 'Luang Prabang temples',
  LV: 'Riga Art Nouveau streets',
  LB: 'Jeita Grotto',
  LS: 'Maloti mountain passes',
  LR: 'Robertsport surf coast',
  LY: 'Leptis Magna ruins',
  LI: 'Vaduz Castle hillside',
  LT: 'Curonian Spit dunes',
  LU: 'Luxembourg City casemates',
  MG: 'Avenue of the Baobabs',
  MW: 'Lake Malawi shoreline',
  MY: 'Langkawi skybridge views',
  MV: 'Maldivian overwater reef',
  ML: 'Great Mosque of Djenné',
  MT: 'Azure Window coast, Gozo',
  MH: 'Majuro atoll lagoon',
  MR: 'Banc d’Arguin shores',
  MU: 'Le Morne Brabant',
  MX: 'Cenote in Yucatán',
  FM: 'Pohnpei waterfall jungle',
  MD: 'Orheiul Vechi monastery',
  MC: 'Monte Carlo harbor',
  MN: 'Orkhon Valley steppe',
  ME: 'Bay of Kotor',
  MA: 'Chefchaouen blue streets',
  MZ: 'Bazaruto Archipelago',
  MM: 'Bagan temple plains',
  NA: 'Deadvlei and dunes',
  NR: 'Nauru coastal cliff line',
  NP: 'Everest Base Camp trail',
  NL: 'Kinderdijk windmills',
  NZ: 'Milford Sound',
  NI: 'Isletas of Granada',
  NE: 'Aïr Mountains',
  NG: 'Olumo Rock',
  KP: 'Mount Paektu',
  MK: 'Ohrid lake town',
  NO: 'Geirangerfjord',
  OM: 'Wadi Shab gorge',
  PK: 'Hunza Valley',
  PW: 'Jellyfish Lake',
  PS: 'Old City of Nablus hills',
  PA: 'San Blas islands',
  PG: 'Kokoda Track rainforest',
  PY: 'Iguazú from the Paraguay side',
  PE: 'Machu Picchu',
  PH: 'Palawan lagoon',
  PL: 'Kraków old town square',
  PT: 'Douro Valley terraces',
  QA: 'Inland Sea (Khor Al Adaid)',
  RO: 'Transfăgărășan road',
  RU: 'Lake Baikal ice',
  RW: 'Volcanoes National Park',
  KN: 'Nevis Peak',
  LC: 'Pitons of Soufrière',
  VC: 'Tobago Cays',
  WS: 'To Sua Ocean Trench',
  SM: 'Mount Titano towers',
  ST: 'Pico Cão Grande',
  SA: 'AlUla rock formations',
  SN: 'Pink Lake Retba',
  RS: 'Uvac river meanders',
  SC: 'Anse Source d’Argent',
  SL: 'Banana Islands',
  SG: 'Gardens by the Bay',
  SK: 'High Tatras',
  SI: 'Lake Bled',
  SB: 'Marovo Lagoon',
  SO: 'Laas Geel rock art hills',
  ZA: 'Table Mountain',
  KR: 'Bukchon Hanok Village',
  SS: 'Boma National Park plains',
  ES: 'Alhambra, Granada',
  LK: 'Sigiriya rock fortress',
  SD: 'Meroe pyramids',
  SR: 'Central Suriname Nature Reserve',
  SE: 'Swedish Lapland aurora',
  CH: 'Matterhorn above Zermatt',
  SY: 'Old City of Damascus courtyards',
  TJ: 'Fann Mountains',
  TZ: 'Serengeti migration plains',
  TH: 'Railay Beach cliffs',
  TL: 'Jaco Island waters',
  TG: 'Koutammakou mud-tower villages',
  TO: 'Haʻamonga ʻa Maui trilithon',
  TT: 'Maracas Bay',
  TN: 'Sidi Bou Said blue doors',
  TR: 'Cappadocia fairy chimneys',
  TM: 'Darvaza gas crater',
  TV: 'Funafuti lagoon',
  UG: 'Murchison Falls',
  UA: 'Carpathian mountain meadows',
  AE: 'Liwa Oasis dunes',
  GB: 'Scottish Highlands loch',
  US: 'Yosemite Valley',
  UY: 'Cabo Polonio dunes',
  UZ: 'Registan Square, Samarkand',
  VU: 'Mount Yasur glow',
  VA: 'St. Peter’s Square',
  VE: 'Angel Falls',
  VN: 'Hạ Long Bay',
  YE: 'Old City of Sana’a',
  ZM: 'Victoria Falls',
  ZW: 'Hwange wildlife plains',
}

/** Region-tuned Unsplash photo IDs (verified travel / landscape hotlinks). */
const IMAGE_POOLS = {
  Africa: [
    '1509316975854-fba7e9b7e0e9',
    '1516026672322-bc52d61a55d5',
    '1489392191049-fc10c97e64b6',
    '1516426122078-c23e76319801',
    '1523805009345-7448845a9e53',
    '1547471080-7cc2caa01a7e',
  ],
  Americas: [
    '1506905925346-21bda4d32df4',
    '1469474968028-56623f02e42e',
    '1470071450321-d077b3c9f5b0',
    '1441974231531-c6227db76b6e',
    '1501785888041-af3ef285b470',
    '1501594907352-04cda38ebc29',
    '1483729558449-99ef09a8c325',
    '1526392060635-9d6019884377',
  ],
  Asia: [
    '1548013146-72479768bada',
    '1508804185872-d7badad00f7d',
    '1528127269322-539801943592',
    '1537996194471-e657df975ab4',
    '1552465011-b4e21bf6e79a',
    '1476514525535-07fb3b4ae5f1',
    '1548786811-dd6e753970d0',
    '1512453979798-5ea7199d0b0b',
  ],
  Europe: [
    '1467269234592-1990dabc067a',
    '1499856871958-5b9627545d1a',
    '1523906834658-6e24ef6506b4',
    '1502602898657-3e91760cbb34',
    '1516483638261-75a2190b14de',
    '1533105079780-92b9be482077',
    '1464822759023-fed622ff2c3b',
    '1555881400-74d7acaacdba',
  ],
  Oceania: [
    '1507525428034-b723cf961d3e',
    '1505142468610-359e7d316be0',
    '1544551763-46a013bb70d5',
    '1559827260-dc66d52bef19',
    '1519046904884-53103b34b206',
    '1478131143081-80fbd22d2b0e',
  ],
  default: [
    '1469474968028-56623f02e42e',
    '1501785888041-af3ef285b470',
    '1441974231531-c6227db76b6e',
    '1470071450321-d077b3c9f5b0',
  ],
}

/** Country-specific Unsplash photo IDs when a strong match is known. */
const IMAGE_BY_CODE = {
  IT: '1516483638261-75a2190b14de',
  FR: '1502602898657-3e91760cbb34',
  NZ: '1469854523086-cc02fe5d8800',
  PE: '1526392060635-9d6019884377',
  JO: '1548786811-dd6e753970d0',
  NO: '1464822759023-fed622ff2c3b',
  CH: '1464822759023-fed622ff2c3b',
  US: '1441974231531-c6227db76b6e',
  BR: '1483729558449-99ef09a8c325',
  GR: '1533105079780-92b9be482077',
  ZA: '1489392191049-fc10c97e64b6',
  TH: '1552465011-b4e21bf6e79a',
  VN: '1528127269322-539801943592',
  IN: '1548013146-72479768bada',
  CN: '1508804185872-d7badad00f7d',
  GB: '1467269234592-1990dabc067a',
  ES: '1543783207-ec64e4d87511',
  PT: '1555881400-74d7acaacdba',
  KE: '1516426122078-c23e76319801',
  TZ: '1516426122078-c23e76319801',
  NA: '1509316975854-fba7e9b7e0e9',
  ID: '1537996194471-e657df975ab4',
  PH: '1559827260-dc66d52bef19',
  MV: '1544551763-46a013bb70d5',
  FJ: '1507525428034-b723cf961d3e',
  SC: '1507525428034-b723cf961d3e',
  CL: '1464822759023-fed622ff2c3b',
  AR: '1506905925346-21bda4d32df4',
  AE: '1512453979798-5ea7199d0b0b',
  SA: '1509316975854-fba7e9b7e0e9',
  CA: '1501785888041-af3ef285b470',
  AU: '1507525428034-b723cf961d3e',
  JP: '1508804185872-d7badad00f7d',
  EG: '1548013146-72479768bada',
  IS: '1464822759023-fed622ff2c3b',
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function imageFor(country) {
  const id =
    IMAGE_BY_CODE[country.code] ??
    (IMAGE_POOLS[country.region] ?? IMAGE_POOLS.default)[
      hash(country.slug) % (IMAGE_POOLS[country.region] ?? IMAGE_POOLS.default).length
    ]
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`
}

function aboutFor(country, place) {
  const openers = [
    `${country.name} sits in ${country.subregion}, part of ${country.region} — a place where geography still sets the pace of a day.`,
    `In ${country.subregion}, ${country.name} gathers coastlines, highlands, and towns into one compact story of ${country.region}.`,
    `${country.name} belongs to ${country.subregion} in ${country.region}, with landscapes that reward slow looking.`,
    `From ${country.subregion} to the wider map of ${country.region}, ${country.name} keeps a distinctive sense of place.`,
  ]
  const middles = [
    `Travelers often start with ${place}, where light, weather, and terrain do most of the talking.`,
    `${place} is a natural doorway into the country’s scale — wide enough to feel wild, close enough to notice detail.`,
    `Spend time around ${place}: it captures the textures people remember long after the itinerary fades.`,
    `A stop at ${place} makes the country’s character concrete — color, air, and horizon in one frame.`,
  ]
  const closers = [
    `This Explore page is a quiet field note: a short about, a place worth seeking, and a path into more when you’re ready.`,
    `Use it as a starting point — an about sketch, a beautiful place, and an invitation to look closer.`,
    `Keep this page as a bookmark for mood and orientation before you dig into deeper guides.`,
    `Think of it as a postcard: orientation first, wonder second, plans later.`,
  ]
  const i = hash(country.slug)
  return `${openers[i % openers.length]} ${middles[(i >> 3) % middles.length]} ${closers[(i >> 6) % closers.length]}`
}

const missing = []
const guides = {}

for (const country of countries) {
  const place = PLACE_BY_CODE[country.code]
  if (!place) missing.push(country.code)
  const placeName = place ?? `${country.name} landscape`
  guides[country.slug] = {
    code: country.code,
    name: country.name,
    slug: country.slug,
    region: country.region,
    subregion: country.subregion,
    about: aboutFor(country, placeName),
    place: {
      name: placeName,
      image: imageFor(country),
      alt: `${placeName} in ${country.name}`,
      credit: 'Photo via Unsplash',
    },
  }
}

if (missing.length) {
  console.warn(`Missing PLACE_BY_CODE for: ${missing.join(', ')}`)
}

const out = new URL('../content/country-guides.json', import.meta.url)
writeFileSync(out, `${JSON.stringify(guides, null, 2)}\n`)
console.log(`Wrote ${Object.keys(guides).length} country guides → content/country-guides.json`)
