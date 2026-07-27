/** Place guides — cities, states, islands, regions, and landmarks under Explore. */

import placePhotos from '~/content/place-photos.json'
import { getCountry } from '~/lib/countries'
import { placeGuideDraftsBatch2 } from '~/lib/places-batch2'
import { placeGuideDraftsBatch3 } from '~/lib/places-batch3'
import { placeGuideDraftsBatch4 } from '~/lib/places-batch4'
import { placeGuideDraftsBatch5 } from '~/lib/places-batch5'
import { placeGuideDraftsBatch6 } from '~/lib/places-batch6'
import { placeGuideDraftsBatch7 } from '~/lib/places-batch7'
import type { StaticPhoto } from '~/lib/static-photo'

export type PlaceKind = 'City' | 'State' | 'Island' | 'Region' | 'Landmark'

export interface PlaceFeature {
  name: string
  description: string
}

export interface PlaceSource {
  label: string
  url: string
  kind: 'place' | 'reference' | 'authority'
}

export interface PlaceFacts {
  kind: PlaceKind
  /** Parent country display name. */
  country: string
  /** World region inherited from the parent country. */
  region: string
  /** Admin area, archipelago, or setting when helpful. */
  setting: string
  /** Evergreen role note — avoid volatile census figures. */
  role: string
  /** Compact “known for” line for fact plates. */
  knownFor: string
}

export interface PlacePhoto extends StaticPhoto {}

export interface PlaceGuide {
  slug: string
  /** Short catalog code shown in indexes (e.g. PAR, TYO). */
  code: string
  name: string
  kind: PlaceKind
  /** Parent Explore country slug. */
  countrySlug: string
  /** One-line label under the title. */
  subtitle: string
  /** Names that should deep-link from a parent country’s Places list. */
  matchNames: string[]
  /** Neutral evergreen overview, ~150–250 words. */
  about: string
  facts: PlaceFacts
  features: [PlaceFeature, PlaceFeature, PlaceFeature]
  sources: PlaceSource[]
  photo: PlacePhoto
}

type PlaceGuideDraft = Omit<PlaceGuide, 'photo'>

const photoManifest = placePhotos as Record<string, PlacePhoto>

function withPhoto(draft: PlaceGuideDraft): PlaceGuide {
  const photo = photoManifest[draft.slug]
  if (!photo) {
    throw new Error(`Missing place photo for ${draft.slug}`)
  }
  return { ...draft, photo }
}

/**
 * Curated place guides nested under country Explore pages.
 * Expand here as new city / state / island / landmark primers ship.
 */
