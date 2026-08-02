/** Rivers topic — evergreen field-guide records for world rivers. */

import riversPhotos from '~/content/rivers-photos.json'
import type { StaticPhoto } from '~/lib/static-photo'

export interface RiverFeature {
  name: string
  description: string
}

export interface RiverSource {
  label: string
  url: string
  kind: 'agency' | 'reference' | 'catalog'
}

export interface RiverFacts {
  /** Broad type: Continental river, Inland river system, etc. */
  kind: string
  /** Source → mouth / length in plain language. */
  course: string
  /** Geographic setting in plain language. */
  region: string
  /** Drainage basin, major tributaries, catchment note. */
  basin: string
  /** Regime, flood pulse, discharge character. */
  hydrology: string
  /** Climate, sediment, or ecology role. */
  climateRole: string
  /** Modern Explore countries on the course (exact catalog names). */
  exploreLinks: string[]
}

export interface RiverPhoto extends StaticPhoto {
  commonsTitle: string
}

export interface RiverSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. NIL, AMZ). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: RiverFacts
  /** Exactly three notable sites / features. */
  features: [RiverFeature, RiverFeature, RiverFeature]
  sources: RiverSource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [RiverPhoto, RiverPhoto, RiverPhoto]
}

type RiverSubjectDraft = Omit<RiverSubject, 'photos'>

const photoManifest = riversPhotos as Record<string, RiverPhoto[]>

