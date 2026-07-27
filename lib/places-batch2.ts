/** Second curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch2: PlaceGuideDraftBatch[] = [
  {
    slug: 'beijing',
    code: 'PEK',
    name: 'Beijing',
    kind: 'City',
    countrySlug: 'china',
    subtitle: 'City · China',
    matchNames: ['Beijing', 'Forbidden City'],
    about:
      'Beijing spreads across the North China Plain as China’s capital, organized historically by nested walls, axes, and courtyard compounds. The Forbidden City and Temple of Heaven still mark imperial ritual geography; hutong lanes preserve older residential grain beside ring roads and new towers. Mountains rise to the north and west, while the city’s political and cultural institutions concentrate near the historic core. Orientation uses the north–south ceremonial axis, the old wall lines, and the expanding ring structure. Beijing’s primer is capital continuity — dynastic planning overwritten by republican and contemporary layers without erasing the monumental center that still orients the map.',
    facts: {
      kind: 'City',
      country: 'China',
      region: 'Asia',
      setting: 'North China Plain · Yan Mountains',
      role: 'National capital and historic imperial seat',
      knownFor: 'Palace axes, hutongs, and ritual temple grounds',
    },
    features: [
      {
        name: 'Imperial axis',
        description:
          'Forbidden City and ceremonial north–south alignments that still structure the historic core.',
      },
      {
        name: 'Hutong fabric',
        description:
          'Low courtyard lanes recalling older residential blocks inside later ring growth.',
      },
      {
        name: 'Northern hills',
        description:
          'Uplands framing the plain and historically guarding approaches to the capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Beijing',
        url: 'https://www.britannica.com/place/Beijing',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Imperial Palaces of the Ming and Qing',
        url: 'https://whc.unesco.org/en/list/439/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'bangkok',
    code: 'BKK',
    name: 'Bangkok',
    kind: 'City',
    countrySlug: 'thailand',
    subtitle: 'City · Thailand',
    matchNames: ['Bangkok', 'Grand Palace and Wat Phra Kaew'],
    about:
      'Bangkok occupies the Chao Phraya delta, a low, canal-laced metropolis where river boats and elevated rails share the same humid basin. The Grand Palace and Wat Phra Kaew mark the historic royal island; commercial towers and markets spread across both banks. Khlongs once formed the main street system; many remain as transport and drainage. Orientation starts with the river bend, then Rattanakosin’s temples, then the denser modern districts inland. Bangkok’s primer is delta urbanism — a capital built on floodplain logic, where water, heat, and layered Thai, Chinese, and colonial street fabrics produce continuous street life at monsoon latitudes.',
    facts: {
      kind: 'City',
      country: 'Thailand',
      region: 'Asia',
      setting: 'Chao Phraya delta',
      role: 'National capital and river metropolis',
      knownFor: 'Palace island, canals, markets, and delta density',
    },
    features: [
      {
        name: 'Rattanakosin core',
        description:
          'Royal and temple compounds on the historic bend that still define civic ceremony.',
      },
      {
        name: 'Chao Phraya corridor',
        description:
          'Ferries and riverside districts stitching both banks into one metropolitan system.',
      },
      {
        name: 'Canal network',
        description:
          'Remaining khlongs that recall waterborne movement through the floodplain city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bangkok',
        url: 'https://www.britannica.com/place/Bangkok',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic City of Ayutthaya (regional context)',
        url: 'https://whc.unesco.org/en/list/576/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'dubai',
    code: 'DXB',
    name: 'Dubai',
    kind: 'City',
    countrySlug: 'united-arab-emirates',
    subtitle: 'City · United Arab Emirates',
    matchNames: ['Dubai', 'Burj Khalifa'],
    about:
      'Dubai faces the Persian Gulf on a desert coastline where creek harbors, palm reclamations, and a vertical skyline share the same short coastal strip. The historic creek districts retain souk and dhow textures; inland and along Sheikh Zayed Road, towers concentrate finance and hospitality. Climate control and desalination underwrite dense settlement in arid heat. Orientation contrasts creek, coastline, and desert fringe. Dubai’s primer is rapid coastal city-making — a trading creek remade into a global port-and-skyline node without losing the gulf edge as its fundamental geography.',
    facts: {
      kind: 'City',
      country: 'United Arab Emirates',
      region: 'Asia',
      setting: 'Persian Gulf coast · Dubai Creek',
      role: 'Major Gulf commercial and aviation hub',
      knownFor: 'Creek districts, towers, and engineered waterfronts',
    },
    features: [
      {
        name: 'Dubai Creek',
        description:
          'The historic harbor axis of souks, dhows, and early settlement fabric.',
      },
      {
        name: 'Vertical corridor',
        description:
          'Tower clusters and arterial roads concentrating contemporary urban intensity.',
      },
      {
        name: 'Gulf edge',
        description:
          'Beaches, marinas, and reclamations facing open water and desert hinterland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dubai',
        url: 'https://www.britannica.com/place/Dubai',
        kind: 'reference',
      },
      {
        label: 'UAE government — About Dubai',
        url: 'https://u.ae/en/about-the-uae/the-seven-emirates/dubai',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lisbon',
    code: 'LIS',
    name: 'Lisbon',
    kind: 'City',
    countrySlug: 'portugal',
    subtitle: 'City · Portugal',
    matchNames: ['Lisbon', 'Belem Tower', 'Belém Tower'],
    about:
      'Lisbon climbs seven hills above the Tagus estuary, a light-washed capital of tiled facades, miradouros, and riverfront warehouses. Alfama’s lanes predate the 1755 earthquake; Baixa’s grid records the reconstruction. Trams negotiate grades that cars find awkward; Belém marks the seaward edge of Age of Discovery monuments. Orientation is hill, valley, and river — which miradouro, which waterfront, which side of the Baixa. Lisbon’s primer is Atlantic estuary urbanism: a port city whose slopes and light, more than any single boulevard, explain daily movement and views.',
    facts: {
      kind: 'City',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Tagus estuary · Atlantic approaches',
      role: 'National capital and historic Atlantic port',
      knownFor: 'Hills, miradouros, trams, and river light',
    },
    features: [
      {
        name: 'Tagus waterfront',
        description:
          'Estuary quays and monuments facing the broad river mouth toward the Atlantic.',
      },
      {
        name: 'Hill districts',
        description:
          'Alfama and other slopes where alleys and viewpoints replace flat grids.',
      },
      {
        name: 'Baixa reconstruction',
        description:
          'Pombaline streets built after the earthquake that still organize downtown.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lisbon',
        url: 'https://www.britannica.com/place/Lisbon',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Monastery of the Hieronymites and Tower of Belém',
        url: 'https://whc.unesco.org/en/list/263/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'barcelona',
    code: 'BCN',
    name: 'Barcelona',
    kind: 'City',
    countrySlug: 'spain',
    subtitle: 'City · Spain',
    matchNames: ['Barcelona'],
    about:
      'Barcelona sits between Collserola’s hills and the Mediterranean, with a Roman core, a medieval Gothic Quarter, and Cerdà’s Eixample grid expanding inland. The seafront was remade for modern civic life; Modernisme facades punctuate ordered blocks. Catalan language and institutions shape public culture inside the Spanish state. Orientation runs from sea to mountain, with Las Ramblas and the Diagonal as major cuts through the plan. Barcelona’s primer is Mediterranean grid city — dense, walkable, and staged between water and ridge.',
    facts: {
      kind: 'City',
      country: 'Spain',
      region: 'Europe',
      setting: 'Catalan coast · Collserola foothills',
      role: 'Catalonia’s principal city and Mediterranean port',
      knownFor: 'Gothic core, Eixample grid, and seafront',
    },
    features: [
      {
        name: 'Gothic Quarter',
        description:
          'Medieval lanes and plazas over Roman foundations in the historic nucleus.',
      },
      {
        name: 'Eixample blocks',
        description:
          'Cerdà’s chamfered grid hosting Modernisme landmarks and dense apartments.',
      },
      {
        name: 'Sea-to-hill axis',
        description:
          'A short traverse from Mediterranean waterfront to Collserola slopes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Barcelona',
        url: 'https://www.britannica.com/place/Barcelona',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Works of Antoni Gaudí',
        url: 'https://whc.unesco.org/en/list/320/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'amsterdam',
    code: 'AMS',
    name: 'Amsterdam',
    kind: 'City',
    countrySlug: 'netherlands',
    subtitle: 'City · Netherlands',
    matchNames: ['Amsterdam', 'Amsterdam Canals'],
    about:
      'Amsterdam is a lowland canal city where concentric grachten rings, bridges, and gabled houses define a human-scaled historic core below sea level. Bicycles and boats remain practical; polder logic surrounds the urban footprint. The Dam and medieval streets sit inside later Golden Age rings; twentieth-century expansions continue on reclaimed land. Orientation is ring by ring from the old center outward. Amsterdam’s primer is engineered wetness — a trading city that made canals into streets and kept water management as civic infrastructure rather than scenery alone.',
    facts: {
      kind: 'City',
      country: 'Netherlands',
      region: 'Europe',
      setting: 'Amstel mouth · North Sea lowlands',
      role: 'Capital and historic trading port of the Netherlands',
      knownFor: 'Canal rings, gables, bridges, and bicycle streets',
    },
    features: [
      {
        name: 'Grachtengordel',
        description:
          'Concentric canal belts lined with merchant houses from the Golden Age expansion.',
      },
      {
        name: 'Bridge network',
        description:
          'Countless crossings that turn water parcels into a continuous walking city.',
      },
      {
        name: 'Lowland setting',
        description:
          'Polder and sea-level geography that made water engineering essential.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Amsterdam',
        url: 'https://www.britannica.com/place/Amsterdam',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Seventeenth-Century Canal Ring',
        url: 'https://whc.unesco.org/en/list/1349/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'berlin',
    code: 'BER',
    name: 'Berlin',
    kind: 'City',
    countrySlug: 'germany',
    subtitle: 'City · Germany',
    matchNames: ['Berlin'],
    about:
      'Berlin sprawls across the Brandenburg plain as a reunited capital of parks, waterways, and abrupt architectural eras. The Spree and Landwehr Canal thread districts that once faced different systems; Brandenburg Gate and Museum Island mark the historic Mitte. Wide postwar voids and later infill still read in the streetscape. Orientation uses rivers, ring transit, and the former wall corridor as mental maps. Berlin’s primer is layered capital history on flat ground — politics written into voids, axes, and neighborhood contrasts more than into dramatic relief.',
    facts: {
      kind: 'City',
      country: 'Germany',
      region: 'Europe',
      setting: 'Spree plain · Brandenburg',
      role: 'National capital and cultural metropolis',
      knownFor: 'Historic axes, parks, waterways, and layered eras',
    },
    features: [
      {
        name: 'Mitte monuments',
        description:
          'Gate, museums, and civic axes concentrating the historic representational core.',
      },
      {
        name: 'Waterway grid',
        description:
          'Spree branches and canals organizing parks and district edges.',
      },
      {
        name: 'Distributed centers',
        description:
          'Multiple neighborhood cores reflecting a city grown by annexation and reunification.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Berlin',
        url: 'https://www.britannica.com/place/Berlin',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Museumsinsel',
        url: 'https://whc.unesco.org/en/list/896/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'vienna',
    code: 'VIE',
    name: 'Vienna',
    kind: 'City',
    countrySlug: 'austria',
    subtitle: 'City · Austria',
    matchNames: ['Vienna', 'Schonbrunn Palace', 'Schönbrunn'],
    about:
      'Vienna occupies the Danube’s alpine foreland as a former imperial capital of rings, palaces, and coffeehouse streets. The Innere Stadt and Ringstrasse stage monumental institutions; Schönbrunn and other estates open green wedges westward. Wine hills rise at the edge of the Wienerwald. Orientation is concentric — core, ring, outer districts — with the Danube canal and river marking eastern edges. Vienna’s primer is Habsburg urban form adapted to a modern republic: a walkable historic center wrapped by boulevards and still culturally dense at European scale.',
    facts: {
      kind: 'City',
      country: 'Austria',
      region: 'Europe',
      setting: 'Danube basin · Wienerwald edge',
      role: 'National capital and former imperial seat',
      knownFor: 'Rings, palaces, and wine-hill edges',
    },
    features: [
      {
        name: 'Innere Stadt',
        description:
          'The historic core of churches, courts, and pedestrian streets inside the ring.',
      },
      {
        name: 'Ringstrasse',
        description:
          'A monumental boulevard belt of museums, parliament, and opera houses.',
      },
      {
        name: 'Palace parks',
        description:
          'Imperial estates such as Schönbrunn that open formal green into the west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Vienna',
        url: 'https://www.britannica.com/place/Vienna',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Vienna',
        url: 'https://whc.unesco.org/en/list/1033/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'prague',
    code: 'PRG',
    name: 'Prague',
    kind: 'City',
    countrySlug: 'czechia',
    subtitle: 'City · Czechia',
    matchNames: ['Prague', 'Prague Castle'],
    about:
      'Prague rises on both banks of the Vltava, with a castle ridge, a medieval Old Town, and a bridge-linked Lesser Town under red roofs. Gothic and baroque towers punctuate a compact historic core that remained unusually intact. Trams climb and cross where cars congest; hills give layered views of river bends. Orientation is castle, Charles Bridge, Old Town Square — then the nineteenth-century New Town grid beyond. Prague’s primer is Central European river city: fortification, trade, and stone beauty concentrated where a fordable river meets defensive heights.',
    facts: {
      kind: 'City',
      country: 'Czechia',
      region: 'Europe',
      setting: 'Vltava bend · Bohemian basin',
      role: 'National capital with a dense historic core',
      knownFor: 'Castle ridge, bridges, and medieval streets',
    },
    features: [
      {
        name: 'Castle hill',
        description:
          'A fortified ridge of palaces and cathedral overlooking the river city.',
      },
      {
        name: 'Charles Bridge axis',
        description:
          'The stone crossing linking Lesser Town approaches to the Old Town.',
      },
      {
        name: 'Old Town fabric',
        description:
          'Squares and lanes preserving Gothic and baroque merchant-city grain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Prague',
        url: 'https://www.britannica.com/place/Prague',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Prague',
        url: 'https://whc.unesco.org/en/list/616/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'buenos-aires',
    code: 'BUE',
    name: 'Buenos Aires',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Buenos Aires', 'Plaza de Mayo'],
    about:
      'Buenos Aires faces the Río de la Plata as a broad estuary capital of grid neighborhoods, cafés, and port logistics. Plaza de Mayo anchors civic ritual; Palermo, San Telmo, and La Boca offer distinct densities and immigrant histories. The flat pampa hinterland meets an urban edge without dramatic hills. Orientation is barrio by barrio along avenues radiating from the historic center toward the estuary. Buenos Aires’s primer is estuary metropolis — European-influenced street culture on a South American floodplain scale, with tango geographies and political squares as durable urban landmarks.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Río de la Plata estuary',
      role: 'National capital and principal port metropolis',
      knownFor: 'Civic plaza, barrios, and estuary waterfront',
    },
    features: [
      {
        name: 'Plaza de Mayo',
        description:
          'The historic civic square facing the Casa Rosada and cathedral.',
      },
      {
        name: 'Barrio mosaic',
        description:
          'Distinct neighborhoods with immigrant architectures and café streets.',
      },
      {
        name: 'Estuary edge',
        description:
          'Port and waterfront districts meeting the wide brown Río de la Plata.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Buenos Aires',
        url: 'https://www.britannica.com/place/Buenos-Aires',
        kind: 'reference',
      },
      {
        label: 'City of Buenos Aires — Heritage',
        url: 'https://turismo.buenosaires.gob.ar/en',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'seoul',
    code: 'SEL',
    name: 'Seoul',
    kind: 'City',
    countrySlug: 'korea-south',
    subtitle: 'City · Korea, South',
    matchNames: ['Seoul', 'Gyeongbokgung Palace'],
    about:
      'Seoul fills a basin of the Han River ringed by mountains, stacking Joseon palaces, dense mid-rise neighborhoods, and a vast metro web. Gyeongbokgung and other palaces recall the dynastic capital; contemporary towers and markets fill the valleys between peaks. The river divides north and south banks with distinct textures. Orientation uses mountain gates, palace compounds, and Han crossings. Seoul’s primer is basin megacity — historic royal geography still legible inside one of East Asia’s most transit-connected metropolitan systems.',
    facts: {
      kind: 'City',
      country: 'Korea, South',
      region: 'Asia',
      setting: 'Han River basin · surrounding peaks',
      role: 'National capital and primate metropolis',
      knownFor: 'Palaces, mountains, river banks, and metro density',
    },
    features: [
      {
        name: 'Palace compounds',
        description:
          'Joseon royal grounds that still punctuate the northern historic districts.',
      },
      {
        name: 'Han corridor',
        description:
          'Bridges and parks organizing movement between riverbanks.',
      },
      {
        name: 'Basin peaks',
        description:
          'Encircling mountains that frame neighborhoods and hiking edges inside the metro area.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Seoul',
        url: 'https://www.britannica.com/place/Seoul',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Royal Tombs of the Joseon Dynasty',
        url: 'https://whc.unesco.org/en/list/1319/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'havana',
    code: 'HAV',
    name: 'Havana',
    kind: 'City',
    countrySlug: 'cuba',
    subtitle: 'City · Cuba',
    matchNames: ['Havana', 'Old Havana'],
    about:
      'Havana faces the Florida Straits from a deep Caribbean harbor defended by colonial fortresses and lined with Malecón seawall. Old Havana packs plazas, arcades, and pastel facades; Vedado and later districts open wider avenues inland. Tropical light and salt air shape the stone and plaster. Orientation moves from harbor mouth through Habana Vieja to the western shoreline drive. Havana’s primer is fortified port city — Spanish imperial harbor logic still readable in forts, plazas, and the seawall that mediates storm swell and daily promenade.',
    facts: {
      kind: 'City',
      country: 'Cuba',
      region: 'Americas',
      setting: 'Caribbean harbor · Florida Straits',
      role: 'National capital and historic port',
      knownFor: 'Old plazas, forts, and the Malecón',
    },
    features: [
      {
        name: 'Habana Vieja',
        description:
          'Colonial plazas and streets forming the UNESCO-listed historic core.',
      },
      {
        name: 'Harbor forts',
        description:
          'Stone defenses at the channel mouth that once controlled Caribbean access.',
      },
      {
        name: 'Malecón',
        description:
          'The seaside avenue and wall where city grid meets open strait.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Havana',
        url: 'https://www.britannica.com/place/Havana',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old Havana and its Fortification System',
        url: 'https://whc.unesco.org/en/list/204/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'alaska',
    code: 'AK',
    name: 'Alaska',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Alaska'],
    about:
      'Alaska occupies the northwestern corner of North America, a vast subarctic and Arctic territory of mountain ranges, fjord coasts, tundra, and island arcs. Anchorage and a few corridors hold most settlement; wilderness dominates the remainder. Glaciers, volcanoes of the Aleutian chain, and the highest peak in North America structure the physical map. Orientation is regional — Southeast panhandle, Southcentral, Interior, Arctic, Aleutians — rather than a single climate. Alaska’s primer is continental-scale northern geography under one state outline: extreme distances, marine and continental climates, and Indigenous homelands predating the modern political border.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Northwestern North America · Arctic approaches',
      role: 'Largest U.S. state by area; northern frontier',
      knownFor: 'Ranges, glaciers, tundra, and island arcs',
    },
    features: [
      {
        name: 'High ranges',
        description:
          'Alaska Range and coastal mountains including Denali’s massif.',
      },
      {
        name: 'Fjord and glacier coasts',
        description:
          'Southeast and southcentral shorelines cut by ice and tidewater glaciers.',
      },
      {
        name: 'Arctic north',
        description:
          'Tundra plains and polar seas beyond the tree line.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alaska',
        url: 'https://www.britannica.com/place/Alaska',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Alaska parks',
        url: 'https://www.nps.gov/state/ak/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'rajasthan',
    code: 'RJ',
    name: 'Rajasthan',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Rajasthan'],
    about:
      'Rajasthan covers much of northwestern India from Thar Desert dunes to Aravalli hill forts and palace cities. Jaipur, Jodhpur, and Udaipur concentrate Rajput architectural heritage; caravan and monsoon logics shaped settlement at oasis and ridge. Hot dry seasons dominate much of the west; eastern districts are greener. Orientation moves desert–Aravalli–plateau rather than a coastal model. Rajasthan’s primer is arid-state geography: fort-crowned hills, sandstone cities, and desert margins that made water and defense the organizing facts of urban form.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Thar Desert · Aravalli Range',
      role: 'Largest Indian state by area; desert and fort country',
      knownFor: 'Palace cities, forts, and desert landscapes',
    },
    features: [
      {
        name: 'Thar margin',
        description:
          'Dune and arid plains shaping western towns and caravan routes.',
      },
      {
        name: 'Fort cities',
        description:
          'Ridge and lake settlements with massive Rajput citadels and palaces.',
      },
      {
        name: 'Aravalli spine',
        description:
          'Ancient hills dividing greener east from drier west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rajasthan',
        url: 'https://www.britannica.com/place/Rajasthan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Hill Forts of Rajasthan',
        url: 'https://whc.unesco.org/en/list/247/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'yunnan',
    code: 'YN',
    name: 'Yunnan',
    kind: 'State',
    countrySlug: 'china',
    subtitle: 'Province · China',
    matchNames: ['Yunnan'],
    about:
      'Yunnan occupies China’s far southwest, a highland province of deep river gorges, karst, and ethnic diversity at the edge of the Tibetan Plateau and Southeast Asian massifs. Kunming sits on a plateau lake basin; terraces and old towns occupy valleys elsewhere. Climates range from subtropical lowlands to cool highlands within short distances. Orientation is vertical and ethnolinguistic as much as cardinal. Yunnan’s primer is frontier highland China — biodiversity, terrace agriculture, and mountain corridors linking the Yangtze headwaters to Mekong and Salween systems.',
    facts: {
      kind: 'State',
      country: 'China',
      region: 'Asia',
      setting: 'Southwest highlands · Three Parallel Rivers region',
      role: 'Mountain province of exceptional cultural and ecological diversity',
      knownFor: 'Gorges, terraces, old towns, and highland basins',
    },
    features: [
      {
        name: 'River gorges',
        description:
          'Deep parallel valleys cutting south from the eastern Tibetan edge.',
      },
      {
        name: 'Terrace landscapes',
        description:
          'Rice and farming slopes shaped over centuries in humid highlands.',
      },
      {
        name: 'Plateau basins',
        description:
          'Lake and city basins such as Kunming’s that hold major settlement.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yunnan',
        url: 'https://www.britannica.com/place/Yunnan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Three Parallel Rivers of Yunnan',
        url: 'https://whc.unesco.org/en/list/1083/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'douro-valley',
    code: 'DOU',
    name: 'Douro Valley',
    kind: 'Region',
    countrySlug: 'portugal',
    subtitle: 'Region · Portugal',
    matchNames: ['Douro Valley'],
    about:
      'The Douro Valley is a terraced wine region along the Douro River in northern Portugal, where schist slopes drop to a winding watercourse once navigated by rabelo boats. Quintas and stone terraces create one of Europe’s most sculpted agricultural landscapes. Upstream from Porto, the climate grows hotter and more continental. Orientation follows the river west to east into the demarcated wine country. The Douro’s primer is engineered viticulture — human terraces making steep valley walls productive and scenic in the same gesture.',
    facts: {
      kind: 'Region',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Northern Portugal · Douro River',
      role: 'Historic demarcated wine region',
      knownFor: 'Schist terraces, quintas, and river bends',
    },
    features: [
      {
        name: 'Terraced slopes',
        description:
          'Stone-walled vineyards carved into steep schist hillsides.',
      },
      {
        name: 'River corridor',
        description:
          'A navigable valley historically linking upland quintas to Porto.',
      },
      {
        name: 'Quinta estates',
        description:
          'Wine farms and houses punctuating bends with vernacular architecture.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Douro River',
        url: 'https://www.britannica.com/place/Douro-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Alto Douro Wine Region',
        url: 'https://whc.unesco.org/en/list/1046/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'swiss-alps',
    code: 'ALP',
    name: 'Swiss Alps',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Swiss Alps', 'Matterhorn', 'Jungfrau Region'],
    about:
      'The Swiss Alps form the high mountain spine of Switzerland, a glaciated range of horn peaks, valleys, and lake approaches that organizes climate, languages, and travel. Matterhorn and Jungfrau massifs are emblematic; trains and cableways stitch high pastures to lowland cities. Orientation is valley systems — Valais, Bernese Oberland, Engadin — rather than a single summit. The Swiss Alps’ primer is inhabited high mountains: dairy pastures, tunnel logistics, and tourism infrastructure living with ice, rockfall, and snow as ordinary geography.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Central Alpine arc',
      role: 'Core mountain region of Switzerland',
      knownFor: 'Horn peaks, glaciers, valleys, and alpine villages',
    },
    features: [
      {
        name: 'Iconic peaks',
        description:
          'Matterhorn, Jungfrau, and neighboring summits defining visual identity.',
      },
      {
        name: 'Valley cantons',
        description:
          'Deep inhabited corridors where languages and economies follow the grain of ice.',
      },
      {
        name: 'High infrastructure',
        description:
          'Railways and cable systems that make extreme relief navigable year-round.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alps',
        url: 'https://www.britannica.com/place/Alps',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Swiss Alps Jungfrau-Aletsch',
        url: 'https://whc.unesco.org/en/list/1037/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'dalmatia',
    code: 'DAL',
    name: 'Dalmatia',
    kind: 'Region',
    countrySlug: 'croatia',
    subtitle: 'Region · Croatia',
    matchNames: ['Dalmatia'],
    about:
      'Dalmatia is Croatia’s Adriatic coastal belt of limestone mountains, island chains, and walled harbor towns. Dubrovnik, Split, and Zadar mark different historic weights along a shared karst shore. Clear water, mistral-like winds, and maquis vegetation define the Mediterranean edge; hinterland ridges rise abruptly. Orientation is coast–island–mountain in a narrow band. Dalmatia’s primer is Adriatic karst urbanism — stone cities facing island-studded seas under a steep Dinaric backdrop.',
    facts: {
      kind: 'Region',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Adriatic coast · Dinaric karst',
      role: 'Historic coastal region of walled towns and islands',
      knownFor: 'Harbor cities, islands, and limestone mountains',
    },
    features: [
      {
        name: 'Walled harbors',
        description:
          'Stone towns such as Dubrovnik controlling Adriatic trade approaches.',
      },
      {
        name: 'Island chain',
        description:
          'Elongated islands paralleling the coast and sheltering channels.',
      },
      {
        name: 'Karst backdrop',
        description:
          'Abrupt limestone ridges rising from a narrow coastal strip.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dalmatia',
        url: 'https://www.britannica.com/place/Dalmatia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old City of Dubrovnik',
        url: 'https://whc.unesco.org/en/list/95/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'atacama',
    code: 'ATA',
    name: 'Atacama',
    kind: 'Region',
    countrySlug: 'chile',
    subtitle: 'Region · Chile',
    matchNames: ['Atacama Desert', 'Atacama'],
    about:
      'The Atacama is a hyper-arid desert along northern Chile between the Pacific coastal range and the Andes, among the driest inhabited landscapes on Earth. Salt flats, volcanoes, and clear skies make it a natural observatory belt; oasis towns occupy rare water points. Orientation is coast–desert–altiplano in a short west–east traverse. The Atacama’s primer is extreme aridity as geography — mineral colors, empty basins, and Andean snowlines visible across air of unusual clarity.',
    facts: {
      kind: 'Region',
      country: 'Chile',
      region: 'Americas',
      setting: 'Northern Chile · Pacific–Andes transect',
      role: 'Hyper-arid desert and astronomy landscape',
      knownFor: 'Salt flats, volcanoes, and exceptional dryness',
    },
    features: [
      {
        name: 'Salt basins',
        description:
          'Salar floors and evaporite landscapes under intense sunlight.',
      },
      {
        name: 'Volcanic rim',
        description:
          'Andean cones and altiplano edges framing the desert’s eastern wall.',
      },
      {
        name: 'Coastal fog edge',
        description:
          'Pacific moisture that rarely rains yet shapes coastal desert ecology.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Atacama Desert',
        url: 'https://www.britannica.com/place/Atacama-Desert',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Qhapaq Ñan (regional Andean context)',
        url: 'https://whc.unesco.org/en/list/1459/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'patagonia',
    code: 'PAT',
    name: 'Patagonia',
    kind: 'Region',
    countrySlug: 'argentina',
    subtitle: 'Region · Argentina',
    matchNames: ['Patagonia', 'Perito Moreno Glacier'],
    about:
      'Patagonia spans the southern cone’s steppe and Andean edge, a windy region of glaciers, granite towers, and sheep estancias on the Argentine side of a shared geographic idea with Chile. Perito Moreno and other ice fields meet turquoise lakes; the Atlantic coast holds different wildlife and cliffs. Orientation is Andean west versus plateau east. Patagonia’s primer is southern extremity — sparse settlement, strong winds, and ice-carved mountains at latitudes where steppe meets fjord systems across the border.',
    facts: {
      kind: 'Region',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Southern Andes · Patagonian steppe',
      role: 'Southern frontier region of ice and grasslands',
      knownFor: 'Glaciers, granite peaks, and windy plateaus',
    },
    features: [
      {
        name: 'Ice fields',
        description:
          'Glaciers descending to lakes in parks along the Andean front.',
      },
      {
        name: 'Granite towers',
        description:
          'Iconic peaks and massifs drawing climbers and viewpoint trails.',
      },
      {
        name: 'Eastern steppe',
        description:
          'Dry, windy plateaus of grassland and sparse ranching settlement.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Patagonia',
        url: 'https://www.britannica.com/place/Patagonia-region-South-America',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Los Glaciares National Park',
        url: 'https://whc.unesco.org/en/list/145/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'easter-island',
    code: 'EAS',
    name: 'Easter Island',
    kind: 'Island',
    countrySlug: 'chile',
    subtitle: 'Island · Chile',
    matchNames: ['Easter Island'],
    about:
      'Easter Island, or Rapa Nui, is an isolated volcanic triangle in the southeastern Pacific, famous for moai stone figures on ahu platforms. Three main volcanoes shape the skyline; grasslands cover much of the eroded interior. Polynesian settlement created a unique cultural landscape far from other inhabited land. Orientation is coastal platform by coastal platform around the triangular shore. Easter Island’s primer is extreme isolation — monumental sculpture and volcanic geology on a speck of land whose nearest continental neighbor is thousands of kilometers away.',
    facts: {
      kind: 'Island',
      country: 'Chile',
      region: 'Americas',
      setting: 'Southeastern Pacific · volcanic hotspot',
      role: 'Rapa Nui cultural landscape and Chilean special territory',
      knownFor: 'Moai, ahu platforms, and volcanic cones',
    },
    features: [
      {
        name: 'Moai and ahu',
        description:
          'Carved figures and ceremonial platforms lining coastal approaches.',
      },
      {
        name: 'Volcanic triangle',
        description:
          'Three principal cones defining the island’s corners and skyline.',
      },
      {
        name: 'Ocean isolation',
        description:
          'Vast surrounding Pacific that made voyaging and self-sufficiency decisive.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Easter Island',
        url: 'https://www.britannica.com/place/Easter-Island',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Rapa Nui National Park',
        url: 'https://whc.unesco.org/en/list/715/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'phi-phi',
    code: 'PHI',
    name: 'Phi Phi Islands',
    kind: 'Island',
    countrySlug: 'thailand',
    subtitle: 'Island group · Thailand',
    matchNames: ['Phi Phi Islands'],
    about:
      'The Phi Phi Islands are limestone karst islets in the Andaman Sea off Krabi, with cliffs, turquoise shallows, and a sandy tombolo linking parts of Ko Phi Phi Don. Maya Bay on Ko Phi Phi Leh became globally famous for its enclosed beach. Orientation is island-to-island by longtail boat among sheer towers. Phi Phi’s primer is tropical karst coast — vertical rock, clear water, and fragile beach necks shaped by monsoon waves in the Andaman.',
    facts: {
      kind: 'Island',
      country: 'Thailand',
      region: 'Asia',
      setting: 'Andaman Sea · Krabi karst',
      role: 'Island group known for cliffs and enclosed bays',
      knownFor: 'Limestone towers, lagoons, and beach tombolos',
    },
    features: [
      {
        name: 'Karst cliffs',
        description:
          'Sheer limestone walls rising directly from clear Andaman water.',
      },
      {
        name: 'Enclosed bays',
        description:
          'Pocket beaches such as Maya Bay sheltered by rock amphitheaters.',
      },
      {
        name: 'Phi Phi Don isthmus',
        description:
          'A low sandy neck concentrating settlement between two bays.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Phi Phi Islands',
        url: 'https://www.britannica.com/place/Phi-Phi-Islands',
        kind: 'reference',
      },
      {
        label: 'Thailand tourism — Krabi & Andaman',
        url: 'https://www.tourismthailand.org/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'palawan',
    code: 'PWY',
    name: 'Palawan',
    kind: 'Island',
    countrySlug: 'philippines',
    subtitle: 'Island · Philippines',
    matchNames: ['Palawan', 'Palawan Lagoons'],
    about:
      'Palawan is a long Philippine island of karst lagoons, subterranean rivers, and reef coasts between the South China Sea and Sulu Sea. El Nido and Coron concentrate iconic limestone seascapes; Puerto Princesa’s underground river is a separate geologic wonder. Orientation is north–south along a narrow mountainous spine. Palawan’s primer is island karst and reef — some of the archipelago’s clearest water and most dramatic coastal towers in a biodiversity-rich corridor.',
    facts: {
      kind: 'Island',
      country: 'Philippines',
      region: 'Asia',
      setting: 'Western Philippines · twin-sea corridor',
      role: 'Province-island of lagoons and karst coasts',
      knownFor: 'Limestone lagoons, reefs, and underground rivers',
    },
    features: [
      {
        name: 'Lagoon karst',
        description:
          'El Nido and Coron seascapes of towers, lagoons, and hidden beaches.',
      },
      {
        name: 'Underground river',
        description:
          'A navigable subterranean waterway through limestone near Puerto Princesa.',
      },
      {
        name: 'Reef shallows',
        description:
          'Clear coastal waters supporting coral and island-hopping routes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Palawan',
        url: 'https://www.britannica.com/place/Palawan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Puerto-Princesa Subterranean River',
        url: 'https://whc.unesco.org/en/list/652/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'madeira',
    code: 'MDR',
    name: 'Madeira',
    kind: 'Island',
    countrySlug: 'portugal',
    subtitle: 'Island · Portugal',
    matchNames: ['Madeira'],
    about:
      'Madeira is a volcanic Atlantic island west of Morocco, a steep Portuguese archipelago of laurel forest, levada canals, and cliff coasts. Funchal terraces the southern shore; peaks catch clouds that water the levada network. Orientation is altitude — banana coast, mid-slope towns, high ridges — more than distance. Madeira’s primer is oceanic volcanic relief: short horizontal trips that climb through climate belts maintained by irrigation channels cut into basalt.',
    facts: {
      kind: 'Island',
      country: 'Portugal',
      region: 'Europe',
      setting: 'North Atlantic · volcanic archipelago',
      role: 'Autonomous island region of Portugal',
      knownFor: 'Levada walks, laurel forest, and cliff coasts',
    },
    features: [
      {
        name: 'Levada network',
        description:
          'Irrigation canals that double as paths across steep mountain slopes.',
      },
      {
        name: 'Laurel forest',
        description:
          'Humid highland woodland sustained by trade-wind cloud.',
      },
      {
        name: 'Southern terraces',
        description:
          'Funchal and coastal farms stepping down volcanic slopes to the sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Madeira Islands',
        url: 'https://www.britannica.com/place/Madeira-Islands',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Laurisilva of Madeira',
        url: 'https://whc.unesco.org/en/list/934/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lofoten',
    code: 'LOF',
    name: 'Lofoten',
    kind: 'Island',
    countrySlug: 'norway',
    subtitle: 'Island group · Norway',
    matchNames: ['Lofoten Islands', 'Lofoten'],
    about:
      'Lofoten is an Arctic Norwegian archipelago of sharp granite peaks rising straight from fjord and open sea, famous for fishing villages, stockfish racks, and winter aurora. Despite latitude, the North Atlantic Current softens the climate enough for settlement. Orientation is island chain and fjord gap — Reine, Henningsvær, and other harbors tucked under walls of rock. Lofoten’s primer is vertical coast: mountains, sea, and maritime livelihood compressed into a narrow, photogenic chain above the Arctic Circle.',
    facts: {
      kind: 'Island',
      country: 'Norway',
      region: 'Europe',
      setting: 'Arctic Norway · Norwegian Sea',
      role: 'Fishing archipelago with dramatic coastal peaks',
      knownFor: 'Granite peaks, fishing villages, and Arctic light',
    },
    features: [
      {
        name: 'Sea peaks',
        description:
          'Steep summits rising directly from channels and open ocean.',
      },
      {
        name: 'Fishing harbors',
        description:
          'Red rorbuer cabins and stockfish racks in sheltered village coves.',
      },
      {
        name: 'Arctic light',
        description:
          'Midnight sun and aurora seasons that define the year as much as weather.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lofoten',
        url: 'https://www.britannica.com/place/Lofoten',
        kind: 'reference',
      },
      {
        label: 'Visit Norway — Lofoten',
        url: 'https://www.visitnorway.com/places-to-go/northern-norway/lofoten/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'gotland',
    code: 'GOT',
    name: 'Gotland',
    kind: 'Island',
    countrySlug: 'sweden',
    subtitle: 'Island · Sweden',
    matchNames: ['Gotland'],
    about:
      'Gotland is Sweden’s largest island in the Baltic, a limestone plateau of medieval Visby walls, coastal stacks, and pastoral interior. Hanseatic trade once made Visby a Baltic power; today the island balances farming, summer visitation, and military geography. Orientation is Visby versus rural limestone coast. Gotland’s primer is Baltic limestone island — light rock, low relief, and a walled town that still reads as a medieval trading capital.',
    facts: {
      kind: 'Island',
      country: 'Sweden',
      region: 'Europe',
      setting: 'Central Baltic · limestone plateau',
      role: 'Sweden’s principal Baltic island with Hanseatic heritage',
      knownFor: 'Visby walls, rauks, and pastoral limestone country',
    },
    features: [
      {
        name: 'Visby',
        description:
          'A walled medieval town of churches and warehouses on the west coast.',
      },
      {
        name: 'Coastal rauks',
        description:
          'Limestone sea stacks and cliffs shaped by Baltic weathering.',
      },
      {
        name: 'Plateau farms',
        description:
          'Open pastoral interior on thin soils over limestone bedrock.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gotland',
        url: 'https://www.britannica.com/place/Gotland',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Hanseatic Town of Visby',
        url: 'https://whc.unesco.org/en/list/731/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mamanuca',
    code: 'MAM',
    name: 'Mamanuca Islands',
    kind: 'Island',
    countrySlug: 'fiji',
    subtitle: 'Island group · Fiji',
    matchNames: ['Mamanuca Islands'],
    about:
      'The Mamanuca Islands are a volcanic and reef-fringed chain west of Viti Levu, among Fiji’s most approachable outer islands. Coral gardens, sandy cays, and small resort or village islands share clear lagoon water. Orientation is boat-hopping among low islands under trade-wind skies. The Mamanucas’ primer is tropical reef archipelago at human scale — not a single large island, but a constellation of shores defined by lagoon color and reef shelter.',
    facts: {
      kind: 'Island',
      country: 'Fiji',
      region: 'Oceania',
      setting: 'Western Fiji · reef lagoons',
      role: 'Island group of villages and reef tourism',
      knownFor: 'Coral lagoons, cays, and volcanic islets',
    },
    features: [
      {
        name: 'Reef lagoons',
        description:
          'Shallow turquoise basins sheltered by barrier and fringing reefs.',
      },
      {
        name: 'Volcanic islets',
        description:
          'Small peaks and ridges rising just enough to host villages and vegetation.',
      },
      {
        name: 'Cay beaches',
        description:
          'Low sand islands where reef rubble and coral sand build temporary shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fiji',
        url: 'https://www.britannica.com/place/Fiji-republic-Pacific-Ocean',
        kind: 'reference',
      },
      {
        label: 'Tourism Fiji — Mamanuca Islands',
        url: 'https://www.fiji.travel/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'great-wall',
    code: 'WAL',
    name: 'Great Wall',
    kind: 'Landmark',
    countrySlug: 'china',
    subtitle: 'Landmark · China',
    matchNames: ['Great Wall of China', 'Great Wall'],
    about:
      'The Great Wall is a discontinuous system of fortifications across northern China, rebuilt in many eras and best known today in Ming brick and stone sections near Beijing. Watchtowers, passes, and ridge lines follow terrain rather than a single straight barrier. Orientation is section by section — Badaling, Mutianyu, Jinshanling — each with different restoration and steepness. The Wall’s primer is frontier infrastructure as landscape: defense architecture that became a mountainous path network readable as both ruin and rebuilt monument.',
    facts: {
      kind: 'Landmark',
      country: 'China',
      region: 'Asia',
      setting: 'Northern frontier ranges',
      role: 'Historic fortification system and national emblem',
      knownFor: 'Watchtowers, ridge walks, and mountain passes',
    },
    features: [
      {
        name: 'Ming sections',
        description:
          'Brick and stone stretches near Beijing that define the modern visitor image.',
      },
      {
        name: 'Watchtowers',
        description:
          'Regular towers for signaling and garrison along ridge lines.',
      },
      {
        name: 'Terrain following',
        description:
          'Wall alignments that climb and kink with the mountains rather than ignore them.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Great Wall of China',
        url: 'https://www.britannica.com/topic/Great-Wall-of-China',
        kind: 'reference',
      },
      {
        label: 'UNESCO — The Great Wall',
        url: 'https://whc.unesco.org/en/list/438/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'taj-mahal',
    code: 'TAJ',
    name: 'Taj Mahal',
    kind: 'Landmark',
    countrySlug: 'india',
    subtitle: 'Landmark · India',
    matchNames: ['Taj Mahal'],
    about:
      'The Taj Mahal is a white-marble mausoleum on the Yamuna in Agra, built by the Mughal emperor Shah Jahan as a tomb for Mumtaz Mahal. Char bagh gardens, reflecting pools, and flanking mosques and jawab buildings stage axial approaches to the central dome and four minarets. Pietra dura inlay and calligraphy refine surfaces that change color with daylight. Orientation is garden axis to plinth to dome. The Taj’s primer is Mughal funerary architecture at perfect bilateral balance — a riverside tomb that became a global emblem of North Indian imperial art.',
    facts: {
      kind: 'Landmark',
      country: 'India',
      region: 'Asia',
      setting: 'Agra · Yamuna riverbank',
      role: 'Mughal mausoleum and World Heritage icon',
      knownFor: 'Marble dome, char bagh, and river terrace',
    },
    features: [
      {
        name: 'Central mausoleum',
        description:
          'Onion dome, iwans, and minarets in white marble on a raised plinth.',
      },
      {
        name: 'Char bagh garden',
        description:
          'Fourfold paradise garden with water channels framing the axial view.',
      },
      {
        name: 'Yamuna terrace',
        description:
          'A riverside setting that opens the north face to the river plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Taj Mahal',
        url: 'https://www.britannica.com/topic/Taj-Mahal',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Taj Mahal',
        url: 'https://whc.unesco.org/en/list/252/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'ha-long-bay',
    code: 'HLB',
    name: 'Ha Long Bay',
    kind: 'Landmark',
    countrySlug: 'vietnam',
    subtitle: 'Landmark · Vietnam',
    matchNames: ['Ha Long Bay'],
    about:
      'Ha Long Bay is a drowned karst seascape in northeastern Vietnam, where thousands of limestone islands and islets rise from emerald shallows. Junks and smaller boats thread passages among towers fretted with caves. Tide, mist, and monsoon shape visibility across the bay. Orientation is boat routes among named islets rather than a single shore viewpoint. Ha Long’s primer is marine karst — the same limestone chemistry as inland cones, here invaded by the sea into a labyrinth of towers and tunnels.',
    facts: {
      kind: 'Landmark',
      country: 'Vietnam',
      region: 'Asia',
      setting: 'Gulf of Tonkin · drowned karst',
      role: 'Iconic seascape and World Heritage bay',
      knownFor: 'Limestone islets, caves, and emerald shallows',
    },
    features: [
      {
        name: 'Karst islets',
        description:
          'Vertical towers and cones rising densely from shallow marine water.',
      },
      {
        name: 'Sea caves',
        description:
          'Hollowed passages and grottos cut by waves into limestone flanks.',
      },
      {
        name: 'Boat labyrinth',
        description:
          'Channels and anchorages that make navigation the main way of seeing.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ha Long Bay',
        url: 'https://www.britannica.com/place/Ha-Long-Bay',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Ha Long Bay – Cat Ba Archipelago',
        url: 'https://whc.unesco.org/en/list/672/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'milford-sound',
    code: 'MFZ',
    name: 'Milford Sound',
    kind: 'Landmark',
    countrySlug: 'new-zealand',
    subtitle: 'Landmark · New Zealand',
    matchNames: ['Milford Sound'],
    about:
      'Milford Sound (Piopiotahi) is a glaciated fjord on New Zealand’s southwestern South Island, where sheer rock walls and waterfalls plunge into a deep inlet of the Tasman approaches. Mitre Peak’s pyramid is the signature skyline; rain forest clings to near-vertical slopes under very high rainfall. Orientation is from the fjord head seaward between walls that dwarf boats. Milford’s primer is glacial carving at oceanic latitudes — a U-shaped trough drowned by the sea and kept green by relentless moisture.',
    facts: {
      kind: 'Landmark',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Fiordland · Tasman approaches',
      role: 'Iconic fjord within a World Heritage wilderness',
      knownFor: 'Sheer walls, Mitre Peak, and hanging waterfalls',
    },
    features: [
      {
        name: 'Mitre Peak',
        description:
          'A sharp pyramid peak that anchors the classic fjord silhouette.',
      },
      {
        name: 'Hanging falls',
        description:
          'Waterfalls dropping from hanging valleys after frequent rain.',
      },
      {
        name: 'Glacial trough',
        description:
          'Deep U-shaped walls proving ice, not river alone, cut the inlet.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Milford Sound',
        url: 'https://www.britannica.com/place/Milford-Sound',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Te Wahipounamu – South West New Zealand',
        url: 'https://whc.unesco.org/en/list/551/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cliffs-of-moher',
    code: 'MOH',
    name: 'Cliffs of Moher',
    kind: 'Landmark',
    countrySlug: 'ireland',
    subtitle: 'Landmark · Ireland',
    matchNames: ['Cliffs of Moher'],
    about:
      'The Cliffs of Moher rise as sandstone and shale sea cliffs on Ireland’s County Clare coast, facing the Atlantic with nesting seabirds and long horizontal bedding. O’Brien’s Tower marks a Victorian viewpoint on the cliff edge; the Burren’s limestone country lies inland. Orientation is along the cliff path with ocean west and plateau east. The Cliffs’ primer is Atlantic erosional coast — layered rock walls, wind, and swell writing a vertical edge on the island’s western face.',
    facts: {
      kind: 'Landmark',
      country: 'Ireland',
      region: 'Europe',
      setting: 'County Clare · Atlantic edge',
      role: 'Iconic sea-cliff coastline',
      knownFor: 'Layered cliffs, seabirds, and ocean exposure',
    },
    features: [
      {
        name: 'Cliff face',
        description:
          'Hundreds of meters of horizontal beds dropping to Atlantic surf.',
      },
      {
        name: 'Cliff path',
        description:
          'A coastal walk linking viewpoints along the plateau edge.',
      },
      {
        name: 'Ocean fetch',
        description:
          'Open Atlantic exposure that drives wind, spray, and erosion.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cliffs of Moher',
        url: 'https://www.britannica.com/place/Cliffs-of-Moher',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Burren and Cliffs of Moher Geopark',
        url: 'https://www.unesco.org/en/iggp/burren-and-cliffs-moher-unesco-global-geopark',
        kind: 'authority',
      },
    ],
  },
]
