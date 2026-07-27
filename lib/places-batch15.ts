/** Fifteenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch15: PlaceGuideDraftBatch[] = [
  {
    slug: 'richmond',
    code: 'RIC',
    name: 'Richmond',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Richmond'],
    about:
      'Richmond occupies the fall line of the James River in Virginia as a historic capital of brick warehouses, river rapids, and a compact downtown rising from the water. Canal remnants and bridges organize the riverfront; neighborhoods climb the surrounding hills. Humid summers and mild winters define the year. Begin with the James fall line and capitol grounds, then the hill districts. Richmond’s primer is fall-line capital — a James River city where rapids, brick, and civic hills share one Mid-Atlantic basin.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'James River fall line · Virginia',
      role: 'Virginia state capital and river city',
      knownFor: 'James River, fall line, and historic downtown',
    },
    features: [
      {
        name: 'James River',
        description:
          'Rapids and bridges at the urban fall line.',
      },
      {
        name: 'Capitol grounds',
        description:
          'The civic hill of the state capital.',
      },
      {
        name: 'Hill neighborhoods',
        description:
          'Residential districts rising from the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Richmond',
        url: 'https://www.britannica.com/place/Richmond-Virginia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'birmingham-us',
    code: 'BHM',
    name: 'Birmingham',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Birmingham'],
    about:
      'Birmingham sits in a valley of the southern Appalachian foothills in Alabama as a steel-era city of ridges, railroad corridors, and a revitalized downtown core. Red Mountain and neighboring heights frame the metro; humid subtropical weather shapes outdoor life. Place yourself in the valley floor and ridge rims rather than a single waterfront. Birmingham’s primer is foothill steel city — a southern valley metro where ridges and rail still organize the skyline.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Appalachian foothills · Alabama',
      role: 'Major Alabama metro and historic industrial city',
      knownFor: 'Valley setting, ridges, and downtown core',
    },
    features: [
      {
        name: 'Valley floor',
        description:
          'The urban basin between surrounding ridges.',
      },
      {
        name: 'Red Mountain',
        description:
          'The ridge framing the southern skyline.',
      },
      {
        name: 'Downtown core',
        description:
          'Towers and civic blocks of the center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Birmingham',
        url: 'https://www.britannica.com/place/Birmingham-Alabama',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'boise',
    code: 'BOI',
    name: 'Boise',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Boise'],
    about:
      'Boise occupies the Boise River valley against foothills of Idaho’s Intermountain West as a capital city of tree-lined streets, river greenbelt, and nearby high desert. Downtown sits near the river; foothill trails rise quickly into open slopes. Four-season inland weather brings cold winters and warm dry summers. Follow the river greenbelt and foothill edge as the first map. Boise’s primer is river-and-foothill capital — an Idaho seat where greenbelt shade meets high-desert ridges.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Boise River · Idaho foothills',
      role: 'Idaho state capital and Intermountain metro',
      knownFor: 'River greenbelt, foothills, and downtown trees',
    },
    features: [
      {
        name: 'River greenbelt',
        description:
          'Parks and paths along the Boise River.',
      },
      {
        name: 'Foothill edge',
        description:
          'Slopes rising immediately above the city.',
      },
      {
        name: 'Tree-lined core',
        description:
          'Shaded streets of the urban center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Boise',
        url: 'https://www.britannica.com/place/Boise',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'victoria-bc',
    code: 'YYJ',
    name: 'Victoria',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Victoria'],
    about:
      'Victoria occupies the southern tip of Vancouver Island as British Columbia’s capital, a harbor city of Inner Harbour ferries, Victorian stone, and mild Pacific air. The Empress and legislature face the water; gardens and neighborhoods spread inland under frequent soft rain. Mild winters and cool summers set it apart from interior Canada. Start at the Inner Harbour, then the peninsula neighborhoods. Victoria’s primer is island capital harbor — a mild Pacific seat of stone, gardens, and ferry approaches.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Southern Vancouver Island · Pacific',
      role: 'British Columbia capital and harbor city',
      knownFor: 'Inner Harbour, legislature, and mild Pacific climate',
    },
    features: [
      {
        name: 'Inner Harbour',
        description:
          'Ferry docks and waterfront civic facades.',
      },
      {
        name: 'Legislature grounds',
        description:
          'The provincial buildings facing the harbor.',
      },
      {
        name: 'Garden city',
        description:
          'Parks and planted neighborhoods inland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Victoria',
        url: 'https://www.britannica.com/place/Victoria-British-Columbia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bariloche',
    code: 'BRC',
    name: 'Bariloche',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Bariloche', 'San Carlos de Bariloche'],
    about:
      'San Carlos de Bariloche sits on the shore of Nahuel Huapi in Argentina’s northern Patagonian Andes as a lake-and-mountain gateway town of Swiss-influenced architecture and forested slopes. The civic center faces the lake; ski and trekking routes climb the surrounding ridges. Cool summers and snowy winters define the Andean year. Read lake shore, town center, and mountain wall as one composition. Bariloche’s primer is Patagonian lake town — alpine-looking streets on a deep Andean freshwater shore.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Nahuel Huapi · northern Patagonian Andes',
      role: 'Lake-and-mountain tourism hub',
      knownFor: 'Nahuel Huapi shore, Andean slopes, and alpine townscape',
    },
    features: [
      {
        name: 'Lake shore',
        description:
          'Nahuel Huapi waterfront of the town.',
      },
      {
        name: 'Andean slopes',
        description:
          'Forested ridges rising behind the shore.',
      },
      {
        name: 'Civic center',
        description:
          'Stone and timber streets facing the water.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bariloche',
        url: 'https://www.britannica.com/place/San-Carlos-de-Bariloche',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'iquique',
    code: 'IQQ',
    name: 'Iquique',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Iquique'],
    about:
      'Iquique faces the Pacific at the edge of Chile’s Atacama Desert as a port city of coastal bluffs, dry air, and a historic nitrate-era downtown. The ocean and barren hills meet abruptly; beaches and boardwalks occupy the narrow coastal strip. Virtually rainless conditions define the climate. Orient along the shore with desert walls inland. Iquique’s primer is Atacama port — a Pacific city pressed between foggy coast and hyper-arid hills.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Pacific coast · Atacama edge',
      role: 'Northern Chilean port and desert-coast city',
      knownFor: 'Coastal bluffs, arid setting, and Pacific shore',
    },
    features: [
      {
        name: 'Pacific shore',
        description:
          'Beaches and boardwalks on the narrow coast.',
      },
      {
        name: 'Coastal bluffs',
        description:
          'Abrupt rises from sea to desert terrace.',
      },
      {
        name: 'Arid hinterland',
        description:
          'Hyper-dry hills of the Atacama edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Iquique',
        url: 'https://www.britannica.com/place/Iquique',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'manaus',
    code: 'MAO',
    name: 'Manaus',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Manaus'],
    about:
      'Manaus occupies the meeting of the Negro and Solimões rivers deep in the Amazon Basin as Brazil’s great inland rainforest metropolis. The Teatro Amazonas and river ports organize cultural and commercial life; humid heat and heavy rains dominate the year. The city is an island of urban fabric inside continuous forest and water. Begin with the river confluence and historic center, then the forest edge. Manaus’s primer is Amazon river metropolis — an inland port where opera-house stone meets blackwater and rainforest.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Negro–Solimões confluence · Amazon Basin',
      role: 'Amazonas capital and rainforest river hub',
      knownFor: 'River confluence, Teatro Amazonas, and rainforest setting',
    },
    features: [
      {
        name: 'River confluence',
        description:
          'Meeting of Negro and Solimões channels.',
      },
      {
        name: 'Teatro Amazonas',
        description:
          'The iconic opera house of the historic core.',
      },
      {
        name: 'Rainforest edge',
        description:
          'Continuous forest surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Manaus',
        url: 'https://www.britannica.com/place/Manaus',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'split',
    code: 'SPU',
    name: 'Split',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Split'],
    about:
      'Split grows from the Roman palace of Diocletian on Croatia’s Dalmatian coast as a living city inside ancient walls, with a Riva promenade facing the Adriatic and islands offshore. Limestone streets and harbor ferries organize daily movement; hot dry summers favor outdoor life. Walk from palace courtyards to the waterfront for the essential map. Split’s primer is palace-city on the Adriatic — Roman walls still framing a working Dalmatian port.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Dalmatian coast · Adriatic Sea',
      role: 'Major Dalmatian port and historic city',
      knownFor: 'Diocletian’s Palace, Riva promenade, and Adriatic islands',
    },
    features: [
      {
        name: 'Diocletian’s Palace',
        description:
          'The Roman core still inhabited as city fabric.',
      },
      {
        name: 'Riva promenade',
        description:
          'The waterfront walk facing the harbor.',
      },
      {
        name: 'Island approaches',
        description:
          'Ferry routes to nearby Adriatic islands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Split',
        url: 'https://www.britannica.com/place/Split-Croatia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historical Complex of Split',
        url: 'https://whc.unesco.org/en/list/97/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'skopje',
    code: 'SKP',
    name: 'Skopje',
    kind: 'City',
    countrySlug: 'north-macedonia',
    subtitle: 'City · North Macedonia',
    matchNames: ['Skopje'],
    about:
      'Skopje fills the Vardar River valley beneath surrounding hills as North Macedonia’s capital, pairing an Ottoman bazaar quarter with later civic axes and a fortress spur. The Stone Bridge links old and new banks; continental seasons bring hot summers and cold winters. Use the fortress, bazaar, and river as the first triangulation. Skopje’s primer is Vardar valley capital — fortress, bazaar, and bridges in a Balkan river basin.',
    facts: {
      kind: 'City',
      country: 'North Macedonia',
      region: 'Europe',
      setting: 'Vardar River valley · central North Macedonia',
      role: 'National capital and historic crossroads city',
      knownFor: 'Fortress spur, Old Bazaar, and Vardar bridges',
    },
    features: [
      {
        name: 'Fortress spur',
        description:
          'The elevated Kale above the city.',
      },
      {
        name: 'Old Bazaar',
        description:
          'Ottoman lanes and craft streets.',
      },
      {
        name: 'Vardar River',
        description:
          'The channel dividing and linking the banks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Skopje',
        url: 'https://www.britannica.com/place/Skopje',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'varanasi',
    code: 'VNS',
    name: 'Varanasi',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Varanasi', 'Banaras', 'Benares'],
    about:
      'Varanasi rises in terraces of stone ghats along the Ganges in Uttar Pradesh as one of Hinduism’s most sacred cities, a continuous waterfront of temples, steps, and ritual life. The old city packs lanes behind the river edge; boats read the skyline from the water. Heat builds through the dry months before monsoon rains arrive. Orient from the ghat arc first, then the inland labyrinth. Varanasi’s primer is Ganges ghat city — sacred steps and temple towers on a great river bend.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Ganges River · Uttar Pradesh',
      role: 'Sacred river city and pilgrimage center',
      knownFor: 'Ghats, temples, and Ganges waterfront',
    },
    features: [
      {
        name: 'River ghats',
        description:
          'Stone steps descending to the Ganges.',
      },
      {
        name: 'Temple skyline',
        description:
          'Towers rising along the waterfront arc.',
      },
      {
        name: 'Old city lanes',
        description:
          'Dense streets behind the ghat edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Varanasi',
        url: 'https://www.britannica.com/place/Varanasi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'matsuyama',
    code: 'MYJ',
    name: 'Matsuyama',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Matsuyama'],
    about:
      'Matsuyama anchors northwestern Shikoku as a castle-and-spa city of a hilltop feudal keep, tram lines, and nearby Dōgo Onsen. The castle park overlooks the urban plain; the Inland Sea lies beyond coastal approaches. Mild winters and humid summers mark the Seto climate. Climb from downtown to the castle hill, then the historic spa quarter. Matsuyama’s primer is Shikoku castle city — a keep above tram streets and one of Japan’s oldest hot-spring towns.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Northwestern Shikoku · Seto Inland Sea approaches',
      role: 'Ehime capital and castle-spa city',
      knownFor: 'Hilltop castle, Dōgo Onsen, and tram streets',
    },
    features: [
      {
        name: 'Castle hill',
        description:
          'The feudal keep and park above the city.',
      },
      {
        name: 'Dōgo Onsen',
        description:
          'The historic hot-spring quarter.',
      },
      {
        name: 'Tram streets',
        description:
          'Streetcar lines through the urban plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Matsuyama',
        url: 'https://www.britannica.com/place/Matsuyama',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'liege',
    code: 'LGG',
    name: 'Liège',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Liège', 'Liege'],
    about:
      'Liège occupies a Meuse River bend in eastern Wallonia as a historic prince-bishopric city of steep hills, industrial valleys, and a revived riverfront. The citadel spur and Outremeuse island organize older geography; mild maritime seasons keep outdoor life active. Read river bend, hills, and island quarters together. Liège’s primer is Meuse hill city — a Walloon river seat of steep streets and long industrial memory.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Meuse River · eastern Wallonia',
      role: 'Major Walloon city and historic river hub',
      knownFor: 'Meuse bend, citadel hills, and Outremeuse',
    },
    features: [
      {
        name: 'Meuse bend',
        description:
          'The river curve through the urban core.',
      },
      {
        name: 'Citadel hills',
        description:
          'Steep slopes above the valley floor.',
      },
      {
        name: 'Outremeuse',
        description:
          'The island quarter in the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Liège',
        url: 'https://www.britannica.com/place/Liege',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pennsylvania',
    code: 'PA',
    name: 'Pennsylvania',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Pennsylvania'],
    about:
      'Pennsylvania stretches from Lake Erie and the Allegheny Plateau across Appalachian ridges to the Delaware River and Philadelphia’s coastal plain. Forests, coal valleys, and farmland stripe the interior; two major metros bookend east and west. Four-season humid climate prevails. Read the state as lake fringe, mountains, and coastal plain rather than one landscape. Pennsylvania’s primer is Appalachian crossroads state — ridges, rivers, and twin metro anchors between Midwest and Atlantic.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Erie to Delaware River',
      role: 'Mid-Atlantic state of mountains and metro anchors',
      knownFor: 'Appalachian ridges, forests, and dual metro ends',
    },
    features: [
      {
        name: 'Appalachian ridges',
        description:
          'Folded mountains of the state interior.',
      },
      {
        name: 'River valleys',
        description:
          'Susquehanna, Delaware, and Ohio drainages.',
      },
      {
        name: 'Metro anchors',
        description:
          'Philadelphia east and Pittsburgh west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pennsylvania',
        url: 'https://www.britannica.com/place/Pennsylvania-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'prince-edward-island',
    code: 'PE',
    name: 'Prince Edward Island',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Province · Canada',
    matchNames: ['Prince Edward Island', 'PEI'],
    about:
      'Prince Edward Island is Canada’s smallest province, a crescent of red sandstone shores, dunes, and farm fields in the Gulf of St. Lawrence. Charlottetown anchors civic life; beaches and fishing harbors ring the coast. Mild maritime summers and cold winters shape the year. Circle the coastal roads and red cliffs rather than seeking high mountains. PEI’s primer is red-shore island province — dunes, farmland, and gulf light on a compact Atlantic crescent.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Gulf of St. Lawrence · Maritime Canada',
      role: 'Smallest Canadian province of shores and farms',
      knownFor: 'Red sandstone shores, dunes, and farm fields',
    },
    features: [
      {
        name: 'Red sandstone shores',
        description:
          'Distinctive cliffs and beaches of the island.',
      },
      {
        name: 'Coastal dunes',
        description:
          'Sandy barriers along gulf beaches.',
      },
      {
        name: 'Farm fields',
        description:
          'Agricultural interior of the crescent.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Prince Edward Island',
        url: 'https://www.britannica.com/place/Prince-Edward-Island',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'gujarat',
    code: 'GJ',
    name: 'Gujarat',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Gujarat'],
    about:
      'Gujarat occupies India’s western edge as a state of Arabian Sea coasts, the Rann of Kutch salt flats, and industrial plains inland from historic ports. Monsoon rains green parts of the interior; the Rann and dry zones contrast sharply. Treat coast, salt desert, and inland plains as linked belts. Gujarat’s primer is western coastal state — Arabian shores, salt flats, and trading-port plains in one outline.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Arabian Sea · Rann of Kutch',
      role: 'Western Indian state of coast and salt flats',
      knownFor: 'Rann of Kutch, Arabian coast, and port plains',
    },
    features: [
      {
        name: 'Arabian coast',
        description:
          'Ports and shores of the western edge.',
      },
      {
        name: 'Rann of Kutch',
        description:
          'Seasonal salt flats of the northwest.',
      },
      {
        name: 'Inland plains',
        description:
          'Agricultural and industrial interior.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gujarat',
        url: 'https://www.britannica.com/place/Gujarat',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'milos',
    code: 'MLO',
    name: 'Milos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Milos'],
    about:
      'Milos is a volcanic Cycladic island of colorful mineral coasts, lunar-looking cliffs, and sheltered bays in the southwestern Aegean. Adamas and Plaka organize harbor and hill settlement; beaches hide in coves of white and ochre rock. Dry summers define the season. Approach from the central harbor out to the sculpted coastal geology. Milos’s primer is volcanic Cyclades — mineral colors, cliff coves, and Aegean bays on a mining-heritage island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Southwestern Cyclades · Aegean Sea',
      role: 'Volcanic Cycladic island of mineral coasts',
      knownFor: 'Colorful cliffs, cove beaches, and volcanic geology',
    },
    features: [
      {
        name: 'Mineral coasts',
        description:
          'Colored cliffs and lunar rock shores.',
      },
      {
        name: 'Cove beaches',
        description:
          'Sheltered sandy and pebble bays.',
      },
      {
        name: 'Hill villages',
        description:
          'Plaka and peers above the harbor.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Milos',
        url: 'https://www.britannica.com/place/Melos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tinos',
    code: 'TIN',
    name: 'Tinos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Tinos'],
    about:
      'Tinos is a northern Cycladic island of dovecote towers, marble villages, and a major Orthodox pilgrimage church above the harbor. Terrace agriculture and wind shape the inland ridges; beaches occupy quieter coves. Dry Aegean summers prevail. Climb from the harbor church approaches into marble hill villages. Tinos’s primer is pilgrimage Cyclades — marble lanes, dovecotes, and a sacred harbor slope in the northern Aegean.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Northern Cyclades · Aegean Sea',
      role: 'Pilgrimage and marble village island',
      knownFor: 'Dovecotes, marble villages, and harbor church',
    },
    features: [
      {
        name: 'Marble villages',
        description:
          'Stone settlements of the inland ridges.',
      },
      {
        name: 'Dovecote towers',
        description:
          'Ornamented pigeon houses of the countryside.',
      },
      {
        name: 'Harbor church',
        description:
          'The pilgrimage complex above the port.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tinos',
        url: 'https://www.britannica.com/place/Tinos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'chios',
    code: 'JKH',
    name: 'Chios',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Chios'],
    about:
      'Chios is a large eastern Aegean island near the Anatolian coast, known for mastic villages, medieval fortified settlements, and varied terrain from orchards to rocky shores. The Kampos and southern mastic zone organize classic itineraries; Chios Town faces the strait. Mild winters and hot summers define the climate. Move from the main town into mastic and fortress villages inland. Chios’s primer is mastic Aegean island — fortified villages and resin orchards facing Asia Minor’s nearby shore.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Eastern Aegean · near Anatolia',
      role: 'Large Aegean island of mastic and fortresses',
      knownFor: 'Mastic villages, medieval fortresses, and eastern Aegean setting',
    },
    features: [
      {
        name: 'Mastic villages',
        description:
          'Southern settlements of resin orchards.',
      },
      {
        name: 'Medieval fortresses',
        description:
          'Fortified village cores of the interior.',
      },
      {
        name: 'Eastern strait',
        description:
          'Approaches facing the Anatolian coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Chios',
        url: 'https://www.britannica.com/place/Chios-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'harris',
    code: 'HRS',
    name: 'Isle of Harris',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Harris', 'Harris'],
    about:
      'The Isle of Harris forms the southern part of the Lewis and Harris landmass in Scotland’s Outer Hebrides, famous for machair beaches, rocky mountains, and Atlantic light. Luskentyre and peers face turquoise shallows; the hills rise abruptly inland. Wind and rain are constants. Contrast west-coast sands with the rocky east and mountain spine. Harris’s primer is Hebridean beach-and-mountain — machair dunes against Atlantic peaks on a shared island with Lewis.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Outer Hebrides · Scotland',
      role: 'Hebridean island of beaches and mountains',
      knownFor: 'Machair beaches, rocky hills, and Atlantic light',
    },
    features: [
      {
        name: 'Machair beaches',
        description:
          'Pale sands and turquoise shallows of the west.',
      },
      {
        name: 'Rocky hills',
        description:
          'Abrupt mountains of the island spine.',
      },
      {
        name: 'Atlantic light',
        description:
          'Changing weather over open ocean approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Harris',
        url: 'https://www.britannica.com/place/Harris',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'desirade',
    code: 'DES',
    name: 'La Désirade',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['La Désirade', 'Désirade', 'Desirade'],
    about:
      'La Désirade is a long, low limestone island east of Grande-Terre in the Guadeloupe archipelago, of dry scrub, trade winds, and quieter shores than the main islands. A single ridge runs the island’s length; small villages face the Caribbean. Tropical warmth and aridity shape vegetation. Follow the coastal road along the ridge rather than seeking high peaks. La Désirade’s primer is dry Guadeloupe outlier — a windy limestone strip east of the larger French Antillean islands.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'East of Guadeloupe · Caribbean',
      role: 'Quiet limestone island of the Guadeloupe archipelago',
      knownFor: 'Limestone ridge, dry scrub, and quiet shores',
    },
    features: [
      {
        name: 'Limestone ridge',
        description:
          'The long low spine of the island.',
      },
      {
        name: 'Dry scrub',
        description:
          'Trade-wind vegetation of the arid slopes.',
      },
      {
        name: 'Quiet shores',
        description:
          'Less crowded coasts than Grande-Terre.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Guadeloupe',
        url: 'https://www.britannica.com/place/Guadeloupe',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'aruba',
    code: 'AUA',
    name: 'Aruba',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Aruba'],
    about:
      'Aruba is a dry Dutch Caribbean island outside the main hurricane belt, of pale beaches, trade-wind scrub, and a limestone and volcanic mix of terrain. Oranjestad organizes the capital shore; the California Lighthouse and Arikok landscapes mark the island’s ends. Arid warmth prevails most of the year. Circle beach coasts and desert-like interiors rather than rainforest peaks. Aruba’s primer is arid Dutch Antillean island — pale sand, cactus scrub, and steady trade winds off Venezuela’s coast.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Southern Caribbean · off Venezuela',
      role: 'Dutch Caribbean island of beaches and dry scrub',
      knownFor: 'Pale beaches, arid scrub, and Oranjestad shore',
    },
    features: [
      {
        name: 'Pale beaches',
        description:
          'Long sandy shores of the leeward coast.',
      },
      {
        name: 'Arid scrub',
        description:
          'Cactus and dry vegetation inland.',
      },
      {
        name: 'Oranjestad shore',
        description:
          'The capital waterfront and harbor.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Aruba',
        url: 'https://www.britannica.com/place/Aruba',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'liguria',
    code: 'LIG',
    name: 'Liguria',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Liguria'],
    about:
      'Liguria is Italy’s crescent Riviera region between the Maritime Alps/Apennines and the Ligurian Sea, of cliff villages, harbor cities, and terraced coasts. Genoa anchors the center; the Riviera di Levante and Ponente split east and west. Mild winters and warm summers favor outdoor life. Follow the sea-and-mountain squeeze rather than a wide plain. Liguria’s primer is Italian Riviera arc — harbors and terraces pressed between mountains and a narrow sea.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Ligurian Sea · Maritime Alps/Apennines',
      role: 'Riviera region of harbors and cliff coasts',
      knownFor: 'Riviera coasts, Genoa, and mountain-backed harbors',
    },
    features: [
      {
        name: 'Riviera coasts',
        description:
          'Cliff villages and terraced shorelines.',
      },
      {
        name: 'Genoa hub',
        description:
          'The historic port capital of the arc.',
      },
      {
        name: 'Mountain wall',
        description:
          'Alps and Apennines rising immediately inland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Liguria',
        url: 'https://www.britannica.com/place/Liguria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'styria',
    code: 'STY',
    name: 'Styria',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Styria', 'Steiermark'],
    about:
      'Styria (Steiermark) occupies southeastern Austria as a green province of vineyard hills, Alpine fringe, and Graz as its historic capital. Wine roads and pumpkin-seed country organize the south; mountains rise toward the north and west. Continental seasons bring warm summers. Move from Graz into vineyard hills and Alpine approaches. Styria’s primer is green Austrian southeast — vineyard slopes and forested hills around a historic Styrian capital.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Southeastern Austria · Alpine fringe',
      role: 'Wine-and-hill province of southeastern Austria',
      knownFor: 'Vineyard hills, Graz, and green Alpine fringe',
    },
    features: [
      {
        name: 'Vineyard hills',
        description:
          'Southern wine slopes of the province.',
      },
      {
        name: 'Graz capital',
        description:
          'The historic urban hub of Styria.',
      },
      {
        name: 'Alpine fringe',
        description:
          'Mountain approaches of the north and west.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Styria',
        url: 'https://www.britannica.com/place/Steiermark',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mclaren-vale',
    code: 'MCV',
    name: 'McLaren Vale',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['McLaren Vale'],
    about:
      'McLaren Vale is a South Australian wine region south of Adelaide, of vineyard valleys, Gulf St Vincent views, and cellar-door villages. Mediterranean-leaning summers favor grapes; the Willunga Escarpment frames inland edges. Drive vineyard roads with gulf light as a western horizon. McLaren Vale’s primer is gulf-side wine valley — vines and cellar towns between Adelaide and the Fleurieu coast.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'South Australia · Gulf St Vincent',
      role: 'Wine region south of Adelaide',
      knownFor: 'Vineyards, cellar doors, and gulf views',
    },
    features: [
      {
        name: 'Vineyard valleys',
        description:
          'Plantings filling the vale floor.',
      },
      {
        name: 'Cellar villages',
        description:
          'Towns of tasting rooms and wine roads.',
      },
      {
        name: 'Gulf horizon',
        description:
          'Western views toward Gulf St Vincent.',
      },
    ],
    sources: [
      {
        label: 'Britannica — McLaren Vale',
        url: 'https://www.britannica.com/place/McLaren-Vale',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cantabria',
    code: 'CTB',
    name: 'Cantabria',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Cantabria'],
    about:
      'Cantabria occupies Spain’s green northern coast on the Bay of Biscay, a region of fishing ports, Atlantic pasture, and limestone mountains inland toward the Picos fringe. Santander anchors the shore; rainy weather keeps slopes green. Move from coast to highland valleys rather than expecting dry Mediterranean light. Cantabria’s primer is green Cantabrian coast — Atlantic ports and pasture under mountain walls.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Bay of Biscay · northern Spain',
      role: 'Northern coastal and mountain region',
      knownFor: 'Atlantic coast, green pastures, and mountain inland',
    },
    features: [
      {
        name: 'Atlantic coast',
        description:
          'Ports and beaches of the Bay of Biscay.',
      },
      {
        name: 'Green pastures',
        description:
          'Rainy slopes of coastal farming country.',
      },
      {
        name: 'Mountain inland',
        description:
          'Limestone highlands behind the shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cantabria',
        url: 'https://www.britannica.com/place/Cantabria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'dobruja',
    code: 'DOB',
    name: 'Dobruja',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Dobruja', 'Dobrogea'],
    about:
      'Dobruja (Dobrogea) occupies Romania’s Black Sea and Danube Delta corner as a region of steppe, coastal cliffs, and wetland labyrinths where the Danube meets the sea. Constanța anchors the shore; the delta spreads north in channels and reed beds. Continental summers and cold winters mark inland steppe. Read coast, steppe, and delta as three linked landscapes. Dobruja’s primer is Black Sea–delta region — steppe light, coastal cliffs, and Danube wetlands at Romania’s eastern edge.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Black Sea · Danube Delta',
      role: 'Eastern Romanian coastal and delta region',
      knownFor: 'Danube Delta, Black Sea coast, and steppe',
    },
    features: [
      {
        name: 'Danube Delta',
        description:
          'Channels and reed wetlands at the river mouth.',
      },
      {
        name: 'Black Sea coast',
        description:
          'Cliffs and resorts of the shore.',
      },
      {
        name: 'Steppe interior',
        description:
          'Dry plains inland from the sea.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dobruja',
        url: 'https://www.britannica.com/place/Dobruja',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Danube Delta',
        url: 'https://whc.unesco.org/en/list/588/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tower-of-london',
    code: 'TOL',
    name: 'Tower of London',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Tower of London', 'White Tower'],
    about:
      'The Tower of London is a medieval fortress complex on the Thames in eastern central London, begun with the White Tower and expanded into concentric walls, towers, and a riverside stronghold. The fortress has served as palace, prison, and treasury; Tower Bridge stands nearby downstream. Stone, moat remnants, and river approaches organize the site. Read White Tower, curtain walls, and Thames together. The Tower’s primer is Thames fortress — Norman keep and concentric defenses at London’s historic riverside gate.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'River Thames · London',
      role: 'Medieval fortress and UNESCO site',
      knownFor: 'White Tower, concentric walls, and Thames setting',
    },
    features: [
      {
        name: 'White Tower',
        description:
          'The Norman keep at the fortress core.',
      },
      {
        name: 'Concentric walls',
        description:
          'Curtain defenses and later towers.',
      },
      {
        name: 'Thames setting',
        description:
          'River approaches beside Tower Bridge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tower of London',
        url: 'https://www.britannica.com/topic/Tower-of-London',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Tower of London',
        url: 'https://whc.unesco.org/en/list/488/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'pantheon-paris',
    code: 'PHP',
    name: 'Panthéon',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Panthéon', 'Pantheon of Paris', 'Panthéon de Paris'],
    about:
      'The Panthéon crowns the Montagne Sainte-Geneviève in Paris’s Latin Quarter as a neoclassical domed temple turned national mausoleum. The portico and dome organize the skyline of the Left Bank hill; the crypt holds honored French figures. Academic and student streets surround the approaches. Stand on the hill so dome, portico, and Latin Quarter fabric read together. The Panthéon’s primer is Left Bank civic dome — a neoclassical mausoleum on Paris’s historic academic hill.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Latin Quarter · Paris',
      role: 'Neoclassical mausoleum and hilltop landmark',
      knownFor: 'Dome, portico, and Montagne Sainte-Geneviève setting',
    },
    features: [
      {
        name: 'Neoclassical dome',
        description:
          'The crowning cupola of the Latin Quarter hill.',
      },
      {
        name: 'Portico',
        description:
          'The columned facade of the temple front.',
      },
      {
        name: 'Academic hill',
        description:
          'The Montagne Sainte-Geneviève setting.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Panthéon',
        url: 'https://www.britannica.com/topic/Pantheon-building-Paris-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'badlands',
    code: 'BDL',
    name: 'Badlands',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Badlands', 'Badlands National Park'],
    about:
      'The Badlands of South Dakota are eroded layers of soft rock and prairie grassland forming sharp ridges, buttes, and striped formations under wide plains skies. The national park protects classic vistas of banded cliffs and mixed-grass prairie; extremes of heat and cold shape the seasons. Approach along park roads so formations rise abruptly from grassland. Badlands’ primer is prairie erosion landscape — banded cliffs and buttes carved from soft rock on the Great Plains.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'South Dakota · Great Plains',
      role: 'Eroded badlands and national park',
      knownFor: 'Banded cliffs, buttes, and mixed-grass prairie',
    },
    features: [
      {
        name: 'Banded cliffs',
        description:
          'Striped eroded walls of soft rock.',
      },
      {
        name: 'Buttes and ridges',
        description:
          'Sharp landforms rising from the prairie.',
      },
      {
        name: 'Mixed-grass prairie',
        description:
          'Grassland surrounding the formations.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Badlands',
        url: 'https://www.britannica.com/place/Badlands',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Badlands',
        url: 'https://www.nps.gov/badl/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'acadia',
    code: 'ACD',
    name: 'Acadia',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Acadia', 'Acadia National Park'],
    about:
      'Acadia National Park protects granite mountains, rocky Atlantic shores, and spruce-fir forests on Maine’s Mount Desert Island and nearby coasts. Cadillac Mountain offers sweeping dawn views; carriage roads and cliff paths organize classic approaches. Fog, tide, and bright clear days alternate along the coast. Read granite summit, forest, and rocky shore as one park composition. Acadia’s primer is Maine granite coast park — Atlantic cliffs and forested peaks on Mount Desert Island.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Mount Desert Island · Maine',
      role: 'National park of granite coast and mountains',
      knownFor: 'Cadillac Mountain, rocky shores, and spruce forests',
    },
    features: [
      {
        name: 'Cadillac Mountain',
        description:
          'The high granite summit with coastal views.',
      },
      {
        name: 'Rocky Atlantic shore',
        description:
          'Cliff and cobble coasts of the park.',
      },
      {
        name: 'Spruce-fir forest',
        description:
          'Evergreen cover of the island slopes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Acadia National Park',
        url: 'https://www.britannica.com/place/Acadia-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Acadia',
        url: 'https://www.nps.gov/acad/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'wartburg',
    code: 'WTB',
    name: 'Wartburg',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Wartburg', 'Wartburg Castle'],
    about:
      'Wartburg Castle crowns a forested hill above Eisenach in Thuringia as a medieval fortress of Romanesque and later romantic layers, long tied to German cultural memory. Towers and palas rise above beech woods; approaches climb from the town below. Clear days reveal Thuringian countryside around the spur. Read castle silhouette against the wooded hill rather than a city skyline. Wartburg’s primer is Thuringian hill castle — a forested fortress spur of medieval and romantic German heritage.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Eisenach · Thuringia',
      role: 'Medieval hill castle and UNESCO site',
      knownFor: 'Forested hill spur, Romanesque fabric, and romantic silhouette',
    },
    features: [
      {
        name: 'Hilltop castle',
        description:
          'Towers and halls on the forested spur.',
      },
      {
        name: 'Romanesque core',
        description:
          'Medieval fabric of the historic fortress.',
      },
      {
        name: 'Beech woods',
        description:
          'Forest approaches surrounding the hill.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Wartburg',
        url: 'https://www.britannica.com/place/Wartburg',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Wartburg Castle',
        url: 'https://whc.unesco.org/en/list/897/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'gateway-arch',
    code: 'GWA',
    name: 'Gateway Arch',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Gateway Arch', 'St. Louis Arch', 'Saint Louis Arch'],
    about:
      'The Gateway Arch rises on the Mississippi riverfront in St. Louis as a stainless-steel catenary arch commemorating westward expansion and framing the city’s downtown skyline. The monument grounds open toward the river; the curve is readable from both banks and the urban approaches. Midwest seasons bring hot summers and cold winters. Stand on the riverfront so arch, water, and skyline align. The Gateway Arch’s primer is Mississippi riverfront arch — a stainless curve anchoring St. Louis’s civic waterfront.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi riverfront · St. Louis',
      role: 'Monumental arch and national park centerpiece',
      knownFor: 'Stainless catenary arch, riverfront grounds, and skyline frame',
    },
    features: [
      {
        name: 'Catenary arch',
        description:
          'The stainless-steel curve of the monument.',
      },
      {
        name: 'Riverfront grounds',
        description:
          'Open approaches to the Mississippi.',
      },
      {
        name: 'Skyline frame',
        description:
          'Downtown towers seen through and beside the arch.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gateway Arch',
        url: 'https://www.britannica.com/topic/Gateway-Arch',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Gateway Arch',
        url: 'https://www.nps.gov/jeff/index.htm',
        kind: 'authority',
      },
    ],
  },
]
