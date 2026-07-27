/** Fourth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch4: PlaceGuideDraftBatch[] = [
  {
    slug: 'lagos',
    code: 'LOS',
    name: 'Lagos',
    kind: 'City',
    countrySlug: 'nigeria',
    subtitle: 'City · Nigeria',
    matchNames: ['Lagos'],
    about:
      'Lagos crowds a set of Atlantic islands and mainland corridors into West Africa’s busiest coastal metropolis. Lagoons, bridges, and long sandy edges structure a city that grew from a trading port into a commercial and cultural engine. Victoria Island, Ikoyi, and the mainland districts each hold different densities and shorelines. Orientation follows lagoon channels, the Atlantic front, and the bridge network that stitches islands to the continent. Lagos’s primer is lagoon megacity — humid Atlantic commerce, creative energy, and sheer urban scale pressed against water.',
    facts: {
      kind: 'City',
      country: 'Nigeria',
      region: 'Africa',
      setting: 'Atlantic lagoon · island and mainland corridors',
      role: 'Principal commercial and cultural metropolis',
      knownFor: 'Lagoon bridges, coastal density, and creative scene',
    },
    features: [
      {
        name: 'Lagoon channels',
        description:
          'Waterways and bridges that define how islands meet the mainland.',
      },
      {
        name: 'Atlantic edge',
        description:
          'Long sandy fronts and harbors facing the Gulf of Guinea.',
      },
      {
        name: 'Commercial core',
        description:
          'Island and mainland districts that concentrate trade and media.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lagos',
        url: 'https://www.britannica.com/place/Lagos-Nigeria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'helsinki',
    code: 'HEL',
    name: 'Helsinki',
    kind: 'City',
    countrySlug: 'finland',
    subtitle: 'City · Finland',
    matchNames: ['Helsinki'],
    about:
      'Helsinki sits on a peninsula and archipelago shore of the Gulf of Finland, a northern capital of neoclassical squares, granite quays, and ferry links to nearby islands. Suomenlinna’s sea fortress and the white cathedral on Senate Square set the classic postcard; markets and harbors keep the waterfront working. Winter darkness and long summer light reshape the same streets. Orientation uses the peninsula tip, harbor basins, and island ring. Helsinki’s primer is Baltic archipelago capital — orderly stone streets opening onto a cold, bright sea.',
    facts: {
      kind: 'City',
      country: 'Finland',
      region: 'Europe',
      setting: 'Gulf of Finland · peninsula and islands',
      role: 'National capital and Baltic maritime hub',
      knownFor: 'Harbor quays, sea fortress, and neoclassical core',
    },
    features: [
      {
        name: 'Senate Square',
        description:
          'A neoclassical civic ensemble crowned by Helsinki Cathedral.',
      },
      {
        name: 'Suomenlinna',
        description:
          'A UNESCO sea fortress spread across linked harbor islands.',
      },
      {
        name: 'Market waterfront',
        description:
          'Working quays where ferries, stalls, and granite embankments meet.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Helsinki',
        url: 'https://www.britannica.com/place/Helsinki',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Fortress of Suomenlinna',
        url: 'https://whc.unesco.org/en/list/583/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'warsaw',
    code: 'WAW',
    name: 'Warsaw',
    kind: 'City',
    countrySlug: 'poland',
    subtitle: 'City · Poland',
    matchNames: ['Warsaw'],
    about:
      'Warsaw straddles the Vistula on the North European Plain, a rebuilt capital whose Old Town facade conceals a twentieth-century reconstruction story. Royal routes, socialist-era avenues, and contemporary towers sit within walking distance of river embankments. The historic core was meticulously restored after wartime destruction; museums and parks hold the longer Polish narrative. Orientation runs Old Town to the river and out along the royal axis. Warsaw’s primer is resilient plain capital — a city that wears reconstruction as identity beside a broad central European river.',
    facts: {
      kind: 'City',
      country: 'Poland',
      region: 'Europe',
      setting: 'Vistula River · North European Plain',
      role: 'National capital and political center',
      knownFor: 'Rebuilt Old Town, royal axis, and river front',
    },
    features: [
      {
        name: 'Old Town',
        description:
          'A reconstructed historic core recognized for postwar restoration.',
      },
      {
        name: 'Royal Route',
        description:
          'A ceremonial street linking castles, churches, and civic landmarks.',
      },
      {
        name: 'Vistula banks',
        description:
          'Wide river embankments that open the city to the plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Warsaw',
        url: 'https://www.britannica.com/place/Warsaw',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Warsaw',
        url: 'https://whc.unesco.org/en/list/30/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'budapest',
    code: 'BUD',
    name: 'Budapest',
    kind: 'City',
    countrySlug: 'hungary',
    subtitle: 'City · Hungary',
    matchNames: ['Budapest'],
    about:
      'Budapest joins hilly Buda and flatter Pest across the Danube, a twin-bank capital of thermal baths, grand boulevards, and a castle ridge above the river. Parliament’s Gothic Revival silhouette faces the Buda hills; bridges stitch markets, baths, and avenues into one metropolitan field. Hot springs feed a spa culture older than the modern union of the two towns. Orientation is ridge versus plain, with the Danube as the hinge. Budapest’s primer is Danube twin city — thermal water, imperial avenues, and a castle hill watching the river bend.',
    facts: {
      kind: 'City',
      country: 'Hungary',
      region: 'Europe',
      setting: 'Danube · Buda hills and Pest plain',
      role: 'National capital and Danube metropolis',
      knownFor: 'Castle hill, thermal baths, and river bridges',
    },
    features: [
      {
        name: 'Buda Castle ridge',
        description:
          'A hilltop historic quarter overlooking the Danube bend.',
      },
      {
        name: 'Pest boulevards',
        description:
          'Grand avenues and the Parliament district on the flatter bank.',
      },
      {
        name: 'Thermal baths',
        description:
          'Spring-fed spa complexes that define the city’s daily culture.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Budapest',
        url: 'https://www.britannica.com/place/Budapest',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Budapest, including the Banks of the Danube',
        url: 'https://whc.unesco.org/en/list/400/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'delhi',
    code: 'DEL',
    name: 'Delhi',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Delhi', 'New Delhi'],
    about:
      'Delhi occupies the Yamuna floodplain as a layered capital where Mughal forts, colonial axes, and dense old-city lanes share one metropolitan basin. The Red Fort and Jama Masjid anchor Shahjahanabad; New Delhi’s tree-lined avenues and India Gate mark the planned imperial core. Surrounding districts absorb the wider National Capital Region’s sprawl. Orientation moves from walled Old Delhi to the ceremonial Central Vista. Delhi’s primer is successive-capital plain — centuries of seat-of-power geometry stacked on the same northern Indian river terrace.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Yamuna plain · National Capital Region',
      role: 'National capital territory and historic power seat',
      knownFor: 'Red Fort, India Gate, and layered capital cores',
    },
    features: [
      {
        name: 'Shahjahanabad',
        description:
          'The Mughal old city of forts, mosques, and dense bazaar lanes.',
      },
      {
        name: 'Central Vista',
        description:
          'Planned avenues, India Gate, and the ceremonial New Delhi axis.',
      },
      {
        name: 'Yamuna terrace',
        description:
          'The river floodplain that hosts successive capital layers.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Delhi',
        url: 'https://www.britannica.com/place/Delhi',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Red Fort Complex',
        url: 'https://whc.unesco.org/en/list/231/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'osaka',
    code: 'OSA',
    name: 'Osaka',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Osaka'],
    about:
      'Osaka fills a bay-head plain as Kansai’s mercantile counterweight to Kyoto’s courtly image — canals, castle grounds, and neon entertainment streets on a deltaic coast. Osaka Castle’s moated keep recalls Tokugawa-era power; Dotonbori and the bayfront show the city’s appetite for food and nightlife. Port and river channels still structure neighborhoods. Orientation uses the castle, Yodo river mouths, and Osaka Bay edge. Osaka’s primer is bay merchant city — practical, loud, and water-threaded at the heart of western Honshu’s urban belt.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Osaka Bay · Kansai plain',
      role: 'Major commercial hub of the Kansai region',
      knownFor: 'Castle keep, canal streets, and bayfront energy',
    },
    features: [
      {
        name: 'Osaka Castle',
        description:
          'A moated landmark keep set in parkland above the city grid.',
      },
      {
        name: 'Dotonbori',
        description:
          'A canal entertainment strip famous for signs, food, and night light.',
      },
      {
        name: 'Bay plain',
        description:
          'Delta and port geography that made Osaka a trading powerhouse.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Osaka',
        url: 'https://www.britannica.com/place/Osaka-Japan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'auckland',
    code: 'AKL',
    name: 'Auckland',
    kind: 'City',
    countrySlug: 'new-zealand',
    subtitle: 'City · New Zealand',
    matchNames: ['Auckland'],
    about:
      'Auckland sprawls across an isthmus between two harbors, a volcanic-field city where cones, bridges, and yacht-filled basins define daily views. Rangitoto’s dark cone sits offshore; the Harbour Bridge links north shore suburbs to the central isthmus. Māori and Pacific communities shape neighborhoods as much as the skyline does. Orientation is Waitematā versus Manukau harbors with volcanic cones as landmarks. Auckland’s primer is twin-harbor isthmus — a maritime metropolis living on a narrow land bridge studded with dormant volcanoes.',
    facts: {
      kind: 'City',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Isthmus between Waitematā and Manukau harbours',
      role: 'Largest urban region and principal northern hub',
      knownFor: 'Harbour Bridge, volcanic cones, and twin harbors',
    },
    features: [
      {
        name: 'Harbour Bridge',
        description:
          'The span linking the central isthmus to the North Shore.',
      },
      {
        name: 'Volcanic cones',
        description:
          'Dormant maunga that punctuate parks and suburban skylines.',
      },
      {
        name: 'Twin harbours',
        description:
          'Waitematā and Manukau waters framing the narrow land bridge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Auckland',
        url: 'https://www.britannica.com/place/Auckland-New-Zealand',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vancouver',
    code: 'YVR',
    name: 'Vancouver',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Vancouver'],
    about:
      'Vancouver presses a glass skyline against Pacific inlets and the North Shore mountains, a rainforest-coast city of seawalls, bridges, and Stanley Park’s evergreen peninsula. Burrard Inlet and English Bay organize ferry and port traffic; ski hills sit within sight of downtown towers on clear days. Mild, wet winters keep the green palette year-round. Orientation uses the park peninsula, inlet crossings, and mountain backdrop. Vancouver’s primer is mountain-inlet metropolis — temperate rainforest urbanism with a working harbor at the foot of steep coastal ranges.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Pacific inlets · North Shore mountains',
      role: 'Major Pacific port and western Canadian metropolis',
      knownFor: 'Stanley Park, mountain backdrop, and harbor skyline',
    },
    features: [
      {
        name: 'Stanley Park',
        description:
          'A forested peninsula seawall wrapping the downtown tip.',
      },
      {
        name: 'Burrard Inlet',
        description:
          'The working harbor and bridge corridor north of the core.',
      },
      {
        name: 'North Shore wall',
        description:
          'Steep coastal mountains that backdrop the glass skyline.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Vancouver',
        url: 'https://www.britannica.com/place/Vancouver',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'edinburgh',
    code: 'EDI',
    name: 'Edinburgh',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Edinburgh'],
    about:
      'Edinburgh climbs a glacial ridge and neighboring New Town terraces, Scotland’s capital of castle rock, volcanic parkland, and festival streets. The Royal Mile drops from the castle to Holyrood; Arthur’s Seat rises as a green massif inside the city. Georgian planning and medieval closes sit blocks apart. Orientation is Old Town ridge versus New Town grid with the castle as the hinge. Edinburgh’s primer is ridge capital — stone skyline, volcanic parks, and a compact historic core that still reads as a fortified hill town.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Castle rock · Firth of Forth approaches',
      role: 'Scottish capital and cultural center',
      knownFor: 'Castle ridge, Royal Mile, and Arthur’s Seat',
    },
    features: [
      {
        name: 'Castle rock',
        description:
          'The volcanic plug and fortress that crown the Old Town.',
      },
      {
        name: 'Royal Mile',
        description:
          'The historic spine from castle esplanade to Holyrood.',
      },
      {
        name: 'Arthur’s Seat',
        description:
          'A city-center hill mass offering Firth and skyline views.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Edinburgh',
        url: 'https://www.britannica.com/place/Edinburgh',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old and New Towns of Edinburgh',
        url: 'https://whc.unesco.org/en/list/728/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'dublin',
    code: 'DUB',
    name: 'Dublin',
    kind: 'City',
    countrySlug: 'ireland',
    subtitle: 'City · Ireland',
    matchNames: ['Dublin'],
    about:
      'Dublin spreads around the Liffey’s tidal mouth on Ireland’s east coast, a capital of Georgian squares, literary pubs, and a port that opens to the Irish Sea. Trinity College’s enclosed campus and the Ha’penny Bridge mark the walkable core; suburbs climb toward Howth and the Wicklow foothills. Brick terraces and river quays still set the street grain. Orientation follows the Liffey east to the bay. Dublin’s primer is Liffey-mouth capital — compact historic streets where literature, government, and a working estuary share one coastal basin.',
    facts: {
      kind: 'City',
      country: 'Ireland',
      region: 'Europe',
      setting: 'River Liffey · Irish Sea bay',
      role: 'National capital and principal east-coast city',
      knownFor: 'Georgian core, Liffey bridges, and literary landmarks',
    },
    features: [
      {
        name: 'Liffey quays',
        description:
          'River embankments and bridges that organize the central city.',
      },
      {
        name: 'Trinity College',
        description:
          'A walled campus and library at the heart of the old core.',
      },
      {
        name: 'Georgian squares',
        description:
          'Brick terraces and garden squares that define Dublin’s street face.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dublin',
        url: 'https://www.britannica.com/place/Dublin',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'reykjavik',
    code: 'REK',
    name: 'Reykjavík',
    kind: 'City',
    countrySlug: 'iceland',
    subtitle: 'City · Iceland',
    matchNames: ['Reykjavík', 'Reykjavik'],
    about:
      'Reykjavík occupies a southwestern peninsula as Iceland’s small capital facing Faxaflói bay, with colorful roofs, geothermal heating, and Hallgrímskirkja’s tower above the harbor. Beyond the compact downtown, lava fields and empty horizons begin almost at the city edge. Long summer light and winter aurora weather shape outdoor life. Orientation is harbor versus inland lava and the church spire as skyline marker. Reykjavík’s primer is subarctic harbor capital — a walkable civic core at the doorstep of volcanic and oceanic wilderness.',
    facts: {
      kind: 'City',
      country: 'Iceland',
      region: 'Europe',
      setting: 'Faxaflói bay · southwestern peninsula',
      role: 'National capital and main population center',
      knownFor: 'Harbor front, Hallgrímskirkja, and geothermal city life',
    },
    features: [
      {
        name: 'Old harbor',
        description:
          'Working wharves and waterfront streets facing the open bay.',
      },
      {
        name: 'Hallgrímskirkja',
        description:
          'A landmark tower and hilltop church organizing the skyline.',
      },
      {
        name: 'Geothermal fabric',
        description:
          'Heated pavements, pools, and utilities powered by volcanic heat.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Reykjavík',
        url: 'https://www.britannica.com/place/Reykjavik',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hanoi',
    code: 'HAN',
    name: 'Hanoi',
    kind: 'City',
    countrySlug: 'vietnam',
    subtitle: 'City · Vietnam',
    matchNames: ['Hanoi'],
    about:
      'Hanoi clusters around Hoàn Kiếm Lake and the Red River, a northern Vietnamese capital of narrow Old Quarter streets, French colonial villas, and tree-lined lakes. Motorbikes fill the historic thirty-six streets; temples and colonial boulevards sit a short walk apart. Seasonal humidity and lake mist soften the city’s edges. Orientation uses the lake, Old Quarter maze, and river embankments. Hanoi’s primer is lake-and-river capital — intimate historic fabric where imperial, colonial, and modern layers share shaded water-centered neighborhoods.',
    facts: {
      kind: 'City',
      country: 'Vietnam',
      region: 'Asia',
      setting: 'Red River · Hoàn Kiếm Lake',
      role: 'National capital and northern cultural center',
      knownFor: 'Old Quarter, lake core, and colonial villas',
    },
    features: [
      {
        name: 'Hoàn Kiếm Lake',
        description:
          'The central lake and temple islet that orient downtown Hanoi.',
      },
      {
        name: 'Old Quarter',
        description:
          'A dense grid of trade streets with continuous shop-house fronts.',
      },
      {
        name: 'Red River bank',
        description:
          'Embankments and bridges linking the historic city to wider Hanoi.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hanoi',
        url: 'https://www.britannica.com/place/Hanoi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'java',
    code: 'JAV',
    name: 'Java',
    kind: 'Island',
    countrySlug: 'indonesia',
    subtitle: 'Island · Indonesia',
    matchNames: ['Java'],
    about:
      'Java is Indonesia’s densely settled volcanic spine, an island of rice terraces, active cones, and successive court cultures from Borobudur’s plain to coastal ports. Mount Bromo and other volcanoes punctuate the interior; Yogyakarta and Solo preserve classical Javanese arts. The north coast long linked trade between the Indian Ocean and Java Sea. Orientation is volcanic spine versus coastal plains. Java’s primer is crowded volcanic heartland — wet-rice agriculture, temple plains, and megacity corridors on one of the world’s most tectonically restless islands.',
    facts: {
      kind: 'Island',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Volcanic arc · Java Sea and Indian Ocean coasts',
      role: 'Demographic and political heartland of Indonesia',
      knownFor: 'Volcanoes, temple plains, and dense settlement',
    },
    features: [
      {
        name: 'Volcanic spine',
        description:
          'Active cones and calderas that structure inland travel and risk.',
      },
      {
        name: 'Temple plains',
        description:
          'Borobudur, Prambanan, and other monuments on fertile lowlands.',
      },
      {
        name: 'Rice landscapes',
        description:
          'Irrigated terraces and fields that feed the island’s dense population.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Java',
        url: 'https://www.britannica.com/place/Java-island-Indonesia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Borobudur Temple Compounds',
        url: 'https://whc.unesco.org/en/list/592/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'borneo',
    code: 'BNO',
    name: 'Borneo',
    kind: 'Island',
    countrySlug: 'malaysia',
    subtitle: 'Island · Malaysia',
    matchNames: ['Borneo'],
    about:
      'Borneo is the great equatorial island shared by Malaysia, Indonesia, and Brunei — rainforest rivers, limestone caves, and Mount Kinabalu rising above Sabah. Malaysian Borneo’s states of Sabah and Sarawak hold parks, longhouse cultures, and South China Sea coasts. Primary forest and plantation mosaics define much of the interior. Orientation uses Kinabalu, major river systems, and the northern Malaysian states as the guide’s frame. Borneo’s primer is equatorial mega-island — biodiversity, highland granite, and riverine societies under a shared rainforest canopy.',
    facts: {
      kind: 'Island',
      country: 'Malaysia',
      region: 'Asia',
      setting: 'Equatorial rainforest · Sabah and Sarawak',
      role: 'Shared mega-island with major Malaysian states',
      knownFor: 'Kinabalu, rainforest rivers, and cave systems',
    },
    features: [
      {
        name: 'Mount Kinabalu',
        description:
          'A granite massif and park landmark dominating northern Sabah.',
      },
      {
        name: 'Rainforest rivers',
        description:
          'Long inland waterways that structure travel and settlement.',
      },
      {
        name: 'Limestone caves',
        description:
          'Vast cave systems such as those protected around Gunung Mulu.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Borneo',
        url: 'https://www.britannica.com/place/Borneo-island-Pacific-Ocean',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Kinabalu Park',
        url: 'https://whc.unesco.org/en/list/1012/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'phuket',
    code: 'HKT',
    name: 'Phuket',
    kind: 'Island',
    countrySlug: 'thailand',
    subtitle: 'Island · Thailand',
    matchNames: ['Phuket'],
    about:
      'Phuket is Thailand’s largest island in the Andaman Sea, a hilly landmass of west-coast beaches, Sino-Portuguese old town streets, and limestone islet views toward Phang Nga. Patong and neighboring bays concentrate resort life; quieter coves and interior hills remain nearby. Monsoon seasons shape when seas are calm. Orientation is west beaches versus east bay and the bridge link to the mainland. Phuket’s primer is Andaman island hub — tropical beaches and a historic trading town on a single large Thai island.',
    facts: {
      kind: 'Island',
      country: 'Thailand',
      region: 'Asia',
      setting: 'Andaman Sea · southern Thailand',
      role: 'Principal Thai island tourism and regional hub',
      knownFor: 'West-coast beaches, old town, and Andaman views',
    },
    features: [
      {
        name: 'West-coast bays',
        description:
          'Beach corridors facing the Andaman open water.',
      },
      {
        name: 'Old Phuket Town',
        description:
          'Sino-Portuguese shophouses from the tin-trading era.',
      },
      {
        name: 'Interior hills',
        description:
          'Forested ridges that separate bays and host viewpoints.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Phuket',
        url: 'https://www.britannica.com/place/Phuket-island-Thailand',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bora-bora',
    code: 'BOB',
    name: 'Bora Bora',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Bora Bora'],
    about:
      'Bora Bora is a Society Islands lagoon classic in French Polynesia: a basalt remnant peak ringed by a turquoise barrier reef and motu islets. Mount Otemanu’s silhouette rises above overwater bungalow fringes and a protective lagoon. The main island’s road circles the volcanic core; boat channels pierce the reef. Orientation is central peak, lagoon ring, and outer motu. Bora Bora’s primer is reef-encircled volcanic isle — the postcard South Pacific geometry of peak, lagoon, and coral rim under French Polynesian administration.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Oceania',
      setting: 'Society Islands · barrier lagoon',
      role: 'Iconic French Polynesian lagoon island',
      knownFor: 'Mount Otemanu, turquoise lagoon, and motu ring',
    },
    features: [
      {
        name: 'Mount Otemanu',
        description:
          'The jagged basalt remnant that defines the island’s profile.',
      },
      {
        name: 'Barrier lagoon',
        description:
          'Shallow turquoise water held inside a protective reef.',
      },
      {
        name: 'Motu fringe',
        description:
          'Low coral islets forming the outer ring of the lagoon.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bora-Bora',
        url: 'https://www.britannica.com/place/Bora-Bora',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'luzon',
    code: 'LUZ',
    name: 'Luzon',
    kind: 'Island',
    countrySlug: 'philippines',
    subtitle: 'Island · Philippines',
    matchNames: ['Luzon'],
    about:
      'Luzon is the Philippines’ largest island, a varied landmass from Cordillera rice terraces and Mayon’s perfect cone to Manila’s bay metropolis and northern beaches. Mountain provinces hold Indigenous highland landscapes; the central and southern plains feed cities and volcano belts. Typhoon tracks and monsoon rains shape agriculture and risk. Orientation contrasts highland north, capital region, and Bicol’s volcanic south. Luzon’s primer is Philippine main island — terraces, volcanoes, and the national capital sharing one extensive, climate-exposed landmass.',
    facts: {
      kind: 'Island',
      country: 'Philippines',
      region: 'Asia',
      setting: 'Northern Philippines · Cordillera to Bicol',
      role: 'Largest island and seat of the national capital',
      knownFor: 'Rice terraces, Mayon, and Manila bay region',
    },
    features: [
      {
        name: 'Cordillera terraces',
        description:
          'Highland rice landscapes including the Banaue terraces.',
      },
      {
        name: 'Mayon Volcano',
        description:
          'A symmetric stratovolcano anchoring the Bicol skyline.',
      },
      {
        name: 'Capital region',
        description:
          'Manila Bay metropolis on Luzon’s southwestern coastal plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Luzon',
        url: 'https://www.britannica.com/place/Luzon',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Rice Terraces of the Philippine Cordilleras',
        url: 'https://whc.unesco.org/en/list/722/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sumatra',
    code: 'SMU',
    name: 'Sumatra',
    kind: 'Island',
    countrySlug: 'indonesia',
    subtitle: 'Island · Indonesia',
    matchNames: ['Sumatra'],
    about:
      'Sumatra stretches as Indonesia’s great western island along the Indian Ocean, a land of Barisan volcanoes, equatorial forest, and Lake Toba’s vast caldera. Kerinci and other peaks mark the spine; eastern lowlands open toward the Strait of Malacca. Wildlife and plantation frontiers meet across the same island. Orientation is mountain spine versus eastern plains and Toba as the inland sea. Sumatra’s primer is western Indonesian mega-island — caldera lakes, rainforest, and a volcanic chain facing open ocean swells.',
    facts: {
      kind: 'Island',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'Barisan Range · Indian Ocean west coast',
      role: 'Major western Indonesian island',
      knownFor: 'Lake Toba, Kerinci, and equatorial forests',
    },
    features: [
      {
        name: 'Lake Toba',
        description:
          'A vast volcanic caldera lake with Samosir Island at its center.',
      },
      {
        name: 'Barisan spine',
        description:
          'A volcanic mountain chain running the length of the island.',
      },
      {
        name: 'Equatorial forest',
        description:
          'Lowland and highland habitats that still hold Sumatran wildlife.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sumatra',
        url: 'https://www.britannica.com/place/Sumatra',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tropical Rainforest Heritage of Sumatra',
        url: 'https://whc.unesco.org/en/list/1167/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'fiordland',
    code: 'FLD',
    name: 'Fiordland',
    kind: 'Region',
    countrySlug: 'new-zealand',
    subtitle: 'Region · New Zealand',
    matchNames: ['Fiordland'],
    about:
      'Fiordland occupies the southwestern corner of New Zealand’s South Island, a wilderness of drowned glacial valleys, sheer granite walls, and rainforest that meets the Tasman Sea. Milford and Doubtful Sounds are the famous water corridors; tracks and boat routes are how most people enter. Rainfall is extreme; sandflies and mist are part of the sensory field. Orientation is sound heads versus alpine passes inland. Fiordland’s primer is temperate fiord wilderness — deep wet valleys cut into hard rock at the edge of the Southern Alps.',
    facts: {
      kind: 'Region',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'South Island southwest · glacial fiords',
      role: 'National park wilderness and fiord landscape',
      knownFor: 'Milford and Doubtful Sounds, granite walls, heavy rain',
    },
    features: [
      {
        name: 'Glacial sounds',
        description:
          'Deep drowned valleys such as Milford and Doubtful Sound.',
      },
      {
        name: 'Granite walls',
        description:
          'Sheer rock faces rising from dark water and rainforest.',
      },
      {
        name: 'Alpine approaches',
        description:
          'Passes and tracks that enter the park from inland valleys.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fiordland',
        url: 'https://www.britannica.com/place/Fiordland-National-Park',
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
    slug: 'namib',
    code: 'NMB',
    name: 'Namib',
    kind: 'Region',
    countrySlug: 'namibia',
    subtitle: 'Region · Namibia',
    matchNames: ['Namib', 'Namib Desert'],
    about:
      'The Namib is a coastal desert along southwestern Africa where fog, orange dunes, and Atlantic cold currents create one of Earth’s oldest arid systems. Sossusvlei and Deadvlei concentrate the visual drama of clay pans among towering dunes; the Skeleton Coast names the harsh northern shore. Life adapts to fog moisture rather than rainfall. Orientation runs dune sea versus foggy coast. The Namib’s primer is fog desert — ancient sands meeting a cold ocean in a landscape of extreme dryness and striking color.',
    facts: {
      kind: 'Region',
      country: 'Namibia',
      region: 'Africa',
      setting: 'Atlantic coastal desert · dune seas',
      role: 'Iconic Namibian desert and park landscape',
      knownFor: 'Sossusvlei dunes, Deadvlei, and fog coast',
    },
    features: [
      {
        name: 'Sossusvlei dunes',
        description:
          'Towering red sand ridges around seasonal clay pans.',
      },
      {
        name: 'Deadvlei',
        description:
          'A white clay pan with stark dead camel thorn trees.',
      },
      {
        name: 'Fog coast',
        description:
          'Atlantic fog that supplies moisture to desert-adapted life.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Namib',
        url: 'https://www.britannica.com/place/Namib',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Namib Sand Sea',
        url: 'https://whc.unesco.org/en/list/1430/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sahara',
    code: 'SAH',
    name: 'Sahara',
    kind: 'Region',
    countrySlug: 'algeria',
    subtitle: 'Region · Algeria',
    matchNames: ['Sahara', 'Sahara Desert'],
    about:
      'The Sahara is the vast hot desert spanning North Africa; this primer frames it from Algeria’s dune fields, oasis towns, and Tassili n’Ajjer’s rock plateaus. Erg seas of sand alternate with regs of stone and mountain massifs that hold prehistoric rock art. Trans-Saharan routes once linked Mediterranean ports to Sahel markets. Orientation here uses Algerian oases and Tassili as the concrete doorway into a much larger desert. The Sahara’s primer is continental arid expanse — dunes, stone, and oasis chains under extreme heat and clear desert light.',
    facts: {
      kind: 'Region',
      country: 'Algeria',
      region: 'Africa',
      setting: 'North African hot desert · Algerian Sahara',
      role: 'Continental desert framed via Algerian landscapes',
      knownFor: 'Erg dunes, oasis towns, and Tassili plateaus',
    },
    features: [
      {
        name: 'Erg dune seas',
        description:
          'Vast sand fields that define classic Saharan imagery.',
      },
      {
        name: 'Oasis chains',
        description:
          'Watered towns and date groves that punctuate desert routes.',
      },
      {
        name: 'Tassili plateaus',
        description:
          'Rock landscapes holding ancient Saharan rock art and shelters.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sahara',
        url: 'https://www.britannica.com/place/Sahara-desert-Africa',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tassili n’Ajjer',
        url: 'https://whc.unesco.org/en/list/179/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lapland',
    code: 'LAP',
    name: 'Lapland',
    kind: 'Region',
    countrySlug: 'finland',
    subtitle: 'Region · Finland',
    matchNames: ['Lapland'],
    about:
      'Finnish Lapland covers the country’s far north — taiga, fells, and a subarctic sky that can show aurora in winter and midnight sun in summer. Rovaniemi sits near the Arctic Circle as a gateway; Sámi culture and reindeer herding shape inland life beyond tourist trails. Frozen rivers and snow-covered forests define the cold season. Orientation uses the Arctic Circle belt, fell country, and river valleys. Lapland’s primer is northern fell wilderness — light extremes, sparse settlement, and a cultural landscape shared with the wider Sápmi region.',
    facts: {
      kind: 'Region',
      country: 'Finland',
      region: 'Europe',
      setting: 'Subarctic north · taiga and fells',
      role: 'Northern Finnish wilderness and cultural region',
      knownFor: 'Aurora skies, fells, and Arctic Circle gateway towns',
    },
    features: [
      {
        name: 'Fell country',
        description:
          'Rounded treeless hills rising above boreal forest.',
      },
      {
        name: 'Light extremes',
        description:
          'Polar night, aurora displays, and long summer daylight.',
      },
      {
        name: 'River valleys',
        description:
          'Frozen and flowing waterways that structure northern travel.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lapland',
        url: 'https://www.britannica.com/place/Lapland-region-Finland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'banff',
    code: 'BNF',
    name: 'Banff',
    kind: 'Landmark',
    countrySlug: 'canada',
    subtitle: 'Landmark · Canada',
    matchNames: ['Banff', 'Banff National Park'],
    about:
      'Banff National Park protects a stretch of the Canadian Rockies where turquoise lakes sit under sharp limestone peaks. Lake Louise and Moraine Lake concentrate the classic glacial-lake views; the Bow Valley carries the highway and rail corridor through the range. Wildlife and avalanche terrain remain active management realities. Orientation is valley floor versus alpine lake basins. Banff’s primer is Rockies national park — accessible glacial lakes and mountain walls that made western Canada’s alpine scenery internationally famous.',
    facts: {
      kind: 'Landmark',
      country: 'Canada',
      region: 'Americas',
      setting: 'Canadian Rockies · Bow Valley',
      role: 'Flagship Rocky Mountain national park',
      knownFor: 'Lake Louise, Moraine Lake, and limestone peaks',
    },
    features: [
      {
        name: 'Lake Louise',
        description:
          'A glacial lake basin beneath the Victoria Glacier wall.',
      },
      {
        name: 'Moraine Lake',
        description:
          'A valley-of-the-ten-peaks lake famous for intense blue water.',
      },
      {
        name: 'Bow Valley',
        description:
          'The mountain corridor that carries roads through the park.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Banff National Park',
        url: 'https://www.britannica.com/place/Banff-National-Park',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Canadian Rocky Mountain Parks',
        url: 'https://whc.unesco.org/en/list/304/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'niagara-falls',
    code: 'NIA',
    name: 'Niagara Falls',
    kind: 'Landmark',
    countrySlug: 'canada',
    subtitle: 'Landmark · Canada',
    matchNames: ['Niagara Falls'],
    about:
      'Niagara Falls is the great cataract where the Niagara River plunges between Lake Erie and Lake Ontario on the Canada–United States border. Horseshoe Falls on the Canadian side carries most of the river’s volume in a wide crescent; mist, viewpoint decks, and the gorge below define the visit. Hydroelectric works share the river with tourism. Orientation is Canadian Horseshoe versus American Falls and the gorge downstream. Niagara’s primer is border waterfall — a short, powerful drop that concentrates Great Lakes drainage into one of North America’s loudest landmarks.',
    facts: {
      kind: 'Landmark',
      country: 'Canada',
      region: 'Americas',
      setting: 'Niagara River · Canada–U.S. border',
      role: 'Major waterfall and binational scenic landmark',
      knownFor: 'Horseshoe Falls, mist, and the Niagara Gorge',
    },
    features: [
      {
        name: 'Horseshoe Falls',
        description:
          'The wide Canadian crescent carrying most of the river’s flow.',
      },
      {
        name: 'Niagara Gorge',
        description:
          'The downstream canyon cut by the retreating falls.',
      },
      {
        name: 'Viewpoint rim',
        description:
          'Deck and park edges where mist and the full curtain come into view.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Niagara Falls',
        url: 'https://www.britannica.com/place/Niagara-Falls-waterfall-North-America',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'plitvice',
    code: 'PLV',
    name: 'Plitvice Lakes',
    kind: 'Landmark',
    countrySlug: 'croatia',
    subtitle: 'Landmark · Croatia',
    matchNames: ['Plitvice Lakes', 'Plitvice'],
    about:
      'Plitvice Lakes National Park chains turquoise lakes and travertine waterfalls through forested karst in inland Croatia. Boardwalks cross shallow pools where calcium carbonate builds natural dams; water color shifts with minerals and light. Upper and lower lake groups sit in a wooded canyon system. Orientation follows the cascade staircase from upper lakes down to the canyon floor. Plitvice’s primer is travertine lake cascade — a living limestone water garden of linked pools and falls inside a dense European forest.',
    facts: {
      kind: 'Landmark',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Dinaric karst · forested lake cascade',
      role: 'UNESCO lake-and-waterfall national park',
      knownFor: 'Turquoise lakes, travertine dams, and boardwalks',
    },
    features: [
      {
        name: 'Travertine dams',
        description:
          'Living limestone barriers that create the stepped lake chain.',
      },
      {
        name: 'Upper and lower lakes',
        description:
          'Two linked lake groups connected by falls and boardwalks.',
      },
      {
        name: 'Karst forest',
        description:
          'Wooded canyon slopes that enclose the water staircase.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Plitvice Lakes',
        url: 'https://www.britannica.com/place/Plitvice-Lakes',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Plitvice Lakes National Park',
        url: 'https://whc.unesco.org/en/list/98/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'matterhorn',
    code: 'MAT',
    name: 'Matterhorn',
    kind: 'Landmark',
    countrySlug: 'switzerland',
    subtitle: 'Landmark · Switzerland',
    matchNames: ['Matterhorn'],
    about:
      'The Matterhorn is the sharp pyramidal peak rising above Zermatt on the Swiss–Italian border, an Alpine icon of near-symmetric ridges and steep faces. Glacial cirques and high trails frame the mountain from the Swiss side; the Hörnli ridge is the classic climbing line. The peak’s silhouette made it a global emblem of the Alps. Orientation is Zermatt valley floor versus the four-faced pyramid above. The Matterhorn’s primer is Alpine pyramid — a single unmistakable summit that concentrates high-mountain drama over a compact Swiss valley town.',
    facts: {
      kind: 'Landmark',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Pennine Alps · Zermatt',
      role: 'Iconic Alpine peak and climbing landmark',
      knownFor: 'Pyramidal silhouette, Zermatt views, and steep ridges',
    },
    features: [
      {
        name: 'Pyramid summit',
        description:
          'Near-symmetric faces that create the mountain’s famous outline.',
      },
      {
        name: 'Zermatt approaches',
        description:
          'Valley viewpoints and trails that frame the peak from Switzerland.',
      },
      {
        name: 'Glacial cirques',
        description:
          'High ice basins that sharpen the mountain’s base and ridges.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Matterhorn',
        url: 'https://www.britannica.com/place/Matterhorn',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'neuschwanstein',
    code: 'NEU',
    name: 'Neuschwanstein',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Neuschwanstein', 'Neuschwanstein Castle'],
    about:
      'Neuschwanstein Castle rises above the village of Hohenschwangau in Bavaria, a nineteenth-century romantic palace built for Ludwig II against Alpine foothill scenery. Towers, courtyards, and Wagner-inspired interiors sit on a ridge overlooking lakes and forest. The castle’s silhouette later influenced popular fairy-tale architecture worldwide. Orientation is ridge castle versus the lakes and plain below. Neuschwanstein’s primer is Alpine romantic palace — a theatrical hilltop residence that turned royal fantasy into one of Germany’s most recognized landmarks.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Bavarian Alps foothills · Hohenschwangau',
      role: 'Romantic historic palace and major visitor landmark',
      knownFor: 'Towered silhouette, ridge setting, and Alpine backdrop',
    },
    features: [
      {
        name: 'Ridge silhouette',
        description:
          'Towers and walls staged against forested Alpine foothills.',
      },
      {
        name: 'Lake outlooks',
        description:
          'Views toward Alpsee and the surrounding Bavarian landscape.',
      },
      {
        name: 'Romantic interiors',
        description:
          'Nineteenth-century rooms designed as theatrical royal fantasy.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Neuschwanstein Castle',
        url: 'https://www.britannica.com/topic/Neuschwanstein-Castle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'alhambra',
    code: 'ALH',
    name: 'Alhambra',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Alhambra'],
    about:
      'The Alhambra crowns a hill above Granada as a Nasrid palace-fortress of courts, fountains, and intricate stucco overlooking the Sierra Nevada. The Court of the Lions and Generalife gardens concentrate Islamic Andalusian design; later Christian additions sit within the same red-walled complex. Water channels and shaded patios cool the summer hill. Orientation is fortress walls, palace courts, and the Generalife gardens. The Alhambra’s primer is Andalusian palace city — refined courtyards and fortress fabric that preserve a late Islamic royal world in southern Spain.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Granada hill · Sierra Nevada outlook',
      role: 'Nasrid palace-fortress and UNESCO monument',
      knownFor: 'Courtyards, stucco, and Generalife gardens',
    },
    features: [
      {
        name: 'Palace courts',
        description:
          'Fountain courtyards and carved interiors of the Nasrid palaces.',
      },
      {
        name: 'Red fortress walls',
        description:
          'The hilltop enceinte that gives the complex its name and profile.',
      },
      {
        name: 'Generalife',
        description:
          'Garden terraces and water channels beside the main palace.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alhambra',
        url: 'https://www.britannica.com/topic/Alhambra-fortress-Granada-Spain',
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
    slug: 'victoria-falls',
    code: 'VIC',
    name: 'Victoria Falls',
    kind: 'Landmark',
    countrySlug: 'zambia',
    subtitle: 'Landmark · Zambia',
    matchNames: ['Victoria Falls', 'Mosi-oa-Tunya'],
    about:
      'Victoria Falls is the broad Zambezi cataract known in Lozi as Mosi-oa-Tunya — “the smoke that thunders” — on the Zambia–Zimbabwe border. Water sheets over a wide basalt lip into a narrow gorge; spray columns rise high enough to feed rainforest on the lip in flood season. Viewpoints on both banks frame different sections of the curtain. Orientation uses the Zambian park approaches and the gorge line. Victoria Falls’s primer is Zambezi smoke curtain — a wide waterfall whose mist and roar define the southern African river border.',
    facts: {
      kind: 'Landmark',
      country: 'Zambia',
      region: 'Africa',
      setting: 'Zambezi River · Zambia–Zimbabwe border',
      role: 'Major waterfall and binational natural landmark',
      knownFor: 'Wide curtain, spray plume, and gorge below',
    },
    features: [
      {
        name: 'Basalt lip',
        description:
          'The broad cliff edge where the Zambezi sheets into the gorge.',
      },
      {
        name: 'Spray plume',
        description:
          'Mist columns that earn the Lozi name “smoke that thunders.”',
      },
      {
        name: 'Gorge corridor',
        description:
          'The narrow canyon system that continues downstream of the falls.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Victoria Falls',
        url: 'https://www.britannica.com/place/Victoria-Falls-waterfall-Africa',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mosi-oa-Tunya / Victoria Falls',
        url: 'https://whc.unesco.org/en/list/509/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'kilimanjaro',
    code: 'KIL',
    name: 'Kilimanjaro',
    kind: 'Landmark',
    countrySlug: 'tanzania',
    subtitle: 'Landmark · Tanzania',
    matchNames: ['Kilimanjaro', 'Mount Kilimanjaro'],
    about:
      'Kilimanjaro is Africa’s highest free-standing massif, a volcanic trio in northern Tanzania whose Uhuru Peak sits above ice remnants and ecological belts from farmland to alpine desert. Climbing routes ascend through rainforest, moorland, and scree toward the crater rim. The mountain rises abruptly from surrounding plains, visible for great distances on clear days. Orientation is base villages versus summit crater and glacial remnants. Kilimanjaro’s primer is equatorial high volcano — a sky island of stacked climates culminating in a snow-touched African summit.',
    facts: {
      kind: 'Landmark',
      country: 'Tanzania',
      region: 'Africa',
      setting: 'Northern Tanzania · free-standing volcano',
      role: 'Highest African summit and major trek landmark',
      knownFor: 'Uhuru Peak, ecological belts, and crater rim',
    },
    features: [
      {
        name: 'Summit crater',
        description:
          'The high volcanic rim including Uhuru Peak on Kibo.',
      },
      {
        name: 'Ecological belts',
        description:
          'Stacked zones from rainforest through moorland to alpine desert.',
      },
      {
        name: 'Plain rise',
        description:
          'An abrupt massif profile that stands clear of nearby ranges.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kilimanjaro',
        url: 'https://www.britannica.com/place/Kilimanjaro',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Kilimanjaro National Park',
        url: 'https://whc.unesco.org/en/list/403/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'yosemite',
    code: 'YOS',
    name: 'Yosemite',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Yosemite', 'Yosemite Valley', 'Yosemite National Park'],
    about:
      'Yosemite National Park centers on a glacially carved granite valley in California’s Sierra Nevada, where Half Dome, El Capitan, and waterfall curtains define the classic American park image. Meadows and the Merced River floor the valley; high country granite extends the park far above the famous corridor. Climbing, hiking, and seasonal waterfall flow structure visits. Orientation is valley walls versus high Sierra plateaus. Yosemite’s primer is granite valley park — monumental cliffs and hanging waterfalls that helped invent the modern national-park idea.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Sierra Nevada · Yosemite Valley',
      role: 'Iconic U.S. national park landscape',
      knownFor: 'Half Dome, El Capitan, and valley waterfalls',
    },
    features: [
      {
        name: 'Yosemite Valley',
        description:
          'A glacial corridor of meadows, river, and sheer granite walls.',
      },
      {
        name: 'Half Dome',
        description:
          'The iconic truncated granite summit above the valley.',
      },
      {
        name: 'Valley waterfalls',
        description:
          'Seasonal curtains such as Yosemite Falls plunging from hanging valleys.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yosemite National Park',
        url: 'https://www.britannica.com/place/Yosemite-National-Park',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Yosemite National Park',
        url: 'https://whc.unesco.org/en/list/308/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'great-barrier-reef',
    code: 'GBR',
    name: 'Great Barrier Reef',
    kind: 'Landmark',
    countrySlug: 'australia',
    subtitle: 'Landmark · Australia',
    matchNames: ['Great Barrier Reef'],
    about:
      'The Great Barrier Reef stretches along Queensland’s coast as the world’s largest coral reef system — cays, lagoon, and outer reef facing the Coral Sea. Aerial views show turquoise shallows and ribbon reefs; underwater life concentrates on coral gardens and drop-offs. The reef is a living structure sensitive to water temperature and water quality. Orientation is inner lagoon versus outer reef wall along the long coastal arc. The Great Barrier Reef’s primer is continental-scale coral province — shallow tropical seas that make Australia’s northeast coast a global marine landmark.',
    facts: {
      kind: 'Landmark',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Coral Sea · Queensland coast',
      role: 'World’s largest coral reef system',
      knownFor: 'Ribbon reefs, cays, and turquoise lagoon waters',
    },
    features: [
      {
        name: 'Ribbon reefs',
        description:
          'Long outer coral walls facing the open Coral Sea.',
      },
      {
        name: 'Inner lagoon',
        description:
          'Shallow turquoise waters and cays between coast and outer reef.',
      },
      {
        name: 'Coral gardens',
        description:
          'Living reef habitats that concentrate fish and invertebrate life.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Great Barrier Reef',
        url: 'https://www.britannica.com/place/Great-Barrier-Reef',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Great Barrier Reef',
        url: 'https://whc.unesco.org/en/list/154/',
        kind: 'authority',
      },
    ],
  },
]