const placeGuideDrafts: PlaceGuideDraft[] = [
  {
    slug: 'paris',
    code: 'PAR',
    name: 'Paris',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Eiffel Tower', 'Paris'],
    about:
      'Paris concentrates French urban life along a bend of the Seine, where islands, embankments, and axial boulevards organize a dense historic core. The Île de la Cité and neighboring banks hold medieval churches, royal squares, and river crossings that still structure daily movement. Nineteenth-century avenues cut clearer sightlines through older fabric, while arrondissements keep neighborhood grain at walking scale. Museums, ministries, and universities cluster near the river; markets and courtyards fill the blocks behind them. Westward, parks and exhibition grounds open the plan; eastward and northward, denser residential quarters continue the city’s ring logic. Orientation here is geographic and architectural rather than seasonal fashion: stone facades, zinc roofs, bridges as viewpoints, and a metro that stitches left bank to right. Paris is both capital and continuously inhabited city — a place where monument and street life share the same short blocks.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Île-de-France · Seine basin',
      role: 'National capital and primary cultural hub',
      knownFor: 'River islands, boulevards, museums, and cafe streets',
    },
    features: [
      {
        name: 'Seine embankments',
        description:
          'Bookstalls, bridges, and quays that turn the river into the city’s main public corridor.',
      },
      {
        name: 'Historic axis',
        description:
          'Louvre–Tuileries–Champs-Élysées alignments that stage monumental sightlines across central Paris.',
      },
      {
        name: 'Arrondissement grain',
        description:
          'Compact districts with markets, courtyards, and metro nodes that keep neighborhoods walkable.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Paris',
        url: 'https://www.britannica.com/place/Paris',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Paris, Banks of the Seine',
        url: 'https://whc.unesco.org/en/list/600/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tokyo',
    code: 'TYO',
    name: 'Tokyo',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Tokyo'],
    about:
      'Tokyo is a metropolitan plain of wards, rail nodes, and layered skylines facing Tokyo Bay. What reads as one city is a federation of centers — imperial grounds and business districts in Chiyoda, retail canyons in Shinjuku and Shibuya, temple approaches in Asakusa, waterfront fill toward Odaiba — tied together by an extraordinarily dense transit web. Low wooden neighborhoods persist beside towers; elevated highways and river channels cut through both. Geography matters: the bay edge, the Sumida and other rivers, and the western rise toward Musashino structure growth more than any single boulevard. Orientation should treat Tokyo as a system of stations and walking sheds rather than a European radial capital. Parks, shrine precincts, and market streets supply pauses inside the continuous urban field. The durable primer is scale and connectivity: how millions share a coastal plain through rails, alleys, and carefully zoned vertical stacking.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Kantō Plain · Tokyo Bay',
      role: 'National capital and global metropolitan core',
      knownFor: 'Rail-linked wards, bay frontage, and mixed low-rise and tower fabric',
    },
    features: [
      {
        name: 'Yamanote loop',
        description:
          'A circular rail spine that stitches major centers into one navigable metropolitan ring.',
      },
      {
        name: 'Bay and rivers',
        description:
          'Reclaimed waterfront, canals, and river corridors that organize industry, parks, and views.',
      },
      {
        name: 'Neighborhood stations',
        description:
          'Local shopping streets and shrine approaches radiating from countless suburban and inner-city stops.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tokyo',
        url: 'https://www.britannica.com/place/Tokyo',
        kind: 'reference',
      },
      {
        label: 'Tokyo Metropolitan Government',
        url: 'https://www.metro.tokyo.lg.jp/english/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'new-york',
    code: 'NYC',
    name: 'New York City',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Statue of Liberty', 'New York'],
    about:
      'New York City occupies a harbor archipelago where the Hudson and East rivers meet the Atlantic approaches. Manhattan’s street grid, Brooklyn and Queens on Long Island, the Bronx on the mainland, and Staten Island across the Narrows form five boroughs linked by bridges, tunnels, and ferries. The skyline is a product of bedrock, zoning, and port wealth; the street life is a product of immigrant neighborhoods, parks, and transit density. Central Park interrupts the midtown–uptown continuum; the harbor islands and waterfront piers recall the city’s maritime origin even as container traffic shifted outward. Orientation works best by water and borough: where islands pinch, where bridges land, where subway lines branch. Brownstone blocks, industrial loft districts, and glass towers coexist within short distances. The durable story is harbor geography turned into a continental gateway — still readable in ferry wakes, tunnel mouths, and the grid’s relentless numbering.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'New York Harbor · five boroughs',
      role: 'Largest U.S. city and Atlantic gateway',
      knownFor: 'Harbor islands, skyline, boroughs, and subway grid',
    },
    features: [
      {
        name: 'Manhattan grid',
        description:
          'Numbered avenues and streets that make the island’s dense core legible at walking and transit scale.',
      },
      {
        name: 'Harbor approaches',
        description:
          'Narrows, rivers, and islands that framed immigration, trade, and the Statue of Liberty’s setting.',
      },
      {
        name: 'Borough linkage',
        description:
          'Bridges, tunnels, and rails binding mainland and island neighborhoods into one municipal system.',
      },
    ],
    sources: [
      {
        label: 'Britannica — New York City',
        url: 'https://www.britannica.com/place/New-York-City',
        kind: 'reference',
      },
      {
        label: 'NYC official guide — About NYC',
        url: 'https://www.nyc.gov/explore-new-york-city',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'rome',
    code: 'ROM',
    name: 'Rome',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Rome', 'Colosseum'],
    about:
      'Rome spreads across hills above the Tiber, layering republican forums, imperial monuments, papal axes, and modern traffic into one continuous city. Ancient walls and gates still mark older limits; aqueduct arches and paved roads recall how engineering underwrote power. The historic center is a dense palimpsest: temples reused as churches, medieval lanes threading ruins, baroque piazzas staged for approach and spectacle. Outside the deepest core, residential quarters and tree-lined avenues continue the living capital. Orientation should privilege hills, river bends, and the Forum–Colosseum–Palatine cluster rather than a single boulevard. Rome’s primer is temporal geology as much as street plan — each era building with, against, or atop the last. Fountains, obelisks, and church facades punctuate walks; tram and metro lines stitch later suburbs to the center. The city remains Italy’s political seat while carrying an archaeological density unmatched in most capitals.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Tiber hills · Lazio',
      role: 'National capital with deep archaeological layers',
      knownFor: 'Forums, churches, piazzas, and continuous habitation',
    },
    features: [
      {
        name: 'Imperial core',
        description:
          'Forum, Colosseum, and Palatine slopes where republican and imperial Rome remain readable in stone.',
      },
      {
        name: 'Baroque staging',
        description:
          'Piazzas, fountains, and axial church approaches that reshape movement through the historic center.',
      },
      {
        name: 'Tiber corridor',
        description:
          'River bends and bridges that organize quarters from Trastevere to the northern bends.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rome',
        url: 'https://www.britannica.com/place/Rome',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Rome',
        url: 'https://whc.unesco.org/en/list/91/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cairo',
    code: 'CAI',
    name: 'Cairo',
    kind: 'City',
    countrySlug: 'egypt',
    subtitle: 'City · Egypt',
    matchNames: ['Cairo'],
    about:
      'Cairo occupies the Nile’s apex as the river fans toward the Mediterranean, with desert plateaus rising west toward Giza and east toward the Muqattam. Historic Islamic Cairo packs mosques, markets, and walled streets east of the river; modern districts and bridges spread across islands and the west bank. The pyramids on the Giza plateau sit close enough that ancient monuments and metropolitan sprawl share one visual field on clear days. Orientation begins with the Nile as spine: islands, corniche roads, and ferry logic, then the desert edges that constrain and define growth. Coptic quarters, Fatimid axes, and later downtown grids each leave distinct street fabrics. Dust, light, and river humidity shape the city’s atmosphere as much as architecture. Cairo’s durable primer is position — the hinge between Upper Egypt’s river corridor and the delta’s branching fertility — still hosting a vast continuous urban population beside pharaonic and medieval heritage.',
    facts: {
      kind: 'City',
      country: 'Egypt',
      region: 'Africa',
      setting: 'Nile apex · Giza plateau nearby',
      role: 'National capital and Nile metropolis',
      knownFor: 'Islamic historic core, Nile islands, and nearby pyramids',
    },
    features: [
      {
        name: 'Nile spine',
        description:
          'Bridges, islands, and corniche roads that organize movement through the metropolitan stretch.',
      },
      {
        name: 'Historic Islamic Cairo',
        description:
          'Mosques, markets, and gated streets preserving medieval urban grain east of the river.',
      },
      {
        name: 'Desert margins',
        description:
          'Giza and eastern plateaus that place ancient monuments against the living city’s edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cairo',
        url: 'https://www.britannica.com/place/Cairo',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Cairo',
        url: 'https://whc.unesco.org/en/list/89/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'istanbul',
    code: 'IST',
    name: 'Istanbul',
    kind: 'City',
    countrySlug: 'turkiye',
    subtitle: 'City · Türkiye',
    matchNames: ['Istanbul'],
    about:
      'Istanbul straddles the Bosporus, the narrow strait joining the Black Sea to the Sea of Marmara, so the city literally occupies two continents. The Historic Peninsula holds Byzantine churches, Ottoman mosques, and bazaar streets; across the Golden Horn and on the Asian shore, ferry-linked districts continue the same metropolitan life. Hills, waterfronts, and ferries matter more than a single grid. Hagia Sophia, Topkapı, and the Blue Mosque cluster near the tip of the old peninsula, while Galata and Beyoğlu rise on the opposite horn. Modern bridges and a rail tunnel now stitch shores that boats long connected alone. Orientation should start with water: which shore, which horn, which ferry landing. Markets, wooden waterside houses, and hillside neighborhoods keep texture amid towers. Istanbul’s primer is the strait itself — geography that made a capital, a trade hinge, and a continuously reinvented megacity.',
    facts: {
      kind: 'City',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Bosporus · Golden Horn',
      role: 'Transcontinental metropolis and former imperial capital',
      knownFor: 'Strait views, mosques, bazaars, and ferry networks',
    },
    features: [
      {
        name: 'Historic Peninsula',
        description:
          'Byzantine and Ottoman monuments packed onto the tip between Golden Horn and Marmara.',
      },
      {
        name: 'Bosporus shores',
        description:
          'European and Asian waterfronts linked by ferries, bridges, and hillside neighborhoods.',
      },
      {
        name: 'Golden Horn',
        description:
          'An inlet that separates old Istanbul from Galata and stages one of the city’s classic approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Istanbul',
        url: 'https://www.britannica.com/place/Istanbul',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Areas of Istanbul',
        url: 'https://whc.unesco.org/en/list/356/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'rio-de-janeiro',
    code: 'RIO',
    name: 'Rio de Janeiro',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Rio de Janeiro'],
    about:
      'Rio de Janeiro presses between granite peaks, Atlantic beaches, and a vast sheltered bay. Sugarloaf, Corcovado, and other inselbergs rise inside the urban fabric, so rainforest slopes and neighborhoods share the same visual frame. Copacabana and Ipanema arc along the ocean; Guanabara Bay holds the port and bridge approaches; the lagoon and tunnels knit districts that hills would otherwise isolate. Orientation is topographic: which beach, which bay shore, which mountain saddle. Favelas climb steep grades beside formal avenues; parks reclaim former estates on high ground. The statue of Christ the Redeemer crowns one peak as a civic landmark visible across much of the city. Rio’s primer is the collision of rock, forest, and shoreline — a setting that shapes climate, views, and the daily negotiation between dense settlement and dramatic relief.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Atlantic coast · Guanabara Bay',
      role: 'Major coastal metropolis and former national capital',
      knownFor: 'Peaks, beaches, bay, and hillside neighborhoods',
    },
    features: [
      {
        name: 'Ocean beaches',
        description:
          'Curving Atlantic strands backed by avenues, hotels, and abrupt mountain walls.',
      },
      {
        name: 'Bay and peaks',
        description:
          'Guanabara’s sheltered water paired with Sugarloaf and Corcovado as navigational landmarks.',
      },
      {
        name: 'Hillside fabric',
        description:
          'Steep settlements and tunnels that follow terrain rather than a flat grid.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rio de Janeiro',
        url: 'https://www.britannica.com/place/Rio-de-Janeiro-Brazil',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Rio de Janeiro landscape',
        url: 'https://whc.unesco.org/en/list/1100/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cape-town',
    code: 'CPT',
    name: 'Cape Town',
    kind: 'City',
    countrySlug: 'south-africa',
    subtitle: 'City · South Africa',
    matchNames: ['Cape Town'],
    about:
      'Cape Town sits where the Atlantic meets the Cape Peninsula, with Table Mountain’s flat summit rising directly above the city bowl. Harbor docks face north; beaches and cliffs wrap west and south toward the peninsula’s tip; suburbs spread onto the Cape Flats inland. The mountain is not a distant backdrop but a wall that organizes wind, cloud, and settlement. Orientation uses the bowl, the Atlantic Seaboard, False Bay, and the peninsula spine. Colonial and Victorian street grids occupy the bowl floor; later growth follows transport corridors across flatter ground. Fynbos vegetation and marine climate give the setting a Mediterranean-seeming clarity without Mediterranean latitude. Cape Town’s primer is the meeting of mountain, two oceans’ approaches, and a harbor city still shaped by that topography every clear afternoon when the tablecloth cloud spills over the summit.',
    facts: {
      kind: 'City',
      country: 'South Africa',
      region: 'Africa',
      setting: 'Cape Peninsula · Table Mountain',
      role: 'Legislative capital and Atlantic harbor city',
      knownFor: 'Table Mountain, peninsula shores, and the city bowl',
    },
    features: [
      {
        name: 'Table Mountain',
        description:
          'A sandstone plateau that walls the city bowl and anchors Cape Town’s skyline and weather.',
      },
      {
        name: 'Two-bay geography',
        description:
          'Atlantic and False Bay shores giving opposite faces of beach, cliff, and suburb.',
      },
      {
        name: 'Harbor bowl',
        description:
          'Docks and downtown streets nestled between mountain slopes and the northern waterfront.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cape Town',
        url: 'https://www.britannica.com/place/Cape-Town',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cape Floral Region',
        url: 'https://whc.unesco.org/en/list/1007/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sydney',
    code: 'SYD',
    name: 'Sydney',
    kind: 'City',
    countrySlug: 'australia',
    subtitle: 'City · Australia',
    matchNames: ['Sydney', 'Sydney Opera House'],
    about:
      'Sydney wraps a deeply indented harbor on Australia’s southeast coast, with sandstone headlands, ferry lanes, and beach suburbs defining daily geography. The Opera House and Harbour Bridge mark the inner harbor’s iconic pinch; beyond them, drowned river valleys create countless bays and point-to-point ferry routes. The CBD occupies a peninsula; residential quarters climb surrounding ridges and spill toward Pacific beaches like Bondi. Orientation is aqueous: which cove, which headland, which ferry wharf. Native bush remnants cling to slopes inside the metropolitan area, a reminder that the city grew into a rugged coastal landscape rather than a flat plain. Sydney’s primer is harbor morphology — a working and recreational waterway that still structures commuting, views, and the sense that neighborhoods face water as much as streets.',
    facts: {
      kind: 'City',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Port Jackson · Pacific coast',
      role: 'State capital and principal harbor metropolis',
      knownFor: 'Harbor inlets, beaches, and sandstone headlands',
    },
    features: [
      {
        name: 'Inner harbour icons',
        description:
          'Opera House sails and the steel arch bridge framing the Circular Quay approaches.',
      },
      {
        name: 'Ferry network',
        description:
          'Point-to-point boats that treat drowned valleys as the city’s secondary street system.',
      },
      {
        name: 'Ocean beaches',
        description:
          'Pacific strands east of the ridges, reached by short trips from harbor suburbs.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sydney',
        url: 'https://www.britannica.com/place/Sydney-Australia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Sydney Opera House',
        url: 'https://whc.unesco.org/en/list/166/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'marrakesh',
    code: 'RAK',
    name: 'Marrakesh',
    kind: 'City',
    countrySlug: 'morocco',
    subtitle: 'City · Morocco',
    matchNames: ['Marrakesh', 'Marrakech'],
    about:
      'Marrakesh rises from the Haouz plain with the High Atlas as a southern wall of snow-capped rock for much of the year. Inside the ochre ramparts, the medina packs riads, souks, and mosque minarets around Jemaa el-Fnaa, the great square that shifts from market daylight to evening gathering ground. Gardens and palm groves historically tempered the arid setting; French-era Guéliz opened a newer grid outside the walls. Orientation contrasts walled medina labyrinth with the mountain backdrop and the dry plain’s light. Red clay walls give the city its nickname and its chromatic unity. Marrakesh’s primer is oasis-edge urbanism: a trading and imperial city that used walls, shade, water channels, and courtyard houses to make dense life possible at the foot of North Africa’s highest range.',
    facts: {
      kind: 'City',
      country: 'Morocco',
      region: 'Africa',
      setting: 'Haouz plain · High Atlas foothills',
      role: 'Imperial city and southern Moroccan hub',
      knownFor: 'Ramparts, souks, palm gardens, and Atlas views',
    },
    features: [
      {
        name: 'Medina and square',
        description:
          'Jemaa el-Fnaa and the surrounding souks forming the living center inside the walls.',
      },
      {
        name: 'Ochre ramparts',
        description:
          'Clay-built walls and gates that still define the historic city’s edge and color.',
      },
      {
        name: 'Atlas backdrop',
        description:
          'High peaks south of the plain that give Marrakesh its dramatic horizon.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Marrakech',
        url: 'https://www.britannica.com/place/Marrakech',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Medina of Marrakesh',
        url: 'https://whc.unesco.org/en/list/331/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'kyoto',
    code: 'KYO',
    name: 'Kyoto',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Kyoto Temples', 'Kyoto'],
    about:
      'Kyoto occupies a basin ringed by forested hills, with a grid inherited from classical Chinese capital planning still faintly legible beneath later growth. For centuries it was Japan’s imperial seat; temples, shrines, and villa gardens remain unusually dense for a modern city of its size. Wooden townhouses, stone lanes, and river corridors keep a human scale even where traffic presses. Surrounding mountains supply maple and cherry seasons that read clearly from the basin floor. Orientation uses the north–south avenues, the Kamo river, and temple precincts as islands of quiet. Kyoto’s primer is continuity of capital culture inside a living city — not a frozen museum quarter, but a place where craft streets, university life, and sacred compounds share the same basin climate of mist, heat, and clear autumn light.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Yamashiro Basin · surrounding hills',
      role: 'Former imperial capital and temple city',
      knownFor: 'Shrines, gardens, wooden streets, and basin setting',
    },
    features: [
      {
        name: 'Temple precincts',
        description:
          'Buddhist complexes and Shinto approaches that punctuate the basin with forested compounds.',
      },
      {
        name: 'Classical grid',
        description:
          'Inherited avenue logic that still helps orient walks through the historic core.',
      },
      {
        name: 'Hill rim',
        description:
          'Encircling slopes that frame seasons, viewpoints, and the city’s sense of enclosure.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kyoto',
        url: 'https://www.britannica.com/place/Kyoto-Japan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Monuments of Ancient Kyoto',
        url: 'https://whc.unesco.org/en/list/688/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'venice',
    code: 'VCE',
    name: 'Venice',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Venice', 'Grand Canal'],
    about:
      'Venice is a lagoon city built on islands and piles, where canals replace streets and boats replace cars in the historic core. The Grand Canal snakes as the main artery; lesser waterways and footbridges knit sestieri into a pedestrian maze. Piazza San Marco and the Doge’s Palace mark the ceremonial heart; Arsenale and outer islands recall maritime republic power. Tide, salt air, and soft ground shape every facade and foundation. Orientation is by water first — canal names, vaporetto stops, and the lagoon horizon — then by the dense alley network between them. Venice’s primer is amphibious urbanism: a trading republic that turned mudbanks into stone palaces and still lives with acqua alta as an environmental condition, not a metaphor.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Venetian Lagoon · Adriatic',
      role: 'Historic maritime republic core and lagoon capital',
      knownFor: 'Canals, islands, bridges, and tide-shaped streets',
    },
    features: [
      {
        name: 'Grand Canal',
        description:
          'The S-shaped main waterway lined with palazzi and crossed by landmark bridges.',
      },
      {
        name: 'Island sestieri',
        description:
          'Districts linked by footbridges where walking and boats replace ordinary streets.',
      },
      {
        name: 'Lagoon setting',
        description:
          'Shallow waters, barrier islands, and tides that define climate and access.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Venice',
        url: 'https://www.britannica.com/place/Venice',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Venice and its Lagoon',
        url: 'https://whc.unesco.org/en/list/394/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'california',
    code: 'CA',
    name: 'California',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['California'],
    about:
      'California stretches along the Pacific from redwood coasts and foggy headlands through Central Valley farmland to desert basins and the Sierra Nevada crest. Plate tectonics write the map: coastal ranges, a great agricultural trough, and high granite mountains with deep valleys such as Yosemite. Mediterranean climates dominate much of the coast and foothills; true deserts occupy the southeast. Cities cluster on coastal plains and inland valleys, while parks preserve volcano remnants, sequoia groves, and arid canyons. Orientation should move west to east — ocean, ranges, valley, sierra, desert — rather than treating the state as one climate. California’s primer is physiographic diversity inside a single political outline: a Pacific edge state whose landscapes swing from surf to alpine snow within a day’s traverse.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Pacific coast · Central Valley · Sierra Nevada',
      role: 'Most populous U.S. state; Pacific economic hub',
      knownFor: 'Coast, mountains, valleys, and desert belts',
    },
    features: [
      {
        name: 'Pacific edge',
        description:
          'Headlands, beaches, and coastal ranges shaped by fog, surf, and active tectonics.',
      },
      {
        name: 'Central Valley',
        description:
          'A long agricultural trough between coastal ranges and the Sierra Nevada.',
      },
      {
        name: 'High Sierra',
        description:
          'Granite peaks, glacial valleys, and parks that define the state’s eastern wall.',
      },
    ],
    sources: [
      {
        label: 'Britannica — California',
        url: 'https://www.britannica.com/place/California-state',
        kind: 'reference',
      },
      {
        label: 'National Park Service — California parks',
        url: 'https://www.nps.gov/state/ca/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tuscany',
    code: 'TUS',
    name: 'Tuscany',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Tuscany'],
    about:
      'Tuscany occupies west-central Italy between the Apennines and the Tyrrhenian Sea, a landscape of rounded hills, river valleys, and stone towns. Florence anchors the Arno; Siena and hill villages crown ridges with brick and limestone. Vineyards, olive groves, and cypress lines are cultural vegetation as much as agriculture — patterns laid down over centuries of estate farming. Etruscan and medieval layers precede Renaissance urban flowering. Orientation uses hill crests, valley floors, and the coastal Maremma as distinct belts. Tuscany’s primer is cultivated terrain: not wilderness spectacle, but a humanized countryside where town, farm, and art patronage grew from the same slopes.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Apennine foothills · Tyrrhenian edge',
      role: 'Historic cultural region and agricultural heartland',
      knownFor: 'Hill towns, vineyards, and Renaissance cities',
    },
    features: [
      {
        name: 'Hill towns',
        description:
          'Ridge-top settlements with walls, towers, and views across farmed valleys.',
      },
      {
        name: 'Cultivated slopes',
        description:
          'Vines, olives, and cypress patterns that give the countryside its classic silhouette.',
      },
      {
        name: 'Arno corridor',
        description:
          'Florence and river towns linking mountain catchments to the western lowlands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tuscany',
        url: 'https://www.britannica.com/place/Tuscany',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Val d’Orcia',
        url: 'https://whc.unesco.org/en/list/1026/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'provence',
    code: 'PRO',
    name: 'Provence',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Provence'],
    about:
      'Provence covers much of southeastern France from the Rhône corridor and Alpilles toward the Mediterranean littoral. Limestone hills, lavender plateaus, vineyards, and port cities share a luminous dry-summer climate. Roman roads and aqueducts underlay later Provençal towns; Avignon, Aix, and Arles mark different historical weights. The coast mixes cliffs, calanques, and working harbors; inland, villages perch above olive and vine terraces. Orientation runs from river plain to hinterland ridges to sea. Provence’s primer is Mediterranean France before the postcard — light, stone, wind (the mistral), and a long agricultural–urban continuum facing the same warm sea that shaped Catalonia and Liguria nearby.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Rhône–Mediterranean southeast',
      role: 'Historic Mediterranean cultural region',
      knownFor: 'Limestone light, vineyards, and coastal–inland contrast',
    },
    features: [
      {
        name: 'Limestone hills',
        description:
          'Pale rock ridges and plateaus that catch the hard southern light.',
      },
      {
        name: 'Agricultural mosaic',
        description:
          'Lavender, vines, olives, and market towns spread across dry-summer valleys.',
      },
      {
        name: 'Mediterranean edge',
        description:
          'Ports, cliffs, and calanques where hinterland routes meet the sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Provence',
        url: 'https://www.britannica.com/place/Provence-region-France',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Arles Roman monuments',
        url: 'https://whc.unesco.org/en/list/164/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'bavaria',
    code: 'BY',
    name: 'Bavaria',
    kind: 'State',
    countrySlug: 'germany',
    subtitle: 'State · Germany',
    matchNames: ['Bavaria', 'Neuschwanstein'],
    about:
      'Bavaria is Germany’s large southeastern state, stretching from the Danube plains and Franconian forests to the Alpine frontier with Austria. Munich anchors the south; Nuremberg and other Franconian cities mark the north. Lakes, foothills, and castle-studded approaches to the Alps define tourist geography, while industry and universities shape the modern economy. Baroque churches, beer-garden culture, and distinct regional dialects sit alongside a high-tech present. Orientation divides Alpine edge, pre-Alpine lakes, and northern plateaus. Bavaria’s primer is scale and contrast inside one Land: dairy meadows under limestone peaks, then rolling Franconia with vineyards and timbered towns farther from the snow line.',
    facts: {
      kind: 'State',
      country: 'Germany',
      region: 'Europe',
      setting: 'Alps to Franconian uplands',
      role: 'Largest German state by area; major economic region',
      knownFor: 'Alpine edge, lakes, castles, and Franconian towns',
    },
    features: [
      {
        name: 'Alpine frontier',
        description:
          'Peaks, foothills, and fairy-tale castles along the southern borderlands.',
      },
      {
        name: 'Munich basin',
        description:
          'The southern metropolis and surrounding plains that organize much of state life.',
      },
      {
        name: 'Franconian north',
        description:
          'Forests, vineyards, and historic cities with a different grain from the Alpine south.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bavaria',
        url: 'https://www.britannica.com/place/Bavaria',
        kind: 'reference',
      },
      {
        label: 'Bavarian state portal',
        url: 'https://www.bayern.de/english/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'kerala',
    code: 'KL',
    name: 'Kerala',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Kerala'],
    about:
      'Kerala is a narrow state on India’s southwestern Malabar Coast, backed by the Western Ghats and laced with backwater lagoons and canals. Coconut palms, rice paddies, and spice slopes structure the humid coastal plain; tea and shola forests occupy higher elevations. Cities and towns string along the shore and inland waterways rather than around a single dominant metropolis. Monsoon rhythm and water transport historically mattered as much as roads. Orientation runs west–east in a short distance: surf, lagoon, midland hills, ghats. Kerala’s primer is tropical littoral geography — a fertile, watery edge state where houseboats, ferries, and rain-fed agriculture still explain settlement better than dry-plateau models from inland India.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Malabar Coast · Western Ghats',
      role: 'Coastal Indian state known for backwaters and high literacy',
      knownFor: 'Lagoons, palms, ghats, and monsoon coast life',
    },
    features: [
      {
        name: 'Backwaters',
        description:
          'Interconnected lagoons and canals that support boats, villages, and wetland farming.',
      },
      {
        name: 'Coastal plain',
        description:
          'Humid lowlands of palms, rice, and densely settled shore towns.',
      },
      {
        name: 'Western Ghats rise',
        description:
          'A short climb to cooler hills, tea slopes, and forested catchments.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kerala',
        url: 'https://www.britannica.com/place/Kerala',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Western Ghats',
        url: 'https://whc.unesco.org/en/list/1342/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'scotland',
    code: 'SCT',
    name: 'Scotland',
    kind: 'Region',
    countrySlug: 'united-kingdom',
    subtitle: 'Region · United Kingdom',
    matchNames: ['Scotland'],
    about:
      'Scotland occupies the northern third of Great Britain, with Highlands, islands, and a more urban Central Belt between Glasgow and Edinburgh. Glaciated mountains, lochs, and sea lochs dominate the north and west; the east holds firths and agricultural lowlands. Gaelic and Scots cultural geographies overlay a modern UK nation with its own legal and educational traditions. Orientation should separate Highland massif, island archipelagos (Hebrides, Northern Isles), and the crowded waist where most people live. Scotland’s primer is northern Atlantic Europe: short summer light in the far north, wet west coasts, and a capital ridge city facing the Firth of Forth while industry and ports shaped the Clyde.',
    facts: {
      kind: 'Region',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Northern Great Britain · Atlantic approaches',
      role: 'Constituent country of the UK with distinct institutions',
      knownFor: 'Highlands, lochs, islands, and the Central Belt',
    },
    features: [
      {
        name: 'Highlands',
        description:
          'Rugged mountains, glens, and lochs forming the classic northern landscape.',
      },
      {
        name: 'Island groups',
        description:
          'Hebrides and northern archipelagos with distinct maritime cultures.',
      },
      {
        name: 'Central Belt',
        description:
          'The Glasgow–Edinburgh corridor where population and institutions concentrate.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Scotland',
        url: 'https://www.britannica.com/place/Scotland',
        kind: 'reference',
      },
      {
        label: 'VisitScotland — About Scotland',
        url: 'https://www.visitscotland.com/about',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'andalusia',
    code: 'AND',
    name: 'Andalusia',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Andalusia', 'Alhambra'],
    about:
      'Andalusia covers southern Spain from the Sierra Morena to the Mediterranean and Atlantic coasts, with the Guadalquivir valley as an agricultural spine. Seville, Córdoba, and Granada hold layered Islamic and Christian monumental cores; white hill towns punctuate inland ranges. Hot summers, olive landscapes, and Atlantic–Mediterranean dual shores define climate and crop. The Strait of Gibraltar places Africa within visual and historical range. Orientation uses valley, sierras, and coasts as three interlocking belts. Andalusia’s primer is southern Iberia’s cultural crossroads — Almohad and Nasrid architecture, flamenco geographies, and port cities that faced both oceans of Spanish maritime history.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Southern Iberia · Guadalquivir basin',
      role: 'Spain’s southern autonomous community',
      knownFor: 'Historic cities, sierras, olives, and dual coasts',
    },
    features: [
      {
        name: 'Monumental cities',
        description:
          'Seville, Córdoba, and Granada preserving major Islamic and later Christian layers.',
      },
      {
        name: 'Guadalquivir valley',
        description:
          'A fertile corridor of farms, river towns, and heat-shaped daily rhythms.',
      },
      {
        name: 'Coast and strait',
        description:
          'Atlantic and Mediterranean shores meeting near the gateway to North Africa.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Andalusia',
        url: 'https://www.britannica.com/place/Andalusia-region-Spain',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Alhambra, Generalife and Albayzín',
        url: 'https://whc.unesco.org/en/list/314/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'quebec',
    code: 'QC',
    name: 'Quebec',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Province · Canada',
    matchNames: ['Quebec', 'Québec'],
    about:
      'Quebec is Canada’s largest province by area, stretching from the St. Lawrence lowlands to vast boreal and northern territories. French language and civil-law traditions distinguish it within the Canadian federation. Quebec City’s fortifications overlook the river’s narrowing; Montreal occupies an island farther upstream in a denser metropolitan setting. Forests, hydroelectric rivers, and harsh winters shape settlement and energy geography. Orientation follows the St. Lawrence corridor first, then the immense hinterland beyond. Quebec’s primer is continental scale plus cultural specificity: a North American jurisdiction whose public life, place names, and riverine cities remain firmly Francophone while sharing the boreal continent with the rest of Canada.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'St. Lawrence · boreal north',
      role: 'Francophone Canadian province',
      knownFor: 'River cities, northern forests, and French public life',
    },
    features: [
      {
        name: 'St. Lawrence axis',
        description:
          'The river corridor concentrating cities, farms, and historic settlement.',
      },
      {
        name: 'Fortified capital',
        description:
          'Quebec City’s cliffs and walls marking a strategic river pinch point.',
      },
      {
        name: 'Boreal hinterland',
        description:
          'Vast forest and taiga territories that dwarf the southern inhabited belt.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Quebec',
        url: 'https://www.britannica.com/place/Quebec-province',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic District of Old Québec',
        url: 'https://whc.unesco.org/en/list/300/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'santorini',
    code: 'SAN',
    name: 'Santorini',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Santorini Caldera', 'Santorini'],
    about:
      'Santorini is a volcanic caldera island in the southern Aegean, its cliffs wrapping a drowned crater filled with deep blue water. Whitewashed villages cling to the rim; black and red beaches record eruptive history; the caldera drop is the island’s essential landform. Ancient Akrotiri preserves a Bronze Age town buried by eruption. Orientation is rim versus caldera floor (now sea) versus outer slopes. Ferries enter through the broken ring; donkey paths and switchback roads climb to cliff towns. Santorini’s primer is geology made habitat — a catastrophic volcanic structure reused as terraces, caves, and lookout streets above one of the Mediterranean’s most dramatic marine basins.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · Aegean volcanic arc',
      role: 'Caldera island and archaeological landscape',
      knownFor: 'Cliff villages, volcanic beaches, and crater sea',
    },
    features: [
      {
        name: 'Caldera rim',
        description:
          'White villages and terraces perched hundreds of meters above the flooded crater.',
      },
      {
        name: 'Volcanic shores',
        description:
          'Black, red, and pumice beaches recording successive eruptive layers.',
      },
      {
        name: 'Akrotiri',
        description:
          'A buried Bronze Age settlement that ties the island’s mythic fame to real geology.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Thera',
        url: 'https://www.britannica.com/place/Thera',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Akrotiri (tentative context via Greece lists)',
        url: 'https://whc.unesco.org/en/statesparties/gr',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'bali',
    code: 'BAL',
    name: 'Bali',
    kind: 'Island',
    countrySlug: 'indonesia',
    subtitle: 'Island · Indonesia',
    matchNames: ['Bali'],
    about:
      'Bali is a compact Indonesian island east of Java, with a volcanic spine, terraced rice landscapes, and reefs along warmer southern shores. Hindu temple culture shapes villages, calendars, and water temples that regulate irrigation cooperatives. Upland valleys hold cooler air and classical dance traditions; beach tourism concentrates on the south. Orientation follows volcanoes and ridges first, then the wet–dry agricultural mosaic of subak terraces. Bali’s primer is cultivated tropical volcanism: fertile ash soils, ritual water management, and a dense cultural landscape living on an active arc island inside the wider Indonesian archipelago.',
    facts: {
      kind: 'Island',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Lesser Sunda Islands · volcanic arc',
      role: 'Cultural island province with intensive wet-rice landscapes',
      knownFor: 'Rice terraces, temples, and volcanic highlands',
    },
    features: [
      {
        name: 'Subak terraces',
        description:
          'Cooperative irrigation landscapes recognized for linking ritual and rice farming.',
      },
      {
        name: 'Volcanic spine',
        description:
          'Peaks and crater lakes that organize climate belts across the short island width.',
      },
      {
        name: 'Temple villages',
        description:
          'Compound architecture and ceremonial calendars structuring daily geography.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bali',
        url: 'https://www.britannica.com/place/Bali-island-and-province-Indonesia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cultural Landscape of Bali',
        url: 'https://whc.unesco.org/en/list/1194/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'hawaii',
    code: 'HI',
    name: 'Hawaii',
    kind: 'Island',
    countrySlug: 'united-states',
    subtitle: 'Island chain · United States',
    matchNames: ['Hawaii'],
    about:
      'Hawaii is an isolated volcanic archipelago in the central North Pacific, with islands that are peaks of a hotspot chain. Active volcanism continues on the Island of Hawaiʻi; older islands show eroded shields, cliffs, and coral reefs. Trade winds create wet windward and dry leeward sides within short distances. Polynesian voyaging established the cultural foundation; later plantation and tourism economies reshaped coasts. Orientation is island-by-island and windward–leeward, not a single mainland-style region. Hawaii’s primer is extreme isolation plus vertical climate: rainforest, alpine desert on high summits, and tropical shores on the same island mass, far from any continent.',
    facts: {
      kind: 'Island',
      country: 'United States',
      region: 'Americas',
      setting: 'Central North Pacific hotspot chain',
      role: 'U.S. state composed entirely of oceanic islands',
      knownFor: 'Shield volcanoes, trade-wind climates, and reef coasts',
    },
    features: [
      {
        name: 'Hotspot volcanoes',
        description:
          'Shield peaks and lava landscapes marking the Pacific plate’s motion over a mantle plume.',
      },
      {
        name: 'Windward and leeward',
        description:
          'Rainforest versus dry slopes created by trade winds over island summits.',
      },
      {
        name: 'Isolated reefs',
        description:
          'Coral coasts and marine life shaped by remoteness in deep ocean.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hawaii',
        url: 'https://www.britannica.com/place/Hawaii-state',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Hawaiʻi Volcanoes',
        url: 'https://www.nps.gov/havo/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sicily',
    code: 'SIC',
    name: 'Sicily',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Sicily', 'Mount Etna'],
    about:
      'Sicily is the Mediterranean’s largest island, a triangular landmass near the Italian peninsula with Mount Etna dominating the east. Greek temples, Roman villas, Arab–Norman monuments, and baroque towns record successive powers. Interior wheat hills, citrus coasts, and volcanic soils structure agriculture; Palermo and Catania anchor opposite urban poles. The Strait of Messina is a narrow separation from the mainland. Orientation uses the three coasts and Etna as a beacon. Sicily’s primer is a crossroads island: African, European, and Near Eastern influences layered on fertile volcanic and limestone ground in the middle sea.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Central Mediterranean · Etna',
      role: 'Italy’s largest island region',
      knownFor: 'Etna, classical sites, and crossroads cultures',
    },
    features: [
      {
        name: 'Mount Etna',
        description:
          'An active stratovolcano whose slopes host towns, vineyards, and frequent eruptions.',
      },
      {
        name: 'Three coasts',
        description:
          'Tyrrhenian, Ionian, and Mediterranean shores giving the island distinct faces.',
      },
      {
        name: 'Layered capitals',
        description:
          'Cities preserving Greek, Roman, Norman, and later architectural chapters.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sicily',
        url: 'https://www.britannica.com/place/Sicily',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mount Etna',
        url: 'https://whc.unesco.org/en/list/1427/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'galapagos',
    code: 'GPS',
    name: 'Galápagos',
    kind: 'Island',
    countrySlug: 'ecuador',
    subtitle: 'Island group · Ecuador',
    matchNames: ['Galápagos', 'Galapagos'],
    about:
      'The Galápagos are a remote volcanic archipelago on the equator in the Pacific, belonging to Ecuador yet isolated by hundreds of kilometers of open ocean. Young lava fields, older eroded islands, and cold–warm current collisions create stark habitats where endemic species evolved in relative isolation. Darwin’s visit made the islands emblematic of evolutionary biology; today they remain a tightly managed natural laboratory and park. Orientation is island-by-island with ocean currents as climate engines. The Galápagos primer is isolation plus volcanism: seabirds, reptiles, and pioneer plants colonizing raw rock in a setting where human towns exist only as small footholds on a few islands.',
    facts: {
      kind: 'Island',
      country: 'Ecuador',
      region: 'Americas',
      setting: 'Equatorial Pacific · volcanic hotspot',
      role: 'Protected archipelago and evolutionary landmark',
      knownFor: 'Endemic wildlife, lava landscapes, and isolation',
    },
    features: [
      {
        name: 'Volcanic islands',
        description:
          'Shield volcanoes and lava fields at different erosional ages across the chain.',
      },
      {
        name: 'Ocean current mix',
        description:
          'Cool and warm waters meeting to shape marine productivity and climate.',
      },
      {
        name: 'Endemic lineages',
        description:
          'Species that diversified in isolation and still define the islands’ scientific fame.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Galápagos Islands',
        url: 'https://www.britannica.com/place/Galapagos-Islands',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Galápagos Islands',
        url: 'https://whc.unesco.org/en/list/1/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'jeju',
    code: 'CJU',
    name: 'Jeju',
    kind: 'Island',
    countrySlug: 'korea-south',
    subtitle: 'Island · Korea, South',
    matchNames: ['Jeju', 'Jeju Island'],
    about:
      'Jeju is a volcanic island south of the Korean Peninsula, dominated by Hallasan at its center and ringed by coastal tuff cones, lava tubes, and beaches. Basalt walls, parasitic cones, and a humid oceanic climate create landscapes distinct from mainland Korea. Traditional stone houses, diving culture, and tangerine groves mark human adaptation to volcanic soils. Orientation is radial: summit, mid-slope forests, coastal belt. Jeju’s primer is a shield-volcano island as province — a single mountain massif made into farms, trails, and seaside towns, with underground lava caves recording how the island grew.',
    facts: {
      kind: 'Island',
      country: 'Korea, South',
      region: 'Asia',
      setting: 'Korea Strait · Hallasan shield',
      role: 'Volcanic island province south of the peninsula',
      knownFor: 'Hallasan, lava tubes, and basalt coasts',
    },
    features: [
      {
        name: 'Hallasan',
        description:
          'The central shield volcano and highest peak of South Korea.',
      },
      {
        name: 'Lava tubes',
        description:
          'Cave systems formed by flowing basalt, part of a recognized volcanic heritage.',
      },
      {
        name: 'Coastal cones',
        description:
          'Tuff rings and secondary vents punctuating the shoreline belt.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cheju Island',
        url: 'https://www.britannica.com/place/Cheju-Island',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Jeju Volcanic Island and Lava Tubes',
        url: 'https://whc.unesco.org/en/list/1264/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'zanzibar',
    code: 'ZNZ',
    name: 'Zanzibar',
    kind: 'Island',
    countrySlug: 'tanzania',
    subtitle: 'Island · Tanzania',
    matchNames: ['Zanzibar', 'Stone Town'],
    about:
      'Zanzibar refers especially to Unguja, the main island of Tanzania’s Zanzibar archipelago off the Swahili Coast. Stone Town’s carved doors, coral-stone houses, and waterfront forts record Omani, Indian Ocean, and East African trade. Clove plantations and coral beaches structure the island’s rural and coastal belts. The channel to the mainland is short enough for ferries yet culturally distinct. Orientation contrasts Stone Town’s alleys with plantation interior and east-coast beaches. Zanzibar’s primer is the Swahili maritime world — an island entrepôt where monsoon trade winds once moved spices, cloth, and people across the western Indian Ocean.',
    facts: {
      kind: 'Island',
      country: 'Tanzania',
      region: 'Africa',
      setting: 'Swahili Coast · Indian Ocean',
      role: 'Semi-autonomous island with historic trade capital',
      knownFor: 'Stone Town, cloves, and coral coasts',
    },
    features: [
      {
        name: 'Stone Town',
        description:
          'A coral-stone historic center of alleys, doors, and waterfront forts.',
      },
      {
        name: 'Plantation belt',
        description:
          'Spice and clove landscapes that shaped the island’s export economy.',
      },
      {
        name: 'East-coast reefs',
        description:
          'Beaches and coral shallows facing the open Indian Ocean swell.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zanzibar',
        url: 'https://www.britannica.com/place/Zanzibar-island-Tanzania',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Stone Town of Zanzibar',
        url: 'https://whc.unesco.org/en/list/173/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mount-fuji',
    code: 'FUJ',
    name: 'Mount Fuji',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Mount Fuji'],
    about:
      'Mount Fuji is a stratovolcano on the boundary of Honshu’s Yamanashi and Shizuoka prefectures, its near-symmetric cone rising alone above surrounding lowlands and lakes. Sacred in art and pilgrimage traditions, it is also a clear geologic form: summit crater, forested flanks, and a five-lake district along the northern approach. Visibility from Tokyo on clear winter days makes it a metropolitan horizon marker as well as a mountain. Orientation is circumferential — different faces, climbing routes, and lake viewpoints — rather than a single “front.” Mount Fuji’s primer is iconic isolation: a volcano whose shape became a national emblem while remaining an active-system mountain with weather, altitude belts, and volcanic risk as real as its silhouette.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Chūbu · Fuji Five Lakes',
      role: 'Japan’s highest peak and cultural icon',
      knownFor: 'Symmetric cone, pilgrimage routes, and lake views',
    },
    features: [
      {
        name: 'Summit cone',
        description:
          'A cratered peak whose clean profile defines one of the world’s most recognized skylines.',
      },
      {
        name: 'Fuji Five Lakes',
        description:
          'Northern lakes offering classic reflection views and approach corridors.',
      },
      {
        name: 'Forest flanks',
        description:
          'Altitude belts from evergreen forest to volcanic scree along climbing routes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Fuji',
        url: 'https://www.britannica.com/place/Mount-Fuji',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Fujisan',
        url: 'https://whc.unesco.org/en/list/1418/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'grand-canyon',
    code: 'GCA',
    name: 'Grand Canyon',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Grand Canyon'],
    about:
      'The Grand Canyon is a vast Colorado River gorge in northern Arizona, exposing stacked rock layers that record nearly two billion years of Earth’s crustal history in places. Rim forests sit around 2,000 meters; the river corridor far below is a hotter desert world. Horizontal strata, side canyons, and buttes create a labyrinth readable from South and North Rim overlooks. Orientation is rim versus inner canyon, river mile, and which wall you stand on. The Grand Canyon’s primer is deep time made topographic — erosion and uplift writing a cross-section large enough that weather and ecology change vertically within a single view.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Colorado Plateau · northern Arizona',
      role: 'Iconic erosional gorge and national park',
      knownFor: 'Layered rock walls, rim overlooks, and river corridor',
    },
    features: [
      {
        name: 'Stratified walls',
        description:
          'Color-banded cliffs exposing a long geologic column in continuous section.',
      },
      {
        name: 'Rim overlooks',
        description:
          'South and North Rim viewpoints that reveal scale without descending the gorge.',
      },
      {
        name: 'Colorado corridor',
        description:
          'The river and side canyons that cut and continue to shape the inner canyon.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Grand Canyon',
        url: 'https://www.britannica.com/place/Grand-Canyon',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Grand Canyon',
        url: 'https://www.nps.gov/grca/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'machu-picchu',
    code: 'MPU',
    name: 'Machu Picchu',
    kind: 'Landmark',
    countrySlug: 'peru',
    subtitle: 'Landmark · Peru',
    matchNames: ['Machu Picchu'],
    about:
      'Machu Picchu is an Inca royal estate set on a narrow ridge above the Urubamba River in Peru’s tropical Andean cloud forest. Stone terraces, temples, and residences fit the spine between Huayna Picchu and the main peak, with sheer drops to the river bend below. Precision-cut masonry and agricultural terraces show how highland engineering adapted to steep topography. Orientation is ridge axis, river gorge, and the surrounding green peaks that hide the site from the valley floor. Machu Picchu’s primer is Andean urbanism in miniature — a planned compound using stone, water channels, and terraces to occupy a dramatic saddle rather than a flat plain.',
    facts: {
      kind: 'Landmark',
      country: 'Peru',
      region: 'Americas',
      setting: 'Eastern Andes · Urubamba gorge',
      role: 'Inca ridge estate and World Heritage site',
      knownFor: 'Terraces, megalithic walls, and cloud-forest peaks',
    },
    features: [
      {
        name: 'Ridge compound',
        description:
          'Temples and dwellings aligned to the saddle between steep forested peaks.',
      },
      {
        name: 'Agricultural terraces',
        description:
          'Stepped fields that stabilize slopes and feed the elevated settlement.',
      },
      {
        name: 'Urubamba gorge',
        description:
          'The river bend far below that isolates and frames the ridge site.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Machu Picchu',
        url: 'https://www.britannica.com/place/Machu-Picchu',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Sanctuary of Machu Picchu',
        url: 'https://whc.unesco.org/en/list/274/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'petra',
    code: 'PET',
    name: 'Petra',
    kind: 'Landmark',
    countrySlug: 'jordan',
    subtitle: 'Landmark · Jordan',
    matchNames: ['Petra'],
    about:
      'Petra is a Nabataean rock-cut city in southern Jordan’s sandstone mountains, approached through the Siq, a narrow gorge that opens onto facades carved into rose-colored cliffs. Tombs, a theater, and temples exploit soft sandstone while water channels and cisterns made desert urban life possible. Hellenistic decorative vocabularies meet Arabian trade-route geography. Orientation follows the Siq into the main valley, then up to High Place trails and wider basin ruins. Petra’s primer is hydrology plus stone carving: a trading capital that turned cliffs into architecture and flash-flood catchments into engineered supply.',
    facts: {
      kind: 'Landmark',
      country: 'Jordan',
      region: 'Asia',
      setting: 'Sharāh mountains · sandstone basin',
      role: 'Nabataean capital and archaeological park',
      knownFor: 'Rock-cut facades, the Siq, and desert waterworks',
    },
    features: [
      {
        name: 'The Siq',
        description:
          'A winding gorge entrance that frames the sudden reveal of carved facades.',
      },
      {
        name: 'Rock-cut tombs',
        description:
          'Monumental facades cut into sandstone cliffs, including Al-Khazneh.',
      },
      {
        name: 'Water systems',
        description:
          'Channels and cisterns that captured scarce rainfall for a desert city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Petra',
        url: 'https://www.britannica.com/place/Petra-Jordan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Petra',
        url: 'https://whc.unesco.org/en/list/326/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'angkor-wat',
    code: 'ANG',
    name: 'Angkor Wat',
    kind: 'Landmark',
    countrySlug: 'cambodia',
    subtitle: 'Landmark · Cambodia',
    matchNames: ['Angkor Wat'],
    about:
      'Angkor Wat is the great temple-mountain complex near Siem Reap, built by the Khmer Empire as a state temple and later maintained within a wider archaeological landscape of reservoirs, causeways, and neighboring temples. Its moat, galleries, and central towers model Mount Meru in stone and laterite, oriented to solar and cosmological schemes. Bas-reliefs narrate epics along long corridors. Orientation moves from moat and western approach through concentric galleries to the upper quincunx of towers. Angkor Wat’s primer is hydraulic civilization made sacred architecture — one monument inside a regional system of barays and temples that supported a lowland capital in monsoon Southeast Asia.',
    facts: {
      kind: 'Landmark',
      country: 'Cambodia',
      region: 'Asia',
      setting: 'Tonlé Sap lowlands · Angkor region',
      role: 'Khmer temple-mountain and national emblem',
      knownFor: 'Moat, towers, galleries, and bas-relief corridors',
    },
    features: [
      {
        name: 'Temple-mountain',
        description:
          'Concentric galleries rising to a five-tower summit that models sacred geography.',
      },
      {
        name: 'Moat and causeway',
        description:
          'A vast water boundary and western approach staging the monumental entry.',
      },
      {
        name: 'Relief galleries',
        description:
          'Carved narrative walls that turn architecture into continuous storytelling.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Angkor Wat',
        url: 'https://www.britannica.com/topic/Angkor-Wat',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Angkor',
        url: 'https://whc.unesco.org/en/list/668/',
        kind: 'authority',
      },
    ],
  },
  ...(placeGuideDraftsBatch2 as PlaceGuideDraft[]),
  ...(placeGuideDraftsBatch3 as PlaceGuideDraft[]),
  ...(placeGuideDraftsBatch4 as PlaceGuideDraft[]),
  ...(placeGuideDraftsBatch5 as PlaceGuideDraft[]),
  ...(placeGuideDraftsBatch6 as PlaceGuideDraft[]),
  ...(placeGuideDraftsBatch7 as PlaceGuideDraft[]),
]

export const placeGuides: PlaceGuide[] = placeGuideDrafts.map(withPhoto)

export function placeGuideSlugs(): string[] {
  return placeGuides.map((place) => place.slug)
}

export function getPlaceGuide(slug: string): PlaceGuide | undefined {
  return placeGuides.find((place) => place.slug === slug)
}

export function placesForCountry(countrySlug: string): PlaceGuide[] {
  return placeGuides.filter((place) => place.countrySlug === countrySlug)
}

export function placeGuidesByKind(): [PlaceKind, PlaceGuide[]][] {
  const order: PlaceKind[] = ['City', 'State', 'Region', 'Island', 'Landmark']
  const groups = new Map<PlaceKind, PlaceGuide[]>()
  for (const kind of order) groups.set(kind, [])
  for (const place of placeGuides) {
    groups.get(place.kind)?.push(place)
  }
  return order
    .map((kind) => [kind, groups.get(kind) ?? []] as [PlaceKind, PlaceGuide[]])
    .filter(([, list]) => list.length > 0)
}

/** Find a child place guide that should link from a country Places blurb. */
export function matchPlaceGuideForBlurb(
  countrySlug: string,
  blurbName: string,
): PlaceGuide | undefined {
  const folded = foldName(blurbName)
  let best: { place: PlaceGuide; score: number } | undefined
  for (const place of placesForCountry(countrySlug)) {
    for (const name of [place.name, ...place.matchNames]) {
      const candidate = foldName(name)
      if (!candidate) continue
      let score = 0
      if (candidate === folded) score = 300 + candidate.length
      else if (folded.includes(candidate) || candidate.includes(folded)) {
        score = 100 + candidate.length
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { place, score }
      }
    }
  }
  return best?.place
}

export function placeHref(place: Pick<PlaceGuide, 'countrySlug' | 'slug'>): string {
  return `/explore/${place.countrySlug}/${place.slug}`
}

export function placeDescription(place: PlaceGuide): string {
  return place.about
}

export function placeStaticParams(): { slug: string; place: string }[] {
  return placeGuides.map((guide) => ({
    slug: guide.countrySlug,
    place: guide.slug,
  }))
}

/** Guard: every place parent must exist; slugs must not collide with countries. */
export function assertPlaceCatalogIntegrity(): void {
  const seen = new Set<string>()
  for (const place of placeGuideDrafts) {
    if (seen.has(place.slug)) {
      throw new Error(`Duplicate place slug: ${place.slug}`)
    }
    seen.add(place.slug)
    if (getCountry(place.slug)) {
      throw new Error(`Place slug collides with country slug: ${place.slug}`)
    }
    if (!getCountry(place.countrySlug)) {
      throw new Error(
        `Place ${place.slug} references missing country ${place.countrySlug}`,
      )
    }
  }
}

function foldName(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
