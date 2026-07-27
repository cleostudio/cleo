/** Fifth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch5: PlaceGuideDraftBatch[] = [
  {
    slug: 'montreal',
    code: 'YUL',
    name: 'Montreal',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Montreal'],
    about:
      'Montreal occupies an island in the St. Lawrence at the confluence with the Ottawa River, a bilingual metropolis of limestone Old Port streets, Mount Royal park, and winter-ready underground passages. French and English signage share the same blocks; staircases climb the mountain that gives the city its name. The Lachine Canal and harbor front mark older industrial edges. Orientation uses Mount Royal, the old town riverfront, and the downtown plateau. Montreal’s primer is island river capital — cold-season urbanism and layered European street fabric on a great eastern Canadian waterway.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Island of Montreal · St. Lawrence River',
      role: 'Major Quebec metropolis and cultural hub',
      knownFor: 'Old Port, Mount Royal, and bilingual street life',
    },
    features: [
      {
        name: 'Old Montreal',
        description:
          'Limestone streets and squares along the historic harbor front.',
      },
      {
        name: 'Mount Royal',
        description:
          'A central park mountain that overlooks the island city.',
      },
      {
        name: 'St. Lawrence edge',
        description:
          'River and canal shores that shaped trade and settlement.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Montreal',
        url: 'https://www.britannica.com/place/Montreal',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'toronto',
    code: 'YYZ',
    name: 'Toronto',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Toronto'],
    about:
      'Toronto spreads along Lake Ontario’s north shore as Canada’s largest city, a lakefront skyline of glass towers watched by the CN Tower. Ravines cut green corridors through dense neighborhoods; islands and harbor ferries sit just offshore. Immigrant districts layer food and languages across the grid. Orientation is waterfront versus inland plateau with the tower as skyline hinge. Toronto’s primer is Great Lakes metropolis — a diverse lakefront capital of finance and culture on Ontario’s southern shore.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Lake Ontario north shore',
      role: 'Largest Canadian city and financial center',
      knownFor: 'CN Tower, lakefront skyline, and ravine network',
    },
    features: [
      {
        name: 'CN Tower',
        description:
          'The landmark spire that anchors Toronto’s skyline identity.',
      },
      {
        name: 'Harbourfront',
        description:
          'Lake Ontario quays, islands, and waterfront promenades.',
      },
      {
        name: 'Ravine corridors',
        description:
          'Wooded valleys threading green space through the urban grid.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Toronto',
        url: 'https://www.britannica.com/place/Toronto',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'san-francisco',
    code: 'SFO',
    name: 'San Francisco',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['San Francisco'],
    about:
      'San Francisco occupies a hilly peninsula between the Pacific and San Francisco Bay, a compact city of steep streets, fog, and the Golden Gate’s orange span. Cable cars climb toward Victorian rows; the Embarcadero curves around the bay edge. Seismic geology and cool marine climate shape daily life. Orientation is ocean versus bay with the bridge and downtown hills as markers. San Francisco’s primer is peninsula bay city — dramatic topography and maritime fog pressed into a small, intensely walkable urban footprint.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Pacific–bay peninsula · steep hills',
      role: 'Major West Coast cultural and tech-adjacent hub',
      knownFor: 'Golden Gate Bridge, hills, and bay fog',
    },
    features: [
      {
        name: 'Golden Gate',
        description:
          'The suspension bridge spanning the entrance to the bay.',
      },
      {
        name: 'Hill grid',
        description:
          'Steep streets and viewpoints across a compact peninsula.',
      },
      {
        name: 'Embarcadero',
        description:
          'The curved bay waterfront from ferry buildings to piers.',
      },
    ],
    sources: [
      {
        label: 'Britannica — San Francisco',
        url: 'https://www.britannica.com/place/San-Francisco-California',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'los-angeles',
    code: 'LAX',
    name: 'Los Angeles',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Los Angeles'],
    about:
      'Los Angeles sprawls across a coastal basin between Pacific beaches and inland mountains, a polycentric metropolis of freeways, neighborhoods, and film-era mythology. Downtown towers sit inland from Santa Monica Bay; the Hollywood Hills and San Gabriels frame the basin. Ocean, desert, and mountain climates meet within a short drive. Orientation is basin floor versus coastal strip and mountain rim. Los Angeles’s primer is basin megacity — dispersed urbanism under Mediterranean light at the edge of the Pacific.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Coastal basin · Pacific and mountain rim',
      role: 'Major West Coast metropolis and entertainment capital',
      knownFor: 'Basin sprawl, beaches, and mountain backdrop',
    },
    features: [
      {
        name: 'Downtown core',
        description:
          'A tower cluster inland from the coastal plain.',
      },
      {
        name: 'Pacific edge',
        description:
          'Beach cities and bluffs along Santa Monica Bay.',
      },
      {
        name: 'Mountain rim',
        description:
          'Hills and ranges that enclose the Los Angeles Basin.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Los Angeles',
        url: 'https://www.britannica.com/place/Los-Angeles-California',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'munich',
    code: 'MUC',
    name: 'Munich',
    kind: 'City',
    countrySlug: 'germany',
    subtitle: 'City · Germany',
    matchNames: ['Munich', 'München'],
    about:
      'Munich sits on the Isar River in Bavaria’s Alpine foreland, a prosperous capital of beer gardens, baroque churches, and a walkable historic core around Marienplatz. The English Garden stretches as a vast urban park; Alps appear on clear southern horizons. Oktoberfest fields and museums share the same civic fabric. Orientation uses the old town, Isar banks, and Alpine outlook. Munich’s primer is Bavarian capital — ordered streets and festival culture with mountain weather just beyond the plain.',
    facts: {
      kind: 'City',
      country: 'Germany',
      region: 'Europe',
      setting: 'Isar River · Alpine foreland',
      role: 'Bavarian capital and southern German metropolis',
      knownFor: 'Marienplatz, beer gardens, and Alpine proximity',
    },
    features: [
      {
        name: 'Marienplatz',
        description:
          'The central square and civic heart of the old town.',
      },
      {
        name: 'English Garden',
        description:
          'A vast landscaped park along the Isar through the city.',
      },
      {
        name: 'Alpine foreland',
        description:
          'Southern horizons that bring mountain light to the plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Munich',
        url: 'https://www.britannica.com/place/Munich-Bavaria-Germany',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'milan',
    code: 'MIL',
    name: 'Milan',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Milan', 'Milano'],
    about:
      'Milan occupies the Po Plain as Italy’s fashion and finance capital, a city of Gothic Duomo pinnacles, galleria arcades, and a dense modern business district. Navigli canals recall older water routes; Alpine foothills sit to the north. Design, opera, and industry share one metropolitan field. Orientation is Duomo core versus Porta Nuova towers and canal belt. Milan’s primer is plain metropolis — northern Italian commerce wrapped around a monumental cathedral square.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Po Plain · Alpine approaches',
      role: 'Northern Italian economic and design capital',
      knownFor: 'Duomo, galleria arcades, and fashion industry',
    },
    features: [
      {
        name: 'Duomo square',
        description:
          'The Gothic cathedral and open piazza at the historic center.',
      },
      {
        name: 'Galleria arcades',
        description:
          'Glass-vaulted shopping passages adjoining the cathedral.',
      },
      {
        name: 'Navigli',
        description:
          'Canal districts that preserve Milan’s older water network.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Milan',
        url: 'https://www.britannica.com/place/Milan-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'florence',
    code: 'FLR',
    name: 'Florence',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Florence', 'Firenze'],
    about:
      'Florence fills an Arno River bend in Tuscany, a Renaissance capital of dome, bridges, and stone palazzi packed into a walkable historic basin. Brunelleschi’s cupola dominates the skyline; the Ponte Vecchio still carries shops across the river. Hills of olive and cypress ring the city. Orientation is Duomo versus Oltrarno bank and surrounding ridges. Florence’s primer is Arno Renaissance city — concentrated artistic fabric where civic pride once funded a world of fresco and stone.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Arno basin · Tuscan hills',
      role: 'Historic Tuscan capital and Renaissance center',
      knownFor: 'Cathedral dome, Ponte Vecchio, and palazzi',
    },
    features: [
      {
        name: 'Cathedral dome',
        description:
          'Brunelleschi’s cupola crowning the city’s skyline.',
      },
      {
        name: 'Ponte Vecchio',
        description:
          'The shop-lined medieval bridge across the Arno.',
      },
      {
        name: 'Hill ring',
        description:
          'Olive and cypress ridges enclosing the historic basin.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Florence',
        url: 'https://www.britannica.com/place/Florence',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Florence',
        url: 'https://whc.unesco.org/en/list/174/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'brussels',
    code: 'BRU',
    name: 'Brussels',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Brussels', 'Bruxelles'],
    about:
      'Brussels is Belgium’s bilingual capital on a low plateau of the Senne valley, a city of ornate Grand-Place guildhalls, Art Nouveau façades, and European-institution quarters. French and Dutch share official space; comic murals and chocolate shops fill tourist lanes. Parks and boulevards open the denser historic core. Orientation uses Grand-Place, the upper town, and EU district. Brussels’s primer is Low Countries capital — ornate civic squares hosting both Belgian identity and continental administration.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Senne valley plateau · Low Countries',
      role: 'National capital and EU institutional seat',
      knownFor: 'Grand-Place, Art Nouveau, and bilingual civic life',
    },
    features: [
      {
        name: 'Grand-Place',
        description:
          'A UNESCO square of guildhalls and ornate civic façades.',
      },
      {
        name: 'Upper town',
        description:
          'Royal and museum quarters above the historic lower city.',
      },
      {
        name: 'Institutional belt',
        description:
          'European quarter offices framing modern Brussels politics.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Brussels',
        url: 'https://www.britannica.com/place/Brussels',
        kind: 'reference',
      },
      {
        label: 'UNESCO — La Grand-Place, Brussels',
        url: 'https://whc.unesco.org/en/list/857/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'oslo',
    code: 'OSL',
    name: 'Oslo',
    kind: 'City',
    countrySlug: 'norway',
    subtitle: 'City · Norway',
    matchNames: ['Oslo'],
    about:
      'Oslo occupies the head of Oslofjord, a northern capital where forested hills meet a modern waterfront of opera house and museums. The city is compact at the fjord tip yet opens quickly into Nordmarka woodland. Winter snow and long summer light reshape outdoor life. Orientation is fjord harbor versus inland forest belt. Oslo’s primer is fjord-head capital — maritime civic architecture backed by Nordic forest within city limits.',
    facts: {
      kind: 'City',
      country: 'Norway',
      region: 'Europe',
      setting: 'Oslofjord head · forested hills',
      role: 'National capital and principal Norwegian city',
      knownFor: 'Fjord waterfront, Opera House, and forest access',
    },
    features: [
      {
        name: 'Fjord harbour',
        description:
          'A redeveloped waterfront of museums, promenades, and ferries.',
      },
      {
        name: 'Opera House',
        description:
          'A white angled landmark that visitors walk upon like a glacier.',
      },
      {
        name: 'Nordmarka edge',
        description:
          'Forest trails beginning almost at the city’s inland rim.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oslo',
        url: 'https://www.britannica.com/place/Oslo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'jakarta',
    code: 'JKT',
    name: 'Jakarta',
    kind: 'City',
    countrySlug: 'indonesia',
    subtitle: 'City · Indonesia',
    matchNames: ['Jakarta'],
    about:
      'Jakarta sprawls across a low north Java coastal plain as Indonesia’s capital megacity, a humid metropolis of canals, tolled freeways, and the National Monument rising from Merdeka Square. Colonial Kota and modern CBD towers sit within the same flood-prone delta. Monsoon rains and land subsidence shape infrastructure. Orientation uses Merdeka Square, the north coast, and southern hills. Jakarta’s primer is delta capital — dense tropical urbanism on a sinking coastal plain that anchors the Indonesian archipelago.',
    facts: {
      kind: 'City',
      country: 'Indonesia',
      region: 'Asia',
      setting: 'North Java coastal plain · delta',
      role: 'National capital and principal Indonesian metropolis',
      knownFor: 'Merdeka Square, canal city fabric, and coastal sprawl',
    },
    features: [
      {
        name: 'Merdeka Square',
        description:
          'A vast civic green crowned by the National Monument.',
      },
      {
        name: 'North coast',
        description:
          'Harbor and historic Kota districts on the Java Sea edge.',
      },
      {
        name: 'Delta plain',
        description:
          'Low-lying canals and flood-prone districts of the capital.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Jakarta',
        url: 'https://www.britannica.com/place/Jakarta',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'manila',
    code: 'MNL',
    name: 'Manila',
    kind: 'City',
    countrySlug: 'philippines',
    subtitle: 'City · Philippines',
    matchNames: ['Manila'],
    about:
      'Manila faces Manila Bay on Luzon’s southwestern shore, a dense capital region of Intramuros walls, Roxas Boulevard sunsets, and contiguous cities forming Metro Manila. Spanish, American, and Filipino layers share the bayfront; typhoons and heat define the climate. Orientation is bay edge versus inland grid of the wider metro. Manila’s primer is bay capital — historic fortress city at the core of a vast tropical metropolitan sprawl.',
    facts: {
      kind: 'City',
      country: 'Philippines',
      region: 'Asia',
      setting: 'Manila Bay · southwestern Luzon',
      role: 'National capital and Metro Manila core',
      knownFor: 'Intramuros, bay boulevard, and metro density',
    },
    features: [
      {
        name: 'Intramuros',
        description:
          'The walled historic district from the Spanish colonial era.',
      },
      {
        name: 'Manila Bay',
        description:
          'The wide western bay that stages sunsets and port life.',
      },
      {
        name: 'Metro fabric',
        description:
          'Contiguous cities that extend the capital far beyond old Manila.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Manila',
        url: 'https://www.britannica.com/place/Manila',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'johannesburg',
    code: 'JNB',
    name: 'Johannesburg',
    kind: 'City',
    countrySlug: 'south-africa',
    subtitle: 'City · South Africa',
    matchNames: ['Johannesburg'],
    about:
      'Johannesburg rose on the Witwatersrand gold reef as South Africa’s largest inland metropolis, a high-veld city of mine dumps, downtown towers, and northern suburb ridges. Apartheid’s spatial legacy still shapes neighborhoods; museums and markets narrate the longer story. Thunderstorm summers and dry winters mark the plateau climate. Orientation is central business district versus northern ridge suburbs. Johannesburg’s primer is gold-reef metropolis — an economic engine built on the high inland plateau rather than a coastal harbor.',
    facts: {
      kind: 'City',
      country: 'South Africa',
      region: 'Africa',
      setting: 'Witwatersrand · Highveld plateau',
      role: 'Largest South African city and economic hub',
      knownFor: 'Skyline, gold-reef history, and high-veld setting',
    },
    features: [
      {
        name: 'CBD skyline',
        description:
          'Tower clusters marking the historic commercial core.',
      },
      {
        name: 'Reef ridges',
        description:
          'Mine-era landforms and northern suburban high ground.',
      },
      {
        name: 'Highveld plain',
        description:
          'Inland plateau climate far from South Africa’s coasts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Johannesburg',
        url: 'https://www.britannica.com/place/Johannesburg',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'colorado',
    code: 'CO',
    name: 'Colorado',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Colorado'],
    about:
      'Colorado spans High Plains and the Southern Rockies, a state of fourteeners, alpine basins, and Front Range cities pressed against the mountain wall. Maroon Bells and Continental Divide passes define classic Western scenery; Denver’s plains edge meets the foothills. Snowpack feeds rivers that leave the state in every direction. Orientation is plains versus Rockies crest. Colorado’s primer is Rocky Mountain state — high elevation, sharp relief, and a Front Range urban belt under continental skies.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Southern Rockies · High Plains',
      role: 'Mountain West state and Front Range hub',
      knownFor: 'Fourteeners, alpine basins, and Front Range cities',
    },
    features: [
      {
        name: 'Rocky crest',
        description:
          'High peaks and passes along the Continental Divide.',
      },
      {
        name: 'Front Range',
        description:
          'The urban foothill belt where plains meet mountains.',
      },
      {
        name: 'Alpine basins',
        description:
          'Lake and meadow valleys such as those around Maroon Bells.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Colorado',
        url: 'https://www.britannica.com/place/Colorado-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'arizona',
    code: 'AZ',
    name: 'Arizona',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Arizona'],
    about:
      'Arizona is a southwestern state of desert basins, red-rock plateaus, and the Colorado River’s canyon country. Sonoran cactus forests meet Colorado Plateau mesas; Sedona’s sandstone and Monument Valley’s buttes concentrate the visual language of the arid West. Phoenix sprawls in a hot valley; high country cools the north. Orientation is desert lowlands versus plateau rim. Arizona’s primer is canyon-and-desert state — intense light, sparse water, and landforms that made the Southwest iconic.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Sonoran Desert · Colorado Plateau',
      role: 'Southwestern desert and canyon state',
      knownFor: 'Red rock, canyon country, and Sonoran deserts',
    },
    features: [
      {
        name: 'Red-rock country',
        description:
          'Sandstone formations around Sedona and similar plateaus.',
      },
      {
        name: 'Sonoran basins',
        description:
          'Hot desert valleys with saguaro and urban oases.',
      },
      {
        name: 'Canyon approaches',
        description:
          'Colorado River landscapes that define northern Arizona.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Arizona',
        url: 'https://www.britannica.com/place/Arizona-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'queensland',
    code: 'QLD',
    name: 'Queensland',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['Queensland'],
    about:
      'Queensland covers Australia’s northeast — tropical coast, Great Dividing Range hinterland, and outback plains stretching west. Brisbane anchors the southeast; reef and rainforest meet farther north around Cairns and the Daintree. Cyclone seasons and dry inland heat shape regional life. Orientation is Pacific coast versus western outback. Queensland’s primer is tropical Australian state — long warm coastline, World Heritage forests, and reef waters under a subtropical to tropical sun.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Northeast Australia · coast to outback',
      role: 'Large northeastern Australian state',
      knownFor: 'Tropical coast, rainforest, and reef approaches',
    },
    features: [
      {
        name: 'Tropical coast',
        description:
          'Warm Pacific shores and beach cities along the east.',
      },
      {
        name: 'Wet tropics',
        description:
          'Rainforest landscapes including the Daintree region.',
      },
      {
        name: 'Western plains',
        description:
          'Drier inland country stretching toward the outback.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Queensland',
        url: 'https://www.britannica.com/place/Queensland-state-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'catalonia',
    code: 'CAT',
    name: 'Catalonia',
    kind: 'State',
    countrySlug: 'spain',
    subtitle: 'State · Spain',
    matchNames: ['Catalonia'],
    about:
      'Catalonia occupies Spain’s northeastern corner between the Pyrenees, the Mediterranean, and inland plains, an autonomous community centered on Barcelona yet extending to Costa Brava coves and Montserrat’s jagged massif. Catalan language and institutions shape public life. Romanesque churches and modernist urbanism share one cultural field. Orientation is coast versus Pyrenean north and the Barcelona metropolitan belt. Catalonia’s primer is Mediterranean autonomous land — mountain, coast, and a strong regional identity inside Spain.',
    facts: {
      kind: 'State',
      country: 'Spain',
      region: 'Europe',
      setting: 'Northeast Spain · Pyrenees to Mediterranean',
      role: 'Autonomous community and regional cultural center',
      knownFor: 'Barcelona region, Costa Brava, and Montserrat',
    },
    features: [
      {
        name: 'Mediterranean coast',
        description:
          'Costa Brava cliffs and beaches along the Catalan shore.',
      },
      {
        name: 'Pyrenean north',
        description:
          'Mountain valleys forming the community’s inland wall.',
      },
      {
        name: 'Montserrat',
        description:
          'A serrated massif and monastery landmark inland from the coast.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Catalonia',
        url: 'https://www.britannica.com/place/Catalonia-community-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mallorca',
    code: 'PMA',
    name: 'Mallorca',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Mallorca', 'Majorca'],
    about:
      'Mallorca is the largest Balearic Island in the western Mediterranean, a limestone land of Tramuntana ridges, calas, and Palma’s cathedral-facing bay. Serra de Tramuntana terraces and olive groves contrast with busier south-coast resorts. Mediterranean scrub and stone villages structure the interior. Orientation is mountain spine versus Palma bay and eastern coves. Mallorca’s primer is Balearic main island — limestone mountains and turquoise inlets under a long Spanish Mediterranean summer.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Balearic Islands · western Mediterranean',
      role: 'Largest Balearic island and regional hub',
      knownFor: 'Tramuntana range, calas, and Palma bay',
    },
    features: [
      {
        name: 'Serra de Tramuntana',
        description:
          'A UNESCO mountain spine of terraces and stone villages.',
      },
      {
        name: 'Palma bay',
        description:
          'The principal harbor city facing a wide Mediterranean gulf.',
      },
      {
        name: 'Coastal calas',
        description:
          'Rocky inlets and beaches cut into limestone shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Majorca',
        url: 'https://www.britannica.com/place/Majorca',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cultural Landscape of the Serra de Tramuntana',
        url: 'https://whc.unesco.org/en/list/1371/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tenerife',
    code: 'TNF',
    name: 'Tenerife',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Tenerife'],
    about:
      'Tenerife is the largest Canary Island, a volcanic Atlantic landmass crowned by Mount Teide’s high crater and flanked by black-sand coasts and subtropical valleys. Trade-wind clouds often wrap the north while the south stays drier. Lunar highland landscapes sit above banana terraces and resort shores. Orientation is Teide summit versus north and south coasts. Tenerife’s primer is Atlantic volcanic island — Spain’s highest peak rising from an oceanic archipelago off Africa.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Canary Islands · Atlantic volcanic arc',
      role: 'Largest Canary Island and Teide national park host',
      knownFor: 'Mount Teide, volcanic highlands, and dual coasts',
    },
    features: [
      {
        name: 'Mount Teide',
        description:
          'Spain’s highest peak and a vast volcanic caldera landscape.',
      },
      {
        name: 'Trade-wind north',
        description:
          'Cloudier, greener slopes facing prevailing Atlantic winds.',
      },
      {
        name: 'Southern shores',
        description:
          'Drier resort coasts and black volcanic beaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tenerife',
        url: 'https://www.britannica.com/place/Tenerife',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Teide National Park',
        url: 'https://whc.unesco.org/en/list/1258/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tahiti',
    code: 'TAH',
    name: 'Tahiti',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Tahiti'],
    about:
      'Tahiti is the largest Society Island in French Polynesia, a twin-lobed volcanic island of sharp peaks, lagoon edges, and Papeete’s harbor on the northwest. Waterfalls cut rainforest valleys; the isthmus of Taravao links Tahiti Nui and Tahiti Iti. Reef and trade winds shape coastal life. Orientation is Papeete versus interior ridges and the smaller southeastern lobe. Tahiti’s primer is Polynesian volcanic main island — the administrative and cultural gateway to French Polynesia’s wider lagoon world.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Oceania',
      setting: 'Society Islands · volcanic twin lobes',
      role: 'Principal French Polynesian island and capital host',
      knownFor: 'Papeete harbor, volcanic ridges, and lagoon coasts',
    },
    features: [
      {
        name: 'Papeete waterfront',
        description:
          'The harbor capital facing the northwestern lagoon.',
      },
      {
        name: 'Interior ridges',
        description:
          'Steep volcanic peaks and waterfall valleys inland.',
      },
      {
        name: 'Twin lobes',
        description:
          'Tahiti Nui and Tahiti Iti joined by the Taravao isthmus.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tahiti',
        url: 'https://www.britannica.com/place/Tahiti',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'maui',
    code: 'MAU',
    name: 'Maui',
    kind: 'Island',
    countrySlug: 'united-states',
    subtitle: 'Island · United States',
    matchNames: ['Maui'],
    about:
      'Maui is the second-largest Hawaiian island, a volcanic double mass of West Maui Mountains and vast Haleakalā, with the isthmus towns between them. The Road to Hāna threads wet windward cliffs; the summit crater of Haleakalā opens as a colorful high desert. Trade winds and microclimates shift mile by mile. Orientation is Haleakalā versus west Maui and the central valley. Maui’s primer is Hawaiian volcanic isle — beaches, rainforest coast, and a giant dormant crater under Pacific trade winds.',
    facts: {
      kind: 'Island',
      country: 'United States',
      region: 'Oceania',
      setting: 'Hawaiian Islands · double volcanic mass',
      role: 'Major Hawaiian island and visitor destination',
      knownFor: 'Haleakalā, Road to Hāna, and diverse coasts',
    },
    features: [
      {
        name: 'Haleakalā',
        description:
          'A massive shield volcano with a colorful summit crater.',
      },
      {
        name: 'Windward Hāna coast',
        description:
          'Wet cliffs, waterfalls, and the famous coastal road.',
      },
      {
        name: 'Central isthmus',
        description:
          'The low saddle linking Maui’s two volcanic masses.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Maui',
        url: 'https://www.britannica.com/place/Maui-island-Hawaii',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Haleakalā',
        url: 'https://www.nps.gov/hale/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'rhodes',
    code: 'RHO',
    name: 'Rhodes',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Rhodes'],
    about:
      'Rhodes is the largest Dodecanese island, a sunlit Aegean land of medieval Old Town walls, Lindos’s acropolis, and long pebble beaches. Knights Hospitaller fortifications still define the harbor city; inland hills hold villages and pine. Crossroads history links Greek, Roman, Byzantine, and Ottoman layers. Orientation is walled Rhodes Town versus Lindos and the island’s mountainous south. Rhodes’s primer is fortified Aegean island — crusader stone and classical sites on a major eastern Mediterranean crossroads.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Dodecanese · eastern Aegean',
      role: 'Largest Dodecanese island and historic harbor seat',
      knownFor: 'Medieval Old Town, Lindos, and Aegean coasts',
    },
    features: [
      {
        name: 'Medieval Old Town',
        description:
          'UNESCO-walled streets and harbors from the Knights’ era.',
      },
      {
        name: 'Lindos acropolis',
        description:
          'A cliff-top ancient and medieval site above a white village.',
      },
      {
        name: 'Aegean shores',
        description:
          'Long beaches and coves around the island perimeter.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Rhodes',
        url: 'https://www.britannica.com/place/Rhodes-island-Greece',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Medieval City of Rhodes',
        url: 'https://whc.unesco.org/en/list/493/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'azores',
    code: 'AZO',
    name: 'Azores',
    kind: 'Island',
    countrySlug: 'portugal',
    subtitle: 'Island · Portugal',
    matchNames: ['Azores'],
    about:
      'The Azores are a mid-Atlantic Portuguese archipelago of nine volcanic islands, green crater lakes, and steep coastal cliffs far west of mainland Europe. São Miguel’s Sete Cidades caldera lakes are a classic image; other islands hold fumaroles, hydrangea hedges, and whale-rich seas. Isolation and Atlantic weather define daily life. Orientation for this primer centers on the volcanic lake islands of the eastern group. The Azores’ primer is mid-ocean volcanic chain — lush calderas rising from deep Atlantic waters under Portuguese administration.',
    facts: {
      kind: 'Island',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Mid-Atlantic volcanic archipelago',
      role: 'Autonomous Portuguese island region',
      knownFor: 'Crater lakes, green volcanic cones, and isolation',
    },
    features: [
      {
        name: 'Caldera lakes',
        description:
          'Water-filled volcanic basins such as Sete Cidades.',
      },
      {
        name: 'Atlantic cliffs',
        description:
          'Steep coastal walls dropping into deep ocean swells.',
      },
      {
        name: 'Geothermal ground',
        description:
          'Fumaroles and hot springs reminding that the islands are active.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Azores',
        url: 'https://www.britannica.com/place/Azores',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cappadocia',
    code: 'CAP',
    name: 'Cappadocia',
    kind: 'Region',
    countrySlug: 'turkiye',
    subtitle: 'Region · Türkiye',
    matchNames: ['Cappadocia'],
    about:
      'Cappadocia is a central Anatolian region of soft volcanic tuff eroded into fairy chimneys, cave dwellings, and underground cities. Göreme and nearby valleys concentrate rock-cut churches and balloon-season skies. Byzantine monastic heritage fills carved interiors. Orientation is fairy-chimney valleys versus plateau towns. Cappadocia’s primer is tuff badlands — a surreal eroded plateau where geology and human carving share the same soft stone.',
    facts: {
      kind: 'Region',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Central Anatolia · volcanic tuff plateau',
      role: 'Historic rock-cut landscape and visitor region',
      knownFor: 'Fairy chimneys, cave churches, and Göreme valleys',
    },
    features: [
      {
        name: 'Fairy chimneys',
        description:
          'Eroded tuff spires that define Cappadocia’s skyline.',
      },
      {
        name: 'Rock-cut churches',
        description:
          'Byzantine frescoed chapels carved into soft stone.',
      },
      {
        name: 'Valley towns',
        description:
          'Settlements such as Göreme set among the badland cones.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cappadocia',
        url: 'https://www.britannica.com/place/Cappadocia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Göreme National Park and the Rock Sites of Cappadocia',
        url: 'https://whc.unesco.org/en/list/357/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'okavango',
    code: 'OKV',
    name: 'Okavango',
    kind: 'Region',
    countrySlug: 'botswana',
    subtitle: 'Region · Botswana',
    matchNames: ['Okavango', 'Okavango Delta'],
    about:
      'The Okavango is an inland delta in northern Botswana where a river spreads into seasonal floodplains instead of reaching the sea. Papyrus channels, wildlife islands, and mokoro waterways define one of Africa’s great wetland systems. Flood timing follows upstream rains months earlier. Orientation is permanent swamp versus seasonal flood fringe. The Okavango’s primer is desert-edge inland delta — water spreading across Kalahari sands to create a shifting mosaic of wetland and dryland habitats.',
    facts: {
      kind: 'Region',
      country: 'Botswana',
      region: 'Africa',
      setting: 'Northern Botswana · inland alluvial fan',
      role: 'Major African wetland and wildlife landscape',
      knownFor: 'Seasonal floods, channels, and wildlife islands',
    },
    features: [
      {
        name: 'Floodplain mosaic',
        description:
          'Channels and islands that shift with the annual flood.',
      },
      {
        name: 'Papyrus waterways',
        description:
          'Vegetated channels navigated by mokoro and boats.',
      },
      {
        name: 'Dryland edge',
        description:
          'Kalahari margins where wetland meets arid plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Okavango River',
        url: 'https://www.britannica.com/place/Okavango-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Okavango Delta',
        url: 'https://whc.unesco.org/en/list/1432/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'dolomites',
    code: 'DOL',
    name: 'Dolomites',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Dolomites', 'Dolomiti'],
    about:
      'The Dolomites are a pale limestone mountain range in northeastern Italy, famous for vertical towers, high passes, and alpenglow that turns cliffs pink at dusk. Tre Cime and other massifs concentrate classic via ferrata and hut-to-hut terrain. German-, Italian-, and Ladin-speaking valleys share the region. Orientation is high towers versus valley floors and pass roads. The Dolomites’ primer is pale Alpine fortress — distinctive carbonate peaks that read more like cathedrals than ordinary snow mountains.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Northeastern Italian Alps · carbonate peaks',
      role: 'UNESCO mountain landscape and Alpine destination',
      knownFor: 'Pale towers, Tre Cime, and alpenglow cliffs',
    },
    features: [
      {
        name: 'Pale towers',
        description:
          'Vertical limestone peaks that define Dolomite skylines.',
      },
      {
        name: 'High passes',
        description:
          'Road and trail cols linking valleys between massifs.',
      },
      {
        name: 'Alpenglow walls',
        description:
          'Cliff faces that flush pink and orange at dusk.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Dolomites',
        url: 'https://www.britannica.com/place/Dolomite-Alps',
        kind: 'reference',
      },
      {
        label: 'UNESCO — The Dolomites',
        url: 'https://whc.unesco.org/en/list/1237/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'loire-valley',
    code: 'LOI',
    name: 'Loire Valley',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Loire Valley'],
    about:
      'The Loire Valley follows France’s longest river through a cultural landscape of Renaissance châteaux, vineyards, and soft limestone towns. Royal residences such as Chambord and Chenonceau punctuate a wide, sandbank-rich river corridor. Wine appellations and formal gardens share the same gentle terrain. Orientation is river axis versus château parks on either bank. The Loire Valley’s primer is château river country — a slow royal waterway lined with stone fantasies and cultivated French countryside.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Loire River corridor · central France',
      role: 'Historic château landscape and wine region',
      knownFor: 'Renaissance châteaux, vineyards, and river towns',
    },
    features: [
      {
        name: 'Château corridor',
        description:
          'Royal and noble residences spaced along the river.',
      },
      {
        name: 'River flats',
        description:
          'Wide sandbank channels and gentle floodplain towns.',
      },
      {
        name: 'Vineyard slopes',
        description:
          'Appellation hillsides framing the cultural landscape.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Loire River',
        url: 'https://www.britannica.com/place/Loire-River',
        kind: 'reference',
      },
      {
        label: 'UNESCO — The Loire Valley between Sully-sur-Loire and Chalonnes',
        url: 'https://whc.unesco.org/en/list/933/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'stonehenge',
    code: 'STN',
    name: 'Stonehenge',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Stonehenge'],
    about:
      'Stonehenge is a prehistoric stone circle on Salisbury Plain in southern England, an arrangement of sarsen uprights and lintels with smaller bluestones at the core. The monument aligns with solstice sunrise and sits among burial mounds and ceremonial earthworks. Its purpose remains debated; its silhouette is unmistakable. Orientation is the circle, Avenue approach, and surrounding plain. Stonehenge’s primer is prehistoric monument — a carefully engineered ring of stone that still focuses solstice light on an open English chalk down.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Salisbury Plain · chalk downland',
      role: 'Prehistoric stone circle and World Heritage site',
      knownFor: 'Sarsen circle, solstice alignment, and plain setting',
    },
    features: [
      {
        name: 'Sarsen circle',
        description:
          'The outer ring of uprights and lintels that defines the silhouette.',
      },
      {
        name: 'Bluestone setting',
        description:
          'Smaller inner stones brought from distant Welsh sources.',
      },
      {
        name: 'Ceremonial plain',
        description:
          'Barrows and earthworks surrounding the monument field.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Stonehenge',
        url: 'https://www.britannica.com/topic/Stonehenge',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Stonehenge, Avebury and Associated Sites',
        url: 'https://whc.unesco.org/en/list/373/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'chichen-itza',
    code: 'CIZ',
    name: 'Chichén Itzá',
    kind: 'Landmark',
    countrySlug: 'mexico',
    subtitle: 'Landmark · Mexico',
    matchNames: ['Chichen Itza', 'Chichén Itzá'],
    about:
      'Chichén Itzá is a major Maya city in Yucatán, famous for El Castillo’s stepped pyramid, the Great Ball Court, and a sacred cenote. Carved serpent symbolism and astronomical alignments structure the ritual core. The site concentrates Terminal Classic and later Maya-Toltec architectural styles. Orientation is the pyramid plaza versus ball court and cenote. Chichén Itzá’s primer is Maya ceremonial city — a limestone ritual landscape where geometry, myth, and water sinkholes meet on the Yucatán plain.',
    facts: {
      kind: 'Landmark',
      country: 'Mexico',
      region: 'Americas',
      setting: 'Yucatán Peninsula · limestone plain',
      role: 'Major Maya archaeological city',
      knownFor: 'El Castillo pyramid, ball court, and sacred cenote',
    },
    features: [
      {
        name: 'El Castillo',
        description:
          'The stepped pyramid that dominates the main plaza.',
      },
      {
        name: 'Great Ball Court',
        description:
          'A vast ritual court with carved rings and panels.',
      },
      {
        name: 'Sacred cenote',
        description:
          'A natural sinkhole used in Maya ceremonial life.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Chichén Itzá',
        url: 'https://www.britannica.com/place/Chichen-Itza',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pre-Hispanic City of Chichen-Itza',
        url: 'https://whc.unesco.org/en/list/483/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'zion',
    code: 'ZIO',
    name: 'Zion',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Zion', 'Zion National Park', 'Zion Canyon'],
    about:
      'Zion National Park protects a deep Navajo Sandstone canyon in southwestern Utah where the Virgin River has cut towering red walls and hanging gardens. The Narrows and Angels Landing routes concentrate the park’s drama; cottonwoods green the canyon floor. Desert light shifts the cliff colors through the day. Orientation is canyon floor versus rim plateaus. Zion’s primer is sandstone canyon park — vertical red walls and a living river corridor in the Colorado Plateau’s edge country.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Southwestern Utah · Navajo Sandstone canyon',
      role: 'Major U.S. national park canyon landscape',
      knownFor: 'Red canyon walls, Virgin River, and Narrows',
    },
    features: [
      {
        name: 'Zion Canyon',
        description:
          'The main sandstone corridor carved by the Virgin River.',
      },
      {
        name: 'The Narrows',
        description:
          'A slot-like stretch where the river fills the canyon floor.',
      },
      {
        name: 'Rim and hanging gardens',
        description:
          'High plateaus and spring-fed greenery on cliff faces.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zion National Park',
        url: 'https://www.britannica.com/place/Zion-National-Park',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mont-blanc',
    code: 'MTB',
    name: 'Mont Blanc',
    kind: 'Landmark',
    countrySlug: 'france',
    subtitle: 'Landmark · France',
    matchNames: ['Mont Blanc'],
    about:
      'Mont Blanc is the highest peak in the Alps, a glaciated massif rising above Chamonix on the French–Italian border. Icefalls, aiguilles, and the Vallée Blanche define classic high-Alpine scenery; cableways and mountain huts open approaches for climbers and sightseers. Weather can close the summit in hours. Orientation is Chamonix valley floor versus the white summit dome. Mont Blanc’s primer is Alpine high point — ice, granite needles, and a border massif that crowns western Europe’s mountain spine.',
    facts: {
      kind: 'Landmark',
      country: 'France',
      region: 'Europe',
      setting: 'Western Alps · Chamonix massif',
      role: 'Highest Alpine peak and mountaineering landmark',
      knownFor: 'Glaciated summit, aiguilles, and Chamonix views',
    },
    features: [
      {
        name: 'Summit dome',
        description:
          'The ice-covered high point shared by France and Italy.',
      },
      {
        name: 'Aiguilles',
        description:
          'Granite needle peaks flanking the main massif.',
      },
      {
        name: 'Chamonix approaches',
        description:
          'Valley views, cableways, and classic Alpine routes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mont Blanc',
        url: 'https://www.britannica.com/place/Mont-Blanc',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pompeii',
    code: 'POM',
    name: 'Pompeii',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Pompeii'],
    about:
      'Pompeii is the Roman city buried by Vesuvius on the Bay of Naples, excavated streets and houses preserving everyday life under volcanic ash. The forum, amphitheater, and frescoed villas form an open-air archive of the first century. Vesuvius still looms over the site. Orientation is forum core versus city blocks and the volcano backdrop. Pompeii’s primer is buried Roman town — a catastrophe that froze streets, shops, and art for later centuries to uncover.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · Vesuvius slopes',
      role: 'Excavated Roman city and archaeological park',
      knownFor: 'Forum, frescoes, and Vesuvius burial story',
    },
    features: [
      {
        name: 'Forum and streets',
        description:
          'The civic core and grid of shops, houses, and temples.',
      },
      {
        name: 'Domestic frescoes',
        description:
          'Painted interiors preserving Roman daily aesthetics.',
      },
      {
        name: 'Vesuvius backdrop',
        description:
          'The volcano whose eruption both destroyed and preserved the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pompeii',
        url: 'https://www.britannica.com/place/Pompeii',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Archaeological Areas of Pompei, Herculaneum and Torre Annunziata',
        url: 'https://whc.unesco.org/en/list/829/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'terracotta-army',
    code: 'XIA',
    name: 'Terracotta Army',
    kind: 'Landmark',
    countrySlug: 'china',
    subtitle: 'Landmark · China',
    matchNames: ['Terracotta Army', 'Terracotta Warriors'],
    about:
      'The Terracotta Army guards the mausoleum complex of China’s First Emperor near Xi’an, thousands of life-size clay soldiers, horses, and chariots buried in underground pits. Each figure was modeled with individual faces and ranks; excavation halls now shelter the standing ranks. The wider necropolis still holds unexcavated mounds. Orientation is the main pits versus the emperor’s burial mound nearby. The Terracotta Army’s primer is funerary clay host — an underground imperial guard that turned archaeology into one of China’s defining cultural landmarks.',
    facts: {
      kind: 'Landmark',
      country: 'China',
      region: 'Asia',
      setting: 'Near Xi’an · Qin mausoleum complex',
      role: 'Imperial funerary sculpture site and museum',
      knownFor: 'Life-size clay soldiers, horses, and burial pits',
    },
    features: [
      {
        name: 'Warrior pits',
        description:
          'Excavated halls of standing terracotta ranks in formation.',
      },
      {
        name: 'Individual faces',
        description:
          'Modeled features and ranks that make each figure distinct.',
      },
      {
        name: 'Mausoleum field',
        description:
          'The wider Qin burial landscape still partly unexcavated.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Qin tomb',
        url: 'https://www.britannica.com/place/Qin-tomb',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mausoleum of the First Qin Emperor',
        url: 'https://whc.unesco.org/en/list/441/',
        kind: 'authority',
      },
    ],
  },
]
