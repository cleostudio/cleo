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
 * Curated catalog — world ocean basins, major seas, and polar seas
 * (ten guides). Expand here as new Oceans guides ship.
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
    slug: 'mediterranean-sea',
    code: 'MED',
    name: 'Mediterranean Sea',
    category: 'Major seas',
    subtitle: 'Enclosed sea · Gibraltar gateway',
    about:
      'The Mediterranean Sea is a nearly enclosed sea between Europe, Africa, and western Asia — linked to the Atlantic only through the Strait of Gibraltar. Orientation is gateway and basin: evaporative concentration that makes Mediterranean waters denser than the open Atlantic; island arcs and volcanic calderas such as Santorini; and a long rim of ports that turned the sea into a shared historical theater. Summer drought and winter storms shape its climate more than equatorial trades. This primer stays with enclosure, exchange at Gibraltar, and rim geography rather than every gulf name.',
    facts: {
      kind: 'Enclosed sea',
      extent: 'Nearly landlocked basin between Europe, Africa, and western Asia',
      region: 'Southern Europe · North Africa · Levant rim',
      circulation: 'Atlantic inflow at Gibraltar; dense outflow beneath; regional gyres and wind-driven currents',
      bathymetry: 'Deep basins separated by sills; volcanic islands; narrow continental shelves in places',
      climateRole: 'Hot, saline heat reservoir; water-mass exchange that ventilates the Atlantic mid-depths',
      exploreLinks: ['Italy', 'Spain', 'Greece', 'Egypt', 'Türkiye', 'France'],
    },
    features: [
      {
        name: 'Santorini caldera',
        description:
          'A flooded volcanic caldera in the Aegean — island cliffs that make Mediterranean tectonics visible from the shore.',
      },
      {
        name: 'Strait of Gibraltar',
        description:
          'The Atlantic–Mediterranean gateway — a narrow exchange corridor that controls the sea’s salt and heat budget.',
      },
      {
        name: 'Mediterranean from orbit',
        description:
          'Basin-scale views of an almost enclosed sea — coastlines and clear water that read as one geographic room.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Mediterranean Sea',
        url: 'https://www.britannica.com/place/Mediterranean-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Mediterranean Sea',
        url: 'https://earthobservatory.nasa.gov/images/148771/rare-storm-over-mediterranean-sea',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Venice and its Lagoon',
        url: 'https://whc.unesco.org/en/list/394',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'caribbean-sea',
    code: 'CAR',
    name: 'Caribbean Sea',
    category: 'Major seas',
    subtitle: 'Tropical American sea · island arcs',
    about:
      'The Caribbean Sea is a tropical American sea bounded by the Greater and Lesser Antilles, Central America, and northern South America. Orientation is island-arc and reef: volcanic and limestone islands that rim a deep basin; coral shelves and clear shallow banks; and passages that exchange water with the Atlantic. Trade winds, hurricanes, and warm surface waters define its climate and hazards. This primer stays with arc geography, reef margins, and basin enclosure rather than every island state.',
    facts: {
      kind: 'Tropical marginal sea',
      extent: 'Tropical sea enclosed by Antillean arcs and the American mainland',
      region: 'Between Central/South America and the Antilles',
      circulation: 'Caribbean Current; Yucatán and Windward Passages exchange with the Atlantic',
      bathymetry: 'Deep Cayman and Colombian/Venezuelan basins; island arcs; coral shelves',
      climateRole: 'Warm tropical heat reservoir; hurricane track and coral-climate indicator',
      exploreLinks: ['Cuba', 'Jamaica', 'Colombia', 'Venezuela', 'Mexico', 'United States'],
    },
    features: [
      {
        name: 'Caribbean reef',
        description:
          'Shallow coral platforms in clear tropical water — living margins that fringe many Caribbean islands and banks.',
      },
      {
        name: 'Caribbean coast',
        description:
          'Mainland and island shorelines under trade-wind seas — where tropical American land meets the basin.',
      },
      {
        name: 'Caribbean from orbit',
        description:
          'Satellite views of Cuba, the Bahamas approaches, and turquoise shelves — island-arc geography at basin scale.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Caribbean Sea',
        url: 'https://www.britannica.com/place/Caribbean-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA — Caribbean',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/caribbean',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Belize Barrier Reef Reserve System',
        url: 'https://whc.unesco.org/en/list/764',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'south-china-sea',
    code: 'SCS',
    name: 'South China Sea',
    category: 'Major seas',
    subtitle: 'Monsoon marginal sea · island chains',
    about:
      'The South China Sea is a monsoon-driven marginal sea of the western Pacific — rimmed by China, Mainland Southeast Asia, and island nations from the Philippines to Indonesia. Orientation is shelf and monsoon: broad continental shelves, limestone coasts such as Hạ Long and El Nido, and seasonal winds that reverse surface circulation. It is a major shipping and fishery theater as well as a warm tropical basin. This primer stays with monsoon hydrology, rim geography, and shelf seas rather than maritime boundary disputes.',
    facts: {
      kind: 'Monsoon marginal sea',
      extent: 'Large western Pacific marginal sea between Asia and island Southeast Asia',
      region: 'Western Pacific · East and Southeast Asian rim',
      circulation: 'Monsoon-reversed surface currents; exchange through Luzon, Taiwan, and Indonesian passages',
      bathymetry: 'Broad shelves; deep central basin; coral atolls and limestone coasts',
      climateRole: 'Tropical heat and moisture source for East Asian monsoons; typhoon corridor',
      exploreLinks: ['China', 'Vietnam', 'Philippines', 'Malaysia', 'Indonesia'],
    },
    features: [
      {
        name: 'Hạ Long Bay',
        description:
          'Karst towers in a drowned coastal bay — limestone geography on the northwestern approaches of the basin.',
      },
      {
        name: 'El Nido limestone coast',
        description:
          'Palawan’s Bacuit Bay cliffs and lagoons — a tropical limestone shoreline on the eastern island rim.',
      },
      {
        name: 'South China Sea from orbit',
        description:
          'Basin-scale satellite views — shelf, islands, and open water that frame the monsoon sea as one system.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — South China Sea',
        url: 'https://www.britannica.com/place/South-China-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Typhoon over the South China Sea',
        url: 'https://earthobservatory.nasa.gov/images/44564/typhoon-conson',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Ha Long Bay',
        url: 'https://whc.unesco.org/en/list/672',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'red-sea',
    code: 'RED',
    name: 'Red Sea',
    category: 'Major seas',
    subtitle: 'Rift sea · coral deserts',
    about:
      'The Red Sea is a narrow rift sea between Africa and Arabia — an arm of the Indian Ocean system linked northward toward Suez and Aqaba. Orientation is tectonic and arid: a spreading axis beneath clear, warm water; desert coasts with little river dilution; and coral reefs that thrive in high-salinity conditions. Bab el-Mandeb gates exchange with the Gulf of Aden; the northern gulfs fork toward Egypt, Israel, Jordan, and Saudi Arabia. This primer stays with rift geography, coral coasts, and gateway exchange rather than every resort shoreline.',
    facts: {
      kind: 'Rift sea',
      extent: 'Long, narrow sea between northeast Africa and the Arabian Peninsula',
      region: 'Northeast Africa · Arabian Peninsula',
      circulation: 'Exchange at Bab el-Mandeb; high evaporation; limited freshwater inflow',
      bathymetry: 'Central rift axis and deeps; coral reefs on arid shelves; Gulf of Suez and Gulf of Aqaba forks',
      climateRole: 'Hot, saline tropical sea; desert-coast climate contrast and coral heat laboratory',
      exploreLinks: ['Egypt', 'Saudi Arabia', 'Sudan', 'Eritrea', 'Yemen', 'Djibouti'],
    },
    features: [
      {
        name: 'Red Sea coast',
        description:
          'Arid shorelines against clear water — desert meeting reef with almost no river dilution.',
      },
      {
        name: 'Red Sea coral',
        description:
          'Hard-coral communities in warm, saline water — a living fringe along the rift sea’s shelves.',
      },
      {
        name: 'Gulf of Suez & Aqaba',
        description:
          'The northern forks of the Red Sea — tectonic gulfs that stage the approaches to Suez and the Levant.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Red Sea',
        url: 'https://www.britannica.com/place/Red-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Dust over the Red Sea',
        url: 'https://earthobservatory.nasa.gov/images/86148/dust-over-the-red-sea',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Socotra Archipelago',
        url: 'https://whc.unesco.org/en/list/1263',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'arabian-sea',
    code: 'ARA',
    name: 'Arabian Sea',
    category: 'Major seas',
    subtitle: 'Northwest Indian Ocean · monsoon basin',
    about:
      'The Arabian Sea is the northwestern arm of the Indian Ocean — bounded by the Arabian Peninsula, Iran and Pakistan, and India’s west coast. Orientation is monsoon and upwelling: seasonal winds that reverse surface currents and fertilize coastal waters; dust storms that color the basin from orbit; and port coasts from Goa to Oman. It links Red Sea and Persian Gulf approaches to the wider Indian Ocean. This primer stays with monsoon circulation, arid rim geography, and coastal upwelling rather than every gulf inlet.',
    facts: {
      kind: 'Monsoon marginal sea',
      extent: 'Northwestern Indian Ocean basin between Arabia, Iran–Pakistan, and western India',
      region: 'Northwest Indian Ocean',
      circulation: 'Monsoon-reversed currents; Somali and Arabian upwelling systems in season',
      bathymetry: 'Indus Fan and continental slopes; Owen Fracture Zone approaches; broad western Indian shelf',
      climateRole: 'Monsoon moisture and dust corridor; seasonal upwelling productivity engine',
      exploreLinks: ['India', 'Oman', 'Pakistan', 'Iran', 'Yemen', 'Somalia'],
    },
    features: [
      {
        name: 'Arabian Sea from orbit',
        description:
          'Basin-scale satellite views of the northwestern Indian Ocean — arid rims meeting open monsoon water.',
      },
      {
        name: 'Arabian Sea at Goa',
        description:
          'India’s west-coast shoreline on the eastern rim — where monsoon swell meets a tropical beach plain.',
      },
      {
        name: 'Dust over Arabian Sea',
        description:
          'Wind-borne dust plumes over the basin — arid Asia and Arabia writing climate onto the sea surface.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Arabian Sea',
        url: 'https://www.britannica.com/place/Arabian-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Dust over the Arabian Sea',
        url: 'https://earthobservatory.nasa.gov/images/35484/dust-over-the-arabian-sea',
        kind: 'agency',
      },
      {
        label: 'NOAA — Indian Ocean / Arabian Sea',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/indian-ocean',
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
