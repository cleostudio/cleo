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
 * Curated catalog — world rivers. Expand here as new Rivers guides ship.
 */
const riverSubjectDrafts: RiverSubjectDraft[] = [
  {
    slug: 'nile',
    code: 'NIL',
    name: 'Nile',
    category: 'World rivers',
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
    slug: 'amazon',
    code: 'AMZ',
    name: 'Amazon',
    category: 'World rivers',
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
    slug: 'yangtze',
    code: 'YTZ',
    name: 'Yangtze',
    category: 'World rivers',
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
    slug: 'danube',
    code: 'DAN',
    name: 'Danube',
    category: 'World rivers',
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
    slug: 'mississippi',
    code: 'MIS',
    name: 'Mississippi',
    category: 'World rivers',
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
