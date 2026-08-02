/** Oceans topic — evergreen field-guide records for world ocean basins. */

import oceansPhotos from '~/content/oceans-photos.json'
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
  /** Broad type: Ocean basin, Polar ocean, etc. */
  kind: string
  /** Approximate extent in plain language. */
  extent: string
  /** Geographic setting in plain language. */
  region: string
  /** Major currents, gyres, or overturning notes. */
  circulation: string
  /** Trenches, ridges, shelves, or ice margins. */
  bathymetry: string
  /** Heat, ice, monsoon, or other climate role. */
  climateRole: string
  /** Modern Explore countries on the basin rim (exact catalog names). */
  exploreLinks: string[]
}

export interface OceanPhoto extends StaticPhoto {
  commonsTitle: string
}

export interface OceanSubject {
  slug: string
  /** Short catalog code shown in indexes (e.g. PAC, ATL). */
  code: string
  name: string
  category: string
  /** One-line kind label under the title. */
  subtitle: string
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: OceanFacts
  /** Exactly three notable sites / features. */
  features: [OceanFeature, OceanFeature, OceanFeature]
  sources: OceanSource[]
  /** Three distinct, locally hosted photographs: one hero plus two gallery views. */
  photos: [OceanPhoto, OceanPhoto, OceanPhoto]
}

type OceanSubjectDraft = Omit<OceanSubject, 'photos'>

const photoManifest = oceansPhotos as Record<string, OceanPhoto[]>

function withPhotos(draft: OceanSubjectDraft): OceanSubject {
  const photos = photoManifest[draft.slug]
  if (!Array.isArray(photos) || photos.length !== 3) {
    throw new Error(`Missing three ocean photos for ${draft.slug}`)
  }
  return {
    ...draft,
    photos: photos as [OceanPhoto, OceanPhoto, OceanPhoto],
  }
}

/**
 * Curated catalog — world ocean basins and polar seas.
 * Expand here as new Oceans guides ship.
 */
