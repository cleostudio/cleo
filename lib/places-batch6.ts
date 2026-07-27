/** Sixth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch6: PlaceGuideDraftBatch[] = [
  {
    slug: 'seattle',
    code: 'SEA',
    name: 'Seattle',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Seattle'],
    about:
      'Seattle occupies hills between Puget Sound and Lake Washington, a Pacific Northwest city of ferry wakes, evergreen ridges, and a skyline watched by the Space Needle. Pike Place Market still faces Elliott Bay; rain and soft light shape outdoor life. Volcanic Mount Rainier appears on clear southern horizons. Orientation is sound versus lake with downtown hills between. Seattle’s primer is inland-sea metropolis — tech and port energy wrapped in maritime weather under a Cascade backdrop.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Puget Sound · Lake Washington isthmus',
      role: 'Major Pacific Northwest port and tech hub',
      knownFor: 'Space Needle, Elliott Bay, and ferry waterfront',
    },
    features: [
      {
        name: 'Elliott Bay',
        description:
          'The working harbor and market edge facing Puget Sound.',
      },
      {
        name: 'Space Needle',
        description:
          'The landmark tower that marks Seattle’s skyline identity.',
      },
      {
        name: 'Lake–sound isthmus',
        description:
          'Hills between salt water and freshwater that structure the city.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Seattle',
        url: 'https://www.britannica.com/place/Seattle-Washington',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'boston',
    code: 'BOS',
    name: 'Boston',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Boston'],
    about:
      'Boston clusters around a historic harbor on Massachusetts Bay, a compact New England capital of brick Freedom Trail streets, university neighborhoods, and a modern waterfront. The Common and Public Garden open the old core; Charles River esplanades face Cambridge. Colonial and revolutionary layers remain walkable. Orientation is harbor versus river and the downtown peninsula. Boston’s primer is harbor college city — dense historic fabric and academic energy on New England’s principal bay.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Massachusetts Bay · Charles River',
      role: 'New England’s principal city and historic capital',
      knownFor: 'Harbor core, Freedom Trail, and university belt',
    },
    features: [
      {
        name: 'Historic core',
        description:
          'Brick streets and landmarks along the Freedom Trail.',
      },
      {
        name: 'Harbor waterfront',
        description:
          'Wharves and seawalls opening onto Massachusetts Bay.',
      },
      {
        name: 'Charles River edge',
        description:
          'Esplanades linking Boston to Cambridge across the river.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Boston',
        url: 'https://www.britannica.com/place/Boston',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'miami',
    code: 'MIA',
    name: 'Miami',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Miami'],
    about:
      'Miami spreads along Biscayne Bay at Florida’s southeastern tip, a subtropical metropolis of Art Deco South Beach, downtown towers, and mangrove edges toward the Everglades. Caribbean and Latin American cultures shape neighborhoods and food. Hurricane seasons and humid heat define the climate calendar. Orientation is ocean beach barrier versus bay mainland. Miami’s primer is tropical bay city — pastel beach architecture and a bilingual skyline between Atlantic surf and inland wetlands.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Biscayne Bay · Atlantic barrier islands',
      role: 'Major southeastern Florida metropolis',
      knownFor: 'South Beach, bay skyline, and subtropical coast',
    },
    features: [
      {
        name: 'South Beach',
        description:
          'Art Deco hotels and Atlantic sand on the barrier island.',
      },
      {
        name: 'Biscayne Bay',
        description:
          'The sheltered water separating beach from mainland towers.',
      },
      {
        name: 'Mainland skyline',
        description:
          'Downtown and Brickell towers facing the bay.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Miami',
        url: 'https://www.britannica.com/place/Miami-Florida',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kuala-lumpur',
    code: 'KUL',
    name: 'Kuala Lumpur',
    kind: 'City',
    countrySlug: 'malaysia',
    subtitle: 'City · Malaysia',
    matchNames: ['Kuala Lumpur'],
    about:
      'Kuala Lumpur fills a valley at the confluence of the Klang and Gombak rivers, Malaysia’s capital of Petronas Twin Towers, colonial district streets, and dense multiethnic neighborhoods. KLCC park sits beneath the towers; hills and satellite cities ring the basin. Thunderstorms and heat mark equatorial days. Orientation is the tower pair versus the historic Merdeka Square core. Kuala Lumpur’s primer is equatorial capital — modern skyscrapers rising from a river-valley trading town turned national center.',
    facts: {
      kind: 'City',
      country: 'Malaysia',
      region: 'Asia',
      setting: 'Klang Valley · equatorial basin',
      role: 'National capital and principal Malaysian metropolis',
      knownFor: 'Petronas Towers, KLCC, and river-valley density',
    },
    features: [
      {
        name: 'Petronas Towers',
        description:
          'The twin skyscrapers that define the modern skyline.',
      },
      {
        name: 'Historic core',
        description:
          'Merdeka Square and colonial-era civic buildings.',
      },
      {
        name: 'Klang Valley',
        description:
          'The wider basin of suburbs and satellite cities.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kuala Lumpur',
        url: 'https://www.britannica.com/place/Kuala-Lumpur',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ho-chi-minh',
    code: 'SGN',
    name: 'Ho Chi Minh City',
    kind: 'City',
    countrySlug: 'vietnam',
    subtitle: 'City · Vietnam',
    matchNames: ['Ho Chi Minh City', 'Saigon'],
    about:
      'Ho Chi Minh City sprawls across the Saigon River delta as Vietnam’s largest metropolis, still widely called Saigon in daily speech. French colonial avenues, Chinese district temples, and glass towers share one humid lowland. Motorbike traffic fills the grid; the river remains a working edge. Orientation is downtown District 1 versus river and expanding suburbs. Ho Chi Minh City’s primer is delta megacity — commercial energy on southern Vietnam’s river plain.',
    facts: {
      kind: 'City',
      country: 'Vietnam',
      region: 'Asia',
      setting: 'Saigon River · Mekong delta approaches',
      role: 'Largest Vietnamese city and southern economic hub',
      knownFor: 'Riverfront core, colonial avenues, and metro sprawl',
    },
    features: [
      {
        name: 'District 1 core',
        description:
          'Colonial halls, markets, and towers at the historic center.',
      },
      {
        name: 'Saigon River',
        description:
          'The working waterway that organizes downtown edges.',
      },
      {
        name: 'Delta plain',
        description:
          'Low-lying districts spreading into the southern lowlands.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ho Chi Minh City',
        url: 'https://www.britannica.com/place/Ho-Chi-Minh-City',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'busan',
    code: 'PUS',
    name: 'Busan',
    kind: 'City',
    countrySlug: 'korea-south',
    subtitle: 'City · Korea, South',
    matchNames: ['Busan'],
    about:
      'Busan occupies a mountainous southeastern Korean coast as the country’s principal port city, a harbor metropolis of beaches, bridges, and steep neighborhoods above the sea. Haeundae’s long sand faces the Korea Strait; Jagalchi market still smells of the catch. Film festival nights and seafood culture share the waterfront. Orientation is harbor basins versus beach districts and inland hills. Busan’s primer is mountain-port city — Korea’s maritime gateway pressed between peaks and open water.',
    facts: {
      kind: 'City',
      country: 'Korea, South',
      region: 'Asia',
      setting: 'Southeastern coast · Korea Strait',
      role: 'Principal Korean port and second city',
      knownFor: 'Harbor, Haeundae Beach, and coastal hills',
    },
    features: [
      {
        name: 'Harbor basins',
        description:
          'Port infrastructure and bridges of Korea’s main maritime hub.',
      },
      {
        name: 'Haeundae',
        description:
          'A long urban beach facing the open strait.',
      },
      {
        name: 'Coastal hills',
        description:
          'Steep neighborhoods rising quickly above the waterfront.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pusan',
        url: 'https://www.britannica.com/place/Pusan',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'geneva',
    code: 'GVA',
    name: 'Geneva',
    kind: 'City',
    countrySlug: 'switzerland',
    subtitle: 'City · Switzerland',
    matchNames: ['Geneva'],
    about:
      'Geneva sits at the outlet of Lake Geneva where the Rhône begins its run toward France, a compact international city of Jet d’Eau plume, lakeside quays, and diplomatic campuses. The old town crowns a hill above the river; Mont Blanc can appear across the water on clear days. French-speaking civic life mixes with global institutions. Orientation is lake basin versus Rhône outflow. Geneva’s primer is lake-outlet capital — Alpine scenery framing a small city with outsized international roles.',
    facts: {
      kind: 'City',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Lake Geneva outlet · Rhône',
      role: 'International city and cantonal capital',
      knownFor: 'Jet d’Eau, lake quays, and Alpine views',
    },
    features: [
      {
        name: 'Jet d’Eau',
        description:
          'The lakeside fountain plume that marks Geneva’s waterfront.',
      },
      {
        name: 'Old town hill',
        description:
          'Cathedral streets above the Rhône and lake junction.',
      },
      {
        name: 'Lake basin',
        description:
          'Quays and views toward the surrounding Alpine walls.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Geneva',
        url: 'https://www.britannica.com/place/Geneva-Switzerland',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'zurich',
    code: 'ZRH',
    name: 'Zurich',
    kind: 'City',
    countrySlug: 'switzerland',
    subtitle: 'City · Switzerland',
    matchNames: ['Zurich', 'Zürich'],
    about:
      'Zurich occupies the northern end of Lake Zurich as Switzerland’s largest city, a financial and cultural hub of riverside old town lanes, guildhalls, and clean lakefront promenades. The Limmat splits the historic core; trams climb toward surrounding hills. Museums and banking towers share a walkable center. Orientation is lake head versus Limmat banks. Zurich’s primer is lake-head metropolis — orderly Swiss urbanism where alpine water and commerce meet at the city’s doorstep.',
    facts: {
      kind: 'City',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Lake Zurich head · Limmat River',
      role: 'Largest Swiss city and financial center',
      knownFor: 'Old town, lake promenades, and Limmat quays',
    },
    features: [
      {
        name: 'Old town lanes',
        description:
          'Guild streets and churches on either bank of the Limmat.',
      },
      {
        name: 'Lake head',
        description:
          'Promenades and baths where Zurich meets the lake.',
      },
      {
        name: 'Hill rim',
        description:
          'Residential slopes and viewpoints above the compact core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Zürich',
        url: 'https://www.britannica.com/place/Zurich',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'krakow',
    code: 'KRK',
    name: 'Kraków',
    kind: 'City',
    countrySlug: 'poland',
    subtitle: 'City · Poland',
    matchNames: ['Krakow', 'Kraków'],
    about:
      'Kraków sits on the Vistula in southern Poland, a historic royal capital of a vast Main Market Square, Wawel Castle hill, and a preserved medieval street grid. Kazimierz’s former Jewish quarter adds layered neighborhoods; cafés spill onto cobbles. The city avoided the wholesale wartime destruction that reshaped Warsaw. Orientation is Market Square versus Wawel and the river. Kraków’s primer is royal market city — intact Gothic and Renaissance fabric around one of Europe’s great public squares.',
    facts: {
      kind: 'City',
      country: 'Poland',
      region: 'Europe',
      setting: 'Vistula River · southern Poland',
      role: 'Historic royal capital and cultural center',
      knownFor: 'Main Market Square, Wawel, and medieval core',
    },
    features: [
      {
        name: 'Main Market Square',
        description:
          'A vast medieval plaza with Cloth Hall and surrounding façades.',
      },
      {
        name: 'Wawel Hill',
        description:
          'The castle and cathedral complex above the Vistula.',
      },
      {
        name: 'Kazimierz',
        description:
          'A historic district of synagogues, streets, and river edges.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kraków',
        url: 'https://www.britannica.com/place/Krakow',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Kraków',
        url: 'https://whc.unesco.org/en/list/29/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'naples',
    code: 'NAP',
    name: 'Naples',
    kind: 'City',
    countrySlug: 'italy',
    subtitle: 'City · Italy',
    matchNames: ['Naples', 'Napoli'],
    about:
      'Naples climbs amphitheater hills above the Bay of Naples with Vesuvius on the horizon, a dense southern Italian capital of laundry-strung lanes, waterfront castles, and pizza born in working neighborhoods. Spaccanapoli cuts the historic center; ferries leave for Capri and the islands. Chaos and baroque grandeur share the same blocks. Orientation is bayfront versus Vesuvius backdrop and the old town grid. Naples’s primer is bay volcano city — raw street energy under one of the Mediterranean’s most dramatic skylines.',
    facts: {
      kind: 'City',
      country: 'Italy',
      region: 'Europe',
      setting: 'Bay of Naples · Vesuvius horizon',
      role: 'Southern Italian metropolis and historic port',
      knownFor: 'Bay views, historic center, and Vesuvius backdrop',
    },
    features: [
      {
        name: 'Historic center',
        description:
          'Dense UNESCO streets of churches, courtyards, and shops.',
      },
      {
        name: 'Bay waterfront',
        description:
          'Castles and promenades facing Capri and the open gulf.',
      },
      {
        name: 'Vesuvius horizon',
        description:
          'The volcano that frames Naples from across the plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Naples',
        url: 'https://www.britannica.com/place/Naples-Italy',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Centre of Naples',
        url: 'https://whc.unesco.org/en/list/726/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'casablanca',
    code: 'CAS',
    name: 'Casablanca',
    kind: 'City',
    countrySlug: 'morocco',
    subtitle: 'City · Morocco',
    matchNames: ['Casablanca'],
    about:
      'Casablanca faces the Atlantic as Morocco’s largest city and commercial engine, a white coastal metropolis of Art Deco downtown blocks and the Hassan II Mosque rising over the ocean. Corniche roads follow the shore; business towers mark a modern skyline inland from the medina remnants. Atlantic humidity and wind shape the climate. Orientation is ocean mosque versus downtown plateau. Casablanca’s primer is Atlantic commercial capital — Morocco’s economic center facing open ocean rather than an imperial inland medina.',
    facts: {
      kind: 'City',
      country: 'Morocco',
      region: 'Africa',
      setting: 'Atlantic coast · northwestern Morocco',
      role: 'Largest Moroccan city and commercial hub',
      knownFor: 'Hassan II Mosque, Art Deco core, and oceanfront',
    },
    features: [
      {
        name: 'Hassan II Mosque',
        description:
          'A vast oceanfront mosque on a promontory above the Atlantic.',
      },
      {
        name: 'Art Deco downtown',
        description:
          'Early twentieth-century avenues and white façades.',
      },
      {
        name: 'Corniche',
        description:
          'Coastal roads and beaches along the city’s ocean edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Casablanca',
        url: 'https://www.britannica.com/place/Casablanca',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'wellington',
    code: 'WLG',
    name: 'Wellington',
    kind: 'City',
    countrySlug: 'new-zealand',
    subtitle: 'City · New Zealand',
    matchNames: ['Wellington'],
    about:
      'Wellington occupies a windy harbor at the southern tip of New Zealand’s North Island, the national capital of hillside suburbs, waterfront sheds, and Te Papa on the quay. The Rimutaka and Tararua ranges rise inland; Cook Strait ferries leave for the South Island. Compact downtown sits in a natural amphitheater. Orientation is harbor bowl versus surrounding hills. Wellington’s primer is harbor capital — cultural institutions and government pressed into a dramatic, wind-scoured coastal amphitheater.',
    facts: {
      kind: 'City',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Wellington Harbour · Cook Strait approaches',
      role: 'National capital and cultural hub',
      knownFor: 'Harbor bowl, hillside suburbs, and waterfront',
    },
    features: [
      {
        name: 'Harbour waterfront',
        description:
          'Quays, museums, and sheds along the inner harbor.',
      },
      {
        name: 'Hill suburbs',
        description:
          'Steep residential slopes enclosing the city bowl.',
      },
      {
        name: 'Strait gateway',
        description:
          'Ferry links across Cook Strait to the South Island.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Wellington',
        url: 'https://www.britannica.com/place/Wellington-New-Zealand',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oregon',
    code: 'OR',
    name: 'Oregon',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['Oregon'],
    about:
      'Oregon stretches from a foggy Pacific coast across Cascades volcanoes to high desert east of the mountains. Crater Lake’s deep blue caldera and the Columbia River Gorge concentrate classic scenery; Portland anchors the Willamette Valley. Rainforest west and arid plateaus east create sharp climate splits. Orientation is coast–Cascades–eastern drylands. Oregon’s primer is Pacific Northwest state — volcanic peaks, temperate forests, and a long public coastline under changeable marine skies.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Pacific coast · Cascades · high desert',
      role: 'Pacific Northwest state of forests and volcanoes',
      knownFor: 'Crater Lake, Columbia Gorge, and Pacific shore',
    },
    features: [
      {
        name: 'Pacific coast',
        description:
          'Headlands, beaches, and foggy marine forests.',
      },
      {
        name: 'Cascade volcanoes',
        description:
          'High peaks and crater lakes along the mountain spine.',
      },
      {
        name: 'Columbia Gorge',
        description:
          'A river canyon of cliffs and waterfalls on the northern border.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oregon',
        url: 'https://www.britannica.com/place/Oregon-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'british-columbia',
    code: 'BC',
    name: 'British Columbia',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['British Columbia'],
    about:
      'British Columbia is Canada’s westernmost province, a vast land of Pacific fjords, Coast Mountains, and Interior plateaus reaching the Rockies. Vancouver and Victoria concentrate population on the southwest coast; wilderness dominates farther north. Temperate rainforest meets alpine ice within short distances. Orientation is Pacific fringe versus mountain interior. British Columbia’s primer is Pacific mountain province — fjord coasts, evergreen slopes, and high ranges filling Canada’s far west.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Pacific coast · Cordilleran mountains',
      role: 'Westernmost Canadian province',
      knownFor: 'Fjord coasts, Coast Mountains, and rainforest',
    },
    features: [
      {
        name: 'Pacific fjords',
        description:
          'Deep inlets and islands along the western shore.',
      },
      {
        name: 'Coast Mountains',
        description:
          'Steep ranges rising quickly from the ocean edge.',
      },
      {
        name: 'Interior plateaus',
        description:
          'Drier valleys and highlands east of the coastal wall.',
      },
    ],
    sources: [
      {
        label: 'Britannica — British Columbia',
        url: 'https://www.britannica.com/place/British-Columbia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'new-south-wales',
    code: 'NSW',
    name: 'New South Wales',
    kind: 'State',
    countrySlug: 'australia',
    subtitle: 'State · Australia',
    matchNames: ['New South Wales'],
    about:
      'New South Wales is Australia’s most populous state, stretching from Sydney’s harbor coast through the Blue Mountains to inland plains and the Murray River border. Coastal cities, wine regions, and bush hinterland share one large territory. The Great Dividing Range separates humid shore from drier west. Orientation is Pacific fringe versus inland slopes and plains. New South Wales’s primer is eastern Australian state — harbor metropolis, sandstone mountains, and long rural interiors under a single colonial-era name.',
    facts: {
      kind: 'State',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Eastern Australia · coast to inland plains',
      role: 'Most populous Australian state',
      knownFor: 'Sydney region, Blue Mountains, and Pacific coast',
    },
    features: [
      {
        name: 'Pacific coast',
        description:
          'Harbor cities and beaches along the eastern shore.',
      },
      {
        name: 'Blue Mountains',
        description:
          'Sandstone plateaus and eucalyptus valleys west of Sydney.',
      },
      {
        name: 'Inland plains',
        description:
          'Agricultural and dry country beyond the Dividing Range.',
      },
    ],
    sources: [
      {
        label: 'Britannica — New South Wales',
        url: 'https://www.britannica.com/place/New-South-Wales',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'ibiza',
    code: 'IBZ',
    name: 'Ibiza',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Ibiza'],
    about:
      'Ibiza is a Balearic Island known for Dalt Vila’s fortified old town, pine-backed coves, and a nightlife reputation that coexists with quiet interior farms. Phoenician and medieval layers sit inside UNESCO walls above Ibiza Town harbor. West-coast sunsets and salt flats add slower landscapes. Orientation is Dalt Vila versus beach calas and the rural center. Ibiza’s primer is Balearic party-and-pine island — a fortified harbor town paired with Mediterranean coves under Spanish administration.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Balearic Islands · western Mediterranean',
      role: 'Major Balearic island and visitor destination',
      knownFor: 'Dalt Vila, coves, and Mediterranean nightlife coasts',
    },
    features: [
      {
        name: 'Dalt Vila',
        description:
          'The fortified old town above Ibiza’s principal harbor.',
      },
      {
        name: 'Coastal calas',
        description:
          'Pine-framed inlets and beaches around the island.',
      },
      {
        name: 'Rural interior',
        description:
          'Farm tracks and quieter hills away from the resort strip.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ibiza',
        url: 'https://www.britannica.com/place/Ibiza-island-Spain',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Ibiza, Biodiversity and Culture',
        url: 'https://whc.unesco.org/en/list/417/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mykonos',
    code: 'MYK',
    name: 'Mykonos',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Mykonos'],
    about:
      'Mykonos is a Cycladic island of white cube houses, windmills above Little Venice, and granite hills under intense Aegean light. Narrow alleys in Chora hide from the meltemi wind; beaches ring the south and southwest. Delos lies a short boat ride away as an ancient sanctuary island. Orientation is Chora harbor versus windmill ridge and beach bays. Mykonos’s primer is Cycladic white island — wind, cubic architecture, and nightlife energy on a small granite outcrop in the central Aegean.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Cyclades · central Aegean',
      role: 'Major Cycladic visitor island',
      knownFor: 'Windmills, white Chora, and Aegean beaches',
    },
    features: [
      {
        name: 'Chora alleys',
        description:
          'Whitewashed lanes and chapels of the main town.',
      },
      {
        name: 'Windmill ridge',
        description:
          'Iconic mills above the Little Venice waterfront.',
      },
      {
        name: 'Beach bays',
        description:
          'Sandy coves around the island’s southern shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mykonos',
        url: 'https://www.britannica.com/place/Mykonos',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'gran-canaria',
    code: 'LPA',
    name: 'Gran Canaria',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Gran Canaria'],
    about:
      'Gran Canaria is a circular Canary Island of volcanic highlands, Maspalomas dunes, and microclimates that shift from misty north to arid south within an hour’s drive. Roque Nublo’s basalt monolith crowns the interior; Las Palmas anchors the northeast coast. Atlantic beaches and ravines structure outdoor life. Orientation is central peaks versus contrasting coasts. Gran Canaria’s primer is miniature-continent island — diverse climates packed onto one Atlantic volcanic circle under Spanish rule.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Canary Islands · Atlantic volcanic circle',
      role: 'Major Canary Island with diverse climates',
      knownFor: 'Roque Nublo, Maspalomas dunes, and dual coasts',
    },
    features: [
      {
        name: 'Central highlands',
        description:
          'Volcanic peaks and monoliths such as Roque Nublo.',
      },
      {
        name: 'Maspalomas dunes',
        description:
          'A coastal sand sea on the arid southern shore.',
      },
      {
        name: 'Contrasting coasts',
        description:
          'Greener north and drier south within a short drive.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Gran Canaria',
        url: 'https://www.britannica.com/place/Gran-Canaria',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'oahu',
    code: 'HNL',
    name: 'Oʻahu',
    kind: 'Island',
    countrySlug: 'united-states',
    subtitle: 'Island · United States',
    matchNames: ['Oahu', 'Oʻahu'],
    about:
      'Oʻahu is Hawaii’s most populous island, home to Honolulu, Waikīkī Beach, and Diamond Head’s tuff cone above the city. The Koʻolau and Waiʻanae ranges form parallel spines; the North Shore’s winter surf is world-famous. Pearl Harbor sits on the south-central coast. Orientation is Honolulu south shore versus North Shore and central plain. Oʻahu’s primer is Hawaiian capital island — urban beach culture and volcanic ridges sharing one heavily visited Pacific landmass.',
    facts: {
      kind: 'Island',
      country: 'United States',
      region: 'Oceania',
      setting: 'Hawaiian Islands · Honolulu and twin ranges',
      role: 'Most populous Hawaiian island and state capital host',
      knownFor: 'Waikīkī, Diamond Head, and North Shore surf',
    },
    features: [
      {
        name: 'Waikīkī and Diamond Head',
        description:
          'The urban beach and tuff cone that define Honolulu’s face.',
      },
      {
        name: 'Twin mountain ranges',
        description:
          'Koʻolau and Waiʻanae spines framing the central plain.',
      },
      {
        name: 'North Shore',
        description:
          'Winter surf breaks and quieter coastal towns.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Oahu',
        url: 'https://www.britannica.com/place/Oahu',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'kauai',
    code: 'LIH',
    name: 'Kauaʻi',
    kind: 'Island',
    countrySlug: 'united-states',
    subtitle: 'Island · United States',
    matchNames: ['Kauai', 'Kauaʻi'],
    about:
      'Kauaʻi is Hawaii’s oldest large island, a deeply eroded volcanic dome of Nā Pali cliffs, Waimea Canyon’s red walls, and wet summit rainforests. Fewer highways force boat or air approaches to some coasts; waterfalls cut green valleys. The island’s circular shape wraps around Mount Waiʻaleʻale’s rainy core. Orientation is Nā Pali northwest versus canyon west and resort south. Kauaʻi’s primer is garden Hawaiian isle — dramatic cliffs and canyons on a compact, heavily weathered Pacific volcano.',
    facts: {
      kind: 'Island',
      country: 'United States',
      region: 'Oceania',
      setting: 'Hawaiian Islands · eroded volcanic dome',
      role: 'Oldest major Hawaiian island',
      knownFor: 'Nā Pali Coast, Waimea Canyon, and waterfalls',
    },
    features: [
      {
        name: 'Nā Pali Coast',
        description:
          'Sheer green cliffs and valleys along the northwest shore.',
      },
      {
        name: 'Waimea Canyon',
        description:
          'A deep red canyon cut into the western highlands.',
      },
      {
        name: 'Wet summit',
        description:
          'Rainforest highlands around one of Earth’s wettest spots.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Kauai',
        url: 'https://www.britannica.com/place/Kauai',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'corfu',
    code: 'CFU',
    name: 'Corfu',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Corfu', 'Kerkyra'],
    about:
      'Corfu is a green Ionian island off Greece’s northwest coast, known for a UNESCO Old Town of Venetian fortresses, arcaded Liston, and olive-covered hills. Unlike arid Cycladic isles, Corfu stays lush; beaches and coves ring a mountainous spine. British, French, and Venetian layers show in architecture. Orientation is Old Town harbors versus west-coast beaches and Mount Pantokrator. Corfu’s primer is Ionian green island — fortress towns and olive hills facing the Adriatic approaches.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Ionian Islands · northwestern Greece',
      role: 'Major Ionian island with Venetian old town',
      knownFor: 'Old Town fortresses, olive hills, and green coasts',
    },
    features: [
      {
        name: 'Old Town',
        description:
          'Venetian fortresses and arcades of the UNESCO core.',
      },
      {
        name: 'Olive hills',
        description:
          'Lush interior slopes unlike drier Aegean islands.',
      },
      {
        name: 'West-coast beaches',
        description:
          'Sandy and pebble shores facing open Ionian water.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Corfu',
        url: 'https://www.britannica.com/place/Corfu-island-Greece',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Old Town of Corfu',
        url: 'https://whc.unesco.org/en/list/978/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'black-forest',
    code: 'BLK',
    name: 'Black Forest',
    kind: 'Region',
    countrySlug: 'germany',
    subtitle: 'Region · Germany',
    matchNames: ['Black Forest', 'Schwarzwald'],
    about:
      'The Black Forest is a wooded highland in southwestern Germany, a region of dark fir slopes, clockmaking towns, and valleys draining toward the Rhine. Trails link spa villages; farmhouses with deep roofs mark rural clearings. Winter snow and summer hiking share the same ridges. Orientation is highland crest versus Rhine-side foothills. The Black Forest’s primer is German woodland highland — dense evergreen hills and traditional villages that gave the region its fairy-tale reputation.',
    facts: {
      kind: 'Region',
      country: 'Germany',
      region: 'Europe',
      setting: 'Southwestern Germany · forested highland',
      role: 'Classic German woodland tourism region',
      knownFor: 'Fir forests, valleys, and spa villages',
    },
    features: [
      {
        name: 'Fir highlands',
        description:
          'Dark evergreen slopes that name the Black Forest.',
      },
      {
        name: 'Valley towns',
        description:
          'Spa and craft settlements along river corridors.',
      },
      {
        name: 'Rhine approaches',
        description:
          'Foothills descending toward the Upper Rhine Plain.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Black Forest',
        url: 'https://www.britannica.com/place/Black-Forest',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cotswolds',
    code: 'COT',
    name: 'Cotswolds',
    kind: 'Region',
    countrySlug: 'united-kingdom',
    subtitle: 'Region · United Kingdom',
    matchNames: ['Cotswolds'],
    about:
      'The Cotswolds are a limestone upland of honey-colored villages, dry-stone walls, and sheep pasture in south-central England. Market towns and wool-church spires recall medieval wealth; lanes climb gentle escarpments. The area is designated an Area of Outstanding Natural Beauty. Orientation is escarpment edge versus inland wolds. The Cotswolds’ primer is English limestone country — soft gold stone villages set in rolling pasture under a pastoral southern English sky.',
    facts: {
      kind: 'Region',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'South-central England · limestone wolds',
      role: 'Pastoral upland and village landscape',
      knownFor: 'Honey stone villages, dry-stone walls, and hills',
    },
    features: [
      {
        name: 'Limestone villages',
        description:
          'Honey-colored cottages and wool-church towns.',
      },
      {
        name: 'Dry-stone walls',
        description:
          'Field boundaries stitching the pastoral landscape.',
      },
      {
        name: 'Wold escarpment',
        description:
          'Gentle ridges and valleys of the limestone upland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cotswolds',
        url: 'https://www.britannica.com/place/Cotswolds',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pantanal',
    code: 'PNT',
    name: 'Pantanal',
    kind: 'Region',
    countrySlug: 'brazil',
    subtitle: 'Region · Brazil',
    matchNames: ['Pantanal'],
    about:
      'The Pantanal is one of the world’s largest tropical wetlands, a seasonally flooded plain mostly in southwestern Brazil where cattle ranches and wildlife share mosaic habitats. Rising waters create temporary lakes; dry season concentrates animals near remaining pools. Access is often by boat or rough roads from Mato Grosso gateways. Orientation is flooded plain versus surrounding plateaus. The Pantanal’s primer is seasonal wetland vastness — a living flood pulse that turns grassland into water country and back again each year.',
    facts: {
      kind: 'Region',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Southwestern Brazil · tropical floodplain',
      role: 'Major wetland and wildlife landscape',
      knownFor: 'Seasonal floods, wildlife, and open wetland horizons',
    },
    features: [
      {
        name: 'Flood pulse',
        description:
          'Annual waters that transform plains into wetland mosaic.',
      },
      {
        name: 'Wildlife concentrations',
        description:
          'Dry-season gatherings of birds and mammals at waterholes.',
      },
      {
        name: 'Ranch landscape',
        description:
          'Working fazendas sharing space with conservation areas.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pantanal',
        url: 'https://www.britannica.com/place/Pantanal',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Pantanal Conservation Area',
        url: 'https://whc.unesco.org/en/list/999/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'wadi-rum',
    code: 'WAD',
    name: 'Wadi Rum',
    kind: 'Region',
    countrySlug: 'jordan',
    subtitle: 'Region · Jordan',
    matchNames: ['Wadi Rum'],
    about:
      'Wadi Rum is a sandstone and granite desert valley in southern Jordan, a landscape of red dunes, towering jebels, and Bedouin camps under vast desert sky. Lawrence of Arabia lore and film locations draw visitors; petroglyphs mark older human presence. Jeep tracks and camel paths cross the protected area. Orientation is valley floor versus cliff massifs. Wadi Rum’s primer is red desert valley — dramatic Jordanian rock desert where silence and scale define the experience.',
    facts: {
      kind: 'Region',
      country: 'Jordan',
      region: 'Asia',
      setting: 'Southern Jordan · sandstone desert valley',
      role: 'Protected desert landscape and visitor region',
      knownFor: 'Red dunes, jebel cliffs, and desert camps',
    },
    features: [
      {
        name: 'Sandstone massifs',
        description:
          'Towering jebels rising abruptly from the valley floor.',
      },
      {
        name: 'Red dunes',
        description:
          'Windblown sand corridors between the rock walls.',
      },
      {
        name: 'Desert sky',
        description:
          'Clear night and day horizons prized for silence and stars.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Wadi Ramm',
        url: 'https://www.britannica.com/place/Wadi-Ramm',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Wadi Rum Protected Area',
        url: 'https://whc.unesco.org/en/list/1377/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'brittany',
    code: 'BRE',
    name: 'Brittany',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Brittany', 'Bretagne'],
    about:
      'Brittany is France’s northwestern peninsula, a Celtic-influenced region of granite coasts, tidal islands, and inland bocage. Pink granite shores, lighthouse headlands, and medieval towns such as Saint-Malo define the maritime face; Breton language and festivals persist inland. Atlantic weather brings wind and sudden light changes. Orientation is Armorican coast versus interior hedge country. Brittany’s primer is Atlantic Celtic peninsula — rugged French shoreline and strong regional identity facing the open ocean.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Northwestern peninsula · Atlantic coast',
      role: 'Historic French region with Celtic heritage',
      knownFor: 'Granite coasts, tidal islands, and maritime towns',
    },
    features: [
      {
        name: 'Granite coasts',
        description:
          'Headlands, coves, and pink-rock shores facing the Atlantic.',
      },
      {
        name: 'Tidal islands',
        description:
          'Abbeys and islets reached by causeways at low tide.',
      },
      {
        name: 'Bocage interior',
        description:
          'Hedged farmland and market towns inland from the shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Brittany',
        url: 'https://www.britannica.com/place/Brittany-region-France',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'christ-the-redeemer',
    code: 'CRC',
    name: 'Christ the Redeemer',
    kind: 'Landmark',
    countrySlug: 'brazil',
    subtitle: 'Landmark · Brazil',
    matchNames: ['Christ the Redeemer', 'Cristo Redentor'],
    about:
      'Christ the Redeemer stands with open arms atop Corcovado in Rio de Janeiro, an Art Deco soapstone statue overlooking Guanabara Bay and the city’s mountains. Cog trains and trails climb through Tijuca forest to the summit platform. Cloud and sun alternately hide and reveal the figure. Orientation is summit statue versus bay and city below. Christ the Redeemer’s primer is hillside colossus — Rio’s defining silhouette of faith and geography fused on a rainforest peak.',
    facts: {
      kind: 'Landmark',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Corcovado · Rio de Janeiro',
      role: 'Iconic hillside statue and city symbol',
      knownFor: 'Open-armed silhouette above Rio’s bay and peaks',
    },
    features: [
      {
        name: 'Summit statue',
        description:
          'The Art Deco figure with outstretched arms on Corcovado.',
      },
      {
        name: 'Bay overlook',
        description:
          'Views across Guanabara Bay and Rio’s mountain bowl.',
      },
      {
        name: 'Forest approach',
        description:
          'Tijuca rainforest routes climbing to the platform.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Christ the Redeemer',
        url: 'https://www.britannica.com/topic/Christ-the-Redeemer',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'burj-khalifa',
    code: 'BUR',
    name: 'Burj Khalifa',
    kind: 'Landmark',
    countrySlug: 'united-arab-emirates',
    subtitle: 'Landmark · United Arab Emirates',
    matchNames: ['Burj Khalifa'],
    about:
      'Burj Khalifa rises above downtown Dubai as the world’s tallest building, a Y-shaped skyscraper of setbacks and a tapering spire over a lake and fountain plaza. Observation decks open views across desert and Gulf; the tower organizes Dubai’s modern skyline. Glass and steel catch desert light from base to tip. Orientation is tower, downtown lake, and surrounding high-rise field. Burj Khalifa’s primer is desert megatower — vertical ambition that made Dubai’s silhouette globally recognizable.',
    facts: {
      kind: 'Landmark',
      country: 'United Arab Emirates',
      region: 'Asia',
      setting: 'Downtown Dubai · desert coast metropolis',
      role: 'World’s tallest building and skyline landmark',
      knownFor: 'Tapering spire, setbacks, and downtown plaza',
    },
    features: [
      {
        name: 'Tapering spire',
        description:
          'The stepped tower form culminating in a needle tip.',
      },
      {
        name: 'Downtown plaza',
        description:
          'Lake and fountain spaces at the tower’s base.',
      },
      {
        name: 'Skyline field',
        description:
          'Surrounding towers that the Burj still dominates.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Burj Khalifa',
        url: 'https://www.britannica.com/topic/Burj-Khalifa',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'antelope-canyon',
    code: 'ANT',
    name: 'Antelope Canyon',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Antelope Canyon'],
    about:
      'Antelope Canyon is a slot canyon of Navajo Sandstone near Page, Arizona, where narrow corridors glow orange and purple as light filters from above. Upper and Lower sections offer different passages; Navajo Nation guides manage access. Flash-flood risk shapes when visits happen. Orientation is the narrow slot floor versus beam shafts from the rim. Antelope Canyon’s primer is glowing slot canyon — sculpted desert rock where light itself becomes the spectacle.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Navajo Nation · northern Arizona',
      role: 'Famous sandstone slot canyon',
      knownFor: 'Curved walls, light beams, and narrow corridors',
    },
    features: [
      {
        name: 'Slot corridors',
        description:
          'Narrow passages carved through layered Navajo Sandstone.',
      },
      {
        name: 'Light beams',
        description:
          'Shafts of sun that illuminate the canyon’s orange walls.',
      },
      {
        name: 'Upper and Lower',
        description:
          'Two main sections with distinct walking experiences.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Antelope Canyon',
        url: 'https://www.britannica.com/place/Antelope-Canyon',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'table-mountain',
    code: 'TBL',
    name: 'Table Mountain',
    kind: 'Landmark',
    countrySlug: 'south-africa',
    subtitle: 'Landmark · South Africa',
    matchNames: ['Table Mountain'],
    about:
      'Table Mountain is the flat-topped sandstone massif rising behind Cape Town, often capped by a “tablecloth” of cloud spilling over its cliffs. Cableway and hiking routes reach the plateau; fynbos vegetation covers the summit. The mountain anchors the city’s identity from every shoreline angle. Orientation is plateau top versus city bowl and Atlantic edges. Table Mountain’s primer is flat-topped Cape sentinel — a mesa-like landmark that makes Cape Town’s setting unmistakable.',
    facts: {
      kind: 'Landmark',
      country: 'South Africa',
      region: 'Africa',
      setting: 'Cape Peninsula · Cape Town backdrop',
      role: 'Iconic flat-topped mountain above Cape Town',
      knownFor: 'Flat summit, cloud tablecloth, and cableway',
    },
    features: [
      {
        name: 'Flat summit',
        description:
          'The plateau top that gives the mountain its name.',
      },
      {
        name: 'Cloud tablecloth',
        description:
          'Orographic cloud that spills over the cliffs in certain winds.',
      },
      {
        name: 'City bowl views',
        description:
          'Overlooks of Cape Town, harbors, and Atlantic shores.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Table Mountain',
        url: 'https://www.britannica.com/place/Table-Mountain-mountain-South-Africa',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Cape Floral Region Protected Areas',
        url: 'https://whc.unesco.org/en/list/1007/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mount-cook',
    code: 'AOR',
    name: 'Aoraki / Mount Cook',
    kind: 'Landmark',
    countrySlug: 'new-zealand',
    subtitle: 'Landmark · New Zealand',
    matchNames: ['Mount Cook', 'Aoraki', 'Aoraki / Mount Cook'],
    about:
      'Aoraki / Mount Cook is New Zealand’s highest peak, a glaciated summit in the Southern Alps above a valley of turquoise lakes and braided rivers. The mountain holds deep significance in Ngāi Tahu tradition; the national park protects ice, rock, and alpine flora. Hooker and Tasman valleys frame classic approaches. Orientation is summit massif versus glacier valleys. Aoraki’s primer is Southern Alps high point — ice and greywacke rising abruptly above South Island’s Mackenzie Country approaches.',
    facts: {
      kind: 'Landmark',
      country: 'New Zealand',
      region: 'Oceania',
      setting: 'Southern Alps · South Island',
      role: 'Highest New Zealand peak and national park centerpiece',
      knownFor: 'Glaciated summit, alpine valleys, and cultural significance',
    },
    features: [
      {
        name: 'Summit massif',
        description:
          'The ice-clad high point of the Southern Alps.',
      },
      {
        name: 'Glacier valleys',
        description:
          'Hooker and Tasman approaches of ice, rock, and lakes.',
      },
      {
        name: 'Alpine light',
        description:
          'Clear high-country skies that sharpen peak and glacier views.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Cook',
        url: 'https://www.britannica.com/place/Mount-Cook',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Te Wahipounamu – South West New Zealand',
        url: 'https://whc.unesco.org/en/list/551/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'ephesus',
    code: 'EPH',
    name: 'Ephesus',
    kind: 'Landmark',
    countrySlug: 'turkiye',
    subtitle: 'Landmark · Türkiye',
    matchNames: ['Ephesus'],
    about:
      'Ephesus is a major Greco-Roman archaeological city on Turkey’s Aegean side, famous for the Library of Celsus façade, marble Curetes Street, and a vast theater. Once a port, the site now sits inland as the coastline shifted. Terrace houses preserve frescoed domestic wealth. Orientation is library plaza versus theater and harbor street axis. Ephesus’s primer is excavated classical city — colonnades and public monuments that make Roman Asia Minor tangible in open air.',
    facts: {
      kind: 'Landmark',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Aegean Turkey · ancient harbor city',
      role: 'Major Greco-Roman archaeological site',
      knownFor: 'Library of Celsus, marble streets, and theater',
    },
    features: [
      {
        name: 'Library of Celsus',
        description:
          'The two-story façade that defines Ephesus’s visual fame.',
      },
      {
        name: 'Curetes Street',
        description:
          'A marble processional way lined with monuments.',
      },
      {
        name: 'Great Theatre',
        description:
          'A vast hillside auditorium facing the ancient harbor axis.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Ephesus',
        url: 'https://www.britannica.com/place/Ephesus',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Ephesus',
        url: 'https://whc.unesco.org/en/list/1018/',
        kind: 'authority',
      },
    ],
  },
]
