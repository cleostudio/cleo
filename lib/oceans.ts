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
 * (twenty guides). Expand here as new Oceans guides ship.
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
    slug: 'black-sea',
    code: 'BLA',
    name: 'Black Sea',
    category: 'Major seas',
    subtitle: 'Enclosed Eurasian sea · Bosporus gateway',
    about:
      'The Black Sea is a nearly enclosed Eurasian sea between southeast Europe and western Asia — linked to the Mediterranean only through the Bosporus, Sea of Marmara, and Dardanelles. Orientation is gateway and stratification: a deep, poorly ventilated lower layer beneath fresher surface water fed by large rivers; steep Crimean and Caucasus coasts; and a long rim of ports from Odesa to Batumi. Limited exchange at the Turkish straits keeps the basin chemically and historically distinct from the open Atlantic system. This primer stays with enclosure, Bosporus exchange, and Pontic rim geography rather than every coastal gulf.',
    facts: {
      kind: 'Enclosed sea',
      extent: 'Nearly landlocked basin between southeast Europe and western Asia',
      region: 'Pontic rim · southeast Europe · Caucasus · Anatolia',
      circulation: 'River-fed surface layer; limited exchange through the Turkish straits; weak deep ventilation',
      bathymetry: 'Deep central basin; broad northwestern shelf; steep southern and eastern margins',
      climateRole: 'Temperate enclosed heat and moisture reservoir; river–sea salinity contrast',
      exploreLinks: ['Türkiye', 'Ukraine', 'Romania', 'Bulgaria', 'Georgia', 'Russia'],
    },
    features: [
      {
        name: 'Black Sea coast',
        description:
          'Pontic shorelines from Georgia to Ukraine — where mountain and steppe rims meet a nearly enclosed sea.',
      },
      {
        name: 'Bosporus Strait',
        description:
          'The narrow gateway at Istanbul — the choke point that links the Black Sea to the Mediterranean system.',
      },
      {
        name: 'Odesa coast',
        description:
          'A northwestern Black Sea shoreline and historic port rim — open water meeting the Ukrainian steppe coast.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Black Sea',
        url: 'https://www.britannica.com/place/Black-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — Black Sea',
        url: 'https://earthobservatory.nasa.gov/images/146349/phytoplankton-bloom-in-the-black-sea',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Historic Areas of Istanbul',
        url: 'https://whc.unesco.org/en/list/356',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'baltic-sea',
    code: 'BAL',
    name: 'Baltic Sea',
    category: 'Major seas',
    subtitle: 'Brackish shelf sea · northern Europe',
    about:
      'The Baltic Sea is a shallow, brackish shelf sea of northern Europe — nearly enclosed by Scandinavia, the Baltic states, and the North European Plain, and linked to the North Sea through the Danish straits. Orientation is salinity and archipelago: heavy freshwater inflow, limited tidal range, and island coasts such as Stockholm’s skärgård that blur land and water. Winter ice can cover northern reaches; summer blooms mark nutrient-rich surface layers. This primer stays with brackish hydrology, gateway exchange, and rim geography rather than every gulf name.',
    facts: {
      kind: 'Brackish shelf sea',
      extent: 'Shallow, nearly enclosed sea of northern Europe',
      region: 'Scandinavia · Baltic states · North European Plain',
      circulation: 'Low-salinity outflow through the Danish straits; weak tides; seasonal ice in the north',
      bathymetry: 'Shallow basins and sills; broad archipelagos; limited deep water',
      climateRole: 'Temperate moisture and ice-margin basin; sensitive brackish ecosystem',
      exploreLinks: ['Sweden', 'Finland', 'Poland', 'Germany', 'Denmark', 'Estonia', 'Latvia', 'Lithuania'],
    },
    features: [
      {
        name: 'Stockholm Archipelago',
        description:
          'A dense skärgård of islands and channels — Baltic geography as a blurred edge between land and sea.',
      },
      {
        name: 'German Baltic coast',
        description:
          'Sandy and cliffed shores of the southern Baltic — the North European Plain meeting brackish open water.',
      },
      {
        name: 'Latvian Baltic coast',
        description:
          'Dune and forest shorelines on the eastern rim — a quieter Baltic face of wind, sand, and shallow seas.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Baltic Sea',
        url: 'https://www.britannica.com/place/Baltic-Sea',
        kind: 'reference',
      },
      {
        label: 'HELCOM — Baltic Sea',
        url: 'https://helcom.fi/baltic-sea-trends/',
        kind: 'agency',
      },
      {
        label: 'UNESCO — High Coast / Kvarken Archipelago',
        url: 'https://whc.unesco.org/en/list/898',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'north-sea',
    code: 'NOR',
    name: 'North Sea',
    category: 'Major seas',
    subtitle: 'Northwest European shelf · storm sea',
    about:
      'The North Sea is a shallow northwest European shelf sea between Britain, Scandinavia, and the Low Countries — open to the Atlantic in the north and linked to the Baltic through the Skagerrak and Kattegat. Orientation is shelf and storm: strong tides, frequent gales, productive fisheries, and coasts engineered against surge — from Wadden Sea mudflats to Heligoland’s red cliffs. It has long been a corridor of trade, energy, and weather for northern Europe. This primer stays with shelf geometry, tidal coasts, and gateway roles rather than every estuary.',
    facts: {
      kind: 'Shelf sea',
      extent: 'Shallow sea between Britain, Scandinavia, and northwest Europe',
      region: 'Northwest European shelf',
      circulation: 'Atlantic inflow from the north; strong tides; connections to the Baltic and English Channel',
      bathymetry: 'Broad continental shelf; Dogger Bank and other banks; Wadden Sea tidal flats',
      climateRole: 'Storm-track moisture and heat exchange; major European weather theater',
      exploreLinks: ['United Kingdom', 'Norway', 'Netherlands', 'Germany', 'Denmark', 'Belgium'],
    },
    features: [
      {
        name: 'Heligoland',
        description:
          'A red-cliff island in the German Bight — a rocky outcrop that makes the shallow North Sea feel vertical.',
      },
      {
        name: 'Wadden Sea',
        description:
          'Tidal mudflats and barrier islands along the southeastern rim — a living shelf-sea margin shaped by tide and wind.',
      },
      {
        name: 'North Sea coast',
        description:
          'British and continental shorelines under Atlantic weather — beaches, cliffs, and sea defenses facing a stormy shelf.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — North Sea',
        url: 'https://www.britannica.com/place/North-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA — North Sea / European shelf seas',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts',
        kind: 'agency',
      },
      {
        label: 'UNESCO — Wadden Sea',
        url: 'https://whc.unesco.org/en/list/1314',
        kind: 'catalog',
      },
    ],
  },
  {
    slug: 'gulf-of-mexico',
    code: 'GOM',
    name: 'Gulf of Mexico',
    category: 'Major seas',
    subtitle: 'American marginal sea · Loop Current',
    about:
      'The Gulf of Mexico is a large American marginal sea bounded by the United States, Mexico, and Cuba — linked to the Atlantic through the Straits of Florida and to the Caribbean through the Yucatán Channel. Orientation is loop and delta: the Loop Current that feeds the Gulf Stream; the Mississippi River Delta as a major sediment and freshwater injector; and warm, hurricane-prone waters over a broad continental shelf. Coral and carbonate coasts mark Florida and Yucatán margins. This primer stays with basin enclosure, Loop Current exchange, and rim geography rather than every bayou.',
    facts: {
      kind: 'Marginal sea',
      extent: 'Large semi-enclosed sea between North America and Cuba',
      region: 'Gulf Coast · Mexico · Cuba approaches',
      circulation: 'Loop Current; Yucatán and Florida Strait exchange; river-influenced coastal waters',
      bathymetry: 'Broad northern shelf; deep Sigsbee basin; Mississippi Fan and carbonate platforms',
      climateRole: 'Warm tropical–subtropical heat reservoir; major Atlantic hurricane nursery',
      exploreLinks: ['United States', 'Mexico', 'Cuba'],
    },
    features: [
      {
        name: 'Gulf from orbit',
        description:
          'Basin-scale views of a warm American sea — cloud, sunset, and coastline that read as one enclosed theater.',
      },
      {
        name: 'Florida Gulf coast',
        description:
          'Low, sandy Gulf shores of western Florida — a subtropical rim facing open Loop Current waters.',
      },
      {
        name: 'Mississippi River Delta',
        description:
          'A bird’s-foot sediment plain entering the northern Gulf — river, wetland, and shelf meeting in one system.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Gulf of Mexico',
        url: 'https://www.britannica.com/place/Gulf-of-Mexico',
        kind: 'reference',
      },
      {
        label: 'NOAA — Gulf of Mexico',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/gulf-of-mexico',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Gulf of Mexico',
        url: 'https://earthobservatory.nasa.gov/images/148355/sediment-in-the-gulf-of-mexico',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'east-china-sea',
    code: 'ECS',
    name: 'East China Sea',
    category: 'Major seas',
    subtitle: 'East Asian shelf sea · Kuroshio rim',
    about:
      'The East China Sea is a broad East Asian marginal sea of the western Pacific — rimmed by China, the Korean Peninsula, and the Ryukyu chain toward Japan, and linked southward toward the Taiwan Strait approaches. Orientation is shelf and Kuroshio: wide continental shelves, monsoon and typhoon seasons, and a warm western-boundary current that skirts the basin’s eastern edge. Fishing grounds, shipping lanes, and fog banks mark a productive temperate–subtropical sea. This primer stays with shelf geometry, Kuroshio influence, and rim geography rather than maritime boundary disputes.',
    facts: {
      kind: 'Shelf marginal sea',
      extent: 'Broad western Pacific marginal sea between China, Korea, and the Ryukyus',
      region: 'East Asia · western Pacific shelf',
      circulation: 'Kuroshio influence on the eastern rim; monsoon winds; exchange toward the Yellow Sea and Taiwan Strait',
      bathymetry: 'Wide continental shelf; Okinawa Trough; island-arc approaches along the Ryukyus',
      climateRole: 'Monsoon and typhoon moisture corridor; productive temperate–subtropical shelf sea',
      exploreLinks: ['China', 'Japan', 'Korea, South'],
    },
    features: [
      {
        name: 'East China Sea from orbit',
        description:
          'Basin-scale satellite and ISS views — shelf, islands, and open water framing the East Asian marginal sea.',
      },
      {
        name: 'Ryukyu coast',
        description:
          'Island shores on the eastern rim — where Pacific swell and East China Sea waters meet coral and cliff coasts.',
      },
      {
        name: 'Fog over East China Sea',
        description:
          'Seasonal fog banks over the shelf — atmosphere writing climate onto a productive East Asian sea.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — East China Sea',
        url: 'https://www.britannica.com/place/East-China-Sea',
        kind: 'reference',
      },
      {
        label: 'NASA Earth Observatory — East China Sea',
        url: 'https://earthobservatory.nasa.gov/images/80891/fog-over-the-east-china-sea',
        kind: 'agency',
      },
      {
        label: 'NOAA — Kuroshio / western Pacific',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts',
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
  {
    slug: 'bering-sea',
    code: 'BER',
    name: 'Bering Sea',
    category: 'Polar seas',
    subtitle: 'North Pacific gateway · seasonal ice',
    about:
      'The Bering Sea is a broad subarctic sea of the North Pacific — bounded by Alaska and the Aleutian chain to the east and Russia’s Kamchatka and Chukotka coasts to the west, with the Bering Strait as its narrow Arctic gateway. Orientation is ice and exchange: winter sea ice that advances from the north, productive shelf waters that feed fisheries, and the strait as a choke point between Pacific and Arctic systems. The Pribilof Islands rise from the shelf as volcanic stepping stones in open water. This primer stays with seasonal ice, strait geography, and rim exchange rather than every coastal embayment.',
    facts: {
      kind: 'Polar marginal sea',
      extent: 'Broad North Pacific sea between Alaska and Russia; seasonal ice cover',
      region: 'Bering Strait gateway between the Pacific and Arctic',
      circulation: 'Alaskan Stream and coastal currents; Bering Strait throughflow to the Arctic',
      bathymetry: 'Wide continental shelf; Aleutian arc; Pribilof Islands on the shelf',
      climateRole: 'Pacific–Arctic heat and freshwater exchange; major subarctic fisheries',
      exploreLinks: ['United States', 'Russia'],
    },
    features: [
      {
        name: 'Bering Sea ice',
        description:
          'Seasonal pack ice that advances from the Arctic margin — a mobile winter lid over productive shelf waters.',
      },
      {
        name: 'Pribilof Islands',
        description:
          'Volcanic islands on the central shelf — rookeries and open sea in the heart of the Bering system.',
      },
      {
        name: 'Bering Strait',
        description:
          'The narrow gateway between the Pacific and Arctic oceans — a choke point for water, ice, and migration.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Bering Sea',
        url: 'https://www.britannica.com/place/Bering-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA — Bering Sea',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Bering Sea ice',
        url: 'https://earthobservatory.nasa.gov/images/77461/bering-sea-teeming-with-ice',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'greenland-sea',
    code: 'GRL',
    name: 'Greenland Sea',
    category: 'Polar seas',
    subtitle: 'North Atlantic polar sea · iceberg drift',
    about:
      'The Greenland Sea is a polar arm of the North Atlantic between Greenland’s east coast, Iceland’s north rim, and the Svalbard–Jan Mayen island arc — a corridor where Arctic pack ice and Greenland icebergs drift south toward warmer Atlantic water. Orientation is ice export and ridge geography: the East Greenland Current carrying ice and cold water; Scoresby Sund as a major glacier-fed fjord system; and Jan Mayen’s Beerenberg volcano rising from the polar sea. It is a mixing zone between Arctic and Atlantic systems. This primer stays with iceberg drift, current exchange, and island gateways rather than every fjord name.',
    facts: {
      kind: 'Polar Atlantic sea',
      extent: 'North Atlantic polar sea between Greenland, Iceland, and the Norwegian Sea',
      region: 'East Greenland coast · Jan Mayen · Svalbard approaches',
      circulation: 'East Greenland Current; Norwegian Atlantic inflow; Denmark Strait exchange',
      bathymetry: 'Deep Greenland Basin; Mohn Ridge; Scoresby Sund fjord system',
      climateRole: 'Arctic freshwater and ice export to the Atlantic; deep-water formation partner',
      exploreLinks: ['Denmark', 'Iceland', 'Norway'],
    },
    features: [
      {
        name: 'Greenland Sea icebergs',
        description:
          'Calved ice drifting in open polar water — Greenland’s glaciers meeting the North Atlantic in floating form.',
      },
      {
        name: 'Scoresby Sund glaciers',
        description:
          'A vast East Greenland fjord system — tidewater glaciers pouring ice into the Greenland Sea.',
      },
      {
        name: 'Jan Mayen Beerenberg',
        description:
          'An Arctic island volcano rising from the polar sea — ice, cloud, and basalt at the Greenland Sea’s gateway.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Greenland Sea',
        url: 'https://www.britannica.com/place/Greenland-Sea',
        kind: 'reference',
      },
      {
        label: 'NSIDC — Greenland ice sheet',
        url: 'https://nsidc.org/learn/parts-cryosphere/greenland-ice-sheet',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Greenland',
        url: 'https://earthobservatory.nasa.gov/world-of-change/greenland',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'barents-sea',
    code: 'BAR',
    name: 'Barents Sea',
    category: 'Polar seas',
    subtitle: 'Arctic Atlantic shelf · ice edge',
    about:
      'The Barents Sea is a broad Arctic marginal sea north of Norway and European Russia — where warm Atlantic water meets polar cold and sets the northern edge of ice-free winter navigation. Orientation is Atlantic warmth and ice margin: the North Cape as a landmark on the Norwegian rim; Honningsvåg and fishing towns facing open polar water; and summer phytoplankton blooms visible from orbit. It is one of the Arctic’s most productive and strategically watched shelves. This primer stays with Atlantic inflow, ice-edge geography, and rim ports rather than every offshore field.',
    facts: {
      kind: 'Arctic marginal sea',
      extent: 'Broad shelf sea north of Norway and northwest Russia',
      region: 'Norwegian Sea gateway · Svalbard approaches · Kola Peninsula rim',
      circulation: 'Norwegian Atlantic Current inflow; polar front and seasonal ice retreat',
      bathymetry: 'Wide Barents Shelf; Bear Island; deep Norwegian Sea connection to the west',
      climateRole: 'Atlantic heat delivery to the Arctic; ice-edge fisheries and bloom productivity',
      exploreLinks: ['Norway', 'Russia'],
    },
    features: [
      {
        name: 'Honningsvåg and Barents Sea',
        description:
          'A North Cape gateway town on the Barents rim — harbor, cliff, and open polar water at Norway’s northern edge.',
      },
      {
        name: 'Nordkapp approach',
        description:
          'The famous North Cape plateau seen from the sea — a landmark where the Barents meets the Norwegian Atlantic.',
      },
      {
        name: 'Barents Sea bloom',
        description:
          'Summer phytoplankton color in polar water — Atlantic warmth and light writing biology onto the Arctic shelf.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Barents Sea',
        url: 'https://www.britannica.com/place/Barents-Sea',
        kind: 'reference',
      },
      {
        label: 'NOAA — Arctic marginal seas',
        url: 'https://www.noaa.gov/education/resource-collections/ocean-coasts',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Barents Sea bloom',
        url: 'https://earthobservatory.nasa.gov/images/8127/bloom-in-the-barents-sea',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'weddell-sea',
    code: 'WED',
    name: 'Weddell Sea',
    category: 'Polar seas',
    subtitle: 'Antarctic embayment · pack-ice factory',
    about:
      'The Weddell Sea is a vast embayment of the Southern Ocean along Antarctica’s east coast — bounded by the Antarctic Peninsula and the Filchner–Ronne ice shelves, and famous as a factory of thick pack ice and cold bottom water. Orientation is ice and embayment: floes that consolidate under persistent cold; ice shelves that calve into the sea; and orbit-scale views that show the embayment as a white cap on the continent’s margin. Historic exploration routes crossed its floes toward the pole. This primer stays with pack-ice geography, shelf margins, and embayment scale rather than territorial claims alone.',
    facts: {
      kind: 'Antarctic embayment',
      extent: 'Large ice-covered embayment of the Southern Ocean along east Antarctica',
      region: 'Antarctic Peninsula east · Filchner–Ronne ice shelf margin',
      circulation: 'Weddell Gyre; coastal currents under ice; bottom-water formation sites',
      bathymetry: 'Weddell Basin; continental shelf under ice shelves; embayment bounded by peninsula and ice',
      climateRole: 'Major Antarctic sea-ice production; cold bottom-water export',
      exploreLinks: ['Argentina', 'Chile', 'South Africa', 'Australia', 'New Zealand'],
    },
    features: [
      {
        name: 'Weddell Sea pack ice',
        description:
          'Thick, consolidated floes that cover much of the embayment — the Southern Ocean’s great ice factory.',
      },
      {
        name: 'Flying over the Weddell',
        description:
          'Aerial views of floe fields and open leads — scale and texture of an Antarctic sea seen from above.',
      },
      {
        name: 'Weddell from orbit',
        description:
          'Space-station and satellite views of the embayment — ice, cloud, and coastline as one polar system.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Weddell Sea',
        url: 'https://www.britannica.com/place/Weddell-Sea',
        kind: 'reference',
      },
      {
        label: 'NSIDC — Antarctic sea ice',
        url: 'https://nsidc.org/learn/parts-cryosphere/antarctic-sea-ice',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Weddell Sea',
        url: 'https://earthobservatory.nasa.gov/images/144397/thick-and-thin-ice-in-the-weddell-sea',
        kind: 'agency',
      },
    ],
  },
  {
    slug: 'ross-sea',
    code: 'ROS',
    name: 'Ross Sea',
    category: 'Polar seas',
    subtitle: 'Antarctic embayment · ice-shelf margin',
    about:
      'The Ross Sea is a deep embayment of the Southern Ocean south of New Zealand — bounded by the Ross Ice Shelf, one of Antarctica’s largest floating ice platforms, and ringed by volcanic peaks on Ross Island near McMurdo Sound. Orientation is shelf and sound: pancake ice forming in autumn freeze-up; the ice shelf as a horizontal glacier front; and McMurdo Sound as a gateway for research stations and historic expeditions. It is among the most biologically productive Antarctic seas. This primer stays with ice-shelf geography, sound access, and embayment ecology rather than every base name.',
    facts: {
      kind: 'Antarctic embayment',
      extent: 'Deep Southern Ocean embayment south of New Zealand; Ross Ice Shelf margin',
      region: 'Ross Island · McMurdo Sound · Transantarctic Mountains approaches',
      circulation: 'Ross Gyre; coastal currents under ice shelf; polynya formation near the sound',
      bathymetry: 'Deep Ross Basin; broad continental shelf; Ross Ice Shelf floating front',
      climateRole: 'Major Antarctic polynya and productivity; ice-shelf–ocean coupling',
      exploreLinks: ['New Zealand', 'Australia', 'United States'],
    },
    features: [
      {
        name: 'Pancake ice',
        description:
          'Rounded floes in early freeze-up — the Ross Sea’s first winter skin forming on open polar water.',
      },
      {
        name: 'Ross Ice Shelf',
        description:
          'A vast floating ice platform at the embayment’s southern margin — Antarctica’s horizontal glacier front.',
      },
      {
        name: 'McMurdo Sound',
        description:
          'An ice-choked sound beside Ross Island — gateway water between open sea and the continental ice sheet.',
      },
    ],
    sources: [
      {
        label: 'Encyclopaedia Britannica — Ross Sea',
        url: 'https://www.britannica.com/place/Ross-Sea',
        kind: 'reference',
      },
      {
        label: 'NSIDC — Antarctic ice shelves',
        url: 'https://nsidc.org/learn/parts-cryosphere/antarctic-ice-shelves',
        kind: 'agency',
      },
      {
        label: 'NASA Earth Observatory — Ross Ice Shelf',
        url: 'https://earthobservatory.nasa.gov/images/50184/ross-ice-shelf',
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