const oceanSubjectDrafts: OceanSubjectDraft[] = [
  {
    slug: 'pacific-ocean',
    code: 'PAC',
    name: 'Pacific Ocean',
    category: 'World ocean basins',
    subtitle: 'Largest basin · Ring of Fire rim',
    about:
      'The Pacific Ocean is Earth’s largest ocean basin — a vast water hemisphere between the Americas and Asia–Oceania whose floor holds the deepest trenches and whose rim concentrates volcanoes and earthquakes. Orientation is plate-tectonic and circulatory: spreading ridges in the east, subduction arcs in the west, and subtropical gyres that redistribute heat. Coral systems such as the Great Barrier Reef mark shallow margins; open-ocean cloud streets and trade winds mark the free surface. This primer stays with basin scale, rim tectonics, and reef–trench contrast rather than every island chain.',
    facts: {
      kind: 'Ocean basin',
      extent: 'Largest ocean by area and volume; spans tropics to both polar approaches',
      region: 'Between the Americas and Asia–Oceania',
      circulation: 'North and South Pacific gyres; Kuroshio, California, Equatorial, and Antarctic Circumpolar links',
      bathymetry: 'Mariana and other trenches; East Pacific Rise; wide abyssal plains and island arcs',
      climateRole: 'Primary tropical heat reservoir; El Niño–Southern Oscillation partner',
      exploreLinks: ['Chile', 'Japan', 'Australia', 'United States', 'New Zealand'],
    },
    features: [
      {
        name: 'Great Barrier Reef',
        description:
          'A vast coral province on the Australian shelf — shallow-water biology at the edge of a deep ocean basin.',
      },
      {
        name: 'Pacific Ring of Fire',
        description:
          'The volcanic and seismic rim of subduction zones that frame much of the Pacific — tectonics made visible as arcs and islands.',
      },
      {
        name: 'Open Pacific',
        description:
          'Trade-wind cloud fields and long fetches of open water — the free surface of the basin far from continental shelves.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Pacific Ocean',
        url: 'https://www.britannica.com/place/Pacific-Ocean',
        kind: 'reference',
      },
      {
        label: 'NOAA — Pacific Ocean',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/pacific-ocean',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Great Barrier Reef',
        url: 'https://whc.unesco.org/en/list/154',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'atlantic-ocean',
    code: 'ATL',
    name: 'Atlantic Ocean',
    category: 'World ocean basins',
    subtitle: 'S-shaped basin · Mid-ocean ridge',
    about:
      'The Atlantic Ocean is the S-shaped basin between the Americas and Europe–Africa — younger in geologic terms than the Pacific, with a mid-ocean ridge that still spreads at the surface in Iceland. Orientation is ridge-and-current: the Mid-Atlantic Ridge as a north–south spine, the Gulf Stream and its extensions as heat conveyors, and relatively narrow ocean–atmosphere exchanges that shape European and eastern North American climates. This primer stays with spreading geometry, western boundary currents, and basin connectivity rather than every coastal sea.',
    facts: {
      kind: 'Ocean basin',
      extent: 'Second-largest ocean; connects Arctic approaches to the Southern Ocean',
      region: 'Between the Americas and Europe–Africa',
      circulation: 'Gulf Stream / North Atlantic Current; subtropical gyres; overturning circulation links',
      bathymetry: 'Mid-Atlantic Ridge; abyssal plains; relatively few ultra-deep trenches versus the Pacific',
      climateRole: 'Major heat delivery to northwest Europe; hurricane basin in the tropics',
      exploreLinks: ['Brazil', 'Portugal', 'South Africa', 'United States', 'Iceland'],
    },
    features: [
      {
        name: 'Mid-Atlantic Ridge',
        description:
          'The spreading spine of the basin — a continuous submarine mountain chain that reaches the air in Iceland.',
      },
      {
        name: 'Thingvellir rift',
        description:
          'A subaerial window onto the Mid-Atlantic Ridge in Iceland — plate boundary as rift valley and national landscape.',
      },
      {
        name: 'Gulf Stream',
        description:
          'A swift western boundary current that carries warm water northward — a heat conveyor visible in satellite sea-surface patterns.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Atlantic Ocean',
        url: 'https://www.britannica.com/place/Atlantic-Ocean',
        kind: 'reference',
      },
      {
        label: 'NOAA — Atlantic Ocean',
        url: 'https://oceanservice.noaa.gov/facts/atlantic.html',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Þingvellir National Park',
        url: 'https://whc.unesco.org/en/list/1152',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'indian-ocean',
    code: 'IND',
    name: 'Indian Ocean',
    category: 'World ocean basins',
    subtitle: 'Monsoon basin · Southern Hemisphere gyre',
    about:
      'The Indian Ocean is the monsoon-driven basin bounded by Africa, Asia, and Australia — the only ocean whose northern rim is closed by a continent and whose seasonal winds reverse with the year. Orientation is atmospheric as much as oceanic: monsoon charts, western boundary currents such as the Agulhas, and broad tropical bays that funnel moisture onto land. Ridge systems and fracture zones structure the floor; cyclone seasons mark the free surface. This primer stays with monsoon coupling, Agulhas leakage, and tropical margins rather than every archipelago.',
    facts: {
      kind: 'Ocean basin',
      extent: 'Third-largest ocean; strongly seasonal northern circulation',
      region: 'Between Africa, Asia, and Australia',
      circulation: 'Monsoon current reversals; Agulhas Current; South Equatorial Current; Indonesian Throughflow links',
      bathymetry: 'Central Indian Ridge; Ninety East Ridge; Java Trench on the northeast rim',
      climateRole: 'Monsoon moisture engine; tropical cyclone basin',
      exploreLinks: ['India', 'Indonesia', 'Australia', 'South Africa', 'Madagascar'],
    },
    features: [
      {
        name: 'Monsoon circulation',
        description:
          'Seasonal wind and current reversals that couple the ocean surface to Asian and African rainfall patterns.',
      },
      {
        name: 'Agulhas Current',
        description:
          'A powerful western boundary current along southern Africa — a heat and salt pathway that leaks into the Atlantic.',
      },
      {
        name: 'Bay of Bengal',
        description:
          'A broad tropical embayment receiving Himalayan rivers — a moisture and cyclone theater on the northern rim.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Indian Ocean',
        url: 'https://www.britannica.com/place/Indian-Ocean',
        kind: 'reference',
      },
      {
        label: 'NOAA — Indian Ocean',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/indian-ocean',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Indian Ocean',
        url: 'https://earthobservatory.nasa.gov/world-of-change/indianOcean',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'arctic-ocean',
    code: 'ARC',
    name: 'Arctic Ocean',
    category: 'Polar seas',
    subtitle: 'Polar basin · Seasonal sea ice',
    about:
      'The Arctic Ocean is the smallest and shallowest of the world oceans — a polar basin nearly enclosed by continents and covered for much of the year by drifting sea ice. Orientation is ice and exchange: pack ice that moves with winds and currents, gateways such as the Fram Strait that export ice and water to the Atlantic, and submarine ridges that divide deep basins. Seasonal light and darkness shape biology and human routes as much as bathymetry does. This primer stays with ice cover, basin enclosure, and polar exchange rather than every coastal shelf sea.',
    facts: {
      kind: 'Polar ocean',
      extent: 'Smallest and shallowest world ocean; largely ice-covered in winter',
      region: 'Polar basin rimmed by North America, Eurasia, and Greenland',
      circulation: 'Beaufort Gyre; Transpolar Drift; Fram Strait export to the Atlantic',
      bathymetry: 'Broad continental shelves; Lomonosov Ridge; deep Canada and Eurasia basins',
      climateRole: 'Sea-ice albedo and freshwater storage; amplifier of polar climate change',
      exploreLinks: ['Canada', 'Norway', 'Russia', 'United States'],
    },
    features: [
      {
        name: 'Arctic sea ice',
        description:
          'A seasonal and multi-year ice cover that reflects sunlight, shelters ecosystems, and records climate change in its extent.',
      },
      {
        name: 'Pack ice',
        description:
          'Drifting floes under wind and current — the mobile surface of the polar basin rather than a fixed ice sheet.',
      },
      {
        name: 'Arctic mosaic',
        description:
          'Satellite-scale views of ice, open water, and cloud that show how the enclosed polar ocean breathes with the seasons.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Arctic Ocean',
        url: 'https://www.britannica.com/place/Arctic-Ocean',
        kind: 'reference',
      },
      {
        label: 'NSIDC — Arctic sea ice',
        url: 'https://nsidc.org/learn/parts-cryosphere/arctic-sea-ice',
        kind: 'agency',
      },
      {
        label: 'NOAA Arctic Report Card',
        url: 'https://arctic.noaa.gov/report-card/',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'southern-ocean',
    code: 'SOU',
    name: 'Southern Ocean',
    category: 'Polar seas',
    subtitle: 'Circumpolar ocean · ACC ring',
    about:
      'The Southern Ocean is the continuous ring of water around Antarctica — defined less by enclosing continents than by the Antarctic Circumpolar Current that links the Atlantic, Indian, and Pacific. Orientation is circumpolar and wind-driven: Drake Passage as a choke point, ice shelves and seas such as the Weddell as ice factories, and a frontal system that isolates Antarctic waters. It is the planet’s great mixer of deep and surface layers. This primer stays with circumpolar flow, passage geography, and ice-margin seas rather than territorial naming debates alone.',
    facts: {
      kind: 'Polar ocean',
      extent: 'Circumpolar belt around Antarctica; connects the three great ocean basins',
      region: 'Southern Hemisphere high latitudes around Antarctica',
      circulation: 'Antarctic Circumpolar Current; Weddell and Ross gyres; deep-water formation sites',
      bathymetry: 'Drake Passage sill; Antarctic continental shelf and ice shelves; mid-ocean ridge segments',
      climateRole: 'Global heat and carbon uptake; sea-ice and ice-shelf coupling',
      exploreLinks: ['Argentina', 'Chile', 'Australia', 'New Zealand', 'South Africa'],
    },
    features: [
      {
        name: 'Antarctic Circumpolar Current',
        description:
          'The planet’s strongest current system — a wind-driven ring that links the Atlantic, Indian, and Pacific basins.',
      },
      {
        name: 'Drake Passage',
        description:
          'The narrow, deep gateway between South America and the Antarctic Peninsula — a choke point for circumpolar flow.',
      },
      {
        name: 'Weddell Sea',
        description:
          'A major ice-covered embayment of the Southern Ocean — a cold-water factory and historic exploration theater.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Southern Ocean',
        url: 'https://www.britannica.com/place/Southern-Ocean',
        kind: 'reference',
      },
      {
        label: 'NOAA — Southern Ocean',
        url: 'https://oceanservice.noaa.gov/facts/south-ocean.html',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Circumpolar Current',
        url: 'https://earthobservatory.nasa.gov/images/146007/the-antarctic-circumpolar-current',
        kind: 'agency',
      },
    ],
  },
]

export const oceanSubjects: OceanSubject[] = oceanSubjectDrafts.map(withPhotos)

export function oceanSubjectSlugs(): string[] {
  return oceanSubjects.map((subject) => subject.slug)
}

export function getOceanSubject(slug: string): OceanSubject | undefined {
  return oceanSubjects.find((subject) => subject.slug === slug)
}

export function oceanSubjectsByCategory(): [string, OceanSubject[]][] {
  const order: string[] = []
  const groups = new Map<string, OceanSubject[]>()
  for (const subject of oceanSubjects) {
    if (!groups.has(subject.category)) {
      order.push(subject.category)
      groups.set(subject.category, [])
    }
    groups.get(subject.category)!.push(subject)
  }
  return order.map((category) => [category, groups.get(category)!])
}

export function oceanDescription(subject: OceanSubject): string {
  return subject.about
}

export function oceanFeaturedPhoto(subject: OceanSubject): OceanPhoto {
  return subject.photos[0]
}
