/** Seventeenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch17: PlaceGuideDraftBatch[] = [
  {
    slug: 'rochester',
    code: 'ROC',
    name: 'Rochester',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Rochester'],
    about:
      'Rochester sits on Lake Ontario’s south shore in western New York as a Genesee River city of waterfalls in the urban core, imaging and optics heritage, and a compact downtown beside highland park neighborhoods. Lake-effect snow shapes winters; humid summers open river and lakeside life. Orient from the gorge and falls through downtown to the lake plain. Rochester’s primer is Genesee–Ontario city — urban waterfalls and lake-plain streets in western New York.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Genesee River · Lake Ontario',
      role: 'Western New York metro and lakeshore city',
      knownFor: 'Urban waterfalls, Genesee gorge, and Ontario shore',
    },
    features: [
      {
        name: 'Genesee falls',
        description:
          'Waterfalls cutting through the urban gorge.',
      },
      {
        name: 'Lake Ontario plain',
        description:
          'The northern shore approach of the metro.',
      },
      {
        name: 'Downtown core',
        description:
          'Compact civic and commercial blocks near the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rochester',
        url: 'https://www.britannica.com/place/Rochester-New-York',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'spokane',
    code: 'GEG',
    name: 'Spokane',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Spokane'],
    about:
      'Spokane occupies the Spokane River falls and gorge in eastern Washington as an Inland Northwest city of river parks, brick downtown, and pine-clad hills. The falls organize the center; four-season inland weather brings cold winters and warm dry summers. Begin at the river gorge and Riverfront Park, then the surrounding hills. Spokane’s primer is Inland Northwest falls city — a river gorge hub east of the Cascades.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Spokane River · eastern Washington',
      role: 'Inland Northwest metro and river city',
      knownFor: 'River falls, Riverfront Park, and pine hills',
    },
    features: [
      {
        name: 'River falls',
        description:
          'The Spokane River cascades through downtown.',
      },
      {
        name: 'Riverfront Park',
        description:
          'The central green space on the gorge.',
      },
      {
        name: 'Pine hills',
        description:
          'Forested slopes surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Spokane',
        url: 'https://www.britannica.com/place/Spokane',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tucson',
    code: 'TUC',
    name: 'Tucson',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Tucson'],
    about:
      'Tucson sits in the Sonoran Desert basin of southern Arizona ringed by mountain sky islands, a city of saguaro slopes, adobe and mid-century fabric, and clear dry light. The Santa Catalinas rise north; the university anchors a central district. Hot summers and mild winters define the desert year. Read basin floor, mountain rims, and desert vegetation together. Tucson’s primer is Sonoran basin city — saguaros and sky-island mountains around a southern Arizona metro.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Sonoran Desert · southern Arizona',
      role: 'Major Arizona desert metro and university city',
      knownFor: 'Saguaro desert, Catalina mountains, and basin setting',
    },
    features: [
      {
        name: 'Sonoran basin',
        description:
          'Desert floor holding the urban grid.',
      },
      {
        name: 'Sky-island mountains',
        description:
          'Ranges rising abruptly around the city.',
      },
      {
        name: 'Saguaro slopes',
        description:
          'Cactus-studded hills of the desert edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tucson',
        url: 'https://www.britannica.com/place/Tucson',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'regina',
    code: 'YQR',
    name: 'Regina',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Regina'],
    about:
      'Regina occupies the open prairie of southern Saskatchewan as the provincial capital, a planned city of Wascana Lake parkland, legislative grounds, and wide winter skies. The artificial lake and surrounding green space organize the civic core; cold continental seasons dominate. Orient from Wascana and the legislature outward to the prairie grid. Regina’s primer is prairie capital — a legislative park city under Saskatchewan’s open sky.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Southern Saskatchewan prairie',
      role: 'Saskatchewan capital and prairie civic hub',
      knownFor: 'Wascana Lake, legislature grounds, and prairie setting',
    },
    features: [
      {
        name: 'Wascana Lake',
        description:
          'The parkland water body of the civic core.',
      },
      {
        name: 'Legislature grounds',
        description:
          'The provincial capital complex.',
      },
      {
        name: 'Prairie grid',
        description:
          'Open farmland surrounding the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Regina',
        url: 'https://www.britannica.com/place/Regina-Saskatchewan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'concepcion',
    code: 'CCP',
    name: 'Concepción',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Concepción', 'Concepcion'],
    about:
      'Concepción anchors Chile’s Biobío Region near the Pacific as a university and industrial metro of river and coastal approaches, rebuilt street grids, and a rainy temperate climate. The Biobío River and ocean edge organize geography; hills frame inland neighborhoods. Cool wet winters and milder summers shape the year. Begin with the river–coast hinge, then the campus and civic districts. Concepción’s primer is Biobío metro — a southern Chilean university city between river and Pacific.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Biobío Region · Pacific approaches',
      role: 'Regional capital and university-industrial metro',
      knownFor: 'Biobío setting, university life, and coastal approaches',
    },
    features: [
      {
        name: 'Biobío approaches',
        description:
          'River corridors toward the Pacific edge.',
      },
      {
        name: 'University districts',
        description:
          'Campus neighborhoods of the metro.',
      },
      {
        name: 'Coastal climate',
        description:
          'Rainy temperate weather of southern Chile.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Concepción',
        url: 'https://www.britannica.com/place/Concepcion-Chile',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'florianopolis',
    code: 'FLN',
    name: 'Florianópolis',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Florianópolis', 'Florianopolis'],
    about:
      'Florianópolis occupies an island and mainland bridgehead in Santa Catarina as a Brazilian city of beaches, lagoons, and a historic island center facing the Atlantic. Dunes and forested hills interrupt the shore; humid subtropical seasons favor outdoor life. Cross from mainland bridges to island beaches and lagoons. Florianópolis’s primer is island capital of Santa Catarina — lagoons, dunes, and Atlantic beaches around a bridged island metro.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Santa Catarina Island · Atlantic',
      role: 'Santa Catarina capital and beach island metro',
      knownFor: 'Island beaches, lagoons, and bridged approaches',
    },
    features: [
      {
        name: 'Island beaches',
        description:
          'Atlantic shores ringing the main island.',
      },
      {
        name: 'Lagoons',
        description:
          'Interior water bodies of the island.',
      },
      {
        name: 'Bridge approaches',
        description:
          'Links from the mainland to the island core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Florianópolis',
        url: 'https://www.britannica.com/place/Florianopolis',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'zadar',
    code: 'ZAD',
    name: 'Zadar',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Zadar'],
    about:
      'Zadar occupies a peninsula on Croatia’s northern Dalmatian coast as a historic city of Roman streets, Venetian walls, and a waterfront famous for its sea organ and sunset steps. Islands and ferry routes fan from the harbor; hot dry summers define the season. Walk the peninsula walls and forum before the island approaches. Zadar’s primer is Dalmatian peninsula city — Roman–Venetian stone facing an island-studded Adriatic.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Northern Dalmatia · Adriatic Sea',
      role: 'Historic Dalmatian port and peninsula city',
      knownFor: 'Peninsula walls, Roman forum, and Adriatic waterfront',
    },
    features: [
      {
        name: 'Peninsula walls',
        description:
          'Venetian defenses around the historic tip.',
      },
      {
        name: 'Roman forum',
        description:
          'Ancient pavement in the old-town core.',
      },
      {
        name: 'Island approaches',
        description:
          'Ferry routes into the Zadar archipelago.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zadar',
        url: 'https://www.britannica.com/place/Zadar',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bhopal',
    code: 'BHO',
    name: 'Bhopal',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Bhopal'],
    about:
      'Bhopal sits among lakes on the Malwa edge in Madhya Pradesh as a capital city of upper and lower lake shores, mosque skylines, and a mix of old-city lanes with newer civic axes. Monsoon rains refill the lakes; hot summers precede them. Orient from the lake embankments into the old city and capitol districts. Bhopal’s primer is lake capital of Madhya Pradesh — mosque silhouettes and embankments around highland lakes.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Upper and Lower Lakes · Madhya Pradesh',
      role: 'Madhya Pradesh capital and lake city',
      knownFor: 'Lake shores, mosque skyline, and old-city lanes',
    },
    features: [
      {
        name: 'Lake shores',
        description:
          'Upper and Lower Lake embankments.',
      },
      {
        name: 'Mosque skyline',
        description:
          'Historic religious landmarks of the center.',
      },
      {
        name: 'Old-city lanes',
        description:
          'Dense streets of the historic quarter.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bhopal',
        url: 'https://www.britannica.com/place/Bhopal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mechelen',
    code: 'MEC',
    name: 'Mechelen',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Mechelen'],
    about:
      'Mechelen sits on the Dyle between Brussels and Antwerp as a compact Flemish city of a great cathedral tower, Beguinage fabric, and carillon tradition. The historic core packs brick streets around the Grote Markt; mild maritime weather keeps plazas active. Stay with the cathedral and market square before the canal edges. Mechelen’s primer is Dyle cathedral town — a Brabant brick city of tower and beguinage between Belgium’s larger metros.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Dyle River · Flemish Brabant',
      role: 'Historic cathedral city between Brussels and Antwerp',
      knownFor: 'Cathedral tower, Grote Markt, and Beguinage',
    },
    features: [
      {
        name: 'Cathedral tower',
        description:
          'The unfinished great tower of St. Rumbold’s.',
      },
      {
        name: 'Grote Markt',
        description:
          'The main square of the historic core.',
      },
      {
        name: 'Beguinage',
        description:
          'The enclosed historic residential quarter.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mechelen',
        url: 'https://www.britannica.com/place/Mechelen',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nagoya',
    code: 'NGO',
    name: 'Nagoya',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Nagoya'],
    about:
      'Nagoya occupies the Nobi Plain of central Honshu as a castle-and-industry metro of broad avenues, a reconstructed keep, and a major rail hub between Tokyo and Osaka. The castle park organizes the historic core; humid summers and mild winters mark the climate. Orient from castle and station districts across the plain city. Nagoya’s primer is Nobi Plain metro — a central Japanese castle city and manufacturing hub on open lowland.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Nobi Plain · central Honshu',
      role: 'Major central Japanese metro and rail hub',
      knownFor: 'Nagoya Castle, rail hub, and plain setting',
    },
    features: [
      {
        name: 'Nagoya Castle',
        description:
          'The reconstructed keep and park of the core.',
      },
      {
        name: 'Rail hub',
        description:
          'Station districts linking Tokyo and Osaka routes.',
      },
      {
        name: 'Nobi Plain',
        description:
          'Open lowland surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nagoya',
        url: 'https://www.britannica.com/place/Nagoya',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'chandigarh',
    code: 'IXC',
    name: 'Chandigarh',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Chandigarh'],
    about:
      'Chandigarh is a planned mid-twentieth-century capital on the Punjab–Haryana edge, laid out in sectors with Le Corbusier’s Capitol Complex of monumental concrete against the Shivalik foothills. Grid sectors and green belts organize daily life; hot summers and a monsoon peak shape the year. Read Capitol monuments, sector grid, and foothill backdrop together. Chandigarh’s primer is planned foothill capital — modernist concrete and sector parks at the Himalayan fringe.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Shivalik foothills · Punjab–Haryana',
      role: 'Planned joint capital and modernist city',
      knownFor: 'Capitol Complex, sector grid, and foothill setting',
    },
    features: [
      {
        name: 'Capitol Complex',
        description:
          'Monumental modernist government buildings.',
      },
      {
        name: 'Sector grid',
        description:
          'Planned neighborhoods and green belts.',
      },
      {
        name: 'Shivalik foothills',
        description:
          'Rising ground framing the northern edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Chandigarh',
        url: 'https://www.britannica.com/place/Chandigarh-India',
        kind: 'reference',
      },
      {
        label: 'UNESCO — The Architectural Work of Le Corbusier',
        url: 'https://whc.unesco.org/en/list/1321/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'porto-alegre',
    code: 'POA',
    name: 'Porto Alegre',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Porto Alegre'],
    about:
      'Porto Alegre sits at the northern tip of the Patos Lagoon in Rio Grande do Sul as a gaúcho metropolis of riverfront parks, a historic peninsula center, and humid subtropical seasons. Bridges and lake edges organize the metro; cultural life clusters near the water. Orient from the peninsula and lagoon shore outward to mainland neighborhoods. Porto Alegre’s primer is Patos Lagoon capital — a southern Brazilian metro where river parks meet gaúcho plains approaches.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Patos Lagoon · Rio Grande do Sul',
      role: 'Rio Grande do Sul capital and southern metro',
      knownFor: 'Lagoon waterfront, peninsula center, and park edges',
    },
    features: [
      {
        name: 'Lagoon waterfront',
        description:
          'Parks and shores on Patos Lagoon.',
      },
      {
        name: 'Peninsula center',
        description:
          'The historic tip of the urban core.',
      },
      {
        name: 'Bridge links',
        description:
          'Spans tying mainland districts to the center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Porto Alegre',
        url: 'https://www.britannica.com/place/Porto-Alegre',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'iowa',
    code: 'IA',
    name: 'Iowa',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Iowa'],
    about:
      'Iowa fills the Midwestern interior between the Mississippi and Missouri rivers as a state of deep prairie soils, loess hills, and a lattice of farm towns and small cities. Rolling fields dominate the map; river bluffs mark the east and west edges. Hot summers and cold winters define the continental year. Read river borders and agricultural plain as the state’s geography. Iowa’s primer is prairie heartland state — deep soils and river bluffs between two great Midwestern rivers.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Mississippi to Missouri rivers',
      role: 'Midwestern agricultural state of prairie soils',
      knownFor: 'Prairie farmland, loess hills, and river borders',
    },
    features: [
      {
        name: 'Prairie farmland',
        description:
          'Deep-soil fields covering most of the state.',
      },
      {
        name: 'Loess hills',
        description:
          'Wind-deposited ridges near the Missouri.',
      },
      {
        name: 'River borders',
        description:
          'Mississippi and Missouri edge corridors.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Iowa',
        url: 'https://www.britannica.com/place/Iowa-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'northwest-territories',
    code: 'NT',
    name: 'Northwest Territories',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Territory · Canada',
    matchNames: ['Northwest Territories', 'NWT'],
    about:
      'The Northwest Territories span a vast stretch of northern Canada from boreal forest and great lakes around Yellowknife to tundra and Arctic coasts farther north. Great Slave Lake anchors the southern settled belt; wilderness dominates beyond sparse roads. Extreme seasonal light and long winters shape life. Treat lake country, boreal, and Arctic coast as linked northern belts. The territory’s primer is subarctic-to-Arctic expanse — great lakes, tundra, and sparse northern settlements.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Northern Canada · Great Slave Lake to Arctic',
      role: 'Canadian territory of boreal lakes and Arctic approaches',
      knownFor: 'Great Slave Lake, boreal wilderness, and Arctic coast',
    },
    features: [
      {
        name: 'Great Slave Lake',
        description:
          'The vast southern lake around Yellowknife.',
      },
      {
        name: 'Boreal wilderness',
        description:
          'Forest and waterways of the mid-north.',
      },
      {
        name: 'Arctic approaches',
        description:
          'Tundra and coast of the far north.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Northwest Territories',
        url: 'https://www.britannica.com/place/Northwest-Territories',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'telangana',
    code: 'TEL',
    name: 'Telangana',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Telangana'],
    about:
      'Telangana occupies the Deccan plateau of south-central India around Hyderabad as a state of granite hills, tank irrigation, and a major IT and historic metro. Hot summers and monsoon rains shape the plateau year; forts and boulder landscapes mark the hinterland. Read Hyderabad hub, plateau tanks, and Deccan hills together. Telangana’s primer is Deccan plateau state — granite country and a historic–tech capital in south-central India.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Deccan Plateau · south-central India',
      role: 'Deccan state centered on Hyderabad',
      knownFor: 'Hyderabad hub, Deccan hills, and tank landscapes',
    },
    features: [
      {
        name: 'Hyderabad hub',
        description:
          'The metropolitan core of the state.',
      },
      {
        name: 'Deccan hills',
        description:
          'Granite and boulder country of the plateau.',
      },
      {
        name: 'Tank irrigation',
        description:
          'Traditional reservoirs across farmland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Telangana',
        url: 'https://www.britannica.com/place/Telangana',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'andros',
    code: 'ADO',
    name: 'Andros',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Andros'],
    about:
      'Andros is a northern Cycladic island of mountain ridges, dovecote villages, and more greenery than many drier neighbors, with Chora perched above a bay. Hiking paths cross terraces and streams; beaches occupy quieter coves. Dry summers still dominate, yet springs feed inland valleys. Climb from harbor approaches to Chora and the ridge paths. Andros’s primer is greenish Cyclades — mountain villages and terrace paths on a northern Aegean island.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Northern Cyclades · Aegean Sea',
      role: 'Mountainous Cycladic island of villages and paths',
      knownFor: 'Chora bay, ridge paths, and terraced valleys',
    },
    features: [
      {
        name: 'Chora bay',
        description:
          'The hill town above the main harbor approaches.',
      },
      {
        name: 'Ridge paths',
        description:
          'Hiking routes across terraces and streams.',
      },
      {
        name: 'Mountain villages',
        description:
          'Inland settlements of the island spine.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Andros',
        url: 'https://www.britannica.com/place/Andros-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ikaria',
    code: 'JIK',
    name: 'Ikaria',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Ikaria', 'Icaria'],
    about:
      'Ikaria is an eastern Aegean island of steep mountains, thermal springs, and villages that cling to ridges away from exposed shores. Longevity folklore and late-night panigiria color local culture; ferries land at sheltered ports. Hot dry summers define the season. Move from harbor villages up mountain roads into ridge settlements. Ikaria’s primer is steep Aegean longevity island — ridge villages and thermal slopes facing Anatolia’s nearby sea.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Eastern Aegean · near Anatolia',
      role: 'Mountainous Aegean island of ridge villages',
      knownFor: 'Steep ridges, thermal springs, and mountain villages',
    },
    features: [
      {
        name: 'Steep ridges',
        description:
          'Mountain spine running the island’s length.',
      },
      {
        name: 'Thermal springs',
        description:
          'Warm mineral waters of the slopes.',
      },
      {
        name: 'Ridge villages',
        description:
          'Settlements set back from exposed coasts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Icária',
        url: 'https://www.britannica.com/place/Icaria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'barra',
    code: 'BRR',
    name: 'Isle of Barra',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Barra', 'Barra'],
    about:
      'The Isle of Barra is a southern Outer Hebridean island of machair beaches, a cockle-strand airport, and Castlebay as its harbor village under Kisimul Castle. Atlantic weather brings quick-changing light; Gaelic heritage remains strong. Contrast white beaches with rocky east shores and the bay castle. Barra’s primer is Hebridean cockle-strand island — machair sands and a castle bay at the southern Outer Hebrides.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Outer Hebrides · Scotland',
      role: 'Southern Hebridean island of beaches and bay castle',
      knownFor: 'Machair beaches, Castlebay, and Kisimul Castle',
    },
    features: [
      {
        name: 'Machair beaches',
        description:
          'Pale sands of the Atlantic edge.',
      },
      {
        name: 'Castlebay',
        description:
          'The harbor village of the island.',
      },
      {
        name: 'Kisimul Castle',
        description:
          'The bay fortress on its tidal rock.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Barra',
        url: 'https://www.britannica.com/place/Barra-island-Scotland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tiree',
    code: 'TRE',
    name: 'Tiree',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Tiree'],
    about:
      'Tiree is a low, fertile Inner Hebridean island west of Mull, known for machair, surfing beaches, and some of Scotland’s sunniest and windiest Atlantic weather. Crofting fields meet pale shores; settlements stay small and scattered. Wind is a constant companion. Circle beach and machair rather than climbing peaks. Tiree’s primer is sunny windy Hebrides — low machair and surf beaches on a fertile Atlantic island.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · west of Mull',
      role: 'Low Hebridean island of machair and surf',
      knownFor: 'Machair, surfing beaches, and Atlantic wind',
    },
    features: [
      {
        name: 'Machair',
        description:
          'Fertile sandy grassland behind the shores.',
      },
      {
        name: 'Surf beaches',
        description:
          'Atlantic breaks along the open coast.',
      },
      {
        name: 'Low island profile',
        description:
          'Flat terrain without high mountains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tiree',
        url: 'https://www.britannica.com/place/Tiree',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'st-martin',
    code: 'STM',
    name: 'Saint Martin',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Saint Martin', 'St. Martin', 'St Martin'],
    about:
      'Saint Martin is the French northern side of a shared Caribbean island with the Dutch Sint Maarten, a territory of lagoon shores, low hills, and Marigot as a principal town. Beaches and salt ponds organize the coast; trade-wind warmth prevails. Cross-island roads link French and Dutch sides. Orient from Marigot and lagoon edges across the low hills. Saint Martin’s primer is French Antillean half-island — lagoons and hill towns on a shared Caribbean ridge.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'Northern Lesser Antilles · Caribbean',
      role: 'French half of a shared Caribbean island',
      knownFor: 'Lagoon shores, Marigot, and low hill country',
    },
    features: [
      {
        name: 'Lagoon shores',
        description:
          'Salt ponds and sheltered water edges.',
      },
      {
        name: 'Marigot',
        description:
          'The principal French-side town.',
      },
      {
        name: 'Low hills',
        description:
          'Gentle ridges of the shared island.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saint-Martin',
        url: 'https://www.britannica.com/place/Saint-Martin',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sint-maarten',
    code: 'SXM',
    name: 'Sint Maarten',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Sint Maarten', 'St. Maarten', 'St Maarten'],
    about:
      'Sint Maarten is the Dutch southern side of the shared Caribbean island with French Saint Martin, known for Philipsburg’s harbor street, Maho Beach’s runway approach, and busy cruise traffic. Hills and bays organize the compact territory; trade winds keep the air warm. Start at Philipsburg’s Great Bay, then the western beach and hill roads. Sint Maarten’s primer is Dutch Antillean harbor half — cruise docks and runway beach on a shared Caribbean island.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Northern Lesser Antilles · Caribbean',
      role: 'Dutch half of a shared Caribbean island',
      knownFor: 'Philipsburg harbor, Maho Beach, and cruise bay',
    },
    features: [
      {
        name: 'Philipsburg harbor',
        description:
          'The Great Bay waterfront and Front Street.',
      },
      {
        name: 'Maho Beach',
        description:
          'The shore beside the airport approach.',
      },
      {
        name: 'Hill roads',
        description:
          'Links across the compact Dutch side.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sint Maarten',
        url: 'https://www.britannica.com/place/Sint-Maarten',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'veneto',
    code: 'VEN',
    name: 'Veneto',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Veneto'],
    about:
      'Veneto occupies northeastern Italy from Alpine foothills and Lake Garda’s eastern shore across vineyard hills to the Venetian lagoon and Adriatic. Venice, Verona, and Padua organize historic poles; Prosecco country and Po Plain farming fill the hinterland. Alpine winters and warm plain summers share the climate. Read mountains, vineyards, and lagoon as linked belts. Veneto’s primer is lagoon-to-Alps region — Venetian water, vineyard hills, and foothill approaches in one outline.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Alps to Venetian lagoon · northeast Italy',
      role: 'Northeastern Italian region of lagoon and vineyards',
      knownFor: 'Venetian lagoon, vineyard hills, and Alpine foothills',
    },
    features: [
      {
        name: 'Venetian lagoon',
        description:
          'The Adriatic wetland and island approaches.',
      },
      {
        name: 'Vineyard hills',
        description:
          'Prosecco and peer wine country inland.',
      },
      {
        name: 'Alpine foothills',
        description:
          'Northern rises toward the mountains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Veneto',
        url: 'https://www.britannica.com/place/Veneto',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'upper-austria',
    code: 'UAO',
    name: 'Upper Austria',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Upper Austria', 'Oberösterreich'],
    about:
      'Upper Austria (Oberösterreich) occupies north-central Austria around Linz, a region of Danube corridors, Alpine lake country toward the Salzkammergut fringe, and fertile plains. Industrial and cultural life centers on the Danube; mountains rise south and west. Continental seasons bring warm summers. Move from Danube cities into lake and Alpine approaches. Upper Austria’s primer is Danube-and-lake province — river plains meeting Alpine lake country in north-central Austria.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Danube · Salzkammergut fringe',
      role: 'North-central Austrian province of river and lakes',
      knownFor: 'Danube corridor, Linz hub, and Alpine lake fringe',
    },
    features: [
      {
        name: 'Danube corridor',
        description:
          'River cities and plains of the province.',
      },
      {
        name: 'Lake fringe',
        description:
          'Alpine lake approaches of the south and west.',
      },
      {
        name: 'Linz hub',
        description:
          'The principal urban center on the Danube.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oberösterreich',
        url: 'https://www.britannica.com/place/Oberosterreich',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'eden-valley',
    code: 'EDV',
    name: 'Eden Valley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Eden Valley'],
    about:
      'Eden Valley is a cooler elevated wine region in South Australia’s Barossa Ranges, of Riesling and other plantings on higher slopes above warmer valley floors nearby. Cellar doors and rolling vineyard country organize visits; clear highland-edge light favors outdoor days. Drive ridge and vale roads between small wine settlements. Eden Valley’s primer is elevated SA wine country — cooler slopes and Riesling vines above the broader Barossa system.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Barossa Ranges · South Australia',
      role: 'Cooler elevated wine region of South Australia',
      knownFor: 'Riesling slopes, cellar doors, and highland-edge vineyards',
    },
    features: [
      {
        name: 'Elevated slopes',
        description:
          'Cooler vineyard plantings of the ranges.',
      },
      {
        name: 'Riesling country',
        description:
          'White-wine vineyards favored by the elevation.',
      },
      {
        name: 'Cellar roads',
        description:
          'Driving routes between tasting settlements.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Barossa Valley',
        url: 'https://www.britannica.com/place/Barossa-Valley',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'galicia',
    code: 'GAL',
    name: 'Galicia',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Galicia'],
    about:
      'Galicia occupies Spain’s rainy northwestern corner of Atlantic rías, granite coasts, and green inland hills centered culturally on Santiago de Compostela. Fishing ports and pilgrimage routes organize identity; Celtic-influenced music and language mark local culture. Wet winters keep slopes green. Move from ría shores inland to the pilgrimage city and hill country. Galicia’s primer is Atlantic green Spain — rías, granite, and pilgrimage paths in the rainy northwest.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Atlantic northwest · rías and hills',
      role: 'Northwestern Spanish region of coast and pilgrimage',
      knownFor: 'Atlantic rías, Santiago de Compostela, and green hills',
    },
    features: [
      {
        name: 'Atlantic rías',
        description:
          'Drowned river valleys of the coast.',
      },
      {
        name: 'Santiago hub',
        description:
          'The pilgrimage city of the interior.',
      },
      {
        name: 'Green hills',
        description:
          'Rainy inland slopes of the northwest.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Galicia',
        url: 'https://www.britannica.com/place/Galicia-region-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'muntenia',
    code: 'MUN',
    name: 'Muntenia',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Muntenia', 'Wallachia'],
    about:
      'Muntenia (eastern Wallachia) occupies the southern Romanian plain around Bucharest between the Carpathians and the Danube, a region of capital sprawl, agricultural lowlands, and foothill approaches north. Continental heat marks summers; the Danube forms the southern edge. Read capital plain, foothills, and Danube border as linked belts. Muntenia’s primer is southern Romanian plain — Bucharest’s lowland core between mountains and the Danube.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Carpathians to Danube · southern Romania',
      role: 'Southern Romanian plain region around Bucharest',
      knownFor: 'Bucharest plain, foothill north, and Danube edge',
    },
    features: [
      {
        name: 'Bucharest plain',
        description:
          'The capital lowland of southern Romania.',
      },
      {
        name: 'Foothill north',
        description:
          'Approaches toward the Carpathians.',
      },
      {
        name: 'Danube edge',
        description:
          'The southern river border of the region.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Walachia',
        url: 'https://www.britannica.com/place/Walachia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'trafalgar-square',
    code: 'TFS',
    name: 'Trafalgar Square',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Trafalgar Square', "Nelson's Column"],
    about:
      'Trafalgar Square is the great open civic plaza of central London, framed by the National Gallery, church spires, and Nelson’s Column rising above bronze lions and fountains. Radial streets feed the square; it has long hosted gatherings and public events. The composition is plaza, column, and gallery facade. Stand in the square so column, lions, and gallery portico read together. Trafalgar Square’s primer is London civic plaza — Nelson’s Column and gallery frontage at the city’s ceremonial crossroads.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Central London · Westminster/West End edge',
      role: 'Civic plaza and national gathering place',
      knownFor: "Nelson's Column, National Gallery frontage, and fountains",
    },
    features: [
      {
        name: "Nelson's Column",
        description:
          'The monument rising at the square’s center.',
      },
      {
        name: 'National Gallery',
        description:
          'The portico framing the northern side.',
      },
      {
        name: 'Fountains and lions',
        description:
          'The bronze and water composition of the plaza.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Trafalgar Square',
        url: 'https://www.britannica.com/topic/Trafalgar-Square',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sainte-chapelle',
    code: 'SCH',
    name: 'Sainte-Chapelle',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Sainte-Chapelle', 'Sainte Chapelle'],
    about:
      'Sainte-Chapelle stands within the Palais de Justice complex on Paris’s Île de la Cité as a Gothic royal chapel of towering stained-glass walls. The upper chapel dissolves stone into colored light; the lower level is more intimate. It was built to house relics for the French crown. Enter so the glass walls and slender supports read as one luminous room. Sainte-Chapelle’s primer is Gothic glass chapel — a jewel-box of stained light on the Île de la Cité.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Île de la Cité · Paris',
      role: 'Gothic royal chapel of stained glass',
      knownFor: 'Stained-glass walls, upper chapel light, and palace setting',
    },
    features: [
      {
        name: 'Stained-glass walls',
        description:
          'The towering colored windows of the upper chapel.',
      },
      {
        name: 'Upper chapel',
        description:
          'The luminous main space of the monument.',
      },
      {
        name: 'Palace setting',
        description:
          'The Justice complex on the Île de la Cité.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sainte-Chapelle',
        url: 'https://www.britannica.com/topic/Sainte-Chapelle',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'glacier',
    code: 'GLA',
    name: 'Glacier',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Glacier National Park', 'Glacier'],
    about:
      'Glacier National Park protects a jagged stretch of the northern Rocky Mountains in Montana, of glacial valleys, alpine lakes, and the Going-to-the-Sun Road crossing the Continental Divide. Peaks and cirques organize classic views; snow and ice still shape high country though glaciers have retreated. Stand at lake shores and pass viewpoints so rock, water, and sky read together. Glacier’s primer is northern Rockies park — alpine lakes and divide roads in Montana’s high country.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Northern Rocky Mountains · Montana',
      role: 'National park of alpine lakes and glacial valleys',
      knownFor: 'Going-to-the-Sun Road, alpine lakes, and jagged peaks',
    },
    features: [
      {
        name: 'Alpine lakes',
        description:
          'Clear waters in glacial valleys.',
      },
      {
        name: 'Going-to-the-Sun Road',
        description:
          'The high road crossing the Continental Divide.',
      },
      {
        name: 'Jagged peaks',
        description:
          'Cirques and ridges of the northern Rockies.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Glacier National Park',
        url: 'https://www.britannica.com/place/Glacier-National-Park-Montana',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Glacier',
        url: 'https://www.nps.gov/glac/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'olympic',
    code: 'OLY',
    name: 'Olympic',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Olympic National Park', 'Olympic'],
    about:
      'Olympic National Park protects a peninsula wilderness in Washington of temperate rainforest, glacier-capped mountains, and wild Pacific beaches within one outline. The Hoh and peer valleys hold mossy giants; Hurricane Ridge opens alpine views; coastal strips face open ocean. Wet west-side weather feeds the forest. Move among rainforest, ridge, and beach as three park worlds. Olympic’s primer is peninsula wilderness park — rainforest, alpine ridge, and Pacific shore in Washington.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Olympic Peninsula · Washington',
      role: 'National park of rainforest, mountains, and coast',
      knownFor: 'Temperate rainforest, Hurricane Ridge, and Pacific beaches',
    },
    features: [
      {
        name: 'Temperate rainforest',
        description:
          'Mossy valleys of the wet western slopes.',
      },
      {
        name: 'Hurricane Ridge',
        description:
          'Alpine viewpoints above the peninsula.',
      },
      {
        name: 'Pacific beaches',
        description:
          'Wild ocean shores of the park coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Olympic National Park',
        url: 'https://www.britannica.com/place/Olympic-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Olympic',
        url: 'https://www.nps.gov/olym/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'zwinger',
    code: 'ZWG',
    name: 'Zwinger',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Zwinger', 'Dresden Zwinger'],
    about:
      'The Zwinger in Dresden is a Baroque palace courtyard complex of galleries, pavilions, and a crown gate enclosing a formal garden court. Sculpture and painted architecture animate the facades; museums occupy the ranges. The ensemble sits near the Elbe historic center. Enter the courtyard so pavilions, gate, and garden axes read together. The Zwinger’s primer is Dresden Baroque court — pavilions and galleries around a ceremonial garden square.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Historic center · Dresden',
      role: 'Baroque palace courtyard and museum complex',
      knownFor: 'Crown gate, pavilions, and formal courtyard',
    },
    features: [
      {
        name: 'Crown gate',
        description:
          'The ornate ceremonial entrance pavilion.',
      },
      {
        name: 'Gallery ranges',
        description:
          'Museum wings enclosing the court.',
      },
      {
        name: 'Formal courtyard',
        description:
          'The garden square at the complex center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zwinger',
        url: 'https://www.britannica.com/topic/Zwinger',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'heidelberg-castle',
    code: 'HDC',
    name: 'Heidelberg Castle',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Heidelberg Castle', 'Schloss Heidelberg'],
    about:
      'Heidelberg Castle crowns a hillside above the Neckar as a vast ruined palace of red sandstone, terraces, and Romantic-era fame overlooking the old town and river bridge. Incomplete rebuilds left a picturesque ruin; gardens and viewpoints organize approaches. Stand on the terrace so ruin, old town, and Neckar align. Heidelberg Castle’s primer is Neckar hillside ruin — red sandstone palace remains above a university town river bend.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Neckar hillside · Heidelberg',
      role: 'Ruined hillside palace and Romantic landmark',
      knownFor: 'Red sandstone ruins, terrace views, and Neckar setting',
    },
    features: [
      {
        name: 'Sandstone ruins',
        description:
          'The red palace remains on the hill.',
      },
      {
        name: 'Terrace views',
        description:
          'Overlooks toward old town and river.',
      },
      {
        name: 'Neckar setting',
        description:
          'The river bend and bridge below the castle.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Heidelberg',
        url: 'https://www.britannica.com/place/Heidelberg',
        kind: 'reference',
      },
    ],
  },
]
