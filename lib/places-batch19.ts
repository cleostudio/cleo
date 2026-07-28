/** Nineteenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch19: PlaceGuideDraftBatch[] = [
  {
    slug: 'des-moines',
    code: 'DSM',
    name: 'Des Moines',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Des Moines'],
    about:
      'Des Moines sits at the confluence of the Des Moines and Raccoon rivers in central Iowa as a capital city of civic towers, river parks, and prairie approaches. The gold-domed Capitol anchors the east side; downtown fills the river bend. Hot humid summers and cold winters mark the plains climate. Orient from the river confluence through downtown to the Capitol grounds. Des Moines’s primer is Iowa river capital — civic dome and confluence parks at the center of the state.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Des Moines and Raccoon rivers · central Iowa',
      role: 'Iowa state capital and metro',
      knownFor: 'Capitol dome, river confluence, and prairie approaches',
    },
    features: [
      {
        name: 'Capitol grounds',
        description:
          'Gold-domed civic campus east of downtown.',
      },
      {
        name: 'River confluence',
        description:
          'Des Moines and Raccoon meeting in the core.',
      },
      {
        name: 'Prairie approaches',
        description:
          'Farmland horizons around the metro.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Des Moines',
        url: 'https://www.britannica.com/place/Des-Moines-Iowa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'knoxville',
    code: 'KNX',
    name: 'Knoxville',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Knoxville'],
    about:
      'Knoxville occupies the Tennessee River valley in East Tennessee as a gateway city between the Cumberland Plateau and Great Smoky Mountains. Downtown and university districts sit above the river; forested ridges frame the urban bowl. Humid summers and colorful autumns define the Appalachian year. Read river valley, downtown ridge, and Smoky approaches together. Knoxville’s primer is East Tennessee river city — Appalachian gateway between plateau and Smoky Mountains.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Tennessee River · East Tennessee',
      role: 'East Tennessee metro and mountain gateway',
      knownFor: 'Tennessee River valley, Smoky approaches, and university core',
    },
    features: [
      {
        name: 'Tennessee Riverfront',
        description:
          'Valley waterfront through the city.',
      },
      {
        name: 'Downtown ridge',
        description:
          'Compact core above the river.',
      },
      {
        name: 'Smoky approaches',
        description:
          'Mountain roads southeast of the metro.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Knoxville',
        url: 'https://www.britannica.com/place/Knoxville-Tennessee',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mesa',
    code: 'MES',
    name: 'Mesa',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Mesa'],
    about:
      'Mesa spreads across the Salt River Valley east of Phoenix in Arizona’s Sonoran Desert as a large suburban city of grid avenues, canal remnants, and Superstition Mountain horizons. Hot dry summers and mild winters define the desert year. Orient from the historic downtown grid toward desert mountain rims. Mesa’s primer is East Valley desert city — Salt River plain streets under Superstition Mountain light.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Salt River Valley · Sonoran Desert',
      role: 'Major East Valley Arizona city',
      knownFor: 'Desert grid, canal heritage, and Superstition horizons',
    },
    features: [
      {
        name: 'East Valley grid',
        description:
          'Broad avenues of the Salt River plain.',
      },
      {
        name: 'Desert mountain rims',
        description:
          'Superstitions and peer ranges on the horizon.',
      },
      {
        name: 'Canal corridors',
        description:
          'Irrigation heritage through the city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mesa',
        url: 'https://www.britannica.com/place/Mesa-Arizona',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cincinnati',
    code: 'CVG',
    name: 'Cincinnati',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Cincinnati'],
    about:
      'Cincinnati climbs from the Ohio River in a bowl of hills at the Ohio–Kentucky edge as a river city of steeples, suspension bridges, and dense Over-the-Rhine brick. The riverfront organizes stadiums and parks; hills hold neighborhoods above the basin. Humid summers and cold winters share the Ohio Valley climate. Stand on the river so bridges, basin, and hill skyline read together. Cincinnati’s primer is Ohio River basin city — bridges and hillside neighborhoods above a historic river bend.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Ohio River · Ohio–Kentucky edge',
      role: 'Ohio River metro and historic river city',
      knownFor: 'Ohio River bridges, hillside neighborhoods, and Over-the-Rhine',
    },
    features: [
      {
        name: 'Ohio Riverfront',
        description:
          'Bridges and parks along the bend.',
      },
      {
        name: 'Hillside neighborhoods',
        description:
          'Street grids climbing from the basin.',
      },
      {
        name: 'Over-the-Rhine',
        description:
          'Dense historic brick district near downtown.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Cincinnati',
        url: 'https://www.britannica.com/place/Cincinnati',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'london-ontario',
    code: 'YXU',
    name: 'London',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['London, Ontario', 'London Ontario'],
    about:
      'London sits on the Thames River in southwestern Ontario as a mid-sized Canadian city of tree-lined avenues, university districts, and a fork of river parks. The Forks of the Thames organize the center; agricultural plain surrounds the metro. Cold snowy winters and humid summers define the Great Lakes climate. Orient from the river forks through downtown to campus and residential canopies. London’s primer is southwestern Ontario Thames city — river forks and tree streets in Canada’s agricultural southwest.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Thames River · southwestern Ontario',
      role: 'Southwestern Ontario regional city',
      knownFor: 'Forks of the Thames, tree-lined avenues, and university districts',
    },
    features: [
      {
        name: 'Forks of the Thames',
        description:
          'River confluence parks in the core.',
      },
      {
        name: 'Tree-lined avenues',
        description:
          'Canopied residential and civic streets.',
      },
      {
        name: 'University districts',
        description:
          'Campus neighborhoods west of downtown.',
      }
    ],
    sources: [
      {
        label: 'Britannica — London',
        url: 'https://www.britannica.com/place/London-Ontario',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'liverpool',
    code: 'LPL',
    name: 'Liverpool',
    kind: 'City',
    countrySlug: 'united-kingdom',
    subtitle: 'City · United Kingdom',
    matchNames: ['Liverpool'],
    about:
      'Liverpool faces the Mersey estuary in northwest England as a historic Atlantic port of waterfront warehouses, civic halls, and cultural docks reinvented as museums and arenas. The Pier Head and Albert Dock organize the classic waterfront; Victorian commercial streets rise inland. Soft Atlantic rain keeps the docks under frequent cloud. Stand on the waterfront so docks, river, and Wirral opposite read together. Liverpool’s primer is Mersey port city — Atlantic docks and civic waterfront of northwest England.',
    facts: {
      kind: 'City',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Mersey estuary · northwest England',
      role: 'Historic Atlantic port and cultural city',
      knownFor: 'Waterfront docks, Pier Head, and Mersey views',
    },
    features: [
      {
        name: 'Albert Dock',
        description:
          'Historic dock basins turned cultural quarter.',
      },
      {
        name: 'Pier Head',
        description:
          'Civic waterfront trio on the Mersey.',
      },
      {
        name: 'Mersey estuary',
        description:
          'Tidal river opening to the Irish Sea.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Liverpool',
        url: 'https://www.britannica.com/place/Liverpool-England',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'novi-sad',
    code: 'NVS',
    name: 'Novi Sad',
    kind: 'City',
    countrySlug: 'serbia',
    subtitle: 'City · Serbia',
    matchNames: ['Novi Sad'],
    about:
      'Novi Sad sits on the Danube in northern Serbia as a Vojvodina capital of fortress Petrovaradin, riverside promenades, and a compact Austro-Hungarian core. The fortress crowns the right bank opposite the city center; plains farmland surrounds the metro. Hot summers and cold winters mark the Pannonian climate. Cross between fortress hill and left-bank avenues along the Danube. Novi Sad’s primer is Danube fortress city — Petrovaradin and promenades in Serbia’s northern plain.',
    facts: {
      kind: 'City',
      country: 'Serbia',
      region: 'Europe',
      setting: 'Danube · Vojvodina',
      role: 'Vojvodina capital and Danube city',
      knownFor: 'Petrovaradin Fortress, Danube promenades, and historic core',
    },
    features: [
      {
        name: 'Petrovaradin Fortress',
        description:
          'Hill citadel opposite the city center.',
      },
      {
        name: 'Danube promenades',
        description:
          'River walks of the urban shore.',
      },
      {
        name: 'Historic core',
        description:
          'Austro-Hungarian streets of the left bank.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Novi Sad',
        url: 'https://www.britannica.com/place/Novi-Sad',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lviv',
    code: 'LWO',
    name: 'Lviv',
    kind: 'City',
    countrySlug: 'ukraine',
    subtitle: 'City · Ukraine',
    matchNames: ['Lviv', 'Lwów', 'Lemberg'],
    about:
      'Lviv occupies a hill-and-valley site in western Ukraine as a historic city of Renaissance and Baroque squares, coffeehouse streets, and a dense UNESCO old town. Market Square organizes the core; parks and theater avenues ring outward. Winters run cold and summers warm across this inland hill city. Walk the old-town squares so towers, courtyards, and hill approaches read together. Lviv’s primer is western Ukrainian historic city — layered Central European fabric on a hill-and-valley plan.',
    facts: {
      kind: 'City',
      country: 'Ukraine',
      region: 'Europe',
      setting: 'Western Ukraine · hill-and-valley city',
      role: 'Major western Ukrainian cultural city',
      knownFor: 'Market Square, historic towers, and Central European fabric',
    },
    features: [
      {
        name: 'Market Square',
        description:
          'Central plaza of the old town.',
      },
      {
        name: 'Historic towers',
        description:
          'Church and hall silhouettes of the core.',
      },
      {
        name: 'Hill approaches',
        description:
          'Green rises around the dense center.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Lviv',
        url: 'https://www.britannica.com/place/Lviv',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'gdansk',
    code: 'GDN',
    name: 'Gdańsk',
    kind: 'City',
    countrySlug: 'poland',
    subtitle: 'City · Poland',
    matchNames: ['Gdańsk', 'Gdansk', 'Danzig'],
    about:
      'Gdańsk stands on the Motława and Baltic approaches in northern Poland as a Hanseatic port city of rebuilt Gothic façades, crane waterfront, and shipyard heritage. The Main Town concentrates colorful gables; the coast and Westerplatte mark maritime edges. Baltic winters are cold; summers mild. Walk from the river crane through Long Market to the waterfront. Gdańsk’s primer is Baltic Hanseatic city — Motława gables and port memory on Poland’s northern shore.',
    facts: {
      kind: 'City',
      country: 'Poland',
      region: 'Europe',
      setting: 'Motława River · Baltic coast',
      role: 'Major Baltic port and historic city',
      knownFor: 'Main Town gables, riverside crane, and shipyard heritage',
    },
    features: [
      {
        name: 'Main Town',
        description:
          'Rebuilt Gothic and Renaissance streetscape.',
      },
      {
        name: 'Motława waterfront',
        description:
          'Crane and river warehouses.',
      },
      {
        name: 'Baltic approaches',
        description:
          'Coastal and harbor edges of the metro.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Gdańsk',
        url: 'https://www.britannica.com/place/Gdansk',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bergen',
    code: 'BGO',
    name: 'Bergen',
    kind: 'City',
    countrySlug: 'norway',
    subtitle: 'City · Norway',
    matchNames: ['Bergen'],
    about:
      'Bergen sits among seven mountains on Norway’s western fjord coast as a rainy harbor city of Bryggen wharf houses, fish market quays, and funicular views over islands. The Hanseatic waterfront anchors tourism and history; fjords cut inland. Mild wet winters and cool summers define the Atlantic climate. Stand on the harbor so Bryggen, mountains, and island approaches align. Bergen’s primer is western Norwegian fjord city — colorful wharf houses under mountain rain.',
    facts: {
      kind: 'City',
      country: 'Norway',
      region: 'Europe',
      setting: 'Western fjord coast · Norway',
      role: 'Western Norwegian harbor and fjord city',
      knownFor: 'Bryggen wharf, seven mountains, and fjord approaches',
    },
    features: [
      {
        name: 'Bryggen',
        description:
          'Historic wooden wharf row on the harbor.',
      },
      {
        name: 'Harbor quays',
        description:
          'Fish market and waterfront streets.',
      },
      {
        name: 'Mountain rim',
        description:
          'Seven peaks enclosing the city bowl.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Bergen',
        url: 'https://www.britannica.com/place/Bergen',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'adelaide',
    code: 'ADL',
    name: 'Adelaide',
    kind: 'City',
    countrySlug: 'australia',
    subtitle: 'City · Australia',
    matchNames: ['Adelaide'],
    about:
      'Adelaide occupies a grid between the Mount Lofty Ranges and Gulf St Vincent in South Australia as a planned capital of parkland belts, stone civic buildings, and nearby wine valleys. The Torrens river and park rings organize the center; beaches lie west. Mediterranean summers and mild winters shape the year. Read hills, parkland grid, and gulf shore as linked belts. Adelaide’s primer is South Australian parkland capital — planned grid between ranges and gulf.',
    facts: {
      kind: 'City',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Gulf St Vincent · Mount Lofty Ranges',
      role: 'South Australian capital city',
      knownFor: 'Parkland belts, planned grid, and nearby wine valleys',
    },
    features: [
      {
        name: 'Parkland belt',
        description:
          'Green ring around the city grid.',
      },
      {
        name: 'Mount Lofty approaches',
        description:
          'Hills east of the plains.',
      },
      {
        name: 'Gulf shore',
        description:
          'Beaches west toward St Vincent.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Adelaide',
        url: 'https://www.britannica.com/place/Adelaide-South-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'genoa',
    code: 'GEN',
    name: 'Genoa',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Genoa', 'Genova'],
    about:
      'Genoa climbs steeply from a Ligurian harbor as Italy’s historic maritime republic city of narrow caruggi, palaces, and a working port under the Apennine edge. The old port and aquarium mark the waterfront; hills hold layered neighborhoods. Mild winters and warm summers share the Mediterranean climate. Move from harbor quays into the dense alley core and hillside belvederes. Genoa’s primer is Ligurian port city — steep caruggi and maritime palaces above a working harbor.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Ligurian Sea · northwestern Italy',
      role: 'Major Italian port and historic maritime city',
      knownFor: 'Harbor, caruggi alleys, and hillside palaces',
    },
    features: [
      {
        name: 'Old port',
        description:
          'Historic harbor and waterfront edge.',
      },
      {
        name: 'Caruggi',
        description:
          'Narrow alley maze of the medieval core.',
      },
      {
        name: 'Hill belvederes',
        description:
          'Viewpoints above the dense city.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Genoa',
        url: 'https://www.britannica.com/place/Genoa-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'arkansas',
    code: 'AR',
    name: 'Arkansas',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Arkansas'],
    about:
      'Arkansas spans the south-central United States from Mississippi River lowlands to Ozark and Ouachita highlands as a state of rivers, forests, and diamond-country plateaus. Little Rock anchors the Arkansas River corridor; hot humid summers and mild winters shape much of the year. Read Delta lowlands, river capital, and highland forests as linked belts. Arkansas’s primer is river-and-highland state — Mississippi lowlands meeting Ozark and Ouachita uplands.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi Delta to Ozark–Ouachita highlands',
      role: 'South-central U.S. river and highland state',
      knownFor: 'Ozark forests, Arkansas River, and Mississippi lowlands',
    },
    features: [
      {
        name: 'Ozark highlands',
        description:
          'Forested plateaus of the north.',
      },
      {
        name: 'Arkansas River corridor',
        description:
          'Capital and transport spine.',
      },
      {
        name: 'Mississippi lowlands',
        description:
          'Eastern Delta farmland and wetlands.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Arkansas',
        url: 'https://www.britannica.com/place/Arkansas-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mississippi',
    code: 'MS',
    name: 'Mississippi',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Mississippi'],
    about:
      'Mississippi occupies the lower Mississippi River’s eastern bank as a Deep South state of Delta farmland, pine hills, and Gulf coastal fringe. The river forms the western border; Jackson sits inland on the Pearl. Hot humid summers and mild winters define the climate. Move from river Delta through central hills to the Gulf edge. Mississippi’s primer is lower-river Deep South state — Delta fields, pine hills, and a short Gulf shore.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Lower Mississippi River · Deep South',
      role: 'Deep South river and Delta state',
      knownFor: 'Mississippi Delta, pine hills, and Gulf fringe',
    },
    features: [
      {
        name: 'Mississippi Delta',
        description:
          'Alluvial farmland of the northwest.',
      },
      {
        name: 'Pine hills',
        description:
          'Central upland forests and towns.',
      },
      {
        name: 'Gulf fringe',
        description:
          'Southern coastal edge of the state.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mississippi',
        url: 'https://www.britannica.com/place/Mississippi-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'alabama',
    code: 'AL',
    name: 'Alabama',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Alabama'],
    about:
      'Alabama stretches from Appalachian foothills and Tennessee Valley north to the Gulf of Mexico as a southern state of river systems, pine forests, and coastal plain. Birmingham and Montgomery organize inland poles; Mobile anchors the bay. Hot humid summers and mild winters prevail. Read mountains north, river valleys, and Gulf coast as stacked belts. Alabama’s primer is Gulf South state — Appalachian edge to Mobile Bay through river and pine country.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Appalachian foothills to Gulf of Mexico',
      role: 'Southern U.S. Gulf and river state',
      knownFor: 'Tennessee Valley, pine forests, and Mobile Bay',
    },
    features: [
      {
        name: 'Tennessee Valley',
        description:
          'Northern river and foothill belt.',
      },
      {
        name: 'Pine forests',
        description:
          'Central timber and farming country.',
      },
      {
        name: 'Mobile Bay',
        description:
          'Gulf coastal harbor of the south.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Alabama',
        url: 'https://www.britannica.com/place/Alabama-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'muck',
    code: 'MCK',
    name: 'Muck',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Muck', 'Isle of Muck'],
    about:
      'Muck is a tiny Inner Hebridean island of low green pastures, white sand beaches, and open views to Rum and Eigg. A small farming community holds the shore; cliffs and coves alternate around the outline. Atlantic weather brings wind and frequent cloud. Land at Port Mòr and walk to beaches facing the larger neighbors. Muck’s primer is smallest inhabited Small Isle — green pastures and pale beaches between Rum and the Scottish sea.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · Small Isles',
      role: 'Tiny inhabited Hebridean farming island',
      knownFor: 'White sand beaches, green pastures, and Rum views',
    },
    features: [
      {
        name: 'Port Mòr',
        description:
          'Main landing and settlement shore.',
      },
      {
        name: 'Pale beaches',
        description:
          'White sand coves of the coast.',
      },
      {
        name: 'Neighbor views',
        description:
          'Rum and Eigg across short water.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Muck',
        url: 'https://www.britannica.com/place/Muck',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sikinos',
    code: 'SIK',
    name: 'Sikinos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Sikinos'],
    about:
      'Sikinos is a quiet Cycladic island of a double Chora on a ridge, sparse terraces, and steep drops to deep Aegean water with fewer crowds than famous neighbors. Kastro and Chorio form the hill towns; beaches occupy harder shores. Meltemi winds and rainless summers shape the ridge climate. Climb to the ridge Chora so terraces, cliffs, and open sea align. Sikinos’s primer is quiet Cyclades — a double ridge town above steep Aegean slopes.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · Aegean Sea',
      role: 'Quiet Cycladic ridge island',
      knownFor: 'Double Chora, steep terraces, and quiet shores',
    },
    features: [
      {
        name: 'Ridge Chora',
        description:
          'Kastro and Chorio on the hill.',
      },
      {
        name: 'Steep terraces',
        description:
          'Sparse farming shelves above the sea.',
      },
      {
        name: 'Quiet coves',
        description:
          'Less-crowded swimming shores.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Sikinos',
        url: 'https://www.britannica.com/place/Sikinos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kythnos',
    code: 'KYT',
    name: 'Kythnos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Kythnos', 'Thermia'],
    about:
      'Kythnos is a western Cycladic island of thermal springs, two Chora towns, and a deeply indented coastline of sheltered bays. Chora and Dryopida organize inland life; Loutra holds spa shores. Dry summers still leave more green than some peers. Move from harbor bays inland to ridge towns and thermal coasts. Kythnos’s primer is thermal Cyclades — spa shores and twin hill towns on a bay-cut western island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Western Cyclades · Aegean Sea',
      role: 'Thermal-spring Cycladic island',
      knownFor: 'Thermal springs, twin Chora towns, and indented bays',
    },
    features: [
      {
        name: 'Thermal shores',
        description:
          'Spa coasts around Loutra.',
      },
      {
        name: 'Twin hill towns',
        description:
          'Chora and Dryopida inland.',
      },
      {
        name: 'Indented bays',
        description:
          'Sheltered harbors of the west Cyclades.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kythnos',
        url: 'https://www.britannica.com/place/Kythnos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bute',
    code: 'BUT',
    name: 'Isle of Bute',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Bute', 'Bute'],
    about:
      'The Isle of Bute lies in the Firth of Clyde as a low green Scottish island of Victorian Rothesay, sheltered bays, and easy mainland ferry links. Soft hills and farmland fill the interior; seaside villas mark the Victorian resort era. Mild wet west-coast weather prevails. Land at Rothesay and circle coastal roads around the island. Bute’s primer is Clyde Victorian island — resort harbor and green hills a short ferry from the mainland.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Firth of Clyde · Scotland',
      role: 'Clyde resort and farming island',
      knownFor: 'Rothesay harbor, Victorian villas, and green hills',
    },
    features: [
      {
        name: 'Rothesay',
        description:
          'Victorian harbor town and ferry port.',
      },
      {
        name: 'Coastal bays',
        description:
          'Sheltered shores of the Clyde.',
      },
      {
        name: 'Green interior',
        description:
          'Soft hills and farmland of the isle.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Isle of Bute',
        url: 'https://www.britannica.com/place/Bute',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'coll',
    code: 'COLI',
    name: 'Coll',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Coll', 'Isle of Coll'],
    about:
      'Coll is a low Hebridean island of machair grasslands, white beaches, and wide Atlantic light west of Mull. Small crofting settlements hold the shore; dunes and turquoise shallows organize classic views. Wind and long summer daylight shape the season. Walk from Arinagour toward west-coast beaches and machair. Coll’s primer is Hebridean machair island — pale beaches and flower-rich grassland under Atlantic sky.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · west of Mull',
      role: 'Low Hebridean beach and machair island',
      knownFor: 'Machair, white beaches, and Atlantic light',
    },
    features: [
      {
        name: 'West-coast beaches',
        description:
          'Pale sand and turquoise shallows.',
      },
      {
        name: 'Machair grassland',
        description:
          'Flower-rich coastal plain.',
      },
      {
        name: 'Arinagour',
        description:
          'Main village and ferry landing.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Coll',
        url: 'https://www.britannica.com/place/Coll',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'spetses',
    code: 'SPE',
    name: 'Spetses',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Spetses'],
    about:
      'Spetses is an Argolic island near the Peloponnese of a car-light harbor town, pine-covered hills, and a naval history tied to the Greek War of Independence. Dapia waterfront organizes cafés and boats; coastal paths circle the isle. Mild Mediterranean seasons prevail. Land at the harbor and follow shore roads into pine hills. Spetses’s primer is Saronic–Argolic harbor island — pine hills and a historic waterfront near the Peloponnese.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Argolic Gulf · near Peloponnese',
      role: 'Historic harbor island near the mainland',
      knownFor: 'Dapia harbor, pine hills, and coastal paths',
    },
    features: [
      {
        name: 'Dapia waterfront',
        description:
          'Harbor cafés and boat approaches.',
      },
      {
        name: 'Pine hills',
        description:
          'Green interior of the small isle.',
      },
      {
        name: 'Coastal paths',
        description:
          'Shore walks circling the island.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Spetses',
        url: 'https://www.britannica.com/place/Spetsai',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'marche',
    code: 'MAR',
    name: 'Marche',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Marche', 'Le Marche'],
    about:
      'Marche occupies Italy’s eastern Adriatic side between Apennine ridges and a coast of hills stepping down to the sea. Urbino and other hill towns organize Renaissance heritage; beaches and ports mark the shore. Hot summers and cool highland winters share the climate. Read Apennine spine, hill towns, and Adriatic rim as linked belts. Marche’s primer is Adriatic hill region — Renaissance towns between mountains and a stair-step coast.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Apennines to Adriatic · central Italy',
      role: 'Central Italian Adriatic region',
      knownFor: 'Hill towns, Apennine ridges, and Adriatic coast',
    },
    features: [
      {
        name: 'Adriatic hill coast',
        description:
          'Beaches and ports below farmland slopes.',
      },
      {
        name: 'Renaissance hill towns',
        description:
          'Urbino and peer historic centers.',
      },
      {
        name: 'Apennine spine',
        description:
          'Mountain ridge inland of the coast.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Marche',
        url: 'https://www.britannica.com/place/Marche',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'friuli',
    code: 'FVG',
    name: 'Friuli',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Friuli', 'Friuli-Venezia Giulia', 'Friuli Venezia Giulia'],
    about:
      'Friuli (Friuli-Venezia Giulia) occupies Italy’s northeastern corner of Alpine foothills, alluvial plain, and Adriatic lagoons around Trieste and Udine. Wine hills and Habsburg-layered cities mark identity; borders meet Austria and Slovenia. Snow can linger in the foothills while the plain heats quickly inland. Move from Alpine edge through wine hills to lagoon and port. Friuli’s primer is northeastern border region — Alpine foothills, wine plain, and Adriatic lagoons in one outline.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Northeast Italy · Alps to Adriatic',
      role: 'Northeastern Italian autonomous region',
      knownFor: 'Wine hills, Trieste approaches, and Alpine foothills',
    },
    features: [
      {
        name: 'Alpine foothills',
        description:
          'Northern mountain edge of the region.',
      },
      {
        name: 'Wine hills',
        description:
          'Collio and peer vineyard belts.',
      },
      {
        name: 'Adriatic lagoons',
        description:
          'Coastal wetlands and port approaches.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Friuli',
        url: 'https://www.britannica.com/place/Friuli-Venezia-Giulia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aragon',
    code: 'ARA',
    name: 'Aragon',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Aragon', 'Aragón'],
    about:
      'Aragon spans northeastern Spain from High Pyrenees to the Ebro basin as a region of mountain parks, mudéjar towns, and Zaragoza on the river plain. Ski valleys and dry steppe share one outline; continental extremes mark the climate. Read Pyrenees, Ebro corridor, and southern ranges as stacked belts. Aragon’s primer is Pyrenees-to-Ebro region — high mountains above a dry river basin and historic Zaragoza.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Pyrenees to Ebro basin · northeastern Spain',
      role: 'Northeastern Spanish autonomous community',
      knownFor: 'Pyrenees, Ebro basin, and Zaragoza',
    },
    features: [
      {
        name: 'High Pyrenees',
        description:
          'Mountain parks of the northern edge.',
      },
      {
        name: 'Ebro basin',
        description:
          'River plain around Zaragoza.',
      },
      {
        name: 'Mudéjar towns',
        description:
          'Historic settlements of the interior.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Aragon',
        url: 'https://www.britannica.com/place/Aragon-region-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'murcia',
    code: 'MUR',
    name: 'Murcia',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Region of Murcia', 'Murcia region', 'Murcia'],
    about:
      'The Region of Murcia occupies southeastern Spain as a dry Mediterranean autonomous community of huerta irrigation, coastal Mar Menor lagoon, and inland sierras around the city of Murcia. Hot summers and scarce rain shape agriculture and tourism. Move from irrigated orchards to lagoon shore and mountain rims. Murcia’s primer is dry southeast Spain — huerta plain, salty lagoon, and sierras under intense Mediterranean sun.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Southeastern Spain · Mediterranean',
      role: 'Southeastern Spanish autonomous community',
      knownFor: 'Huerta irrigation, Mar Menor, and dry sierras',
    },
    features: [
      {
        name: 'Huerta plain',
        description:
          'Irrigated orchards around the capital.',
      },
      {
        name: 'Mar Menor',
        description:
          'Coastal salt lagoon of the east.',
      },
      {
        name: 'Inland sierras',
        description:
          'Dry mountain rims of the region.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Murcia',
        url: 'https://www.britannica.com/place/Murcia-region-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saxony',
    code: 'SAX',
    name: 'Saxony',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Saxony', 'Sachsen'],
    about:
      'Saxony occupies eastern Germany as a Free State of Dresden and Leipzig cultural poles, Elbe sandstone country, and Ore Mountain foothills. Baroque and industrial layers share the landscape; continental seasons bring cold winters. Read Elbe cities, sandstone cliffs, and mountain fringe as linked belts. Saxony’s primer is eastern German Free State — Elbe culture cities and sandstone country toward the Czech border.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Eastern Germany · Elbe and Ore Mountains',
      role: 'German Free State in the east',
      knownFor: 'Dresden, Leipzig, and Elbe Sandstone Mountains',
    },
    features: [
      {
        name: 'Elbe cities',
        description:
          'Dresden and peer cultural poles.',
      },
      {
        name: 'Sandstone country',
        description:
          'Cliff and gorge landscapes of the southeast.',
      },
      {
        name: 'Ore Mountain fringe',
        description:
          'Foothills along the southern border.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Saxony',
        url: 'https://www.britannica.com/place/Saxony',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kiyomizu-dera',
    code: 'KIY',
    name: 'Kiyomizu-dera',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Kiyomizu-dera', 'Kiyomizu Temple'],
    about:
      'Kiyomizu-dera clings to a Higashiyama hillside in Kyoto as a timber temple of a vast wooden stage overlooking maple slopes and city roofs. The main hall’s cantilevered platform organizes classic views; approach lanes climb through souvenir streets. Seasonal foliage frames the compound. Stand on the stage so hall, valley, and Kyoto basin align. Kiyomizu-dera’s primer is Kyoto hillside temple — wooden stage and valley views above Higashiyama.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Higashiyama · Kyoto',
      role: 'Historic hillside Buddhist temple',
      knownFor: 'Wooden stage, hillside views, and Higashiyama approach',
    },
    features: [
      {
        name: 'Wooden stage',
        description:
          'Cantilevered viewing platform of the main hall.',
      },
      {
        name: 'Hillside valley',
        description:
          'Maple slopes below the temple.',
      },
      {
        name: 'Approach lanes',
        description:
          'Steep streets climbing to the gate.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Kiyomizu-dera',
        url: 'https://www.britannica.com/topic/Kiyomizu-Temple',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'senso-ji',
    code: 'SEN',
    name: 'Sensō-ji',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Sensō-ji', 'Senso-ji', 'Sensoji', 'Asakusa Temple'],
    about:
      'Sensō-ji stands in Asakusa as Tokyo’s oldest temple complex of a great lantern gate, Nakamise shopping approach, and a main hall facing incense courtyards. The Kaminarimon lantern organizes arrival; the pagoda and hall complete the axis. Urban neighborhoods surround the shrine-temple precinct. Walk the Nakamise approach so gate, lane, and hall read as one procession. Sensō-ji’s primer is Asakusa temple axis — lantern gate and incense courtyard in downtown Tokyo.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Asakusa · Tokyo',
      role: 'Historic urban Buddhist temple',
      knownFor: 'Kaminarimon lantern, Nakamise approach, and main hall',
    },
    features: [
      {
        name: 'Kaminarimon',
        description:
          'Great lantern gate of the entrance.',
      },
      {
        name: 'Nakamise lane',
        description:
          'Shop-lined approach to the hall.',
      },
      {
        name: 'Main hall courtyard',
        description:
          'Incense and worship space of the complex.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Sensō-ji',
        url: 'https://www.britannica.com/topic/Senso-ji',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'golden-pavilion',
    code: 'GKP',
    name: 'Golden Pavilion',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Golden Pavilion', 'Kinkaku-ji', 'Kinkakuji'],
    about:
      'The Golden Pavilion (Kinkaku-ji) rises above a mirror pond in northern Kyoto as a gold-leafed Zen temple pavilion set in a stroll garden of pines and borrowed hills. Reflections organize the classic view; paths circle the pond. Seasonal mist and maple color change the scene. Stand at the pond edge so pavilion, reflection, and pines align. The Golden Pavilion’s primer is Kyoto mirror-pond temple — gold leaf and pine garden in a classic stroll composition.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Northern Kyoto · Japan',
      role: 'Zen temple pavilion and stroll garden',
      knownFor: 'Gold-leaf pavilion, mirror pond, and pine garden',
    },
    features: [
      {
        name: 'Gold pavilion',
        description:
          'Three-story gilt temple over the water.',
      },
      {
        name: 'Mirror pond',
        description:
          'Reflecting pool of the classic view.',
      },
      {
        name: 'Stroll garden',
        description:
          'Pine paths circling the water.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Golden Pavilion',
        url: 'https://www.britannica.com/topic/Kinkaku-ji',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'empire-state',
    code: 'ESB',
    name: 'Empire State Building',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Empire State Building', 'Empire State'],
    about:
      'The Empire State Building rises from Midtown Manhattan as an Art Deco skyscraper of a limestone shaft, mast spire, and observatory decks that long defined New York’s skyline. Street approaches emphasize vertical setbacks; night floodlighting colors the crown. Stand on nearby avenues or decks so shaft, spire, and Midtown grid read together. The Empire State’s primer is Midtown Art Deco tower — limestone setbacks and mast above Manhattan’s grid.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Midtown Manhattan · New York City',
      role: 'Iconic Art Deco skyscraper',
      knownFor: 'Art Deco shaft, mast spire, and observatory decks',
    },
    features: [
      {
        name: 'Limestone shaft',
        description:
          'Setback tower of the Midtown skyline.',
      },
      {
        name: 'Mast spire',
        description:
          'Antenna crown of the building.',
      },
      {
        name: 'Observatory decks',
        description:
          'Public viewpoints over Manhattan.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Empire State Building',
        url: 'https://www.britannica.com/topic/Empire-State-Building',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mezquita',
    code: 'MEZ',
    name: 'Mezquita',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Mezquita', 'Mosque-Cathedral of Córdoba', 'Mezquita-Catedral'],
    about:
      'The Mezquita of Córdoba is a vast hypostyle mosque-cathedral of repeating two-tone arches later capped by a Christian cathedral nave at the heart of the historic city. Forest-like columns organize the prayer hall; the patio of orange trees forms the outer court. Enter so arches, cathedral insertion, and patio sequence read together. The Mezquita’s primer is Córdoba hypostyle monument — Islamic arches and cathedral nave in one continuous sacred hall.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Historic center · Córdoba',
      role: 'Mosque-cathedral of hypostyle arches',
      knownFor: 'Two-tone arches, cathedral nave, and orange-tree patio',
    },
    features: [
      {
        name: 'Hypostyle hall',
        description:
          'Forest of two-tone horseshoe arches.',
      },
      {
        name: 'Cathedral nave',
        description:
          'Christian insertion at the mosque center.',
      },
      {
        name: 'Orange-tree patio',
        description:
          'Courtyard before the prayer hall.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Mezquita',
        url: 'https://www.britannica.com/topic/Mosque-Cathedral-of-Cordoba',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'alcazar-segovia',
    code: 'ASE',
    name: 'Alcázar of Segovia',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Alcázar of Segovia', 'Alcazar of Segovia', 'Segovia Alcázar'],
    about:
      'The Alcázar of Segovia crowns a rock prow where the Eresma and Clamores rivers meet as a fairy-tale Spanish fortress of slate-roof turrets above the old town and Roman aqueduct city. The ship-like plan and keep dominate approaches; interiors hold royal halls. Stand on the valley paths so prow, turrets, and Segovia roofs align. The Alcázar’s primer is Segovia rock-prow castle — slate turrets above the confluence of two rivers.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Rock confluence · Segovia',
      role: 'Royal fortress and castle museum',
      knownFor: 'Ship-like prow, slate turrets, and river confluence',
    },
    features: [
      {
        name: 'Rock prow',
        description:
          'Ship-shaped site above the rivers.',
      },
      {
        name: 'Slate turrets',
        description:
          'Fairy-tale roofs of the fortress.',
      },
      {
        name: 'Valley approaches',
        description:
          'Paths reading castle against old town.',
      }
    ],
    sources: [
      {
        label: 'Britannica — Alcázar of Segovia',
        url: 'https://www.britannica.com/topic/Alcazar-of-Segovia',
        kind: 'reference',
      },
    ],
  },
]
