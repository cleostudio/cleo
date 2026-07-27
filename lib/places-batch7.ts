/** Seventh curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch7: PlaceGuideDraftBatch[] = [
  {
    slug: 'denver',
    code: 'DEN',
    name: 'Denver',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Denver'],
    about:
      'Denver sits on the High Plains just east of the Rocky Mountain Front Range, a mile-high capital of parks, brewery districts, and a skyline backed by snow peaks. Civic Center and the Capitol dome organize downtown; trails climb toward foothill parks within sight of the city. Dry air and intense sun shape outdoor life. Orientation is plains grid versus mountain wall. Denver’s primer is Front Range capital — western American urbanism living where grassland meets the Rockies.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'High Plains · Rocky Mountain Front Range',
      role: 'Colorado capital and Front Range hub',
      knownFor: 'Mile-high setting, mountain backdrop, and civic core',
    },
    features: [
      {
        name: 'Front Range wall',
        description:
          'Snow-capped peaks framing the western skyline.',
      },
      {
        name: 'Civic core',
        description:
          'Capitol and Civic Center anchoring downtown Denver.',
      },
      {
        name: 'Plains grid',
        description:
          'A high, dry urban field spreading east from the foothills.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Denver',
        url: 'https://www.britannica.com/place/Denver',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'philadelphia',
    code: 'PHL',
    name: 'Philadelphia',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Philadelphia'],
    about:
      'Philadelphia occupies the Delaware and Schuylkill rivers as a foundational American city of Independence Hall brick, row-house neighborhoods, and a modern Center City skyline. William Penn’s grid still structures Center City; Fairmount Park opens green corridors along the Schuylkill. Revolutionary and industrial layers share walkable streets. Orientation is historic Old City versus Center City towers and river edges. Philadelphia’s primer is river founding city — colonial civic landmarks and dense neighborhood fabric on a Mid-Atlantic confluence.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Delaware–Schuylkill confluence',
      role: 'Major Mid-Atlantic city and historic founding center',
      knownFor: 'Independence Hall, row houses, and river parks',
    },
    features: [
      {
        name: 'Old City',
        description:
          'Brick streets and Independence-era civic landmarks.',
      },
      {
        name: 'Center City',
        description:
          'The planned grid and modern skyline core.',
      },
      {
        name: 'River parks',
        description:
          'Schuylkill and Delaware edges with long green corridors.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Philadelphia',
        url: 'https://www.britannica.com/place/Philadelphia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Independence Hall',
        url: 'https://whc.unesco.org/en/list/78/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'atlanta',
    code: 'ATL',
    name: 'Atlanta',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Atlanta'],
    about:
      'Atlanta crowns a Piedmont ridge in northern Georgia as the Southeast’s principal inland metropolis, a city of tree-canopied neighborhoods, a tower skyline, and a vast airport gateway. Civil rights history and corporate campuses share the same urban field. Hot, humid summers and rolling forest suburbs define the climate and grain. Orientation is downtown–Midtown corridor versus surrounding ridge suburbs. Atlanta’s primer is Piedmont hub — a green inland capital that grew from rail crossroads into the Southeast’s commercial center.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Georgia Piedmont · inland ridge',
      role: 'Southeast U.S. commercial and transport hub',
      knownFor: 'Skyline corridor, tree canopy, and inland gateway role',
    },
    features: [
      {
        name: 'Downtown–Midtown',
        description:
          'A tower corridor forming Atlanta’s skyline spine.',
      },
      {
        name: 'Tree canopy',
        description:
          'Dense neighborhood greenery rare among large U.S. cities.',
      },
      {
        name: 'Piedmont ridges',
        description:
          'Rolling terrain that structures suburbs and parks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Atlanta',
        url: 'https://www.britannica.com/place/Atlanta-Georgia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'houston',
    code: 'HOU',
    name: 'Houston',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Houston'],
    about:
      'Houston sprawls across a humid Gulf Coastal Plain as Texas’s largest city, a polycentric metropolis of energy industry campuses, bayou corridors, and a downtown tower cluster. Ship Channel industry links inland Houston to the Gulf; museums and medical centers concentrate near the core. Flat terrain and subtropical storms shape the urban landscape. Orientation is downtown versus bayou network and port edge. Houston’s primer is Gulf plain megacity — expansive, humid, and industrially tied to the nearby sea.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Gulf Coastal Plain · bayou network',
      role: 'Largest Texas city and energy industry hub',
      knownFor: 'Downtown towers, bayous, and Ship Channel port',
    },
    features: [
      {
        name: 'Downtown core',
        description:
          'A dense tower cluster on the otherwise low coastal plain.',
      },
      {
        name: 'Bayou corridors',
        description:
          'Waterways that thread parks and neighborhoods through the city.',
      },
      {
        name: 'Ship Channel',
        description:
          'The industrial water link from Houston to the Gulf.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Houston',
        url: 'https://www.britannica.com/place/Houston',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'porto',
    code: 'OPO',
    name: 'Porto',
    kind: 'City',
    countrySlug: 'portugal',
    subtitle: 'City · Portugal',
    matchNames: ['Porto'],
    about:
      'Porto climbs steep banks of the Douro where the river meets the Atlantic approaches, a granite city of Ribeira quays, tiled façades, and Dom Luís Bridge arches. Port wine lodges face the historic center from Vila Nova de Gaia; azulejo churches punctuate hillside streets. Atlantic mist and steep stairs define daily movement. Orientation is Ribeira versus Gaia and the river gorge. Porto’s primer is Douro-mouth city — layered granite neighborhoods pouring down to a working riverfront.',
    facts: {
      kind: 'City',
      country: 'Portugal',
      region: 'Europe',
      setting: 'Douro River mouth · Atlantic approaches',
      role: 'Northern Portuguese metropolis and historic port',
      knownFor: 'Ribeira waterfront, tiled façades, and river bridges',
    },
    features: [
      {
        name: 'Ribeira',
        description:
          'The UNESCO riverfront of colorful houses and quays.',
      },
      {
        name: 'Dom Luís Bridge',
        description:
          'A double-deck iron arch linking Porto and Gaia.',
      },
      {
        name: 'Hill streets',
        description:
          'Steep granite lanes climbing from the Douro banks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Porto',
        url: 'https://www.britannica.com/place/Porto-Portugal',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Oporto',
        url: 'https://whc.unesco.org/en/list/755/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'valencia',
    code: 'VLC',
    name: 'Valencia',
    kind: 'City',
    countrySlug: 'spain',
    subtitle: 'City · Spain',
    matchNames: ['Valencia'],
    about:
      'Valencia faces the Mediterranean on Spain’s east coast, a city of silk-exchange Gothic halls, a Turia garden in a former riverbed, and Santiago Calatrava’s white City of Arts and Sciences. Paella’s home kitchens and orange groves lie nearby. Mild winters and long beach avenues shape outdoor life. Orientation is old town versus Turia gardens and coastal strip. Valencia’s primer is Mediterranean Spanish capital — historic fabric and futurist forms sharing one coastal plain.',
    facts: {
      kind: 'City',
      country: 'Spain',
      region: 'Europe',
      setting: 'Mediterranean coast · Turia corridor',
      role: 'Major eastern Spanish city and regional capital',
      knownFor: 'Old town, Turia gardens, and Arts and Sciences',
    },
    features: [
      {
        name: 'Historic core',
        description:
          'Gothic and baroque streets around silk-exchange halls.',
      },
      {
        name: 'Turia gardens',
        description:
          'A green park corridor in the former riverbed.',
      },
      {
        name: 'Arts and Sciences',
        description:
          'A white architectural complex on the city’s eastern edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Valencia',
        url: 'https://www.britannica.com/place/Valencia-Spain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'seville',
    code: 'SVQ',
    name: 'Seville',
    kind: 'City',
    countrySlug: 'spain',
    subtitle: 'City · Spain',
    matchNames: ['Seville', 'Sevilla'],
    about:
      'Seville occupies the Guadalquivir plain in Andalusia, a southern Spanish capital of orange-scented courtyards, a vast Gothic cathedral, and the Plaza de España’s tiled semicircle. The Alcázar’s Mudéjar rooms and Triana’s riverside streets define classic walks. Hot summers slow midday life. Orientation is cathedral–Alcázar core versus river and María Luisa Park. Seville’s primer is Andalusian river capital — intense light, patio culture, and layered Islamic-to-baroque fabric on a low Iberian plain.',
    facts: {
      kind: 'City',
      country: 'Spain',
      region: 'Europe',
      setting: 'Guadalquivir plain · Andalusia',
      role: 'Andalusian capital and historic river city',
      knownFor: 'Cathedral, Alcázar, and Plaza de España',
    },
    features: [
      {
        name: 'Cathedral and Giralda',
        description:
          'A vast Gothic church with a landmark former minaret tower.',
      },
      {
        name: 'Alcázar',
        description:
          'Royal Mudéjar palaces and gardens at the historic core.',
      },
      {
        name: 'Plaza de España',
        description:
          'A tiled semicircular civic set piece beside María Luisa Park.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Seville',
        url: 'https://www.britannica.com/place/Seville-Spain',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cathedral, Alcázar and Archivo de Indias in Seville',
        url: 'https://whc.unesco.org/en/list/383/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lyon',
    code: 'LYS',
    name: 'Lyon',
    kind: 'City',
    countrySlug: 'france',
    subtitle: 'City · France',
    matchNames: ['Lyon'],
    about:
      'Lyon sits at the confluence of the Rhône and Saône, a French city of Presqu’île grids, Fourvière hill basilica, and a Renaissance old town of traboule passageways. Silk-trade wealth built much of the historic fabric; contemporary cuisine keeps the city’s table famous. Two rivers structure neighborhoods and views. Orientation is Fourvière versus Presqu’île and the confluence. Lyon’s primer is confluence capital — a hill-and-river French metropolis where Roman, Renaissance, and modern layers meet.',
    facts: {
      kind: 'City',
      country: 'France',
      region: 'Europe',
      setting: 'Rhône–Saône confluence',
      role: 'Major southeastern French metropolis',
      knownFor: 'Old town, Fourvière, and river confluence',
    },
    features: [
      {
        name: 'Vieux Lyon',
        description:
          'Renaissance streets and covered traboule passages.',
      },
      {
        name: 'Fourvière hill',
        description:
          'A basilica-crowned ridge above the Saône.',
      },
      {
        name: 'Presqu’île',
        description:
          'The peninsula grid between the two rivers.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lyon',
        url: 'https://www.britannica.com/place/Lyon-France',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Site of Lyon',
        url: 'https://whc.unesco.org/en/list/872/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'cologne',
    code: 'CGN',
    name: 'Cologne',
    kind: 'City',
    countrySlug: 'germany',
    subtitle: 'City · Germany',
    matchNames: ['Cologne', 'Köln'],
    about:
      'Cologne straddles the Rhine in western Germany, a city forever identified with its twin-spired Gothic cathedral rising above the riverbank. Roman foundations, medieval churches, and a rebuilt postwar core share the left bank; bridges stitch to the right-bank districts. Carnival culture and museum clusters animate the center. Orientation is cathedral square versus Rhine embankments. Cologne’s primer is Rhine cathedral city — a black basalt spire pair commanding one of Germany’s great river crossings.',
    facts: {
      kind: 'City',
      country: 'Germany',
      region: 'Europe',
      setting: 'Rhine River · western Germany',
      role: 'Major Rhineland city and cathedral seat',
      knownFor: 'Gothic cathedral, Rhine bridges, and riverbanks',
    },
    features: [
      {
        name: 'Cologne Cathedral',
        description:
          'Twin Gothic spires rising beside the Rhine.',
      },
      {
        name: 'Rhine embankments',
        description:
          'Promenades and bridges organizing the river city.',
      },
      {
        name: 'Old town lanes',
        description:
          'Brewery streets and squares near the cathedral.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cologne',
        url: 'https://www.britannica.com/place/Cologne-Germany',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cologne Cathedral',
        url: 'https://whc.unesco.org/en/list/292/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'hamburg',
    code: 'HAM',
    name: 'Hamburg',
    kind: 'City',
    countrySlug: 'germany',
    subtitle: 'City · Germany',
    matchNames: ['Hamburg'],
    about:
      'Hamburg is Germany’s great North Sea port city on the Elbe, a metropolis of warehouse Speicherstadt canals, a modern HafenCity waterfront, and the Elbphilharmonie’s wave roof. Lakes Alster open park-like basins inside the city; ocean-going ships still define the skyline. Maritime trade built Hamburg’s wealth and cosmopolitan tone. Orientation is harbor versus Alster and the historic core. Hamburg’s primer is Elbe port metropolis — brick warehouses and contemporary waterfront culture on Germany’s gateway river.',
    facts: {
      kind: 'City',
      country: 'Germany',
      region: 'Europe',
      setting: 'Elbe River · North Sea approaches',
      role: 'Major German port and Hanseatic metropolis',
      knownFor: 'Harbor, Speicherstadt, and Elbphilharmonie',
    },
    features: [
      {
        name: 'Harbor waterfront',
        description:
          'Working docks and the redeveloped HafenCity edge.',
      },
      {
        name: 'Speicherstadt',
        description:
          'Brick warehouse canals of the historic free-port district.',
      },
      {
        name: 'Alster lakes',
        description:
          'Inner-city water basins framed by parks and promenades.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hamburg',
        url: 'https://www.britannica.com/place/Hamburg-Germany',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Speicherstadt and Kontorhaus District',
        url: 'https://whc.unesco.org/en/list/1467/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'tallinn',
    code: 'TLL',
    name: 'Tallinn',
    kind: 'City',
    countrySlug: 'estonia',
    subtitle: 'City · Estonia',
    matchNames: ['Tallinn'],
    about:
      'Tallinn faces the Gulf of Finland as Estonia’s capital, a Baltic city of intact medieval walls, Toompea hill, and a harbor that once linked Hanseatic trade. Cobblestone Old Town lanes sit beside a glass-and-startup modern shoreline. Long summer light and icy winters reshape the waterfront. Orientation is Old Town versus harbor and Toompea. Tallinn’s primer is Baltic walled capital — one of Northern Europe’s best-preserved medieval cores on a compact coastal hill.',
    facts: {
      kind: 'City',
      country: 'Estonia',
      region: 'Europe',
      setting: 'Gulf of Finland · Baltic coast',
      role: 'National capital and Hanseatic historic port',
      knownFor: 'Medieval Old Town, walls, and harbor front',
    },
    features: [
      {
        name: 'Old Town',
        description:
          'A UNESCO medieval core of walls, towers, and squares.',
      },
      {
        name: 'Toompea',
        description:
          'The upper-town hill of castles and viewpoints.',
      },
      {
        name: 'Harbor edge',
        description:
          'Ferry terminals and modern shoreline districts.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tallinn',
        url: 'https://www.britannica.com/place/Tallinn',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre (Old Town) of Tallinn',
        url: 'https://whc.unesco.org/en/list/822/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'accra',
    code: 'ACC',
    name: 'Accra',
    kind: 'City',
    countrySlug: 'ghana',
    subtitle: 'City · Ghana',
    matchNames: ['Accra'],
    about:
      'Accra spreads along Ghana’s Gulf of Guinea coast as the national capital, a humid Atlantic city of Independence Arch, coastal forts, and dense markets. Fishing beaches and colonial-era streets meet newer commercial districts. Harmattan haze and tropical rains mark seasonal shifts. Orientation is coastal strip versus inland neighborhoods. Accra’s primer is Gulf of Guinea capital — West African political and cultural energy on a low Atlantic shore.',
    facts: {
      kind: 'City',
      country: 'Ghana',
      region: 'Africa',
      setting: 'Gulf of Guinea · Atlantic coast',
      role: 'National capital and principal Ghanaian city',
      knownFor: 'Coastal capital fabric, Independence Arch, and markets',
    },
    features: [
      {
        name: 'Atlantic shore',
        description:
          'Beaches, forts, and coastal roads facing the Gulf.',
      },
      {
        name: 'Independence precinct',
        description:
          'Civic monuments and parade grounds of the capital.',
      },
      {
        name: 'Market districts',
        description:
          'Dense trading neighborhoods that animate daily Accra.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Accra',
        url: 'https://www.britannica.com/place/Accra',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'washington',
    code: 'WA',
    name: 'Washington',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Washington'],
    about:
      'Washington State occupies the Pacific Northwest corner of the contiguous United States, a land of Olympic rainforest, Cascade volcanoes, and inland wheat plateaus east of the mountains. Puget Sound’s inland sea holds Seattle and ferry-linked islands; Mount Rainier anchors the southern Cascades. Wet west and dry east split the climate. Orientation is Sound–Cascades–Columbia Basin. Washington’s primer is Pacific Northwest state — evergreen coasts, volcanic peaks, and a sharp rain-shadow divide.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Pacific Northwest · Cascades and Puget Sound',
      role: 'Pacific Northwest state of forests and volcanoes',
      knownFor: 'Puget Sound, Cascades, and Olympic rainforest',
    },
    features: [
      {
        name: 'Puget Sound',
        description:
          'An inland sea of islands, ferries, and port cities.',
      },
      {
        name: 'Cascade volcanoes',
        description:
          'High peaks including Rainier rising above western forests.',
      },
      {
        name: 'Olympic Peninsula',
        description:
          'Temperate rainforest and wild Pacific coastline.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Washington',
        url: 'https://www.britannica.com/place/Washington-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'alberta',
    code: 'AB',
    name: 'Alberta',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['Alberta'],
    about:
      'Alberta is a Canadian prairie-and-mountain province stretching from Badlands and grasslands to the eastern face of the Rockies. Banff and Jasper concentrate alpine park scenery; Calgary and Edmonton anchor the urban corridor. Chinook winds and cold winters shape the climate. Orientation is Rockies wall versus prairie east. Alberta’s primer is prairie-to-peaks province — open plains rising abruptly into some of Canada’s most famous mountain parks.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Prairies · eastern Canadian Rockies',
      role: 'Prairie and mountain province of western Canada',
      knownFor: 'Rocky Mountain parks, prairies, and Badlands',
    },
    features: [
      {
        name: 'Rocky Mountain parks',
        description:
          'Alpine valleys and peaks along the British Columbia border.',
      },
      {
        name: 'Prairie plains',
        description:
          'Open grasslands and farmland east of the foothills.',
      },
      {
        name: 'Badlands',
        description:
          'Eroded dinosaur country in the southeastern reaches.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alberta',
        url: 'https://www.britannica.com/place/Alberta',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'victoria-au',
    code: 'VAU',
    name: 'Victoria',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['Victoria'],
    about:
      'Victoria is Australia’s southeastern mainland state, compact yet varied from Melbourne’s bay metropolis to the Great Ocean Road’s cliff stacks and alpine high country. Wine regions and goldfields towns mark the inland; Bass Strait weather shapes the coast. Cooler southern latitudes distinguish it from warmer northern states. Orientation is Port Phillip Bay versus western cliffs and eastern ranges. Victoria’s primer is southeastern Australian state — a dense cultural capital paired with dramatic ocean and alpine edges.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Southeastern Australia · coast to alps',
      role: 'Compact southeastern Australian state',
      knownFor: 'Melbourne region, Great Ocean Road, and alpine country',
    },
    features: [
      {
        name: 'Port Phillip region',
        description:
          'The bay metropolis and surrounding coastal plains.',
      },
      {
        name: 'Great Ocean Road',
        description:
          'Cliff coasts and sea stacks along the southwest.',
      },
      {
        name: 'Alpine high country',
        description:
          'Southeastern ranges that hold Australia’s alpine parks.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Victoria',
        url: 'https://www.britannica.com/place/Victoria-state-Australia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'naxos',
    code: 'NAX',
    name: 'Naxos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Naxos'],
    about:
      'Naxos is the largest Cycladic island, a fertile Aegean land of marble mountains, long west-coast beaches, and the Portara gateway ruin facing the harbor. Inland villages sit among olive and potato fields rare on drier neighbors. Venetian Kastro streets crown Naxos Town. Orientation is Portara harbor versus central mountains and western sands. Naxos’s primer is green Cycladic giant — broader, more agricultural, and more mountainous than its famous white-cube neighbors.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · central Aegean',
      role: 'Largest Cycladic island',
      knownFor: 'Portara, fertile interior, and west-coast beaches',
    },
    features: [
      {
        name: 'Portara',
        description:
          'A marble temple doorway ruin on the harbor islet approach.',
      },
      {
        name: 'Mountain interior',
        description:
          'Villages and marble highlands at the island’s core.',
      },
      {
        name: 'West beaches',
        description:
          'Long sandy shores facing the open Aegean.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Naxos',
        url: 'https://www.britannica.com/place/Naxos-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'samos',
    code: 'SMI',
    name: 'Samos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Samos'],
    about:
      'Samos is a green eastern Aegean island near the Turkish coast, known for wine slopes, mountain ridges, and the ancient harbor of Pythagoreio. Heraion sanctuary ruins recall its classical importance; beaches and fishing villages ring the shore. Closer Asia Minor geography shapes climate and views. Orientation is Vathy and Pythagoreio versus inland mountains. Samos’s primer is lush eastern Aegean isle — vineyards and classical sites on a mountainous island facing Anatolia.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Eastern Aegean · near Anatolian coast',
      role: 'Historic Aegean island of wine and antiquity',
      knownFor: 'Pythagoreio, vineyards, and mountain coasts',
    },
    features: [
      {
        name: 'Pythagoreio',
        description:
          'An ancient harbor town and UNESCO-associated site.',
      },
      {
        name: 'Wine slopes',
        description:
          'Terraced vineyards on fertile mountain flanks.',
      },
      {
        name: 'Mountain spine',
        description:
          'Green ridges that keep Samos lusher than many Aegean isles.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Samos',
        url: 'https://www.britannica.com/place/Samos-island-Greece',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pythagoreion and Heraion of Samos',
        url: 'https://whc.unesco.org/en/list/595/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'elba',
    code: 'EBA',
    name: 'Elba',
    kind: 'Island',
    countrySlug: 'italy',
    subtitle: 'Island · Italy',
    matchNames: ['Elba'],
    about:
      'Elba is the largest island of Italy’s Tuscan Archipelago, a mountainous Mediterranean land of iron-mining history, Portoferraio harbor, and coves facing Corsica’s approaches. Napoleon’s first exile left residences still visited today. Granite and greenstone hills plunge to clear water. Orientation is Portoferraio versus western peaks and southern beaches. Elba’s primer is Tuscan island exile — compact mountain coasts with a famous imperial chapter and mineral-stained shores.',
    facts: {
      kind: 'Island',
      country: 'Italy',
      region: 'Europe',
      setting: 'Tuscan Archipelago · Tyrrhenian Sea',
      role: 'Largest Tuscan island and historic exile site',
      knownFor: 'Portoferraio, mountain coves, and Napoleon sites',
    },
    features: [
      {
        name: 'Portoferraio',
        description:
          'The principal fortified harbor on the northern shore.',
      },
      {
        name: 'Mountain coasts',
        description:
          'Steep hills dropping to Mediterranean coves.',
      },
      {
        name: 'Exile residences',
        description:
          'Napoleonic villas that mark Elba’s modern fame.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Elba',
        url: 'https://www.britannica.com/place/Elba-island-Italy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'menorca',
    code: 'MAH',
    name: 'Menorca',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Menorca', 'Minorca'],
    about:
      'Menorca is the quieter eastern Balearic Island, a low limestone land of prehistoric talayots, Ciutadella’s old harbor, and a UNESCO biosphere of coves and dry-stone walls. Mahón’s deep natural harbor opens to the east; the Camí de Cavalls path rings the coast. Windswept and less mountainous than Mallorca, it feels pastoral. Orientation is Mahón versus Ciutadella and the coastal path. Menorca’s primer is calm Balearic isle — prehistoric stones, horseshoe coves, and a slower Mediterranean pace.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Balearic Islands · eastern Mediterranean Spain',
      role: 'Quieter Balearic island and biosphere reserve',
      knownFor: 'Talayots, coves, and Mahón harbor',
    },
    features: [
      {
        name: 'Mahón harbor',
        description:
          'A deep natural port on the island’s eastern tip.',
      },
      {
        name: 'Ciutadella',
        description:
          'A historic western town of narrow old streets and harbor.',
      },
      {
        name: 'Coastal coves',
        description:
          'Horseshoe calas reached by paths and dry-stone lanes.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Minorca',
        url: 'https://www.britannica.com/place/Minorca',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'reunion',
    code: 'RUN',
    name: 'Réunion',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Réunion', 'Reunion'],
    about:
      'Réunion is a French overseas department in the western Indian Ocean, a volcanic island of Piton de la Fournaise eruptions, deep cirques, and steep green coasts. Creole culture blends African, Indian, Chinese, and European roots. Cloud forests and lava fields sit hours apart by mountain road. Orientation is active volcano versus cirque amphitheaters and coastal towns. Réunion’s primer is Indian Ocean volcanic department — intense relief and living lava under the French flag.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Africa',
      setting: 'Western Indian Ocean · volcanic massif',
      role: 'French overseas department and volcanic island',
      knownFor: 'Piton de la Fournaise, cirques, and steep coasts',
    },
    features: [
      {
        name: 'Piton de la Fournaise',
        description:
          'An active shield volcano with frequent lava flows.',
      },
      {
        name: 'Cirques',
        description:
          'Deep amphitheater valleys cut into the island’s core.',
      },
      {
        name: 'Coastal fringe',
        description:
          'Towns and reefs ringing the steep volcanic mass.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Réunion',
        url: 'https://www.britannica.com/place/Reunion-island-department-France',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pitons, cirques and remparts of Reunion Island',
        url: 'https://whc.unesco.org/en/list/1317/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'guadeloupe',
    code: 'PTP',
    name: 'Guadeloupe',
    kind: 'Island',
    countrySlug: 'france',
    subtitle: 'Island · France',
    matchNames: ['Guadeloupe'],
    about:
      'Guadeloupe is a butterfly-shaped French Caribbean archipelago of Basse-Terre’s volcanic west and Grande-Terre’s limestone east. La Soufrière’s peak, rainforest, and rum-estate landscapes define the west; pale beaches mark the east. Creole language and cuisine shape daily life. Orientation is the two main wings joined by a mangrove neck. Guadeloupe’s primer is French Antillean twin isle — volcano and limestone wings sharing one overseas department in the Caribbean arc.',
    facts: {
      kind: 'Island',
      country: 'France',
      region: 'Americas',
      setting: 'Caribbean Lesser Antilles · butterfly twin wings',
      role: 'French overseas department in the Caribbean',
      knownFor: 'La Soufrière, twin wings, and Creole coasts',
    },
    features: [
      {
        name: 'Basse-Terre',
        description:
          'The volcanic western wing of rainforest and peaks.',
      },
      {
        name: 'Grande-Terre',
        description:
          'The limestone eastern wing of beaches and plateaus.',
      },
      {
        name: 'La Soufrière',
        description:
          'The active volcanic high point of Basse-Terre.',
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
    slug: 'normandy',
    code: 'NRM',
    name: 'Normandy',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Normandy', 'Normandie'],
    about:
      'Normandy occupies northwestern France between the English Channel and inland bocage, a region of D-Day beaches, half-timbered towns, cider orchards, and Mont-Saint-Michel’s approaches. Cliffs of Étretat and the Seine’s lower valley shape famous landscapes. Dairy pastures and maritime weather define the countryside. Orientation is Channel coast versus Seine corridor and inland hedge country. Normandy’s primer is Channel French region — invasion beaches, orchard farms, and cliff coasts under Atlantic skies.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'English Channel coast · northwestern France',
      role: 'Historic French region of coast and bocage',
      knownFor: 'Channel cliffs, D-Day beaches, and orchard countryside',
    },
    features: [
      {
        name: 'Channel coast',
        description:
          'Cliffs, beaches, and harbors facing England.',
      },
      {
        name: 'Bocage inland',
        description:
          'Hedged pastures and half-timbered market towns.',
      },
      {
        name: 'Seine approaches',
        description:
          'The lower river corridor linking Normandy to inland France.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Normandy',
        url: 'https://www.britannica.com/place/Normandy',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'umbria',
    code: 'UMB',
    name: 'Umbria',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Umbria'],
    about:
      'Umbria is Italy’s green landlocked heart, a region of hill towns, olive slopes, and the Tiber’s upper valleys without a seacoast. Assisi, Perugia, and Spoleto concentrate medieval and Renaissance fabric; truffle woods and vineyards fill the countryside. Softer tourism than Tuscany still leaves stone lanes quiet in shoulder seasons. Orientation is hill-town ridge versus valley floors. Umbria’s primer is inland Italian hill country — olive-green slopes and fortress towns at the peninsula’s core.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Central Italy · landlocked hill country',
      role: 'Central Italian region of hill towns',
      knownFor: 'Assisi, olive slopes, and medieval hill towns',
    },
    features: [
      {
        name: 'Hill towns',
        description:
          'Stone settlements crowning ridges above green valleys.',
      },
      {
        name: 'Olive and vine slopes',
        description:
          'Agricultural terraces that color the Umbrian countryside.',
      },
      {
        name: 'Tiber valleys',
        description:
          'River corridors linking inland Umbria toward Rome.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Umbria',
        url: 'https://www.britannica.com/place/Umbria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lake-como',
    code: 'COM',
    name: 'Lake Como',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Lake Como', 'Lago di Como'],
    about:
      'Lake Como is a deep glacial Y-shaped lake in northern Italy’s Lombardy Alps, lined with villas, ferry towns, and steep wooded shores. Bellagio sits at the fork; mountains rise immediately from the water. Mild microclimates support gardens uncommon at Alpine latitudes. Orientation is the three arms meeting at Bellagio. Lake Como’s primer is Alpine lake crescent — villa elegance and ferry routes on one of Italy’s deepest, most theatrical mountain waters.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Lombardy Alps · glacial lake',
      role: 'Iconic northern Italian lake landscape',
      knownFor: 'Villa shores, Bellagio fork, and mountain walls',
    },
    features: [
      {
        name: 'Y-shaped basin',
        description:
          'Three lake arms meeting at the Bellagio peninsula.',
      },
      {
        name: 'Villa shores',
        description:
          'Historic gardens and residences stepping down to the water.',
      },
      {
        name: 'Ferry towns',
        description:
          'Compact waterfront settlements linked by boats.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lake Como',
        url: 'https://www.britannica.com/place/Lake-Como',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'masai-mara',
    code: 'MMR',
    name: 'Maasai Mara',
    kind: 'Region',
    countrySlug: 'kenya',
    subtitle: 'Region · Kenya',
    matchNames: ['Maasai Mara', 'Masai Mara'],
    about:
      'The Maasai Mara is a savanna reserve in southwestern Kenya continuous with Tanzania’s Serengeti plains, famous for migratory wildebeest crossings of the Mara River and open grassland horizons. Acacia-dotted plains and seasonal rains structure wildlife movement. Maasai pastoral landscapes surround the protected core. Orientation is Mara River corridors versus open plains. The Maasai Mara’s primer is Kenyan migration savanna — the northern stage of the Serengeti–Mara ecosystem under vast East African sky.',
    facts: {
      kind: 'Region',
      country: 'Kenya',
      region: 'Africa',
      setting: 'Southwestern Kenya · Serengeti–Mara ecosystem',
      role: 'Major wildlife reserve and migration landscape',
      knownFor: 'Savanna plains, Mara River crossings, and big skies',
    },
    features: [
      {
        name: 'Open plains',
        description:
          'Grassland horizons that concentrate grazing wildlife.',
      },
      {
        name: 'Mara River',
        description:
          'The crossing corridor of the great migration seasons.',
      },
      {
        name: 'Acacia savanna',
        description:
          'Scattered trees and pastoral edges around the reserve.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Masai Mara National Reserve',
        url: 'https://www.britannica.com/place/Masai-Mara-National-Reserve',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'gobi',
    code: 'GOB',
    name: 'Gobi',
    kind: 'Region',
    countrySlug: 'mongolia',
    subtitle: 'Region · Mongolia',
    matchNames: ['Gobi', 'Gobi Desert'],
    about:
      'The Gobi is a vast cold desert spanning southern Mongolia and northern China; this primer frames it through Mongolian dune fields, gravel plains, and fossil-rich basins. Khongoryn Els sand ridges and rocky badlands concentrate visitor landscapes; winters are severe. Nomadic herding still uses the sparse steppe edges. Orientation is dune seas versus stony desert and mountain borders. The Gobi’s primer is cold Asian desert — open arid horizons under extreme seasonal swings in Mongolia’s south.',
    facts: {
      kind: 'Region',
      country: 'Mongolia',
      region: 'Asia',
      setting: 'Southern Mongolia · cold desert and steppe',
      role: 'Major Asian desert framed via Mongolian landscapes',
      knownFor: 'Dune fields, gravel plains, and arid horizons',
    },
    features: [
      {
        name: 'Sand ridges',
        description:
          'Dune fields such as Khongoryn Els in the Mongolian Gobi.',
      },
      {
        name: 'Gravel plains',
        description:
          'Stony desert expanses between sparse water points.',
      },
      {
        name: 'Steppe edges',
        description:
          'Transitional grazing lands around the desert core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gobi',
        url: 'https://www.britannica.com/place/Gobi',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sagrada-familia',
    code: 'SAG',
    name: 'Sagrada Família',
    kind: 'Landmark',
    countrySlug: 'spain',
    subtitle: 'Landmark · Spain',
    matchNames: ['Sagrada Familia', 'Sagrada Família'],
    about:
      'The Sagrada Família is Antoni Gaudí’s unfinished basilica in Barcelona, a forest of stone spires and organic façades still rising above the Eixample grid. Nativity and Passion façades tell contrasting sculptural stories; colored glass fills the columned interior like a stone canopy. Construction continues as a living building site. Orientation is the temple towers versus surrounding city blocks. Sagrada Família’s primer is modernist basilica — Gaudí’s unfinished vertical forest that became Barcelona’s defining silhouette.',
    facts: {
      kind: 'Landmark',
      country: 'Spain',
      region: 'Europe',
      setting: 'Barcelona · Eixample district',
      role: 'Unfinished Gaudí basilica and city symbol',
      knownFor: 'Spires, organic stone façades, and stained glass',
    },
    features: [
      {
        name: 'Spires',
        description:
          'Towering stone pinnacles that dominate Barcelona’s skyline.',
      },
      {
        name: 'Narrative façades',
        description:
          'Nativity and Passion sculptural programs on opposing sides.',
      },
      {
        name: 'Forest interior',
        description:
          'Columned nave lit by dense colored glass.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sagrada Família',
        url: 'https://www.britannica.com/topic/New-Cathedral-Barcelona-Spain',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Works of Antoni Gaudí',
        url: 'https://whc.unesco.org/en/list/320/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'forbidden-city',
    code: 'FOR',
    name: 'Forbidden City',
    kind: 'Landmark',
    countrySlug: 'china',
    subtitle: 'Landmark · China',
    matchNames: ['Forbidden City'],
    about:
      'The Forbidden City is the imperial palace compound at Beijing’s center, a vast axial complex of halls, courtyards, and vermilion walls now open as the Palace Museum. Meridian Gate opens the south approach; successive courts lead toward the Hall of Supreme Harmony. Yellow-tiled roofs mark the imperial color code. Orientation is the north–south axis through nested courtyards. The Forbidden City’s primer is Ming–Qing palace city — the ceremonial heart of imperial Beijing preserved as a monumental museum campus.',
    facts: {
      kind: 'Landmark',
      country: 'China',
      region: 'Asia',
      setting: 'Central Beijing · imperial axis',
      role: 'Former imperial palace and major museum',
      knownFor: 'Courtyard axis, vermilion walls, and yellow roofs',
    },
    features: [
      {
        name: 'Ceremonial axis',
        description:
          'Nested courtyards leading to the principal throne halls.',
      },
      {
        name: 'Vermilion walls',
        description:
          'The red enclosure that defines the palace city’s edge.',
      },
      {
        name: 'Yellow-tiled roofs',
        description:
          'Imperial roofscape marking rank across the compound.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Forbidden City',
        url: 'https://www.britannica.com/topic/Forbidden-City',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Imperial Palaces of the Ming and Qing Dynasties',
        url: 'https://whc.unesco.org/en/list/439/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mount-etna',
    code: 'ETN',
    name: 'Mount Etna',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Mount Etna', 'Etna'],
    about:
      'Mount Etna is Europe’s most active major volcano, a vast cone rising above Sicily’s eastern coast with frequent lava flows and summit craters. Vineyards and orchards climb fertile lower slopes; ski and hiking routes use higher elevations between eruptions. Catania and coastal towns live with ash and spectacle. Orientation is summit craters versus cultivated flanks and Ionian shore. Etna’s primer is living Sicilian volcano — agriculture and cities sharing space with one of the Mediterranean’s restless giants.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Eastern Sicily · active stratovolcano',
      role: 'Europe’s most active major volcano',
      knownFor: 'Summit craters, lava flows, and fertile slopes',
    },
    features: [
      {
        name: 'Summit craters',
        description:
          'Active vents and ash cones at Etna’s high ridge.',
      },
      {
        name: 'Lava landscapes',
        description:
          'Recent and historic flows blackening mountain flanks.',
      },
      {
        name: 'Cultivated slopes',
        description:
          'Vineyards and orchards on fertile volcanic soils.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Etna',
        url: 'https://www.britannica.com/place/Mount-Etna',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mount Etna',
        url: 'https://whc.unesco.org/en/list/1427/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'angel-falls',
    code: 'ANF',
    name: 'Angel Falls',
    kind: 'Landmark',
    countrySlug: 'venezuela',
    subtitle: 'Landmark · Venezuela',
    matchNames: ['Angel Falls', 'Salto Ángel'],
    about:
      'Angel Falls is the world’s highest uninterrupted waterfall, plunging from Auyán-tepui in Venezuela’s Canaima National Park. The thin white ribbon drops into jungle mist far below the tepui rim; access is typically by bush plane and river boat. Wet-season volume and dry-season clarity change the curtain. Orientation is tepui cliff versus jungle gorge below. Angel Falls’s primer is tepui waterfall — an extreme free fall from a table mountain into Amazonian forest.',
    facts: {
      kind: 'Landmark',
      country: 'Venezuela',
      region: 'Americas',
      setting: 'Canaima · Auyán-tepui',
      role: 'World’s highest uninterrupted waterfall',
      knownFor: 'Extreme free fall, tepui cliff, and jungle gorge',
    },
    features: [
      {
        name: 'Tepui rim',
        description:
          'The flat-topped mountain edge where the fall begins.',
      },
      {
        name: 'Free-fall curtain',
        description:
          'A thin, extremely tall ribbon of water into mist below.',
      },
      {
        name: 'Jungle gorge',
        description:
          'Forest approaches reached by river after remote flights.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Angel Falls',
        url: 'https://www.britannica.com/place/Angel-Falls',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Canaima National Park',
        url: 'https://whc.unesco.org/en/list/701/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'twelve-apostles',
    code: 'TWA',
    name: 'Twelve Apostles',
    kind: 'Landmark',
    countrySlug: 'australia',
    subtitle: 'Landmark · Australia',
    matchNames: ['Twelve Apostles'],
    about:
      'The Twelve Apostles are limestone sea stacks off Victoria’s Great Ocean Road, pillars carved from cliffs by Southern Ocean swell. Lookouts frame the stacks at golden hour; collapse and erosion continually reshape the count. Coastal scrub and sheer walls define the shoreline walk. Orientation is stack field versus cliff-top viewing platforms. The Twelve Apostles’ primer is ocean-stack coast — iconic Australian sea pillars standing just offshore of a wild Victorian cliff line.',
    facts: {
      kind: 'Landmark',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Great Ocean Road · Victoria',
      role: 'Iconic limestone sea-stack coastline',
      knownFor: 'Offshore stacks, cliff lookouts, and ocean swell',
    },
    features: [
      {
        name: 'Sea stacks',
        description:
          'Limestone pillars standing in the Southern Ocean surf.',
      },
      {
        name: 'Cliff lookouts',
        description:
          'Viewing platforms along the Great Ocean Road rim.',
      },
      {
        name: 'Eroding shore',
        description:
          'A living coastline where stacks form and eventually fall.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Twelve Apostles',
        url: 'https://www.britannica.com/place/Twelve-Apostles',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fushimi-inari',
    code: 'FSI',
    name: 'Fushimi Inari',
    kind: 'Landmark',
    countrySlug: 'japan',
    subtitle: 'Landmark · Japan',
    matchNames: ['Fushimi Inari', 'Fushimi Inari Taisha'],
    about:
      'Fushimi Inari Taisha is Kyoto’s great Inari shrine, famous for thousands of vermilion torii gates forming tunnel paths up Mount Inari. Fox messengers and rice-deity worship structure the sacred landscape; trails loop through forest and sub-shrines. Day and night visits change the tunnel’s light. Orientation is main shrine buildings versus mountain torii routes. Fushimi Inari’s primer is torii mountain shrine — an unbroken vermilion corridor climbing through Kyoto’s southern hills.',
    facts: {
      kind: 'Landmark',
      country: 'Japan',
      region: 'Asia',
      setting: 'Southern Kyoto · Mount Inari',
      role: 'Major Inari shrine and torii path landmark',
      knownFor: 'Vermilion torii tunnels and mountain trails',
    },
    features: [
      {
        name: 'Torii tunnels',
        description:
          'Dense vermilion gate corridors ascending the mountain.',
      },
      {
        name: 'Main shrine',
        description:
          'Worship halls and fox statues at the mountain base.',
      },
      {
        name: 'Mount Inari trails',
        description:
          'Forest loops linking sub-shrines above the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fushimi Inari Shrine',
        url: 'https://www.britannica.com/topic/Inari-Shinto-deity',
        kind: 'reference',
      },
    ],
  },
]
