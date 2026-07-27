/** Thirteenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch13: PlaceGuideDraftBatch[] = [
  {
    slug: 'sacramento',
    code: 'SMF',
    name: 'Sacramento',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Sacramento'],
    about:
      'Sacramento occupies the confluence of the Sacramento and American rivers in California’s Central Valley as the state capital and a tree-lined grid of older neighborhoods. The Capitol dome organizes downtown axes; river levees and parkways mark flood-aware edges. Hot summers and cool winters define valley weather. Reading the city starts with the rivers versus the valley floor and the Sierra foothills to the east. Sacramento’s primer is river-valley capital — a governmental core where Gold Rush routes still meet agricultural California.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Sacramento–American confluence · Central Valley',
      role: 'California state capital and valley hub',
      knownFor: 'Capitol dome, river parkways, and Central Valley setting',
    },
    features: [
      {
        name: 'State Capitol',
        description:
          'The domed seat of California government downtown.',
      },
      {
        name: 'River confluence',
        description:
          'Sacramento and American channels framing the urban core.',
      },
      {
        name: 'Valley floor',
        description:
          'Flat agricultural plain surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sacramento',
        url: 'https://www.britannica.com/place/Sacramento-California',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'indianapolis',
    code: 'IND',
    name: 'Indianapolis',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Indianapolis'],
    about:
      'Indianapolis sits near the center of Indiana as a planned Midwestern capital organized around Monument Circle and radiating avenues. The White River cuts a green corridor through the grid; Speedway tradition and cultural districts layer later identity onto the original plan. Humid summers and cold winters mark the year. The useful map is circle and spokes versus river parks and surrounding suburban rings. Indianapolis’s primer is radial plains capital — a monument-centered city on flat Indiana farmland.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Central Indiana · White River',
      role: 'Indiana state capital and Midwestern hub',
      knownFor: 'Monument Circle, White River parks, and radial plan',
    },
    features: [
      {
        name: 'Monument Circle',
        description:
          'The Soldiers and Sailors Monument at the plan’s hub.',
      },
      {
        name: 'White River',
        description:
          'The green corridor threading the urban grid.',
      },
      {
        name: 'Radial avenues',
        description:
          'Diagonal streets spreading from the circle.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Indianapolis',
        url: 'https://www.britannica.com/place/Indianapolis',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oklahoma-city',
    code: 'OKC',
    name: 'Oklahoma City',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Oklahoma City'],
    about:
      'Oklahoma City spreads across the southern Great Plains as Oklahoma’s capital, a metro of wide skies, oil-era towers, and riverfront renewal along the Oklahoma River. Downtown and Bricktown organize nightlife and museums; prairie weather brings thunderstorms and sharp seasonal swings. The geographic hinge is plains horizon versus river corridor and capitol grounds. Oklahoma City’s primer is plains capital — an open-sky state seat where prairie commerce and civic towers share one broad grid.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Southern Great Plains · Oklahoma River',
      role: 'Oklahoma state capital and plains metro',
      knownFor: 'Plains skyline, riverfront districts, and capitol grounds',
    },
    features: [
      {
        name: 'Downtown skyline',
        description:
          'Towers rising from the open plains grid.',
      },
      {
        name: 'Oklahoma River',
        description:
          'The landscaped corridor through the urban core.',
      },
      {
        name: 'Capitol grounds',
        description:
          'The statehouse complex on the city’s north side.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oklahoma City',
        url: 'https://www.britannica.com/place/Oklahoma-City',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'winnipeg',
    code: 'YWG',
    name: 'Winnipeg',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Winnipeg'],
    about:
      'Winnipeg stands at the forks of the Red and Assiniboine rivers in southern Manitoba as the prairie city’s long-standing commercial and cultural hub. The Forks and Exchange District organize river and warehouse heritage; brutal winters and bright summers bookend the year. Map the city from river confluence outward to prairie suburbs and lake country beyond. Winnipeg’s primer is prairie forks city — a continental interior capital of rivers, cold, and warehouse brick.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Red–Assiniboine forks · southern Manitoba',
      role: 'Manitoba’s largest city and prairie hub',
      knownFor: 'The Forks, Exchange District, and prairie winters',
    },
    features: [
      {
        name: 'The Forks',
        description:
          'The historic confluence of Red and Assiniboine.',
      },
      {
        name: 'Exchange District',
        description:
          'Warehouse blocks of early prairie commerce.',
      },
      {
        name: 'Prairie setting',
        description:
          'Open farmland and sky surrounding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Winnipeg',
        url: 'https://www.britannica.com/place/Winnipeg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cordoba-ar',
    code: 'CBA',
    name: 'Córdoba',
    kind: 'City',
    countrySlug: 'argentina',
    subtitle: 'City · Argentina',
    matchNames: ['Córdoba', 'Cordoba'],
    about:
      'Córdoba occupies central Argentina’s sierras edge as the country’s second-largest metro, a colonial university city turned industrial and educational hub. The Jesuit block and cathedral square still organize the historic core; foothills rise west toward weekend sierra towns. Hot summers and mild winters frame the year. Begin with plaza and colonial grid, then the sierras that pull the city off the flat pampa. Córdoba’s primer is sierra-edge city — colonial stone and modern sprawl at the door of Argentina’s central mountains.',
    facts: {
      kind: 'City',
      country: 'Argentina',
      region: 'Americas',
      setting: 'Central Argentina · Sierras de Córdoba',
      role: 'Major inland metro and university city',
      knownFor: 'Jesuit block, cathedral square, and sierra foothills',
    },
    features: [
      {
        name: 'Colonial core',
        description:
          'Plaza, cathedral, and Jesuit heritage blocks.',
      },
      {
        name: 'University city',
        description:
          'Long academic tradition shaping the urban fabric.',
      },
      {
        name: 'Sierra foothills',
        description:
          'Rising ground west of the pampa edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Córdoba',
        url: 'https://www.britannica.com/place/Cordoba-Argentina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'asuncion',
    code: 'ASU',
    name: 'Asunción',
    kind: 'City',
    countrySlug: 'paraguay',
    subtitle: 'City · Paraguay',
    matchNames: ['Asunción', 'Asuncion'],
    about:
      'Asunción faces the Paraguay River as the nation’s capital, a low-rise riverside city of bay curves, colonial streets, and humid subtropical air. The bayfront and historic center organize civic life; heat and river humidity shape daily rhythm. Cross-river views look toward Argentina’s Chaco edge. Place yourself on the bay and colonial streets first, then the inland neighborhoods climbing gently from the water. Asunción’s primer is river-bay capital — Paraguay’s political seat on a humid bend of the great inland waterway.',
    facts: {
      kind: 'City',
      country: 'Paraguay',
      region: 'Americas',
      setting: 'Paraguay River bay · southern Paraguay',
      role: 'National capital and river port city',
      knownFor: 'River bayfront, colonial streets, and humid climate',
    },
    features: [
      {
        name: 'River bay',
        description:
          'The curved Paraguay River waterfront.',
      },
      {
        name: 'Historic center',
        description:
          'Colonial streets and civic squares near the water.',
      },
      {
        name: 'Humid lowlands',
        description:
          'Subtropical air over the riverine plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Asunción',
        url: 'https://www.britannica.com/place/Asuncion',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'goiania',
    code: 'GYN',
    name: 'Goiânia',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Goiânia', 'Goiania'],
    about:
      'Goiânia is a planned twentieth-century capital of Goiás on Brazil’s central plateau, laid out with broad avenues, parks, and art-deco civic buildings. Cerrado vegetation and a distinct dry season define the highland climate; Brasília lies farther east on the same plateau family. The plan’s parks and radial avenues are the first landmarks, then the plateau horizon beyond the metro. Goiânia’s primer is cerrado planned capital — a green-grid highland city built for a new state seat in Brazil’s interior.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Central plateau · Goiás',
      role: 'Goiás state capital and planned highland city',
      knownFor: 'Planned avenues, parks, and cerrado setting',
    },
    features: [
      {
        name: 'Planned avenues',
        description:
          'Broad streets of the twentieth-century layout.',
      },
      {
        name: 'Urban parks',
        description:
          'Large green spaces woven into the grid.',
      },
      {
        name: 'Cerrado plateau',
        description:
          'Highland savanna landscape around the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Goiânia',
        url: 'https://www.britannica.com/place/Goiania',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'zagreb',
    code: 'ZAG',
    name: 'Zagreb',
    kind: 'City',
    countrySlug: 'croatia',
    subtitle: 'City · Croatia',
    matchNames: ['Zagreb'],
    about:
      'Zagreb occupies the Sava River plain beneath Medvednica’s forested massif as Croatia’s capital, pairing a hilltop Upper Town with a nineteenth-century Lower Town grid. Cathedral spires and Ban Jelačić Square organize daily movement; cafés fill the pedestrian core. Continental seasons bring cold winters and warm summers. Climb from the Lower Town squares into the Upper Town ridges, then the mountain backdrop north of the city. Zagreb’s primer is hillside capital — twin historic towns under a green massif at Croatia’s inland heart.',
    facts: {
      kind: 'City',
      country: 'Croatia',
      region: 'Europe',
      setting: 'Sava plain · Medvednica foothills',
      role: 'National capital and inland cultural hub',
      knownFor: 'Upper Town, cathedral spires, and Medvednica backdrop',
    },
    features: [
      {
        name: 'Upper Town',
        description:
          'Hilltop streets of medieval and baroque Zagreb.',
      },
      {
        name: 'Lower Town',
        description:
          'Nineteenth-century grid and civic squares.',
      },
      {
        name: 'Medvednica',
        description:
          'The forested massif rising north of the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zagreb',
        url: 'https://www.britannica.com/place/Zagreb',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sarajevo',
    code: 'SJJ',
    name: 'Sarajevo',
    kind: 'City',
    countrySlug: 'bosnia-and-herzegovina',
    subtitle: 'City · Bosnia and Herzegovina',
    matchNames: ['Sarajevo'],
    about:
      'Sarajevo fills a narrow valley of the Miljacka River beneath surrounding Bosnian hills, a capital where Ottoman bazaar lanes meet Austro-Hungarian avenues in one continuous street fabric. Baščaršija’s mosques and craft streets still mark the eastern core; later civic blocks open westward along the valley. Mountain winters and warm summers define the basin climate. Trace the river through the bazaar, then the hillside neighborhoods climbing both flanks. Sarajevo’s primer is valley capital — Ottoman and Habsburg layers sharing one mountain-hemmed corridor.',
    facts: {
      kind: 'City',
      country: 'Bosnia and Herzegovina',
      region: 'Europe',
      setting: 'Miljacka valley · central Bosnia',
      role: 'National capital and historic crossroads city',
      knownFor: 'Baščaršija, valley setting, and layered street fabric',
    },
    features: [
      {
        name: 'Baščaršija',
        description:
          'The Ottoman bazaar core of mosques and lanes.',
      },
      {
        name: 'Miljacka valley',
        description:
          'The river corridor hemmed by steep hills.',
      },
      {
        name: 'Hillside neighborhoods',
        description:
          'Residential slopes rising from the basin floor.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sarajevo',
        url: 'https://www.britannica.com/place/Sarajevo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kochi',
    code: 'COK',
    name: 'Kochi',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Kochi', 'Cochin'],
    about:
      'Kochi (Cochin) faces the Arabian Sea and a network of Kerala backwaters as a historic spice-port metro of islands, ferries, and monsoon light. Fort Kochi’s colonial waterfront and Chinese fishing nets still stage the harbor edge; Ernakulam’s mainland grid holds the modern commercial core. Tropical wet seasons dominate the calendar. Cross by ferry from mainland avenues to the peninsula’s heritage shore, then the lagoon channels inland. Kochi’s primer is backwater port — a Kerala harbor city of spice-trade islands and monsoon coasts.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Arabian Sea · Kerala backwaters',
      role: 'Major Kerala port and commercial metro',
      knownFor: 'Harbor islands, fishing nets, and backwater channels',
    },
    features: [
      {
        name: 'Fort Kochi waterfront',
        description:
          'Colonial shore and Chinese fishing nets.',
      },
      {
        name: 'Harbor islands',
        description:
          'Ferry-linked landforms of the metro.',
      },
      {
        name: 'Backwater channels',
        description:
          'Lagoon waterways inland from the coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kochi',
        url: 'https://www.britannica.com/place/Kochi-India',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hiroshima',
    code: 'HIJ',
    name: 'Hiroshima',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Hiroshima'],
    about:
      'Hiroshima occupies a delta of the Ōta River on Japan’s Seto Inland Sea as a rebuilt prefectural capital of broad boulevards, river islands, and Peace Memorial Park. Tram lines still stitch the grid; Miyajima’s sacred island rises offshore in the bay. Mild winters and humid summers define the coastal climate. Follow the river channels through the park and downtown, then the bay approaches toward the islands. Hiroshima’s primer is delta peace city — a rebuilt Inland Sea capital where memorial ground and everyday river life share one urban plain.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Ōta River delta · Seto Inland Sea',
      role: 'Prefectural capital and memorial city',
      knownFor: 'Peace Memorial Park, river delta, and bay islands',
    },
    features: [
      {
        name: 'Peace Memorial Park',
        description:
          'The riverside memorial ground in the urban core.',
      },
      {
        name: 'River delta',
        description:
          'Ōta channels dividing the city into islands.',
      },
      {
        name: 'Inland Sea bay',
        description:
          'Coastal approaches toward Miyajima and peers.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hiroshima',
        url: 'https://www.britannica.com/place/Hiroshima-Japan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'leuven',
    code: 'LUV',
    name: 'Leuven',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Leuven', 'Louvain'],
    about:
      'Leuven (Louvain) sits on the Dyle in Flemish Brabant as a compact university town of late-Gothic stone, beer heritage, and dense student streets. The Town Hall’s sculpted façades and the Great Beguinage organize the historic core; fields and suburbs ring the small basin. Mild maritime seasons keep outdoor life active most of the year. Stay with the market square and beguinage fabric before the ring roads. Leuven’s primer is Brabant university town — Gothic civic stone and scholarly streets in a short walk from open Flemish countryside.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Dyle valley · Flemish Brabant',
      role: 'University city and historic Brabant town',
      knownFor: 'Town Hall, beguinage, and university streets',
    },
    features: [
      {
        name: 'Town Hall',
        description:
          'The elaborately sculpted late-Gothic civic façade.',
      },
      {
        name: 'Great Beguinage',
        description:
          'The UNESCO-listed historic residential quarter.',
      },
      {
        name: 'University streets',
        description:
          'Dense lanes shaped by student and scholarly life.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Leuven',
        url: 'https://www.britannica.com/place/Leuven',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ohio',
    code: 'OH',
    name: 'Ohio',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Ohio'],
    about:
      'Ohio stretches from Lake Erie south to the Ohio River as a Midwestern state of glacial plains, wooded hills, and a chain of industrial and capital cities. Cleveland faces the lake; Columbus anchors the center; Cincinnati sits on the river bends. Humid continental seasons bring lake-effect snow and warm summers. Read the state as lake shore, till plains, and Appalachian foothills rather than one landscape. Ohio’s primer is Great Lakes–Ohio River span — farmland, factories, and river towns across the Midwestern crossroads.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Erie to Ohio River',
      role: 'Midwestern state of lake, plains, and river cities',
      knownFor: 'Lake Erie shore, till plains, and Ohio River valley',
    },
    features: [
      {
        name: 'Lake Erie shore',
        description:
          'Northern waterfront cities and lakefront parks.',
      },
      {
        name: 'Till plains',
        description:
          'Glacial farmland of the state’s interior.',
      },
      {
        name: 'Ohio River valley',
        description:
          'Southern bends and hillside river towns.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ohio',
        url: 'https://www.britannica.com/place/Ohio-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'new-brunswick',
    code: 'NB',
    name: 'New Brunswick',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'Province · Canada',
    matchNames: ['New Brunswick'],
    about:
      'New Brunswick occupies Canada’s Atlantic elbow between Quebec, Nova Scotia, and the Gulf of St. Lawrence, a bilingual province of Fundy tides, Acadian shores, and forested river valleys. Saint John and Moncton organize urban life; the Bay of Fundy’s extreme tides shape coastal rhythm. Cool maritime seasons dominate. Start with Fundy shore, then inland rivers and the Acadian coastline along the gulf. New Brunswick’s primer is Fundy–Acadian province — tide-carved coasts and forested valleys at the Maritime hinge.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Bay of Fundy · Gulf of St. Lawrence',
      role: 'Atlantic Canadian province of tides and forests',
      knownFor: 'Fundy tides, Acadian coast, and forested valleys',
    },
    features: [
      {
        name: 'Bay of Fundy',
        description:
          'Extreme tidal shores of the southwest.',
      },
      {
        name: 'Acadian coast',
        description:
          'Gulf and Northumberland shore communities.',
      },
      {
        name: 'River forests',
        description:
          'Wooded valleys of the provincial interior.',
      },
    ],
    sources: [
      {
        label: 'Britannica — New Brunswick',
        url: 'https://www.britannica.com/place/New-Brunswick',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'maharashtra',
    code: 'MH',
    name: 'Maharashtra',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Maharashtra'],
    about:
      'Maharashtra covers a vast swath of western India from the Arabian Sea and Mumbai’s metropolitan coast across the Western Ghats to Deccan plateau farms and temple towns. Monsoon rains green the ghats; the plateau’s drier interior holds cotton and historic forts. Mumbai anchors the coast; Pune and Nagpur organize inland poles. Treat the state as coast, ghat escarpment, and Deccan tableland in sequence. Maharashtra’s primer is western Deccan state — monsoon mountains, coastal megacity, and plateau forts in one administrative outline.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Arabian Sea · Western Ghats · Deccan',
      role: 'Major western Indian state of coast and plateau',
      knownFor: 'Western Ghats, Deccan forts, and coastal megacity',
    },
    features: [
      {
        name: 'Western Ghats',
        description:
          'Monsoon escarpment rising from the Konkan.',
      },
      {
        name: 'Deccan plateau',
        description:
          'Interior tableland of farms and fort hills.',
      },
      {
        name: 'Konkan coast',
        description:
          'Arabian Sea shore and Mumbai metro edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Maharashtra',
        url: 'https://www.britannica.com/place/Maharashtra',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'amorgos',
    code: 'AMO',
    name: 'Amorgos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Amorgos'],
    about:
      'Amorgos is a long, cliff-backed Cycladic island in the eastern Aegean, known for steep drop-offs into deep blue water and whitewashed villages clinging to ridges. Chora’s windmill-topped lanes and the cliffside Hozoviotissa monastery organize classic approaches; beaches hide in coves below the walls of rock. Dry summers and mild winters define the island year. Approach from harbor villages up to the ridge Chora, then the monastery ledge above the sea. Amorgos’s primer is cliff Cyclades — a narrow island of vertical rock, deep water, and ridge-top white villages.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Eastern Cyclades · Aegean Sea',
      role: 'Cliff-backed Cycladic island',
      knownFor: 'Sea cliffs, Hozoviotissa, and ridge-top Chora',
    },
    features: [
      {
        name: 'Sea cliffs',
        description:
          'Steep rock walls dropping into deep water.',
      },
      {
        name: 'Hozoviotissa',
        description:
          'The white monastery ledge on the cliff face.',
      },
      {
        name: 'Chora ridge',
        description:
          'Windmill lanes of the inland hill town.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Amorgos',
        url: 'https://www.britannica.com/place/Amorgos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'karpathos',
    code: 'AOK',
    name: 'Karpathos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Karpathos'],
    about:
      'Karpathos lies between Crete and Rhodes as a long Dodecanese ridge of wind-scoured mountains, traditional villages, and wilder northern coasts. Olympos preserves older island dress and terrace agriculture; Pigadia serves as the main harbor on the southeast. Meltemi winds and dry summers shape outdoor life. Move from the southern harbor up the spine toward remote northern settlements. Karpathos’s primer is Dodecanese ridge island — mountain villages and windy shores on a long Aegean spine between Crete and Rhodes.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Dodecanese · between Crete and Rhodes',
      role: 'Mountainous Dodecanese island',
      knownFor: 'Olympos village, mountain spine, and windy coasts',
    },
    features: [
      {
        name: 'Mountain spine',
        description:
          'The long ridgeline running the island’s length.',
      },
      {
        name: 'Olympos',
        description:
          'The traditional northern hill village.',
      },
      {
        name: 'Windy coasts',
        description:
          'Exposed shores shaped by Aegean meltemi.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Karpathos',
        url: 'https://www.britannica.com/place/Karpathos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'la-graciosa',
    code: 'GRC',
    name: 'La Graciosa',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['La Graciosa'],
    about:
      'La Graciosa is a small, mostly vehicle-light Canary Island north of Lanzarote, of pale dunes, volcanic cones, and turquoise shallows inside a marine reserve. Caleta de Sebo is the ferry village; unpaved tracks lead to beaches under the shadow of Lanzarote’s cliffs across the strait. Mild Atlantic trade-wind weather prevails. Land at Caleta de Sebo, then walk or cycle toward the dunes and coves. La Graciosa’s primer is dune Canary islet — pale sand, low volcanoes, and clear water just off Lanzarote’s northern wall.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Chinijo Archipelago · north of Lanzarote',
      role: 'Small Canary Island in a marine reserve',
      knownFor: 'Dunes, volcanic cones, and turquoise shallows',
    },
    features: [
      {
        name: 'Pale dunes',
        description:
          'Sandy ridges behind the island beaches.',
      },
      {
        name: 'Caleta de Sebo',
        description:
          'The ferry village and only sizable settlement.',
      },
      {
        name: 'Marine shallows',
        description:
          'Clear turquoise water of the reserve.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Canary Islands',
        url: 'https://www.britannica.com/place/Canary-Islands',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'arran',
    code: 'ARN',
    name: 'Isle of Arran',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Arran', 'Arran'],
    about:
      'The Isle of Arran sits in Scotland’s Firth of Clyde as a compact island often called a Scotland in miniature, pairing Highland granite peaks with gentler southern farmland. Goatfell anchors the northern skyline; Brodick and ferry approaches organize arrival. Atlantic weather brings quick-changing cloud and rain. Cross from the east-coast ferry towns into the mountain north, then the softer south. Arran’s primer is Clyde miniature Scotland — granite Highlands and Lowland fields sharing one Firth island.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Firth of Clyde · Scotland',
      role: 'Scenic Clyde island of Highland and Lowland landscapes',
      knownFor: 'Goatfell, Brodick approaches, and dual landscapes',
    },
    features: [
      {
        name: 'Goatfell',
        description:
          'The granite summit of the northern massif.',
      },
      {
        name: 'Firth shores',
        description:
          'Ferry coasts facing the Scottish mainland.',
      },
      {
        name: 'Southern farmland',
        description:
          'Gentler fields contrasting the Highland north.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Arran',
        url: 'https://www.britannica.com/place/Arran',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'st-barthelemy',
    code: 'SBH',
    name: 'Saint Barthélemy',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Saint Barthélemy', 'St. Barthélemy', 'St Barts', 'St. Barts'],
    about:
      'Saint Barthélemy (St. Barts) is a small French Caribbean island of steep green hills, yacht harbors, and pocket beaches in the northern Lesser Antilles. Gustavia’s harbor and red-roofed town face a sheltered bay; dry scrub and trade winds shape the ridges. Tropical warmth and a short rainy peak define the year. Enter through Gustavia’s horseshoe harbor, then the hill roads to beach coves. St. Barts’s primer is French Antillean islet — a compact harbor island of steep slopes and turquoise pocket bays.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'Northern Lesser Antilles · Caribbean',
      role: 'French Caribbean island of harbor and hills',
      knownFor: 'Gustavia harbor, pocket beaches, and steep hills',
    },
    features: [
      {
        name: 'Gustavia harbor',
        description:
          'The sheltered bay and red-roofed port town.',
      },
      {
        name: 'Pocket beaches',
        description:
          'Small sandy coves between rocky points.',
      },
      {
        name: 'Steep hills',
        description:
          'Green ridges rising quickly from the shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saint-Barthélemy',
        url: 'https://www.britannica.com/place/Saint-Barthelemy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'anguilla',
    code: 'AIA',
    name: 'Anguilla',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Anguilla'],
    about:
      'Anguilla is a low-lying British Overseas Territory in the northern Lesser Antilles, famous for long pale beaches, shallow turquoise water, and a coral-island profile without high volcanic peaks. The Valley organizes inland settlement; resorts and fishing villages face the Caribbean and Atlantic edges. Trade-wind dryness keeps vegetation scrubbier than rainier neighbors. Follow the beach rim around the flat limestone island rather than climbing inland heights. Anguilla’s primer is coral beach island — pale sand and clear shallows on a low British Caribbean ridge.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Americas',
      setting: 'Northern Lesser Antilles · Caribbean',
      role: 'British Overseas Territory of beaches and reefs',
      knownFor: 'Pale beaches, turquoise shallows, and low limestone profile',
    },
    features: [
      {
        name: 'Pale beaches',
        description:
          'Long sandy shores of the coral island.',
      },
      {
        name: 'Turquoise shallows',
        description:
          'Clear nearshore water over light sand.',
      },
      {
        name: 'Low limestone ridge',
        description:
          'Flat coral terrain without volcanic peaks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Anguilla',
        url: 'https://www.britannica.com/place/Anguilla-island-West-Indies',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'puglia',
    code: 'PUG',
    name: 'Puglia',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Puglia', 'Apulia'],
    about:
      'Puglia (Apulia) forms the heel of Italy’s boot as a region of olive plains, Adriatic and Ionian coasts, and whitewashed towns of trulli and baroque facades. The Valle d’Itria and Salento peninsula organize classic itineraries; limestone and dry-stone walls mark the rural fabric. Hot summers and mild winters favor outdoor markets and sea swimming. Move from Adriatic ports inland to olive plateaus, then south into Salento’s dual shores. Puglia’s primer is heel of Italy — olive plains, trulli cones, and two-sea coasts on the Adriatic–Ionian tip.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Heel of Italy · Adriatic and Ionian',
      role: 'Southern Italian region of olives and coasts',
      knownFor: 'Trulli towns, olive plains, and dual-sea shores',
    },
    features: [
      {
        name: 'Olive plains',
        description:
          'Vast groves on the limestone plateau.',
      },
      {
        name: 'Trulli towns',
        description:
          'Cone-roofed settlements of the Valle d’Itria.',
      },
      {
        name: 'Dual-sea coasts',
        description:
          'Adriatic and Ionian shores of the heel.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Puglia',
        url: 'https://www.britannica.com/place/Puglia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'carinthia',
    code: 'CAR',
    name: 'Carinthia',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Carinthia', 'Kärnten'],
    about:
      'Carinthia (Kärnten) occupies Austria’s southern lake country beneath Alpine and Karawanken ranges, a province of warm swimming lakes, mountain backdrops, and bilingual border culture. Wörthersee and neighboring lakes organize summer tourism; Klagenfurt anchors the basin. Continental summers can be notably warm for Alpine latitudes. Begin with the lake basin, then the enclosing mountain walls to the south and north. Carinthia’s primer is southern Austrian lake province — warm-water basins under Alpine ridges near the Slovenian border.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Southern Austria · Alpine lake basin',
      role: 'Lake-and-mountain province of southern Austria',
      knownFor: 'Wörthersee, Alpine backdrops, and warm lake summers',
    },
    features: [
      {
        name: 'Lake basin',
        description:
          'Wörthersee and neighboring swimming lakes.',
      },
      {
        name: 'Alpine walls',
        description:
          'Mountain ranges enclosing the province.',
      },
      {
        name: 'Border culture',
        description:
          'Southern ties toward Slovenia and Italy.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Carinthia',
        url: 'https://www.britannica.com/place/Carinthia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'barossa-valley',
    code: 'BRV',
    name: 'Barossa Valley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Barossa Valley', 'Barossa'],
    about:
      'The Barossa Valley northwest of Adelaide is a South Australian wine region of German-settler heritage, old vineyards, and broad valley floors beneath low ranges. Shiraz and other plantings cover the floor; stone churches and cellar doors punctuate village roads. Mediterranean-leaning summers and cool winters favor viticulture. Drive the valley floor between cellar towns with the ranges as sidewalls. Barossa’s primer is South Australian wine valley — old vines, settler villages, and open vineyard floors near Adelaide.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'South Australia · northwest of Adelaide',
      role: 'Historic wine valley of South Australia',
      knownFor: 'Old vineyards, cellar doors, and valley floor towns',
    },
    features: [
      {
        name: 'Vineyard floor',
        description:
          'Broad plantings across the valley bottom.',
      },
      {
        name: 'Cellar villages',
        description:
          'Towns of churches, stone, and tasting rooms.',
      },
      {
        name: 'Low ranges',
        description:
          'Hills enclosing the wine-growing basin.',
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
    slug: 'extremadura',
    code: 'EXT',
    name: 'Extremadura',
    kind: 'Region',
    countrySlug: 'spain',
    subtitle: 'Region · Spain',
    matchNames: ['Extremadura'],
    about:
      'Extremadura covers inland western Spain as a region of dehesa oak pastures, Roman and medieval towns, and hot dry summers toward the Portuguese border. Cáceres and Mérida hold stone historic cores; storks and cork oaks mark rural horizons. Continental heat and mild winters define the plateau year. Move from walled historic towns out into open dehesa country and reservoir valleys. Extremadura’s primer is western Iberian plateau — dehesa light, stork towers, and Roman–medieval stone between Madrid and Portugal.',
    facts: {
      kind: 'Region',
      country: 'Spain',
      region: 'Europe',
      setting: 'Western Spain · Portuguese borderlands',
      role: 'Inland region of dehesa and historic towns',
      knownFor: 'Dehesa pastures, Cáceres, and Mérida heritage',
    },
    features: [
      {
        name: 'Dehesa pastures',
        description:
          'Oak-studded grazing lands of the plateau.',
      },
      {
        name: 'Historic towns',
        description:
          'Cáceres, Mérida, and peer stone cores.',
      },
      {
        name: 'Hot plateau',
        description:
          'Dry summers of the western interior.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Extremadura',
        url: 'https://www.britannica.com/place/Extremadura',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'maramures',
    code: 'MRM',
    name: 'Maramureș',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Maramureș', 'Maramures'],
    about:
      'Maramureș occupies northern Romania’s Carpathian valleys as a region of wooden churches, carved gates, and living village traditions along the Iza and related rivers. Tall shingle spires and timber farmsteads still organize rural skylines; forested mountains enclose the basins. Cold winters and green summers define the highland year. Follow river valleys from village to village under the church steeples. Maramureș’s primer is Carpathian wooden-church country — timber spires, carved gates, and valley villages in Romania’s far north.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Northern Carpathians · Romania',
      role: 'Highland region of wooden churches and villages',
      knownFor: 'Wooden church spires, carved gates, and valley villages',
    },
    features: [
      {
        name: 'Wooden churches',
        description:
          'Tall timber spires of UNESCO village churches.',
      },
      {
        name: 'Carved gates',
        description:
          'Ornamented farmstead entrances along lanes.',
      },
      {
        name: 'Carpathian valleys',
        description:
          'Forested basins of the northern mountains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Maramureș',
        url: 'https://www.britannica.com/place/Maramures',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Wooden Churches of Maramureș',
        url: 'https://whc.unesco.org/en/list/904/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'big-ben',
    code: 'BIG',
    name: 'Big Ben',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Big Ben', 'Elizabeth Tower'],
    about:
      'Big Ben is the popular name for the Great Bell and, by extension, the Elizabeth Tower at the north end of the Palace of Westminster in London. The Gothic Revival clock tower rises above the Thames and Parliament; its dials and chimes organize the Westminster skyline. The landmark sits within the parliamentary estate beside Westminster Bridge approaches. Stand on the river and bridge approaches to read tower versus palace and Thames. Big Ben’s primer is Westminster clock tower — Gothic stone, four dials, and parliamentary silhouette on the Thames.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Palace of Westminster · London',
      role: 'Clock tower of the UK Parliament',
      knownFor: 'Gothic clock tower, dials, and Thames setting',
    },
    features: [
      {
        name: 'Elizabeth Tower',
        description:
          'The Gothic Revival clock tower itself.',
      },
      {
        name: 'Clock dials',
        description:
          'The four illuminated faces of the tower.',
      },
      {
        name: 'Parliament setting',
        description:
          'The palace and Thames beside Westminster.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Big Ben',
        url: 'https://www.britannica.com/topic/Big-Ben-clock-London',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'notre-dame',
    code: 'NDP',
    name: 'Notre-Dame',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Notre-Dame', 'Notre-Dame de Paris', 'Notre Dame'],
    about:
      'Notre-Dame de Paris stands on the Île de la Cité as the French capital’s great Gothic cathedral of twin towers, flying buttresses, and a Seine-island setting. The west façade’s portals and rose window organize the classic approach; the river wraps both flanks of the island. Centuries of building and restoration shaped the silhouette known worldwide. Read the cathedral from the parvis and bridges that reveal towers, apse, and buttresses together. Notre-Dame’s primer is Île de la Cité Gothic — twin towers and flying buttresses at the historic heart of Paris.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Île de la Cité · Paris',
      role: 'Gothic cathedral of Paris',
      knownFor: 'Twin towers, flying buttresses, and Seine island setting',
    },
    features: [
      {
        name: 'West façade',
        description:
          'Twin towers, portals, and rose window.',
      },
      {
        name: 'Flying buttresses',
        description:
          'The exterior supports around the apse.',
      },
      {
        name: 'Seine island',
        description:
          'The Île de la Cité setting in the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Notre-Dame de Paris',
        url: 'https://www.britannica.com/topic/Notre-Dame-de-Paris',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lincoln-memorial',
    code: 'LNM',
    name: 'Lincoln Memorial',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Lincoln Memorial'],
    about:
      'The Lincoln Memorial occupies the western end of the National Mall in Washington, D.C., as a Doric temple memorial housing a seated statue of Abraham Lincoln. The reflecting pool and Washington Monument axis organize the approach from the east; the Potomac lies behind the temple. White marble and open steps create a civic stage for gatherings. Approach along the Mall axis so the temple, pool, and monument read as one composition. The Lincoln Memorial’s primer is Mall-end temple — a Doric shrine and seated statue closing the capital’s central axis.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'National Mall · Washington, D.C.',
      role: 'Presidential memorial temple on the Mall',
      knownFor: 'Doric temple, seated Lincoln, and reflecting pool axis',
    },
    features: [
      {
        name: 'Doric temple',
        description:
          'The columned marble exterior on the Mall.',
      },
      {
        name: 'Seated Lincoln',
        description:
          'The monumental statue within the chamber.',
      },
      {
        name: 'Reflecting pool axis',
        description:
          'The long water approach toward the Monument.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lincoln Memorial',
        url: 'https://www.britannica.com/topic/Lincoln-Memorial',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Lincoln Memorial',
        url: 'https://www.nps.gov/linc/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mount-rainier',
    code: 'RNI',
    name: 'Mount Rainier',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Mount Rainier', 'Mt. Rainier', 'Rainier'],
    about:
      'Mount Rainier is an ice-clad Cascade stratovolcano in Washington State, rising above forests and meadows as the dominant peak of the southern Puget Sound skyline on clear days. Glaciers and Paradise meadows organize classic park approaches; clouds often hide the summit. Pacific Northwest weather brings heavy snow and sudden clearing. View the mountain from lowland approaches and park roads that reveal glaciers against dark forest. Mount Rainier’s primer is Cascade ice volcano — a glaciated cone of meadows, snow, and regional skyline presence.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Cascade Range · Washington',
      role: 'Glaciated stratovolcano and national park centerpiece',
      knownFor: 'Ice-clad summit, Paradise meadows, and Cascade presence',
    },
    features: [
      {
        name: 'Ice-clad summit',
        description:
          'The glaciated volcanic cone itself.',
      },
      {
        name: 'Paradise meadows',
        description:
          'Flower meadows and glacier views on the south side.',
      },
      {
        name: 'Cascade forests',
        description:
          'Evergreen slopes surrounding the mountain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Rainier',
        url: 'https://www.britannica.com/place/Mount-Rainier',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Mount Rainier',
        url: 'https://www.nps.gov/mora/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'red-square',
    code: 'RDS',
    name: 'Red Square',
    kind: 'Landmark',
    countrySlug: 'russia',
    subtitle: 'Landmark · Russia',
    matchNames: ['Red Square'],
    about:
      'Red Square is the central open plaza of Moscow beside the Kremlin walls, framed by Saint Basil’s colorful onion domes, the GUM arcade, and the State Historical Museum. Cobblestones and ceremonial axes organize the space; the square has long hosted parades and public gatherings. The Kremlin’s brick towers form the western edge. Stand so Saint Basil’s, the Kremlin wall, and the long plaza read together. Red Square’s primer is Kremlin forecourt — onion domes, brick towers, and ceremonial cobbles at Moscow’s historic core.',
    facts: {
      kind: 'Landmark',
      country: 'Russia',
      region: 'Europe',
      setting: 'Beside the Kremlin · Moscow',
      role: 'Central ceremonial plaza of Moscow',
      knownFor: 'Saint Basil’s, Kremlin wall, and ceremonial plaza',
    },
    features: [
      {
        name: 'Saint Basil’s',
        description:
          'The multicolored onion-dome cathedral at the square’s end.',
      },
      {
        name: 'Kremlin wall',
        description:
          'Brick towers and battlements along the west edge.',
      },
      {
        name: 'Ceremonial plaza',
        description:
          'The open cobbled space of public gatherings.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Red Square',
        url: 'https://www.britannica.com/topic/Red-Square',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Kremlin and Red Square',
        url: 'https://whc.unesco.org/en/list/545/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cn-tower',
    code: 'CNT',
    name: 'CN Tower',
    kind: 'Landmark',
    countrySlug: 'canada',
    subtitle: 'Landmark · Canada',
    matchNames: ['CN Tower'],
    about:
      'The CN Tower rises above Toronto’s downtown lakefront as a concrete communications and observation tower that long defined the city’s skyline height. The main pod and antenna spire organize the silhouette; Lake Ontario and the downtown grid provide the setting. Clear days reveal the lake and distant Niagara escarpment from upper levels. Read the tower from the waterfront and railway lands so the pod stands against lake and skyline. The CN Tower’s primer is Toronto skyline mast — a concrete observation spire anchoring the lakefront verticals.',
    facts: {
      kind: 'Landmark',
      country: 'Canada',
      region: 'Americas',
      setting: 'Downtown lakefront · Toronto',
      role: 'Communications and observation tower',
      knownFor: 'Skyline height, observation pod, and lakefront setting',
    },
    features: [
      {
        name: 'Observation pod',
        description:
          'The main capsule high on the concrete shaft.',
      },
      {
        name: 'Antenna spire',
        description:
          'The slender top mast above the pod.',
      },
      {
        name: 'Lakefront setting',
        description:
          'Lake Ontario and downtown at the tower’s base.',
      },
    ],
    sources: [
      {
        label: 'Britannica — CN Tower',
        url: 'https://www.britannica.com/topic/CN-Tower',
        kind: 'reference',
      },
    ],
  },
]
