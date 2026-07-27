/** Tenth curated wave of Explore place guides. */

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

export const placeGuideDraftsBatch10: PlaceGuideDraftBatch[] = [
  {
    slug: 'charleston',
    code: 'CHS',
    name: 'Charleston',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Charleston'],
    about:
      'Charleston occupies a peninsula between the Ashley and Cooper rivers on South Carolina’s Lowcountry coast, a historic port city of pastel houses, church steeples, and barrier-island approaches. Cobblestone lanes and harbor forts recall colonial and Civil War layers; humid subtropical seasons shape outdoor life. Orientation is peninsula tip versus marsh edges and nearby sea islands. Charleston’s primer is Lowcountry harbor city — wrought-iron balconies, tidal creeks, and a steeple skyline above a warm Atlantic plain.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Ashley–Cooper peninsula · Lowcountry',
      role: 'Historic South Carolina port and tourism hub',
      knownFor: 'Historic district, harbor forts, and Lowcountry marshes',
    },
    features: [
      {
        name: 'Historic peninsula',
        description:
          'Pastel streets and church steeples on a tight river tip.',
      },
      {
        name: 'Harbor approaches',
        description:
          'Forts and channels guarding the Atlantic entrance.',
      },
      {
        name: 'Lowcountry marshes',
        description:
          'Tidal creeks and sea-island edges framing the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Charleston',
        url: 'https://www.britannica.com/place/Charleston-South-Carolina',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'salt-lake-city',
    code: 'SLC',
    name: 'Salt Lake City',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Salt Lake City'],
    about:
      'Salt Lake City sits at the foot of the Wasatch Range beside the Great Salt Lake, Utah’s capital on a high desert valley floor. Temple Square and a wide grid organize downtown; ski canyons open within sight of the skyline. Dry air and sharp seasons define outdoor calendars. Orientation is Wasatch wall versus lake plain and valley suburbs. Salt Lake City’s primer is Wasatch valley capital — mountain backdrop, temple core, and a high desert metropolis beside a saline inland sea.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Wasatch Front · Great Salt Lake valley',
      role: 'Utah capital and Wasatch metro hub',
      knownFor: 'Wasatch backdrop, Temple Square, and lake valley setting',
    },
    features: [
      {
        name: 'Wasatch wall',
        description:
          'Snow peaks rising abruptly above the eastern skyline.',
      },
      {
        name: 'Temple Square',
        description:
          'The religious and civic core of downtown Salt Lake.',
      },
      {
        name: 'Lake valley',
        description:
          'A high desert plain opening west toward the Great Salt Lake.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Salt Lake City',
        url: 'https://www.britannica.com/place/Salt-Lake-City',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'pittsburgh',
    code: 'PIT',
    name: 'Pittsburgh',
    kind: 'City',
    countrySlug: 'united-states',
    subtitle: 'City · United States',
    matchNames: ['Pittsburgh'],
    about:
      'Pittsburgh occupies the confluence of the Allegheny and Monongahela rivers where they form the Ohio, a hill-and-bridge city of steep neighborhoods and a rebuilt Golden Triangle skyline. Inclines climb Mount Washington; former mill valleys now hold universities and tech. Four seasons and river fog shape daily views. Orientation is Point State Park confluence versus surrounding ridges. Pittsburgh’s primer is three-river city — bridges, hills, and a post-industrial core at a classic Appalachian water junction.',
    facts: {
      kind: 'City',
      country: 'United States',
      region: 'Americas',
      setting: 'Ohio River headwaters · Appalachian hills',
      role: 'Western Pennsylvania hub and river confluence city',
      knownFor: 'Three rivers, bridges, and hilltop neighborhoods',
    },
    features: [
      {
        name: 'River confluence',
        description:
          'Allegheny and Monongahela meeting to form the Ohio.',
      },
      {
        name: 'Bridge network',
        description:
          'Dozens of spans linking hills and valley floors.',
      },
      {
        name: 'Mount Washington',
        description:
          'A ridge overlook above the Golden Triangle skyline.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Pittsburgh',
        url: 'https://www.britannica.com/place/Pittsburgh',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'calgary',
    code: 'YYC',
    name: 'Calgary',
    kind: 'City',
    countrySlug: 'canada',
    subtitle: 'City · Canada',
    matchNames: ['Calgary'],
    about:
      'Calgary sits on the Bow and Elbow rivers where prairie meets the Rocky Mountain foothills in southern Alberta. A glass skyline rises from a river valley; Stampede grounds and park pathways structure civic identity. Chinook winds and cold winters define the climate. Orientation is downtown Bow valley versus western foothill approaches. Calgary’s primer is prairie–foothill city — a modern energy hub living where flat grasslands tilt toward the Rockies.',
    facts: {
      kind: 'City',
      country: 'Canada',
      region: 'Americas',
      setting: 'Bow River · Rocky Mountain foothills',
      role: 'Alberta’s largest city and prairie–mountain hub',
      knownFor: 'Skyline, Bow River parks, and foothill setting',
    },
    features: [
      {
        name: 'Bow River valley',
        description:
          'A green corridor cutting through the downtown core.',
      },
      {
        name: 'Foothill west',
        description:
          'Rising ground toward the Rocky Mountain front.',
      },
      {
        name: 'Prairie east',
        description:
          'Open grassland plains framing the metro’s eastern edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Calgary',
        url: 'https://www.britannica.com/place/Calgary',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cartagena',
    code: 'CTG',
    name: 'Cartagena',
    kind: 'City',
    countrySlug: 'colombia',
    subtitle: 'City · Colombia',
    matchNames: ['Cartagena'],
    about:
      'Cartagena faces the Caribbean on Colombia’s northern coast as a walled colonial port of colorful streets, bastions, and offshore islands. The Getsemaní and Centro districts concentrate historic fabric; modern towers rise beyond the walls. Tropical heat and sea breezes define the year. Orientation is walled Old City versus Bocagrande and bay islands. Cartagena’s primer is Caribbean fortress city — coral-stone walls, balconies, and a harbor that once guarded Spanish treasure routes.',
    facts: {
      kind: 'City',
      country: 'Colombia',
      region: 'Americas',
      setting: 'Caribbean coast · walled harbor',
      role: 'Historic Colombian Caribbean port',
      knownFor: 'Colonial walls, colorful streets, and bay islands',
    },
    features: [
      {
        name: 'Walled Old City',
        description:
          'Bastions and streets of the colonial core.',
      },
      {
        name: 'Caribbean bay',
        description:
          'Harbor waters and island approaches off the walls.',
      },
      {
        name: 'Getsemaní',
        description:
          'A dense historic neighborhood beside the Centro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cartagena',
        url: 'https://www.britannica.com/place/Cartagena-Colombia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Port, Fortresses and Group of Monuments, Cartagena',
        url: 'https://whc.unesco.org/en/list/285/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'recife',
    code: 'REC',
    name: 'Recife',
    kind: 'City',
    countrySlug: 'brazil',
    subtitle: 'City · Brazil',
    matchNames: ['Recife'],
    about:
      'Recife occupies river mouths and reef-lined Atlantic shores in Brazil’s Northeast, a tropical metropolis of bridges, colonial Olinda nearby, and a modern coastal skyline. Mangroves and canals lace the urban fabric; Carnival and beach culture animate the calendar. Orientation is reef coast versus river islands and inland sprawl. Recife’s primer is Northeast Brazilian port — bridges over tidal channels and an Atlantic front shaped by natural reefs.',
    facts: {
      kind: 'City',
      country: 'Brazil',
      region: 'Americas',
      setting: 'Atlantic Northeast · reef and river mouths',
      role: 'Major Northeast Brazilian metropolis',
      knownFor: 'Bridges, reef coast, and nearby Olinda hills',
    },
    features: [
      {
        name: 'Reef coast',
        description:
          'Natural offshore reefs that named and sheltered the port.',
      },
      {
        name: 'River channels',
        description:
          'Bridges linking islands and mainland districts.',
      },
      {
        name: 'Coastal skyline',
        description:
          'Modern towers along Recife’s Atlantic front.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Recife',
        url: 'https://www.britannica.com/place/Recife',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'belgrade',
    code: 'BEG',
    name: 'Belgrade',
    kind: 'City',
    countrySlug: 'serbia',
    subtitle: 'City · Serbia',
    matchNames: ['Belgrade'],
    about:
      'Belgrade stands at the confluence of the Sava and Danube as Serbia’s capital, a Balkan crossroads city of fortress ridges, riverside promenades, and a layered twentieth-century skyline. Kalemegdan overlooks the rivers; café districts fill older streets. Continental seasons shape outdoor life. Orientation is fortress confluence versus New Belgrade across the Sava. Belgrade’s primer is river-junction capital — a hilltop fortress city where two major European rivers meet.',
    facts: {
      kind: 'City',
      country: 'Serbia',
      region: 'Europe',
      setting: 'Sava–Danube confluence',
      role: 'Serbian capital and Balkan river hub',
      knownFor: 'Kalemegdan fortress, river confluence, and riverside life',
    },
    features: [
      {
        name: 'Kalemegdan',
        description:
          'The fortress ridge above the river junction.',
      },
      {
        name: 'Sava–Danube meeting',
        description:
          'Two major rivers defining the city’s geography.',
      },
      {
        name: 'New Belgrade',
        description:
          'Planned districts across the Sava from the old core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Belgrade',
        url: 'https://www.britannica.com/place/Belgrade',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'sofia',
    code: 'SOF',
    name: 'Sofia',
    kind: 'City',
    countrySlug: 'bulgaria',
    subtitle: 'City · Bulgaria',
    matchNames: ['Sofia'],
    about:
      'Sofia occupies a high plain beneath Vitosha Mountain as Bulgaria’s capital, a Balkan city of Orthodox domes, mineral springs, and Soviet-era boulevards. Alexander Nevsky Cathedral anchors the monumental center; mountain trails begin at the metro’s edge. Cold winters and warm summers frame the year. Orientation is Vitosha backdrop versus the central square grid. Sofia’s primer is mountain-foot capital — a highland Balkan metropolis living under a near city peak.',
    facts: {
      kind: 'City',
      country: 'Bulgaria',
      region: 'Europe',
      setting: 'Sofia plain · Vitosha Mountain',
      role: 'Bulgarian capital and Balkan highland hub',
      knownFor: 'Vitosha backdrop, Orthodox landmarks, and highland plain',
    },
    features: [
      {
        name: 'Vitosha Mountain',
        description:
          'A near-city massif framing the southern skyline.',
      },
      {
        name: 'Monumental center',
        description:
          'Cathedral and civic axes of central Sofia.',
      },
      {
        name: 'Highland plain',
        description:
          'An elevated basin setting uncommon among Balkan capitals.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sofia',
        url: 'https://www.britannica.com/place/Sofia',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hyderabad',
    code: 'HYD',
    name: 'Hyderabad',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Hyderabad'],
    about:
      'Hyderabad straddles the Musi River on the Deccan Plateau as a South Indian metropolis of Charminar stone, Hussain Sagar lake, and expanding tech corridors. Qutb Shahi and Nizam-era layers meet Cyberabad campuses. Hot summers and monsoon rains shape the year. Orientation is Old City Charminar versus Secunderabad and western IT belts. Hyderabad’s primer is Deccan twin-city — historic Islamic architecture and lake shores beside a modern technology sprawl.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Deccan Plateau · Musi River',
      role: 'Major South Indian tech and historic metropolis',
      knownFor: 'Charminar, Hussain Sagar, and tech corridors',
    },
    features: [
      {
        name: 'Charminar Old City',
        description:
          'The four-minaret landmark organizing historic Hyderabad.',
      },
      {
        name: 'Hussain Sagar',
        description:
          'A central lake between Hyderabad and Secunderabad.',
      },
      {
        name: 'Tech corridors',
        description:
          'Western campuses driving contemporary growth.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hyderabad',
        url: 'https://www.britannica.com/place/Hyderabad-India',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'jaipur',
    code: 'JAI',
    name: 'Jaipur',
    kind: 'City',
    countrySlug: 'india',
    subtitle: 'City · India',
    matchNames: ['Jaipur'],
    about:
      'Jaipur occupies the arid eastern Rajasthan plain as the Pink City, a planned eighteenth-century capital of bazaars, palace courtyards, and hill forts. Hawa Mahal’s façade and Amber Fort’s ridge define classic views; hot dry seasons dominate. Orientation is walled Pink City versus Amber hills and modern extensions. Jaipur’s primer is Rajasthani planned city — rose-washed streets and fort ridges on the desert state’s gateway plain.',
    facts: {
      kind: 'City',
      country: 'India',
      region: 'Asia',
      setting: 'Eastern Rajasthan plain · Aravalli edge',
      role: 'Rajasthan capital and Pink City tourism hub',
      knownFor: 'Pink City streets, Hawa Mahal, and Amber Fort',
    },
    features: [
      {
        name: 'Pink City',
        description:
          'The planned walled core of rose-washed façades.',
      },
      {
        name: 'Amber ridge',
        description:
          'Hill forts overlooking the older capital approaches.',
      },
      {
        name: 'Palace courts',
        description:
          'Royal complexes organizing historic civic geography.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Jaipur',
        url: 'https://www.britannica.com/place/Jaipur-India',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Jaipur City, Rajasthan',
        url: 'https://whc.unesco.org/en/list/1605/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'sapporo',
    code: 'SPK',
    name: 'Sapporo',
    kind: 'City',
    countrySlug: 'japan',
    subtitle: 'City · Japan',
    matchNames: ['Sapporo'],
    about:
      'Sapporo occupies the Ishikari Plain on Hokkaido as the island’s largest city, a grid-planned northern metropolis of parks, winter snow, and nearby ski mountains. Odori Park cuts a green belt through downtown; beer halls and seafood markets mark local culture. Cold, snowy winters define the calendar. Orientation is Odori axis versus Toyohira River and surrounding hills. Sapporo’s primer is Hokkaido capital — a snow-city grid on Japan’s northern main island.',
    facts: {
      kind: 'City',
      country: 'Japan',
      region: 'Asia',
      setting: 'Ishikari Plain · Hokkaido',
      role: 'Hokkaido’s principal city and winter hub',
      knownFor: 'Odori Park, heavy snow, and northern grid plan',
    },
    features: [
      {
        name: 'Odori Park',
        description:
          'A long green belt dividing the downtown grid.',
      },
      {
        name: 'Snow city',
        description:
          'Heavy winter snowfall shaping streets and festivals.',
      },
      {
        name: 'Ishikari plain',
        description:
          'A broad northern basin holding the metro.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Sapporo',
        url: 'https://www.britannica.com/place/Sapporo',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'antwerp',
    code: 'ANR',
    name: 'Antwerp',
    kind: 'City',
    countrySlug: 'belgium',
    subtitle: 'City · Belgium',
    matchNames: ['Antwerp'],
    about:
      'Antwerp sits on the Scheldt River as Belgium’s great port and diamond-trade city, a Flemish metropolis of Gothic cathedral spires, guildhalls, and modern docklands. The historic center clusters by the Grote Markt; river locks open to North Sea approaches. Orientation is cathedral core versus Scheldt docks. Antwerp’s primer is Scheldt port city — medieval steeples and working water at Flanders’ commercial gateway.',
    facts: {
      kind: 'City',
      country: 'Belgium',
      region: 'Europe',
      setting: 'Scheldt River · Flemish coast approaches',
      role: 'Major Belgian port and Flemish commercial hub',
      knownFor: 'Cathedral spire, Scheldt docks, and historic Grote Markt',
    },
    features: [
      {
        name: 'Cathedral spire',
        description:
          'The Gothic tower dominating the historic skyline.',
      },
      {
        name: 'Scheldt waterfront',
        description:
          'River docks linking Antwerp to the North Sea.',
      },
      {
        name: 'Grote Markt',
        description:
          'Guildhall square at the medieval commercial heart.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Antwerp',
        url: 'https://www.britannica.com/place/Antwerp-Belgium',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'manitoba',
    code: 'MB',
    name: 'Manitoba',
    kind: 'State',
    countrySlug: 'canada',
    subtitle: 'State · Canada',
    matchNames: ['Manitoba'],
    about:
      'Manitoba stretches from prairie farmland to boreal forest and Hudson Bay shores in central Canada, a province of lakes, long winters, and Winnipeg as its urban core. Lake Winnipeg and countless smaller lakes dominate the map; polar approaches mark the far north. Orientation is prairie south versus shield lakes and subarctic coast. Manitoba’s primer is lake-and-prairie province — a continental interior of frozen winters and vast freshwater country.',
    facts: {
      kind: 'State',
      country: 'Canada',
      region: 'Americas',
      setting: 'Prairie to Hudson Bay · central Canada',
      role: 'Central Canadian prairie and lake province',
      knownFor: 'Lake Winnipeg, prairies, and boreal north',
    },
    features: [
      {
        name: 'Prairie south',
        description:
          'Farmland and Winnipeg’s metro on the open plains.',
      },
      {
        name: 'Lake country',
        description:
          'Lake Winnipeg and countless shield lakes.',
      },
      {
        name: 'Hudson Bay north',
        description:
          'Subarctic shores at the province’s far edge.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Manitoba',
        url: 'https://www.britannica.com/place/Manitoba',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'north-carolina',
    code: 'NC',
    name: 'North Carolina',
    kind: 'State',
    countrySlug: 'united-states',
    subtitle: 'State · United States',
    matchNames: ['North Carolina'],
    about:
      'North Carolina runs from Blue Ridge and Great Smoky mountains to Outer Banks barrier islands, a southeastern U.S. state of Piedmont cities, coastal sounds, and tobacco-pine plains. Research Triangle and Charlotte organize the interior; Cape Hatteras marks the ocean edge. Humid subtropical seasons shape life. Orientation is mountains versus Piedmont and tidewater coast. North Carolina’s primer is East Coast transect — Appalachian heights, Piedmont metros, and a long Atlantic barrier shore.',
    facts: {
      kind: 'State',
      country: 'United States',
      region: 'Americas',
      setting: 'Blue Ridge to Outer Banks',
      role: 'Southeastern U.S. state of mountains and barrier islands',
      knownFor: 'Blue Ridge, Piedmont cities, and Outer Banks',
    },
    features: [
      {
        name: 'Blue Ridge west',
        description:
          'Mountain ridges and Smoky approaches.',
      },
      {
        name: 'Piedmont core',
        description:
          'Charlotte, Triangle, and rolling interior cities.',
      },
      {
        name: 'Outer Banks',
        description:
          'Barrier islands and Cape Hatteras on the Atlantic.',
      },
    ],
    sources: [
      {
        label: 'Britannica — North Carolina',
        url: 'https://www.britannica.com/place/North-Carolina-state',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tamil-nadu',
    code: 'TN',
    name: 'Tamil Nadu',
    kind: 'State',
    countrySlug: 'india',
    subtitle: 'State · India',
    matchNames: ['Tamil Nadu'],
    about:
      'Tamil Nadu occupies India’s southeastern tip as a Dravidian cultural heartland of temple cities, Coromandel Coast ports, and the Western Ghats’ eastern slopes. Chennai anchors the coast; Madurai and Thanjavur hold great temple complexes. Hot plains and monsoon seasons define the year. Orientation is Coromandel coast versus Cauvery delta and Ghats edge. Tamil Nadu’s primer is temple-state geography — stone gopurams, rice deltas, and a long Bay of Bengal shore.',
    facts: {
      kind: 'State',
      country: 'India',
      region: 'Asia',
      setting: 'Southeast India · Coromandel Coast',
      role: 'Major South Indian state and cultural heartland',
      knownFor: 'Temple cities, Coromandel Coast, and Cauvery delta',
    },
    features: [
      {
        name: 'Temple cities',
        description:
          'Madurai, Thanjavur, and other gopuram centers.',
      },
      {
        name: 'Coromandel Coast',
        description:
          'Bay of Bengal ports including Chennai’s metro.',
      },
      {
        name: 'Cauvery delta',
        description:
          'Rice lands feeding the state’s agricultural core.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tamil Nadu',
        url: 'https://www.britannica.com/place/Tamil-Nadu',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'hydra',
    code: 'HYR',
    name: 'Hydra',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Hydra'],
    about:
      'Hydra is a small Saronic island of stone mansions and a car-free harbor amphitheater south of Athens. Donkeys and water taxis replace vehicles; pine hills rise behind pastel waterfront houses. Dry Aegean summers concentrate tourism. Orientation is horseshoe harbor versus rocky coastal paths. Hydra’s primer is Saronic harbor island — a steep, elegant port amphitheater without cars, close to the Attic mainland.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Saronic Gulf · near Attica',
      role: 'Car-free Saronic holiday and historic island',
      knownFor: 'Harbor amphitheater, stone mansions, and car-free streets',
    },
    features: [
      {
        name: 'Harbor amphitheater',
        description:
          'Stone houses rising in a horseshoe above the port.',
      },
      {
        name: 'Car-free streets',
        description:
          'Donkey paths and stairs instead of vehicle roads.',
      },
      {
        name: 'Saronic setting',
        description:
          'A short sea approach from the Attic mainland.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hydra',
        url: 'https://www.britannica.com/place/Hydra-island-Greece',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lefkada',
    code: 'LEF',
    name: 'Lefkada',
    kind: 'Island',
    countrySlug: 'greece',
    subtitle: 'Island · Greece',
    matchNames: ['Lefkada', 'Lefkas'],
    about:
      'Lefkada is an Ionian island nearly joined to the mainland by a causeway, known for west-coast cliffs, turquoise beaches, and a lagoon-side main town. Porto Katsiki and Egremni concentrate beach fame; olive hills fill the interior. Orientation is cliff-backed west versus lagoon and causeway approaches on the east. Lefkada’s primer is Ionian beach island — white scarps and turquoise water on a nearly connected western Greek isle.',
    facts: {
      kind: 'Island',
      country: 'Greece',
      region: 'Europe',
      setting: 'Ionian Islands · western Greece',
      role: 'Scenic Ionian beach and cliff island',
      knownFor: 'West-coast beaches, cliffs, and lagoon town',
    },
    features: [
      {
        name: 'Western cliffs',
        description:
          'Steep Ionian scarps above turquoise coves.',
      },
      {
        name: 'Lagoon town',
        description:
          'The main settlement beside shallow eastern waters.',
      },
      {
        name: 'Mainland link',
        description:
          'A causeway nearly joining Lefkada to Greece proper.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Leucas',
        url: 'https://www.britannica.com/place/Leucas',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lanzarote',
    code: 'ACE',
    name: 'Lanzarote',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Lanzarote'],
    about:
      'Lanzarote is an eastern Canary Island of black volcanic fields, lava tubes, and wind-shaped vineyards in the Atlantic off Africa. Timanfaya’s fire mountains define the interior; whitewashed villages contrast dark malpaís. Dry subtropical trade winds shape the climate. Orientation is Timanfaya park versus coastal resorts. Lanzarote’s primer is volcanic Canary isle — lava landscapes and César Manrique–shaped tourism on Spain’s arid Atlantic frontier.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Canary Islands · eastern Atlantic',
      role: 'Volcanic Canary tourist island',
      knownFor: 'Timanfaya lava fields, malpaís, and white villages',
    },
    features: [
      {
        name: 'Timanfaya',
        description:
          'Fire-mountain volcanic park in the island’s core.',
      },
      {
        name: 'Malpaís fields',
        description:
          'Black lava landscapes of recent eruptions.',
      },
      {
        name: 'Wind vineyards',
        description:
          'Protected vines grown in volcanic ash hollows.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lanzarote',
        url: 'https://www.britannica.com/place/Lanzarote',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'fuerteventura',
    code: 'FUE',
    name: 'Fuerteventura',
    kind: 'Island',
    countrySlug: 'spain',
    subtitle: 'Island · Spain',
    matchNames: ['Fuerteventura'],
    about:
      'Fuerteventura is a long, arid Canary Island of pale dunes, endless beaches, and trade-wind surfing coasts east of Lanzarote. Corralejo’s sand seas recall Saharan light; volcanic ridges stay low compared with Tenerife. Orientation is dune north versus southern beaches and inland plains. Fuerteventura’s primer is desert-beach Canary — wind, sand, and a sparse volcanic spine on Spain’s dry Atlantic edge.',
    facts: {
      kind: 'Island',
      country: 'Spain',
      region: 'Europe',
      setting: 'Canary Islands · arid Atlantic',
      role: 'Beach and wind-sports Canary island',
      knownFor: 'Corralejo dunes, long beaches, and trade winds',
    },
    features: [
      {
        name: 'Corralejo dunes',
        description:
          'Pale sand seas in the island’s north.',
      },
      {
        name: 'Long beaches',
        description:
          'Extended Atlantic shores suited to wind sports.',
      },
      {
        name: 'Arid plains',
        description:
          'Low volcanic interior under dry trade winds.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Fuerteventura',
        url: 'https://www.britannica.com/place/Fuerteventura',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'isle-of-wight',
    code: 'IOW',
    name: 'Isle of Wight',
    kind: 'Island',
    countrySlug: 'united-kingdom',
    subtitle: 'Island · United Kingdom',
    matchNames: ['Isle of Wight'],
    about:
      'The Isle of Wight lies in the English Channel off Hampshire as a diamond-shaped island of chalk cliffs, Victorian resorts, and sheltered Solent shores. The Needles stacks mark the west; Cowes anchors sailing culture. Mild maritime weather supports year-round visits. Orientation is Needles west versus Solent north and Channel south. The Isle of Wight’s primer is Channel island England — chalk stacks, ferry approaches, and a compact coastal landscape south of the mainland.',
    facts: {
      kind: 'Island',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'English Channel · off Hampshire',
      role: 'English Channel holiday and sailing island',
      knownFor: 'The Needles, Solent shores, and chalk cliffs',
    },
    features: [
      {
        name: 'The Needles',
        description:
          'Chalk stacks at the island’s western tip.',
      },
      {
        name: 'Solent shore',
        description:
          'Sheltered northern waters facing the mainland.',
      },
      {
        name: 'Channel cliffs',
        description:
          'Southern coastal scenery open to the open Channel.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Isle of Wight',
        url: 'https://www.britannica.com/place/Isle-of-Wight',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'tobago',
    code: 'TBG',
    name: 'Tobago',
    kind: 'Island',
    countrySlug: 'trinidad-and-tobago',
    subtitle: 'Island · Trinidad and Tobago',
    matchNames: ['Tobago'],
    about:
      'Tobago is the smaller, quieter sister island of Trinidad and Tobago, a Caribbean land of reefs, rainforest ridges, and fishing villages northeast of Trinidad. Pigeon Point and Speyside mark classic coasts; Main Ridge holds protected forest. Tropical wet and dry seasons shape travel. Orientation is southwest beaches versus windward Atlantic and the forested spine. Tobago’s primer is reef-and-ridge Caribbean — a compact sister island of clear water and green hills under the dual-island republic.',
    facts: {
      kind: 'Island',
      country: 'Trinidad and Tobago',
      region: 'Americas',
      setting: 'Southern Caribbean · northeast of Trinidad',
      role: 'Quieter sister island of the dual-island republic',
      knownFor: 'Reefs, Main Ridge forest, and beach villages',
    },
    features: [
      {
        name: 'Southwest beaches',
        description:
          'Calm Caribbean sands including Pigeon Point approaches.',
      },
      {
        name: 'Main Ridge',
        description:
          'A forested spine of protected rainforest.',
      },
      {
        name: 'Windward coast',
        description:
          'Atlantic-facing shores and reef diving sites.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Tobago',
        url: 'https://www.britannica.com/place/Tobago',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'alsace',
    code: 'ALS',
    name: 'Alsace',
    kind: 'Region',
    countrySlug: 'france',
    subtitle: 'Region · France',
    matchNames: ['Alsace'],
    about:
      'Alsace occupies France’s Rhine frontier as a wine-and-village region of half-timbered towns, vineyard foothills, and bilingual cultural layers. The Route des Vins links hill villages; Strasbourg and Colmar organize urban Alsace. Cool continental seasons shape harvests. Orientation is Vosges slopes versus Rhine plain. Alsace’s primer is Rhine-border wine country — timbered streets and Riesling coteaux along France’s eastern edge.',
    facts: {
      kind: 'Region',
      country: 'France',
      region: 'Europe',
      setting: 'Rhine frontier · Vosges foothills',
      role: 'Historic wine and border region',
      knownFor: 'Wine route villages, half-timbered towns, and Vosges slopes',
    },
    features: [
      {
        name: 'Wine route',
        description:
          'Village-to-village vineyard foothills of the coteaux.',
      },
      {
        name: 'Timbered towns',
        description:
          'Half-timbered streets of Colmar and similar centers.',
      },
      {
        name: 'Rhine plain',
        description:
          'The low frontier corridor toward Germany.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Alsace',
        url: 'https://www.britannica.com/place/Alsace',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'cinque-terre',
    code: 'CIN',
    name: 'Cinque Terre',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Cinque Terre'],
    about:
      'Cinque Terre is a Ligurian coastal stretch of five cliff villages linked by trails, rail tunnels, and terraced vineyards above the Mediterranean. Manarola and Vernazza concentrate postcard views; hiking paths stitch the terraces. Orientation is five harbor villages versus inland ridge trails. Cinque Terre’s primer is Ligurian cliff villages — colored houses on steep terraces above a rugged Italian Riviera shore.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Ligurian coast · Italian Riviera',
      role: 'UNESCO coastal village landscape',
      knownFor: 'Five cliff villages, terraces, and coastal trails',
    },
    features: [
      {
        name: 'Five villages',
        description:
          'Monterosso to Riomaggiore along the cliff coast.',
      },
      {
        name: 'Terraced vineyards',
        description:
          'Stone-walled slopes above the Mediterranean.',
      },
      {
        name: 'Coastal trails',
        description:
          'Footpaths linking harbors along the scarp.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Cinque Terre',
        url: 'https://www.britannica.com/place/Cinque-Terre',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Portovenere, Cinque Terre, and the Islands',
        url: 'https://whc.unesco.org/en/list/826/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'lake-garda',
    code: 'GAR',
    name: 'Lake Garda',
    kind: 'Region',
    countrySlug: 'italy',
    subtitle: 'Region · Italy',
    matchNames: ['Lake Garda', 'Lago di Garda'],
    about:
      'Lake Garda is Italy’s largest lake, a glacial basin between the Alps and the Po plain with cliff-backed northern arms and gentler southern shores. Limone, Malcesine, and Sirmione mark classic towns; olive and lemon terraces climb the slopes. Orientation is Alpine north versus broad southern basin. Lake Garda’s primer is Alpine-foot lake — wind, limestone cliffs, and resort towns on Italy’s largest freshwater expanse.',
    facts: {
      kind: 'Region',
      country: 'Italy',
      region: 'Europe',
      setting: 'Alpine foot · northern Italy',
      role: 'Italy’s largest lake and resort region',
      knownFor: 'Cliff shores, resort towns, and Alpine backdrop',
    },
    features: [
      {
        name: 'Northern cliffs',
        description:
          'Steep Alpine arms of the upper lake.',
      },
      {
        name: 'Southern basin',
        description:
          'Broader, gentler shores toward the Po plain.',
      },
      {
        name: 'Lakeside towns',
        description:
          'Harbor villages and promontories around the shore.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lake Garda',
        url: 'https://www.britannica.com/place/Lake-Garda',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'lake-geneva',
    code: 'LGN',
    name: 'Lake Geneva',
    kind: 'Region',
    countrySlug: 'switzerland',
    subtitle: 'Region · Switzerland',
    matchNames: ['Lake Geneva', 'Lac Léman'],
    about:
      'Lake Geneva (Lac Léman) is a crescent Alpine lake shared by Switzerland and France, with Geneva at the Rhône outlet and Lavaux vineyards along the north shore. Alpine peaks frame the south; steamer routes link lakeside towns. Orientation is Geneva west versus upper lake toward Montreux. Lake Geneva’s primer is Alpine crescent lake — vine terraces, steamer wakes, and a shared Franco-Swiss water body at the Rhône’s head.',
    facts: {
      kind: 'Region',
      country: 'Switzerland',
      region: 'Europe',
      setting: 'Alpine crescent · Rhône outlet',
      role: 'Major Alpine lake shared with France',
      knownFor: 'Lavaux vineyards, Alpine backdrop, and lakeside cities',
    },
    features: [
      {
        name: 'Lavaux terraces',
        description:
          'UNESCO vineyard slopes along the Swiss north shore.',
      },
      {
        name: 'Geneva outlet',
        description:
          'The Rhône exit at the lake’s western tip.',
      },
      {
        name: 'Alpine south',
        description:
          'French and Swiss peaks framing the crescent.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Lake Geneva',
        url: 'https://www.britannica.com/place/Lake-Geneva-lake-Europe',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'nullarbor',
    code: 'NUL',
    name: 'Nullarbor',
    kind: 'Region',
    countrySlug: 'australia',
    subtitle: 'Region · Australia',
    matchNames: ['Nullarbor', 'Nullarbor Plain'],
    about:
      'The Nullarbor is a vast treeless limestone plain across southern Australia, famous for long straight highways, Bunda Cliffs above the Great Australian Bight, and extreme aridity. Roadhouses punctuate emptiness; caves pierce the karst. Orientation is Bight cliffs versus inland highway corridor. The Nullarbor’s primer is arid southern plain — a continental-scale empty limestone shelf between Western and South Australia.',
    facts: {
      kind: 'Region',
      country: 'Australia',
      region: 'Oceania',
      setting: 'Southern Australia · limestone plain',
      role: 'Iconic arid crossing and Bight cliff landscape',
      knownFor: 'Treeless plain, Bunda Cliffs, and long highway',
    },
    features: [
      {
        name: 'Bunda Cliffs',
        description:
          'Limestone scarps above the Great Australian Bight.',
      },
      {
        name: 'Treeless plain',
        description:
          'A vast arid limestone shelf with sparse scrub.',
      },
      {
        name: 'Highway corridor',
        description:
          'The long Eyre Highway crossing between states.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Nullarbor Plain',
        url: 'https://www.britannica.com/place/Nullarbor-Plain',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'acropolis',
    code: 'ACR',
    name: 'Acropolis of Athens',
    kind: 'Landmark',
    countrySlug: 'greece',
    subtitle: 'Landmark · Greece',
    matchNames: ['Acropolis of Athens', 'Acropolis', 'Parthenon'],
    about:
      'The Acropolis of Athens crowns a rocky citadel above the ancient and modern city as the emblematic sanctuary of classical Greece. The Parthenon, Propylaea, and Erechtheion organize the summit plateau; the theater slopes fall toward the city. Attic light and marble define every view. Orientation is summit temples versus Agora and city below. The Acropolis’s primer is classical citadel — marble temples on a limestone table rock above Athens.',
    facts: {
      kind: 'Landmark',
      country: 'Greece',
      region: 'Europe',
      setting: 'Athens citadel · Attica',
      role: 'UNESCO classical sanctuary and city icon',
      knownFor: 'Parthenon, Propylaea, and summit temple plateau',
    },
    features: [
      {
        name: 'Parthenon',
        description:
          'The great Doric temple dominating the summit.',
      },
      {
        name: 'Propylaea',
        description:
          'The monumental gateway to the sacred plateau.',
      },
      {
        name: 'Citadel rock',
        description:
          'The limestone table rising above central Athens.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Acropolis',
        url: 'https://www.britannica.com/place/Acropolis-citadel-Athens-Greece',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Acropolis, Athens',
        url: 'https://whc.unesco.org/en/list/404/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'leaning-tower',
    code: 'PIS',
    name: 'Leaning Tower of Pisa',
    kind: 'Landmark',
    countrySlug: 'italy',
    subtitle: 'Landmark · Italy',
    matchNames: ['Leaning Tower of Pisa', 'Tower of Pisa', 'Pisa'],
    about:
      'The Leaning Tower of Pisa stands on the Piazza dei Miracoli as a freestanding Romanesque campanile famous for its tilt on soft ground. White marble arcades wrap the cylinder; the cathedral and baptistery complete the field. Orientation is tower versus cathedral lawn on the miracle square. Pisa’s tower primer is tilted campanile — engineering accident turned global icon beside Tuscany’s great marble churchyard.',
    facts: {
      kind: 'Landmark',
      country: 'Italy',
      region: 'Europe',
      setting: 'Piazza dei Miracoli · Pisa',
      role: 'Romanesque campanile and UNESCO ensemble piece',
      knownFor: 'Tilted marble tower, arcades, and cathedral square',
    },
    features: [
      {
        name: 'Tilted campanile',
        description:
          'The freestanding bell tower’s famous lean.',
      },
      {
        name: 'Marble arcades',
        description:
          'Stacked Romanesque galleries wrapping the shaft.',
      },
      {
        name: 'Miracle square',
        description:
          'Cathedral, baptistery, and lawn framing the tower.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Leaning Tower of Pisa',
        url: 'https://www.britannica.com/topic/Leaning-Tower-of-Pisa',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Piazza del Duomo, Pisa',
        url: 'https://whc.unesco.org/en/list/395/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'buckingham-palace',
    code: 'BUC',
    name: 'Buckingham Palace',
    kind: 'Landmark',
    countrySlug: 'united-kingdom',
    subtitle: 'Landmark · United Kingdom',
    matchNames: ['Buckingham Palace'],
    about:
      'Buckingham Palace occupies the western end of London’s ceremonial axis as the principal royal residence and a monumental façade facing the Mall. Changing of the Guard and the Victoria Memorial organize public ritual space; gardens lie behind the palace block. Orientation is Mall approach versus palace forecourt. Buckingham Palace’s primer is royal London frontage — a ceremonial palace at the end of the capital’s processional spine.',
    facts: {
      kind: 'Landmark',
      country: 'United Kingdom',
      region: 'Europe',
      setting: 'Westminster · London ceremonial axis',
      role: 'Principal royal residence and ceremonial landmark',
      knownFor: 'East façade, Mall approach, and Changing of the Guard',
    },
    features: [
      {
        name: 'East façade',
        description:
          'The public front facing the Victoria Memorial.',
      },
      {
        name: 'The Mall',
        description:
          'The processional avenue approaching the palace.',
      },
      {
        name: 'Forecourt ritual',
        description:
          'Guard ceremonies on the palace forecourt.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Buckingham Palace',
        url: 'https://www.britannica.com/topic/Buckingham-Palace',
        kind: 'reference',
      },
    ],
  },
  {
    slug: 'mount-rushmore',
    code: 'RUS',
    name: 'Mount Rushmore',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Mount Rushmore'],
    about:
      'Mount Rushmore is a colossal presidential sculpture carved into the Black Hills of South Dakota, with Washington, Jefferson, Roosevelt, and Lincoln faces set in granite. Borglum’s project sits above forested hills and visitor approaches. Orientation is sculpted cliff versus Black Hills pine country. Mount Rushmore’s primer is carved mountain monument — monumental faces in granite above the northern Great Plains’ highland edge.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Black Hills · South Dakota',
      role: 'National memorial sculpture',
      knownFor: 'Four presidential faces carved in granite',
    },
    features: [
      {
        name: 'Sculpted faces',
        description:
          'The four presidential portraits in the cliff.',
      },
      {
        name: 'Black Hills setting',
        description:
          'Pine-covered highland around the memorial.',
      },
      {
        name: 'Viewing avenue',
        description:
          'Approaches and terraces framing the classic vista.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mount Rushmore National Memorial',
        url: 'https://www.britannica.com/place/Mount-Rushmore-National-Memorial',
        kind: 'reference',
      },
      {
        label: 'National Park Service — Mount Rushmore',
        url: 'https://www.nps.gov/moru/index.htm',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'mesa-verde',
    code: 'MEV',
    name: 'Mesa Verde',
    kind: 'Landmark',
    countrySlug: 'united-states',
    subtitle: 'Landmark · United States',
    matchNames: ['Mesa Verde', 'Cliff Palace'],
    about:
      'Mesa Verde is a high mesa landscape in southwestern Colorado famous for Ancestral Puebloan cliff dwellings sheltered in sandstone alcoves. Cliff Palace and related sites cling to canyon walls beneath the mesa top; piñon-juniper woodland covers the plateau. Orientation is mesa rim versus alcove dwellings. Mesa Verde’s primer is cliff-dwelling country — sandstone alcoves and ancestral architecture on a Colorado Plateau mesa.',
    facts: {
      kind: 'Landmark',
      country: 'United States',
      region: 'Americas',
      setting: 'Southwestern Colorado · mesa and canyon',
      role: 'UNESCO cliff-dwelling national park',
      knownFor: 'Cliff Palace, sandstone alcoves, and mesa-top sites',
    },
    features: [
      {
        name: 'Cliff Palace',
        description:
          'The largest and most famous alcove dwelling.',
      },
      {
        name: 'Sandstone alcoves',
        description:
          'Natural shelters holding masonry villages.',
      },
      {
        name: 'Mesa top',
        description:
          'Plateau sites and woodland above the canyons.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Mesa Verde National Park',
        url: 'https://www.britannica.com/place/Mesa-Verde-National-Park',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Mesa Verde National Park',
        url: 'https://whc.unesco.org/en/list/27/',
        kind: 'authority',
      },
    ],
  },
  {
    slug: 'hagia-sophia',
    code: 'HAG',
    name: 'Hagia Sophia',
    kind: 'Landmark',
    countrySlug: 'turkiye',
    subtitle: 'Landmark · Türkiye',
    matchNames: ['Hagia Sophia', 'Ayasofya'],
    about:
      'Hagia Sophia stands in historic Istanbul as a sixth-century domed masterpiece that has served as cathedral, mosque, and museum across successive empires. Justinian’s great dome and minarets define the skyline above Sultanahmet; mosaics and Islamic calligraphy share the interior. Orientation is dome and minarets versus the Hippodrome and Blue Mosque axis. Hagia Sophia’s primer is imperial dome — a layered sacred landmark at the heart of old Constantinople.',
    facts: {
      kind: 'Landmark',
      country: 'Türkiye',
      region: 'Asia',
      setting: 'Sultanahmet · historic Istanbul',
      role: 'Byzantine–Ottoman sacred landmark',
      knownFor: 'Great dome, minarets, and layered sacred history',
    },
    features: [
      {
        name: 'Great dome',
        description:
          'Justinian’s vast central dome of the nave.',
      },
      {
        name: 'Minarets',
        description:
          'Ottoman additions framing the Byzantine mass.',
      },
      {
        name: 'Sultanahmet setting',
        description:
          'The historic peninsula axis with neighboring monuments.',
      },
    ],
    sources: [
      {
        label: 'Britannica — Hagia Sophia',
        url: 'https://www.britannica.com/topic/Hagia-Sophia',
        kind: 'reference',
      },
      {
        label: 'UNESCO — Historic Areas of Istanbul',
        url: 'https://whc.unesco.org/en/list/356/',
        kind: 'authority',
      },
    ],
  },
]
