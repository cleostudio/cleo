/** Oceans topic — evergreen field-guide records for ocean basins and major seas. */

import oceanPhotos from '~/content/ocean-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface OceanFeature {
  name: string
  description: string
}

export interface OceanSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface OceanFacts {
  /** Water class: Ocean, Sea, Gulf. */
  kind: string
  /** Parent basin or World Ocean. */
  basin: string
  /** Human-readable surface area. */
  surfaceArea: string
  /** Mean depth as a durable range or figure. */
  meanDepth: string
  /** Greatest known depth with place name when useful. */
  maxDepth: string
  /** Major bordering coasts / passages (evergreen). */
  bordering: string
}

export interface OceanPhoto extends StaticPhoto {
  nasaId: string
}

export interface OceanSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. PAC, MED). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: OceanFacts
  /** Exactly three notable features. */
  features: [OceanFeature, OceanFeature, OceanFeature]
  sources: OceanSource[]
  photo: OceanPhoto
}

type OceanSubjectDraft = Omit<OceanSubject, 'photo'>

const photoManifest = oceanPhotos as Record<string, OceanPhoto>

function withPhoto(draft: OceanSubjectDraft): OceanSubject {
  const photo = photoManifest[draft.slug]
  if (!photo) {
    throw new Error(`Missing ocean photo for ${draft.slug}`)
  }
  return { ...draft, photo }
}

/**
 * Curated catalog — world ocean overview, five ocean basins, and signature seas.
 * Expand here as new Oceans guides ship.
 */
