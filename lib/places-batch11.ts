/** Eleventh curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch11: PlaceGuideDraftBatch[] = [
  {
    slug: 'kansas-city',
    code: 'MCI',
    name: 'Kansas City',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Kansas City'],
    about:
      'Kansas City straddles the Missouri–Kansas state line at the Missouri River’s great bend, a Midwestern metro of fountains, barbecue, and a rebuilt downtown skyline. The Country Club Plaza and Crossroads Arts District organize civic style; stockyards history still colors the west bottoms. Hot summers and cold winters frame the year. Orientation is Missouri-side core versus Kansas suburbs across the state line. Kansas City’s primer is river-bend Midwestern hub — fountains, jazz rooms, and a skyline rising where prairie commerce met the Missouri.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Missouri River bend · bistate metro',
      role: 'Major Midwestern commercial and cultural hub',
      knownFor: 'Fountains, Plaza district, and Missouri River setting',
    },
    features: [
      {
        name: 'Country Club Plaza',
        description:
          'A landmark shopping district of Spanish-inspired façades.',
      },
      {
        name: 'Missouri riverfront',
        description:
          'The bend and bottoms that seated the city’s growth.',
      },
      {
        name: 'Downtown skyline',
        description:
          'Rebuilt towers organizing the Missouri-side core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kansas City',
        url: 'https://www.britannica.com/place/Kansas-City-Missouri',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cleveland',
    code: 'CLE',
    name: 'Cleveland',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Cleveland'],
    about:
      'Cleveland occupies Lake Erie’s southern shore in northern Ohio as a Great Lakes industrial city remade around museums, sports, and a lake-front civic mall. The Cuyahoga River valley cuts the metro; Terminal Tower still marks downtown. Lake-effect winters shape the climate. Orientation is lakefront Mall versus Flats and eastern suburbs. Cleveland’s primer is Lake Erie city — a shoreline skyline and river valley where Midwest industry met the Great Lakes shipping lane.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Lake Erie · Cuyahoga River',
      role: 'Northeast Ohio hub and Great Lakes port city',
      knownFor: 'Lakefront mall, Terminal Tower, and Cuyahoga valley',
    },
    features: [
      {
        name: 'Lake Erie shore',
        description:
          'Civic mall and parkland facing the open lake.',
      },
      {
        name: 'Cuyahoga Flats',
        description:
          'The river valley of former industry below downtown.',
      },
      {
        name: 'Terminal Tower',
        description:
          'The historic skyscraper anchoring Public Square.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cleveland',
        url: 'https://www.britannica.com/place/Cleveland-Ohio',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'raleigh',
    code: 'RDU',
    name: 'Raleigh',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Raleigh'],
    about:
      'Raleigh sits on North Carolina’s Piedmont as state capital and a Research Triangle anchor with Durham and Chapel Hill. Oak-lined streets and a capitol dome organize the historic core; tech and university growth fill the metro. Humid subtropical seasons shape outdoor life. Orientation is capitol square versus Research Triangle Park approaches. Raleigh’s primer is Piedmont capital — a green government city tied to the Triangle’s research economy.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'North Carolina Piedmont',
      role: 'State capital and Research Triangle hub',
      knownFor: 'Capitol grounds, oak streets, and Triangle research links',
    },
    features: [
      {
        name: 'Capitol square',
        description:
          'The government core of downtown Raleigh.',
      },
      {
        name: 'Oak-lined grid',
        description:
          'Tree-heavy streets of the historic capital fabric.',
      },
      {
        name: 'Triangle links',
        description:
          'Corridors toward Durham, Chapel Hill, and research parks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Raleigh',
        url: 'https://www.britannica.com/place/Raleigh-North-Carolina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'edmonton',
    code: 'YEG',
    name: 'Edmonton',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Edmonton'],
    about:
      'Edmonton occupies the North Saskatchewan River valley in central Alberta as provincial capital and a northern prairie metropolis. A deep park-filled ravine cuts downtown; cold winters and long summer days define the calendar. Orientation is river valley parks versus downtown towers and suburban rings. Edmonton’s primer is northern prairie capital — a river-ravine city on Alberta’s continental interior plain.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'North Saskatchewan River · central Alberta',
      role: 'Alberta capital and northern prairie hub',
      knownFor: 'River valley parks, winter city life, and capital skyline',
    },
    features: [
      {
        name: 'River valley',
        description:
          'A deep green ravine of parks through the metro.',
      },
      {
        name: 'Downtown core',
        description:
          'Towers rising above the North Saskatchewan banks.',
      },
      {
        name: 'Prairie setting',
        description:
          'Open interior plains surrounding the capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Edmonton',
        url: 'https://www.britannica.com/place/Edmonton',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'valparaiso',
    code: 'VAP',
    name: 'Valparaíso',
    kind: 'City',
    countrySlug: 'chile',
    subtitle: 'City · Chile',
    matchNames: ['Valparaíso', 'Valparaiso'],
    about:
      'Valparaíso climbs steep Pacific hills above a Chilean bay as a colorful port city of funiculars, murals, and corrugated façades. Cerro Alegre and Cerro Concepción concentrate postcard views; the harbor still works below. Cool coastal fog and hills shape daily movement. Orientation is bay amphitheater versus stacked hillside neighborhoods. Valparaíso’s primer is Pacific hill port — elevators, painted houses, and a UNESCO-layered harbor city on Chile’s central coast.',
    facts: {
      kind: 'City',
      country: 'Chile',
      region: 'Americas',
      setting: 'Pacific bay · central Chile',
      role: 'Historic Chilean Pacific port',
      knownFor: 'Hillside funiculars, colorful cerros, and harbor bay',
    },
    features: [
      {
        name: 'Cerro neighborhoods',
        description:
          'Painted hillside quarters above the port.',
      },
      {
        name: 'Ascensores',
        description:
          'Funicular elevators climbing the steep amphitheater.',
      },
      {
        name: 'Working harbor',
        description:
          'Bay docks still structuring the city’s lower edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Valparaíso',
        url: 'https://www.britannica.com/place/Valparaiso-Chile',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Quarter of the Seaport City of Valparaíso',
        url: 'https://whc.unesco.org/en/list/959/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'arequipa',
    code: 'AQP',
    name: 'Arequipa',
    kind: 'City',
    countrySlug: 'peru',
    subtitle: 'City · Peru',
    matchNames: ['Arequipa'],
    about:
      'Arequipa sits on a high Andean valley under the cone of El Misti as Peru’s white-stone southern capital. Sillar masonry brightens the historic center; volcanoes ring the basin. Dry highland air and strong sun define the climate. Orientation is Plaza de Armas versus El Misti’s dominant cone. Arequipa’s primer is volcanic highland city — white stone streets beneath one of Peru’s most recognizable Andean peaks.',
    facts: {
      kind: 'City',
      country: 'Peru',
      region: 'Americas',
      setting: 'Andean valley · El Misti volcano',
      role: 'Southern Peruvian highland capital',
      knownFor: 'Sillar architecture, Plaza de Armas, and El Misti',
    },
    features: [
      {
        name: 'El Misti',
        description:
          'The snow-dusted cone dominating the eastern skyline.',
      },
      {
        name: 'Sillar center',
        description:
          'White volcanic stone churches and colonial streets.',
      },
      {
        name: 'Highland basin',
        description:
          'A dry Andean valley seating the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Arequipa',
        url: 'https://www.britannica.com/place/Arequipa-Peru',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historical Centre of the City of Arequipa',
        url: 'https://whc.unesco.org/en/list/1016/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'curitiba',
    code: 'CWB',
    name: 'Curitiba',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Curitiba'],
    about:
      'Curitiba occupies a highland plateau in southern Brazil as Paraná’s capital, known for parks, bus rapid transit, and a temperate climate uncommon further north. Botanical gardens and pine parks green the metro; a modest skyline organizes the center. Cooler winters distinguish it from tropical Brazil. Orientation is planned park corridors versus downtown core. Curitiba’s primer is southern Brazilian planned city — green belts and transit innovation on a highland plateau.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Southern Brazilian highland plateau',
      role: 'Paraná capital and planning-famous metro',
      knownFor: 'Parks, BRT corridors, and highland climate',
    },
    features: [
      {
        name: 'Park corridors',
        description:
          'Green belts and botanical gardens structuring the city.',
      },
      {
        name: 'Transit spine',
        description:
          'Bus rapid-transit avenues of planning fame.',
      },
      {
        name: 'Highland plain',
        description:
          'A cooler southern plateau setting the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Curitiba',
        url: 'https://www.britannica.com/place/Curitiba',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'riga',
    code: 'RIX',
    name: 'Riga',
    kind: 'City',
    countrySlug: 'latvia',
    subtitle: 'City · Latvia',
    matchNames: ['Riga'],
    about:
      'Riga occupies the Daugava River near the Gulf of Riga as Latvia’s capital and the Baltic’s largest city, a place of Art Nouveau streets, medieval Old Town, and a working river port. Jugendstil façades line quiet avenues beyond the walls; cold winters and mild summers shape the year. Orientation is Old Town versus Art Nouveau quarter and Daugava banks. Riga’s primer is Baltic river capital — Hanseatic stone and extravagant façades on Latvia’s maritime plain.',
    facts: {
      kind: 'City',
      country: 'Latvia',
      region: 'Europe',
      setting: 'Daugava River · Gulf of Riga',
      role: 'Latvian capital and Baltic metropolis',
      knownFor: 'Art Nouveau streets, Old Town, and Daugava port',
    },
    features: [
      {
        name: 'Old Town',
        description:
          'Medieval streets and churches of the historic core.',
      },
      {
        name: 'Art Nouveau quarter',
        description:
          'Ornate façades on the avenues beyond the center.',
      },
      {
        name: 'Daugava waterfront',
        description:
          'River banks linking city and gulf approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Riga',
        url: 'https://www.britannica.com/place/Riga',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Riga',
        url: 'https://whc.unesco.org/en/list/852/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'vilnius',
    code: 'VNO',
    name: 'Vilnius',
    kind: 'City',
    countrySlug: 'lithuania',
    subtitle: 'City · Lithuania',
    matchNames: ['Vilnius'],
    about:
      'Vilnius occupies a confluence of the Neris and Vilnia rivers as Lithuania’s capital, a baroque Old Town of church spires, courtyards, and hillside viewpoints. Gediminas Tower marks the historic castle hill; university streets fill the lower town. Continental seasons shape outdoor life. Orientation is castle hill versus baroque Old Town fabric. Vilnius’s primer is Baltic baroque capital — spires and courtyards in a river-bend city of enduring Lithuanian identity.',
    facts: {
      kind: 'City',
      country: 'Lithuania',
      region: 'Europe',
      setting: 'Neris–Vilnia confluence',
      role: 'Lithuanian capital and historic baroque city',
      knownFor: 'Baroque Old Town, Gediminas Hill, and church spires',
    },
    features: [
      {
        name: 'Baroque Old Town',
        description:
          'Courtyards and church façades of the historic core.',
      },
      {
        name: 'Gediminas Hill',
        description:
          'The castle mound overlooking the confluence.',
      },
      {
        name: 'River bend',
        description:
          'Neris banks structuring approaches to the center.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Vilnius',
        url: 'https://www.britannica.com/place/Vilnius',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Vilnius',
        url: 'https://whc.unesco.org/en/list/541/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'ahmedabad',
    code: 'AMD',
    name: 'Ahmedabad',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Ahmedabad', 'Amdavad'],
    about:
      'Ahmedabad straddles the Sabarmati River in Gujarat as a major western Indian metropolis of pols (traditional neighborhoods), textile history, and modern institutions. The old walled city holds dense lanes; Gandhi’s ashram and newer west-bank districts mark later layers. Hot dry seasons dominate. Orientation is old city east bank versus Sabarmati west-bank growth. Ahmedabad’s primer is Gujarati river city — pols, mills, and a UNESCO-listed historic fabric on the Sabarmati.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Sabarmati River · Gujarat',
      role: 'Major western Indian commercial metropolis',
      knownFor: 'Old city pols, Sabarmati banks, and textile heritage',
    },
    features: [
      {
        name: 'Walled old city',
        description:
          'Dense pols and heritage streets east of the river.',
      },
      {
        name: 'Sabarmati banks',
        description:
          'Riverfront linking historic and modern districts.',
      },
      {
        name: 'West-bank growth',
        description:
          'Institutions and suburbs expanding beyond the old core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ahmadabad',
        url: 'https://www.britannica.com/place/Ahmadabad',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic City of Ahmadabad',
        url: 'https://whc.unesco.org/en/list/1551/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'kanazawa',
    code: 'KNZ',
    name: 'Kanazawa',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Kanazawa'],
    about:
      'Kanazawa sits on the Sea of Japan side of Honshu as a castle-town of gardens, geisha districts, and preserved samurai lanes that escaped wartime bombing. Kenroku-en ranks among Japan’s great gardens; the market and contemporary art museum mark modern layers. Snowy winters define the Hokuriku climate. Orientation is castle-and-garden core versus Higashi Chaya. Kanazawa’s primer is preserved castle city — garden paths and wooden teahouse streets on Japan’s snowy western coast.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Hokuriku · Sea of Japan coast',
      role: 'Historic castle-town and garden city',
      knownFor: 'Kenroku-en, chaya districts, and castle grounds',
    },
    features: [
      {
        name: 'Kenroku-en',
        description:
          'One of Japan’s celebrated landscape gardens.',
      },
      {
        name: 'Chaya districts',
        description:
          'Teahouse streets of Higashi and other quarters.',
      },
      {
        name: 'Castle town',
        description:
          'Samurai lanes and castle grounds organizing the core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kanazawa',
        url: 'https://www.britannica.com/place/Kanazawa-Japan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ghent',
    code: 'GNE',
    name: 'Ghent',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Ghent', 'Gent'],
    about:
      'Ghent occupies the confluence of the Scheldt and Leie in Flanders as a medieval cloth-trade city of towers, canals, and a lively university core. Graslei and Korenlei face the historic quay; St. Bavo’s and the Belfry define the skyline. Orientation is quay towers versus citadel park and outer districts. Ghent’s primer is Flemish canal city — guildhalls and church towers on a water junction that once rivaled Bruges.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Scheldt–Leie confluence · Flanders',
      role: 'Major Flemish historic and university city',
      knownFor: 'Graslei quays, belfry, and medieval towers',
    },
    features: [
      {
        name: 'Graslei quays',
        description:
          'Guildhall waterfronts on the historic Leie.',
      },
      {
        name: 'Tower skyline',
        description:
          'Belfry and church spires organizing the center.',
      },
      {
        name: 'Canal streets',
        description:
          'Waterways threading the medieval and university core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ghent',
        url: 'https://www.britannica.com/place/Ghent',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'virginia',
    code: 'VA',
    name: 'Virginia',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Virginia'],
    about:
      'Virginia stretches from Appalachian Blue Ridge and Shenandoah valleys to Chesapeake Bay and Atlantic shores, a Mid-Atlantic state of colonial Tidewater, Piedmont suburbs, and mountain parks. Richmond and Northern Virginia organize politics and metro growth; Barrier islands edge the Eastern Shore. Humid seasons shape the year. Orientation is mountains versus Piedmont and Tidewater bay. Virginia’s primer is Mid-Atlantic transect — Blue Ridge, colonial rivers, and a long Chesapeake shore.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Blue Ridge to Chesapeake Bay',
      role: 'Mid-Atlantic state of mountains and Tidewater',
      knownFor: 'Shenandoah, Chesapeake shores, and Piedmont metros',
    },
    features: [
      {
        name: 'Blue Ridge west',
        description:
          'Mountain parks and Shenandoah valley approaches.',
      },
      {
        name: 'Piedmont core',
        description:
          'Richmond and Northern Virginia growth corridors.',
      },
      {
        name: 'Tidewater east',
        description:
          'Chesapeake Bay rivers and Eastern Shore islands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Virginia',
        url: 'https://www.britannica.com/place/Virginia-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'saskatchewan',
    code: 'SK',
    name: 'Saskatchewan',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['Saskatchewan'],
    about:
      'Saskatchewan is a prairie province of wheat fields, parkland belts, and northern boreal lakes in the Canadian interior. Regina and Saskatoon organize the south; endless horizons define the visual field. Harsh winters and hot summers mark continental climate. Orientation is southern grain belt versus northern forest shield. Saskatchewan’s primer is prairie heartland — sky-wide farmland and a gradual shift into lake-dotted northern woods.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Canadian Prairies · boreal north',
      role: 'Prairie agricultural and resource province',
      knownFor: 'Wheat fields, prairie horizons, and northern lakes',
    },
    features: [
      {
        name: 'Grain belt',
        description:
          'Southern farmland under wide prairie skies.',
      },
      {
        name: 'Parkland transition',
        description:
          'Aspen belts between open prairie and forest.',
      },
      {
        name: 'Boreal north',
        description:
          'Lake country of the Canadian Shield fringe.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saskatchewan',
        url: 'https://www.britannica.com/place/Saskatchewan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'andhra-pradesh',
    code: 'AP',
    name: 'Andhra Pradesh',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Andhra Pradesh'],
    about:
      'Andhra Pradesh occupies India’s southeastern coast as a Telugu-speaking state of Bay of Bengal deltas, temple towns, and Eastern Ghats ridges. Amaravati and Visakhapatnam organize politics and port industry; rice deltas fill the coastal plain. Hot plains and monsoon rains shape the year. Orientation is Coromandel–Andhra coast versus Ghats interior. Andhra Pradesh’s primer is eastern coastal state — delta agriculture, temple cities, and a long Bay of Bengal shore.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Southeast India · Bay of Bengal coast',
      role: 'Major South Indian coastal state',
      knownFor: 'Coastal deltas, temple towns, and Eastern Ghats',
    },
    features: [
      {
        name: 'Coastal deltas',
        description:
          'Rice lands along the Bay of Bengal plain.',
      },
      {
        name: 'Temple towns',
        description:
          'Historic religious centers of Telugu culture.',
      },
      {
        name: 'Eastern Ghats',
        description:
          'Interior ridges rising from the coastal plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Andhra Pradesh',
        url: 'https://www.britannica.com/place/Andhra-Pradesh',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'paxos',
    code: 'PAX',
    name: 'Paxos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Paxos', 'Paxi'],
    about:
      'Paxos is a small Ionian island of olive groves, limestone cliffs, and tiny harbor villages south of Corfu. Gaios anchors the main port; Antipaxos’s beaches lie a short boat hop away. Dry summers concentrate tourism on a compact scale. Orientation is Gaios harbor versus western cliffs. Paxos’s primer is intimate Ionian isle — olive hills and clear coves on a quiet neighbor to Corfu.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Ionian Islands · south of Corfu',
      role: 'Small Ionian holiday island',
      knownFor: 'Olive groves, cliff coasts, and Gaios harbor',
    },
    features: [
      {
        name: 'Gaios harbor',
        description:
          'The main port village of the island.',
      },
      {
        name: 'Olive hills',
        description:
          'Terraced groves covering much of the interior.',
      },
      {
        name: 'Western cliffs',
        description:
          'Limestone scarps facing the open Ionian.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Paxos',
        url: 'https://www.britannica.com/place/Paxos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'symi',
    code: 'SYM',
    name: 'Symi',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Symi'],
    about:
      'Symi is a Dodecanese island of pastel neoclassical houses rising in a steep harbor amphitheater near the Turkish coast. Sponge-diving wealth built the waterfront mansions; barren hills frame the bay. Aegean summer heat concentrates tourism in the harbor amphitheater. Orientation is Yialos harbor versus Horio upper town. Symi’s primer is pastel Dodecanese port — a theatrical harbor of painted façades on a steep Aegean amphitheater.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Dodecanese · southeast Aegean',
      role: 'Scenic Dodecanese harbor island',
      knownFor: 'Pastel harbor façades and steep amphitheater town',
    },
    features: [
      {
        name: 'Yialos harbor',
        description:
          'The colorful port amphitheater of neoclassical houses.',
      },
      {
        name: 'Horio',
        description:
          'The upper town linked by stairs above the port.',
      },
      {
        name: 'Barren hills',
        description:
          'Rocky ridges framing the compact inhabited bay.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Simi',
        url: 'https://www.britannica.com/place/Simi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'la-gomera',
    code: 'GOM',
    name: 'La Gomera',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['La Gomera'],
    about:
      'La Gomera is a round Canary Island of deep ravines, laurel cloud forest, and terraced slopes west of Tenerife. Garajonay’s mist forest crowns the center; San Sebastián anchors the ferry port. Orientation is central forest versus coastal barrancos. La Gomera’s primer is green Canary isle — misty laurel woods and steep ravines on a compact volcanic disc in the Atlantic.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Canary Islands · west of Tenerife',
      role: 'Laurel-forest Canary island',
      knownFor: 'Garajonay forest, barrancos, and terraced slopes',
    },
    features: [
      {
        name: 'Garajonay',
        description:
          'UNESCO mist forest on the island’s summit.',
      },
      {
        name: 'Barrancos',
        description:
          'Deep ravines cutting from center to coast.',
      },
      {
        name: 'Ferry port',
        description:
          'San Sebastián linking Gomera to Tenerife.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gomera Island',
        url: 'https://www.britannica.com/place/Gomera-Island',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Garajonay National Park',
        url: 'https://whc.unesco.org/en/list/380/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'islay',
    code: 'ISL',
    name: 'Islay',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Islay'],
    about:
      'Islay is a southern Hebridean island of peat moors, whisky distilleries, and Atlantic bird coasts off Scotland’s west. Distillery villages line sheltered lochs; wild shores face the open ocean. Orientation is distillery south and east versus wilder western headlands. Islay’s primer is whisky isle — peat, waves, and a cluster of coastal distilleries on a low Hebridean platform.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Inner Hebrides · southwest Scotland',
      role: 'Whisky and wildlife Hebridean island',
      knownFor: 'Coastal distilleries, peat moors, and Atlantic shores',
    },
    features: [
      {
        name: 'Distillery coast',
        description:
          'Whisky villages along sheltered lochs and bays.',
      },
      {
        name: 'Peat moors',
        description:
          'Open interior that flavors the island’s spirit.',
      },
      {
        name: 'Atlantic headlands',
        description:
          'Wild western shores and bird cliffs.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Islay',
        url: 'https://www.britannica.com/place/Islay',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'bonaire',
    code: 'BON',
    name: 'Bonaire',
    kind: 'Island',
    countrySlug: 'netherlands',
    subtitle: 'Island · Netherlands',
    matchNames: ['Bonaire'],
    about:
      'Bonaire is a southern Caribbean island of fringing reefs, cactus flats, and a Dutch Caribbean administration east of Curaçao. Shore diving and flamingo wetlands define its reputation; arid trade-wind climate keeps vegetation sparse. Orientation is leeward dive coast versus windward rough shore. Bonaire’s primer is reef island — easy shore entries and saline flats on a dry ABC-island neighbor under the Netherlands.',
    facts: {
      kind: 'Island',
      country: 'Netherlands',
      region: 'Americas',
      setting: 'Southern Caribbean · ABC islands',
      role: 'Dutch Caribbean dive and nature island',
      knownFor: 'Fringing reefs, shore diving, and saline wetlands',
    },
    features: [
      {
        name: 'Fringing reef',
        description:
          'Nearshore coral that made shore diving famous.',
      },
      {
        name: 'Salina flats',
        description:
          'Salt pans and flamingo wetlands of the south.',
      },
      {
        name: 'Arid coast',
        description:
          'Cactus and scrub under dry Caribbean trade winds.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Bonaire',
        url: 'https://www.britannica.com/place/Bonaire',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'st-lucia',
    code: 'SLU',
    name: 'Saint Lucia',
    kind: 'Island',
    countrySlug: 'saint-lucia',
    subtitle: 'Island · Saint Lucia',
    matchNames: ['Saint Lucia', 'St Lucia', 'St. Lucia'],
    about:
      'Saint Lucia is a volcanic Windward Island of twin Pitons, rainforest ridges, and a Caribbean–Atlantic dual coast. Soufrière and the Pitons concentrate visual fame; Castries anchors the capital bay. Humid trade-wind weather and brief downpours structure outdoor plans. Orientation is Pitons southwest versus northern resorts and Atlantic windward shores. Saint Lucia’s primer is Piton island — steep volcanic cones and green ridges on a compact eastern Caribbean nation.',
    facts: {
      kind: 'Island',
      country: 'Saint Lucia',
      region: 'Americas',
      setting: 'Windward Islands · eastern Caribbean',
      role: 'Caribbean island nation of volcanic peaks',
      knownFor: 'Pitons, rainforest ridges, and dual coasts',
    },
    features: [
      {
        name: 'The Pitons',
        description:
          'Twin volcanic cones rising from the southwest coast.',
      },
      {
        name: 'Rainforest ridges',
        description:
          'Green interior mountains of the island spine.',
      },
      {
        name: 'Dual coasts',
        description:
          'Calmer Caribbean west and windward Atlantic east.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Saint Lucia',
        url: 'https://www.britannica.com/place/Saint-Lucia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pitons Management Area',
        url: 'https://whc.unesco.org/en/list/1161/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'abruzzo',
    code: 'ABR',
    name: 'Abruzzo',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Abruzzo'],
    about:
      'Abruzzo occupies central Italy east of Rome as a region of Apennine massifs, national parks, and an Adriatic coast. Gran Sasso and Maiella dominate the highland core; hill towns and ski valleys share the interior. Orientation is mountain parks versus Adriatic shore. Abruzzo’s primer is wild Apennine region — high limestone massifs and a quieter Adriatic edge of the Italian peninsula.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Central Apennines · Adriatic coast',
      role: 'Mountain-and-coast region of central Italy',
      knownFor: 'Gran Sasso, national parks, and Adriatic towns',
    },
    features: [
      {
        name: 'Gran Sasso',
        description:
          'The high Apennine massif of the region’s core.',
      },
      {
        name: 'Park highlands',
        description:
          'Protected mountain landscapes and hill towns.',
      },
      {
        name: 'Adriatic coast',
        description:
          'Eastern beaches and ports below the mountains.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Abruzzi',
        url: 'https://www.britannica.com/place/Abruzzi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tyrol',
    code: 'TYR',
    name: 'Tyrol',
    kind: 'Region',
    countrySlug: 'austria',
    subtitle: 'Region · Austria',
    matchNames: ['Tyrol', 'Tirol'],
    about:
      'Tyrol is an Alpine Austrian state of high peaks, glacial valleys, and Innsbruck as its capital basin. Ski domains and summer hiking trails share the same mountain walls; Brenner routes link north–south traffic. Orientation is Inn valley versus flanking ranges. Tyrol’s primer is Austrian Alpine heartland — sharp peaks, valley towns, and a transit corridor through the central Alps.',
    facts: {
      kind: 'Region',
      country: 'Austria',
      region: 'Europe',
      setting: 'Central Alps · Inn valley',
      role: 'Alpine state around Innsbruck',
      knownFor: 'High peaks, Inn valley, and mountain resorts',
    },
    features: [
      {
        name: 'Inn valley',
        description:
          'The main inhabited corridor through Tyrol.',
      },
      {
        name: 'Alpine walls',
        description:
          'High ranges of ski and hiking fame.',
      },
      {
        name: 'Innsbruck basin',
        description:
          'The capital city seated in the valley floor.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tirol',
        url: 'https://www.britannica.com/place/Tirol',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hunter-valley',
    code: 'HUN',
    name: 'Hunter Valley',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Hunter Valley'],
    about:
      'The Hunter Valley is a wine and coal region of New South Wales north of Sydney, with vineyard estates along the Hunter River and broken hills framing cellar doors. Semillon and Shiraz traditions define the wine story; weekend tourism from Sydney fills the valleys. Orientation is vineyard floor versus surrounding ranges. Hunter Valley’s primer is NSW wine country — cellar-door hills a short drive from Australia’s largest city.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'New South Wales · north of Sydney',
      role: 'Major Australian wine and weekend region',
      knownFor: 'Vineyards, cellar doors, and Hunter River valley',
    },
    features: [
      {
        name: 'Vineyard floor',
        description:
          'Estate rows along the Hunter River plain.',
      },
      {
        name: 'Broken hills',
        description:
          'Ridges framing cellar-door views.',
      },
      {
        name: 'Sydney weekend belt',
        description:
          'A short drive corridor from the coastal metropolis.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hunter River',
        url: 'https://www.britannica.com/place/Hunter-River',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lake-constance',
    code: 'BOD',
    name: 'Lake Constance',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Lake Constance', 'Bodensee'],
    about:
      'Lake Constance (Bodensee) is a large Alpine foreland lake shared by Germany, Switzerland, and Austria, with shoreline towns, orchards, and Alpine backdrops. Ferries cross the freshwater expanse; Constance and Lindau organize German shores. Orientation is German north shore versus Swiss and Austrian banks. Lake Constance’s primer is tri-national Alpine lake — steamer routes and orchard shores at the Rhine’s upper basin.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Alpine foreland · upper Rhine',
      role: 'Tri-national lake region',
      knownFor: 'Shore towns, Alpine backdrop, and ferry routes',
    },
    features: [
      {
        name: 'German shore',
        description:
          'Towns and orchards along the northern banks.',
      },
      {
        name: 'Alpine backdrop',
        description:
          'Peaks framing the southern lake views.',
      },
      {
        name: 'Ferry network',
        description:
          'Cross-lake routes linking three countries.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lake Constance',
        url: 'https://www.britannica.com/place/Lake-Constance',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'transylvania',
    code: 'TRN',
    name: 'Transylvania',
    kind: 'Region',
    countrySlug: 'romania',
    subtitle: 'Region · Romania',
    matchNames: ['Transylvania'],
    about:
      'Transylvania is a historic region of central Romania ringed by Carpathian arcs, with fortified Saxon towns, castle ridges, and high pasture plateaus. Brașov, Sibiu, and Sighișoara concentrate medieval fabric; the Apuseni and Southern Carpathians frame the basin. Orientation is Carpathian ring versus interior plateau towns. Transylvania’s primer is Carpathian basin country — fortified churches and mountain walls around a highland Romanian heartland.',
    facts: {
      kind: 'Region',
      country: 'Romania',
      region: 'Europe',
      setting: 'Carpathian basin · central Romania',
      role: 'Historic highland region of Romania',
      knownFor: 'Fortified towns, Carpathian arcs, and castle ridges',
    },
    features: [
      {
        name: 'Carpathian ring',
        description:
          'Mountain arcs enclosing the Transylvanian basin.',
      },
      {
        name: 'Fortified towns',
        description:
          'Saxon and medieval centers of the interior.',
      },
      {
        name: 'Castle ridges',
        description:
          'Hilltop fortresses overlooking valley approaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Transylvania',
        url: 'https://www.britannica.com/place/Transylvania',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'blue-mosque',
    code: 'BLM',
    name: 'Blue Mosque',
    kind: 'Landmark',
    countrySlug: 'turkiye',
    subtitle: 'Landmark · Türkiye',
    matchNames: ['Blue Mosque', 'Sultan Ahmed Mosque', 'Sultanahmet Mosque'],
    about:
      'The Blue Mosque (Sultan Ahmed Mosque) faces Hagia Sophia across Sultanahmet Square as an early seventeenth-century Ottoman imperial mosque of cascading domes and six minarets. Iznik tilework gives the interior its famous blue cast; the courtyard and cascading exterior define approaches. Orientation is six-minaret silhouette versus the Hippodrome and Hagia Sophia axis. The Blue Mosque’s primer is Ottoman imperial mosque — tiled prayer hall and a six-minaret skyline at the heart of historic Istanbul.',
    facts: {
      kind: 'Landmark',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Sultanahmet · historic Istanbul',
      role: 'Ottoman imperial mosque and city icon',
      knownFor: 'Six minarets, cascading domes, and blue İznik tiles',
    },
    features: [
      {
        name: 'Six minarets',
        description:
          'The distinctive skyline count of the complex.',
      },
      {
        name: 'Cascading domes',
        description:
          'Stacked Ottoman domes of the prayer hall mass.',
      },
      {
        name: 'İznik interior',
        description:
          'Blue-toned tilework that named the mosque in popular speech.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Blue Mosque',
        url: 'https://www.britannica.com/topic/Blue-Mosque-Istanbul',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pantheon',
    code: 'PAN',
    name: 'Pantheon',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Pantheon', 'Pantheon of Rome'],
    about:
      'The Pantheon stands in Rome’s historic center as a Roman temple-turned-church whose unreinforced concrete dome and oculus remain engineering landmarks. The portico’s Corinthian columns face the piazza; the circular rotunda opens to the sky through the oculus. Orientation is portico versus dome and Piazza della Rotonda. The Pantheon’s primer is Roman dome — ancient concrete and an open oculus at the heart of the city.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Historic center of Rome',
      role: 'Ancient Roman temple and intact dome',
      knownFor: 'Concrete dome, oculus, and Corinthian portico',
    },
    features: [
      {
        name: 'Oculus dome',
        description:
          'The open circular skylight of the rotunda.',
      },
      {
        name: 'Portico',
        description:
          'Corinthian columns facing the piazza.',
      },
      {
        name: 'Rotunda',
        description:
          'The circular hall under the great dome.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pantheon',
        url: 'https://www.britannica.com/topic/Pantheon-building-Rome-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mount-vesuvius',
    code: 'VES',
    name: 'Mount Vesuvius',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Mount Vesuvius', 'Vesuvius'],
    about:
      'Mount Vesuvius rises above the Bay of Naples as the active volcano that buried Pompeii and Herculaneum, a twin-summit massif of Somma rim and modern cone. Trails climb to the crater rim; the metro sprawl below underlines volcanic risk and fertility. Orientation is crater rim versus bay and buried ancient towns. Vesuvius’s primer is Bay of Naples volcano — a living cone whose eruptions wrote one of archaeology’s central stories.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · Campania',
      role: 'Active volcano and archaeological counterpart to Pompeii',
      knownFor: 'Crater rim, Somma–Vesuvius profile, and bay views',
    },
    features: [
      {
        name: 'Crater rim',
        description:
          'The summit trail around the modern cone.',
      },
      {
        name: 'Somma rim',
        description:
          'The older caldera wall framing the active cone.',
      },
      {
        name: 'Bay overlook',
        description:
          'Views across Naples and the buried ancient towns.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Vesuvius',
        url: 'https://www.britannica.com/place/Vesuvius',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'canyonlands',
    code: 'CAN',
    name: 'Canyonlands',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Canyonlands', 'Canyonlands National Park'],
    about:
      'Canyonlands is a vast Colorado Plateau park in Utah where the Green and Colorado rivers carve labyrinthine canyons below mesa rims. Island in the Sky offers classic overlooks; The Needles and The Maze hold remoter districts. Red rock, sparse vegetation, and huge scale define visits. Orientation is mesa rim versus river confluence country far below. Canyonlands’s primer is canyon maze — layered sandstone country at the meeting of two desert rivers.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Colorado Plateau · southeastern Utah',
      role: 'National park of canyon and mesa country',
      knownFor: 'Island in the Sky overlooks, river canyons, and red rock',
    },
    features: [
      {
        name: 'Island in the Sky',
        description:
          'Mesa-top overlooks above the canyon labyrinth.',
      },
      {
        name: 'River confluence',
        description:
          'Green and Colorado cutting the park’s deep core.',
      },
      {
        name: 'Needles district',
        description:
          'Spire and canyon country of the southern park.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Canyonlands National Park',
        url: 'https://www.britannica.com/place/Canyonlands-National-Park',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Canyonlands',
        url: 'https://www.nps.gov/cany/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'brandenburg-gate',
    code: 'BRB',
    name: 'Brandenburg Gate',
    kind: 'Landmark',
    countrySlug: 'germany',
    subtitle: 'Landmark · Germany',
    matchNames: ['Brandenburg Gate', 'Brandenburger Tor'],
    about:
      'The Brandenburg Gate stands at the western end of Berlin’s Unter den Linden as a neoclassical city gate crowned by the Quadriga. Once a Cold War border symbol, it now anchors Pariser Platz as a reunified capital icon. Orientation is gate versus Tiergarten and the boulevard axis. Brandenburg Gate’s primer is Berlin’s ceremonial portal — columns and chariot atop the city’s most charged civic threshold.',
    facts: {
      kind: 'Landmark',
      country: 'Germany',
      region: 'Europe',
      setting: 'Pariser Platz · central Berlin',
      role: 'Neoclassical city gate and national symbol',
      knownFor: 'Quadriga, Doric colonnade, and Pariser Platz',
    },
    features: [
      {
        name: 'Quadriga',
        description:
          'The chariot sculpture crowning the gate.',
      },
      {
        name: 'Colonnade',
        description:
          'Doric columns of the neoclassical portal.',
      },
      {
        name: 'Pariser Platz',
        description:
          'The square framing approaches from Unter den Linden.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Brandenburg Gate',
        url: 'https://www.britannica.com/topic/Brandenburg-Gate',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'trevi-fountain',
    code: 'TRV',
    name: 'Trevi Fountain',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Trevi Fountain', 'Fontana di Trevi'],
    about:
      'The Trevi Fountain fills a tight Roman piazza as an eighteenth-century Baroque showpiece of Oceanus, tritons, and cascading stone. Coins tossed into the basin sustain a famous custom; the façade integrates with the Palazzo Poli behind. Orientation is fountain basin versus the cramped surrounding streets. Trevi’s primer is Baroque water theater — a monumental fountain jammed into the dense fabric of central Rome.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Historic center of Rome',
      role: 'Baroque fountain and popular Roman landmark',
      knownFor: 'Oceanus sculpture, coin custom, and tight piazza setting',
    },
    features: [
      {
        name: 'Oceanus façade',
        description:
          'The central sculptural program of the fountain.',
      },
      {
        name: 'Basin',
        description:
          'The water stage receiving coins and crowds.',
      },
      {
        name: 'Tight piazza',
        description:
          'Narrow streets amplifying the monument’s drama.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Trevi Fountain',
        url: 'https://www.britannica.com/topic/Trevi-Fountain',
        kind: 'reference',
      },
    ],
  },
]
