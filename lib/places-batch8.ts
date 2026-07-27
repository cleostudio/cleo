/** Eighth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch8: PlaceGuideDraftBatch[] = [
  {
    slug: 'minneapolis',
    code: 'MSP',
    name: 'Minneapolis',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Minneapolis'],
    about:
      'Minneapolis rises on the Mississippi’s upper falls reach as Minnesota’s largest city, a Twin Cities partner to Saint Paul across the river. Chain of Lakes parkways and skyway tunnels structure winter life; mills and warehouses mark the historic riverfront. Prairie winters and lake summers define the year. Orientation is Mississippi gorge versus lake chain and downtown towers. Minneapolis’s primer is upper-Midwest river city — lakes, parkways, and a skyline living with long cold seasons.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi River · Twin Cities',
      role: 'Principal Twin Cities metropolis',
      knownFor: 'Skyline lakes, Mississippi riverfront, and parkways',
    },
    features: [
      {
        name: 'Mississippi riverfront',
        description:
          'Falls, bridges, and redeveloped mill districts.',
      },
      {
        name: 'Chain of Lakes',
        description:
          'Linked urban lakes with parkway loops.',
      },
      {
        name: 'Downtown core',
        description:
          'Towers and skyways of the Twin Cities west bank.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Minneapolis',
        url: 'https://www.britannica.com/place/Minneapolis-Minnesota',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'detroit',
    code: 'DTW',
    name: 'Detroit',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Detroit'],
    about:
      'Detroit faces Canada across the Detroit River as a Great Lakes industrial capital whose downtown towers and riverfront parks overlook Windsor. Auto plants shaped the twentieth-century metropolis; neighborhoods and museums narrate Motown and labor history. Broad avenues radiate from the core. Orientation is riverfront versus inland radial grid. Detroit’s primer is river industrial city — a Great Lakes gateway still defined by making, music, and a hard-won civic rebuild.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Detroit River · Great Lakes plain',
      role: 'Major Great Lakes industrial and cultural city',
      knownFor: 'Riverfront skyline, auto heritage, and Motown legacy',
    },
    features: [
      {
        name: 'Detroit River',
        description:
          'International waterfront facing Windsor, Ontario.',
      },
      {
        name: 'Downtown towers',
        description:
          'A compact skyline on the river bend.',
      },
      {
        name: 'Radial avenues',
        description:
          'Broad streets fanning from the historic core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Detroit',
        url: 'https://www.britannica.com/place/Detroit',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'phoenix',
    code: 'PHX',
    name: 'Phoenix',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Phoenix'],
    about:
      'Phoenix sprawls across a Sonoran Desert basin as Arizona’s capital, a sunbaked metropolis of canal corridors, mountain parks, and low-rise suburbia under intense light. Camelback and other desert peaks punctuate the valley; monsoon storms briefly break the dry heat. Orientation is valley floor versus encircling mountain parks. Phoenix’s primer is desert valley capital — irrigated urbanism spread wide under southwestern sun.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Sonoran Desert · Salt River valley',
      role: 'Arizona capital and desert metropolis',
      knownFor: 'Desert basin sprawl, mountain parks, and canal grid',
    },
    features: [
      {
        name: 'Desert basin',
        description:
          'A broad valley floor of canals and suburbs.',
      },
      {
        name: 'Mountain parks',
        description:
          'Islands of desert peaks inside the metro area.',
      },
      {
        name: 'Canal corridors',
        description:
          'Irrigation routes that structure older neighborhoods.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Phoenix',
        url: 'https://www.britannica.com/place/Phoenix-Arizona',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'las-vegas',
    code: 'LAS',
    name: 'Las Vegas',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Las Vegas'],
    about:
      'Las Vegas occupies a Mojave Desert valley in southern Nevada, a purpose-built entertainment metropolis famous for the Strip’s hotel-casino corridor. Red Rock and other desert ranges wall the basin; neon and LED towers invent a night skyline. Extreme heat shapes daily schedules. Orientation is Strip versus downtown and valley rim. Las Vegas’s primer is desert spectacle city — an engineered oasis of resorts staged against arid mountain walls.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Mojave Desert · Las Vegas Valley',
      role: 'Major desert entertainment metropolis',
      knownFor: 'The Strip, desert valley setting, and neon skyline',
    },
    features: [
      {
        name: 'The Strip',
        description:
          'A dense hotel-casino corridor of spectacle architecture.',
      },
      {
        name: 'Desert valley',
        description:
          'Basin floor walled by Mojave mountain ranges.',
      },
      {
        name: 'Night skyline',
        description:
          'Neon and LED towers that redefine the city after dark.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Las Vegas',
        url: 'https://www.britannica.com/place/Las-Vegas-Nevada',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'medellin',
    code: 'MDE',
    name: 'Medellín',
    kind: 'City',
    countrySlug: 'colombia',
    subtitle: 'City · Colombia',
    matchNames: ['Medellin', 'Medellín'],
    about:
      'Medellín fills the Aburrá Valley in Colombia’s Andes, a city of cable cars climbing steep barrios, a mild “city of eternal spring” climate, and a revitalized river corridor. Mountains enclose the metro on all sides; metro and gondolas stitch high neighborhoods to the valley floor. Orientation is river axis versus surrounding slopes. Medellín’s primer is Andean valley city — vertical neighborhoods and transit innovation inside a green mountain bowl.',
    facts: {
      kind: 'City',
      country: 'Colombia',
      region: 'Americas',
      setting: 'Aburrá Valley · Andean Colombia',
      role: 'Major Andean Colombian metropolis',
      knownFor: 'Valley cable cars, spring climate, and hillside barrios',
    },
    features: [
      {
        name: 'Aburrá Valley',
        description:
          'A mountain-enclosed urban basin.',
      },
      {
        name: 'Cable car lines',
        description:
          'Gondolas linking hillside districts to the metro.',
      },
      {
        name: 'River corridor',
        description:
          'A revitalized central axis through the valley floor.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Medellín',
        url: 'https://www.britannica.com/place/Medellin',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'quito',
    code: 'UIO',
    name: 'Quito',
    kind: 'City',
    countrySlug: 'ecuador',
    subtitle: 'City · Ecuador',
    matchNames: ['Quito'],
    about:
      'Quito occupies a high Andean valley near the equator, Ecuador’s capital of white-walled colonial churches, steep streets, and volcano silhouettes on clear days. The historic center is a UNESCO treasure of plazas and monasteries; newer districts stretch north along the valley. Altitude cools equatorial days. Orientation is old town versus elongated valley corridor. Quito’s primer is highland equatorial capital — colonial stone under thin mountain air and volcanic horizons.',
    facts: {
      kind: 'City',
      country: 'Ecuador',
      region: 'Americas',
      setting: 'Andean high valley · equatorial Ecuador',
      role: 'National capital and highland historic city',
      knownFor: 'UNESCO old town, volcano horizons, and high altitude',
    },
    features: [
      {
        name: 'Historic centre',
        description:
          'Plazas, churches, and monasteries of colonial Quito.',
      },
      {
        name: 'Valley corridor',
        description:
          'An elongated highland basin of modern districts.',
      },
      {
        name: 'Volcano horizons',
        description:
          'Andean peaks framing the capital on clear days.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Quito',
        url: 'https://www.britannica.com/place/Quito',
        kind: 'reference',
      },
      {
        label: 'UNESCO — City of Quito',
        url: 'https://whc.unesco.org/en/list/2/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'salvador',
    code: 'SSA',
    name: 'Salvador',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Salvador'],
    about:
      'Salvador crowns a bluff above All Saints Bay as Bahia’s capital, a city of Pelourinho’s colorful colonial streets, elevator links between upper and lower towns, and deep Afro-Brazilian cultural roots. Beaches curve along the Atlantic; the bay holds islands and ferry routes. Orientation is Cidade Alta versus Cidade Baixa and the bay. Salvador’s primer is Bahian cliff capital — colonial color and Atlantic rhythm on Brazil’s northeastern shore.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Bahia coast · All Saints Bay',
      role: 'Historic Bahian capital and Atlantic port',
      knownFor: 'Pelourinho, bay cliffs, and Afro-Brazilian culture',
    },
    features: [
      {
        name: 'Pelourinho',
        description:
          'The colorful historic upper-town core.',
      },
      {
        name: 'Bay bluffs',
        description:
          'Cliffs and elevators linking upper and lower cities.',
      },
      {
        name: 'Atlantic beaches',
        description:
          'Sandy shores facing open ocean east of the bay.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Salvador',
        url: 'https://www.britannica.com/place/Salvador-Brazil',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Salvador de Bahia',
        url: 'https://whc.unesco.org/en/list/309/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'tunis',
    code: 'TUN',
    name: 'Tunis',
    kind: 'City',
    countrySlug: 'tunisia',
    subtitle: 'City · Tunisia',
    matchNames: ['Tunis'],
    about:
      'Tunis sits on a Mediterranean lagoon and gulf as Tunisia’s capital, a city of medina souks, the Zitouna Mosque, and French colonial avenues around Avenue Habib Bourguiba. Carthage’s ruins lie nearby on the coastal suburbs; the lac and gulf structure approaches. Orientation is medina versus ville nouvelle and gulf edge. Tunis’s primer is Maghreb Mediterranean capital — layered Arab, Ottoman, and colonial fabric on a North African shore.',
    facts: {
      kind: 'City',
      country: 'Tunisia',
      region: 'Africa',
      setting: 'Gulf of Tunis · Mediterranean Tunisia',
      role: 'National capital and Mediterranean hub',
      knownFor: 'Medina souks, colonial avenues, and gulf setting',
    },
    features: [
      {
        name: 'Medina',
        description:
          'Souks and the Zitouna Mosque in the historic core.',
      },
      {
        name: 'Ville nouvelle',
        description:
          'Colonial avenues and cafés of the modern center.',
      },
      {
        name: 'Gulf edge',
        description:
          'Lagoon and coastal suburbs toward Carthage.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tunis',
        url: 'https://www.britannica.com/place/Tunis',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Medina of Tunis',
        url: 'https://whc.unesco.org/en/list/36/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'dakar',
    code: 'DKR',
    name: 'Dakar',
    kind: 'City',
    countrySlug: 'senegal',
    subtitle: 'City · Senegal',
    matchNames: ['Dakar'],
    about:
      'Dakar occupies the Cap-Vert Peninsula tip as Senegal’s capital, a windy Atlantic city of markets, corniche cliffs, and ferry links to Gorée Island. It is West Africa’s westernmost major metropolis; surf and trade winds shape the shore. Orientation is peninsula tip versus mainland approaches. Dakar’s primer is Cap-Vert capital — an Atlantic gateway city pressed onto a rocky peninsula at Africa’s western bend.',
    facts: {
      kind: 'City',
      country: 'Senegal',
      region: 'Africa',
      setting: 'Cap-Vert Peninsula · Atlantic Senegal',
      role: 'National capital and West African Atlantic hub',
      knownFor: 'Peninsula tip, Atlantic coast, and Gorée approaches',
    },
    features: [
      {
        name: 'Cap-Vert tip',
        description:
          'The peninsula end holding the densest urban core.',
      },
      {
        name: 'Corniche coast',
        description:
          'Cliff and beach roads facing the open Atlantic.',
      },
      {
        name: 'Gorée approaches',
        description:
          'Ferry links to the historic island offshore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dakar',
        url: 'https://www.britannica.com/place/Dakar',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'bangalore',
    code: 'BLR',
    name: 'Bengaluru',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Bangalore', 'Bengaluru'],
    about:
      'Bengaluru (Bangalore) sits on the Deccan Plateau as Karnataka’s capital, a South Indian metropolis of parks, lakes, and expansive tech campuses. Milder highland temperatures earned its garden-city reputation; traffic and IT corridors now define much of daily movement. Orientation is Cubbon Park core versus outer tech belts. Bengaluru’s primer is plateau garden city — green lungs and technology sprawl on elevated southern Indian ground.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Deccan Plateau · southern India',
      role: 'Major South Indian tech and garden metropolis',
      knownFor: 'Garden parks, tech campuses, and plateau climate',
    },
    features: [
      {
        name: 'Garden core',
        description:
          'Parks and lakes that shaped the city’s early fame.',
      },
      {
        name: 'Tech corridors',
        description:
          'Campus belts driving contemporary growth.',
      },
      {
        name: 'Plateau setting',
        description:
          'Elevated Deccan ground with milder highland air.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bangalore',
        url: 'https://www.britannica.com/place/Bangalore',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'chennai',
    code: 'MAA',
    name: 'Chennai',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Chennai', 'Madras'],
    about:
      'Chennai faces the Bay of Bengal as Tamil Nadu’s capital, a Coromandel Coast metropolis of Marina Beach’s long sand, colonial Fort St. George, and vibrant Tamil cultural life. Hot humid seasons and cyclone weather mark the climate. Orientation is beachfront versus inland neighborhoods and IT corridors south. Chennai’s primer is Coromandel capital — temple city energy on India’s southeastern shore.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Coromandel Coast · Bay of Bengal',
      role: 'Major South Indian coastal metropolis',
      knownFor: 'Marina Beach, temple culture, and Bay of Bengal shore',
    },
    features: [
      {
        name: 'Marina Beach',
        description:
          'A vast urban sand stretch along the Bay of Bengal.',
      },
      {
        name: 'Historic fort core',
        description:
          'Colonial and early modern civic landmarks.',
      },
      {
        name: 'Coastal plain',
        description:
          'Low humid districts spreading inland from the shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Chennai',
        url: 'https://www.britannica.com/place/Chennai',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'hong-kong',
    code: 'HKG',
    name: 'Hong Kong',
    kind: 'City',
    countrySlug: 'china',
    subtitle: 'City · China',
    matchNames: ['Hong Kong'],
    about:
      'Hong Kong packs towers between Victoria Harbour and steep green peaks, a South China coastal metropolis of ferries, ridgeline parks, and dense vertical living. Hong Kong Island faces Kowloon across the harbor; outlying islands and the New Territories extend the territory. Typhoons and humid heat shape the seasons. Orientation is harbor versus Peak and Kowloon shore. Hong Kong’s primer is vertical harbor city — one of the world’s densest skylines staged against mountain and sea.',
    facts: {
      kind: 'City',
      country: 'China',
      region: 'Asia',
      setting: 'Victoria Harbour · South China coast',
      role: 'Global harbor metropolis and special administrative region',
      knownFor: 'Victoria Harbour skyline, steep peaks, and ferry life',
    },
    features: [
      {
        name: 'Victoria Harbour',
        description:
          'The ferry-crossed water that defines the skyline view.',
      },
      {
        name: 'Peak ridges',
        description:
          'Steep green hills rising immediately behind the towers.',
      },
      {
        name: 'Kowloon shore',
        description:
          'The dense mainland-facing waterfront opposite the Island.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hong Kong',
        url: 'https://www.britannica.com/place/Hong-Kong',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'minnesota',
    code: 'MN',
    name: 'Minnesota',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Minnesota'],
    about:
      'Minnesota is an Upper Midwestern state of ten thousand lakes lore, boreal forest edges, and prairie west. The Boundary Waters and Lake Superior’s north shore concentrate wilderness; the Twin Cities anchor the urban south. Harsh winters and lake-effect seasons shape life. Orientation is forest north versus prairie west and metro south. Minnesota’s primer is lake country state — water, woods, and cold-season culture across the northern plains edge.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Upper Midwest · lakes and prairie forest',
      role: 'Upper Midwestern lake state',
      knownFor: 'Lakes, Boundary Waters, and Twin Cities region',
    },
    features: [
      {
        name: 'Lake country',
        description:
          'Glacial lakes defining recreation and settlement.',
      },
      {
        name: 'North woods',
        description:
          'Boreal forest and Boundary Waters wilderness.',
      },
      {
        name: 'Twin Cities south',
        description:
          'The principal urban corridor on the Mississippi.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Minnesota',
        url: 'https://www.britannica.com/place/Minnesota-state',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'ontario',
    code: 'ON',
    name: 'Ontario',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['Ontario'],
    about:
      'Ontario is Canada’s most populous province, stretching from Great Lakes farm belts and Toronto’s megacity to Canadian Shield lakes and Hudson Bay lowlands. Niagara’s cataract marks the U.S. border east; boreal forest dominates the north. Orientation is southern lakeshore corridor versus Shield wilderness. Ontario’s primer is Great Lakes province — urban south and vast northern lake-forest country under one provincial name.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Great Lakes · Canadian Shield to Niagara',
      role: 'Canada’s most populous province',
      knownFor: 'Great Lakes shores, Toronto region, and Shield forests',
    },
    features: [
      {
        name: 'Great Lakes south',
        description:
          'Farm and city belts along Erie, Ontario, and Huron.',
      },
      {
        name: 'Canadian Shield',
        description:
          'Lake-dotted forest covering much of the north.',
      },
      {
        name: 'Niagara edge',
        description:
          'The border cataract and peninsula approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ontario',
        url: 'https://www.britannica.com/place/Ontario-province',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'western-australia',
    code: 'WAU',
    name: 'Western Australia',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['Western Australia'],
    about:
      'Western Australia covers the continent’s western third, from Perth’s Indian Ocean metro to Kimberley reefs and an immense arid interior. Isolation and mineral wealth shape the economy; wildflower seasons color the southwest. Orientation is southwest corner versus northern tropics and desert heart. Western Australia’s primer is vast western state — a thin populated coast against one of Earth’s large empty interiors.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Western third of Australia · Indian Ocean coast',
      role: 'Largest Australian state by area',
      knownFor: 'Perth coast, Kimberley, and vast arid interior',
    },
    features: [
      {
        name: 'Perth coast',
        description:
          'The principal metro on the Indian Ocean southwest.',
      },
      {
        name: 'Kimberley north',
        description:
          'Rugged tropical ranges and reef approaches.',
      },
      {
        name: 'Arid interior',
        description:
          'Vast desert and rangeland filling the state’s core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Western Australia',
        url: 'https://www.britannica.com/place/Western-Australia',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'paros',
    code: 'PAS',
    name: 'Paros',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Paros'],
    about:
      'Paros is a central Cycladic island of whitewashed Chora lanes, Naoussa’s fishing harbor, and long sandy beaches. Famous marble quarries once supplied classical sculpture; windmills and blue-domed churches complete the Aegean image. Ferries link nearby Antiparos and other isles. Orientation is Parikia and Naoussa versus inland marble hills. Paros’s primer is classic Cycladic isle — white cubes, harbors, and beaches under intense Aegean light.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · central Aegean',
      role: 'Major Cycladic island of marble and beaches',
      knownFor: 'Naoussa harbor, white Chora, and Aegean beaches',
    },
    features: [
      {
        name: 'Naoussa harbor',
        description:
          'A fishing-village bay popular for waterfront walks.',
      },
      {
        name: 'Parikia Chora',
        description:
          'Whitewashed lanes around the main port town.',
      },
      {
        name: 'Beach bays',
        description:
          'Sandy coasts that ring much of the island.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Páros',
        url: 'https://www.britannica.com/place/Paros',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'ios',
    code: 'IOS',
    name: 'Ios',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Ios'],
    about:
      'Ios is a compact southern Cycladic island known for a steep white Chora of windmills and a famous beach-and-nightlife scene around Mylopotas. Homer’s legendary tomb tradition draws some visitors inland; most stay between port, Chora, and sand. Orientation is harbor versus hilltop Chora and south beaches. Ios’s primer is small Cycladic party-and-beach isle — a white hill town above clear Aegean bays.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · southern Aegean',
      role: 'Compact Cycladic island of Chora and beaches',
      knownFor: 'Hilltop Chora, Mylopotas Beach, and Aegean nightlife',
    },
    features: [
      {
        name: 'Hilltop Chora',
        description:
          'Windmills and white lanes above the port.',
      },
      {
        name: 'Mylopotas',
        description:
          'A principal beach bay below the Chora.',
      },
      {
        name: 'Port approaches',
        description:
          'Ferry landings linking Ios to the Cycladic web.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ios',
        url: 'https://www.britannica.com/place/Ios',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'moorea',
    code: 'MOO',
    name: 'Moorea',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Moorea'],
    about:
      'Moorea faces Tahiti across a short strait as a Society Islands classic of jagged volcanic peaks, Cook’s and Opunohu Bays, and a turquoise barrier lagoon. Pineapple fields fill some valleys; overwater bungalows fringe reef motus. Orientation is twin bays versus mountain skyline. Moorea’s primer is Polynesian jagged isle — sharp peaks mirrored in lagoon water just offshore from Tahiti.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Oceania',
      setting: 'Society Islands · lagoon opposite Tahiti',
      role: 'Iconic French Polynesian lagoon island',
      knownFor: 'Cook\'s Bay, jagged peaks, and turquoise lagoon',
    },
    features: [
      {
        name: 'Cook\'s Bay',
        description:
          'A deep volcanic bay framed by sharp peaks.',
      },
      {
        name: 'Barrier lagoon',
        description:
          'Turquoise shallows inside the outer reef.',
      },
      {
        name: 'Mountain skyline',
        description:
          'Jagged volcanic ridges defining the island profile.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Moorea',
        url: 'https://www.britannica.com/place/Moorea',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'jersey',
    code: 'JER',
    name: 'Jersey',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Jersey'],
    about:
      'Jersey is the largest Channel Island, a British Crown dependency of tidal bays, granite cliffs, and St Helier’s harbor facing France across a short stretch of sea. Norman and English heritage mix in law and place names; tides expose vast sands. Orientation is south coast harbors versus northern cliffs. Jersey’s primer is Channel Island — tidal shores and cliff walks between England and Normandy.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Channel Islands · English Channel',
      role: 'Largest Channel Island dependency',
      knownFor: 'Tidal bays, cliffs, and St Helier harbor',
    },
    features: [
      {
        name: 'Tidal bays',
        description:
          'Wide sands revealed by Channel Island tides.',
      },
      {
        name: 'Northern cliffs',
        description:
          'Granite coasts facing open Channel water.',
      },
      {
        name: 'St Helier',
        description:
          'The principal harbor town and civic center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Jersey',
        url: 'https://www.britannica.com/place/Jersey-island-Channel-Islands-English-Channel',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'gozo',
    code: 'GOZ',
    name: 'Gozo',
    kind: 'Island',
    countrySlug: 'malta',
    subtitle: 'Island · Malta',
    matchNames: ['Gozo'],
    about:
      'Gozo is Malta’s quieter sister island, a limestone plateau of the Victoria Citadel, village churches, and diving coasts where the Azure Window once stood. Ferries from Malta deliver a more rural Mediterranean pace. Orientation is Citadel hill versus coastal cliffs and bays. Gozo’s primer is Maltese sister isle — honey stone villages and sea cliffs a short ferry from the main island.',
    facts: {
      kind: 'Island',
      country: 'Malta',
      region: 'Europe',
      setting: 'Maltese archipelago · Mediterranean',
      role: 'Second Maltese island',
      knownFor: 'Citadel, Azure Window site coasts, and rural plateaus',
    },
    features: [
      {
        name: 'Victoria Citadel',
        description:
          'A fortified hilltop core above the main town.',
      },
      {
        name: 'Coastal cliffs',
        description:
          'Limestone walls and dive sites around the shore.',
      },
      {
        name: 'Rural plateaus',
        description:
          'Village fields quieter than Malta’s main island.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gozo',
        url: 'https://www.britannica.com/place/Gozo',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'hvar',
    code: 'HVA',
    name: 'Hvar',
    kind: 'Island',
    countrySlug: 'croatia',
    subtitle: 'Island · Croatia',
    matchNames: ['Hvar'],
    about:
      'Hvar is a long Dalmatian island of lavender and olive slopes, a Venetian-era Hvar Town harbor, and clear Adriatic waters. The Pakleni Islands scatter offshore; fortress walls climb above the main town. Orientation is Hvar Town versus Stari Grad plain and southern bays. Hvar’s primer is Dalmatian lavender isle — stone harbors and scented hills under intense Adriatic sun.',
    facts: {
      kind: 'Island',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Dalmatian Islands · Adriatic',
      role: 'Major Dalmatian visitor island',
      knownFor: 'Hvar Town harbor, lavender slopes, and Adriatic light',
    },
    features: [
      {
        name: 'Hvar Town',
        description:
          'A Venetian harbor and fortress above the waterfront.',
      },
      {
        name: 'Lavender slopes',
        description:
          'Scented fields coloring the island interior.',
      },
      {
        name: 'Pakleni approaches',
        description:
          'Offshore islets facing the main town.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hvar',
        url: 'https://www.britannica.com/place/Hvar-island-Croatia',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'scottish-highlands',
    code: 'HGL',
    name: 'Scottish Highlands',
    kind: 'Region',
    countrySlug: 'united-kingdom',
    subtitle: 'Region · United Kingdom',
    matchNames: ['Scottish Highlands', 'Highlands'],
    about:
      'The Scottish Highlands cover northern Scotland’s mountain and glen country, a region of lochs, Munros, and sparse settlement north and west of the Highland Boundary Fault. Glencoe and other passes concentrate drama; Gaelic heritage and crofting landscapes persist. Orientation is west coast fjord-like lochs versus central massifs. The Highlands’ primer is Scottish mountain country — granite, loch, and weather that defined a national landscape imagination.',
    facts: {
      kind: 'Region',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Northern Scotland · mountains and glens',
      role: 'Mountainous northern Scottish region',
      knownFor: 'Glens, lochs, and Highland peaks',
    },
    features: [
      {
        name: 'Glens and passes',
        description:
          'U-shaped valleys cutting through Highland massifs.',
      },
      {
        name: 'Lochs',
        description:
          'Freshwater and sea lochs filling glacial troughs.',
      },
      {
        name: 'Munro peaks',
        description:
          'High summits that structure Highland walking.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Highlands',
        url: 'https://www.britannica.com/place/Highlands-region-Scotland',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'danube-delta',
    code: 'DND',
    name: 'Danube Delta',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Danube Delta'],
    about:
      'The Danube Delta spreads where Europe’s great river meets the Black Sea in Romania, a UNESCO wetland of channels, reed islands, and fishing villages. Boats are the main transport; birdlife concentrates on migration routes. Orientation is river arms versus lagoon edges. The Danube Delta’s primer is European wetland mouth — a living maze of water and reed at the continent’s southeastern river end.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Black Sea mouth · Romanian wetlands',
      role: 'Major European river-delta wetland',
      knownFor: 'Channels, reed beds, and migratory birds',
    },
    features: [
      {
        name: 'Channel maze',
        description:
          'Branching waterways through reed and willow.',
      },
      {
        name: 'Reed islands',
        description:
          'Floating and rooted vegetation defining habitats.',
      },
      {
        name: 'Black Sea edge',
        description:
          'Lagoons and mouths where river meets sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Danube River',
        url: 'https://www.britannica.com/place/Danube-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Danube Delta',
        url: 'https://whc.unesco.org/en/list/588/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'kimberley',
    code: 'KMB',
    name: 'Kimberley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Kimberley'],
    about:
      'The Kimberley is a remote northwestern Australian region of sandstone ranges, monsoon-carved gorges, and Indian Ocean reefs. The Bungle Bungle (Purnululu) beehive domes concentrate visual fame; wet-season floods reshape rivers. Orientation is inland ranges versus Buccaneer Archipelago coasts. The Kimberley’s primer is tropical Australian wilderness — ancient rock, extreme seasons, and sparse roads across a vast northern corner.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Northern Western Australia · tropical ranges',
      role: 'Remote northwestern Australian wilderness region',
      knownFor: 'Bungle Bungle ranges, gorges, and reef approaches',
    },
    features: [
      {
        name: 'Bungle Bungle domes',
        description:
          'Striped sandstone beehives of Purnululu.',
      },
      {
        name: 'Gorge country',
        description:
          'Monsoon-cut canyons through plateau rock.',
      },
      {
        name: 'Northern coasts',
        description:
          'Reef and archipelago edges on the Indian Ocean.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kimberley',
        url: 'https://www.britannica.com/place/Kimberley-region-Australia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Purnululu National Park',
        url: 'https://whc.unesco.org/en/list/1094/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'champagne',
    code: 'CHP',
    name: 'Champagne',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Champagne'],
    about:
      'Champagne is the northeastern French wine region of chalk hills, underground cellars, and towns such as Reims and Épernay. Pinot and Chardonnay slopes produce the namesake sparkling wine under strict appellation rules. Orientation is vineyard côtes versus cathedral cities. Champagne’s primer is chalk vineyard country — a cool-climate French landscape where geology and method made a global wine name.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Northeastern France · chalk vineyard hills',
      role: 'Historic French sparkling-wine region',
      knownFor: 'Vineyard slopes, chalk cellars, and Reims–Épernay',
    },
    features: [
      {
        name: 'Vineyard côtes',
        description:
          'Chalk slopes planted to classic Champagne grapes.',
      },
      {
        name: 'Cellar towns',
        description:
          'Reims and Épernay hubs of houses and caves.',
      },
      {
        name: 'Appellation landscape',
        description:
          'A regulated cultural vineyard territory.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Champagne',
        url: 'https://www.britannica.com/place/Champagne-region-France',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Champagne Hillsides, Houses and Cellars',
        url: 'https://whc.unesco.org/en/list/1465/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'alentejo',
    code: 'ALE',
    name: 'Alentejo',
    kind: 'Region',
    countrySlug: 'portugal',
    subtitle: 'Region · Portugal',
    matchNames: ['Alentejo'],
    about:
      'Alentejo covers much of southern Portugal inland from Lisbon, a region of cork oak plains, whitewashed towns, and Évora’s Roman-medieval core. Hot summers and wide horizons define the countryside; megaliths and castles mark deeper time. Orientation is plains versus coastal Alentejo Litoral. Alentejo’s primer is Portuguese cork country — slow plains, marble towns, and a strong regional food culture under big skies.',
    facts: {
      kind: 'Region',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Southern Portugal · plains and cork oak',
      role: 'Large Portuguese agricultural and heritage region',
      knownFor: 'Cork plains, whitewashed towns, and Évora',
    },
    features: [
      {
        name: 'Cork oak plains',
        description:
          'Montado landscapes of oak and pasture.',
      },
      {
        name: 'Whitewashed towns',
        description:
          'Marble and limewashed settlements across the plains.',
      },
      {
        name: 'Évora core',
        description:
          'A UNESCO historic city anchoring the region.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alentejo',
        url: 'https://www.britannica.com/place/Alentejo',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Évora',
        url: 'https://whc.unesco.org/en/list/361/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'eiffel-tower',
    code: 'EIF',
    name: 'Eiffel Tower',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Eiffel Tower', 'Tour Eiffel'],
    about:
      'The Eiffel Tower rises over the Champ de Mars in Paris as a wrought-iron lattice built for the 1889 Exposition and kept as the city’s global silhouette. Elevators and stairs climb toward observation decks; the Seine and Trocadéro frame classic views. Night lighting turns the tower into a beacon. Orientation is tower base versus Champ de Mars axis and river. The Eiffel Tower’s primer is Paris iron landmark — an engineering exhibition piece that became the capital’s unmistakable vertical signature.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Champ de Mars · Paris',
      role: 'Iconic Paris iron tower landmark',
      knownFor: 'Iron lattice form, Champ de Mars setting, and skyline role',
    },
    features: [
      {
        name: 'Iron lattice',
        description:
          'Open wrought-iron structure tapering to the tip.',
      },
      {
        name: 'Champ de Mars',
        description:
          'The park axis staging approaches to the tower.',
      },
      {
        name: 'River views',
        description:
          'Seine and Trocadéro vistas from the platforms.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Eiffel Tower',
        url: 'https://www.britannica.com/topic/Eiffel-Tower',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'colosseum',
    code: 'COL',
    name: 'Colosseum',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Colosseum', 'Coliseum', 'Colosseo'],
    about:
      'The Colosseum is Rome’s great Flavian amphitheatre, an elliptical stone arena of arched arcades and underground hypogeum once staging public spectacles. It anchors the Forum–Palatine archaeological field east of the historic center. Damaged by quakes and stone-robbing, it remains the emblem of imperial Rome. Orientation is amphitheatre exterior versus arena floor and Arch of Constantine nearby. The Colosseum’s primer is Roman arena — monumental public architecture that still defines the city’s ancient skyline.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Rome · Flavian amphitheatre',
      role: 'Iconic Roman amphitheatre landmark',
      knownFor: 'Elliptical arena, arched facade, and Roman engineering',
    },
    features: [
      {
        name: 'Arched facade',
        description:
          'Tiered exterior arcades of travertine and brick.',
      },
      {
        name: 'Arena and hypogeum',
        description:
          'The floor and underground staging chambers.',
      },
      {
        name: 'Imperial context',
        description:
          'Proximity to Forum, Palatine, and triumphal arches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Colosseum',
        url: 'https://www.britannica.com/topic/Colosseum',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Rome',
        url: 'https://whc.unesco.org/en/list/91/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'bryce-canyon',
    code: 'BRY',
    name: 'Bryce Canyon',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Bryce Canyon', 'Bryce Canyon National Park'],
    about:
      'Bryce Canyon National Park protects a series of amphitheatres cut into southern Utah’s Paunsaugunt Plateau, famous for dense orange hoodoo spires. Rim walks overlook the glowing stone forest; elevation brings cool nights and clear air. Orientation is rim viewpoints versus valley floor trails among the hoodoos. Bryce’s primer is hoodoo amphitheatre — a high plateau edge where frost and rain carved one of the Southwest’s most surreal rock gardens.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Southern Utah · Paunsaugunt Plateau',
      role: 'National park of hoodoo amphitheatres',
      knownFor: 'Orange hoodoos, amphitheatre rim, and high plateau light',
    },
    features: [
      {
        name: 'Hoodoo fields',
        description:
          'Dense spires of eroded Claron Formation rock.',
      },
      {
        name: 'Rim amphitheatres',
        description:
          'Curving overlooks into glowing stone bowls.',
      },
      {
        name: 'High plateau',
        description:
          'Cool elevation and sharp desert light.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bryce Canyon National Park',
        url: 'https://www.britannica.com/place/Bryce-Canyon-National-Park',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'monument-valley',
    code: 'MOV',
    name: 'Monument Valley',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Monument Valley'],
    about:
      'Monument Valley straddles the Utah–Arizona border on Navajo Nation land, a desert of towering red buttes and mesas that became the visual shorthand for the American West. Dirt roads loop among the formations; dawn and dusk intensify the sandstone color. Orientation is valley floor versus butte skyline. Monument Valley’s primer is butte desert icon — isolated stone monuments rising from a flat red plain under huge southwestern sky.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Utah–Arizona border · Navajo Nation',
      role: 'Iconic butte-and-mesa desert landmark',
      knownFor: 'Red buttes, desert floor, and Western film silhouette',
    },
    features: [
      {
        name: 'Butte skyline',
        description:
          'Isolated red sandstone monuments on the plain.',
      },
      {
        name: 'Valley floor',
        description:
          'Desert roads looping among the formations.',
      },
      {
        name: 'Desert light',
        description:
          'Dawn and dusk color that defines the scene.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Monument Valley',
        url: 'https://www.britannica.com/place/Monument-Valley',
        kind: 'reference',
      }
    ],
  },
  {
    slug: 'potala-palace',
    code: 'POT',
    name: 'Potala Palace',
    kind: 'Landmark',
    countrySlug: 'china',
    subtitle: 'Landmark · China',
    matchNames: ['Potala Palace', 'Potala'],
    about:
      'The Potala Palace crowns a hill in Lhasa as the former winter residence of the Dalai Lamas, a vast White and Red Palace complex rising above the Tibetan Plateau city. Pilgrim circuits and plazas surround the base; interior chapels hold sacred art. Orientation is hillside palace versus Barkhor city fabric below. The Potala’s primer is Tibetan palace mountain — a monumental sacred residence that still dominates Lhasa’s skyline.',
    facts: {
      kind: 'Landmark',
      country: 'China',
      region: 'Asia',
      setting: 'Lhasa · Tibetan Plateau',
      role: 'Historic Dalai Lama palace and UNESCO site',
      knownFor: 'White and Red Palaces, hillside mass, and Lhasa skyline',
    },
    features: [
      {
        name: 'Hillside mass',
        description:
          'White and Red Palaces stacked on Marpo Ri.',
      },
      {
        name: 'Sacred interiors',
        description:
          'Chapels and assembly halls of the former residence.',
      },
      {
        name: 'Lhasa outlook',
        description:
          'Views over the plateau city and surrounding hills.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Potala Palace',
        url: 'https://www.britannica.com/topic/Potala-Palace',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Ensemble of the Potala Palace',
        url: 'https://whc.unesco.org/en/list/707/',
        kind: 'authority',
      }
    ],
  },
  {
    slug: 'itsukushima',
    code: 'ITK',
    name: 'Itsukushima',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Itsukushima', 'Itsukushima Shrine', 'Miyajima'],
    about:
      'Itsukushima Shrine on Miyajima faces Hiroshima Bay with a famous vermilion O-Torii that appears to float at high tide. Pier-built shrine corridors and halls sit over the water; the sacred island rises in forest behind. Tide levels change the entire composition. Orientation is torii gate versus shrine piers and Mount Misen. Itsukushima’s primer is floating torii shrine — a Shinto sanctuary staged between sea and sacred forest island.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Miyajima · Hiroshima Bay',
      role: 'Shinto shrine with iconic floating torii',
      knownFor: 'Vermilion O-Torii, shrine piers, and island setting',
    },
    features: [
      {
        name: 'O-Torii',
        description:
          'The great vermilion gate standing in the tidal bay.',
      },
      {
        name: 'Pier shrine',
        description:
          'Corridors and halls built over the water.',
      },
      {
        name: 'Sacred island',
        description:
          'Forested Miyajima rising behind the sanctuary.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Itsukushima Shrine',
        url: 'https://www.britannica.com/topic/Itsukushima-Shinto-shrine-Japan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Itsukushima Shinto Shrine',
        url: 'https://whc.unesco.org/en/list/776/',
        kind: 'authority',
      }
    ],
  },
]
