/** Twelfth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch12: PlaceGuideDraftBatch[] = [
  {
    slug: 'omaha',
    code: 'OMA',
    name: 'Omaha',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Omaha'],
    about:
      'Omaha sits on the Missouri River’s west bank in eastern Nebraska as a plains hub of insurance, stockyards history, and a growing riverfront skyline. Downtown and Midtown organize cultural districts; the river marks the Iowa border. Hot summers and cold winters define the year. Orientation is Missouri waterfront versus western suburban sprawl. Omaha’s primer is Missouri plains city — a mid-American river hub where prairie commerce still shapes the skyline.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Missouri River · eastern Nebraska',
      role: 'Nebraska’s largest city and plains commercial hub',
      knownFor: 'Missouri riverfront, downtown skyline, and plains setting',
    },
    features: [
      {
        name: 'Missouri riverfront',
        description:
          'The river edge facing Iowa across the channel.',
      },
      {
        name: 'Downtown core',
        description:
          'Towers and cultural districts of the urban center.',
      },
      {
        name: 'Plains setting',
        description:
          'Open Midwestern ground surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Omaha',
        url: 'https://www.britannica.com/place/Omaha-Nebraska',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'milwaukee',
    code: 'MKE',
    name: 'Milwaukee',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Milwaukee'],
    about:
      'Milwaukee occupies Lake Michigan’s western shore in Wisconsin as a Great Lakes industrial city of breweries, bridges, and a rebuilt lakefront. The Milwaukee River splits downtown; ethnic neighborhoods and parks structure daily life. Lake-effect winters shape the climate. Orientation is lakefront versus river valleys inland. Milwaukee’s primer is Lake Michigan city — a shoreline skyline and river town forged by Midwest industry and immigration.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Michigan · Milwaukee River',
      role: 'Wisconsin’s largest city and Great Lakes hub',
      knownFor: 'Lakefront, brewery heritage, and river downtown',
    },
    features: [
      {
        name: 'Lake Michigan shore',
        description:
          'Parks and museums along the open lake.',
      },
      {
        name: 'River downtown',
        description:
          'Bridges and districts along the Milwaukee River.',
      },
      {
        name: 'Industrial legacy',
        description:
          'Brewery and manufacturing layers in the urban fabric.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Milwaukee',
        url: 'https://www.britannica.com/place/Milwaukee',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tampa',
    code: 'TPA',
    name: 'Tampa',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Tampa'],
    about:
      'Tampa sits on Tampa Bay’s northeastern shore in Florida as a Gulf Coast metro of port channels, cigar-district history, and a modern downtown waterfront. Causeways link barrier islands and St. Petersburg across the bay. Hot, humid summers define the climate. Orientation is downtown bayfront versus Ybor City and coastal suburbs. Tampa’s primer is Gulf bay city — channels, causeways, and a skyline facing Florida’s largest open estuary.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Tampa Bay · Gulf Coast Florida',
      role: 'Major Florida Gulf metro and port city',
      knownFor: 'Bayfront skyline, port channels, and causeway links',
    },
    features: [
      {
        name: 'Bayfront downtown',
        description:
          'Towers and waterfront facing Tampa Bay.',
      },
      {
        name: 'Port channels',
        description:
          'Working water that built the city’s commerce.',
      },
      {
        name: 'Causeway network',
        description:
          'Bridges linking bay shores and barrier islands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tampa',
        url: 'https://www.britannica.com/place/Tampa-Florida',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'quebec-city',
    code: 'YQB',
    name: 'Quebec City',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Quebec City', 'Québec City', 'Ville de Québec'],
    about:
      'Quebec City crowns a cliff above the St. Lawrence as the only walled city remaining in North America north of Mexico, a Francophone capital of Upper Town ramparts and Lower Town river streets. Château Frontenac marks the skyline; winter festivals and summer terraces share the calendar. Orientation is cliff Upper Town versus Lower Town river edge. Quebec City’s primer is fortress river capital — stone walls and a château silhouette above the St. Lawrence narrowing.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'St. Lawrence cliff · Cap Diamant',
      role: 'Quebec provincial capital and historic fortress city',
      knownFor: 'Ramparts, Château Frontenac, and cliff Upper Town',
    },
    features: [
      {
        name: 'Ramparts',
        description:
          'Surviving fortification walls of the Upper Town.',
      },
      {
        name: 'Château Frontenac',
        description:
          'The château-hotel silhouette above the river.',
      },
      {
        name: 'Lower Town',
        description:
          'River-level streets beneath the cliff.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Quebec',
        url: 'https://www.britannica.com/place/Quebec-city',
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
    slug: 'mendoza',
    code: 'MDZ',
    name: 'Mendoza',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Mendoza'],
    about:
      'Mendoza sits at the foot of the Andes in western Argentina as a tree-lined oasis city of irrigation canals, wine estates, and mountain approaches. Plaza Independencia organizes the grid; vineyards begin at the urban edge. Dry air and sharp Andean light define the climate. Orientation is irrigated city grid versus Andean west. Mendoza’s primer is Andean wine oasis — canals and plane trees on desert ground beneath Argentina’s high western wall.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Andean foothills · irrigated oasis',
      role: 'Wine-region capital of western Argentina',
      knownFor: 'Tree-lined canals, vineyards, and Andes backdrop',
    },
    features: [
      {
        name: 'Irrigation canals',
        description:
          'Acequias watering the city’s plane-tree grid.',
      },
      {
        name: 'Wine edge',
        description:
          'Estate vineyards beginning at the metro fringe.',
      },
      {
        name: 'Andean wall',
        description:
          'High peaks framing western horizons.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mendoza',
        url: 'https://www.britannica.com/place/Mendoza-Argentina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cusco',
    code: 'CUZ',
    name: 'Cusco',
    kind: 'City',
    countrySlug: 'peru',
    subtitle: 'City · Peru',
    matchNames: ['Cusco', 'Cuzco'],
    about:
      'Cusco occupies a high Andean basin as the historic Inca capital and gateway to the Sacred Valley and Machu Picchu approaches. Inca stone walls underwrite colonial churches around the Plaza de Armas; altitude shapes every visit. Orientation is plaza core versus surrounding hills and valley exits. Cusco’s primer is highland Inca capital — polygonal stone and baroque towers on a thin-air plateau of enduring Andean centrality.',
    facts: {
      kind: 'City',
      country: 'Peru',
      region: 'Americas',
      setting: 'Andean highland basin',
      role: 'Historic Inca capital and Sacred Valley gateway',
      knownFor: 'Plaza de Armas, Inca stonework, and highland setting',
    },
    features: [
      {
        name: 'Plaza de Armas',
        description:
          'The colonial square over the Inca ceremonial core.',
      },
      {
        name: 'Inca masonry',
        description:
          'Polygonal stone walls beneath later buildings.',
      },
      {
        name: 'Valley gateways',
        description:
          'Routes toward the Sacred Valley and high passes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cuzco',
        url: 'https://www.britannica.com/place/Cuzco',
        kind: 'reference',
      },
      {
        label: 'UNESCO — City of Cuzco',
        url: 'https://whc.unesco.org/en/list/273/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'belo-horizonte',
    code: 'BHZ',
    name: 'Belo Horizonte',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Belo Horizonte'],
    about:
      'Belo Horizonte occupies a highland basin in Minas Gerais as a planned Brazilian capital of the 1890s, later overtaken by a dense modern metro of hills and towers. Pampulha’s modernism and surrounding mining country frame identity. Mild highland weather contrasts with coastal Brazil. Orientation is planned center versus surrounding serra ridges. Belo Horizonte’s primer is planned highland metropolis — a basin city of hills, modernist landmarks, and Minas Gerais centrality.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Minas Gerais highland basin',
      role: 'Major inland Brazilian metropolis',
      knownFor: 'Planned grid, Pampulha modernism, and highland hills',
    },
    features: [
      {
        name: 'Planned center',
        description:
          'The late-nineteenth-century capital grid.',
      },
      {
        name: 'Pampulha',
        description:
          'Modernist lake district of mid-century fame.',
      },
      {
        name: 'Serra ridges',
        description:
          'Hills enclosing the highland basin metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Belo Horizonte',
        url: 'https://www.britannica.com/place/Belo-Horizonte',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bratislava',
    code: 'BTS',
    name: 'Bratislava',
    kind: 'City',
    countrySlug: 'slovakia',
    subtitle: 'City · Slovakia',
    matchNames: ['Bratislava'],
    about:
      'Bratislava occupies the Danube near the Austrian and Hungarian borders as Slovakia’s compact capital of a hilltop castle, old-town lanes, and a modern riverfront. The castle ridge overlooks the river bend; Vienna lies a short train ride west. Continental seasons shape outdoor life. Orientation is castle hill versus Danube banks and Petržalka across the river. Bratislava’s primer is Danube border capital — a small capital where three nations’ approaches meet on the river.',
    facts: {
      kind: 'City',
      country: 'Slovakia',
      region: 'Europe',
      setting: 'Danube · Austria–Hungary border approaches',
      role: 'Slovak capital and Danube gateway',
      knownFor: 'Castle hill, old town, and Danube waterfront',
    },
    features: [
      {
        name: 'Castle hill',
        description:
          'The fortress ridge above the historic core.',
      },
      {
        name: 'Old town lanes',
        description:
          'Compact streets beneath the castle.',
      },
      {
        name: 'Danube bend',
        description:
          'River banks linking the capital to Central Europe.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bratislava',
        url: 'https://www.britannica.com/place/Bratislava',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ljubljana',
    code: 'LJU',
    name: 'Ljubljana',
    kind: 'City',
    countrySlug: 'slovenia',
    subtitle: 'City · Slovenia',
    matchNames: ['Ljubljana'],
    about:
      'Ljubljana sits on the Ljubljanica River beneath a castle hill as Slovenia’s green capital of bridges, Art Nouveau façades, and a walkable old core. Triple Bridge and riverside markets organize the center; Alpine approaches lie north. Orientation is castle hill versus river meanders. Ljubljana’s primer is Alpine-foot capital — a small, green river city between the Adriatic and the Julian Alps.',
    facts: {
      kind: 'City',
      country: 'Slovenia',
      region: 'Europe',
      setting: 'Ljubljanica River · Alpine approaches',
      role: 'Slovenian capital and central transit hub',
      knownFor: 'Castle hill, Triple Bridge, and riverside old town',
    },
    features: [
      {
        name: 'Castle hill',
        description:
          'The fortress overlooking the river city.',
      },
      {
        name: 'Ljubljanica quays',
        description:
          'Bridges and cafés along the central meander.',
      },
      {
        name: 'Green capital',
        description:
          'Parks and a compact walkable core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ljubljana',
        url: 'https://www.britannica.com/place/Ljubljana',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pune',
    code: 'PNQ',
    name: 'Pune',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Pune', 'Poona'],
    about:
      'Pune occupies the Deccan Plateau east of the Western Ghats as a major Maharashtrian city of education, IT campuses, and Peshwa-era heritage. The Mutha and Mula rivers meet in the urban core; monsoon rains green the plateau. Orientation is old city and cantonment versus western IT corridors. Pune’s primer is Deccan education city — highland Maharashtra’s cultural and tech hub beneath Ghats approaches.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Deccan Plateau · Western Ghats edge',
      role: 'Major Maharashtrian education and tech city',
      knownFor: 'Plateau setting, river confluence, and tech campuses',
    },
    features: [
      {
        name: 'River confluence',
        description:
          'Mula–Mutha waters through the urban core.',
      },
      {
        name: 'Old city layers',
        description:
          'Peshwa-era and cantonment districts of earlier growth.',
      },
      {
        name: 'Tech west',
        description:
          'Campus corridors expanding toward the Ghats.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pune',
        url: 'https://www.britannica.com/place/Pune',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nagasaki',
    code: 'NGS',
    name: 'Nagasaki',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Nagasaki'],
    about:
      'Nagasaki occupies a steep harbor on western Kyushu as a historic international port of Dutch and Chinese trading quarters, church towers, and a bay amphitheater of hills. Peace memorials mark twentieth-century tragedy; ferry routes still use the deep inlet. Orientation is harbor bowl versus hillside neighborhoods. Nagasaki’s primer is Kyushu harbor city — a steep bay port where Japan’s early modern openness left enduring street layers.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Western Kyushu harbor amphitheater',
      role: 'Historic international port city',
      knownFor: 'Harbor hills, trading-quarter heritage, and bay setting',
    },
    features: [
      {
        name: 'Harbor amphitheater',
        description:
          'Steep hills enclosing the deep inlet.',
      },
      {
        name: 'Trading quarters',
        description:
          'Historic international districts of the port era.',
      },
      {
        name: 'Hillside streets',
        description:
          'Neighborhoods climbing above the waterfront.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nagasaki',
        url: 'https://www.britannica.com/place/Nagasaki-Japan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bruges',
    code: 'BGE',
    name: 'Bruges',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Bruges', 'Brugge'],
    about:
      'Bruges is a Flemish canal city of medieval belfries, brick gables, and a ring of waterways that once made it a Hanseatic trading power. The Markt and Burg organize the center; swans and brick bridges define postcard views. Orientation is Markt belfry versus canal ring. Bruges’s primer is Flemish medieval city — intact brick streets and canals of a once-great cloth port.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Flanders · canal ring',
      role: 'Historic Flemish trading and tourism city',
      knownFor: 'Canals, belfry, and medieval brick core',
    },
    features: [
      {
        name: 'Canal ring',
        description:
          'Waterways encircling the historic core.',
      },
      {
        name: 'Markt belfry',
        description:
          'The tower organizing the main square.',
      },
      {
        name: 'Brick streets',
        description:
          'Gabled façades of the medieval fabric.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bruges',
        url: 'https://www.britannica.com/place/Bruges',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Brugge',
        url: 'https://whc.unesco.org/en/list/996/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'wisconsin',
    code: 'WI',
    name: 'Wisconsin',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Wisconsin'],
    about:
      'Wisconsin stretches between Lake Superior and Lake Michigan as a Great Lakes state of dairy farmland, Northwoods lakes, and Door County peninsulas. Madison and Milwaukee organize politics and industry; glacial hills and drumlins shape the south. Cold winters and lake effects define the climate. Orientation is Great Lakes shores versus interior dairy and forest belts. Wisconsin’s primer is lakes-and-dairy state — peninsula coasts and a glaciated interior of farms and Northwoods water.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Upper Midwest · Great Lakes',
      role: 'Great Lakes dairy and manufacturing state',
      knownFor: 'Door County, Northwoods lakes, and dairy farmland',
    },
    features: [
      {
        name: 'Great Lakes shores',
        description:
          'Superior and Michigan coasts framing the state.',
      },
      {
        name: 'Dairy interior',
        description:
          'Glaciated farmland of southern and central Wisconsin.',
      },
      {
        name: 'Northwoods',
        description:
          'Forest and lake country of the northern counties.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Wisconsin',
        url: 'https://www.britannica.com/place/Wisconsin-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nova-scotia',
    code: 'NS',
    name: 'Nova Scotia',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['Nova Scotia'],
    about:
      'Nova Scotia is a Maritime Canadian peninsula and island province of Atlantic coasts, foggy harbors, and highland remnants. Halifax anchors the capital harbor; Cape Breton’s Cabot Trail and Peggie’s Cove mark classic shores. Cool maritime weather shapes the year. Orientation is Atlantic peninsula versus Cape Breton island. Nova Scotia’s primer is Atlantic Maritime province — working harbors and rocky coasts on Canada’s eastern ocean edge.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Atlantic Maritimes · peninsula and Cape Breton',
      role: 'Maritime Canadian Atlantic province',
      knownFor: 'Halifax harbor, Cabot Trail, and rocky Atlantic shores',
    },
    features: [
      {
        name: 'Atlantic shores',
        description:
          'Rocky coasts and lighthouse approaches.',
      },
      {
        name: 'Halifax harbor',
        description:
          'The capital’s deep-water port on the peninsula.',
      },
      {
        name: 'Cape Breton',
        description:
          'Highland and coastal island of the northeast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nova Scotia',
        url: 'https://www.britannica.com/place/Nova-Scotia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'karnataka',
    code: 'KA',
    name: 'Karnataka',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Karnataka'],
    about:
      'Karnataka occupies southwestern India from the Arabian Sea coast across the Western Ghats to the Deccan Plateau, a state of temple towns, coffee hills, and Bengaluru’s tech metropolis. Hampi’s ruins and coastal Karnataka mark historic layers; monsoon rains green the Ghats. Orientation is coastal and Ghat west versus plateau interior. Karnataka’s primer is Deccan–Ghat state — temple stone, coffee ridges, and a highland IT capital on India’s southwest.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Southwest India · Ghats to Deccan',
      role: 'Major South Indian state around Bengaluru',
      knownFor: 'Western Ghats, temple towns, and Deccan plateau',
    },
    features: [
      {
        name: 'Western Ghats',
        description:
          'Coffee and rainforest ridges of the western edge.',
      },
      {
        name: 'Deccan interior',
        description:
          'Plateau cities including Bengaluru’s metro.',
      },
      {
        name: 'Temple towns',
        description:
          'Historic religious centers across the state.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Karnataka',
        url: 'https://www.britannica.com/place/Karnataka',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ithaki',
    code: 'ITH',
    name: 'Ithaca',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Ithaca', 'Ithaki'],
    about:
      'Ithaca (Ithaki) is a small Ionian island of steep olive hills and twin harbors, long associated with Homeric legend. Vathy occupies a deep inlet; quieter villages cling to western coves. Dry summers concentrate modest tourism. Orientation is Vathy harbor versus western coastal villages. Ithaca’s primer is legendary Ionian isle — compact olive ridges and sheltered inlets on Odysseus’s traditional homeland.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Ionian Islands · near Kefalonia',
      role: 'Small Ionian island of Homeric fame',
      knownFor: 'Vathy harbor, olive hills, and legendary associations',
    },
    features: [
      {
        name: 'Vathy inlet',
        description:
          'The deep main harbor of the island.',
      },
      {
        name: 'Olive ridges',
        description:
          'Steep cultivated hills covering much of the land.',
      },
      {
        name: 'Western coves',
        description:
          'Quieter villages on the open Ionian side.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ithaca',
        url: 'https://www.britannica.com/place/Ithaca-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'patmos',
    code: 'PTM',
    name: 'Patmos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Patmos'],
    about:
      'Patmos is a Dodecanese island of arid hills and a fortified monastery town, famous as the traditional setting of the Book of Revelation. Chora’s white houses cluster beneath the monastery; Skala serves as the harbor. Hot, bright summers define visits. Orientation is Chora monastery versus Skala port. Patmos’s primer is sacred Dodecanese isle — a hilltop monastic town above a quiet Aegean harbor.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Dodecanese · southeast Aegean',
      role: 'Pilgrimage and historic monastic island',
      knownFor: 'Monastery of Saint John, Chora, and Skala harbor',
    },
    features: [
      {
        name: 'Monastery fortress',
        description:
          'The fortified complex crowning Chora.',
      },
      {
        name: 'Chora',
        description:
          'White houses clustered beneath the monastery.',
      },
      {
        name: 'Skala harbor',
        description:
          'The main port on the island’s east.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pátmos',
        url: 'https://www.britannica.com/place/Patmos',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre (Chora) with the Monastery of Saint John',
        url: 'https://whc.unesco.org/en/list/942/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'la-palma',
    code: 'SPC',
    name: 'La Palma',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['La Palma'],
    about:
      'La Palma is a steep western Canary Island of laurel forests, volcanic ridges, and a vast central caldera. Recent lava flows mark the active geology; observatories crown the clear high ridges. Orientation is Caldera de Taburiente versus coastal ravines. La Palma’s primer is green volcano isle — mist forests and black lava on one of the Canaries’ steepest Atlantic profiles.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Western Canary Islands',
      role: 'Volcanic and laurel-forest Canary island',
      knownFor: 'Caldera de Taburiente, laurel forests, and lava landscapes',
    },
    features: [
      {
        name: 'Central caldera',
        description:
          'The great Taburiente depression of the island core.',
      },
      {
        name: 'Laurel ridges',
        description:
          'Cloud-forest slopes of the wetter highlands.',
      },
      {
        name: 'Volcanic coasts',
        description:
          'Lava fields and ravines reaching the Atlantic.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Palma, La',
        url: 'https://www.britannica.com/place/Palma-island-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mull',
    code: 'MUL',
    name: 'Isle of Mull',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Mull', 'Mull'],
    about:
      'The Isle of Mull is a large Hebridean island of basalt cliffs, sea eagles, and colorful Tobermory harbor off Scotland’s west coast. Ferry links from Oban open access; Iona lies just beyond. Mist and Atlantic weather define visits. Orientation is Tobermory north versus wilder western headlands. Mull’s primer is Hebridean wildlife isle — colorful harbor fronts and rugged coasts on a major Inner Hebrides landmass.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · west Scotland',
      role: 'Major Hebridean island and ferry hub',
      knownFor: 'Tobermory harbor, basalt coasts, and wildlife',
    },
    features: [
      {
        name: 'Tobermory',
        description:
          'The colorful harbor capital of the island.',
      },
      {
        name: 'Basalt coasts',
        description:
          'Cliff and cave shores of Atlantic Mull.',
      },
      {
        name: 'Iona approaches',
        description:
          'Short crossings to the neighboring sacred isle.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mull',
        url: 'https://www.britannica.com/place/Mull-island-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saba',
    code: 'SAB',
    name: 'Saba',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Saba'],
    about:
      'Saba is a tiny Dutch Caribbean peak-island of a single volcanic cone, steep roads, and village hamlets clinging to green slopes. Mount Scenery crowns the landmass; there are almost no beaches—diving and hiking define visits. Orientation is The Bottom and Windwardside versus the summit trail. Saba’s primer is peak isle — a near-circular volcanic cone under Dutch Caribbean administration.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Northern Leeward Islands · volcanic peak',
      role: 'Dutch Caribbean peak island',
      knownFor: 'Mount Scenery, steep villages, and diving',
    },
    features: [
      {
        name: 'Mount Scenery',
        description:
          'The summit cone dominating the entire island.',
      },
      {
        name: 'Cliff villages',
        description:
          'Hamlets perched on steep green slopes.',
      },
      {
        name: 'Dive walls',
        description:
          'Underwater drop-offs replacing beach tourism.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saba',
        url: 'https://www.britannica.com/place/Saba-island-Caribbean-Sea',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nevis',
    code: 'NEV',
    name: 'Nevis',
    kind: 'Island',
    countrySlug: 'saint-kitts-and-nevis',
    subtitle: 'Island · Saint Kitts and Nevis',
    matchNames: ['Nevis'],
    about:
      'Nevis is the smaller circular sister island of Saint Kitts and Nevis, a volcanic cone of rainforest slopes, plantation inns, and a narrow coastal road. Nevis Peak dominates every view; Charlestown anchors the modest capital. Orientation is Peak center versus coastal ring. Nevis’s primer is conical sister isle — a green volcano peak and quiet shores in the dual-island federation.',
    facts: {
      kind: 'Island',
      country: 'Saint Kitts and Nevis',
      region: 'Americas',
      setting: 'Leeward Islands · volcanic cone',
      role: 'Sister island of the dual-island federation',
      knownFor: 'Nevis Peak, coastal ring road, and plantation heritage',
    },
    features: [
      {
        name: 'Nevis Peak',
        description:
          'The central volcanic cone of the island.',
      },
      {
        name: 'Coastal ring',
        description:
          'The road and villages circling the peak.',
      },
      {
        name: 'Charlestown',
        description:
          'The small capital on the leeward shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nevis',
        url: 'https://www.britannica.com/place/Nevis-island-Saint-Kitts-and-Nevis',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'calabria',
    code: 'CLB',
    name: 'Calabria',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Calabria'],
    about:
      'Calabria forms the toe of Italy’s boot, a region of Aspromonte and Sila highlands between Tyrrhenian and Ionian coasts. Hill towns and long beaches share a rugged peninsula; ferry links point toward Sicily. Orientation is mountain spine versus dual seas. Calabria’s primer is peninsular toe — highland forests and two contrasting coasts at Italy’s southwestern tip.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Toe of Italy · dual coasts',
      role: 'Southern Italian peninsula region',
      knownFor: 'Aspromonte, Sila highlands, and dual-sea coasts',
    },
    features: [
      {
        name: 'Highland spine',
        description:
          'Sila and Aspromonte massifs of the interior.',
      },
      {
        name: 'Tyrrhenian west',
        description:
          'Western shores facing the open Tyrrhenian.',
      },
      {
        name: 'Ionian east',
        description:
          'Longer beaches along the Ionian side.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Calabria',
        url: 'https://www.britannica.com/place/Calabria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'salzkammergut',
    code: 'SZK',
    name: 'Salzkammergut',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Salzkammergut', 'Hallstatt'],
    about:
      'The Salzkammergut is an Austrian lake district of Alpine shores, salt-mining history, and postcard towns east of Salzburg. Hallstatt and Wolfgangsee concentrate visual fame; mountains drop steeply to clear lakes. Orientation is lake towns versus enclosing limestone peaks. Salzkammergut’s primer is Alpine lake country — salt heritage and steep-shore villages in Austria’s classic lake district.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Alpine lakes east of Salzburg',
      role: 'Historic salt and lake tourism region',
      knownFor: 'Hallstatt, Alpine lakes, and steep shore towns',
    },
    features: [
      {
        name: 'Alpine lakes',
        description:
          'Clear basins between limestone peaks.',
      },
      {
        name: 'Hallstatt shore',
        description:
          'The iconic lakeside village of postcard fame.',
      },
      {
        name: 'Salt heritage',
        description:
          'Historic mining that named the region.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Salzkammergut',
        url: 'https://www.britannica.com/place/Salzkammergut',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Hallstatt-Dachstein / Salzkammergut Cultural Landscape',
        url: 'https://whc.unesco.org/en/list/806/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'yarra-valley',
    code: 'YAR',
    name: 'Yarra Valley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Yarra Valley'],
    about:
      'The Yarra Valley is a wine and ranges region northeast of Melbourne, with vineyard estates along the Yarra River and forested hills toward the Great Dividing Range. Cool-climate wines and weekend cellar doors define tourism; mountain ash forests mark wetter slopes. Orientation is vineyard floor versus ranges east. Yarra Valley’s primer is Melbourne wine country — cellar-door hills a short drive from Victoria’s capital.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Victoria · northeast of Melbourne',
      role: 'Major cool-climate wine region',
      knownFor: 'Vineyards, Yarra River valley, and ranges backdrop',
    },
    features: [
      {
        name: 'Vineyard floor',
        description:
          'Estate rows along the Yarra River plain.',
      },
      {
        name: 'Ranges east',
        description:
          'Forested hills toward the Dividing Range.',
      },
      {
        name: 'Melbourne weekend belt',
        description:
          'A short drive corridor from the coastal capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Yarra River',
        url: 'https://www.britannica.com/place/Yarra-River',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'algarve',
    code: 'ALG',
    name: 'Algarve',
    kind: 'Region',
    countrySlug: 'portugal',
    subtitle: 'Region · Portugal',
    matchNames: ['Algarve'],
    about:
      'The Algarve is Portugal’s southern coast of limestone cliffs, sandy bays, and Atlantic-facing headlands. Lagos and Faro organize tourism; the inland hills stay quieter than the shore. Mild winters and hot summers shape the calendar. Orientation is cliffed west versus sandier east toward Spain. Algarve’s primer is southern Portuguese coast — golden cliffs and resort bays at Europe’s southwestern edge.',
    facts: {
      kind: 'Region',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Southern Portugal · Atlantic coast',
      role: 'Portugal’s principal coastal tourism region',
      knownFor: 'Limestone cliffs, sandy bays, and Atlantic headlands',
    },
    features: [
      {
        name: 'Cliffed west',
        description:
          'Golden limestone scarps and sea caves.',
      },
      {
        name: 'Sandy east',
        description:
          'Longer beaches toward the Spanish border.',
      },
      {
        name: 'Inland hills',
        description:
          'Quieter uplands behind the resort shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Algarve',
        url: 'https://www.britannica.com/place/Algarve',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bucovina',
    code: 'BCV',
    name: 'Bukovina',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Bukovina', 'Bucovina'],
    about:
      'Bukovina is a historic region of northeastern Romania (and adjoining Ukraine) known for painted monastery churches set in forested Carpathian foothills. Suceava organizes the Romanian side; frescoed exteriors of Voroneț and peers define cultural fame. Orientation is monastery valleys versus foothill towns. Bukovina’s primer is painted-monastery country — frescoed churches in green Carpathian approaches of northern Romania.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Carpathian foothills · northeastern Romania',
      role: 'Historic region of painted monasteries',
      knownFor: 'Painted monasteries, foothill forests, and Suceava',
    },
    features: [
      {
        name: 'Painted monasteries',
        description:
          'Exterior fresco churches of world heritage fame.',
      },
      {
        name: 'Foothill forests',
        description:
          'Green Carpathian approaches around the valleys.',
      },
      {
        name: 'Suceava basin',
        description:
          'The historic urban center of Romanian Bukovina.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bukovina',
        url: 'https://www.britannica.com/place/Bukovina',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Churches of Moldavia',
        url: 'https://whc.unesco.org/en/list/598/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'white-house',
    code: 'WHS',
    name: 'White House',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['White House'],
    about:
      'The White House occupies Pennsylvania Avenue in Washington, D.C., as the residence and workplace of the U.S. president, a neoclassical mansion behind a south lawn and north portico. The Ellipse and Lafayette Square frame public approaches; security layers shape the surrounding grounds. Orientation is north portico versus south lawn and Washington Monument axis. The White House’s primer is executive mansion — a white neoclassical landmark at the core of the capital’s ceremonial landscape.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Pennsylvania Avenue · Washington, D.C.',
      role: 'Presidential residence and executive workplace',
      knownFor: 'North portico, south lawn, and neoclassical façade',
    },
    features: [
      {
        name: 'North portico',
        description:
          'The columned public face toward Pennsylvania Avenue.',
      },
      {
        name: 'South lawn',
        description:
          'The ceremonial grounds facing the Monument axis.',
      },
      {
        name: 'Executive complex',
        description:
          'Wings and offices adjoining the residence.',
      },
    ],
    sources: [
      {
        label: 'Britannica — White House',
        url: 'https://www.britannica.com/topic/White-House-presidential-office-building-Washington-DC',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'arc-de-triomphe',
    code: 'ADT',
    name: 'Arc de Triomphe',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Arc de Triomphe'],
    about:
      'The Arc de Triomphe stands at the center of Place Charles de Gaulle in Paris as a neoclassical triumphal arch crowning the western end of the Champs-Élysées. Twelve avenues radiate from the Étoile; the Tomb of the Unknown Soldier lies beneath the vault. Orientation is arch versus radiating avenues and Champs-Élysées axis. The Arc’s primer is Parisian triumphal node — a monumental arch at the star-shaped junction of imperial boulevards.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Place Charles de Gaulle · Paris',
      role: 'Triumphal arch and national memorial',
      knownFor: 'Étoile avenues, Champs-Élysées axis, and vault memorial',
    },
    features: [
      {
        name: 'Triumphal vault',
        description:
          'The great arch and sculpted façades.',
      },
      {
        name: 'Étoile avenues',
        description:
          'Twelve radiating streets from the circular place.',
      },
      {
        name: 'Unknown Soldier',
        description:
          'The memorial flame beneath the arch.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Arc de Triomphe',
        url: 'https://www.britannica.com/topic/Arc-de-Triomphe',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tower-bridge',
    code: 'TBR',
    name: 'Tower Bridge',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Tower Bridge'],
    about:
      'Tower Bridge spans the Thames beside the Tower of London as a Victorian bascule-and-suspension bridge of twin towers and high-level walkways. Raising road spans once cleared tall ships; the silhouette now defines postcard London. Orientation is twin towers versus Tower of London and Pool of London reaches. Tower Bridge’s primer is Thames icon — bascule towers and blue spans at the capital’s historic dockside pinch.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Thames · Pool of London',
      role: 'Victorian bascule bridge and city icon',
      knownFor: 'Twin towers, bascule spans, and Thames setting',
    },
    features: [
      {
        name: 'Twin towers',
        description:
          'The Gothic towers carrying the high walkways.',
      },
      {
        name: 'Bascule spans',
        description:
          'The raising road decks of the central opening.',
      },
      {
        name: 'Pool of London',
        description:
          'The historic river reach beside the Tower.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tower Bridge',
        url: 'https://www.britannica.com/topic/Tower-Bridge',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'death-valley',
    code: 'DTH',
    name: 'Death Valley',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Death Valley', 'Death Valley National Park'],
    about:
      'Death Valley is a vast desert basin in eastern California, among North America’s hottest and lowest places, of salt flats, colorful badlands, and abrupt mountain walls. Badwater Basin and Zabriskie Point organize classic views; extreme heat shapes visiting seasons. Orientation is valley floor versus surrounding ranges. Death Valley’s primer is extreme desert basin — salt, badlands, and mountain walls in a below-sea-level trench of the Mojave edge.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Eastern California · Mojave edge',
      role: 'National park of extreme desert basin',
      knownFor: 'Badwater Basin, badlands, and extreme heat',
    },
    features: [
      {
        name: 'Badwater Basin',
        description:
          'The salt flat near the continent’s low point.',
      },
      {
        name: 'Badlands',
        description:
          'Eroded colorful hills of Zabriskie and peers.',
      },
      {
        name: 'Mountain walls',
        description:
          'Abrupt ranges enclosing the deep trench.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Death Valley',
        url: 'https://www.britannica.com/place/Death-Valley',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Death Valley',
        url: 'https://www.nps.gov/deva/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'duomo-milan',
    code: 'DUM',
    name: 'Milan Cathedral',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Milan Cathedral', 'Duomo di Milano', 'Duomo'],
    about:
      'Milan Cathedral (the Duomo) dominates Piazza del Duomo as a vast Gothic marble church of spires, statues, and a rooftop terrace above the city. Building spanned centuries; the Madonnina crowns the highest spire. Orientation is façade versus piazza and galleria approaches. The Duomo’s primer is Milanese Gothic — a forest of pinnacles in white marble at the heart of the Lombard capital.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Piazza del Duomo · Milan',
      role: 'Gothic cathedral and city icon',
      knownFor: 'Marble spires, Madonnina, and rooftop terraces',
    },
    features: [
      {
        name: 'Marble façade',
        description:
          'The sculpted west front on the piazza.',
      },
      {
        name: 'Spire forest',
        description:
          'Pinnacles and statues crowning the roof.',
      },
      {
        name: 'Rooftop terraces',
        description:
          'Walkways among the spires above the nave.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Milan Cathedral',
        url: 'https://www.britannica.com/place/Milan-Cathedral',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'westminster-abbey',
    code: 'WAB',
    name: 'Westminster Abbey',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Westminster Abbey'],
    about:
      'Westminster Abbey stands beside the Houses of Parliament as England’s great coronation church, a Gothic abbey of royal tombs, Poets’ Corner, and a landmark west front. Coronations and state funerals have long used the nave; the twin towers organize the Westminster skyline. Orientation is west front versus Parliament and the Thames. Westminster Abbey’s primer is coronation church — Gothic stone and royal memory at the political heart of London.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Westminster · London',
      role: 'Coronation church and royal burial church',
      knownFor: 'West front towers, nave, and Parliament setting',
    },
    features: [
      {
        name: 'West front',
        description:
          'The twin towers facing the Westminster approaches.',
      },
      {
        name: 'Gothic nave',
        description:
          'The long ceremonial interior of coronations.',
      },
      {
        name: 'Parliament neighbor',
        description:
          'The political ensemble beside the Thames.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Westminster Abbey',
        url: 'https://www.britannica.com/topic/Westminster-Abbey',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Palace of Westminster and Westminster Abbey',
        url: 'https://whc.unesco.org/en/list/426/',
        kind: 'authority',
      },
    ],
  },
]
