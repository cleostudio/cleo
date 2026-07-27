/** Eighteenth curated wave of Explore place guides. */

type PlaceKind = 'City' | 'State' | 'Island' | 'Region' | 'Landmark'

export type PlaceGuideDraftBatch = {
  slug: string
  code: string
  name: string
  kind: PlaceKind
  countrySlug: string
  subtitle: string
  matchNames: string[]
  about: string
  facts: {
    kind: PlaceKind
    country: string
    region: string
    setting: string
    role: string
    knownFor: string
  }
  features: [
    { name: string; description: string },
    { name: string; description: string },
    { name: string; description: string },
  ]
  sources: Array<{
    label: string
    url: string
    kind: 'place' | 'reference' | 'authority'
  }>
}

export const placeGuideDraftsBatch18: PlaceGuideDraftBatch[] = [
  {
    slug: 'tulsa',
    code: 'TUL',
    name: 'Tulsa',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Tulsa'],
    about:
      'Tulsa sits on the Arkansas River in northeastern Oklahoma as an oil-era city of Art Deco towers, river parks, and prairie approaches to the Ozark fringe. Downtown’s Deco cluster and Route 66 threads mark the historic core; humid summers and sharp thunderstorms shape the year. Orient from the riverfront through the Deco skyline to the surrounding prairie hills. Tulsa’s primer is Arkansas River oil city — Deco towers and prairie light in northeastern Oklahoma.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Arkansas River · northeastern Oklahoma',
      role: 'Northeastern Oklahoma metro and river city',
      knownFor: 'Art Deco skyline, Arkansas River parks, and prairie approaches',
    },
    features: [
      {
        name: 'Art Deco skyline',
        description:
          'Oil-era towers that define downtown.',
      },
      {
        name: 'Arkansas Riverfront',
        description:
          'Parks and crossings along the river bend.',
      },
      {
        name: 'Prairie fringe',
        description:
          'Grassland approaches toward the Ozarks.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Tulsa',
        url: 'https://www.britannica.com/place/Tulsa-Oklahoma',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fresno',
    code: 'FAT',
    name: 'Fresno',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Fresno'],
    about:
      'Fresno occupies the San Joaquin Valley floor of central California as an agricultural metro between Sierra Nevada foothills and Coast Range haze. Orchards and canals organize the plain; downtown sits in a flat grid under intense summer heat. Cooler Sierra air lies east; tule fog can fill winter mornings. Read valley agriculture, foothill rim, and dry summer light together. Fresno’s primer is Central Valley farm city — orchard plains and Sierra approaches in California’s interior.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'San Joaquin Valley · central California',
      role: 'Central Valley agricultural metro',
      knownFor: 'Orchard plains, Sierra foothill approaches, and valley heat',
    },
    features: [
      {
        name: 'Orchard plains',
        description:
          'Fruit and nut landscapes of the valley floor.',
      },
      {
        name: 'Sierra foothills',
        description:
          'Eastern rim rising toward the mountains.',
      },
      {
        name: 'Valley grid',
        description:
          'Flat downtown and canal-crossed neighborhoods.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Fresno',
        url: 'https://www.britannica.com/place/Fresno-California',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'madison',
    code: 'MAD',
    name: 'Madison',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Madison'],
    about:
      'Madison sits on an isthmus between Lakes Mendota and Monona in southern Wisconsin as a capital and university city of shoreline paths, civic dome, and compact downtown. The Capitol anchors the center; campus life fills the western isthmus. Cold snowy winters and humid lake summers define the seasons. Walk the isthmus so capitol, lakes, and campus read as one composition. Madison’s primer is Wisconsin lake-isthmus capital — twin shores around a civic and university core.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Lakes Mendota and Monona · southern Wisconsin',
      role: 'State capital and university city',
      knownFor: 'Isthmus setting, Capitol dome, and twin-lake shores',
    },
    features: [
      {
        name: 'Capitol isthmus',
        description:
          'The narrow land between the two lakes.',
      },
      {
        name: 'Lake Mendota shore',
        description:
          'Northern shoreline paths and campus edge.',
      },
      {
        name: 'Lake Monona shore',
        description:
          'Southern waterfront facing civic blocks.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Madison',
        url: 'https://www.britannica.com/place/Madison-Wisconsin',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'wichita',
    code: 'ICT',
    name: 'Wichita',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Wichita'],
    about:
      'Wichita straddles the Arkansas River on the southern Great Plains of Kansas as an aviation and wheat-belt city of wide skies, riverside parks, and a low downtown skyline. Aircraft industry and prairie agriculture shaped the metro; thunderstorms and sharp seasons mark the climate. Orient from the river confluence through downtown to the surrounding plains. Wichita’s primer is southern plains river city — aviation heritage and wheat-belt horizons in Kansas.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Arkansas River · southern Kansas plains',
      role: 'Southern Kansas metro and aviation center',
      knownFor: 'Aviation industry, Arkansas River parks, and plains horizons',
    },
    features: [
      {
        name: 'Arkansas River parks',
        description:
          'Green corridors along the plains river.',
      },
      {
        name: 'Aviation heritage',
        description:
          'Factories and museums of the aircraft city.',
      },
      {
        name: 'Plains skyline',
        description:
          'Low towers under wide Kansas skies.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Wichita',
        url: 'https://www.britannica.com/place/Wichita-Kansas',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hamilton',
    code: 'YHM',
    name: 'Hamilton',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Hamilton'],
    about:
      'Hamilton climbs from Lake Ontario’s western tip up the Niagara Escarpment in southern Ontario as a steel-and-harbor city of waterfalls, industrial waterfront, and a bowl of neighborhoods below the ridge. The escarpment edge holds parks and cascades; the bay organizes shipping and shoreline trails. Cold winters and humid summers share the Great Lakes climate. Read bay, lower city, and escarpment rim as stacked belts. Hamilton’s primer is Ontario escarpment harbor — steel bay and waterfall ridge at the lake’s western end.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Lake Ontario · Niagara Escarpment',
      role: 'Southern Ontario harbor and industrial city',
      knownFor: 'Escarpment waterfalls, harbor bay, and steel waterfront',
    },
    features: [
      {
        name: 'Niagara Escarpment',
        description:
          'The ridge of parks and waterfalls above the city.',
      },
      {
        name: 'Hamilton Harbour',
        description:
          'The bay industrial and shoreline edge.',
      },
      {
        name: 'Lower city bowl',
        description:
          'Neighborhoods between bay and escarpment.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Hamilton',
        url: 'https://www.britannica.com/place/Hamilton-Ontario',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'temuco',
    code: 'TEM',
    name: 'Temuco',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Temuco'],
    about:
      'Temuco sits in Chile’s Araucanía region as a southern gateway city of Mapuche market life, rainy green plains, and Andean volcano silhouettes to the east. The city organizes rail and road approaches into lake and volcano country; cool wet winters keep the landscape lush. Orient from the central plaza toward volcano horizons and surrounding farmland. Temuco’s primer is Araucanía gateway — Mapuche market city on the rainy road to Chile’s lake and volcano belt.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Araucanía · southern Chile',
      role: 'Regional capital and southern gateway city',
      knownFor: 'Mapuche markets, rainy plains, and volcano approaches',
    },
    features: [
      {
        name: 'Central market life',
        description:
          'Regional trade and Mapuche crafts.',
      },
      {
        name: 'Volcano horizons',
        description:
          'Andean cones east of the plains.',
      },
      {
        name: 'Rainy green plain',
        description:
          'Lush farmland around the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Temuco',
        url: 'https://www.britannica.com/place/Temuco',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'maceio',
    code: 'MCZ',
    name: 'Maceió',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Maceió', 'Maceio'],
    about:
      'Maceió lines a reef-fringed Atlantic coast in Alagoas as a Brazilian Northeast capital of lagoon channels, urban beaches, and bright trade-wind light. Natural pools form beyond the reef at low tide; the lagoon system threads behind the shore. Hot humid weather holds year-round. Move from lagoon edge to reef beach and compact coastal avenues. Maceió’s primer is Alagoas reef capital — lagoon city and tidal pools on Brazil’s Northeast shore.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Atlantic coast · Alagoas',
      role: 'Alagoas state capital and coastal city',
      knownFor: 'Reef pools, lagoon channels, and urban beaches',
    },
    features: [
      {
        name: 'Reef tidal pools',
        description:
          'Natural swimming basins beyond the shore.',
      },
      {
        name: 'Lagoon channels',
        description:
          'Brackish waterways behind the coast.',
      },
      {
        name: 'Urban beaches',
        description:
          'City shoreline under trade-wind light.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Maceió',
        url: 'https://www.britannica.com/place/Maceio',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'osijek',
    code: 'OSI',
    name: 'Osijek',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Osijek'],
    about:
      'Osijek sits on the Drava River in eastern Croatia as a Pannonian plain city of Baroque fortress fabric, tree-lined avenues, and a river bend that organizes parks and promenades. The Tvrđa fortress district anchors historic life; continental seasons bring hot summers and cold winters. Walk from fortress walls to the Drava embankment. Osijek’s primer is Drava fortress city — Baroque citadel and river avenues on Croatia’s eastern plain.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Drava River · eastern Croatia',
      role: 'Eastern Croatian regional capital',
      knownFor: 'Tvrđa fortress, Drava promenades, and Pannonian plain',
    },
    features: [
      {
        name: 'Tvrđa fortress',
        description:
          'Baroque military district by the river.',
      },
      {
        name: 'Drava embankment',
        description:
          'Parks and walks along the bend.',
      },
      {
        name: 'Pannonian avenues',
        description:
          'Tree-lined streets of the plain city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Osijek',
        url: 'https://www.britannica.com/place/Osijek',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bilbao',
    code: 'BIO',
    name: 'Bilbao',
    kind: 'City',
    countrySlug: 'spain',
    subtitle: 'City · Spain',
    matchNames: ['Bilbao'],
    about:
      'Bilbao occupies a tidal Nervión estuary in Spain’s Basque Country as a former industrial port remade around riverside museums, green hills, and a compact Casco Viejo. The Guggenheim and river walks mark the post-industrial turn; Atlantic rain keeps slopes green. Orient from old town through the estuary curve to the surrounding hills. Bilbao’s primer is Basque estuary city — tidal river industry turned cultural waterfront under green Atlantic hills.',
    facts: {
      kind: 'City',
      country: 'Spain',
      region: 'Europe',
      setting: 'Nervión estuary · Basque Country',
      role: 'Basque commercial and cultural metro',
      knownFor: 'Estuary waterfront, Guggenheim, and Casco Viejo',
    },
    features: [
      {
        name: 'Nervión waterfront',
        description:
          'Riverside walks and cultural landmarks.',
      },
      {
        name: 'Casco Viejo',
        description:
          'The compact old-town core.',
      },
      {
        name: 'Green Atlantic hills',
        description:
          'Rainy slopes enclosing the estuary.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bilbao',
        url: 'https://www.britannica.com/place/Bilbao-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'marseille',
    code: 'MRS',
    name: 'Marseille',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Marseille'],
    about:
      'Marseille opens on a limestone Mediterranean harbor in southern France as a port city of the Vieux-Port, steep calanque coasts, and a dense multicultural waterfront. Hills and forts frame the old basin; ferries and markets keep the quay animated. Hot dry summers and mild winters define the Provençal shore climate. Stand at the Vieux-Port so basin, hills, and sea approaches read together. Marseille’s primer is Provençal harbor metropolis — limestone port, calanques, and Mediterranean quay life.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Mediterranean coast · Provence',
      role: 'Major French Mediterranean port city',
      knownFor: 'Vieux-Port, calanque coasts, and harbor hills',
    },
    features: [
      {
        name: 'Vieux-Port',
        description:
          'The historic basin and quay heart.',
      },
      {
        name: 'Calanque coasts',
        description:
          'Limestone inlets west of the city.',
      },
      {
        name: 'Harbor hills',
        description:
          'Forts and slopes above the basin.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Marseille',
        url: 'https://www.britannica.com/place/Marseille',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bologna',
    code: 'BLQ',
    name: 'Bologna',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Bologna'],
    about:
      'Bologna occupies the southern edge of the Po Plain in Emilia-Romagna as a brick university city of endless porticoes, twin towers, and a food culture rooted in surrounding farmland. The medieval and Renaissance core is dense and walkable; hills rise south toward the Apennines. Winter fog often fills the plain while summers run warm and close. Walk the porticoed streets from the Due Torri to the hill sanctuary approaches. Bologna’s primer is porticoed university city — brick towers and culinary plains at the Apennine edge.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Po Plain · Emilia-Romagna',
      role: 'Emilia-Romagna capital and university city',
      knownFor: 'Porticoes, Due Torri, and culinary tradition',
    },
    features: [
      {
        name: 'Porticoed streets',
        description:
          'Covered walkways through the historic core.',
      },
      {
        name: 'Due Torri',
        description:
          'The leaning medieval towers of the center.',
      },
      {
        name: 'Apennine approaches',
        description:
          'Southern hills rising from the plain.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bologna',
        url: 'https://www.britannica.com/place/Bologna-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'manchester',
    code: 'MAN',
    name: 'Manchester',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Manchester'],
    about:
      'Manchester sits on the Irwell and Ship Canal corridor in northwest England as an industrial-revolution city of red-brick mills, civic halls, and a dense post-industrial core. Canals and railways still structure movement; Pennine foothills rise east. Mild wet weather is the year-round default. Orient from the civic and canal quarter through warehouse districts to the surrounding boroughs. Manchester’s primer is northern English industrial city — mills, canals, and civic brick reinvented as a modern metro.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Irwell and canals · northwest England',
      role: 'Northwest England metro and former mill city',
      knownFor: 'Industrial mills, canals, and civic architecture',
    },
    features: [
      {
        name: 'Canal corridors',
        description:
          'Waterways of the industrial city.',
      },
      {
        name: 'Red-brick mills',
        description:
          'Warehouse and factory fabric of the core.',
      },
      {
        name: 'Civic halls',
        description:
          'Public architecture of the commercial capital.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Manchester',
        url: 'https://www.britannica.com/place/Manchester-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kansas',
    code: 'KS',
    name: 'Kansas',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Kansas'],
    about:
      'Kansas occupies the central Great Plains of the United States as a rectangular state of tallgrass prairie, wheat fields, and river valleys under vast sky. The Flint Hills preserve native prairie; the Arkansas and Kansas rivers organize settlement belts. Severe thunderstorms and sharp seasonal swings mark the climate. Read prairie east, high plains west, and river towns as linked belts. Kansas’s primer is central plains state — tallgrass, wheat horizons, and river valleys under open sky.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Great Plains · central United States',
      role: 'Central plains agricultural state',
      knownFor: 'Tallgrass prairie, wheat fields, and Flint Hills',
    },
    features: [
      {
        name: 'Flint Hills',
        description:
          'Native tallgrass prairie ridges.',
      },
      {
        name: 'Wheat plains',
        description:
          'Agricultural horizons of the central state.',
      },
      {
        name: 'River valleys',
        description:
          'Settlement belts along plains rivers.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kansas',
        url: 'https://www.britannica.com/place/Kansas-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nebraska',
    code: 'NE',
    name: 'Nebraska',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Nebraska'],
    about:
      'Nebraska stretches across the central Great Plains from the Missouri River west into Sandhills grassland and High Plains ranches. The Platte River corridor organizes historic trails and modern highways; corn and cattle dominate land use. Harsh winters and hot summers share the continental climate. Move from Missouri bluffs through Platte valley to Sandhills and panhandle. Nebraska’s primer is plains corridor state — Missouri edge, Platte trail, and Sandhills grassland in one outline.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Great Plains · Missouri to High Plains',
      role: 'Central plains state of farms and Sandhills',
      knownFor: 'Platte River corridor, Sandhills, and Missouri bluffs',
    },
    features: [
      {
        name: 'Platte River corridor',
        description:
          'Historic trail and highway spine.',
      },
      {
        name: 'Sandhills',
        description:
          'Grass-covered dune country of the west-central state.',
      },
      {
        name: 'Missouri bluffs',
        description:
          'Eastern river border and bluff towns.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Nebraska',
        url: 'https://www.britannica.com/place/Nebraska-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'himachal-pradesh',
    code: 'HP',
    name: 'Himachal Pradesh',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Himachal Pradesh', 'Himachal'],
    about:
      'Himachal Pradesh climbs from Himalayan foothills to high ranges in northern India as a mountain state of hill stations, apple valleys, and temple towns along steep river gorges. Shimla and other ridge towns organize colonial and tourist layers; deeper valleys hold orchards and monasteries. Snowy winters and monsoon rains shape the year. Orient from foothill approaches up gorge roads into ridge stations and high passes. Himachal Pradesh’s primer is Himalayan hill state — ridge towns, apple valleys, and gorge roads in northern India.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Western Himalaya · northern India',
      role: 'Himalayan mountain state',
      knownFor: 'Hill stations, apple valleys, and Himalayan gorges',
    },
    features: [
      {
        name: 'Ridge hill stations',
        description:
          'Colonial and tourist towns on mountain crests.',
      },
      {
        name: 'Apple valleys',
        description:
          'Orchard basins of the mid-hills.',
      },
      {
        name: 'Himalayan gorges',
        description:
          'Steep river roads into high country.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Himachal Pradesh',
        url: 'https://www.britannica.com/place/Himachal-Pradesh',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rum',
    code: 'RUM',
    name: 'Isle of Rum',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Rum', 'Rum', 'Rùm'],
    about:
      'The Isle of Rum is a mountainous Inner Hebridean island of volcanic peaks, deer-managed moor, and a single main settlement at Kinloch. Cuillin-like ridges dominate the skyline; sea cliffs and bays organize the shore. Atlantic weather brings wind and cloud year-round. Land at Kinloch and look up to the Rum Cuillin massif. Rum’s primer is Hebridean mountain island — volcanic ridges and managed wildland west of the Scottish mainland.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · Scotland',
      role: 'Mountainous Hebridean nature island',
      knownFor: 'Rum Cuillin peaks, Kinloch, and wild moor',
    },
    features: [
      {
        name: 'Rum Cuillin',
        description:
          'Volcanic mountain core of the island.',
      },
      {
        name: 'Kinloch',
        description:
          'The main settlement and landing.',
      },
      {
        name: 'Moor and cliffs',
        description:
          'Managed wildland and Atlantic shores.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Isle of Rum',
        url: 'https://www.britannica.com/place/Rum',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'eigg',
    code: 'EIG',
    name: 'Eigg',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Eigg', 'Isle of Eigg'],
    about:
      'Eigg is a small Inner Hebridean island of a dramatic pitchstone ridge (the Sgùrr), community-owned crofting land, and clear views to Rum and the mainland. Beaches and basalt shores alternate with moor; the island’s silhouette is unmistakable from the sea. Wet Atlantic weather dominates. Land at Galmisdale and climb toward the Sgùrr ridge. Eigg’s primer is Hebridean community island — a pitchstone ridge above crofts facing Rum and the Scottish sea.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · Scotland',
      role: 'Community-owned Hebridean island',
      knownFor: 'An Sgùrr ridge, crofting shores, and Rum views',
    },
    features: [
      {
        name: 'An Sgùrr',
        description:
          'The pitchstone ridge landmark.',
      },
      {
        name: 'Galmisdale landing',
        description:
          'Harbor approaches and island gateway.',
      },
      {
        name: 'Crofting shores',
        description:
          'Small farms and beaches under Atlantic light.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Eigg',
        url: 'https://www.britannica.com/place/Eigg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mayotte',
    code: 'MAY',
    name: 'Mayotte',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Mayotte', 'Maore'],
    about:
      'Mayotte is a French overseas department in the Comoros archipelago of a vast lagoon, fringing barrier reef, and volcanic island slopes in the Mozambique Channel. Mangroves and coral shallows organize the shore; humid tropical weather holds year-round. Ferries and coastal roads link villages around the lagoon. Read reef rim, lagoon water, and volcanic hills as nested belts. Mayotte’s primer is Comorian lagoon territory — French Indian Ocean island inside a barrier-reef ring.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Europe',
      setting: 'Comoros archipelago · Mozambique Channel',
      role: 'French overseas lagoon island',
      knownFor: 'Barrier reef lagoon, volcanic slopes, and mangrove shores',
    },
    features: [
      {
        name: 'Barrier reef lagoon',
        description:
          'The vast enclosed shallows.',
      },
      {
        name: 'Volcanic slopes',
        description:
          'Interior hills of the main islands.',
      },
      {
        name: 'Mangrove shores',
        description:
          'Coastal wetlands of the lagoon edge.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mayotte',
        url: 'https://www.britannica.com/place/Mayotte',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'folegandros',
    code: 'FOL',
    name: 'Folegandros',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Folegandros'],
    about:
      'Folegandros is a small cliff-edged Cycladic island of a hilltop Chora, sparse terraces, and dramatic drops to deep Aegean water. The whitewashed ridge town overlooks the sea; beaches occupy harder-to-reach coves. Dry summers and strong winds define the season. Climb to Chora so terraces, cliffs, and open sea read together. Folegandros’s primer is cliffside Cyclades — a compact ridge Chora above steep Aegean drops.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · Aegean Sea',
      role: 'Cliffside Cycladic island',
      knownFor: 'Hilltop Chora, sea cliffs, and terraced slopes',
    },
    features: [
      {
        name: 'Hilltop Chora',
        description:
          'Whitewashed ridge town above the cliffs.',
      },
      {
        name: 'Sea cliffs',
        description:
          'Steep drops to deep Aegean water.',
      },
      {
        name: 'Terraced slopes',
        description:
          'Sparse farming shelves on dry hills.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Folegandros',
        url: 'https://www.britannica.com/place/Folegandros',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kea',
    code: 'KEA',
    name: 'Kea',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Kea', 'Tzia'],
    about:
      'Kea (Tzia) is the northwesternmost Cycladic island near Attica, of oak-green hills, stone lion sculpture, and sheltered bays closer to the mainland than most peers. Ioulida crowns an inland ridge; ferries land at Korissia. Drier summers still leave more vegetation than many Cyclades. Move from harbor to ridge Chora and oak-covered slopes. Kea’s primer is near-Attica Cyclades — greener hills and a ridge town a short sea hop from the mainland.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Northwestern Cyclades · Aegean Sea',
      role: 'Near-mainland Cycladic island',
      knownFor: 'Ioulida ridge town, oak hills, and sheltered bays',
    },
    features: [
      {
        name: 'Ioulida',
        description:
          'Inland ridge Chora of stone lanes.',
      },
      {
        name: 'Oak-green hills',
        description:
          'Vegetation denser than many Cyclades.',
      },
      {
        name: 'Korissia harbor',
        description:
          'Ferry landing and bay approaches.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kea',
        url: 'https://www.britannica.com/place/Kea-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ischia',
    code: 'ISC',
    name: 'Ischia',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Ischia'],
    about:
      'Ischia is a volcanic island in the Bay of Naples of thermal springs, terraced vineyards, and a medieval castle islet joined by causeway. Monte Epomeo rises at the center; coastal towns ring the shore. Mild Mediterranean seasons and geothermal heat shape island life. Circle from castle islet through spa towns to the mountain core. Ischia’s primer is Bay of Naples volcanic island — thermal shores and castle rock under Epomeo’s green cone.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · Tyrrhenian Sea',
      role: 'Volcanic spa and vineyard island',
      knownFor: 'Thermal springs, Aragonese Castle, and Monte Epomeo',
    },
    features: [
      {
        name: 'Aragonese Castle',
        description:
          'Medieval islet joined by causeway.',
      },
      {
        name: 'Thermal shores',
        description:
          'Geothermal spa coasts of the island.',
      },
      {
        name: 'Monte Epomeo',
        description:
          'Central volcanic green summit.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Ischia',
        url: 'https://www.britannica.com/place/Ischia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'emilia-romagna',
    code: 'EMR',
    name: 'Emilia-Romagna',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Emilia-Romagna', 'Emilia Romagna'],
    about:
      'Emilia-Romagna stretches across northern Italy from the Apennine ridge to the Po Plain and Adriatic coast as a region of food capitals, brick cities, and fertile farmland. Bologna, Parma, and Modena organize culinary and civic poles; beaches and wetlands mark the eastern edge. Foggy winters and warm summers share the plain climate. Read Apennine foothills, food cities, and Adriatic rim as linked belts. Emilia-Romagna’s primer is Po Plain food region — brick cities and fertile fields between mountains and Adriatic.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Po Plain · Apennines to Adriatic',
      role: 'Northern Italian food and industrial region',
      knownFor: 'Culinary cities, Po farmland, and Adriatic coast',
    },
    features: [
      {
        name: 'Food capitals',
        description:
          'Bologna, Parma, and Modena culinary poles.',
      },
      {
        name: 'Po farmland',
        description:
          'Fertile plain of the northern core.',
      },
      {
        name: 'Adriatic rim',
        description:
          'Coastal wetlands and beach towns.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Emilia-Romagna',
        url: 'https://www.britannica.com/place/Emilia-Romagna',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lazio',
    code: 'LAZ',
    name: 'Lazio',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Lazio', 'Latium'],
    about:
      'Lazio occupies central Italy around Rome from Tyrrhenian coasts and volcanic lakes to Apennine ridges inland. The capital organizes the region; ancient roads and hill towns fill the hinterland. Mild coastal winters and hot summers shape the year. Move from Roman core through volcanic lake hills to coastal plains and mountains. Lazio’s primer is central Italian capital region — Rome’s hinterland of lakes, coast, and Apennine approaches.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Central Italy · Tyrrhenian to Apennines',
      role: 'Capital region around Rome',
      knownFor: 'Rome, volcanic lakes, and Tyrrhenian coast',
    },
    features: [
      {
        name: 'Roman core',
        description:
          'The capital organizing the region.',
      },
      {
        name: 'Volcanic lake hills',
        description:
          'Crater lakes and towns inland of Rome.',
      },
      {
        name: 'Tyrrhenian coast',
        description:
          'Shore plains west of the capital.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lazio',
        url: 'https://www.britannica.com/place/Lazio',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'campania',
    code: 'CAM',
    name: 'Campania',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Campania'],
    about:
      'Campania curves around the Bay of Naples in southern Italy as a region of Vesuvius, coastal cliffs, and fertile volcanic plains behind Naples and Salerno. Islands and Amalfi cliffs organize famous shores; inland valleys hold agriculture and historic towns. Hot dry summers and mild winters define the Mediterranean year. Read bay, volcano, and coastal cliffs as one dramatic outline. Campania’s primer is Bay of Naples region — Vesuvius, cliff coasts, and volcanic plains of southern Italy.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · southern Italy',
      role: 'Southern Italian coastal and volcanic region',
      knownFor: 'Vesuvius, Amalfi coast, and Naples bay',
    },
    features: [
      {
        name: 'Bay of Naples',
        description:
          'Harbor metropolis and island approaches.',
      },
      {
        name: 'Vesuvius',
        description:
          'The active volcano above the plain.',
      },
      {
        name: 'Cliff coasts',
        description:
          'Amalfi and peer shores of the peninsula.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Campania',
        url: 'https://www.britannica.com/place/Campania',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'basque-country',
    code: 'EUS',
    name: 'Basque Country',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Basque Country', 'Euskadi', 'País Vasco'],
    about:
      'Spain’s Basque Country occupies the rainy western Pyrenees edge and Bay of Biscay coast as a region of industrial ports, green hills, and a strong linguistic culture centered on Bilbao, San Sebastián, and Vitoria-Gasteiz. Atlantic weather keeps slopes lush; mountains rise quickly from the shore. Move from Biscay harbors inland to green valleys and ridge towns. The Basque Country’s primer is rainy Atlantic Spain — green hills, industrial ports, and Basque language along the Biscay edge.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Bay of Biscay · western Pyrenees edge',
      role: 'Northern Spanish autonomous community',
      knownFor: 'Biscay ports, green hills, and Basque culture',
    },
    features: [
      {
        name: 'Biscay coast',
        description:
          'Harbor cities on the Atlantic edge.',
      },
      {
        name: 'Green hill valleys',
        description:
          'Rainy inland slopes and towns.',
      },
      {
        name: 'Cultural capitals',
        description:
          'Bilbao, San Sebastián, and Vitoria-Gasteiz poles.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Basque Country',
        url: 'https://www.britannica.com/place/Basque-Country-region-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'castile-leon',
    code: 'CYL',
    name: 'Castile and León',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Castile and León', 'Castilla y León', 'Castile-Leon'],
    about:
      'Castile and León covers much of Spain’s northern Meseta as a broad inland region of cathedral cities, castle towns, and high plateau farmland around the Duero basin. Burgos, León, Salamanca, and Valladolid organize historic poles; winters are cold for Iberia and summers hot and dry. Read plateau, cathedral cities, and mountain rims as nested belts. Castile and León’s primer is northern Meseta heartland — Duero plateau cities and castles under wide Castilian sky.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Northern Meseta · Duero basin',
      role: 'Large inland Spanish autonomous community',
      knownFor: 'Cathedral cities, castles, and Duero plateau',
    },
    features: [
      {
        name: 'Duero plateau',
        description:
          'High farmland basin of the region.',
      },
      {
        name: 'Cathedral cities',
        description:
          'Burgos, León, Salamanca historic poles.',
      },
      {
        name: 'Castle towns',
        description:
          'Fortified settlements of the Meseta.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Castile and León',
        url: 'https://www.britannica.com/place/Castile-Leon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'orsay',
    code: 'ORS',
    name: 'Musée d\'Orsay',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Musée d\'Orsay', 'Musee dOrsay', 'Orsay Museum', 'Orsay'],
    about:
      'Musée d\'Orsay occupies a former Beaux-Arts railway station on Paris’s Left Bank as a museum of nineteenth- and early twentieth-century art behind a great glass nave and station clock. The Seine façade faces the Tuileries; galleries fill the converted platforms and halls. Enter so the nave, clock, and river frontage read as one station-museum. Orsay’s primer is Left Bank station museum — Impressionist collections in a grand glass railway hall on the Seine.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Left Bank · Seine · Paris',
      role: 'Major Paris art museum in a former station',
      knownFor: 'Glass nave, station clock, and Impressionist collections',
    },
    features: [
      {
        name: 'Glass nave',
        description:
          'The former train hall turned gallery.',
      },
      {
        name: 'Station clock',
        description:
          'Iconic timepiece of the museum façade.',
      },
      {
        name: 'Seine frontage',
        description:
          'Left Bank façade facing the Tuileries.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Musée d\'Orsay',
        url: 'https://www.britannica.com/topic/Musee-dOrsay',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'canyon-de-chelly',
    code: 'CDC',
    name: 'Canyon de Chelly',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Canyon de Chelly', 'Canyon de Chelly National Monument'],
    about:
      'Canyon de Chelly cuts sandstone cliffs and canyon floors in the Navajo Nation of northeastern Arizona, a living landscape of farms, archaeological sites, and towering red walls. Rim overlooks frame Spider Rock and nested canyons; the canyon floor remains inhabited. Desert light shifts cliff colors through the day. Stand at rim viewpoints so walls, floor fields, and sky read together. Canyon de Chelly’s primer is Navajo sandstone canyon — living canyon floor under monumental red cliffs in Arizona.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Navajo Nation · northeastern Arizona',
      role: 'National monument and Navajo homeland canyon',
      knownFor: 'Spider Rock, sandstone cliffs, and canyon-floor farms',
    },
    features: [
      {
        name: 'Spider Rock',
        description:
          'Iconic sandstone spire of the canyon.',
      },
      {
        name: 'Rim overlooks',
        description:
          'Viewpoints over nested red walls.',
      },
      {
        name: 'Canyon-floor farms',
        description:
          'Living Navajo agriculture below the cliffs.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Canyon de Chelly',
        url: 'https://www.britannica.com/place/Canyon-de-Chelly-National-Monument',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Canyon de Chelly',
        url: 'https://www.nps.gov/cach/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'himeji-castle',
    code: 'HIM',
    name: 'Himeji Castle',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Himeji Castle', 'Himeji-jo', 'White Heron Castle'],
    about:
      'Himeji Castle rises above the Harima plain in western Honshu as a white-plastered feudal complex of keeps, baileys, and defensive paths, often called the White Heron for its bright silhouette. Multiple gates and corridors organize approach; the main keep crowns the hill. Seasonal gardens and city fabric surround the walls. Climb the bailey sequence so white keep, roofs, and plain beyond align. Himeji Castle’s primer is White Heron fortress — Japan’s emblematic surviving feudal castle above a western Honshu city.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Harima plain · western Honshu',
      role: 'Surviving feudal castle complex',
      knownFor: 'White keep, bailey maze, and castle silhouette',
    },
    features: [
      {
        name: 'White main keep',
        description:
          'The plastered tenshu crowning the hill.',
      },
      {
        name: 'Bailey paths',
        description:
          'Defensive corridors and gates of approach.',
      },
      {
        name: 'Castle silhouette',
        description:
          'White-heron profile above the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Himeji Castle',
        url: 'https://www.britannica.com/topic/Himeji-Castle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'windsor-castle',
    code: 'WDS',
    name: 'Windsor Castle',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Windsor Castle'],
    about:
      'Windsor Castle crowns a chalk bluff above the Thames west of London as a vast royal fortress and residence of Round Tower, Lower and Upper Wards, and St George’s Chapel. The silhouette has grown for nearly a millennium; the town and Great Park surround the walls. Stand on the Thames approaches so Round Tower, chapel, and river terrace read together. Windsor Castle’s primer is Thames royal fortress — Round Tower and chapel above a chalk bluff west of London.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Thames · Berkshire',
      role: 'Royal fortress and residence',
      knownFor: 'Round Tower, St George’s Chapel, and Thames bluff',
    },
    features: [
      {
        name: 'Round Tower',
        description:
          'The central keep on the chalk mound.',
      },
      {
        name: 'St George\'s Chapel',
        description:
          'Gothic chapel of the Upper Ward.',
      },
      {
        name: 'Thames bluff',
        description:
          'Chalk rise above the river and town.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Windsor Castle',
        url: 'https://www.britannica.com/topic/Windsor-Castle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'edinburgh-castle',
    code: 'EDC',
    name: 'Edinburgh Castle',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Edinburgh Castle'],
    about:
      'Edinburgh Castle occupies the volcanic Castle Rock above Scotland’s capital as a fortress complex of batteries, royal apartments, and crown-shaped skyline over the Old Town. The Esplanade opens ceremonial approaches; the rock drops steeply on three sides. Haar and clear northern light both shape views across the Firth. Stand on the Esplanade or Princes Street so rock, ramparts, and Old Town ridge align. Edinburgh Castle’s primer is Castle Rock fortress — batteries and royal halls above Scotland’s capital ridge.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Castle Rock · Edinburgh',
      role: 'Historic fortress above the Scottish capital',
      knownFor: 'Castle Rock, Esplanade, and Old Town skyline',
    },
    features: [
      {
        name: 'Castle Rock',
        description:
          'Volcanic crag holding the fortress.',
      },
      {
        name: 'Esplanade',
        description:
          'Ceremonial approach before the gate.',
      },
      {
        name: 'Old Town ridge',
        description:
          'The Royal Mile descending from the castle.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Edinburgh Castle',
        url: 'https://www.britannica.com/topic/Edinburgh-Castle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'park-guell',
    code: 'PGU',
    name: 'Park Güell',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Park Güell', 'Parc Güell', 'Park Guell'],
    about:
      'Park Güell spreads across a Carmel hillside in Barcelona as Antoni Gaudí’s colorful park of serpentine benches, mosaic pavilions, and staged views over the city to the sea. The hypostyle hall and dragon stair organize the monumental entrance; winding paths climb the park. Mediterranean light sharpens the ceramics. Enter from the stair so mosaics, columns, and city panorama read together. Park Güell’s primer is Gaudí hillside park — mosaic architecture and Barcelona viewpoints on Carmel hill.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Carmel hill · Barcelona',
      role: 'Gaudí modernist park and viewpoint',
      knownFor: 'Serpentine bench, mosaic pavilions, and city views',
    },
    features: [
      {
        name: 'Serpentine bench',
        description:
          'Mosaic seating of the terrace rim.',
      },
      {
        name: 'Hypostyle hall',
        description:
          'Columned hall under the terrace.',
      },
      {
        name: 'City panorama',
        description:
          'Views from Carmel over Barcelona to the sea.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Park Güell',
        url: 'https://www.britannica.com/topic/Park-Guell',
        kind: 'reference',
      },
    ],
  },
]