const oceanSubjectDrafts: OceanSubjectDraft[] = [
  {
    slug: 'world-ocean',
    code: 'WO',
    name: 'World Ocean',
    category: 'World Ocean',
    subtitle: 'Connected global ocean · Earth',
    about:
      'Earth’s salt water is one continuous body wrapped around the continents — a single World Ocean that cartographers divide into named basins for navigation and science. Nearly every shoreline ultimately exchanges water, heat, and dissolved salts through this linked system. Orientation here is structural rather than seasonal: a thin sunlit skin above a vast dark interior, western boundary currents that race poleward, and denser waters that sink and crawl along the abyss. The World Ocean stores most of the planet’s free heat, buffers the atmosphere’s carbon, and sets the tempo for climate on timescales from years to millennia. This primer stays with durable geometry — volume, connectivity, and the basins that name the map — rather than forecasts or shipping headlines.',
    facts: {
      kind: 'Ocean',
      basin: 'World Ocean',
      surfaceArea: '~361 million km²',
      meanDepth: '~3,700 m',
      maxDepth: '~10,900 m (Mariana Trench)',
      bordering: 'All continents and major island arcs',
    },
    features: [
      {
        name: 'One body, many names',
        description:
          'Pacific, Atlantic, Indian, Southern, and Arctic are convenient partitions of a single circulating volume.',
      },
      {
        name: 'Heat and carbon reservoir',
        description:
          'The upper ocean absorbs and redistributes solar energy and dissolved carbon dioxide over long memory timescales.',
      },
      {
        name: 'Abyssal conveyor',
        description:
          'Dense water formed at high latitudes sinks and spreads, linking surface weather to deep circulation.',
      },
    ],
    sources: [
      {
        label: 'NOAA Ocean Facts',
        url: 'https://oceanservice.noaa.gov/facts/',
        kind: 'agency',
      },
      {
        label: 'NASA Ocean World',
        url: 'https://science.nasa.gov/earth/earth-atmosphere/ocean/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'pacific',
    code: 'PAC',
    name: 'Pacific Ocean',
    category: 'Ocean basins',
    subtitle: 'Ocean basin · World Ocean',
    about:
      'The Pacific is the largest ocean basin — a vast plate of water between Asia–Australia and the Americas, ringed by the volcanic and seismic arcs of the Ring of Fire. Its western warm pools feed monsoons; its eastern margins host cold upwelling that supports rich fisheries. Trade winds and the El Niño–Southern Oscillation couple this basin tightly to global weather, yet the durable facts remain scale and depth: more surface area than all land combined, trenches that plunge farther than any mountain rises, and a mid-ocean ridge system that opens new crust. Orientation stays with basin architecture and long-lived currents rather than a single year’s climate anomaly.',
    facts: {
      kind: 'Ocean',
      basin: 'Pacific',
      surfaceArea: '~165 million km²',
      meanDepth: '~4,000 m',
      maxDepth: '~10,900 m (Challenger Deep)',
      bordering: 'Asia, Australia, the Americas, Antarctica',
    },
    features: [
      {
        name: 'Challenger Deep',
        description:
          'The Mariana Trench holds the ocean’s greatest known depth along a Pacific plate boundary.',
      },
      {
        name: 'Equatorial warm pool',
        description:
          'The western tropical Pacific stores exceptional heat that shapes monsoon and ENSO patterns.',
      },
      {
        name: 'Ring of Fire margin',
        description:
          'Subduction zones frame the basin with arcs, trenches, and frequent volcanic islands.',
      },
    ],
    sources: [
      {
        label: 'NOAA Pacific overview',
        url: 'https://oceanservice.noaa.gov/facts/biggestocean.html',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Pacific Ocean',
        url: 'https://www.britannica.com/place/Pacific-Ocean',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'atlantic',
    code: 'ATL',
    name: 'Atlantic Ocean',
    category: 'Ocean basins',
    subtitle: 'Ocean basin · World Ocean',
    about:
      'The Atlantic is the relatively narrow S-shaped basin between the Americas and Europe–Africa, opened by seafloor spreading along the Mid-Atlantic Ridge. Compared with the Pacific it is younger and more elongated, with a strong western boundary current — the Gulf Stream / North Atlantic Current — that carries warm water toward northwest Europe. Cold Labrador and Benguela waters mark the other flanks. Saltier on average than the Pacific, the Atlantic plays an outsized role in the overturning circulation that ventilates the deep ocean. This guide keeps to basin shape, ridge, and durable current geometry.',
    facts: {
      kind: 'Ocean',
      basin: 'Atlantic',
      surfaceArea: '~85 million km²',
      meanDepth: '~3,600 m',
      maxDepth: '~8,400 m (Puerto Rico Trench)',
      bordering: 'Americas, Europe, Africa, Arctic, Southern Ocean',
    },
    features: [
      {
        name: 'Mid-Atlantic Ridge',
        description:
          'A continuous spreading center rises through the basin and hosts volcanic islands such as Iceland and the Azores.',
      },
      {
        name: 'Gulf Stream system',
        description:
          'A swift western boundary current exports subtropical heat toward the northern Atlantic.',
      },
      {
        name: 'Overturning branch',
        description:
          'Dense water formed in Nordic and Labrador seas helps drive the Atlantic Meridional Overturning Circulation.',
      },
    ],
    sources: [
      {
        label: 'NOAA Atlantic facts',
        url: 'https://oceanservice.noaa.gov/facts/atlantic.html',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Atlantic Ocean',
        url: 'https://www.britannica.com/place/Atlantic-Ocean',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'indian',
    code: 'IND',
    name: 'Indian Ocean',
    category: 'Ocean basins',
    subtitle: 'Ocean basin · World Ocean',
    about:
      'The Indian Ocean is the warmest of the major basins, bounded by Africa, Asia, Australia, and the Southern Ocean. Seasonal monsoon winds reverse the northern surface circulation — a rarity among the large oceans — while the Agulhas and Leeuwin currents thread heat around southern Africa and Australia. Mid-ocean ridges meet near the Rodriguez Triple Junction; island chains and plateaus break the abyssal plain. Orientation emphasizes monsoon-coupled flow, tropical warmth, and the enclosed northern geometry that distinguishes this basin from the open Pacific and Atlantic.',
    facts: {
      kind: 'Ocean',
      basin: 'Indian',
      surfaceArea: '~70 million km²',
      meanDepth: '~3,700 m',
      maxDepth: '~7,700 m (Java Trench)',
      bordering: 'Africa, South Asia, Australia, Indonesia, Antarctica',
    },
    features: [
      {
        name: 'Monsoon reversal',
        description:
          'Northern Indian Ocean surface currents reverse with the summer and winter monsoon winds.',
      },
      {
        name: 'Agulhas leakage',
        description:
          'Warm Indian Ocean water rounds southern Africa and intermittently enters the Atlantic.',
      },
      {
        name: 'Ridge triple junction',
        description:
          'Three spreading ridges meet in the central basin, recording the opening of the Indian Ocean.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Indian Ocean',
        url: 'https://www.britannica.com/place/Indian-Ocean',
        kind: 'reference',
      },
      {
        label: 'NOAA Ocean Exploration',
        url: 'https://oceanexplorer.noaa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'southern',
    code: 'SO',
    name: 'Southern Ocean',
    category: 'Ocean basins',
    subtitle: 'Ocean basin · World Ocean',
    about:
      'The Southern Ocean girds Antarctica as a continuous band of cold water, defined oceanographically by the Antarctic Circumpolar Current rather than by land barriers alone. It is the only ocean that completely encircles the globe, linking Pacific, Atlantic, and Indian basins at high latitude. Persistent westerlies drive the circumpolar current; seasonal sea ice advances and retreats over a vast fringe. Dense water formed near Antarctic shelves sinks and ventilates much of the global abyss. This primer treats the Southern Ocean as a climatic hinge — cold, windy, and connective — not as a calendar of ice extent for a single year.',
    facts: {
      kind: 'Ocean',
      basin: 'Southern',
      surfaceArea: '~20 million km²',
      meanDepth: '~4,000 m',
      maxDepth: '~7,200 m (South Sandwich Trench)',
      bordering: 'Antarctica; open to Pacific, Atlantic, and Indian',
    },
    features: [
      {
        name: 'Antarctic Circumpolar Current',
        description:
          'The strongest large-scale current on Earth flows eastward without continental interruption.',
      },
      {
        name: 'Seasonal ice fringe',
        description:
          'Sea ice grows and melts around Antarctica, altering albedo and upper-ocean mixing each year.',
      },
      {
        name: 'Abyssal ventilation',
        description:
          'Cold, dense shelf waters descend and help renew deep layers of the World Ocean.',
      },
    ],
    sources: [
      {
        label: 'NOAA — Southern Ocean',
        url: 'https://oceanservice.noaa.gov/facts/southern.html',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Southern Ocean',
        url: 'https://www.britannica.com/place/Southern-Ocean',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'arctic',
    code: 'ARC',
    name: 'Arctic Ocean',
    category: 'Ocean basins',
    subtitle: 'Ocean basin · World Ocean',
    about:
      'The Arctic Ocean is the smallest and shallowest of the five named oceans — a polar Mediterranean almost enclosed by Eurasia and North America, with limited exchange through Fram Strait, the Barents Sea, and the Bering Strait. Pack ice has long covered much of its surface for part or all of the year; freshwater from great rivers freshens the upper layers. Beneath the ice, Atlantic and Pacific inflows meet and transform. Orientation here stresses enclosure, ice cover as a structural feature, and the shallow shelves that dominate the basin’s margins rather than any single summer’s ice minimum.',
    facts: {
      kind: 'Ocean',
      basin: 'Arctic',
      surfaceArea: '~14 million km²',
      meanDepth: '~1,200 m',
      maxDepth: '~5,500 m (Molloy Deep)',
      bordering: 'Eurasia, North America, Greenland; Bering & Fram straits',
    },
    features: [
      {
        name: 'Nearly enclosed basin',
        description:
          'Narrow gateways control exchange with the Atlantic and Pacific, shaping salinity and heat.',
      },
      {
        name: 'River-freshened lids',
        description:
          'Large Siberian and Canadian rivers deliver freshwater that stratifies the upper Arctic.',
      },
      {
        name: 'Transpolar drift',
        description:
          'Ice and surface water generally move from the Siberian shelves toward Fram Strait.',
      },
    ],
    sources: [
      {
        label: 'NOAA Arctic theme page',
        url: 'https://www.arctic.noaa.gov/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Arctic Ocean',
        url: 'https://www.britannica.com/place/Arctic-Ocean',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mediterranean',
    code: 'MED',
    name: 'Mediterranean Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Atlantic system',
    about:
      'The Mediterranean is a nearly landlocked sea between Europe, Africa, and Asia Minor, exchanging water with the Atlantic only through the Strait of Gibraltar. High evaporation makes it saltier than the open ocean; dense water formed in winter sinks and exits Gibraltar as a deep outflow while fresher Atlantic water enters at the surface. Ancient navigation routes, island arcs, and narrow straits give the basin a human history as dense as its hydrography. This guide stays with salinity, exchange, and the sea’s compartmentalized basins — Western, Eastern, and Adriatic — rather than port politics.',
    facts: {
      kind: 'Sea',
      basin: 'Atlantic (semi-enclosed)',
      surfaceArea: '~2.5 million km²',
      meanDepth: '~1,500 m',
      maxDepth: '~5,300 m (Calypso Deep)',
      bordering: 'Southern Europe, North Africa, Levant; Gibraltar gateway',
    },
    features: [
      {
        name: 'Gibraltar exchange',
        description:
          'A two-layer exchange exports salty Mediterranean water and imports Atlantic surface water.',
      },
      {
        name: 'Evaporative concentration',
        description:
          'Net freshwater loss raises salinity above typical open-ocean values.',
      },
      {
        name: 'Compartmental basins',
        description:
          'Sills and straits divide Western, Eastern, Adriatic, and Aegean waters with distinct characters.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mediterranean Sea',
        url: 'https://www.britannica.com/place/Mediterranean-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA Ocean Service',
        url: 'https://oceanservice.noaa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'caribbean',
    code: 'CAR',
    name: 'Caribbean Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Atlantic system',
    about:
      'The Caribbean Sea is a tropical American mediterranean bounded by the Antilles arc, Central America, and northern South America. Warm, clear waters overlie deep basins; coral reefs fringe many islands and mainland shelves. Atlantic water enters through passages in the Lesser Antilles and exits toward the Gulf of Mexico and Florida Current, feeding the greater Atlantic western boundary system. Hurricanes cross the basin seasonally, but the durable primer concerns island-arc geometry, reef shelves, and the sea’s role as a warm-water antechamber to the Gulf Stream.',
    facts: {
      kind: 'Sea',
      basin: 'Atlantic',
      surfaceArea: '~2.8 million km²',
      meanDepth: '~2,200 m',
      maxDepth: '~7,700 m (Cayman Trench)',
      bordering: 'Antilles, Central America, northern South America',
    },
    features: [
      {
        name: 'Antillean arc',
        description:
          'Volcanic and limestone islands frame the sea and control Atlantic inflows through narrow passages.',
      },
      {
        name: 'Reef shelves',
        description:
          'Coral systems fringe many coasts, building biological structure on tropical carbonate platforms.',
      },
      {
        name: 'Gateway to the Gulf Stream',
        description:
          'Caribbean and Yucatán throughflow supply warm water to the Florida Current.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Caribbean Sea',
        url: 'https://www.britannica.com/place/Caribbean-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA Coral Reef Conservation',
        url: 'https://coralreef.noaa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'red-sea',
    code: 'RED',
    name: 'Red Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Indian Ocean system',
    about:
      'The Red Sea is a young ocean basin in the making — a narrow rift between Africa and Arabia filled with warm, highly saline water. Spreading along its axis continues; coral reefs thrive along both shores despite the high salt content. Connection to the Indian Ocean is through the Bab el-Mandeb; the Suez Canal provides an artificial Atlantic–Mediterranean link. Hot brines occupy some deeps. Orientation stresses rifting, salinity, and the sea’s role as a tropical corridor rather than canal traffic statistics.',
    facts: {
      kind: 'Sea',
      basin: 'Indian (rift basin)',
      surfaceArea: '~440,000 km²',
      meanDepth: '~500 m',
      maxDepth: '~3,000 m',
      bordering: 'Egypt, Sudan, Eritrea, Djibouti, Saudi Arabia, Yemen, Israel, Jordan',
    },
    features: [
      {
        name: 'Active rift',
        description:
          'Seafloor spreading continues along the Red Sea axis as Arabia and Africa diverge.',
      },
      {
        name: 'High salinity',
        description:
          'Strong evaporation and limited exchange keep salt concentrations above open-ocean norms.',
      },
      {
        name: 'Reef corridors',
        description:
          'Extensive fringing reefs line both coasts despite warm, salty conditions.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Red Sea',
        url: 'https://www.britannica.com/place/Red-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory',
        url: 'https://earthobservatory.nasa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'baltic',
    code: 'BAL',
    name: 'Baltic Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Atlantic system',
    about:
      'The Baltic is a large brackish inland sea of northern Europe, almost enclosed and fed by many rivers. Salinity declines from the Danish straits toward the northern gulfs; winter ice regularly covers large areas. Stratification can isolate deep basins and limit oxygen renewal — a durable hydrographic trait of this shallow, silled system. Orientation focuses on brackish gradients, ice, and limited exchange with the North Sea rather than any single algal bloom season.',
    facts: {
      kind: 'Sea',
      basin: 'Atlantic (brackish)',
      surfaceArea: '~377,000 km²',
      meanDepth: '~55 m',
      maxDepth: '~460 m',
      bordering: 'Sweden, Finland, Russia, Baltics, Poland, Germany, Denmark',
    },
    features: [
      {
        name: 'Brackish gradient',
        description:
          'River input and narrow Danish outlets create a salinity decline from south-west to north-east.',
      },
      {
        name: 'Winter ice cover',
        description:
          'Seasonal ice is a normal structural feature of the northern and eastern basins.',
      },
      {
        name: 'Silled deep basins',
        description:
          'Shallow sills restrict deep-water renewal and can leave isolated bottom layers oxygen-poor.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Baltic Sea',
        url: 'https://www.britannica.com/place/Baltic-Sea',
        kind: 'reference',
      },
      {
        label: 'HELCOM',
        url: 'https://helcom.fi/',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'bering',
    code: 'BER',
    name: 'Bering Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Pacific / Arctic gateway',
    about:
      'The Bering Sea lies between Alaska and Russia’s Far East, separated from the Pacific by the Aleutian arc and linked to the Arctic Ocean by the shallow Bering Strait. Broad continental shelves host productive fisheries; deep basins occupy the south-west. Sea ice advances from the north in winter. Pacific water crossing the strait is a key freshwater and heat pathway into the Arctic. This primer keeps to gateway geography, shelves, and ice rather than seasonal catch reports.',
    facts: {
      kind: 'Sea',
      basin: 'Pacific',
      surfaceArea: '~2.3 million km²',
      meanDepth: '~1,500 m',
      maxDepth: '~4,100 m',
      bordering: 'Alaska, Russian Far East; Aleutians & Bering Strait',
    },
    features: [
      {
        name: 'Arctic gateway',
        description:
          'The narrow, shallow Bering Strait is the only oceanic link between Pacific and Arctic waters.',
      },
      {
        name: 'Broad shelves',
        description:
          'Extensive continental shelves support high biological productivity along both coasts.',
      },
      {
        name: 'Aleutian boundary',
        description:
          'The island arc separates the Bering Sea from the open North Pacific.',
      },
    ],
    sources: [
      {
        label: 'NOAA Bering Sea',
        url: 'https://www.fisheries.noaa.gov/region/alaska',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Bering Sea',
        url: 'https://www.britannica.com/place/Bering-Sea',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'south-china-sea',
    code: 'SCS',
    name: 'South China Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Pacific system',
    about:
      'The South China Sea is a semi-enclosed western Pacific basin rimmed by China, Taiwan, the Philippines, Borneo, and mainland Southeast Asia. Monsoon winds reverse surface circulation; internal waves and strong tidal mixing sculpt the upper ocean. Coral atolls and shoals rise from deep basins. Orientation here is physical geography — monsoon-driven flow, basin enclosure, and tropical shelves — without entering maritime boundary disputes.',
    facts: {
      kind: 'Sea',
      basin: 'Pacific',
      surfaceArea: '~3.5 million km²',
      meanDepth: '~1,200 m',
      maxDepth: '~5,500 m',
      bordering: 'China, Taiwan, Philippines, Malaysia, Brunei, Indonesia, Vietnam',
    },
    features: [
      {
        name: 'Monsoon circulation',
        description:
          'Seasonal wind reversals reorganize surface currents across the semi-enclosed basin.',
      },
      {
        name: 'Internal waves',
        description:
          'Large internal waves generated at sills and shelves are among the strongest observed at sea.',
      },
      {
        name: 'Shoals over deep water',
        description:
          'Atolls and banks rise abruptly from deep basins along tectonic and carbonate structures.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — South China Sea',
        url: 'https://www.britannica.com/place/South-China-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory',
        url: 'https://earthobservatory.nasa.gov/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'gulf-of-mexico',
    code: 'GOM',
    name: 'Gulf of Mexico',
    category: 'Seas & gulfs',
    subtitle: 'Gulf · Atlantic system',
    about:
      'The Gulf of Mexico is a semi-enclosed Atlantic basin partly ringed by the United States, Mexico, and Cuba. The Loop Current enters through the Yucatán Channel, sheds warm eddies, and exits via the Florida Straits to feed the Gulf Stream. Broad shelves, a deep abyssal plain, and the Mississippi River plume structure its upper waters. Orientation emphasizes Loop Current geometry and shelf–basin contrast rather than any single storm season.',
    facts: {
      kind: 'Gulf',
      basin: 'Atlantic',
      surfaceArea: '~1.6 million km²',
      meanDepth: '~1,600 m',
      maxDepth: '~4,400 m (Sigsbee Deep)',
      bordering: 'United States, Mexico, Cuba; Yucatán & Florida straits',
    },
    features: [
      {
        name: 'Loop Current',
        description:
          'A swift Atlantic inflow loops through the gulf and exits to become the Florida Current.',
      },
      {
        name: 'Mississippi plume',
        description:
          'River discharge delivers freshwater and sediment that mark the northern shelf.',
      },
      {
        name: 'Sigsbee abyssal plain',
        description:
          'A broad deep plain occupies the gulf’s interior beyond the continental shelves.',
      },
    ],
    sources: [
      {
        label: 'NOAA Ocean Service',
        url: 'https://oceanservice.noaa.gov/',
        kind: 'agency',
      },
      {
        label: 'Encyclopaedia Britannica — Gulf of Mexico',
        url: 'https://www.britannica.com/place/Gulf-of-Mexico',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'coral-sea',
    code: 'COR',
    name: 'Coral Sea',
    category: 'Seas & gulfs',
    subtitle: 'Sea · Pacific system',
    about:
      'The Coral Sea lies off northeastern Australia, framed by the Great Barrier Reef, New Guinea, and Vanuatu. Warm tropical waters, reef complexes, and deep basins coexist; the South Equatorial Current feeds western boundary flow along Australia. Cyclones can cross the region, but the durable field-guide facts are reef geometry, Coral Sea Basin depths, and the sea’s place on the southwest Pacific margin.',
    facts: {
      kind: 'Sea',
      basin: 'Pacific',
      surfaceArea: '~4.8 million km²',
      meanDepth: '~2,400 m',
      maxDepth: '~9,100 m (South Solomon Trench approaches)',
      bordering: 'Australia, Papua New Guinea, Solomon Islands, Vanuatu, New Caledonia',
    },
    features: [
      {
        name: 'Great Barrier Reef margin',
        description:
          'The world’s largest coral reef system faces the Coral Sea along Australia’s northeast shelf.',
      },
      {
        name: 'Deep Coral Sea Basin',
        description:
          'Abyssal depths sit immediately seaward of shallow reef platforms.',
      },
      {
        name: 'Southwest Pacific gateway',
        description:
          'Equatorial and trade-wind driven flows link the sea to the broader South Pacific circulation.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Coral Sea',
        url: 'https://www.britannica.com/place/Coral-Sea',
        kind: 'reference',
      },
      {
        label: 'Great Barrier Reef Marine Park Authority',
        url: 'https://www.gbrmpa.gov.au/',
        kind: 'agency',
      },
    ],
  },
]

export const oceanSubjects: OceanSubject[] =
  oceanSubjectDrafts.map(withPhoto)

export function oceanSubjectSlugs(): string[] {
  return oceanSubjects.map((subject) => subject.slug)
}

export function getOceanSubject(slug: string): OceanSubject | undefined {
  return oceanSubjects.find((subject) => subject.slug === slug)
}

/** Preserve catalog order while grouping by category. */
export function oceanSubjectsByCategory(): [string, OceanSubject[]][] {
  const groups = new Map<string, OceanSubject[]>()
  for (const subject of oceanSubjects) {
    const list = groups.get(subject.category) ?? []
    list.push(subject)
    groups.set(subject.category, list)
  }
  return [...groups.entries()]
}

export function oceanDescription(subject: OceanSubject): string {
  return subject.about.replace(/\s+/g, ' ').trim()
}
