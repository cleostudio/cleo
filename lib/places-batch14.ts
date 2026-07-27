/** Fourteenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch14: PlaceGuideDraftBatch[] = [
  {
    slug: 'charlotte',
    code: 'CLT',
    name: 'Charlotte',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Charlotte'],
    about:
      'Charlotte anchors the Carolina Piedmont as a banking and logistics metro of glass towers rising from rolling red-clay hills. Uptown’s skyline organizes the center; neighborhoods fan outward toward lakes and interstate belts. Humid subtropical seasons bring hot summers and mild winters. Start with the uptown core, then the surrounding Piedmont ridges rather than a waterfront axis. Charlotte’s primer is Piedmont banking city — a southern skyline hub where finance towers meet Carolina hill country.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Piedmont · North Carolina',
      role: 'Major Carolina metro and banking center',
      knownFor: 'Uptown skyline, Piedmont hills, and banking core',
    },
    features: [
      {
        name: 'Uptown skyline',
        description:
          'Glass towers of the central business district.',
      },
      {
        name: 'Piedmont hills',
        description:
          'Rolling ground surrounding the metro.',
      },
      {
        name: 'Neighborhood rings',
        description:
          'Residential belts spreading from the core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Charlotte',
        url: 'https://www.britannica.com/place/Charlotte-North-Carolina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'columbus',
    code: 'CMH',
    name: 'Columbus',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Columbus'],
    about:
      'Columbus sits near the Scioto and Olentangy rivers in central Ohio as the state capital and a growing Midwestern research metro. Downtown bridges and the Short North arts strip organize the urban core; Ohio State’s campus pulls the north side. Humid continental seasons swing from snowy winters to warm summers. Read the city from the river confluence and capitol grounds outward to campus and suburbs. Columbus’s primer is Scioto capital — a Midwestern government and university city on flat Ohio farmland.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Scioto–Olentangy · central Ohio',
      role: 'Ohio state capital and research metro',
      knownFor: 'Capitol grounds, river parks, and university campus',
    },
    features: [
      {
        name: 'River parks',
        description:
          'Scioto corridors through the downtown core.',
      },
      {
        name: 'Capitol grounds',
        description:
          'The statehouse complex at the civic center.',
      },
      {
        name: 'Campus north',
        description:
          'Ohio State and adjoining neighborhoods.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Columbus',
        url: 'https://www.britannica.com/place/Columbus-Ohio',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'memphis',
    code: 'MEM',
    name: 'Memphis',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Memphis'],
    about:
      'Memphis occupies the Mississippi River’s east bank in southwest Tennessee as a river, music, and logistics city of bluffs above the wide channel. Beale Street and the riverfront organize cultural memory; freight corridors still shape the economy. Hot humid summers and mild winters define the year. Place yourself on the bluff and river bend first, then the inland grid. Memphis’s primer is Mississippi bluff city — a southern river hub where music streets meet a continental waterway.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi River bluffs · southwest Tennessee',
      role: 'River, music, and logistics metro',
      knownFor: 'Mississippi bluffs, Beale Street, and riverfront',
    },
    features: [
      {
        name: 'Mississippi bluffs',
        description:
          'High banks overlooking the wide river.',
      },
      {
        name: 'Beale Street',
        description:
          'The historic music corridor downtown.',
      },
      {
        name: 'Riverfront',
        description:
          'Parks and landings along the channel.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Memphis',
        url: 'https://www.britannica.com/place/Memphis-Tennessee',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'halifax',
    code: 'YHZ',
    name: 'Halifax',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Halifax'],
    about:
      'Halifax faces one of the world’s great natural harbors on Nova Scotia’s Atlantic coast as the Maritime capital of naval history, citadel hill, and waterfront boardwalks. The harbor and Dartmouth opposite organize the metro; fog and cool summers shape outdoor life. Begin with the waterfront and Citadel, then the peninsular neighborhoods. Halifax’s primer is Atlantic harbor capital — a fog-prone Maritime city wrapped around a deep protected inlet.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Halifax Harbour · Nova Scotia',
      role: 'Nova Scotia capital and Atlantic port',
      knownFor: 'Natural harbor, Citadel Hill, and waterfront',
    },
    features: [
      {
        name: 'Harbour front',
        description:
          'Boardwalks and docks on the deep inlet.',
      },
      {
        name: 'Citadel Hill',
        description:
          'The fortified hill above downtown.',
      },
      {
        name: 'Peninsula neighborhoods',
        description:
          'Compact streets of the historic core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Halifax',
        url: 'https://www.britannica.com/place/Halifax-Nova-Scotia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'salta',
    code: 'SLA',
    name: 'Salta',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Salta'],
    about:
      'Salta occupies a highland valley in northwest Argentina as a colonial city of pink-stone churches, Andean light, and gateways toward Quebrada and cloud-forest routes. The plaza and cathedral organize the historic center; surrounding ridges frame dry-season skies. Mild highland seasons contrast with hotter lowlands farther east. Stay with the colonial plaza and valley walls before the mountain roads out. Salta’s primer is Andean valley city — pink colonial stone under northwest Argentine ridges.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Lerma Valley · northwest Argentina',
      role: 'Northwest colonial hub and tourism gateway',
      knownFor: 'Colonial plaza, pink stone churches, and valley ridges',
    },
    features: [
      {
        name: 'Colonial plaza',
        description:
          'Cathedral and historic blocks of the center.',
      },
      {
        name: 'Valley setting',
        description:
          'Highland basin enclosed by ridges.',
      },
      {
        name: 'Andean light',
        description:
          'Clear highland skies of the northwest.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Salta',
        url: 'https://www.britannica.com/place/Salta-Argentina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'valdivia',
    code: 'ZAL',
    name: 'Valdivia',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Valdivia'],
    about:
      'Valdivia sits at the meeting of rivers near Chile’s southern Pacific coast as a rainy university city of riverfront markets, German-settler heritage, and forested approaches. Calle-Calle and related channels braid through the urban fabric; cool wet winters define the climate. Trace the river junctions and market shores before the coastal and lake hinterlands. Valdivia’s primer is southern river city — a damp Chilean university town where channels and forests meet the Pacific edge.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'River confluence · Los Ríos Region',
      role: 'Southern university and river port city',
      knownFor: 'River channels, waterfront markets, and rainy climate',
    },
    features: [
      {
        name: 'River confluence',
        description:
          'Channels braiding through the city.',
      },
      {
        name: 'Waterfront markets',
        description:
          'Riverside stalls and promenades.',
      },
      {
        name: 'Forest approaches',
        description:
          'Green hinterlands of the southern coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Valdivia',
        url: 'https://www.britannica.com/place/Valdivia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fortaleza',
    code: 'FZZ',
    name: 'Fortaleza',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Fortaleza'],
    about:
      'Fortaleza faces the equatorial Atlantic in Ceará as a northeastern Brazilian metro of long urban beaches, trade winds, and a hot dry coastal climate. Iracema and Meireles organize the shore strip; dunes and lagoons appear farther along the coast. Orientation runs beachfront first, then inland neighborhoods under bright sun. Fortaleza’s primer is windy Atlantic beach city — a Ceará capital of urban sand, coconut light, and equatorial heat.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Atlantic coast · Ceará',
      role: 'Ceará capital and beach metro',
      knownFor: 'Urban beaches, trade winds, and equatorial coast',
    },
    features: [
      {
        name: 'Urban beaches',
        description:
          'Long shore strips of the city coastline.',
      },
      {
        name: 'Trade winds',
        description:
          'Steady coastal breezes of the northeast.',
      },
      {
        name: 'Bright coastal light',
        description:
          'Equatorial sun over sand and sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fortaleza',
        url: 'https://www.britannica.com/place/Fortaleza',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'dubrovnik',
    code: 'DBV',
    name: 'Dubrovnik',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Dubrovnik'],
    about:
      'Dubrovnik occupies a limestone Adriatic headland in southern Dalmatia as a walled city-republic heritage site of marble streets, harbor gates, and cliff-backed ramparts. The Old Town’s walls encircle a compact pedestrian core; islands and coves punctuate the offshore view. Hot dry summers and mild winters favor outdoor walking. Circling the walls and Stradun spine is the first map of the place. Dubrovnik’s primer is Adriatic walled city — limestone ramparts and marble lanes on a Dalmatian headland.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Adriatic headland · southern Dalmatia',
      role: 'Historic walled port and heritage city',
      knownFor: 'City walls, marble Stradun, and Adriatic cliffs',
    },
    features: [
      {
        name: 'City walls',
        description:
          'Continuous ramparts around the Old Town.',
      },
      {
        name: 'Stradun',
        description:
          'The main marble street of the core.',
      },
      {
        name: 'Harbor gates',
        description:
          'Sea approaches into the walled port.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dubrovnik',
        url: 'https://www.britannica.com/place/Dubrovnik',
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
    slug: 'tirana',
    code: 'TIA',
    name: 'Tirana',
    kind: 'City',
    countrySlug: 'albania',
    subtitle: 'City · Albania',
    matchNames: ['Tirana'],
    about:
      'Tirana fills a broad basin beneath Dajti Mountain as Albania’s colorful capital of Ottoman roots, socialist-era axes, and a lively contemporary street scene. Skanderbeg Square organizes the civic center; painted facades and cafés animate later neighborhoods. Mediterranean-influenced seasons bring warm summers. Use the square and mountain backdrop as the first landmarks, then the radiating avenues. Tirana’s primer is Balkan basin capital — a colorful political seat under a green mountain wall.',
    facts: {
      kind: 'City',
      country: 'Albania',
      region: 'Europe',
      setting: 'Tirana basin · Dajti Mountain',
      role: 'National capital and cultural hub',
      knownFor: 'Skanderbeg Square, painted facades, and mountain backdrop',
    },
    features: [
      {
        name: 'Skanderbeg Square',
        description:
          'The central civic plaza of the capital.',
      },
      {
        name: 'Painted facades',
        description:
          'Colorful streets of the contemporary city.',
      },
      {
        name: 'Dajti backdrop',
        description:
          'The mountain wall rising east of the basin.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tirana',
        url: 'https://www.britannica.com/place/Tirana',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lucknow',
    code: 'LKO',
    name: 'Lucknow',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Lucknow'],
    about:
      'Lucknow occupies the Gangetic plain in Uttar Pradesh as a historic Nawabi city of Imambaras, gardens, and refined urban culture east of the Gomti River corridors. Monumental gateways and bazaars organize older districts; later civil lines spread outward. Hot summers and a monsoon peak define the year. Begin with the Imambara ensemble and river approaches, then the surrounding plain city. Lucknow’s primer is Nawabi plain city — monumental Shi’a architecture and garden courts on the Ganges plain.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Gomti River · Gangetic plain',
      role: 'Uttar Pradesh capital and historic Nawabi city',
      knownFor: 'Imambaras, gateways, and Gangetic plain setting',
    },
    features: [
      {
        name: 'Imambara complex',
        description:
          'Monumental Nawabi halls and courtyards.',
      },
      {
        name: 'Historic gateways',
        description:
          'Ceremonial arches of the older city.',
      },
      {
        name: 'Gomti corridors',
        description:
          'River approaches through the urban fabric.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lucknow',
        url: 'https://www.britannica.com/place/Lucknow',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sendai',
    code: 'SDJ',
    name: 'Sendai',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Sendai'],
    about:
      'Sendai sits on Japan’s northeastern Pacific coast as the Tohoku region’s principal city, known for tree-lined avenues, a castle-hill remnant, and nearby coastal and mountain hinterlands. Zelkova-lined streets organize downtown; humid summers and snowy winters mark the seasons. Orient from the castle hill and green avenues toward the coastal plain. Sendai’s primer is Tohoku green city — a northeastern Japanese hub of leafy boulevards between mountains and Pacific approaches.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Pacific coastal plain · Tohoku',
      role: 'Principal city of the Tohoku region',
      knownFor: 'Tree-lined avenues, castle hill, and Pacific plain',
    },
    features: [
      {
        name: 'Tree-lined avenues',
        description:
          'Zelkova boulevards of the downtown grid.',
      },
      {
        name: 'Castle hill',
        description:
          'The historic elevated core remnant.',
      },
      {
        name: 'Coastal plain',
        description:
          'Pacific lowlands surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sendai',
        url: 'https://www.britannica.com/place/Sendai',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'namur',
    code: 'NAM',
    name: 'Namur',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Namur'],
    about:
      'Namur occupies the confluence of the Meuse and Sambre in Wallonia as Belgium’s regional capital of a massive citadel spur, river bends, and a compact historic center. The citadel rock dominates views; bridges stitch both rivers into one urban scene. Mild maritime seasons keep outdoor life active. Read the city from the citadel and confluence first. Namur’s primer is Meuse–Sambre citadel town — a Walloon capital where fortress rock meets twin river bends.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Meuse–Sambre confluence · Wallonia',
      role: 'Walloon capital and citadel city',
      knownFor: 'Citadel spur, river confluence, and historic center',
    },
    features: [
      {
        name: 'Citadel spur',
        description:
          'The fortified rock above the rivers.',
      },
      {
        name: 'River confluence',
        description:
          'Meuse and Sambre meeting in the city.',
      },
      {
        name: 'Historic center',
        description:
          'Compact streets below the citadel.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Namur',
        url: 'https://www.britannica.com/place/Namur-Belgium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'illinois',
    code: 'IL',
    name: 'Illinois',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Illinois'],
    about:
      'Illinois stretches from Lake Michigan and Chicago south across prairie farmland to the Ohio and Mississippi river junctions. The northern metro dominates population; central and southern counties hold agricultural plains and forested river hills. Humid continental seasons bring lake-effect weather near Chicago and hotter summers inland. Read the state as lake shore, prairie interior, and southern river bottoms. Illinois’s primer is prairie–Great Lakes state — Chicago’s lake edge and deep Midwestern farmland in one outline.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Michigan to Mississippi–Ohio junctions',
      role: 'Midwestern state of lake metro and prairie',
      knownFor: 'Lake Michigan shore, prairie farmland, and river borders',
    },
    features: [
      {
        name: 'Lake Michigan shore',
        description:
          'Chicago and northern lakefront counties.',
      },
      {
        name: 'Prairie interior',
        description:
          'Agricultural plains of the state center.',
      },
      {
        name: 'Southern rivers',
        description:
          'Mississippi and Ohio border lowlands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Illinois',
        url: 'https://www.britannica.com/place/Illinois-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'newfoundland-and-labrador',
    code: 'NL',
    name: 'Newfoundland and Labrador',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Province · Canada',
    matchNames: ['Newfoundland and Labrador', 'Newfoundland', 'Labrador'],
    about:
      'Newfoundland and Labrador combines a large Atlantic island of rocky coves and fishing outports with a vast mainland Labrador of subarctic forests and tundra approaches. St. John’s and Signal Hill organize the island’s eastern tip; icebergs and fog shape coastal seasons. Treat island coves and Labrador wilderness as two linked geographies under one province. The province’s primer is Atlantic island-and-mainland — granite shores, outports, and northern wilderness at Canada’s eastern edge.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Atlantic island · Labrador mainland',
      role: 'Easternmost Canadian province of island and north',
      knownFor: 'Rocky coves, Signal Hill, and Labrador wilderness',
    },
    features: [
      {
        name: 'Rocky coves',
        description:
          'Fishing outports of the island coast.',
      },
      {
        name: 'Signal Hill',
        description:
          'The historic headland above St. John’s.',
      },
      {
        name: 'Labrador north',
        description:
          'Subarctic forests and tundra approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Newfoundland and Labrador',
        url: 'https://www.britannica.com/place/Newfoundland-and-Labrador',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'west-bengal',
    code: 'WB',
    name: 'West Bengal',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['West Bengal'],
    about:
      'West Bengal runs from Himalayan foothills and Darjeeling ridges south across the Ganges–Brahmaputra delta to the Sundarbans mangrove coast. Kolkata anchors the lower plain; tea gardens and forested hills mark the north. Monsoon rains dominate the calendar. Read the state as hills, delta plain, and mangrove shore in sequence. West Bengal’s primer is Himalaya-to-delta state — tea ridges, riverine plains, and Sundarbans mangroves in one eastern Indian outline.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Himalayan foothills to Sundarbans delta',
      role: 'Eastern Indian state of hills, plain, and mangroves',
      knownFor: 'Darjeeling ridges, delta plain, and Sundarbans',
    },
    features: [
      {
        name: 'Himalayan foothills',
        description:
          'Tea ridges and hill stations of the north.',
      },
      {
        name: 'Delta plain',
        description:
          'Riverine lowlands around Kolkata.',
      },
      {
        name: 'Sundarbans coast',
        description:
          'Mangrove shores of the southern edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — West Bengal',
        url: 'https://www.britannica.com/place/West-Bengal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sifnos',
    code: 'SIF',
    name: 'Sifnos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Sifnos'],
    about:
      'Sifnos is a Cycladic island of pottery villages, whitewashed hill towns, and stepped paths between bays in the western Aegean. Apollonia and Kastro organize inland and cliff-edge settlement; dry terraces hold olive and herb slopes. Hot dry summers define the island year. Walk from harbor approaches up to ridge villages and chapel paths. Sifnos’s primer is pottery Cyclades — white hill towns and ceramic tradition on a compact Aegean island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Western Cyclades · Aegean Sea',
      role: 'Cycladic island of villages and craft tradition',
      knownFor: 'White hill towns, pottery, and terrace paths',
    },
    features: [
      {
        name: 'Hill towns',
        description:
          'Whitewashed settlements on inland ridges.',
      },
      {
        name: 'Kastro edge',
        description:
          'The cliff-top historic village.',
      },
      {
        name: 'Terrace paths',
        description:
          'Stepped routes between bays and chapels.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sifnos',
        url: 'https://www.britannica.com/place/Siphnos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'serifos',
    code: 'SRF',
    name: 'Serifos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Serifos'],
    about:
      'Serifos rises steeply from the western Cyclades as a rocky mining-heritage island of a dramatic hilltop Chora and deep blue bays. Cubist white houses stack above the harbor; barren ridges recall older ore workings. Dry summers and clear light define the season. Climb from the port to the Chora crown for the island’s signature view. Serifos’s primer is steep Cycladic Chora — a rocky Aegean island of stacked white houses above a deep harbor.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Western Cyclades · Aegean Sea',
      role: 'Rocky Cycladic island with hilltop Chora',
      knownFor: 'Hilltop Chora, steep ridges, and deep bays',
    },
    features: [
      {
        name: 'Hilltop Chora',
        description:
          'Stacked white houses above the harbor.',
      },
      {
        name: 'Steep ridges',
        description:
          'Rocky slopes of the mining-heritage interior.',
      },
      {
        name: 'Deep bays',
        description:
          'Clear Aegean inlets around the coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Serifos',
        url: 'https://www.britannica.com/place/Seriphos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'el-hierro',
    code: 'HIR',
    name: 'El Hierro',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['El Hierro'],
    about:
      'El Hierro is the westernmost Canary Island, a volcanic triangle of sea cliffs, laurel and pine forest patches, and a UNESCO biosphere reserve character. Miradors overlook sheer drops into the Atlantic; quiet villages occupy the milder slopes. Trade-wind climate keeps temperatures mild. Approach from cliff viewpoints and forest roads rather than a single beach strip. El Hierro’s primer is western Canary volcano — cliff edges, biosphere slopes, and Atlantic isolation at Spain’s southwestern tip.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Western Canary Islands · Atlantic',
      role: 'Volcanic biosphere island at the Canaries’ edge',
      knownFor: 'Sea cliffs, volcanic slopes, and biosphere landscapes',
    },
    features: [
      {
        name: 'Sea cliffs',
        description:
          'Sheer Atlantic drop-offs and miradors.',
      },
      {
        name: 'Volcanic slopes',
        description:
          'Lava terrain of the triangular island.',
      },
      {
        name: 'Forest patches',
        description:
          'Laurel and pine stands on milder ground.',
      },
    ],
    sources: [
      {
        label: 'Britannica — El Hierro',
        url: 'https://www.britannica.com/place/Hierro-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'jura',
    code: 'JUR',
    name: 'Isle of Jura',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Jura', 'Jura'],
    about:
      'The Isle of Jura lies off Scotland’s west coast as a sparsely peopled island of quartzite Paps, deer moor, and Atlantic weather beside neighboring Islay. The Paps of Jura dominate the skyline; a single main road threads the settled east. Wet windy conditions are the norm. View the island as mountain triad and empty moor rather than village density. Jura’s primer is Paps-and-moor island — three quartzite peaks above a wild Hebridean neighbor of Islay.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · west Scotland',
      role: 'Sparsely peopled Hebridean island',
      knownFor: 'Paps of Jura, deer moor, and Atlantic weather',
    },
    features: [
      {
        name: 'Paps of Jura',
        description:
          'The three quartzite peaks of the skyline.',
      },
      {
        name: 'Deer moor',
        description:
          'Open upland habitat across much of the island.',
      },
      {
        name: 'East-coast road',
        description:
          'The main settled corridor facing the sound.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Jura',
        url: 'https://www.britannica.com/place/Jura-island-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'marie-galante',
    code: 'MGL',
    name: 'Marie-Galante',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Marie-Galante', 'Marie Galante'],
    about:
      'Marie-Galante is a roundish French Caribbean island south of Guadeloupe, of limestone plateaus, sugarcane fields, and quieter beaches than the larger neighbors. Windmills and distillery heritage mark the rural landscape; trade winds cool the Atlantic edge. Tropical warmth prevails year-round. Circle the coastal road past cane fields and coves rather than climbing high peaks. Marie-Galante’s primer is cane-and-cove islet — a low French Antillean round of sugar heritage and quieter shores.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'South of Guadeloupe · Caribbean',
      role: 'French Caribbean island of cane and beaches',
      knownFor: 'Sugarcane fields, limestone plateau, and quiet coves',
    },
    features: [
      {
        name: 'Cane fields',
        description:
          'Sugar agriculture across the plateau.',
      },
      {
        name: 'Limestone plateau',
        description:
          'The low round island landform.',
      },
      {
        name: 'Quiet coves',
        description:
          'Less crowded beaches than larger neighbors.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Marie-Galante',
        url: 'https://www.britannica.com/place/Marie-Galante',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sint-eustatius',
    code: 'EUX',
    name: 'Sint Eustatius',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Sint Eustatius', 'Statia'],
    about:
      'Sint Eustatius (Statia) is a small Dutch Caribbean island dominated by the Quill, a dormant volcano whose crater forest rises above Oranjestad’s historic shore. Eighteenth-century trade ruins and diving reefs add layers; dry scrub covers lower slopes. Tropical warmth and trade winds prevail. Climb from Oranje Bay to the Quill rim for the island’s essential profile. Statia’s primer is Quill volcano islet — a compact Dutch Antillean cone above a historic trading shore.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Leeward Islands · Caribbean',
      role: 'Dutch Caribbean volcano island',
      knownFor: 'The Quill, Oranjestad shore, and historic ruins',
    },
    features: [
      {
        name: 'The Quill',
        description:
          'The dormant volcanic cone and crater forest.',
      },
      {
        name: 'Oranjestad shore',
        description:
          'The historic bayfront settlement.',
      },
      {
        name: 'Trade ruins',
        description:
          'Remnants of the island’s commercial past.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sint Eustatius',
        url: 'https://www.britannica.com/place/Sint-Eustatius',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'molise',
    code: 'MOL',
    name: 'Molise',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Molise'],
    about:
      'Molise is a small, sparsely toured Italian region between Abruzzo and Apulia, of Apennine hills, Adriatic fringe, and quiet hill towns. Sheep tracks and olive slopes still shape rural life; winters can be cold in the interior. Move from Adriatic edge inland to mountain villages rather than seeking a single metro. Molise’s primer is quiet Apennine region — hill towns and pastoral slopes in one of Italy’s least crowded outlines.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Southern-central Apennines · Adriatic fringe',
      role: 'Small Italian region of hills and quiet towns',
      knownFor: 'Apennine hills, hill towns, and pastoral landscape',
    },
    features: [
      {
        name: 'Apennine hills',
        description:
          'Interior ridges and mountain villages.',
      },
      {
        name: 'Adriatic fringe',
        description:
          'The short coastal edge of the region.',
      },
      {
        name: 'Pastoral slopes',
        description:
          'Sheep tracks and olive countryside.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Molise',
        url: 'https://www.britannica.com/place/Molise',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'vorarlberg',
    code: 'VOR',
    name: 'Vorarlberg',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Vorarlberg'],
    about:
      'Vorarlberg occupies Austria’s far west against Lake Constance and the Rhine valley, a compact Alpine state of Bregenzerwald villages, ski valleys, and contemporary timber architecture. The lake shore and mountain hinterland organize tourism; Alemannic dialect marks local culture. Alpine seasons bring snowy winters and green summers. Read lake edge, Rhine corridor, and mountain valleys as linked belts. Vorarlberg’s primer is western Alpine corner — Lake Constance light and timber-clad valleys at Austria’s Swiss–German door.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Lake Constance · western Alps',
      role: 'Westernmost Austrian Alpine state',
      knownFor: 'Lake Constance shore, Bregenzerwald, and Alpine valleys',
    },
    features: [
      {
        name: 'Lake Constance shore',
        description:
          'The northern waterfront edge of the state.',
      },
      {
        name: 'Bregenzerwald',
        description:
          'Villages and timber architecture inland.',
      },
      {
        name: 'Alpine valleys',
        description:
          'Ski and summer mountain corridors.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Vorarlberg',
        url: 'https://www.britannica.com/place/Vorarlberg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'margaret-river',
    code: 'MGR',
    name: 'Margaret River',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Margaret River'],
    about:
      'Margaret River is a Western Australian wine and surf region southwest of Perth, of karri and marri forest edges, cave country, and Indian Ocean beaches. Vineyards fill the coastal plain; surf breaks and limestone caves punctuate the shore. Mediterranean-leaning summers favor outdoor life. Drive the vineyard strip with ocean and forest as sidewalls. Margaret River’s primer is WA wine-and-surf coast — vines, caves, and Indian Ocean breaks in one southwestern Australian strip.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Southwest Western Australia · Indian Ocean',
      role: 'Wine, surf, and cave region of WA',
      knownFor: 'Vineyards, surf beaches, and limestone caves',
    },
    features: [
      {
        name: 'Vineyard strip',
        description:
          'Coastal-plain plantings and cellar doors.',
      },
      {
        name: 'Surf beaches',
        description:
          'Indian Ocean breaks along the shore.',
      },
      {
        name: 'Limestone caves',
        description:
          'Karst systems inland from the coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Margaret River',
        url: 'https://www.britannica.com/place/Margaret-River',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'asturias',
    code: 'AST',
    name: 'Asturias',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Asturias'],
    about:
      'Asturias occupies Spain’s green northern coast between the Bay of Biscay and the Picos de Europa, a region of cider country, fishing ports, and abrupt mountain walls. Rainy Atlantic weather greens the slopes; Oviedo and Gijón organize urban life. Move from coast to Picos rather than expecting dry Mediterranean light. Asturias’s primer is green Cantabrian coast — cider valleys and limestone peaks under Atlantic cloud.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Bay of Biscay · Picos de Europa',
      role: 'Northern Spanish coastal and mountain region',
      knownFor: 'Picos de Europa, cider country, and green coast',
    },
    features: [
      {
        name: 'Picos de Europa',
        description:
          'Limestone massifs rising inland from the sea.',
      },
      {
        name: 'Green coast',
        description:
          'Rainy Atlantic shores and fishing ports.',
      },
      {
        name: 'Cider country',
        description:
          'Orchard valleys of Asturian tradition.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Asturias',
        url: 'https://www.britannica.com/place/Asturias',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'banat',
    code: 'BAN',
    name: 'Banat',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Banat'],
    about:
      'The Banat in western Romania is a fertile plain and foothill region around Timișoara, historically a multi-ethnic borderland toward Serbia and Hungary. Broad farmland and Banat Mountains organize the landscape; Timișoara’s squares anchor urban culture. Continental seasons bring warm summers and cold winters. Read plain, foothills, and the Timișoara hub as the region’s map. Banat’s primer is western Romanian plain — fertile fields and a historic multi-ethnic city toward the Pannonian edge.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Western Romania · Pannonian edge',
      role: 'Fertile plain and foothill borderland',
      knownFor: 'Timișoara hub, fertile plain, and Banat foothills',
    },
    features: [
      {
        name: 'Fertile plain',
        description:
          'Agricultural lowlands of the west.',
      },
      {
        name: 'Timișoara hub',
        description:
          'The historic urban center of the region.',
      },
      {
        name: 'Banat foothills',
        description:
          'Rising ground toward the southern mountains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Banat',
        url: 'https://www.britannica.com/place/Banat',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'london-eye',
    code: 'LEY',
    name: 'London Eye',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['London Eye'],
    about:
      'The London Eye is a cantilevered observation wheel on the South Bank of the Thames opposite Westminster, offering revolving views across the capital’s river skyline. Capsules rise above County Hall and the Hungerford bridges; the Houses of Parliament form the classic facing view. The wheel is a modern riverside landmark rather than a historic monument. Read it from the South Bank so wheel, bridges, and Westminster align. The London Eye’s primer is Thames observation wheel — a revolving South Bank icon facing Parliament.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'South Bank · River Thames',
      role: 'Observation wheel and riverside icon',
      knownFor: 'Revolving capsules, South Bank setting, and Westminster views',
    },
    features: [
      {
        name: 'Observation wheel',
        description:
          'The cantilevered rim and passenger capsules.',
      },
      {
        name: 'South Bank',
        description:
          'The riverside promenade at the wheel’s base.',
      },
      {
        name: 'Westminster view',
        description:
          'Parliament and the Thames opposite.',
      },
    ],
    sources: [
      {
        label: 'Britannica — London Eye',
        url: 'https://www.britannica.com/topic/London-Eye',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sacre-coeur',
    code: 'SCR',
    name: 'Sacré-Cœur',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Sacré-Cœur', 'Sacre-Coeur', 'Sacré Coeur', 'Sacre Coeur'],
    about:
      'The Basilica of Sacré-Cœur crowns the hill of Montmartre in northern Paris as a white Romano-Byzantine church visible across much of the city. Domes and the terrace steps organize the approach; artists’ square and steep lanes fill the hill below. The landmark is a late nineteenth-century addition to the Paris skyline. Climb the butte so dome, steps, and city panorama read together. Sacré-Cœur’s primer is Montmartre white basilica — Romano-Byzantine domes on Paris’s northern hill.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Montmartre · Paris',
      role: 'Hilltop basilica and city viewpoint',
      knownFor: 'White domes, terrace steps, and Montmartre hill',
    },
    features: [
      {
        name: 'White domes',
        description:
          'The Romano-Byzantine crown of the basilica.',
      },
      {
        name: 'Terrace steps',
        description:
          'The stepped approach and city viewpoint.',
      },
      {
        name: 'Montmartre hill',
        description:
          'The butte rising above northern Paris.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sacré-Cœur',
        url: 'https://www.britannica.com/topic/Sacre-Coeur',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'devils-tower',
    code: 'DVT',
    name: 'Devils Tower',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Devils Tower', "Devil's Tower"],
    about:
      'Devils Tower is a fluted igneous rock tower rising abruptly from the plains of northeastern Wyoming, the first U.S. national monument and a landmark sacred in several Indigenous traditions. Columnar jointing gives the sides a ribbed appearance; ponderosa forest rings the base. Clear plains light and wide horizons define the setting. Approach across the surrounding grassland so the tower stands alone against sky. Devils Tower’s primer is plains igneous tower — fluted columns rising from Wyoming grassland.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Northeastern Wyoming · Great Plains edge',
      role: 'Igneous tower and national monument',
      knownFor: 'Fluted columns, plains setting, and abrupt rise',
    },
    features: [
      {
        name: 'Fluted columns',
        description:
          'Vertical jointing of the tower walls.',
      },
      {
        name: 'Plains setting',
        description:
          'Grassland horizons around the monument.',
      },
      {
        name: 'Forest ring',
        description:
          'Ponderosa stands at the tower’s base.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Devils Tower',
        url: 'https://www.britannica.com/place/Devils-Tower-National-Monument',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Devils Tower',
        url: 'https://www.nps.gov/deto/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'crater-lake',
    code: 'CRL',
    name: 'Crater Lake',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Crater Lake', 'Crater Lake National Park'],
    about:
      'Crater Lake fills the caldera of Mount Mazama in Oregon’s Cascade Range as one of the world’s deepest and clearest lakes, of intense blue water rimmed by steep volcanic walls. Wizard Island rises from the surface; rim drives organize classic viewpoints. Heavy winter snow shapes access seasons. Stand on the rim so blue water, caldera walls, and island read as one volcanic bowl. Crater Lake’s primer is Cascade caldera lake — deep blue water inside a collapsed Oregon volcano.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Cascade Range · southern Oregon',
      role: 'Caldera lake and national park centerpiece',
      knownFor: 'Deep blue water, caldera rim, and Wizard Island',
    },
    features: [
      {
        name: 'Caldera lake',
        description:
          'The deep blue water filling the volcanic bowl.',
      },
      {
        name: 'Rim walls',
        description:
          'Steep slopes encircling the lake.',
      },
      {
        name: 'Wizard Island',
        description:
          'The cinder cone rising from the water.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Crater Lake',
        url: 'https://www.britannica.com/place/Crater-Lake',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Crater Lake',
        url: 'https://www.nps.gov/crla/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'alcazar-seville',
    code: 'ACS',
    name: 'Alcázar of Seville',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Alcázar of Seville', 'Real Alcázar', 'Alcázar'],
    about:
      'The Real Alcázar of Seville is a royal palace complex of Mudéjar halls, tiled courtyards, and lush gardens in the heart of Seville. Islamic and Christian layers share the fabric; orange trees and reflecting pools organize outdoor rooms. Hot Andalusian summers shade the courtyards. Move from Patio de las Doncellas into the garden sequences for the full ensemble. The Alcázar’s primer is Sevillian Mudéjar palace — tiled courtyards and garden rooms of a living royal residence.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Historic center · Seville',
      role: 'Royal palace complex and UNESCO site',
      knownFor: 'Mudéjar halls, tiled courtyards, and palace gardens',
    },
    features: [
      {
        name: 'Mudéjar halls',
        description:
          'Tiled and carved palace interiors.',
      },
      {
        name: 'Courtyards',
        description:
          'Arcaded patios of the palace core.',
      },
      {
        name: 'Palace gardens',
        description:
          'Orange trees, pools, and outdoor rooms.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alcázar',
        url: 'https://www.britannica.com/topic/alcazar-Spanish-fortress',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cathedral, Alcázar and Archivo de Indias',
        url: 'https://whc.unesco.org/en/list/383/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'hohenzollern',
    code: 'HOZ',
    name: 'Hohenzollern Castle',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Hohenzollern Castle', 'Burg Hohenzollern', 'Hohenzollern'],
    about:
      'Hohenzollern Castle crowns a conical hill in Baden-Württemberg as a nineteenth-century romantic rebuild of the ancestral seat of the Hohenzollern dynasty. Towers and battlements rise above Swabian countryside; approaches wind through forested slopes. Clear days reveal long views across the plateau. Read the castle from the surrounding fields so the hilltop silhouette stands alone. Hohenzollern’s primer is Swabian hill castle — a romantic dynastic fortress on a lone conical summit.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Swabian Alb foothills · Baden-Württemberg',
      role: 'Hilltop dynastic castle and romantic landmark',
      knownFor: 'Conical hill, towers, and Swabian views',
    },
    features: [
      {
        name: 'Hilltop silhouette',
        description:
          'Towers and battlements on the conical summit.',
      },
      {
        name: 'Romantic rebuild',
        description:
          'Nineteenth-century dynastic architecture.',
      },
      {
        name: 'Swabian countryside',
        description:
          'Fields and forests surrounding the hill.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hohenzollern Dynasty',
        url: 'https://www.britannica.com/topic/Hohenzollern-dynasty',
        kind: 'reference',
      },
    ],
  },
]
