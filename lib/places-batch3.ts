/** Third curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch3: PlaceGuideDraftBatch[] = [
  {
    slug: 'mexico-city',
    code: 'MEX',
    name: 'Mexico City',
    kind: 'City',
    countrySlug: 'mexico',
    subtitle: 'City · Mexico',
    matchNames: ['Mexico City'],
    about:
      'Mexico City occupies a high basin once a lake system, now a vast highland capital of plazas, volcano views, and layered Aztec-to-modern streets. The Zócalo and historic center sit near the former island core of Tenochtitlan; neighborhoods climb toward surrounding mountains. Altitude shapes climate and light. Orientation uses the central plaza, Reforma axis, and basin rim. Mexico City’s primer is highland megacity on a drained lakebed — deep Indigenous urban roots under colonial grids and contemporary density at over two kilometers of elevation.',
    facts: {
      kind: 'City',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Valley of Mexico · high basin',
      role: 'National capital and highland metropolis',
      knownFor: 'Central plaza, basin setting, and volcano horizons',
    },
    features: [
      {
        name: 'Historic center',
        description:
          'Zócalo, cathedral, and streets over the former Mexica island capital.',
      },
      {
        name: 'Basin rim',
        description:
          'Mountains and volcanoes framing the highland urban field.',
      },
      {
        name: 'Reforma corridor',
        description:
          'A monumental avenue stitching parks, monuments, and tower districts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mexico City',
        url: 'https://www.britannica.com/place/Mexico-City',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Mexico City',
        url: 'https://whc.unesco.org/en/list/412/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lima',
    code: 'LIM',
    name: 'Lima',
    kind: 'City',
    countrySlug: 'peru',
    subtitle: 'City · Peru',
    matchNames: ['Lima'],
    about:
      'Lima spreads along a Pacific desert coast beneath Andean foothills, a fog-cooled capital of cliffs, colonial plazas, and long coastal avenues. The historic center holds plazas and churches from the viceregal era; Miraflores and Barranco face ocean bluffs. The Humboldt Current shapes cool grey winters without much rain. Orientation is coast versus inland desert districts. Lima’s primer is desert littoral capital — a major South American city living on arid coastal terraces watered by Andean rivers rather than local rainfall.',
    facts: {
      kind: 'City',
      country: 'Peru',
      region: 'Americas',
      setting: 'Pacific desert coast · Andean foothills',
      role: 'National capital and principal coastal metropolis',
      knownFor: 'Cliff coast, colonial core, and desert climate',
    },
    features: [
      {
        name: 'Historic centre',
        description:
          'Plazas and baroque churches from the Spanish viceregal capital.',
      },
      {
        name: 'Costa Verde',
        description:
          'Ocean cliffs and coastal districts facing the cool Pacific.',
      },
      {
        name: 'Desert setting',
        description:
          'Arid terraces reliant on Andean river water rather than local rain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lima',
        url: 'https://www.britannica.com/place/Lima',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Lima',
        url: 'https://whc.unesco.org/en/list/500/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'bogota',
    code: 'BOG',
    name: 'Bogotá',
    kind: 'City',
    countrySlug: 'colombia',
    subtitle: 'City · Colombia',
    matchNames: ['Bogotá', 'Bogota'],
    about:
      'Bogotá sits on a cool highland savanna at the eastern edge of Colombia’s Andes, with Monserrate rising above a dense plateau city. Colonial La Candelaria anchors the historic core; later growth fills the flat basin. Altitude keeps temperatures moderate near the equator. Orientation uses the eastern cordillera wall, the plateau floor, and north–south avenues. Bogotá’s primer is Andean plateau capital — a political and cultural center living under mountain weather rather than tropical lowland heat.',
    facts: {
      kind: 'City',
      country: 'Colombia',
      region: 'Americas',
      setting: 'Andean plateau · Eastern Cordillera',
      role: 'National capital on a highland savanna',
      knownFor: 'Plateau setting, Monserrate, and cool equatorial climate',
    },
    features: [
      {
        name: 'Monserrate',
        description:
          'A sacred ridge peak overlooking the city from the eastern wall.',
      },
      {
        name: 'La Candelaria',
        description:
          'The colonial quarter of churches, museums, and steep lanes.',
      },
      {
        name: 'Savanna floor',
        description:
          'A flat highland basin where most of the metropolis spreads.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bogotá',
        url: 'https://www.britannica.com/place/Bogota',
        kind: 'reference',
      },
      {
        label: 'City of Bogotá — Heritage',
        url: 'https://bogota.gov.co/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'santiago',
    code: 'SCL',
    name: 'Santiago',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Santiago'],
    about:
      'Santiago occupies a valley between the Andes and the Chilean Coast Range, a capital of clear winter views to snow peaks and hot, dry summers. The Mapocho River crosses the basin; Cerro San Cristóbal and Santa Lucía punctuate the urban field. Orientation is valley floor versus Andean wall to the east. Santiago’s primer is Andean foothill metropolis — Chile’s demographic and political core living in a Mediterranean-climate basin under continental-scale mountains.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Central Valley · Andes foothills',
      role: 'National capital and primary metropolitan region',
      knownFor: 'Andean backdrop, basin floor, and hill parks',
    },
    features: [
      {
        name: 'Andean wall',
        description:
          'Snow peaks rising abruptly east of the city on clear days.',
      },
      {
        name: 'Cerros',
        description:
          'Urban hills such as San Cristóbal offering basin overlooks.',
      },
      {
        name: 'Mapocho corridor',
        description:
          'A river and park axis threading through downtown districts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Santiago',
        url: 'https://www.britannica.com/place/Santiago-Chile',
        kind: 'reference',
      },
      {
        label: 'Gobierno de Chile — Santiago',
        url: 'https://www.gob.cl/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'nairobi',
    code: 'NBO',
    name: 'Nairobi',
    kind: 'City',
    countrySlug: 'kenya',
    subtitle: 'City · Kenya',
    matchNames: ['Nairobi'],
    about:
      'Nairobi grew from a highland railway camp into Kenya’s capital on a plateau south of Mount Kenya’s wider volcanic province. National park land presses against the urban edge; skylines and informal settlements share the same temperate highland climate. Orientation uses the CBD, Uhuru Highway corridor, and southern park boundary. Nairobi’s primer is highland East African capital — an inland city where wildlife habitat and metropolitan growth meet at an unusually sharp edge.',
    facts: {
      kind: 'City',
      country: 'Kenya',
      region: 'Africa',
      setting: 'Kenyan highlands · Athi plains edge',
      role: 'National capital and regional business hub',
      knownFor: 'Highland climate and park-edge metropolis',
    },
    features: [
      {
        name: 'Park edge',
        description:
          'Nairobi National Park adjoining the southern urban boundary.',
      },
      {
        name: 'Highland plateau',
        description:
          'Temperate elevation that moderates equatorial latitude.',
      },
      {
        name: 'CBD corridor',
        description:
          'Downtown and arterial spines organizing contemporary growth.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nairobi',
        url: 'https://www.britannica.com/place/Nairobi',
        kind: 'reference',
      },
      {
        label: 'Kenya Wildlife Service — Nairobi National Park',
        url: 'https://www.kws.go.ke/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'athens',
    code: 'ATH',
    name: 'Athens',
    kind: 'City',
    countrySlug: 'greece',
    subtitle: 'City · Greece',
    matchNames: ['Athens'],
    about:
      'Athens fills a coastal basin under the Acropolis, a rock that still organizes the city’s skyline and historical identity. Classical ruins, Ottoman and neoclassical layers, and dense modern neighborhoods share short walks. The Attic light and surrounding hills define views toward Piraeus and the Saronic Gulf. Orientation is Acropolis-centered, then neighborhoods and coastal approaches. Athens’s primer is basin capital under a sacred rock — continuous habitation around monuments that made the city’s name synonymous with classical civic culture.',
    facts: {
      kind: 'City',
      country: 'Greece',
      region: 'Europe',
      setting: 'Attica basin · Saronic approaches',
      role: 'National capital with a classical monumental core',
      knownFor: 'Acropolis, basin neighborhoods, and Attic light',
    },
    features: [
      {
        name: 'Acropolis',
        description:
          'The Parthenon-crowned rock dominating the historic basin.',
      },
      {
        name: 'Ancient Agora approaches',
        description:
          'Ruined civic ground linking classical streets to later fabric.',
      },
      {
        name: 'Basin and hills',
        description:
          'Surrounding ridges and gulf approaches framing the capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Athens',
        url: 'https://www.britannica.com/place/Athens',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Acropolis, Athens',
        url: 'https://whc.unesco.org/en/list/404/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'stockholm',
    code: 'STO',
    name: 'Stockholm',
    kind: 'City',
    countrySlug: 'sweden',
    subtitle: 'City · Sweden',
    matchNames: ['Stockholm', 'Gamla Stan'],
    about:
      'Stockholm is built across islands where Lake Mälaren meets the Baltic, a capital of bridges, ferries, and Gamla Stan’s medieval lanes. Water is the primary street logic; parks and wooded islands continue into the archipelago. Orientation is island by island from the Old Town outward. Stockholm’s primer is archipelagic capital — northern European urban life organized by channels and bridges rather than a single continuous mainland grid.',
    facts: {
      kind: 'City',
      country: 'Sweden',
      region: 'Europe',
      setting: 'Mälaren–Baltic outlet · archipelago',
      role: 'National capital on interlocking islands',
      knownFor: 'Waterways, Gamla Stan, and island districts',
    },
    features: [
      {
        name: 'Gamla Stan',
        description:
          'The island Old Town of lanes, palace, and medieval street grain.',
      },
      {
        name: 'Bridge network',
        description:
          'Crossings that stitch islands into one navigable city.',
      },
      {
        name: 'Archipelago edge',
        description:
          'Wooded skerries continuing the urban field into Baltic waters.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Stockholm',
        url: 'https://www.britannica.com/place/Stockholm',
        kind: 'reference',
      },
      {
        label: 'City of Stockholm',
        url: 'https://international.stockholm.se/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'copenhagen',
    code: 'CPH',
    name: 'Copenhagen',
    kind: 'City',
    countrySlug: 'denmark',
    subtitle: 'City · Denmark',
    matchNames: ['Copenhagen'],
    about:
      'Copenhagen occupies Zealand’s eastern shore facing Sweden across the Øresund, a low brick-and-canal capital of harbors, bicycles, and colored waterfront houses. Nyhavn and the Inner Harbor stage classic views; later districts extend along reclaimed edges. Orientation is harbor-centered with bridge and metro links to Amager and beyond. Copenhagen’s primer is Øresund port city — Danish capital life organized around a sheltered sound rather than a great river or mountain basin.',
    facts: {
      kind: 'City',
      country: 'Denmark',
      region: 'Europe',
      setting: 'Øresund · Zealand',
      role: 'National capital and Øresund metropolis',
      knownFor: 'Harbor fronts, canals, and low brick urbanism',
    },
    features: [
      {
        name: 'Nyhavn',
        description:
          'A colorful canal harbor lined with historic townhouses.',
      },
      {
        name: 'Inner Harbour',
        description:
          'The working and recreational water spine of the central city.',
      },
      {
        name: 'Øresund setting',
        description:
          'A sound geography linking Copenhagen toward Swedish shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Copenhagen',
        url: 'https://www.britannica.com/place/Copenhagen',
        kind: 'reference',
      },
      {
        label: 'Visit Copenhagen',
        url: 'https://www.visitcopenhagen.com/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mumbai',
    code: 'BOM',
    name: 'Mumbai',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Mumbai'],
    about:
      'Mumbai occupies a reclaimed island peninsula on India’s west coast, a dense Arabian Sea port of Victorian Gothic monuments, art-deco seafronts, and continuous vertical growth. The Gateway of India and Marine Drive mark ceremonial and leisure waterfronts; suburban rails stitch the island chain northward. Orientation is peninsula tip versus northern suburbs. Mumbai’s primer is island-port megacity — monsoon climate, colonial waterfront architecture, and extreme density on limited land at the Arabian Sea edge.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Arabian Sea · island peninsula',
      role: 'Maharashtra’s capital and major financial port',
      knownFor: 'Seafronts, colonial landmarks, and peninsula density',
    },
    features: [
      {
        name: 'Gateway waterfront',
        description:
          'Ceremonial harbor edge facing the Arabian Sea approaches.',
      },
      {
        name: 'Marine Drive',
        description:
          'A curved art-deco promenade along Back Bay.',
      },
      {
        name: 'Island spine',
        description:
          'North–south rails and roads linking reclaimed island districts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mumbai',
        url: 'https://www.britannica.com/place/Mumbai',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Victorian Gothic and Art Deco Ensembles of Mumbai',
        url: 'https://whc.unesco.org/en/list/1480/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'shanghai',
    code: 'SHA',
    name: 'Shanghai',
    kind: 'City',
    countrySlug: 'china',
    subtitle: 'City · China',
    matchNames: ['Shanghai'],
    about:
      'Shanghai sits at the Yangtze mouth on China’s east coast, a delta metropolis split by the Huangpu River between the Bund’s historic waterfront and Pudong’s towers. Concessions-era streets, lilong lanes, and vast new districts share one metropolitan frame. Orientation is Bund–Pudong across the river, then expanding ring suburbs. Shanghai’s primer is river-mouth global city — Chinese and international layers facing each other across a working urban waterway.',
    facts: {
      kind: 'City',
      country: 'China',
      region: 'Asia',
      setting: 'Yangtze delta · Huangpu River',
      role: 'Principal Chinese port and financial metropolis',
      knownFor: 'Bund, Pudong skyline, and delta scale',
    },
    features: [
      {
        name: 'The Bund',
        description:
          'Historic waterfront facades facing the Huangpu’s west bank.',
      },
      {
        name: 'Pudong towers',
        description:
          'A vertical district rising opposite the Bund as a new skyline.',
      },
      {
        name: 'Delta setting',
        description:
          'Low coastal plain and river mouth geography underwriting port growth.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Shanghai',
        url: 'https://www.britannica.com/place/Shanghai',
        kind: 'reference',
      },
      {
        label: 'Shanghai Municipal Government',
        url: 'https://www.shanghai.gov.cn/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'melbourne',
    code: 'MEL',
    name: 'Melbourne',
    kind: 'City',
    countrySlug: 'australia',
    subtitle: 'City · Australia',
    matchNames: ['Melbourne'],
    about:
      'Melbourne spreads around Port Phillip Bay on Australia’s southeast coast, a planned Victorian grid later laced with lanes, tram corridors, and Yarra River parks. The bay and river organize climate and views more than dramatic hills. Orientation is CBD Hoddle Grid, riverside, and bay suburbs. Melbourne’s primer is bay-metropolis planning — a nineteenth-century grid capital that became a sprawling tram city with a strong laneway grain inside the formal blocks.',
    facts: {
      kind: 'City',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Port Phillip · Yarra River',
      role: 'State capital of Victoria',
      knownFor: 'Grid and lanes, trams, and bay setting',
    },
    features: [
      {
        name: 'Hoddle Grid',
        description:
          'The formal CBD blocks later cut by famous pedestrian lanes.',
      },
      {
        name: 'Yarra corridor',
        description:
          'Parks and cultural venues along the river through the center.',
      },
      {
        name: 'Bay suburbs',
        description:
          'Settlements wrapping Port Phillip’s northern and eastern shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Melbourne',
        url: 'https://www.britannica.com/place/Melbourne',
        kind: 'reference',
      },
      {
        label: 'City of Melbourne',
        url: 'https://www.melbourne.vic.gov.au/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'chicago',
    code: 'CHI',
    name: 'Chicago',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Chicago'],
    about:
      'Chicago occupies the southwestern shore of Lake Michigan, a grid metropolis of towers, parks, and canal-era engineering that reversed a river to serve the lake. The Loop and lakefront skyline define the classic view; prairie and industrial corridors continue inland. Orientation is lake versus inland grid. Chicago’s primer is Great Lakes city — freshwater horizon as ocean substitute, architecture as civic identity, and a plan that treats the shoreline as the primary public edge.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Michigan · Chicago River',
      role: 'Major Midwestern metropolis and architectural center',
      knownFor: 'Lakefront skyline, grid, and river engineering',
    },
    features: [
      {
        name: 'Lakefront',
        description:
          'Parks and towers facing the freshwater horizon of Lake Michigan.',
      },
      {
        name: 'The Loop',
        description:
          'The dense downtown core defined by elevated transit and historic towers.',
      },
      {
        name: 'River system',
        description:
          'Engineered channels connecting inland commerce to the lake.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Chicago',
        url: 'https://www.britannica.com/place/Chicago',
        kind: 'reference',
      },
      {
        label: 'City of Chicago',
        url: 'https://www.chicago.gov/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'texas',
    code: 'TX',
    name: 'Texas',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Texas'],
    about:
      'Texas spans Gulf coast, plains, Hill Country, and desert basins across a state large enough to hold multiple climates. Cities such as Houston, Dallas–Fort Worth, Austin, and San Antonio form distinct metropolitan poles; Big Bend and barrier islands mark natural extremes. Orientation is region by region rather than a single landscape type. Texas’s primer is continental-scale state geography inside one political outline — humid coast, prairie, limestone hills, and Chihuahuan desert sharing borders and infrastructure.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Gulf Coast to Chihuahuan Desert',
      role: 'Second-most-populous U.S. state; multi-region economy',
      knownFor: 'Coast, plains, Hill Country, and desert basins',
    },
    features: [
      {
        name: 'Gulf coast',
        description:
          'Barrier islands, ports, and humid lowlands along the southern edge.',
      },
      {
        name: 'Hill Country',
        description:
          'Limestone hills and spring-fed rivers in the central uplands.',
      },
      {
        name: 'Western deserts',
        description:
          'Basin-and-range country toward Big Bend and the Rio Grande.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Texas',
        url: 'https://www.britannica.com/place/Texas-state',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Texas parks',
        url: 'https://www.nps.gov/state/tx/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'florida',
    code: 'FL',
    name: 'Florida',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Florida'],
    about:
      'Florida is a low limestone peninsula between the Gulf of Mexico and the Atlantic, famous for wetlands, barrier islands, and subtropical-to-tropical climate gradients. The Everglades dominate the south; springs and scrub mark the interior; coral and mangrove coasts define many shores. Orientation is Atlantic versus Gulf versus interior wetland. Florida’s primer is peninsula hydrology — a state whose shallow geology, hurricanes, and wetlands shape settlement as much as its beaches.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Peninsular Florida · Gulf and Atlantic',
      role: 'Southeastern U.S. state of coasts and wetlands',
      knownFor: 'Everglades, beaches, and limestone hydrology',
    },
    features: [
      {
        name: 'Everglades',
        description:
          'A vast slow wetland sheetflow landscape in the southern interior.',
      },
      {
        name: 'Barrier coasts',
        description:
          'Atlantic and Gulf shores of beaches, mangroves, and keys.',
      },
      {
        name: 'Spring country',
        description:
          'Clear karst springs feeding rivers across the northern and central peninsula.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Florida',
        url: 'https://www.britannica.com/place/Florida',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Everglades',
        url: 'https://www.nps.gov/ever/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tasmania',
    code: 'TAS',
    name: 'Tasmania',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['Tasmania'],
    about:
      'Tasmania is Australia’s island state south of the mainland, a temperate land of wilderness mountains, button-grass plains, and a compact capital at Hobart on the Derwent. World Heritage forests and rugged coasts dominate much of the west; farming valleys occupy the east. Orientation is Hobart and the southeast versus remote western wilderness. Tasmania’s primer is cool-temperate island state — Australian politically, but climatically and ecologically closer to southern ocean latitudes than to the arid continent’s center.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Southern Ocean approaches · temperate island',
      role: 'Island state with extensive wilderness reserves',
      knownFor: 'Wild coasts, highland forests, and Hobart’s estuary',
    },
    features: [
      {
        name: 'Western wilderness',
        description:
          'Remote mountains and forests protected at World Heritage scale.',
      },
      {
        name: 'Derwent estuary',
        description:
          'Hobart’s setting between mountain and sheltered water.',
      },
      {
        name: 'Eastern valleys',
        description:
          'Drier farming districts contrasting the wet west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tasmania',
        url: 'https://www.britannica.com/place/Tasmania',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tasmanian Wilderness',
        url: 'https://whc.unesco.org/en/list/181/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'amalfi-coast',
    code: 'AMA',
    name: 'Amalfi Coast',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Amalfi Coast'],
    about:
      'The Amalfi Coast is a cliffed Tyrrhenian shoreline of terraced towns south of Naples, where Positano, Amalfi, and neighboring villages cling to limestone slopes above intense blue water. Lemon groves and switchback roads occupy niches in nearly vertical relief. Orientation is town-to-town along the coastal road or by boat. The Amalfi Coast’s primer is vertical Mediterranean settlement — architecture and agriculture suspended between mountain wall and sea with little flat land between.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Tyrrhenian cliffs · Sorrento peninsula',
      role: 'Historic cliff-coast cultural landscape',
      knownFor: 'Terraced towns, cliffs, and coastal switchbacks',
    },
    features: [
      {
        name: 'Cliff towns',
        description:
          'Stacked pastel settlements facing open Tyrrhenian water.',
      },
      {
        name: 'Terrace agriculture',
        description:
          'Lemon and vine plots carved into steep limestone slopes.',
      },
      {
        name: 'Coast road',
        description:
          'Hairpin routes linking villages where flat corridors do not exist.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Amalfi',
        url: 'https://www.britannica.com/place/Amalfi',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Costiera Amalfitana',
        url: 'https://whc.unesco.org/en/list/830/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lake-district',
    code: 'LAK',
    name: 'Lake District',
    kind: 'Region',
    countrySlug: 'united-kingdom',
    subtitle: 'Region · United Kingdom',
    matchNames: ['Lake District'],
    about:
      'The Lake District is a glaciated upland in northwest England of lakes, fells, and stone villages, long associated with Romantic literature and hill walking. Windermere and other meres fill glacial troughs; ridges offer short, steep ascents. Orientation is valley lake versus surrounding fells. The Lake District’s primer is compact mountain district — Alpine scenery at British scale, wet Atlantic weather, and a cultural landscape of farms and paths inside a national park.',
    facts: {
      kind: 'Region',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Cumbria · glaciated English upland',
      role: 'National park and classic British hill country',
      knownFor: 'Lakes, fells, and stone villages',
    },
    features: [
      {
        name: 'Glacial lakes',
        description:
          'Long meres occupying ice-carved valleys among the fells.',
      },
      {
        name: 'Fell ridges',
        description:
          'Short, steep uplands that define classic Lake District walks.',
      },
      {
        name: 'Valley settlements',
        description:
          'Villages and farms strung along lake shores and dale floors.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lake District',
        url: 'https://www.britannica.com/place/Lake-District',
        kind: 'reference',
      },
      {
        label: 'UNESCO — English Lake District',
        url: 'https://whc.unesco.org/en/list/422/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'rhine-valley',
    code: 'RHI',
    name: 'Rhine Valley',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Rhine Valley'],
    about:
      'The Rhine Valley, especially the Middle Rhine Gorge, is a castle-lined river corridor through slate hills where vineyards, barges, and legendary cliffs share a narrow passage. Towns occupy scarce flat shelves; fortresses crown bends. Orientation follows the river north–south between Mainz and Koblenz for the classic gorge. The Rhine Valley’s primer is fluvial cultural landscape — trade artery, wine terraces, and romantic ruin geography compressed into a single navigable trench.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Middle Rhine Gorge · slate hills',
      role: 'Historic trade corridor and wine landscape',
      knownFor: 'Castles, terraces, and river bends',
    },
    features: [
      {
        name: 'Gorge cliffs',
        description:
          'Slate walls forcing the Rhine through a narrow romantic passage.',
      },
      {
        name: 'Castle bends',
        description:
          'Fortresses and ruins commanding views over historic toll points.',
      },
      {
        name: 'Vine terraces',
        description:
          'Steep Riesling slopes facing the river’s reflected light.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rhine River',
        url: 'https://www.britannica.com/place/Rhine-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Upper Middle Rhine Valley',
        url: 'https://whc.unesco.org/en/list/1066/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'central-highlands',
    code: 'SLH',
    name: 'Central Highlands',
    kind: 'Region',
    countrySlug: 'sri-lanka',
    subtitle: 'Region · Sri Lanka',
    matchNames: ['Central Highlands'],
    about:
      'Sri Lanka’s Central Highlands are a cool misty upland of tea estates, cloud forest, and peaked ridges rising from the island’s tropical lowlands. Nuwara Eliya, Ella, and Kandy mark different elevations and histories along the massif. Orientation is altitude bands from cultural capital valleys to open tea plateaus. The Central Highlands’ primer is tropical mountain island — British-era tea landscapes overlaid on older Sinhalese highland geography, with railways clinging to escarpments.',
    facts: {
      kind: 'Region',
      country: 'Sri Lanka',
      region: 'Asia',
      setting: 'Central Massif · tea country',
      role: 'Highland cultural and agricultural heartland',
      knownFor: 'Tea estates, cloud forest, and hill towns',
    },
    features: [
      {
        name: 'Tea plateaus',
        description:
          'Contour-planted estates defining the classic highland vista.',
      },
      {
        name: 'Escarpment rail',
        description:
          'Mountain railways climbing from lowland heat into mist belts.',
      },
      {
        name: 'Peak wilderness',
        description:
          'Cloud-forest ridges and peaks above the cultivated belt.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sri Lanka',
        url: 'https://www.britannica.com/place/Sri-Lanka',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Central Highlands of Sri Lanka',
        url: 'https://whc.unesco.org/en/list/1203/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'crete',
    code: 'CRE',
    name: 'Crete',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Crete'],
    about:
      'Crete is Greece’s largest island, a mountainous bar across the southern Aegean with deep gorges, Minoan ruins, and contrasting north–south coasts. The White Mountains and Ida massifs create short trips from snow streaks to olive coasts. Orientation is north coast cities versus wilder south and highland interiors. Crete’s primer is Mediterranean mountain island — archaeological depth and abrupt relief inside one elongated landmass that feels like a small continent.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Southern Aegean · high limestone ranges',
      role: 'Largest Greek island with Minoan heritage',
      knownFor: 'Gorges, mountains, and ancient palace sites',
    },
    features: [
      {
        name: 'Mountain spine',
        description:
          'High ranges creating climatic and cultural contrasts across short distances.',
      },
      {
        name: 'Samaria-scale gorges',
        description:
          'Deep canyons cutting from plateau to south-coast exits.',
      },
      {
        name: 'Minoan sites',
        description:
          'Palace ruins anchoring Bronze Age chapters of island history.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Crete',
        url: 'https://www.britannica.com/place/Crete',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological sites context via Greece',
        url: 'https://whc.unesco.org/en/statesparties/gr',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'corsica',
    code: 'COR',
    name: 'Corsica',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Corsica'],
    about:
      'Corsica is a mountainous Mediterranean island of granite peaks, dense maquis, and cliff towns under French administration with a distinct Corsican culture. Calanques and Bonifacio’s chalk cliffs mark dramatic coasts; the interior GR20 ridge route is famed among hikers. Orientation is coastal resorts versus highland interior. Corsica’s primer is high island in a warm sea — Alpine scale relief compressed into a Corsican identity that is geographically closer to Italy than to mainland France.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Europe',
      setting: 'Western Mediterranean · granite massif',
      role: 'Mountainous French island with strong regional identity',
      knownFor: 'Peaks, maquis, and cliff coasts',
    },
    features: [
      {
        name: 'Granite highlands',
        description:
          'A rugged spine that dominates weather and settlement patterns.',
      },
      {
        name: 'Calanques and cliffs',
        description:
          'Inlets and chalk walls along celebrated coastal stretches.',
      },
      {
        name: 'Maquis interior',
        description:
          'Scented scrub covering slopes between villages and ridges.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Corsica',
        url: 'https://www.britannica.com/place/Corsica',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Gulf of Porto (Calanche)',
        url: 'https://whc.unesco.org/en/list/258/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sardinia',
    code: 'SAR',
    name: 'Sardinia',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Sardinia'],
    about:
      'Sardinia is a large Mediterranean island west of mainland Italy, with Nuragic stone towers, long beaches, and a mountainous interior distinct from Sicily’s volcanic east. Costa Smeralda and southern coasts draw different visitors; pastoral highlands preserve older rhythms. Orientation is coast versus Barbagia interior. Sardinia’s primer is island autonomy of landscape — Italian politically, but with prehistoric monuments and coastal geographies that feel self-contained.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Western Mediterranean · granitic and limestone coasts',
      role: 'Italy’s second-largest island region',
      knownFor: 'Nuraghi, beaches, and highland interior',
    },
    features: [
      {
        name: 'Nuragic towers',
        description:
          'Bronze Age stone structures scattered across the interior.',
      },
      {
        name: 'Coastal arcs',
        description:
          'Long beaches and rocky headlands around the island perimeter.',
      },
      {
        name: 'Highland core',
        description:
          'Pastoral mountains that keep Sardinia’s interior culturally distinct.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sardinia',
        url: 'https://www.britannica.com/place/Sardinia-island-Italy',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Su Nuraxi di Barumini',
        url: 'https://whc.unesco.org/en/list/833/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'capri',
    code: 'CPR',
    name: 'Capri',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Capri'],
    about:
      'Capri is a compact limestone island in the Bay of Naples, famed for Faraglioni stacks, the Blue Grotto, and cliffside terraces above intense Tyrrhenian blue. Limited flat land concentrates towns at Capri and Anacapri; boats define access. Orientation is marina to belvedere in short, steep walks. Capri’s primer is jewel-box island — scenery and villas packed onto a rock that has attracted visitors since Roman imperial retreats.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · limestone islet',
      role: 'Iconic cliff island of the Tyrrhenian coast',
      knownFor: 'Faraglioni, grottoes, and terrace towns',
    },
    features: [
      {
        name: 'Faraglioni',
        description:
          'Sea stacks rising offshore as Capri’s signature silhouette.',
      },
      {
        name: 'Blue Grotto',
        description:
          'A sea cave famous for refracted turquoise light.',
      },
      {
        name: 'Cliff terraces',
        description:
          'Gardens and viewpoints suspended above nearly vertical drops.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Capri',
        url: 'https://www.britannica.com/place/Capri-Italy',
        kind: 'reference',
      },
      {
        label: 'Italy tourism — Capri',
        url: 'https://www.italia.it/en/campania/capri',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'hokkaido',
    code: 'HKD',
    name: 'Hokkaido',
    kind: 'Island',
    countrySlug: 'japan',
    subtitle: 'Island · Japan',
    matchNames: ['Hokkaido'],
    about:
      'Hokkaido is Japan’s northern island, a cooler, more spacious landscape of volcanic calderas, dairy plains, and powder-snow winters distinct from Honshu’s density. Sapporo anchors the west; national parks protect lakes and peaks. Orientation is plain versus volcanic highland. Hokkaido’s primer is frontier-scale Japan — Ainu heritage, modern agricultural settlement, and subarctic-leaning seasons inside the Japanese archipelago.',
    facts: {
      kind: 'Island',
      country: 'Japan',
      region: 'Asia',
      setting: 'Northern Japan · volcanic and plain landscapes',
      role: 'Japan’s second-largest island and northern prefecture',
      knownFor: 'Volcanoes, open plains, and heavy winter snow',
    },
    features: [
      {
        name: 'Volcanic parks',
        description:
          'Calderas, lakes, and peaks protected across the island.',
      },
      {
        name: 'Agricultural plains',
        description:
          'Open farming landscapes uncommon in denser southern Japan.',
      },
      {
        name: 'Winter climate',
        description:
          'Cold, snowy seasons that define Hokkaido’s seasonal identity.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hokkaido',
        url: 'https://www.britannica.com/place/Hokkaido',
        kind: 'reference',
      },
      {
        label: 'Hokkaido Government',
        url: 'https://www.pref.hokkaido.lg.jp/ss/tsk/english/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'okinawa',
    code: 'OKI',
    name: 'Okinawa',
    kind: 'Island',
    countrySlug: 'japan',
    subtitle: 'Island · Japan',
    matchNames: ['Okinawa'],
    about:
      'Okinawa is the main island of Japan’s Ryukyu chain, a subtropical limestone and coral region with a distinct Ryukyuan cultural history beneath modern Japanese administration. Shuri’s castle heritage, turquoise reefs, and typhoon climate differ sharply from mainland seasons. Orientation is Naha and southern historic sites versus northern forested Yanbaru. Okinawa’s primer is subtropical Japan — island chains, reef coasts, and a cultural geography shaped by the Ryukyu Kingdom as much as by Tokyo.',
    facts: {
      kind: 'Island',
      country: 'Japan',
      region: 'Asia',
      setting: 'Ryukyu Islands · East China Sea',
      role: 'Principal Ryukyu island and prefectural seat',
      knownFor: 'Reefs, subtropical climate, and Ryukyuan heritage',
    },
    features: [
      {
        name: 'Reef coasts',
        description:
          'Coral shallows and clear water uncommon on Japan’s main islands.',
      },
      {
        name: 'Shuri heritage',
        description:
          'Castle and cultural sites recalling the Ryukyu Kingdom.',
      },
      {
        name: 'Yanbaru north',
        description:
          'Forested northern hills contrasting denser southern settlement.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Okinawa',
        url: 'https://www.britannica.com/place/Okinawa',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Gusuku Sites and Related Properties of the Kingdom of Ryukyu',
        url: 'https://whc.unesco.org/en/list/972/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'torres-del-paine',
    code: 'TDP',
    name: 'Torres del Paine',
    kind: 'Landmark',
    countrySlug: 'chile',
    subtitle: 'Landmark · Chile',
    matchNames: ['Torres del Paine'],
    about:
      'Torres del Paine is a national park massif in Chilean Patagonia where granite towers and caves of the Paine range rise above turquoise lakes and steppe. Glaciers feed milky rivers; wind is a constant climate fact. Orientation is the towers, Cuernos, and circuit valleys used by trekkers. Torres del Paine’s primer is Patagonian granite spectacle — iconic towers that concentrate the southern Andes’ drama into a single park skyline.',
    facts: {
      kind: 'Landmark',
      country: 'Chile',
      region: 'Americas',
      setting: 'Chilean Patagonia · Paine massif',
      role: 'Flagship national park of southern Chile',
      knownFor: 'Granite towers, lakes, and glacial valleys',
    },
    features: [
      {
        name: 'The Towers',
        description:
          'Three granite spires that give the park its name and emblem.',
      },
      {
        name: 'Cuernos del Paine',
        description:
          'Horned peaks of contrasting rock above lake shores.',
      },
      {
        name: 'Glacial lakes',
        description:
          'Turquoise waters colored by rock flour from nearby ice.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Torres del Paine',
        url: 'https://www.britannica.com/place/Torres-del-Paine-National-Park',
        kind: 'reference',
      },
      {
        label: 'CONAF — Torres del Paine',
        url: 'https://www.conaf.cl/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'iguazu',
    code: 'IGU',
    name: 'Iguazú Falls',
    kind: 'Landmark',
    countrySlug: 'argentina',
    subtitle: 'Landmark · Argentina',
    matchNames: ['Iguazú Falls', 'Iguazu'],
    about:
      'Iguazú Falls is a vast horseshoe of waterfalls on the Argentina–Brazil border where the Iguazú River plunges over a basalt step into subtropical forest. The Devil’s Throat is the most thunderous section; walkways thread spray and rainbow mist. Orientation is Argentine walkways versus Brazilian panoramas across the same cataract system. Iguazú’s primer is border waterfall at rainforest scale — not a single ribbon, but a wide broken cliff of falling water inside Atlantic Forest humidity.',
    facts: {
      kind: 'Landmark',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Iguazú River · Atlantic Forest',
      role: 'Shared border cataract and dual national parks',
      knownFor: 'Horseshoe falls, spray mist, and forest setting',
    },
    features: [
      {
        name: 'Devil’s Throat',
        description:
          'The U-shaped main plunge where the river’s power concentrates.',
      },
      {
        name: 'Walkway network',
        description:
          'Boardwalks bringing viewers into spray among multiple curtains.',
      },
      {
        name: 'Forest basin',
        description:
          'Subtropical canopy surrounding the cataract amphitheater.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Iguaçu Falls',
        url: 'https://www.britannica.com/place/Iguacu-Falls',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Iguazu National Park',
        url: 'https://whc.unesco.org/en/list/303/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'serengeti',
    code: 'SER',
    name: 'Serengeti',
    kind: 'Landmark',
    countrySlug: 'tanzania',
    subtitle: 'Landmark · Tanzania',
    matchNames: ['Serengeti'],
    about:
      'The Serengeti is a vast savanna ecosystem in northern Tanzania, contiguous with Kenya’s Maasai Mara, defined by seasonal grass plains, kopjes, and the wildebeest migration. Acacia woodlands and riverine strips structure wildlife movement across an open horizon. Orientation is plain, kopje, and river corridor rather than a single monument. The Serengeti’s primer is East African grassland dynamics — predation, grazing, and weather written across one of the world’s most studied wildlife landscapes.',
    facts: {
      kind: 'Landmark',
      country: 'Tanzania',
      region: 'Africa',
      setting: 'Northern Tanzania · Serengeti–Mara ecosystem',
      role: 'Iconic savanna national park and migration landscape',
      knownFor: 'Grass plains, kopjes, and migratory herds',
    },
    features: [
      {
        name: 'Grass plains',
        description:
          'Open short-grass expanses that green and brown with the rains.',
      },
      {
        name: 'Kopjes',
        description:
          'Granite outcrops providing dens, lookouts, and visual anchors.',
      },
      {
        name: 'Migration routes',
        description:
          'Seasonal pathways of wildebeest and zebra across the wider ecosystem.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Serengeti National Park',
        url: 'https://www.britannica.com/place/Serengeti-National-Park',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Serengeti National Park',
        url: 'https://whc.unesco.org/en/list/156/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mont-saint-michel',
    code: 'MSM',
    name: 'Mont Saint-Michel',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Mont Saint-Michel'],
    about:
      'Mont Saint-Michel is a tidal island abbey rising from Normandy’s bay, a pyramid of medieval stone that becomes an island at high tide and a mount approached by sands or causeway at low tide. The abbey crowns the rock; village streets spiral below. Orientation is bay, mount, and summit church. Mont Saint-Michel’s primer is tidal monument — architecture and hydrology fused so that the sea still rewrites the approach twice a day.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Normandy bay · tidal flats',
      role: 'Abbey mount and pilgrimage landmark',
      knownFor: 'Tidal island setting and abbey silhouette',
    },
    features: [
      {
        name: 'Abbey summit',
        description:
          'The church and monastic complex crowning the granite mount.',
      },
      {
        name: 'Tidal bay',
        description:
          'Vast flats that flood and empty, isolating or connecting the rock.',
      },
      {
        name: 'Spiral village',
        description:
          'Streets winding up the mount beneath the abbey walls.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mont-Saint-Michel',
        url: 'https://www.britannica.com/topic/Mont-Saint-Michel',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mont-Saint-Michel and its Bay',
        url: 'https://whc.unesco.org/en/list/80/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'yellowstone',
    code: 'YEL',
    name: 'Yellowstone',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Yellowstone'],
    about:
      'Yellowstone is a vast volcanic plateau mostly in Wyoming, the world’s first national park, defined by geysers, hot springs, canyons, and wide wildlife valleys. The Grand Prismatic Spring and Old Faithful emblemize hydrothermal spectacle; Yellowstone Lake fills a caldera landscape. Orientation is geyser basins, canyon, and northern range. Yellowstone’s primer is living volcanism as park — geothermal features and megafauna sharing a high plateau still restless beneath.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Yellowstone Plateau · Rocky Mountains',
      role: 'First national park; caldera hydrothermal landscape',
      knownFor: 'Geysers, hot springs, canyons, and wildlife valleys',
    },
    features: [
      {
        name: 'Geyser basins',
        description:
          'Fields of geysers and hot springs including Old Faithful’s basin.',
      },
      {
        name: 'Grand Prismatic',
        description:
          'A vast colorful hot spring whose microbial mats paint concentric rings.',
      },
      {
        name: 'Caldera plateau',
        description:
          'A high volcanic basin holding lake, forests, and wildlife ranges.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yellowstone National Park',
        url: 'https://www.britannica.com/place/Yellowstone-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Yellowstone',
        url: 'https://www.nps.gov/yell/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'everest',
    code: 'EVE',
    name: 'Everest Region',
    kind: 'Landmark',
    countrySlug: 'nepal',
    subtitle: 'Landmark · Nepal',
    matchNames: ['Everest Region'],
    about:
      'The Everest Region of Nepal is the Khumbu Himalaya approach to the world’s highest peak, a landscape of glaciers, Sherpa villages, and monastery ridges under extreme altitude. Namche, Tengboche, and Everest Base Camp mark classic trekking stages; Ama Dablam and neighboring giants share the skyline. Orientation is valley–glacier–summit pyramid rather than a single viewpoint. The region’s primer is high Himalayan cultural landscape — Buddhism, trade, and mountaineering sharing thin air below Sagarmatha / Chomolungma.',
    facts: {
      kind: 'Landmark',
      country: 'Nepal',
      region: 'Asia',
      setting: 'Khumbu Himalaya · Sagarmatha',
      role: 'Approach region to Earth’s highest mountain',
      knownFor: 'Glaciers, Sherpa villages, and extreme peaks',
    },
    features: [
      {
        name: 'Summit pyramid',
        description:
          'Everest’s massif dominating the skyline above the Khumbu Icefall.',
      },
      {
        name: 'Sherpa valleys',
        description:
          'Settlements and monasteries adapted to high-altitude trade and tourism.',
      },
      {
        name: 'Glacial approaches',
        description:
          'Icefall and moraine corridors that define classic trekking stages.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Everest',
        url: 'https://www.britannica.com/place/Mount-Everest',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Sagarmatha National Park',
        url: 'https://whc.unesco.org/en/list/120/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'uluru',
    code: 'ULU',
    name: 'Uluru',
    kind: 'Landmark',
    countrySlug: 'australia',
    subtitle: 'Landmark · Australia',
    matchNames: ['Uluru'],
    about:
      'Uluru is a massive sandstone monolith in Australia’s central desert, sacred to Anangu traditional owners and paired with the domed Kata Tjuta nearby. Red rock changes color with desert light; a base walk reveals waterholes and rock art sites. Orientation is the monolith, surrounding plain, and Kata Tjuta to the west. Uluru’s primer is desert sacred geology — a single rock that concentrates central Australian light, culture, and deep time in one unmistakable form.',
    facts: {
      kind: 'Landmark',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Central Australia · arid plains',
      role: 'Sacred monolith and national park centerpiece',
      knownFor: 'Sandstone mass, desert light, and cultural significance',
    },
    features: [
      {
        name: 'Monolith',
        description:
          'A single vast sandstone form rising abruptly from the plain.',
      },
      {
        name: 'Base country',
        description:
          'Waterholes, caves, and walking routes around the rock’s perimeter.',
      },
      {
        name: 'Desert light',
        description:
          'Color shifts at dawn and dusk that define Uluru’s visual fame.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Uluru/Ayers Rock',
        url: 'https://www.britannica.com/place/Uluru-Ayers-Rock',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Uluṟu-Kata Tjuṯa National Park',
        url: 'https://whc.unesco.org/en/list/447/',
        kind: 'authority',
      },
    ],
  },
]
