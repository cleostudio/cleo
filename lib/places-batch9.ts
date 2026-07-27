/** Ninth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch9: PlaceGuideDraftBatch[] = [
  {
    slug: 'portland',
    code: 'PDX',
    name: 'Portland',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Portland'],
    about:
      'Portland straddles the Willamette just above its Columbia confluence, a Pacific Northwest city of bridges, forested west hills, and a dense eastside grid. Rain and mild winters shape outdoor habits; volcano views and river paths structure weekends. Orientation is Willamette crossings versus West Hills and eastside neighborhoods. Portland’s primer is river city under evergreen slopes — bridges, bikes, and a green urban edge against Cascade foothills.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Willamette River · Cascade foothills',
      role: 'Oregon’s largest city and Willamette hub',
      knownFor: 'Bridges, west hills, and riverfront neighborhoods',
    },
    features: [
      {
        name: 'Willamette bridges',
        description:
          'A chain of spans linking westside and eastside grids.',
      },
      {
        name: 'West Hills',
        description:
          'Forested ridges holding parks above downtown.',
      },
      {
        name: 'Eastside neighborhoods',
        description:
          'Dense residential blocks and commercial strips east of the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Portland',
        url: 'https://www.britannica.com/place/Portland-Oregon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'austin',
    code: 'AUS',
    name: 'Austin',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Austin'],
    about:
      'Austin occupies the Colorado River’s Texas Hill Country edge as state capital and a fast-growing metro of lakes, live-music rooms, and tech campuses. Lady Bird Lake cuts a green corridor through downtown; limestone hills rise west. Hot summers and mild winters frame outdoor calendars. Orientation is Capitol dome versus lake chain and western hills. Austin’s primer is Hill Country capital — river lakes, music districts, and sprawl climbing into oak-covered ridges.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Colorado River · Texas Hill Country',
      role: 'Texas capital and central Texas hub',
      knownFor: 'Lady Bird Lake, Capitol, and Hill Country edge',
    },
    features: [
      {
        name: 'Lady Bird Lake',
        description:
          'A dammed Colorado River reach lining downtown parks.',
      },
      {
        name: 'Capitol grounds',
        description:
          'The pink granite dome organizing civic Austin.',
      },
      {
        name: 'Hill Country west',
        description:
          'Limestone ridges and oak woodland beyond the metro core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Austin',
        url: 'https://www.britannica.com/place/Austin-Texas',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nashville',
    code: 'BNA',
    name: 'Nashville',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Nashville'],
    about:
      'Nashville sits on the Cumberland River in Middle Tennessee as a music-industry capital with a growing downtown skyline and surrounding rolling hills. Broadway’s neon strip and Music Row concentrate the city’s sonic reputation; parks and universities balance the tourist core. Humid summers and mild winters shape outdoor life. Orientation is riverfront downtown versus Music Row and east-bank neighborhoods. Nashville’s primer is Cumberland music city — recording rooms, neon, and a skyline rising from Tennessee’s central basin.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Cumberland River · Middle Tennessee',
      role: 'Tennessee capital and music-industry hub',
      knownFor: 'Music Row, Broadway neon, and riverfront skyline',
    },
    features: [
      {
        name: 'Broadway strip',
        description:
          'Neon honky-tonks lining the downtown entertainment core.',
      },
      {
        name: 'Music Row',
        description:
          'Studios and offices that built the industry brand.',
      },
      {
        name: 'Cumberland waterfront',
        description:
          'Riverbanks framing the modern downtown skyline.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nashville',
        url: 'https://www.britannica.com/place/Nashville-Tennessee',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'new-orleans',
    code: 'MSY',
    name: 'New Orleans',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['New Orleans'],
    about:
      'New Orleans occupies a Mississippi River crescent beside Lake Pontchartrain, a below-sea-level bowl of levees, Creole streets, and jazz-born neighborhoods. The French Quarter’s grid and wrought-iron galleries meet Garden District oaks and a modern CBD. Subtropical heat, storms, and river commerce define the year. Orientation is river bend versus lake shore and the Quarter’s tight blocks. New Orleans’s primer is delta port city — levees, courtyards, and street music in a low-lying Mississippi bowl.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi River crescent · Lake Pontchartrain',
      role: 'Gulf port and cultural capital of Louisiana',
      knownFor: 'French Quarter, levees, and jazz neighborhoods',
    },
    features: [
      {
        name: 'French Quarter',
        description:
          'Colonial street grid with galleries and courtyards.',
      },
      {
        name: 'River crescent',
        description:
          'The Mississippi bend that seats the city’s port geography.',
      },
      {
        name: 'Levee city',
        description:
          'Engineered banks holding a low bowl beside the gulf approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — New Orleans',
        url: 'https://www.britannica.com/place/New-Orleans-Louisiana',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'guadalajara',
    code: 'GDL',
    name: 'Guadalajara',
    kind: 'City',
    countrySlug: 'mexico',
    subtitle: 'City · Mexico',
    matchNames: ['Guadalajara'],
    about:
      'Guadalajara spreads across the Atemajac Valley in western Mexico as Jalisco’s capital, a highland metropolis of plazas, cathedral towers, and mariachi tradition. Historic centers and modern business districts share a temperate plateau climate. Orientation is cathedral plaza versus expanding suburban rings. Guadalajara’s primer is western Mexican highland city — colonial cores, cultural brands, and a broad valley metropolis inland from the Pacific.',
    facts: {
      kind: 'City',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Atemajac Valley · western Mexico',
      role: 'Jalisco capital and major western Mexican hub',
      knownFor: 'Cathedral plazas, mariachi culture, and highland climate',
    },
    features: [
      {
        name: 'Historic plazas',
        description:
          'Cathedral and civic squares organizing the old core.',
      },
      {
        name: 'Valley setting',
        description:
          'A highland basin holding the expanding metro.',
      },
      {
        name: 'Cultural brands',
        description:
          'Music and crafts long associated with Jalisco identity.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Guadalajara',
        url: 'https://www.britannica.com/place/Guadalajara-Mexico',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'montevideo',
    code: 'MVD',
    name: 'Montevideo',
    kind: 'City',
    countrySlug: 'uruguay',
    subtitle: 'City · Uruguay',
    matchNames: ['Montevideo'],
    about:
      'Montevideo curves along the Río de la Plata as Uruguay’s capital, a temperate port city of rambla promenades, Ciudad Vieja streets, and a modest skyline facing a wide estuary. Atlantic-influenced weather keeps seasons mild; beaches and parks structure daily life. Orientation is Old City peninsula versus eastward beach suburbs along the rambla. Montevideo’s primer is Plata estuary capital — a walkable waterfront city where river and ocean air meet on Uruguay’s southern shore.',
    facts: {
      kind: 'City',
      country: 'Uruguay',
      region: 'Americas',
      setting: 'Río de la Plata · Atlantic approaches',
      role: 'National capital and principal Uruguayan port',
      knownFor: 'Rambla promenade, Ciudad Vieja, and estuary beaches',
    },
    features: [
      {
        name: 'Rambla',
        description:
          'A long coastal promenade linking beaches and neighborhoods.',
      },
      {
        name: 'Ciudad Vieja',
        description:
          'The historic peninsula core by the port.',
      },
      {
        name: 'Plata estuary',
        description:
          'Wide brown waters facing Buenos Aires across the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Montevideo',
        url: 'https://www.britannica.com/place/Montevideo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'addis-ababa',
    code: 'ADD',
    name: 'Addis Ababa',
    kind: 'City',
    countrySlug: 'ethiopia',
    subtitle: 'City · Ethiopia',
    matchNames: ['Addis Ababa'],
    about:
      'Addis Ababa occupies an Ethiopian highland plateau as the national capital and a diplomatic hub for the African continent. Eucalyptus-clad hills ring a dense urban bowl; markets and ministries share congested avenues. Cooler highland air contrasts with lowland heat elsewhere in Ethiopia. Orientation is Entoto ridges versus the central Meskel and Piazza districts. Addis Ababa’s primer is highland capital — a plateau metropolis where continental institutions and Ethiopian urban life meet at elevation.',
    facts: {
      kind: 'City',
      country: 'Ethiopia',
      region: 'Africa',
      setting: 'Ethiopian Highlands · plateau bowl',
      role: 'National capital and African diplomatic hub',
      knownFor: 'Highland setting, markets, and continental institutions',
    },
    features: [
      {
        name: 'Highland bowl',
        description:
          'A plateau city ringed by eucalyptus ridges.',
      },
      {
        name: 'Central districts',
        description:
          'Meskel, Piazza, and ministry corridors of daily commerce.',
      },
      {
        name: 'Diplomatic role',
        description:
          'Continental organizations headquartered in the capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Addis Ababa',
        url: 'https://www.britannica.com/place/Addis-Ababa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kampala',
    code: 'KLA',
    name: 'Kampala',
    kind: 'City',
    countrySlug: 'uganda',
    subtitle: 'City · Uganda',
    matchNames: ['Kampala'],
    about:
      'Kampala spreads across a cluster of hills near Lake Victoria as Uganda’s capital, a green equatorial city of markets, churches, and expanding suburban roads. Hilltops hold landmarks; valleys hold traffic and commerce. Orientation is the seven historic hills versus the lakeward southern approaches. Kampala’s primer is lake-margin capital — hill neighborhoods and market energy just inland from Africa’s largest lake.',
    facts: {
      kind: 'City',
      country: 'Uganda',
      region: 'Africa',
      setting: 'Hills near Lake Victoria',
      role: 'Ugandan capital and commercial center',
      knownFor: 'Hilltop neighborhoods, markets, and lake proximity',
    },
    features: [
      {
        name: 'Hill city',
        description:
          'Neighborhoods and landmarks perched on successive ridges.',
      },
      {
        name: 'Market valleys',
        description:
          'Dense commercial lowlands between the hills.',
      },
      {
        name: 'Lake Victoria approaches',
        description:
          'Southern routes toward Africa’s largest freshwater lake.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kampala',
        url: 'https://www.britannica.com/place/Kampala',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lahore',
    code: 'LHE',
    name: 'Lahore',
    kind: 'City',
    countrySlug: 'pakistan',
    subtitle: 'City · Pakistan',
    matchNames: ['Lahore'],
    about:
      'Lahore occupies the Ravi River plain in Pakistan’s Punjab as a historic cultural capital of Mughal monuments, walled-city lanes, and a sprawling modern metro. The Badshahi Mosque and Lahore Fort anchor the old city; canals and parks green later districts. Hot summers and cooler winters shape the year. Orientation is Walled City versus Mall Road and expanding southern suburbs. Lahore’s primer is Punjabi cultural capital — Mughal stone, bazaar density, and a river-plain metropolis of lasting literary reputation.',
    facts: {
      kind: 'City',
      country: 'Pakistan',
      region: 'Asia',
      setting: 'Ravi River plain · Punjab',
      role: 'Punjab’s cultural and historic capital',
      knownFor: 'Mughal monuments, Walled City, and Punjabi culture',
    },
    features: [
      {
        name: 'Walled City',
        description:
          'Dense lanes around Fort and Badshahi Mosque.',
      },
      {
        name: 'Mughal monuments',
        description:
          'Imperial-era stone complexes defining the historic skyline.',
      },
      {
        name: 'Canal suburbs',
        description:
          'Tree-lined later districts spreading across the plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lahore',
        url: 'https://www.britannica.com/place/Lahore',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kolkata',
    code: 'CCU',
    name: 'Kolkata',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Kolkata', 'Calcutta'],
    about:
      'Kolkata occupies the Hooghly River’s lower reach as West Bengal’s capital, a humid eastern Indian metropolis of colonial façades, tram lines, and intense street life. Howrah Bridge and the Maidan organize the historic west bank; neighborhoods extend deep into the delta plain. Monsoon rains and river commerce shape the calendar. Orientation is Hooghly waterfront versus Maidan open space and northern/southern residential belts. Kolkata’s primer is delta river city — colonial riverfront grandeur and dense neighborhood culture on Bengal’s coastal plain.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Hooghly River · Bengal delta plain',
      role: 'West Bengal capital and eastern Indian metropolis',
      knownFor: 'Howrah Bridge, Maidan, and riverfront colonial fabric',
    },
    features: [
      {
        name: 'Hooghly waterfront',
        description:
          'Bridges and ghats facing the river’s working channel.',
      },
      {
        name: 'Maidan',
        description:
          'A vast central green interrupting dense urban blocks.',
      },
      {
        name: 'Colonial façades',
        description:
          'Institutional and residential architecture from the river-port era.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kolkata',
        url: 'https://www.britannica.com/place/Kolkata',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fukuoka',
    code: 'FUK',
    name: 'Fukuoka',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Fukuoka', 'Hakata'],
    about:
      'Fukuoka faces Hakata Bay on northern Kyushu as a compact Japanese port city linking the island to Korea and beyond. Hakata and Tenjin districts concentrate shopping and transit; coastal parks and castle ruins mark older layers. Mild winters and warm summers suit outdoor eating culture. Orientation is bayfront versus inland ridges and the twin commercial cores. Fukuoka’s primer is Kyushu gateway — a bay city of ferry and flight links, street-food stalls, and a skyline facing the Genkai Sea approaches.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Hakata Bay · northern Kyushu',
      role: 'Kyushu’s principal city and international gateway',
      knownFor: 'Hakata Bay, twin cores, and Kyushu gateway role',
    },
    features: [
      {
        name: 'Hakata Bay',
        description:
          'A sheltered harbor facing continental Asia.',
      },
      {
        name: 'Hakata–Tenjin cores',
        description:
          'Linked commercial districts organizing daily movement.',
      },
      {
        name: 'Kyushu gateway',
        description:
          'Air and sea links that make the city a regional hub.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fukuoka',
        url: 'https://www.britannica.com/place/Fukuoka-Japan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'rotterdam',
    code: 'RTM',
    name: 'Rotterdam',
    kind: 'City',
    countrySlug: 'netherlands',
    subtitle: 'City · Netherlands',
    matchNames: ['Rotterdam'],
    about:
      'Rotterdam occupies the Nieuwe Maas in the Rhine–Meuse delta as Europe’s great container port and a rebuilt modern Dutch city of bold architecture. Wartime destruction cleared a historic core; postwar towers and bridges redefined the skyline. Waterways and docks structure every view. Orientation is Erasmus Bridge versus port basins and the dense center. Rotterdam’s primer is delta port city — working water, experimental architecture, and a skyline born from reconstruction on the Dutch coast’s busiest river mouth.',
    facts: {
      kind: 'City',
      country: 'Netherlands',
      region: 'Europe',
      setting: 'Nieuwe Maas · Rhine–Meuse delta',
      role: 'Major European port and South Holland hub',
      knownFor: 'Harbor basins, Erasmus Bridge, and modern skyline',
    },
    features: [
      {
        name: 'Port basins',
        description:
          'Working docks that made the city a continental gateway.',
      },
      {
        name: 'Erasmus Bridge',
        description:
          'A landmark span linking north and south banks.',
      },
      {
        name: 'Rebuilt center',
        description:
          'Postwar architecture replacing the destroyed historic core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rotterdam',
        url: 'https://www.britannica.com/place/Rotterdam',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'michigan',
    code: 'MI',
    name: 'Michigan',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Michigan'],
    about:
      'Michigan is a Great Lakes state of two peninsulas nearly enclosed by Superior, Michigan, Huron, and Erie waters. Forests, dunes, and industrial cities share a shoreline-dominated geography; winters are lake-effect heavy. Orientation is Lower Peninsula grid versus Upper Peninsula wilderness and the Straits of Mackinac link. Michigan’s primer is lakes state — more coastline than many ocean shores, with dunes, freighters, and inland forests defining the map.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Great Lakes · two peninsulas',
      role: 'Great Lakes industrial and recreation state',
      knownFor: 'Great Lakes shores, dunes, and dual peninsulas',
    },
    features: [
      {
        name: 'Great Lakes shores',
        description:
          'Hundreds of miles of freshwater coastline.',
      },
      {
        name: 'Two peninsulas',
        description:
          'Lower and Upper Michigan linked at Mackinac.',
      },
      {
        name: 'Dune country',
        description:
          'Lake Michigan sand ridges and forested bluffs.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Michigan',
        url: 'https://www.britannica.com/place/Michigan-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'georgia-us',
    code: 'GAS',
    name: 'Georgia',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Georgia (U.S. state)', 'State of Georgia'],
    about:
      'Georgia stretches from Blue Ridge mountains to Atlantic barrier islands as a southeastern U.S. state of Piedmont cities, coastal marshes, and pine plains. Atlanta’s metro dominates the north-central Piedmont; Savannah and the sea islands define the coast. Humid subtropical seasons shape agriculture and outdoor life. Orientation is mountains versus Piedmont plateau and coastal plain. Georgia’s primer is Southeast transect — Appalachian foothills, a sprawling capital region, and a marsh-edged Atlantic shore.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Blue Ridge to Atlantic coast',
      role: 'Southeastern U.S. state centered on Atlanta',
      knownFor: 'Piedmont cities, Blue Ridge, and barrier islands',
    },
    features: [
      {
        name: 'Blue Ridge edge',
        description:
          'Northern mountains and foothill valleys.',
      },
      {
        name: 'Piedmont core',
        description:
          'Atlanta’s metro and surrounding plateau cities.',
      },
      {
        name: 'Coastal plain',
        description:
          'Marshes, sea islands, and low Atlantic shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Georgia',
        url: 'https://www.britannica.com/place/Georgia-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'south-australia',
    code: 'SAU',
    name: 'South Australia',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['South Australia'],
    about:
      'South Australia occupies the continent’s south-central coast and arid interior, with Adelaide on a gulf plain and wine regions climbing nearby hills. The Flinders Ranges and Nullarbor approaches frame inland emptiness; Mediterranean climate marks the settled south. Orientation is Adelaide gulf versus ranges and desert north. South Australia’s primer is gulf-and-arid state — a compact capital coast against one of Australia’s driest interiors.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Southern gulfs · arid interior',
      role: 'South-central Australian state around Adelaide',
      knownFor: 'Adelaide gulfs, wine hills, and Flinders Ranges',
    },
    features: [
      {
        name: 'Adelaide gulfs',
        description:
          'Settled coasts around Gulf St Vincent and Spencer Gulf.',
      },
      {
        name: 'Wine hills',
        description:
          'Barossa and Adelaide Hills vineyard country.',
      },
      {
        name: 'Flinders Ranges',
        description:
          'Ancient inland ridges rising from arid plains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — South Australia',
        url: 'https://www.britannica.com/place/South-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'skiathos',
    code: 'SKI',
    name: 'Skiathos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Skiathos'],
    about:
      'Skiathos is a small Sporades island of pine forests and sandy coves off Thessaly’s coast, denser and greener than many Cycladic neighbors. A single main town faces a sheltered harbor; beaches line the south and east. Summer ferries and flights concentrate tourism. Orientation is harbor town versus pine-backed beaches. Skiathos’s primer is green Sporades island — soft sand, forested hills, and a compact Aegean holiday geography.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Sporades · northwest Aegean',
      role: 'Popular green Aegean holiday island',
      knownFor: 'Pine forests, sandy beaches, and a compact harbor town',
    },
    features: [
      {
        name: 'Pine hills',
        description:
          'Forested ridges uncommon among arid Greek islands.',
      },
      {
        name: 'Sandy coves',
        description:
          'South- and east-facing beaches along the coast.',
      },
      {
        name: 'Harbor town',
        description:
          'The main settlement facing a sheltered Sporades port.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Skiathos',
        url: 'https://www.britannica.com/place/Skiathos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kos',
    code: 'KOS',
    name: 'Kos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Kos'],
    about:
      'Kos is a Dodecanese island near the Turkish coast, a flatter Aegean land of ancient Asklepion ruins, Venetian-era castle walls, and long tourist beaches. Hippocrates lore and Hellenistic layers meet Ottoman and Italian-era streets in Kos Town. Hot, dry summers define the season. Orientation is Kos Town harbor versus western beaches and inland plains. Kos’s primer is Dodecanese low island — antiquity, castle stone, and beach tourism facing Asia Minor’s nearby shore.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Dodecanese · southeast Aegean',
      role: 'Historic and tourist Dodecanese island',
      knownFor: 'Asklepion ruins, Kos Town harbor, and long beaches',
    },
    features: [
      {
        name: 'Asklepion',
        description:
          'Ancient healing sanctuary terraces above the town.',
      },
      {
        name: 'Harbor castle',
        description:
          'Knights-era walls guarding Kos Town’s port.',
      },
      {
        name: 'Coastal plains',
        description:
          'Flatter terrain and beach strips atypical of volcanic islands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cos',
        url: 'https://www.britannica.com/place/Cos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'zakynthos',
    code: 'ZTH',
    name: 'Zakynthos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Zakynthos', 'Zante'],
    about:
      'Zakynthos (Zante) is an Ionian island of limestone cliffs, turquoise coves, and fertile valleys west of the Peloponnese. Navagio’s shipwreck beach concentrates visual fame; loggerhead turtles nest on southern sands. Earthquake history reshaped towns; tourism now dominates coasts. Orientation is western cliffs versus eastern gentler shores. Zakynthos’s primer is Ionian cliff island — white scarps, shipwreck coves, and a green interior facing the open Ionian Sea.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Ionian Islands · western Greece',
      role: 'Scenic Ionian tourist island',
      knownFor: 'Navagio Beach, limestone cliffs, and turtle nesting shores',
    },
    features: [
      {
        name: 'Navagio cove',
        description:
          'The cliff-walled shipwreck beach of postcard fame.',
      },
      {
        name: 'Western cliffs',
        description:
          'Limestone scarps dropping into deep Ionian water.',
      },
      {
        name: 'Southern beaches',
        description:
          'Gentler sands important for nesting sea turtles.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zacynthus',
        url: 'https://www.britannica.com/place/Zacynthus',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'martinique',
    code: 'MTQ',
    name: 'Martinique',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Martinique'],
    about:
      'Martinique is a French Caribbean island of volcanic peaks, rainforested slopes, and Atlantic-to-Caribbean coasts in the Lesser Antilles. Mount Pelée’s cone dominates the north; Fort-de-France occupies a sheltered bay. Creole and French cultures share humid tropical seasons. Orientation is volcanic north versus drier southern beaches. Martinique’s primer is Antillean French island — a steep green volcano isle with bay towns and trade-wind coasts under overseas French administration.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'Lesser Antilles · volcanic Caribbean',
      role: 'French overseas department in the Antilles',
      knownFor: 'Mount Pelée, Fort-de-France bay, and tropical coasts',
    },
    features: [
      {
        name: 'Mount Pelée',
        description:
          'The northern stratovolcano defining the skyline.',
      },
      {
        name: 'Fort-de-France',
        description:
          'The bay capital on the Caribbean-facing west.',
      },
      {
        name: 'Dual coasts',
        description:
          'Atlantic windward and calmer Caribbean leeward shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Martinique',
        url: 'https://www.britannica.com/place/Martinique',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'isle-of-skye',
    code: 'SKY',
    name: 'Isle of Skye',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Skye', 'Skye'],
    about:
      'The Isle of Skye is a large Hebridean island of Cuillin ridges, sea cliffs, and crofting townships off Scotland’s northwest coast. Mist, basalt pillars, and deep glens make weather part of the geography; the Skye Bridge ties it to the mainland. Orientation is Cuillin massif versus Trotternish peninsula and coastal villages. Skye’s primer is Hebridean mountain island — jagged ridges, fairy-tale rock, and Atlantic weather over a sparsely settled Highland shore.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · northwest Scotland',
      role: 'Iconic Highland and island landscape',
      knownFor: 'Cuillin ridges, Trotternish rock, and misty glens',
    },
    features: [
      {
        name: 'Cuillin ridges',
        description:
          'Jagged mountain spines of gabbro and basalt.',
      },
      {
        name: 'Trotternish',
        description:
          'Landslip landforms including the Old Man of Storr.',
      },
      {
        name: 'Sea cliffs',
        description:
          'Atlantic edges and sea stacks around the island rim.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Skye',
        url: 'https://www.britannica.com/place/Skye-island-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'koh-samui',
    code: 'USM',
    name: 'Koh Samui',
    kind: 'Island',
    countrySlug: 'thailand',
    subtitle: 'Island · Thailand',
    matchNames: ['Koh Samui', 'Ko Samui', 'Samui'],
    about:
      'Koh Samui is a Gulf of Thailand island of coconut palms, granite hills, and resort beaches east of the mainland. Chaweng and Lamai concentrate tourism; quieter coves wrap the coast. Tropical wet and dry seasons shape travel calendars. Orientation is east-coast beach strips versus hilly interior and western fishing villages. Samui’s primer is gulf resort island — palm coasts and granite knolls on Thailand’s mid-gulf holiday circuit.',
    facts: {
      kind: 'Island',
      country: 'Thailand',
      region: 'Asia',
      setting: 'Gulf of Thailand · mid-gulf islands',
      role: 'Major Thai gulf resort island',
      knownFor: 'Palm beaches, granite hills, and resort bays',
    },
    features: [
      {
        name: 'East-coast beaches',
        description:
          'Chaweng and Lamai strips of resort sand.',
      },
      {
        name: 'Granite hills',
        description:
          'Interior knolls rising above coconut plantations.',
      },
      {
        name: 'Gulf setting',
        description:
          'Warm, relatively sheltered Thai gulf waters.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Samui Island',
        url: 'https://www.britannica.com/place/Samui-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'burgundy',
    code: 'BRG',
    name: 'Burgundy',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Burgundy', 'Bourgogne'],
    about:
      'Burgundy is an east-central French region of limestone escarpments, canal towns, and world-famous vineyard slopes. The Côte d’Or’s narrow wine strip concentrates prestige; Dijon and Beaune organize historic trade. Cool continental seasons shape harvests. Orientation is wine escarpment versus Saône plain and Morvan uplands. Burgundy’s primer is vineyard ridge country — limestone coteaux, canal routes, and cellar towns along a historic French wine spine.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'East-central France · limestone coteaux',
      role: 'Historic wine and canal region',
      knownFor: 'Côte d’Or vineyards, canal towns, and limestone slopes',
    },
    features: [
      {
        name: 'Côte d’Or',
        description:
          'The narrow prestigious vineyard escarpment.',
      },
      {
        name: 'Canal towns',
        description:
          'Historic waterway settlements linking wine trade.',
      },
      {
        name: 'Limestone coteaux',
        description:
          'Slopes that define terroir and village rows.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Burgundy',
        url: 'https://www.britannica.com/place/Burgundy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'piedmont',
    code: 'PIE',
    name: 'Piedmont',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Piedmont', 'Piemonte'],
    about:
      'Piedmont occupies northwestern Italy at the foot of the Alps, a region of Langhe vineyards, rice plains, and the industrial-cultural hub of Turin. Alpine arcs close three sides; the Po plain opens east. Foggy winters and warm vineyard summers shape the calendar. Orientation is Alpine wall versus Langhe hills and Turin plain. Piedmont’s primer is Alpine-foot region — wine ridges, rice fields, and a historic capital where mountains meet the Po’s upper basin.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Northwest Italy · Alpine foot',
      role: 'Wine, industry, and Alpine-gateway region',
      knownFor: 'Langhe vineyards, Turin, and Alpine arcs',
    },
    features: [
      {
        name: 'Langhe hills',
        description:
          'Rolling vineyard ridges of Barolo and Barbaresco fame.',
      },
      {
        name: 'Alpine wall',
        description:
          'High ranges closing the region’s west and north.',
      },
      {
        name: 'Po plain edge',
        description:
          'Rice fields and industrial corridors toward the east.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Piedmont',
        url: 'https://www.britannica.com/place/Piedmont-region-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'yorkshire',
    code: 'YKD',
    name: 'Yorkshire',
    kind: 'Region',
    countrySlug: 'united-kingdom',
    subtitle: 'Region · United Kingdom',
    matchNames: ['Yorkshire', 'Yorkshire Dales'],
    about:
      'Yorkshire is a large historic English region of limestone dales, heather moors, industrial cities, and a North Sea coast. Dry-stone walls and sheep pasture define upland scenery; Leeds and York organize urban Yorkshire. Cool maritime weather shapes walking calendars. Orientation is Dales and Moors versus Vale of York and coastal cliffs. Yorkshire’s primer is northern English country — stone villages, open moor, and a deep urban-industrial layer under wide skies.',
    facts: {
      kind: 'Region',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Northern England · dales and moors',
      role: 'Historic northern English region',
      knownFor: 'Dales, moors, dry-stone walls, and North Sea cliffs',
    },
    features: [
      {
        name: 'Yorkshire Dales',
        description:
          'Limestone valleys and stone-walled pastures.',
      },
      {
        name: 'Heather moors',
        description:
          'Upland plateaus of North York Moors fame.',
      },
      {
        name: 'Vale and coast',
        description:
          'Lowland cities and cliffs meeting the North Sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yorkshire',
        url: 'https://www.britannica.com/place/Yorkshire',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'atlas-mountains',
    code: 'ATM',
    name: 'Atlas Mountains',
    kind: 'Region',
    countrySlug: 'morocco',
    subtitle: 'Region · Morocco',
    matchNames: ['Atlas Mountains', 'High Atlas'],
    about:
      'The Atlas Mountains form Morocco’s highland spine from Atlantic approaches to Algerian borders, a chain of High, Middle, and Anti-Atlas ranges separating coastal plains from Saharan fringes. Berber villages terrace slopes; snow can crown Toubkal while valleys stay mild. Orientation is High Atlas wall versus desert-facing southern slopes. The Atlas primer is Maghreb mountain spine — folded ranges that organize climate, roads, and the visual edge of Morocco’s interior.',
    facts: {
      kind: 'Region',
      country: 'Morocco',
      region: 'Africa',
      setting: 'Maghreb highland spine',
      role: 'Primary mountain system of Morocco',
      knownFor: 'High Atlas peaks, terraced villages, and desert approaches',
    },
    features: [
      {
        name: 'High Atlas',
        description:
          'The highest ridge including Toubkal’s massif.',
      },
      {
        name: 'Terraced villages',
        description:
          'Slope settlements and irrigated valley gardens.',
      },
      {
        name: 'Desert approaches',
        description:
          'Southern flanks dropping toward pre-Saharan plains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Atlas Mountains',
        url: 'https://www.britannica.com/place/Atlas-Mountains',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kakadu',
    code: 'KAK',
    name: 'Kakadu',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Kakadu', 'Kakadu National Park'],
    about:
      'Kakadu is a vast Top End region of wetlands, sandstone escarpments, and Aboriginal cultural landscapes in Australia’s Northern Territory. Monsoon floods fill floodplains; dry seasons shrink water to billabongs crowded with wildlife. Rock art sites mark deep human time. Orientation is Arnhem Land escarpment versus floodplain wetlands. Kakadu’s primer is tropical Australian park country — stone country, wetland seasons, and living cultural landscapes under extreme wet–dry cycles.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Northern Territory Top End',
      role: 'UNESCO-listed tropical park landscape',
      knownFor: 'Wetlands, escarpments, and rock-art country',
    },
    features: [
      {
        name: 'Floodplain wetlands',
        description:
          'Seasonal waters that expand and shrink with the monsoon.',
      },
      {
        name: 'Sandstone escarpment',
        description:
          'Arnhem Land stone country rising above the plains.',
      },
      {
        name: 'Cultural landscapes',
        description:
          'Rock-art sites and living Indigenous connections to Country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kakadu National Park',
        url: 'https://www.britannica.com/place/Kakadu-National-Park',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Kakadu National Park',
        url: 'https://whc.unesco.org/en/list/147/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'statue-of-liberty',
    code: 'SOL',
    name: 'Statue of Liberty',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Statue of Liberty', 'Liberty Island'],
    about:
      'The Statue of Liberty stands on Liberty Island in New York Harbor as a copper colossus facing the Atlantic approaches that once carried immigrant ships. Designed by Bartholdi with an Eiffel iron frame, it anchors harbor views from ferry wakes and Battery Park. Harbor weather and salt air shape its setting. Orientation is Liberty Island versus Ellis Island and the Narrows beyond. The statue’s primer is harbor icon — a gift monument still defining the visual gateway to New York’s boroughs.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Liberty Island · New York Harbor',
      role: 'National monument and harbor icon',
      knownFor: 'Copper colossus, harbor ferries, and immigrant gateway symbolism',
    },
    features: [
      {
        name: 'Liberty Island',
        description:
          'The small harbor island that holds the monument.',
      },
      {
        name: 'Harbor approaches',
        description:
          'Ferry lanes and views toward Manhattan and the Narrows.',
      },
      {
        name: 'Copper colossus',
        description:
          'Bartholdi’s statue on an Eiffel-engineered frame.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Statue of Liberty',
        url: 'https://www.britannica.com/topic/Statue-of-Liberty',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Statue of Liberty',
        url: 'https://whc.unesco.org/en/list/307/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'golden-gate',
    code: 'GGB',
    name: 'Golden Gate Bridge',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Golden Gate Bridge', 'Golden Gate'],
    about:
      'The Golden Gate Bridge spans the Golden Gate strait between San Francisco and Marin County as an Art Deco suspension icon painted International Orange against fog and Pacific light. Towers rise above shipping lanes; parks on both shores frame classic viewpoints. Wind and fog are part of the experience. Orientation is strait channel versus Presidio and Marin Headlands overlooks. The bridge’s primer is Pacific gate span — a mid-century engineering landmark still defining San Francisco’s coastal silhouette.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Golden Gate strait · San Francisco Bay',
      role: 'Iconic suspension bridge and viewpoint landmark',
      knownFor: 'International Orange towers, fog, and headland views',
    },
    features: [
      {
        name: 'Suspension towers',
        description:
          'Art Deco pylons carrying the main cables.',
      },
      {
        name: 'Strait channel',
        description:
          'The Pacific entrance to San Francisco Bay.',
      },
      {
        name: 'Headland viewpoints',
        description:
          'Presidio and Marin overlooks framing classic photos.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Golden Gate Bridge',
        url: 'https://www.britannica.com/topic/Golden-Gate-Bridge',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'versailles',
    code: 'VER',
    name: 'Palace of Versailles',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Palace of Versailles', 'Versailles', 'Château de Versailles'],
    about:
      'The Palace of Versailles occupies a planned royal landscape southwest of Paris as the emblematic seat of French absolute monarchy and a UNESCO palace-garden complex. The Hall of Mirrors and formal gardens by Le Nôtre organize axial views; fountains and bosquets extend the geometry into parkland. Orientation is palace façade versus garden axes and the Grand Canal. Versailles’s primer is royal court landscape — baroque architecture and engineered gardens that staged power outside the capital.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Île-de-France · southwest of Paris',
      role: 'Former royal residence and UNESCO palace complex',
      knownFor: 'Hall of Mirrors, formal gardens, and axial parkland',
    },
    features: [
      {
        name: 'Palace façade',
        description:
          'The vast court-facing elevations of the château.',
      },
      {
        name: 'Le Nôtre gardens',
        description:
          'Formal parterres, fountains, and bosquets on royal axes.',
      },
      {
        name: 'Grand Canal',
        description:
          'The long water axis extending the garden geometry.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Palace of Versailles',
        url: 'https://www.britannica.com/topic/Palace-of-Versailles',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Palace and Park of Versailles',
        url: 'https://whc.unesco.org/en/list/83/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sydney-opera-house',
    code: 'SOH',
    name: 'Sydney Opera House',
    kind: 'Landmark',
    countrySlug: 'australia',
    subtitle: 'Landmark · Australia',
    matchNames: ['Sydney Opera House', 'Opera House'],
    about:
      'The Sydney Opera House occupies Bennelong Point on Sydney Harbour as a concrete-shell performing-arts landmark designed by Jørn Utzon. White sail-like roofs face the Harbour Bridge and Circular Quay ferries; theaters sit within the platform podium. Harbor light and water reflections define every approach. Orientation is Bennelong Point versus Circular Quay and the bridge beyond. The Opera House’s primer is harbor architecture icon — shells, steps, and ferry wakes at Australia’s most photographed waterfront pinch.',
    facts: {
      kind: 'Landmark',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Bennelong Point · Sydney Harbour',
      role: 'UNESCO performing-arts landmark',
      knownFor: 'Shell roofs, harbor setting, and Circular Quay approaches',
    },
    features: [
      {
        name: 'Shell roofs',
        description:
          'Utzon’s precast concrete vaults facing the harbor.',
      },
      {
        name: 'Bennelong Point',
        description:
          'The peninsula podium between Circular Quay and Farm Cove.',
      },
      {
        name: 'Harbour approaches',
        description:
          'Ferry lanes and bridge views that frame every visit.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sydney Opera House',
        url: 'https://www.britannica.com/topic/Sydney-Opera-House',
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
    slug: 'teotihuacan',
    code: 'TEO',
    name: 'Teotihuacan',
    kind: 'Landmark',
    countrySlug: 'mexico',
    subtitle: 'Landmark · Mexico',
    matchNames: ['Teotihuacan', 'Pyramid of the Sun'],
    about:
      'Teotihuacan is an ancient central Mexican city of monumental pyramids and the Avenue of the Dead northeast of modern Mexico City. The Pyramid of the Sun and Pyramid of the Moon organize a planned ceremonial axis; murals and apartment compounds once filled the urban grid. Highland light and dry-season clarity define visits. Orientation is Avenue of the Dead versus the two great pyramids. Teotihuacan’s primer is Classic Mesoamerican metropolis — engineered avenues and pyramid masses on the Basin of Mexico’s northeastern plain.',
    facts: {
      kind: 'Landmark',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Basin of Mexico · northeast of Mexico City',
      role: 'Ancient Mesoamerican city and UNESCO site',
      knownFor: 'Pyramid of the Sun, Avenue of the Dead, and Moon Pyramid',
    },
    features: [
      {
        name: 'Pyramid of the Sun',
        description:
          'The massive central pyramid dominating the site.',
      },
      {
        name: 'Avenue of the Dead',
        description:
          'The long ceremonial axis of the ancient city.',
      },
      {
        name: 'Pyramid of the Moon',
        description:
          'The northern pyramid closing the main vista.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Teotihuacán',
        url: 'https://www.britannica.com/place/Teotihuacan',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pre-Hispanic City of Teotihuacan',
        url: 'https://whc.unesco.org/en/list/414/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'arches',
    code: 'ARC',
    name: 'Arches National Park',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Arches National Park', 'Arches', 'Delicate Arch'],
    about:
      'Arches National Park occupies a high desert plateau near Moab, Utah, as a landscape of sandstone fins, balanced rocks, and natural arches carved from Entrada Sandstone. Delicate Arch concentrates visual fame; Windows and Devils Garden hold denser formations. Intense sun and sparse vegetation define the scene. Orientation is Courthouse Towers versus Delicate Arch and the La Sal Mountains backdrop. Arches’s primer is red-rock portal country — wind-carved openings in desert stone above the Colorado Plateau.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Colorado Plateau · near Moab, Utah',
      role: 'National park of sandstone arches',
      knownFor: 'Delicate Arch, sandstone fins, and desert viewpoints',
    },
    features: [
      {
        name: 'Delicate Arch',
        description:
          'The freestanding icon against the La Sal backdrop.',
      },
      {
        name: 'Sandstone fins',
        description:
          'Parallel rock walls that erode into arches.',
      },
      {
        name: 'Desert plateaus',
        description:
          'High, arid benches above the Colorado River country.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Arches National Park',
        url: 'https://www.britannica.com/place/Arches-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Arches',
        url: 'https://www.nps.gov/arch/index.htm',
        kind: 'authority',
      },
    ],
  },
]