function withPhotos(draft: RiverSubjectDraft): RiverSubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three river photos for ${draft.slug}`)
  }
  return {
    ...draft,
    photos: photos as [RiverPhoto, RiverPhoto, RiverPhoto],
  }
}

/**
 * Curated catalog — major rivers across Africa, Asia, and Europe & Americas.
 * Expand here as new Rivers guides ship.
 */
const riverSubjectDrafts: RiverSubjectDraft[] = [
  {
    slug: 'nile',
    code: 'NIL',
    name: 'Nile',
    category: 'Africa',
    subtitle: 'Desert corridor · White & Blue Nile',
    about:
      'The Nile is a long desert-edge river whose White and Blue branches meet in Sudan before the main stem runs north through Egypt to a Mediterranean delta. Orientation is hydraulic and civilizational: cataracts and floodplains that once timed the agricultural year; highland Ethiopian runoff that still pulses the Blue Nile; and a lower valley where cities and irrigation squeeze a green ribbon through arid land. Dams and barrages remade the flood regime, but the river remains the structural spine of northeast African settlement. This primer stays with course, confluence, and corridor geography rather than every pharaonic reign.',
    facts: {
      kind: 'Continental river',
      course: 'East African sources → Sudan confluence → Egyptian valley → Mediterranean delta',
      region: 'Northeast Africa · Nile Valley',
      basin: 'White Nile and Blue Nile systems; vast catchment across multiple highland and wetland sources',
      hydrology: 'Seasonal Blue Nile flood pulse historically; now regulated by major dams and reservoirs',
      climateRole: 'Desert-edge water artery; sediment and floodplain fertility engine',
      exploreLinks: ['Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Uganda'],
    },
    features: [
      {
        name: 'Nile at Luxor',
        description:
          'The river corridor through Upper Egypt — a working floodplain and navigation spine beside temple cities.',
      },
      {
        name: 'Blue Nile Falls',
        description:
          'A highland cascade near Lake Tana — a visible pulse point on the Ethiopian Blue Nile branch.',
      },
      {
        name: 'Nile from orbit',
        description:
          'The green valley and Sinai approaches from space — desert geometry that makes the river’s corridor unmistakable.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Nile River',
        url: 'https://www.britannica.com/place/Nile-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Nile',
        url: 'https://earthobservatory.nasa.gov/world-of-change/Nile',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Nubian Monuments from Abu Simbel to Philae',
        url: 'https://whc.unesco.org/en/list/88',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'congo',
    code: 'CNG',
    name: 'Congo River',
    category: 'Africa',
    subtitle: 'Rainforest discharge · Atlantic outlet',
    about:
      'The Congo River is Central Africa’s great rainforest drainage — a high-discharge system that gathers water from a vast equatorial basin before cutting toward the Atlantic through rapids and narrows. Orientation is volume and barrier: Pool Malebo’s twin-capital hinge at Kinshasa and Brazzaville; Livingstone Falls and related cataracts that block continuous navigation to the sea; and hydropower sites such as Inga that treat the lower river as a continental energy corridor. The basin’s forests and wetlands store carbon and biodiversity at planetary scale. This primer stays with course structure, navigation breaks, and basin hydrology rather than every tributary name.',
    facts: {
      kind: 'Continental river',
      course: 'East-central African sources → Congo Basin → Pool Malebo → lower cataracts → Atlantic',
      region: 'Central Africa · Congo Basin',
      basin: 'Second-largest tropical drainage by discharge; dense tributary network under equatorial forest',
      hydrology: 'Relatively steady equatorial regime with huge mean discharge; cataracts interrupt the lower stem',
      climateRole: 'Rainforest moisture and carbon reservoir; Atlantic freshwater and sediment pulse',
      exploreLinks: [
        'Congo, Democratic Republic of the',
        'Congo',
        'Angola',
        'Zambia',
        'Central African Republic',
      ],
    },
    features: [
      {
        name: 'Congo at Kinshasa',
        description:
          'The working urban riverfront on Pool Malebo’s south bank — where the basin’s commerce concentrates.',
      },
      {
        name: 'Inga Dam',
        description:
          'Hydropower on the lower Congo — a modern hinge where cataracts become continental electricity.',
      },
      {
        name: 'Pool Malebo reach',
        description:
          'The broad pool that stages Kinshasa and Brazzaville facing each other across the international channel.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Congo River',
        url: 'https://www.britannica.com/place/Congo-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Congo Basin',
        url: 'https://earthobservatory.nasa.gov/images/146738/mapping-the-congo-basin',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Salonga National Park',
        url: 'https://whc.unesco.org/en/list/280',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'yangtze',
    code: 'YTZ',
    name: 'Yangtze',
    category: 'Asia',
    subtitle: 'China’s main stem · gorge to delta',
    about:
      'The Yangtze (Chang Jiang) is China’s longest river — a west-to-east main stem from Tibetan Plateau headwaters through deep gorges and industrial cities to a East China Sea delta. Orientation is gorge, dam, and megacity: Qutang and neighboring gorges that squeeze the middle course; the Three Gorges Dam as a modern hydraulic hinge; and lower-basin cities that treat the river as transport, water supply, and flood risk at once. This primer stays with course structure and hydraulic control rather than every provincial reach.',
    facts: {
      kind: 'Continental river',
      course: 'Qinghai–Tibet headwaters → Three Gorges → middle–lower plains → East China Sea',
      region: 'Central China · Chang Jiang basin',
      basin: 'China’s largest river basin; major tributaries feed a densely settled floodplain corridor',
      hydrology: 'Monsoon-influenced floods; large reservoirs now regulate much of the middle course',
      climateRole: 'Primary freshwater and sediment artery for eastern China’s agricultural and urban core',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Qutang Gorge',
        description:
          'The shortest and steepest of the Three Gorges — a classic narrows where cliffs force the Yangtze into a single dramatic channel.',
      },
      {
        name: 'Three Gorges Dam',
        description:
          'A modern concrete hinge on the middle Yangtze — power, navigation, and flood control at continental scale.',
      },
      {
        name: 'Yangtze at Chongqing',
        description:
          'The mountain city where the Jialing meets the Yangtze — a hinge between upper gorges and the regulated middle basin.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Yangtze River',
        url: 'https://www.britannica.com/place/Yangtze-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Three Gorges',
        url: 'https://earthobservatory.nasa.gov/images/147371/three-gorges-dam',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Three Gorges Dam, China',
        url: 'https://earthobservatory.nasa.gov/images/77572/three-gorges-dam-china',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'ganges',
    code: 'GNG',
    name: 'Ganges',
    category: 'Asia',
    subtitle: 'Sacred plain · Bay of Bengal delta',
    about:
      'The Ganges is the great river of the northern Indian plain — rising in the Himalaya and running southeast across a densely farmed corridor before joining the Brahmaputra system in a vast Bay of Bengal delta. Orientation is pilgrimage and floodplain: ghats and temples that treat the water as sacred geography; a monsoon flood pulse that still remakes embankments and sandbars; and a delta shared with Bangladesh where channels braid into one of Earth’s largest wetland mosaics. This primer stays with course, plain, and delta rather than every ritual calendar.',
    facts: {
      kind: 'Continental river',
      course: 'Himalayan sources → Indo-Gangetic Plain → Bengal delta → Bay of Bengal',
      region: 'South Asia · Ganges–Brahmaputra system',
      basin: 'Major Himalayan-fed drainage shared across India and Bangladesh with dense tributary networks',
      hydrology: 'Strong monsoon flood pulse; snow and glacier melt contribute to the upper regime',
      climateRole: 'Agricultural water spine of the northern plain; delta sediment and cyclone-exposed wetlands',
      exploreLinks: ['India', 'Bangladesh', 'Nepal'],
    },
    features: [
      {
        name: 'Ganges at Varanasi',
        description:
          'The classic ghat waterfront — steps, boats, and temples that stage the river as sacred urban geography.',
      },
      {
        name: 'Varanasi boats',
        description:
          'Working and pilgrimage craft on the evening river — daily traffic that keeps the waterfront alive.',
      },
      {
        name: 'Ganges Delta',
        description:
          'The Bay of Bengal outlet’s channel maze — sediment, mangroves, and shared India–Bangladesh hydrology.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ganges River',
        url: 'https://www.britannica.com/place/Ganges-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Ganges River Delta',
        url: 'https://earthobservatory.nasa.gov/images/147255/ganges-river-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — The Sundarbans',
        url: 'https://whc.unesco.org/en/list/798',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mekong',
    code: 'MEK',
    name: 'Mekong',
    category: 'Asia',
    subtitle: 'Mainland Southeast Asia · monsoon pulse',
    about:
      'The Mekong is Mainland Southeast Asia’s great north–south river — rising on the Tibetan Plateau and threading China, Myanmar, Laos, Thailand, Cambodia, and Vietnam before fanning into a fertile delta. Orientation is monsoon and livelihood: gorge and sandbar reaches of the upper and middle course; the Tonlé Sap’s seasonal flood pulse that reverses into Cambodia’s great lake; and a Vietnamese delta of canals, orchards, and rice. Dams and irrigation are remaking the sediment budget. This primer stays with corridor geography and flood-pulse ecology rather than every border dispute.',
    facts: {
      kind: 'Continental river',
      course: 'Tibetan Plateau sources → mainland Southeast Asian corridor → Mekong Delta → South China Sea',
      region: 'Mainland Southeast Asia',
      basin: 'Multinational basin; Tonlé Sap as a major seasonal storage and fishery hinge',
      hydrology: 'Monsoon flood pulse; Tonlé Sap flow reversal; increasing reservoir regulation upstream',
      climateRole: 'Rice-bowl freshwater and sediment engine; wetland and fishery backbone of the lower basin',
      exploreLinks: ['China', 'Myanmar', 'Laos', 'Thailand', 'Cambodia', 'Vietnam'],
    },
    features: [
      {
        name: 'Mekong at Luang Prabang',
        description:
          'The middle-course waterfront under limestone hills — boats and banks that stage the Lao corridor.',
      },
      {
        name: 'Tonlé Sap',
        description:
          'Cambodia’s great lake and flood pulse — a seasonal reservoir that expands and contracts with the Mekong.',
      },
      {
        name: 'Mekong Delta',
        description:
          'Vietnam’s canal-and-orchard outlet — where the river fragments into distributaries toward the sea.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mekong River',
        url: 'https://www.britannica.com/place/Mekong-River',
        kind: 'reference',
      },
      {
        label: 'MRC — Mekong River Commission',
        url: 'https://www.mrcmekong.org/',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Town of Luang Prabang',
        url: 'https://whc.unesco.org/en/list/479',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'yellow-river',
    code: 'YLW',
    name: 'Yellow River',
    category: 'Asia',
    subtitle: 'Loess sediment · North China plain',
    about:
      'The Yellow River (Huang He) is northern China’s iconic sediment-laden river — rising on the Tibetan Plateau and swinging across the Loess Plateau before crossing the North China Plain to a Bohai Sea delta. Orientation is silt and risk: Hukou’s compressed waterfall reach; a plain historically raised by levees above surrounding farmland; and a delta that builds and shifts as sediment supply and coastal processes trade places. The river’s nickname comes from the yellow loess load that still colors the water. This primer stays with course, sediment, and plain geography rather than every dynastic flood story.',
    facts: {
      kind: 'Continental river',
      course: 'Qinghai–Tibet headwaters → Loess Plateau → North China Plain → Bohai Sea delta',
      region: 'Northern China · Huang He basin',
      basin: 'Major northern Chinese drainage; extreme sediment load from loess landscapes',
      hydrology: 'Seasonal floods and droughts; heavy engineering for levees, reservoirs, and diversion',
      climateRole: 'Sediment conveyor that built and threatens the North China Plain; delta land-building engine',
      exploreLinks: ['China'],
    },
    features: [
      {
        name: 'Hukou Waterfall',
        description:
          'Where the Yellow River compresses through a stone gate — a loud, sediment-yellow cascade on the middle course.',
      },
      {
        name: 'Yellow River at Lanzhou',
        description:
          'An upper–middle urban reach — bridges and embankments where the loess-colored river meets a major city.',
      },
      {
        name: 'Yellow River Delta',
        description:
          'The Bohai outlet’s growing and shifting wetland — sediment geometry visible from above.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Yellow River',
        url: 'https://www.britannica.com/place/Yellow-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Yellow River Delta',
        url: 'https://earthobservatory.nasa.gov/images/147372/building-up-the-yellow-river-delta',
        kind: 'agency',
      },
      {
        label: 'UNESCO — The Grand Canal',
        url: 'https://whc.unesco.org/en/list/1443',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'danube',
    code: 'DAN',
    name: 'Danube',
    category: 'Europe & Americas',
    subtitle: 'European corridor · Black Sea delta',
    about:
      'The Danube is Central and Southeastern Europe’s great west-to-east river — rising in Germany and crossing or bordering many states before forming a Black Sea delta. Orientation is corridor and choke point: capital cities that face the water, the Iron Gates gorge on the Serbia–Romania border, and a delta that fans into wetlands and channels. For centuries it linked Alpine, Pannonian, and Balkan worlds by barge and treaty. This primer stays with course geography, gorge, and delta rather than every capital’s riverfront story.',
    facts: {
      kind: 'Continental river',
      course: 'Black Forest sources → Central European corridor → Iron Gates → Black Sea delta',
      region: 'Central & Southeastern Europe',
      basin: 'Second-largest European river basin; multinational main stem and tributaries',
      hydrology: 'Alpine and lowland flood regimes; heavily engineered locks and hydropower reaches',
      climateRole: 'Transcontinental freshwater corridor; delta wetlands of continental conservation importance',
      exploreLinks: ['Germany', 'Austria', 'Slovakia', 'Hungary', 'Romania'],
    },
    features: [
      {
        name: 'Danube at Budapest',
        description:
          'The river as urban spine — bridges and embankments that stage one of Europe’s classic capital waterfronts.',
      },
      {
        name: 'Iron Gates',
        description:
          'The gorge where the Danube cuts the Carpathians — a historic navigation choke point now paired with hydropower.',
      },
      {
        name: 'Danube Delta',
        description:
          'The Black Sea outlet’s wetland labyrinth — channels, lakes, and reed beds at the end of the European corridor.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Danube River',
        url: 'https://www.britannica.com/place/Danube-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Danube Delta',
        url: 'https://whc.unesco.org/en/list/588',
        kind: 'catalog',
      },
      {
        label: 'ICPDR — Danube River Basin',
        url: 'https://www.icpdr.org/danube-basin',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'rhine',
    code: 'RHN',
    name: 'Rhine',
    category: 'Europe & Americas',
    subtitle: 'Alpine source · industrial corridor',
    about:
      'The Rhine is Western Europe’s classic north-flowing working river — rising in the Alps, tumbling over the Rhine Falls, cutting the romantic Middle Rhine gorge, and running through industrial and port landscapes toward the North Sea. Orientation is trade and gorge: Loreley cliffs that squeeze barge traffic into a scenic choke point; Cologne and other cities that face the water as civic frontage; and a deltaic Dutch outlet engineered for flood control and shipping. This primer stays with course geography and corridor commerce rather than every wine-slope legend.',
    facts: {
      kind: 'Continental river',
      course: 'Alpine sources → Rhine Falls → Upper/Middle Rhine → Lower Rhine → North Sea delta',
      region: 'Western Europe · Rhine corridor',
      basin: 'Major Central European drainage shared across Alpine and lowland states',
      hydrology: 'Alpine melt and rainfall regime; dense locks, canals, and flood defenses on the lower course',
      climateRole: 'Industrial and agricultural freshwater artery; North Sea sediment and flood-risk hinge',
      exploreLinks: [
        'Switzerland',
        'Liechtenstein',
        'Austria',
        'Germany',
        'France',
        'Netherlands',
      ],
    },
    features: [
      {
        name: 'Loreley',
        description:
          'The Middle Rhine slate cliff — a navigation narrows that became Europe’s emblematic river gorge.',
      },
      {
        name: 'Rhine Falls',
        description:
          'Europe’s powerful lowland waterfall near Schaffhausen — where the upper Rhine drops in a broad curtain.',
      },
      {
        name: 'Rhine at Cologne',
        description:
          'Cathedral, bridges, and embankments on the lower corridor — the river as a German civic waterfront.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Rhine River',
        url: 'https://www.britannica.com/place/Rhine-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Upper Middle Rhine Valley',
        url: 'https://whc.unesco.org/en/list/1066',
        kind: 'catalog',
      },
      {
        label: 'ICPR — International Commission for the Protection of the Rhine',
        url: 'https://www.iksr.org/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'volga',
    code: 'VLG',
    name: 'Volga',
    category: 'Europe & Americas',
    subtitle: 'European Russia · Caspian delta',
    about:
      'The Volga is Europe’s longest river — a vast north-to-south drainage across European Russia that ends in a branching Caspian Sea delta. Orientation is reservoir and steppe: cascade dams that turned much of the middle Volga into linked lakes; historic cities such as Nizhny Novgorod at major confluences; and a delta wetland that fans into the Caspian’s northern shallows. For centuries the river linked forest, steppe, and Caspian trade worlds. This primer stays with course, reservoirs, and delta geography rather than every regional capital.',
    facts: {
      kind: 'Continental river',
      course: 'Valdai Hills sources → reservoir cascade → lower steppe reach → Caspian delta',
      region: 'European Russia · Volga basin',
      basin: 'Europe’s largest river basin by length of main stem; dense tributary network across the plain',
      hydrology: 'Snowmelt floods historically; now heavily regulated by large reservoirs and locks',
      climateRole: 'Interior freshwater corridor; Caspian sediment and wetland ecology at the outlet',
      exploreLinks: ['Russia'],
    },
    features: [
      {
        name: 'Volga at Nizhny Novgorod',
        description:
          'The Oka–Volga confluence city — a historic hinge where forest-zone trade met the great southbound stem.',
      },
      {
        name: 'Volga mainstream',
        description:
          'Broad reservoir-era reaches of the middle river — working water that reads as inland sea as much as channel.',
      },
      {
        name: 'Volga Delta',
        description:
          'The Caspian outlet’s branching wetland — channels and islands at the end of Europe’s longest river.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Volga River',
        url: 'https://www.britannica.com/place/Volga-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Volga Delta',
        url: 'https://earthobservatory.nasa.gov/images/9203/volga-delta-russia',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Bolgar Historical and Archaeological Complex',
        url: 'https://whc.unesco.org/en/list/981',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'amazon',
    code: 'AMZ',
    name: 'Amazon',
    category: 'Europe & Americas',
    subtitle: 'Rainforest basin · Atlantic discharge',
    about:
      'The Amazon is a continental rainforest river whose main stem and tributaries drain a vast South American lowland into the Atlantic. Orientation is volume and canopy: blackwater and whitewater confluences, seasonal floodplains (várzea), and a mouth so wide that freshwater influence reaches far offshore. The basin stores carbon and biodiversity at planetary scale; navigation and cities such as Manaus sit inside a still-working fluvial wilderness. This primer stays with mainstream, mouth, and basin hydrology rather than every tributary name.',
    facts: {
      kind: 'Continental river',
      course: 'Andean and shield sources → Amazonian lowland → Atlantic mouth',
      region: 'Amazon Basin · northern South America',
      basin: 'World’s largest drainage by discharge; dense tributary network across multiple countries',
      hydrology: 'Seasonal flood pulse across várzea and igapó; enormous mean discharge into the Atlantic',
      climateRole: 'Rainforest moisture recycling; global carbon and biodiversity reservoir',
      exploreLinks: ['Brazil', 'Peru', 'Colombia', 'Bolivia', 'Ecuador'],
    },
    features: [
      {
        name: 'Amazon mainstream',
        description:
          'The broad lowland channel under continuous forest — the working artery of the basin’s interior.',
      },
      {
        name: 'Amazon mouth',
        description:
          'The Atlantic outlet and sediment plume — where continental freshwater meets the open ocean.',
      },
      {
        name: 'Amazon from orbit',
        description:
          'Satellite-scale meanders and floodplain mosaics — the basin’s geometry visible as one system.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Amazon River',
        url: 'https://www.britannica.com/place/Amazon-River',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Amazon',
        url: 'https://earthobservatory.nasa.gov/world-of-change/Amazon',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Central Amazon Conservation Complex',
        url: 'https://whc.unesco.org/en/list/998',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'mississippi',
    code: 'MIS',
    name: 'Mississippi',
    category: 'Europe & Americas',
    subtitle: 'Interior artery · Gulf delta',
    about:
      'The Mississippi is the central arterial river of the contiguous United States — collecting the Missouri and Ohio systems before running south to a Gulf of Mexico delta. Orientation is barge commerce and flood control: locks and levees that made the interior a single navigation market; bluff and bottomland landscapes of the upper river; and a delta that builds and loses land as sediment and sea level trade places. This primer stays with trunk hydrology, working waterway, and delta geography rather than every tributary war story.',
    facts: {
      kind: 'Continental river',
      course: 'Northern interior sources → midcontinent confluence zone → Gulf of Mexico delta',
      region: 'Central United States · Mississippi Basin',
      basin: 'One of North America’s largest basins; Missouri and Ohio as principal tributary systems',
      hydrology: 'Snowmelt and rainfall floods; extensive locks, dams, and levees reshape the modern regime',
      climateRole: 'Interior sediment and nutrient conveyor; Gulf hypoxia and delta land-building dynamics',
      exploreLinks: ['United States'],
    },
    features: [
      {
        name: 'Mississippi barges',
        description:
          'Towboats and barge trains on the working trunk — commerce that treats the river as a continental highway.',
      },
      {
        name: 'Upper Mississippi',
        description:
          'Bluff-lined reaches and floodplain refuges of the upper river — a slower, scenic contrast to the engineered lower stem.',
      },
      {
        name: 'Mississippi Delta',
        description:
          'The Gulf outlet’s bird’s-foot and wetland mosaic — where the river’s sediment meets coastal processes.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mississippi River',
        url: 'https://www.britannica.com/place/Mississippi-River',
        kind: 'reference',
      },
      {
        label: 'USGS — Mississippi River',
        url: 'https://www.usgs.gov/mission-areas/water-resources/science/mississippi-river',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Mississippi River Delta',
        url: 'https://earthobservatory.nasa.gov/images/144255/the-mississippi-river-delta',
        kind: 'agency',
      },
    ],
  },
]

export const riverSubjects: RiverSubject[] = riverSubjectDrafts.map(withPhotos)

export function riverSubjectSlugs(): string[] {
  return riverSubjects.map((subject) => subject.slug)
}

export function getRiverSubject(slug: string): RiverSubject | undefined {
  return riverSubjects.find((subject) => subject.slug === slug)
}

export function riverSubjectsByCategory(): [string, RiverSubject[]][] {
  const order: string[] = []
  const groups = new Map<string, RiverSubject[]>()
  for (const subject of riverSubjects) {
    if (!groups.has(subject.category)) {
      order.push(subject.category)
      groups.set(subject.category, [])
    }
    groups.get(subject.category)!.push(subject)
  }
  return order.map((category) => [category, groups.get(category)!])
}

export function riverDescription(subject: RiverSubject): string {
  return subject.about
}

export function riverFeaturedPhoto(subject: RiverSubject): RiverPhoto {
  return subject.photos[0]
}
